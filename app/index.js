import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
  } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions, Stack, Drawer } from 'react-native-router-flux';
import LoginWrapper from './components/Login/LoginWrapper'
import NewAccount from './components/Login/NewAccount'
import DrawerContent from './components/drawer/DrawerContent';
import ShowMap  from './components/ShowMap'
import SchoolBus  from './components/SchoolBus'
import PersonalInfo  from './components/PersonalInfo'
import { firebaseRef } from './services/firebase.js'
import NotificationView from './components/notifications/NotificationView'

console.disableYellowBox = true

export default class FurgonerAttorney extends Component {
    componentDidMount(){
      console.log("revisando si tenía sesión")
      this.setState({visible:true})
      firebaseRef.auth().onAuthStateChanged((user) => {
          if (user) {
              console.log("ya estaba conectado")
              console.log(user.displayName)
              console.log(user.email)
              Actions.main()
              this.setState({visible:false, login:true})
            // User is signed in.
          } else {
              console.log("no estaba conectado")
              this.setState({visible:false, login:false})
            // No user is signed in.
          }
      });
    }
    render(){
        return (
            <Router navigationBarStyle={styles.navBar} titleStyle={styles.navBarTitle}>
            
             <Stack key="root">
               <Scene key="login"
                       component={LoginWrapper}
                       title="Login"
                       initial
                       hideNavBar
               />
               <Scene
                 key="newAccount"
                 component = {NewAccount}
                 title="Crea tu cuenta"
                 
               />
               <Scene key="main">
                 <Drawer
                   hideNavBar   
                   key="drawer"
                   contentComponent={DrawerContent}
                   drawerImage={ require('../images/menu_burger2.png') }       
                 >   
                   <Scene
                     key="home"
                     component={ShowMap}
                     title="Proximos destinos"
                     
                   />
                   <Scene
                     key="schoolbus"
                     component={SchoolBus}
                     title="Furgón Escolar"
                   />
                   <Scene
                     key="personalinfo"
                     component={PersonalInfo}
                     title="Información personal"
                     initial
                   />
                   <Scene
                 key="notification"
                 component={NotificationView}
                 title="Notifficacioens"
               />
 
                 </Drawer>  
               </Scene>
             </Stack>
              
           </Router>

        )
    }
}

const styles = StyleSheet.create({
    navBar: {
      backgroundColor:'#f1c40f',
    },
    navBarTitle:{
        color:'#FFFFFF'
    },
    barButtonTextStyle:{
        color:'#FFFFFF'
    },
    barButtonIconStyle:{
        tintColor:'rgb(255,255,255)'
    },
  })