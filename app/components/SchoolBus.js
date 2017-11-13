import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import Prompt from 'react-native-prompt';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';
import SchoolBusCard from './SchoolBusCard'

export default class SchoolBus extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          page: 'first',
          visible : false,
          school_bus : {
              name: "",
              in_transit: false
          }
        };
    }
    showPop(){
      console.log(this.state)
    }
    searchEmail(value){
      this.setState({visible: true})
      var user = firebaseRef.auth().currentUser;
      sha256(user.email)
      .then( (hash) => {
          firebaseRef.database().ref('Attorney/' + hash+'/school_bus').once("value")
          .then((snapshot)=>{
              if (snapshot.val() === null){
                firebaseRef.database().ref('Attorney/' + hash).update({
                    school_bus: value
                });
              }

          })
      })

      sha256(value).then( hash => {
        let search = "School_bus/"+hash
        var ref = firebaseRef.database().ref(search);
        var user = firebaseRef.auth().currentUser;
        user.updateProfile({
            photoURL: hash
        })
        .then((user) => {
            console.log("Update user school bus with hash")
            console.log(firebaseRef.auth().currentUser)
        })
        .catch(function (error) {
            console.log(error)
        });

        ref.once("value")
        .then((snapshot) => {
                let in_transit = snapshot.child("in_transit").val();
                let attorneys = snapshot.child("attorneys").val();
                var user = firebaseRef.auth().currentUser;
                sha256(user.email)
                .then( user_hash => {
                    console.log("probando")
                    if (typeof attorneys[user_hash] === "undefined"){
                        alert(`Se envió una notificación a ${snapshot.child("name").val()}`)
                        firebaseRef.database().ref(search+'/attorneys/'+ user_hash).update({
                            state: "pending"
                        })
                    }
                    else{
                        if(attorneys[user_hash].state == "pending"){
                            alert("Tu solicitud se encuentra pendiente, el encargado del furgón debe aceptarla")
                        }
                        else{
                            console.log(snapshot.child("children").numChildren())
                            console.log(snapshot.child("children").val()); 
                            let temp_atorney = this.state.school_bus
                            temp_atorney = { name : snapshot.child("name").val(), in_transit: in_transit }
                            this.setState({school_bus : temp_atorney })
                        }
                    }

                })

        })
        .catch((error) => {
            // Handle Errors here.
            console.log(error.code)
            console.log(error.message)
            alert(JSON.stringify(error.message))
        })
          
      })
      this.setState({
        promptVisible: false,
        message: `You said "${value}"`,
        visible: false
      }) 
    }
    componentDidMount(){
        var user = firebaseRef.auth().currentUser;
        sha256(user.email).then( user_hash => {
            firebaseRef.database().ref('Attorney/' + user_hash+'/school_bus').once("value")
            .then((snapshot) => {
                if (snapshot.val() != null){
                    sha256(snapshot.val())
                    .then( hash => {
                        let search = "School_bus/"+hash
                        var ref = firebaseRef.database().ref(search);
                        ref.once("value")
                        .then((snapshot) => {
                                let in_transit = snapshot.child("in_transit").val();
                                let attorneys = snapshot.child("attorneys").val();
                                var user = firebaseRef.auth().currentUser;
                                sha256(user.email)
                                .then( user_hash => {
                                    if(attorneys[user_hash].state == "pending"){
                                        alert("Tu solicitud se encuentra pendiente, el encargado del furgón debe aceptarla")
                                    }
                                    else{
                                        console.log(snapshot.child("children").numChildren())
                                        console.log(snapshot.child("children").val()); 
                                        let temp_atorney = this.state.school_bus
                                        temp_atorney = { name : snapshot.child("name").val(), in_transit: in_transit }
                                        this.setState({school_bus : temp_atorney })
                                    }
                
                                })
                
                        })
                    .catch((error) => {
                        // Handle Errors here.
                        console.log(error.code)
                        console.log(error.message)
                        alert(JSON.stringify(error.message))
                    })
                    })

                }
            })
            .catch((error) => {
                // Handle Errors here.
                console.log(error.code)
                console.log(error.message)
                alert(JSON.stringify(error.message))
            })
        })
    }
    render() {

        const { page } = this.state;
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);
        
        return (
          <View style={styles.container}>
            <ScrollView>
                {/* <List style={styles.list}> */}
                {(this.state.school_bus.name === "") ? null:
                    <SchoolBusCard school_bus = {this.state.school_bus}/>
                }
                {/* </List> */}
            </ScrollView>
            <View style={styles.form}>
                        <View style={styles.formContainer}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={()=> this.setState({promptVisible:true})}>
                                <Text style={styles.buttonText}> 
                                    Agregar furgón
                                </Text>
                            </TouchableOpacity>
                        </View>
                </View>
            <Prompt
              title="Ingrese correo del furgón"
              placeholder="example@mail.com"
              defaultValue="canaleschiko@gmail.com"
              visible={ this.state.promptVisible }
              onCancel={ () => this.setState({
                promptVisible: false,
                message: "You cancelled"
              }) }
              onSubmit={ this.searchEmail.bind(this) }/>     
              <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{color: '#FFF'}} />       
          </View>  
          


               //<View style={styles.container}>
        //     <NavBar leftContent="back"
        //   mode="light"
        //   onLeftClick={() => console.log('onLeftClick')}
        //   rightContent={[
        //     <Icon key="0" type="search" style={{ marginRight: '0.32rem' }} />,
        //     <Icon key="1" type="ellipsis" />,
        //   ]}
        // >NavBar</NavBar>        
        //     <Tabs
        //       selected={page}
        //       style={tabbarStyles}
        //       selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}
        //     >
        //         <Text name="first">
        //           First
        //         </Text>
        //         <Text name="second">Second</Text>
        //         <Text name="third">Third</Text>
        //     </Tabs>
    
        //     <Button> Start </Button>
        //     <Text>CodeSharing App</Text>
        //     <Text>{page}</Text>
        //   </View>
        )
      }
}    
// module.exports = InputScreen;  

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fafafa'
  },
  logoContainer:{
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'center',
      flex:1
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
  buttonContainer:{
      backgroundColor: '#f1c40f',
      paddingVertical: 20
  },
  buttonRegisterContainer:{
      backgroundColor: '#FFB74D',
      paddingVertical: 5,
      marginTop: 10
  },
  buttonText: {
      textAlign: 'center',
      color: 'black',
      fontWeight: '700'
  }
});
