import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseRef } from '../services/firebase.js'


export default class SchoolBus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 'first',
        };
    }

    render() {

        const { page } = this.state;
        // const tabbarStyles = [styles.tabbar];
        // if (Platform.OS === 'android') tabbarStyles.push(styles.androidTabbar);

        return (
            <View style={styles.container}>
                <ScrollView>

                </ScrollView>
                <Spinner visible={this.state.visible} textContent={"Cargando..."} textStyle={{ color: '#FFF' }} />
            </View>

        )
    }
}

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
