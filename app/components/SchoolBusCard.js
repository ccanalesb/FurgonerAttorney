import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';

export default class SchoolBusCard extends Component {
    render(){
        console.log(this.props)
        return(
            // <List.Item>
            <Card full>
            <Card.Header
              title={"Nombre: " + this.props.school_bus.name }
              extra={`Patente ${this.props.school_bus.patent}`}
            />
            <Card.Body>
              <Text style={{ textAlign: 'justify', marginLeft: 15, fontSize:20 }}>
                ¿En transito? : {this.props.school_bus.in_transit ? "Si" : "No"}
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