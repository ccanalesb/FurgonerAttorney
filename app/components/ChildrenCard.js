import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';

// const uri = 'https://randomuser.me/api/portraits/lego/' + Math.floor(Math.random() * 8) + '.jpg';
export default class ChildrenCard extends Component {
    
    render() {
        console.log("CHILDREN")
        console.log(this.props)
        let curso = "Curso: "+this.props.children.grade
        const uri = 'https://randomuser.me/api/portraits/lego/' + Math.floor(Math.random() * 8) + '.jpg';
        return (
            // <List.Item>
            <Card full>
                <Card.Header
                    title={"Información relacionada a su hijo"}
                    
                />
                <Card.Body>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                    <Text style={{ textAlign: 'justify', marginLeft: 15, fontSize: 20 }}>
                        Nombre: {this.props.children.name} {this.props.children.last_name}

                        {/* Curso: {this.props.children.grade} */}
                    </Text>
                        <Image
                            // style={styles.headerIcon}
                            style={{ width: 70, height: 70, marginRight:20, marginTop: 10 }}
                            source={{ uri }}
                        />

                    </View>
                </Card.Body>
                <Card.Footer content={curso} />
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