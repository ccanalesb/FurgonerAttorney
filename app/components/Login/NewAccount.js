import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView, 
    TextInput,
    TouchableOpacity,
    Button,
KeyboardAvoidingView  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { sha256 } from 'react-native-sha256';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../../services/firebase.js'
import Spinner from 'react-native-loading-spinner-overlay';

export default class NewAccount extends Component {
    constructor(props){
        super(props)
        this.state ={
            email : '',
            password : '',
            password_repeat: '',
            visible : false
        }
    }
    createAccount(){
        let email = this.state.email
        let password = this.state.password
        let password_repeat = this.state.password_repeat
        if(password === password_repeat){
            this.setState({visible:true})
            firebaseRef.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebaseRef.auth().onAuthStateChanged((user) => {
                    // User is signed in.
                    if (user) {
                        var user_uid = user.uid
                        var user_email = user.email
                        sha256(user_email).then( hash => {
                            console.log(user_email)
                            firebaseRef.database().ref('Attorney/' + hash).set({
                                uid: user_uid
                            });
                            firebaseRef.database().ref('User/' + user_uid).set({
                                type: "attorney"
                            });
                            Actions.main()
                            this.setState({visible:false})
                        })
                    } else {
                        // No user is signed in.
                        console.log("no pasó na")
                        alert("Se creó la cuenta, pero no se pudo conectar al usuario")
                        this.setState({visible:false})
                        Actions.login()
                    }
                });
            })
            .catch((error) => {
                // Handle Errors here.
                console.log(error.code)
                console.log(error.message)
                alert(JSON.stringify(error.message))
                this.setState({visible:false})
            })
        }
        else {
            this.setState({visible:false})
            alert("Las contraseñas no son iguales")
        }

    }
    onResetPassword(email, password){
        console.log(email, password)
    }
    componentDidMount(){
        console.log(firebaseRef)
        // Actions.main()
    }
    render(){
        return(
            
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                <View style={styles.logoContainer}>
                    <Image 
                        style={styles.logo}
                        source= { require('../../../images/login.jpeg') }
                        />
                    <Text style={styles.title}>
                        Cree su cuenta
                    </Text>
                </View>
                <View>
                    <View style={styles.formContainer}>
                        <TextInput 
                            style={styles.input}
                            placeholderTextColor='rgba(0,0,0,0.2)'
                            placeholder="Email"
                            returnKeyType="next"
                            keyboardType = "email-address"
                            autoCapitalize = "none"
                            autocorrect = {false}
                            onChangeText = { (text) => this.setState({email: text}) }
                        >
                            
                        </TextInput>
                        <TextInput 
                            style={styles.input}
                            placeholderTextColor='rgba(0,0,0,0.2)'
                            placeholder= "Contraseña"
                            secureTextEntry
                            onChangeText = { (text) => this.setState({password: text}) }
                        >
                        </TextInput>
                        <TextInput 
                            style={styles.input}
                            placeholderTextColor='rgba(0,0,0,0.2)'
                            placeholder= "Repetir contraseña"
                            secureTextEntry
                            onChangeText = { (text) => this.setState({password_repeat: text}) }
                        >
                        </TextInput>
                        <TouchableOpacity style={styles.buttonContainer} onPress = {this.createAccount.bind(this)}>
                            <Text style={styles.buttonText}> 
                                Crear cuenta
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{color: '#FFF'}} />
                </KeyboardAwareScrollView> 
            </View>
            


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
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