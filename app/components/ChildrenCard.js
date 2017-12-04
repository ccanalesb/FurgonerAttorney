import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';

export default class ChildrenCard extends Component {
    render() {
        console.log("CHILDREN")
        console.log(this.props)
        return (
            // <List.Item>
            <Card full>
                <Card.Header
                    title={"Información relacionada a su hijo"}
                />
                <Card.Body>
                    <Text style={{ textAlign: 'justify', marginLeft: 15, fontSize: 20 }}>
                        Nombre: {this.props.children.name}
                    </Text>
                </Card.Body>
                <Card.Footer content="" />
            </Card>
            // </List.Item>
        )
    }

}

const styles = StyleSheet.create({
    title: {
        color: 'black',
        textAlign: 'left',
        marginTop: 10
    },

});