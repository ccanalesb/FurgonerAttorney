import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { DatePicker, List, InputItem, Button, Card } from 'antd-mobile';

export default class SchoolBusCard extends Component {
    render(){
        console.log(this.props)
        return(
            <List.Item>
            <Card>
            <Card.Header
              title={this.props.attorney.name}
              extra={`Hijos ${this.props.attorney.number_children}`}
            />
            <Card.Body>
              <Text style={ {textAlign: 'justify'}}>comuna: </Text>
            </Card.Body>
            <Card.Footer content="Se recoje en la vuelta:" />
          </Card>
          </List.Item>
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