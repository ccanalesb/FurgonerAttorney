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
            follow_marker : true,
            user : null
        };
    }
    watchID : ?number = null

    componentDidMount () {
        alert(uuid.v4())
        console.log(this.state)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                const window = Dimensions.get('window');
                const { width, height }  = window
                LONGITUDE_DELTA = LATITUD_DELTA + (width / height)

                let initialRegion = {
                    latitude : lat,
                    longitude : long,
                    latitudeDelta: LATITUD_DELTA/30,
                    longitudeDelta : LONGITUDE_DELTA/30
                }
                this.setState({
                    position: initialRegion,
                    regionPosition : initialRegion,
                    markerPosition : { latitude: lat, longitude: long}
                })
                console.log("Get current position")

            }, (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge : 100 })

            this.watchID = navigator.geolocation.watchPosition((position)=>{

                console.log("Watching position")
                var lat = parseFloat(position.coords.latitude)
                var long = parseFloat(position.coords.longitude)
                if(this.state.user != null){
                    let timerID = setTimeout(() => {firebaseRef.database().ref('School_bus/' + this.state.user.uid).update({
                        latitude: lat,
                        longitude: long,
                    })},4000)
                    clearInterval(timerID)
                }
                // const { latitudeDelta, longitudeDelta} = getRegionForCoordinates({ latitude: lat, longitude: long })
                // console.log(latitudeDelta)
                // console.log(longitudeDelta)

                let lastPosition = {
                    latitude : lat,
                    longitude : long,
                    latitudeDelta: LATITUD_DELTA,
                    longitudeDelta : LONGITUDE_DELTA
                }
                if(this.state.follow_marker){
                    console.log("Following marker")
                    this.setState({
                        position: {
                            latitude : lat,
                            longitude : long,
                            latitudeDelta: this.state.position.latitudeDelta,
                            longitudeDelta : this.state.position.longitudeDelta
                        }, 
                        markerPosition : { latitude: lat, longitude: long}})
                }
                else {
                    console.log("Free move")
                    this.setState({
                        markerPosition : { latitude: lat, longitude: long}
                    })
                }

            }, (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge : 100 })
        
    }
    onRegionChange(region){
        if(this.state.follow_marker){
            this.setState({
                position: {
                    ...this.state.position,
                    latitudeDelta : region.latitudeDelta,
                    longitudeDelta : region.longitudeDelta
                }
            })
        }
        else{
            this.setState({
                regionPosition: {
                    latitude : region.latitude,
                    longitude : region.longitude,
                    latitudeDelta : region.latitudeDelta,
                    longitudeDelta : region.longitudeDelta
                }
            })
        }
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID)
    }
    touchMarker(e){
        console.log("tocando el marcado")
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
                    region={mapRegion}
                    onRegionChangeComplete={this.onRegionChange.bind(this)}
                    ref={(ref) => { this.mapRef = ref }}
                >

                <MapView.Marker
                coordinate = {this.state.markerPosition}
                draggable
                onDragEnd={this.moveMarker.bind(this)}
                onPress = {this.touchMarker.bind(this)}
                >
    
                    <View style={styles.radius}>
                        <View style = {styles.marker}>  
                        </View>    
                    </View>    
                </MapView.Marker>
                </MapView>
                <TouchableOpacity style={styles.buttonContainer} onPress = {this.handlePress.bind(this)}>
                    <Text style={styles.buttonText}>
                        Iniciar Viaje
                    </Text>
                </TouchableOpacity>
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
