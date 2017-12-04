import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Prompt from 'react-native-prompt';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';
import ChildrenCard from './ChildrenCard'
import uuid from 'react-native-uuid';

export default class SchoolBus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            children: [],
            visible: false,
            school_bus: {
                name: "",
                patent: "",
                in_transit: false
            }
        };
    }
    showPop() {
        console.log(this.state)
    }
    addChildren(value){
        var user = firebaseRef.auth().currentUser;
        console.log(user.displayName)
        firebaseRef.database().ref('Attorney/' + user.displayName + '/children').once("value")
        .then((snapshot)=>{
            if (snapshot.val() == null) {
                console.log("ESTOY VACIO")
                child_obj = {}
                child_obj[uuid.v4()]= {name: value}
                firebaseRef.database().ref('Attorney/' + user.displayName).update({
                    children: child_obj
                })
            }
            else{
                console.log("NO ESTOY VACIO")  
                child_obj = snapshot.val()      
                child_obj[uuid.v4()] = { name: value }
                firebaseRef.database().ref('Attorney/' + user.displayName).update({
                    children: child_obj
                })
            }
        })
        .then(()=>{
            this.get_children()
        })
        .catch((error) => {
            // Handle Errors here.
            console.log(error.code)
            console.log(error.message)
            alert(JSON.stringify(error.message))
        })
        this.setState({
            promptVisible: false,
            message: `You said "${value}"`,
            visible: false
        })
        
        console.log(this.state)
    }
    componentDidMount() {
        
        this.get_children()
        
        console.log(this.state)
    }
    get_children(){
        var user = firebaseRef.auth().currentUser;
        firebaseRef.database().ref('Attorney/' + user.displayName + '/children').once("value")
            .then((snapshot) => {
                if (snapshot.val() != null) {
                    children = this.state.children
                    for (const key of Object.keys(snapshot.val())) {
                        console.log(key + "->" + snapshot.val()[key].name); // 'foo->hello', 'bar->world'
                        var index = children.findIndex(x => x.name == snapshot.val()[key].name)
                        if (index === -1) {
                            let child = {}
                            child = snapshot.val()[key]
                            children.push(child);
                            
                        }
                        else {
                            console.log("object already exists")
                        }
                    }
                    this.setState({ children : children})
                }
                else {
                    alert("No hay hijos agregados, porfavor agregue uno")
                }
            })
            .catch((error) => {
                // Handle Errors here.
                console.log(error.code)
                console.log(error.message)
                alert(JSON.stringify(error.message))
            })
    }
    render() {

        const { page } = this.state;
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);
        let children = this.state.children
        // children.map((e, i) => (console.log(e)))
        // console.log(children.length)
        return (
            <View style={styles.container}>
                <ScrollView>
                    <List style={styles.list}>
                        {
                            Object.values(this.state.children).map((e, i) =>
                                <ChildrenCard key={i} children={e}  />
                            )}
                    </List>
                </ScrollView>
                <View style={styles.form}>
                    <View style={styles.formContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.setState({ promptVisible: true })}>
                            <Text style={styles.buttonText}>
                                Agregar Hijo
                                </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Prompt
                    title="Ingrese nombre del Hijo"
                    placeholder="nombre"
                    defaultValue="pedrito"
                    visible={this.state.promptVisible}
                    onCancel={() => this.setState({
                        promptVisible: false,
                        message: "You cancelled"
                    })}
                    onSubmit={this.addChildren.bind(this)} />
                <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{ color: '#FFF' }} />
            </View>
        )
    }
}
// module.exports = InputScreen;  

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
        marginTop: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '700'
    }
});
