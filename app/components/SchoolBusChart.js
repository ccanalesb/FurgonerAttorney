import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { VictoryChart, 
    VictoryBar, 
    VictoryAxis, 
    VictoryLine, 
    VictoryZoomContainer, 
    VictoryBrushContainer,
    VictoryGroup,
    VictoryScatter,
    VictoryTheme } from "victory-native";
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';    

export default class SchoolBus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'first',
            x_data: [],
            y_data: [],
            z_data: [],
            tickValues: [],
            min: 0,
            max: 0,
            day: 'someday',
            days:[],
            suddenness: [
                { x: 1, y: 0, label:'Sunday'},
                { x: 2, y: 0, label: 'Monday'},
                { x: 3, y: 0, label: 'Tuesday'},
                { x: 4, y: 0, label: 'Wednesday'},
                { x: 5, y: 0, label: 'Thursday'},
                { x: 6, y: 0, label: 'Friday'},
                { x: 7, y: 0, label: 'Saturday'},
            ]
        };
    }
    formatTime(time_to_show){
        var t = new Date(time_to_show * 1000);
        var formatted = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
        return t
    }
    componentWillMount(){
        console.log("Montando componente")
        
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date();
        let day = days[d.getDay()];
        this.setState({day: day, days: days})
        var user = firebaseRef.auth().currentUser;
        let temp_x_data = this.state.x_data
        let temp_y_data = this.state.y_data
        let temp_z_data = this.state.z_data
        firebaseRef.database().ref('School_bus/' + user.photoURL + '/stadistic/this_week/'+day).once("value")
            .then((snapshot) => {
                snapshot.val().map((e,i) =>{
                    if(i == 0){
                        this.setState({ min: this.formatTime(e["timestamp"]) })
                    }
                    temp_x_data.push({ x: this.formatTime(e["timestamp"]) , y: parseInt(e["X"])})
                    temp_y_data.push({ x: this.formatTime(e["timestamp"]) , y: parseInt(e["Y"])})
                    temp_z_data.push({ x: this.formatTime(e["timestamp"]) , y: parseInt(e["Z"])})
                }
                )
            })
            .then(()=>{
                console.log(temp_x_data[temp_x_data.length-1]["x"])
                how_many = parseInt(temp_x_data.length / 6)
                tickValues = []
                for (let index = 0; index < temp_x_data.length; index++) {
                    
                    tickValues.push(temp_x_data[index]["x"])
                    index += how_many
                }
                this.setState({
                    x_data: temp_x_data,
                    y_data: temp_y_data,
                    z_data: temp_z_data,
                    max: temp_x_data[temp_x_data.length-1]["x"],
                    tickValues: tickValues
                })
                console.log(this.state)
            })
        // this.state.attorneys.map((e, i) =>
        //     <AttorneysCard key={i} attorney={e} type={this.props.attorney_status} />
        // )
    }
    componentDidMount(){
        this.get_suddenness()
    }
    get_suddenness(){
        var user = firebaseRef.auth().currentUser;
        firebaseRef.database().ref('School_bus/' + user.photoURL + '/stadistic/this_week').once("value")
            .then((snapshot) => {
                days = snapshot.val()
                let suddenness = this.state.suddenness
                for (const [index,value] of this.state.days.entries()) {                    
                    days[value].map((e,i)=>{
                        avg = (parseInt(e["X"]) + parseInt(e["Y"]) + parseInt(e["Z"]))/3
                        if (avg > 50){
                            points = suddenness[index].y
                            points = points + 1
                            suddenness[index].y = points
                        }
                    })
                }
                this.setState({ suddenness: suddenness })
            })
            console.log(this.state)
    }
    handlePress(){
        var user = firebaseRef.auth().currentUser;
        console.log(user)
        console.log(this.state)
    }
    handleZoom(domain) {
        this.setState({ selectedDomain: domain });
    }

    handleBrush(domain) {
        this.setState({ zoomDomain: domain });
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Card >
                        <Card.Header
                            title={"Comportamiento de manejo del día "+ this.state.day}
                        />
                        <Card.Body>
                            {this.state.x_data.length== 0 || this.state.y_data ==0 || this.state.x_data ==0? null :
                            <VictoryChart
                                padding={{ top: 10, left: 30, right: 30, bottom: 100 }}
                                width={350} height={320} 
                                scale={{ x: "time" }}
                                domain={{ y: [0, 100] }}
                                containerComponent={
                                    <VictoryZoomContainer responsive={false}
                                        zoomDimension="x"
                                        zoomDomain={this.state.zoomDomain}
                                        onZoomDomainChange={this.handleZoom.bind(this)}
                                    />}
                            >
                                <VictoryAxis
                                    scale={{ x: "time" }}
                                    label="Hora (HH:MM)"
                                />
                                <VictoryGroup
                                    colorScale={["red", "blue", "gold"]}
                                >
                                    <VictoryLine
                                        style={{
                                            data: { stroke: "tomato" }
                                        }}
                                        data={this.state.x_data}
                                    />
                                    <VictoryLine
                                        data={this.state.y_data}
                                    />
                                    <VictoryLine
                                        data={this.state.z_data}
                                    />
                                </VictoryGroup>
                            </VictoryChart>
                            }
                            <Text>
                                {"\n"}
                            </Text>
                            {this.state.x_data.length == 0 ? null :
                            <VictoryChart
                                padding={{ top: 0, left: 60, right: 60, bottom: 60 }}
                                width={320} height={90} 
                                scale={{ x: "time" }}
                                containerComponent={
                                    <VictoryBrushContainer responsive={false}
                                        brushDimension="x"
                                        brushDomain={this.state.selectedDomain}
                                        onBrushDomainChange={this.handleBrush.bind(this)}
                                    />
                                }
                            >
                                <VictoryAxis
                                    tickValues={this.state.tickValues}
                                    tickFormat={(x) => new Date(x).getFullYear()}
                                    label="Hora (HH:MM)"
                                />
                                <VictoryLine
                                    style={{
                                        data: { stroke: "blue" }
                                    }}
                                    data={this.state.x_data}
                                />
                            </VictoryChart>
                            }
                        </Card.Body>
                        <Card.Footer content="Este es el comportamiento de manejo del conductor en el dia actual" />
                    </Card>
                    <Card >
                        <Card.Header
                            title={"Brusquedad de manejo"}
                        />
                        <Card.Body>

                            {
                                this.state.suddenness.length == 0  ? null :
                                    <VictoryChart
                                        theme={VictoryTheme.material}
                                        domainPadding={{ x: 0 }}
                                        domain={{ x: [0.5, 7.5]}}
                                    >
                                        <VictoryBar
                                            categories={{
                                                x: ['L','M','MI','J','V','S','D']
                                            }}
                                            style={{ data: { fill: "#c43a31" } }}
                                            data={this.state.suddenness}
                                        />
                                    </VictoryChart>
                            }
 
                            {/* </VictoryChart> */}
                        </Card.Body>
                        <Card.Footer content="Este es un aproximado del comportamiento del conductor por día de la semana" />
                    </Card>
                    {/* <TouchableOpacity style={styles.buttonContainer} onPress={this.handlePress.bind(this)}>
                        <Text style={styles.buttonText}>
                            mostrar usuario
                    </Text>
                    </TouchableOpacity> */}
                </ScrollView>
                {/* <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{ color: '#FFF' }} /> */}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        width: 150,
        height: 250
    },
    title: {
        color: 'black',
        textAlign: 'center',
        marginTop: 10
    },
    input: {
        height: 40,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 20,
        color: 'black',
        paddingHorizontal: 10
    },
    formContainer: {
        padding: 20
    },
    buttonContainer: {
        backgroundColor: '#f1c40f',
        paddingVertical: 20
    },
    buttonRegisterContainer: {
        backgroundColor: '#FFB74D',
        paddingVertical: 5,
        zIndex: 2,
        marginTop: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '700'
    }
    
});


// class App extends Component {

//     render() {
//         const data = [
//             { quarter: 1, earnings: 13000 },
//             { quarter: 2, earnings: 16500 },
//             { quarter: 3, earnings: 14250 },
//             { quarter: 4, earnings: 19000 }
//         ];
//         return (
//             // <VictoryBar />
//             <VictoryChart
//                 domainPadding={20}
//             >
//                 <VictoryAxis
//                     // tickValues specifies both the number of ticks and where
//                     // they are placed on the axis
//                     tickValues={[1, 2, 3, 4]}
//                     tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
//                 />
//                 {/* <VictoryAxis
//                     dependentAxis
//                     // tickFormat specifies how ticks should be displayed
//                     tickFormat={(x) => (`$${x / 1000}k`)}
//                 /> */}
//                 <VictoryBar
//                     data={data}
//                     x="quarter"
//                     y="earnings"
//                 />
//             </VictoryChart>
//         );
//     }
// }

// export default App;