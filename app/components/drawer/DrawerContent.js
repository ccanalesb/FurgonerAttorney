import React from 'react';

import { StyleSheet, Text, View, ViewPropTypes,
  Dimensions,
  ScrollView,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  Platform
 } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import { firebaseRef } from '../../services/firebase.js'
import { sha256 } from 'react-native-sha256';

const window = Dimensions.get('window');
// const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';
const uri = 'https://randomuser.me/api/portraits/lego/' + Math.floor(Math.random() * 8)+'.jpg';
class DrawerContent extends React.Component {

  componentWillMount() {
    let user = firebaseRef.auth().currentUser;
    console.log(user)
    sha256(user.email).then(hash => {
      let search = "Attorney/" + hash + "/personal_info"
      // console.log(search)
      var ref = firebaseRef.database().ref(search)
      ref.once("value")
        .then((snapshot) => {
          console.log(snapshot.val())
        })
    })
  }
  async logOut() {
        try {
            await firebaseRef.auth().signOut();
            Actions.login({logout:true})
        } catch (error) {
            console.log(error);
            alert("No se pudo cerrar sesión")
        }
    
    }
  render() {
    let user = firebaseRef.auth().currentUser;
    return (
      <View style={styles.drawer}>
        {Platform.OS === 'android' ? 
        <TouchableNativeFeedback style={styles.header} >
          <View>
            <Image
              style={styles.headerIcon}
              source={{ uri }}
            />
            <Text style={styles.headerTitle}>{user.email}</Text>
          </View>
        </TouchableNativeFeedback>
        :
          < TouchableHighlight style={{
            height: '10%',
            marginTop: 20,
            flex: 0.3,
            backgroundColor: '#f1c40f',

          }} >
          <View>
            <Image
              style={styles.headerIcon}
              source={{ uri }}
            />
            <Text style={styles.headerTitle}>{user.email}</Text>
          </View>
        </TouchableHighlight>
        }

        <ScrollView scrollsToTop={false} style={styles.content}>
          <TouchableOpacity style={styles.listItem} onPress={() => Actions.home()}>
              <Text
                
                style= {styles.listItemTitle}
              >
                Mapa
              </Text>
            </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => Actions.schoolbus()}>
            <Text
              
              style= {styles.listItemTitle}
            >
              Furgón
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.listItem} onPress={() => Actions.notification()}>
            <Text
              
              style= {styles.listItemTitle}
            >
              Notificaciones
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.listItem} onPress={() =>  Actions.personalinfo()}>
            <Text
              
              style= {styles.listItemTitle}
            >
              Mis datos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => this.logOut()}>
            <Text
              
              style= {styles.listItemTitle}
            >
              Salir
            </Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
    );
  }
}
const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#f1c40f'
  },
  header: {
    height: '20%',
    flex: 1,
    backgroundColor: '#f1c40f',
    
  },
  content: {
    flex: 3,
    padding: 16,
    backgroundColor: 'white'
  },
  headerInfo: {
    height: 56
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 45,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1c40f',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  headerTitle: {
    color: 'black',
    fontSize: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  headerEmail: {
    color: '#fff',
    fontSize: 16
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 40,
    marginBottom: 2
  },
  listItemTitle: {
    fontSize: 18,
  },
  listItemImage: {
    width: 80,
    height: 80,
    borderRadius: 7,
    marginRight: 10,
  }
});

export default DrawerContent;
