import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Button,
    TouchableOpacity,
    Text
} from 'react-native';
import MapView from 'react-native-maps'
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../services/firebase.js'

import uuid from 'react-native-uuid';
import { sha256 } from 'react-native-sha256';


const LATITUD_DELTA = 0.0922
const LONGITUDE_DELTA = 0.0421

export default class ShowMap extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            position: {
                latitude : 0,
                longitude : 0,
                latitudeDelta: 0,
                longitudeDelta : 0
            },
            regionPosition: {
                latitude : 0,
                longitude : 0,
                latitudeDelta: 0,
                longitudeDelta : 0
            },
            markerPosition:{
                latitude : 0,
                longitude : 0
            },
            school_busPosition: {
                latitude : 0,
                longitude : 0
            },
            house_position:{
                latitude : 0,
                longitude: 0,
                latitudeDelta: LATITUD_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            follow_marker : true,
            user : null
        };
    }
    // watchID : ?number = null
    
    checkSchoolBus() {
        var user = firebaseRef.auth().currentUser;
        sha256(user.email).then( user_hash => {
            firebaseRef.database().ref('Attorney/' + user_hash+'/school_bus').once("value")
            .then((snapshot) => {
                console.log("checking user data")
                let school_bus = snapshot.val()
                if (school_bus != null){
                    sha256(school_bus)
                    .then( school_bus_hash=> {
                        let status_search = "School_bus/"+school_bus_hash+"/attorneys/"+user_hash
                        var attorney_ref = firebaseRef.database().ref(status_search);
                        attorney_ref.once("value")
                        .then((attorney_snapshot)=>{
                            console.log("checking bus status")
                            if(attorney_snapshot.val().state=="ready"){
                                let search = "School_bus/"+school_bus_hash
                                var ref = firebaseRef.database().ref(search);
                                ref.on("value",(snapshot) => {
                                    if(snapshot.child("in_transit").val()){
                                        this.setState({
                                            school_busPosition: {
                                                ...this.state.school_busPosition,
                                                latitude : ( (snapshot.child("latitude").val() != null) ? snapshot.child("latitude").val() : 0 ),
                                                longitude : ( (snapshot.child("longitude").val() != null) ? snapshot.child("longitude").val() : 0 ),
                                            }
                                        })
                                        console.log(this.distance(
                                                    this.state.school_busPosition.latitude,
                                                    this.state.school_busPosition.longitude,
                                                    this.state.house_position.latitude,
                                                    this.state.house_position.longitude))
                                    }
                                })
                            }
                            else{
                                alert("Su furgón está correctamente agregado, pero el encargado aún no lo autoriza")
                            }
                        })

                    })
                }
            })
        })
    }
    checkHouseMarker(){
        console.log("getting house marker")
        var user = firebaseRef.auth().currentUser;
        let search = "Attorney/" + user.displayName + "/personal_info"
        var ref = firebaseRef.database().ref(search);
        ref.once("value")
            .then((snapshot) => {
                this.setState({
                    house_position: {
                        ...this.state.house_position,
                        latitude: ((snapshot.child("latitude").val() != null) ? snapshot.child("latitude").val() : 0),
                        longitude: ((snapshot.child("longitude").val() != null) ? snapshot.child("longitude").val() : 0),
                    }
                })
            });
    }
    componentDidMount() {
        this.checkHouseMarker()
        this.checkSchoolBus()
    }
    distance(lat1, lon1, lat2, lon2) {
        console.log("calculando distancia")
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    onRegionChange(region){
        this.setState({
            regionPosition: {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta
            }
        })
        // if(this.state.follow_marker){
        //     this.setState({
        //         position: {
        //             ...this.state.position,
        //             latitudeDelta : region.latitudeDelta,
        //             longitudeDelta : region.longitudeDelta
        //         }
        //     })
        // }
        // else{
        //     this.setState({
        //         regionPosition: {
        //             latitude : region.latitude,
        //             longitude : region.longitude,
        //             latitudeDelta : region.latitudeDelta,
        //             longitudeDelta : region.longitudeDelta
        //         }
        //     })
        // }
    }
    componentWillUnmount() {
        // navigator.geolocation.clearWatch(this.watchID)
        var user = firebaseRef.auth().currentUser;
        sha256(user.email).then(user_hash => {
            firebaseRef.database().ref('Attorney/' + user_hash + '/school_bus').once("value")
                .then((snapshot) => {
                    let school_bus = snapshot.val()
                    if (school_bus != null) {
                        sha256(school_bus)
                            .then(school_bus_hash => {
                                let search = "School_bus/" + school_bus_hash
                                var ref = firebaseRef.database().ref(search);
                                ref.off('value')
                            })
                    }
                })
        })
    }
    touchMarker(e){
        console.log("tocando el marcado")
        console.log(this.state)
        console.log(e.nativeEvent)
    }
    moveMarker(e){
        console.log("terminando de mover")
        console.log(e.nativeEvent)
    }
    handlePress(){
        if(this.state.follow_marker){
            this.setState({ 
                follow_marker : false,
                regionPosition: {
                    ...this.state.position
                }
            })
        }
        else{
            this.setState({ 
                follow_marker : true,
                position : {
                    ...this.state.regionPosition,
                    latitude : this.state.position.latitude,
                    longitude : this.state.position.longitude
                }
            })
        }
 
    }
    componentWillMount(){
        let timerID = setTimeout(() => {firebaseRef.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user })
            } else {
                this.setState({user: null})
                navigator.geolocation.clearWatch(this.watchID)
                Actions.login()
            }
        })},4000)
        clearInterval(timerID)
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
    }
    render(){
        /* this.watcher_position() */
        let mapRegion = {}
        if(this.state.follow_marker){
            mapRegion = this.state.position
        }
        else{
            mapRegion = this.state.regionPosition
        }
        return (
            <View style = {styles.container} >
                <MapView
                    style = {styles.map}
                    region={this.state.house_position}
                    onRegionChangeComplete={this.onRegionChange.bind(this)}
                    ref={(ref) => { this.mapRef = ref }}
                >
                    <MapView.Marker
                        coordinate = {this.state.school_busPosition}
                        title="Mi Furgón"
                        description="Posición del furgón"
                    >
                        <View style={styles.radius2}>
                            <View style = {styles.marker2}>  
                            </View>    
                        </View>    
                    </MapView.Marker>

                    <MapView.Marker
                        coordinate={this.state.house_position}
                        title="Mi Casa"
                        description="esta es mi casita"
                    >
                        <View style={styles.radius3}>
                            <View style={styles.marker3}>
                            </View>
                        </View>
                    </MapView.Marker>

                </MapView>
                {/* <TouchableOpacity style={styles.buttonContainer} onPress = {this.handlePress.bind(this)}>
                    <Text style={styles.buttonText}>
                        Iniciar Viaje
                    </Text>
                </TouchableOpacity> */}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50/2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,122,255,0.3)',
        alignItems: 'center',
        justifyContent : 'center'
    },
    marker : {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20/2,
        overflow: 'hidden',
        backgroundColor: '#007AFF'
    },
    marker2 : {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20/2,
        overflow: 'hidden',
        backgroundColor: '#ff8500'
    },
    marker3 : {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20/2,
        overflow: 'hidden',
        backgroundColor: 'black'
    },
    radius2: {
        height: 30,
        width: 30,
        borderRadius: 30/2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(0,122,255,0.3)',
        alignItems: 'center',
        justifyContent : 'center'
    },
    radius3: {
        height: 30,
        width: 30,
        borderRadius: 30/2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,122,255,0.1)',
        borderWidth: 15,
        borderColor: 'rgba(0,122,255,0.3)',
        alignItems: 'center',
        justifyContent : 'center'
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'baseline',

    },
    map: {
      ...StyleSheet.absoluteFillObject,
      borderTopWidth: 100,
      alignItems: 'baseline',

    },
    button: {
        position: 'absolute',
        bottom: 10,
        zIndex: 2,
        paddingVertical: 20
    },
    buttonContainer:{
        alignSelf : 'center',
        backgroundColor: '#f10f3c',
        paddingVertical: 20,
        zIndex: 2,
        width: '90%',
        marginTop :'100%'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    }
  });
// const styles = StyleSheet.create({
//     container:{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF'
//     },
//     map:{
//         left : 0,
//         right: 0,
//         top: 0,
//         position: 'absolute'
//     }
// })
