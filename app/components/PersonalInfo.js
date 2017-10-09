import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, Picker } from 'react-native';
import Prompt from 'react-native-prompt';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';

export default class SchoolBus extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          page: 'first',
          visible : false,
          editInfo : false,
          attorneys : []
        };
    }
    showPop(){
      console.log(this.state)
    }
    searchEmail(value){
      this.setState({visible: true})
      sha256(value).then( hash => {
        let search = "School_bus/"+hash
        var ref = firebaseRef.database().ref(search);
        console.log(ref)
        ref.once("value")
            .then((snapshot) => {
                alert(`El nombre de la persona es " ${snapshot.child("name").val()}"`)
                console.log(snapshot.child("children").numChildren())
                console.log(snapshot.child("children").val()); 
                let temp_atorney = this.state.attorneys
                temp_atorney.push({ name : snapshot.child("name").val(), children: snapshot.child("children").val() , number_children: snapshot.child("children").numChildren() })
                this.setState({attorneys : temp_atorney })
        });
          
      })
      this.setState({
        promptVisible: false,
        message: `You said "${value}"`,
        visible: false
      }) 
    }

    editToggle(){
        let edit = this.state.editInfo;
        if(edit){
            this.setState({editInfo:false})
        }
        else{
            this.setState({editInfo:true})
        }
    }
    render() {

        const { page } = this.state;
         
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);
        
        return (
          <View style={styles.container}>
            <ScrollView>
                <List style={styles.list} renderHeader={() => 'Su información personal'}>
                    <InputItem
                        type = "text"                    
                        disabled = {this.state.editInfo}
                        placeholder = "Nombre"
                        defaultValue = "nombre "
                        onChange = {(value) => console.log(value)}
                    >
                    Nombre:
                    </InputItem>
                    <InputItem
                        type = "text"                    
                        disabled = {this.state.editInfo}
                        placeholder = "Apellido"
                        defaultValue = "apellido "
                    >
                    Apellido:
                    </InputItem>

                </List>
                <List style={styles.list} renderHeader={() => 'Dirección para buscar sus hijos'}>
                <List.Item>
                    <Text> Comuna </Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.language}
                        onValueChange={(lang) => this.setState({language: lang})}
                        mode = 'dialog'
                        enabled = {this.state.editInfo}>
                        <Picker.Item label="Santiago" value="ST" />
                        <Picker.Item label="Puente Alto" value="PT" />
                    </Picker>
                </List.Item>
                    <InputItem
                        type = "text"                    
                        disabled = {this.state.editInfo}
                        placeholder = "Calle/pasaje"
                        defaultValue = ""
                    >
                    Calle/pasaje:
                    </InputItem>
                    <InputItem
                        type = "number"                    
                        disabled = {this.state.editInfo}
                        placeholder = "Número"
                        defaultValue = ""
                    >
                    Número:
                    </InputItem>
                </List>
                
            </ScrollView>
            <View style={styles.form}>
                        <View style={styles.formContainer}>
                            <TouchableOpacity style={styles.buttonContainer} onPress={this.editToggle.bind(this)}>
                                <Text style={styles.buttonText}> 
                                    Editar mis datos
                                </Text>
                            </TouchableOpacity>
                        </View>
                </View>
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
  },
  picker: {
    width: '100%',
  },
});
