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
console.disableYellowBox = true
export default class FurgonerAttorney extends Component {
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