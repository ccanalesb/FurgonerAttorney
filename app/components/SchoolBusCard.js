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
              title={this.props.school_bus.name}
              extra={`Patente ${this.props.school_bus.number_children}`}
            />
            <Card.Body>
              <View>
                <Text style={ {textAlign: 'justify'}}> En transito: {this.props.school_bus.in_transit ? "Si": "No"} </Text>
              </View>
            </Card.Body>
            <Card.Footer content="Tus hijos se recojen en la vuelta:" />
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