import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView, 
    TextInput,
    TouchableOpacity,
    Button } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../../services/firebase.js'
import Spinner from 'react-native-loading-spinner-overlay';
export default class LoginWrapper extends Component {
    constructor(props){
        super(props)
        this.state ={
            email : '',
            password : '',
            visible : false,
            login : false
        }
    }
    onLogin(){
        let email = this.state.email
        let password = this.state.password
        if(email == "" || password == ""){
            email = "canaleschiko@gmail.com"
            password = "123456"
        }
        console.log(email, password)
        this.setState({visible:true})
        firebaseRef.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            firebaseRef.auth().onAuthStateChanged((user) => {
                if (user) {
                    Actions.main()
                    this.setState({visible:false, login:true})
                  // User is signed in.
                } else {
                    this.setState({ login: false })
                    console.log("no pasó na")
                  // No user is signed in.
                }
            });
          })
        .catch((error) => {
            // Handle Errors here.
            console.log(error.code)
            console.log(error.message)
            alert(JSON.stringify(error.message))
            this.setState({visible:false})
            // ...
        })

    }
    createAccount(){
        Actions.newAccount()
    }
    componentWillMount(){
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
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image 
                        style={styles.logo}
                        source= { require('../../../images/login.jpeg') }
                        />
                    <Text style={styles.title}>
                        Bienvenido a Furgoner
                    </Text>
                </View>
                <View style={styles.form}>
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
                        <TouchableOpacity style={styles.buttonContainer} onPress = {this.onLogin.bind(this)}>
                            <Text style={styles.buttonText}> 
                                Ingresar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonRegisterContainer} onPress = { this.createAccount.bind(this) } >
                            <Text style={styles.buttonText}> 
                                Crear cuenta
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{color: '#FFF'}} />
            </View>    


/*             <Login
                onLogin={this.onLogin.bind(this)}
                onResetPassword={this.onResetPassword}
                logoImage = { require('../../images/login.jpeg') }
                labels = { {
                    userIdentification: "Email",
                    password : "Contraseña",
                    forgotPassword : "Olvidó su contraseña?",
                    loginFormButton : "Entrar",
                    forgotPasswordFormButton: "Enviar",
                    back : "Atrás"
                }}
             /> */
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
