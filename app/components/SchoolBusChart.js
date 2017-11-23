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
    VictoryGroup } from "victory-native";


export default class SchoolBus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'first',
            x_data: [],
            y_data: [],
            z_data: []
        };
    }
    formatTime(time_to_show){
        var t = new Date(time_to_show * 1000);
        var formatted = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
        return formatted
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
                    temp_x_data.push({ x: this.formatTime(e["timestamp"]) , y: parseInt(e["X"])})
                    temp_y_data.push({ x: this.formatTime(e["timestamp"]) , y: parseInt(e["Y"])})
                    temp_z_data.push({ x: this.formatTime(e["timestamp"]) , y: parseInt(e["Z"])})
                }
                )
            })
            .then(()=>{
                this.setState({
                    x_data: temp_x_data,
                    y_data: temp_y_data,
                    z_data: temp_z_data
                })
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

                    <VictoryChart width={350} height={300} scale={{ x: "time" }}
                        containerComponent={
                            <VictoryZoomContainer responsive={false}
                                zoomDimension="x"
                                zoomDomain={this.state.zoomDomain}
                                onZoomDomainChange={this.handleZoom.bind(this)}
                            />
                        }
                    >
                        <VictoryAxis
                            scale={{ x: "time" }}
                            // tickValues specifies both the number of ticks and where
                            // they are placed on the axis
                            // tickValues={[1, 2, 3, 4]}
                            // tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
                        />
                        {/* <VictoryAxis
                    dependentAxis
                    // tickFormat specifies how ticks should be displayed
                    tickFormat={(x) => (`$${x / 1000}k`)}
                /> */}
                        {/* <VictoryBar
                            data={data}
                            x="quarter"
                            y="earnings"
                        /> */}
                        <VictoryGroup
                            colorScale={["tomato", "orange", "gold"]}
                            >
                            <VictoryBar
                                style={{
                                    data: { stroke: "tomato" }
                                }}
                                data={this.state.x_data}
                            />
                            <VictoryBar
                                data={this.state.Y_data}
                            />
                            <VictoryBar
                                data={this.state.z_data}
                            />
                        </VictoryGroup>
                    </VictoryChart>
                    {/* <VictoryChart
                        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
                        width={350} height={90} scale={{ x: "time" }}
                        containerComponent={
                            <VictoryBrushContainer responsive={false}
                                brushDimension="x"
                                brushDomain={this.state.selectedDomain}
                                onBrushDomainChange={this.handleBrush.bind(this)}
                            />
                        }
                    >
                        <VictoryAxis
                            tickValues={[
                                new Date(1985, 1, 1),
                                new Date(1990, 1, 1),
                                new Date(1995, 1, 1),
                                new Date(2000, 1, 1),
                                new Date(2005, 1, 1),
                                new Date(2010, 1, 1)
                            ]}
                            tickFormat={(x) => new Date(x).getFullYear()}
                        />
                        <VictoryLine
                            style={{
                                data: { stroke: "tomato" }
                            }}
                            data={[
                                { x: new Date(1982, 1, 1), y: 125 },
                                { x: new Date(1987, 1, 1), y: 257 },
                                { x: new Date(1993, 1, 1), y: 345 },
                                { x: new Date(1997, 1, 1), y: 515 },
                                { x: new Date(2001, 1, 1), y: 132 },
                                { x: new Date(2005, 1, 1), y: 305 },
                                { x: new Date(2011, 1, 1), y: 270 },
                                { x: new Date(2015, 1, 1), y: 470 }
                            ]}
                        />
                    </VictoryChart> */}
                    <TouchableOpacity style={styles.buttonContainer} onPress={this.handlePress.bind(this)}>
                        <Text style={styles.buttonText}>
                            mostrar usuario
                    </Text>
                    </TouchableOpacity>
                </ScrollView>
                <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{ color: '#FFF' }} />
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