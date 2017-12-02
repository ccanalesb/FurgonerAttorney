import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { VictoryChart, 
    VictoryBar, 
    VictoryAxis, 
    VictoryLine, 
    VictoryZoomContainer, 
    VictoryBrushContainer,
    VictoryGroup,
    VictoryScatter } from "victory-native";


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
            max: 0
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

                    <VictoryChart 
                        // padding={{ top: 0, left: 50, right: 50, bottom: 10 }}
                        width={350} height={320} scale={{ x: "time" }}
                        domain={{ y: [0, 100] }}
                        containerComponent={
                            <VictoryZoomContainer responsive={false}
                                zoomDimension="x"
                                zoomDomain={this.state.zoomDomain}
                                onZoomDomainChange={this.handleZoom.bind(this)}
                            />}
                        // containerComponent={<VictoryZoomContainer zoomDomain={{ x: [this.state.min, this.state.max], y: [0, 200] }} />}
                        
                        // containerComponent={
                        //     <VictoryZoomContainer responsive={false}
                        //         zoomDimension="x"
                        //         zoomDomain={this.state.zoomDomain}
                        //         onZoomDomainChange={this.handleZoom.bind(this)}
                        //     />
                        // }
                    >
                        <VictoryAxis
                            scale={{ x: "time" }}
                            label="Hora (HH:MM)"
                            // tickValues specifies both the number of ticks and where
                            // they are placed on the axis
                            // tickValues={[1, 2, 3, 4]}
                            // tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
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
                    <Text>
                        {"\n"}
                    </Text>    
                    <VictoryChart
                        padding={{ top: 0, left: 30, right: 30, bottom: 30 }}
                        width={320} height={90} scale={{ x: "time" }}
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