import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Prompt from 'react-native-prompt';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'
import { sha256 } from 'react-native-sha256';
import ChildrenCard from './ChildrenCard'
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal'

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
            },
            isModalVisible: false,
            addchild:{
                name: "",
                last_name: "",
                grade: ""
            }
        };
    }
    _showModal = () => this.setState({ isModalVisible: true })

    _hideModal = () => this.setState({ isModalVisible: false })

    showPop() {
        console.log(this.state)
    }
    addChildren(){
        var user = firebaseRef.auth().currentUser;
        console.log(user.displayName)
        firebaseRef.database().ref('Attorney/' + user.displayName + '/children').once("value")
        .then((snapshot)=>{
            if (snapshot.val() == null) {
                console.log("ESTOY VACIO")
                child_obj = {}
                child_obj[uuid.v4()]= {
                    name: this.state.addchild.name, 
                    last_name: this.state.addchild.last_name,
                    grade: this.state.addchild.grade
                }
                firebaseRef.database().ref('Attorney/' + user.displayName).update({
                    children: child_obj
                })
            }
            else{
                console.log("NO ESTOY VACIO")  
                child_obj = snapshot.val()      
                child_obj[uuid.v4()] = {
                    name: this.state.addchild.name,
                    last_name: this.state.addchild.last_name,
                    grade: this.state.addchild.grade
                }
                firebaseRef.database().ref('Attorney/' + user.displayName).update({
                    children: child_obj
                })
            }
        })
        .then(()=>{
            this.get_children()
            child = this.state.addchild
            child.name = ""
            child.last_name = ""
            child.grade = ""
            this.setState({ addchild: child })
        })
        .catch((error) => {
            // Handle Errors here.
            console.log(error.code)
            console.log(error.message)
            alert(JSON.stringify(error.message))
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
    addChildrentodb(){
        this.addChildren()
        this._hideModal()

        console.log(this.state)
    }
    handleChange(value, key) {
        console.log(value)
        console.log(key)
        child = this.state.addchild
        if (key == "name") {
            child.name = value
            this.setState({ addchild: child });
        }
        if (key == "last_name") {
            child.last_name = value
            this.setState({ addchild: child });
        }
        if (key == "grade") {
            child.grade = value
            this.setState({ addchild: child });
        }
        console.log(this.state)
    }
    render() {
        const { page } = this.state;
        let children = this.state.children
        return (
            <View style={styles.container}>
                <ScrollView>
                    <List style={styles.list}>
                        {
                            Object.values(this.state.children).map((e, i) =>
                                <ChildrenCard key={i} children={e}  />
                            )
                        }
                    </List>
                </ScrollView>
                <View style={styles.form}>
                    <View style={styles.formContainer}>
                        <TouchableOpacity onPress={this._showModal} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>
                                Agregar Hijo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    isVisible={this.state.isModalVisible}
                    style={{flex: 1}}>
                    <List style={styles.list} renderHeader={() => 'Datos de su hijo a agregar'}>
                        <InputItem
                            type="text"
                            placeholder="Nombre"
                            onChange={(value) => this.handleChange(value, "name")}
                            key="name"
                        >
                            Nombre:
                        </InputItem>
                        <InputItem
                            type="text"
                            placeholder="Apellido"
                            onChange={(value) => this.handleChange(value, "last_name")}
                            key="last_name"
                        >
                            Apellido:
                        </InputItem>
                        <InputItem
                            type="text"
                            placeholder="Curso"
                            onChange={(value) => this.handleChange(value, "grade")}
                            key="grade"
                        >
                            Curso:
                        </InputItem>
                        <View style={{backgroundColor: '#fafafa'}}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <TouchableOpacity onPress={this._hideModal}
                                    style={{
                                        backgroundColor: '#FFB74D',
                                        paddingVertical: 30,
                                        width: '50%',
                                    }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '700',
                                        marginTop: -10
                                    }}>
                                        Cancelar
                                </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.addChildrentodb.bind(this)}
                                    style={{
                                        backgroundColor: '#f1c40f',
                                        paddingVertical: 30,
                                        width: '50%'
                                    }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        fontWeight: '700',
                                        marginTop: -10
                                    }}>
                                        Agregar
                                </Text>
                                </TouchableOpacity>
                            </View>
                        </View >
                    </List>
                </Modal>
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
