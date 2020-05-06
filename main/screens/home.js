import React from 'react';
import { Modal, Image, StatusBar, StyleSheet, Text, TextInput, View, RefreshControl, Dimensions, ScrollView, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements'
import * as firebase from "firebase";
import { StackActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default class Home extends React.Component {
  state = {
    user: {},
    loading: true,
    tweets: [],
    modalVisible: false,
    tweet: '',
  }

  componentDidMount = async () => {
  await  firebase.auth().onAuthStateChanged(auth=>{
      if (auth) {
        firebase.database().ref('users').child(auth.uid).once('value', (snap) => {
          this.setState({ user: snap.val() })
        })
      }
    });

    await firebase.database().ref('tweets').on('value', (snap) => {
      let tweets = []
      snap.forEach((item) => {
        const { tweet, timestamp, user } = item.val();
        tweets.push({ tweet, timestamp, user });
      });
      tweets.reverse()
      this.setState({ tweets: tweets });
    })
  }

  sendTweet = () => {
    const timestamp = new Date().getTime();

    firebase.database().ref('tweets').child(timestamp).set({
      tweet: this.state.tweet,
      timestamp: timestamp,
      user: this.state.user
    }).then(() => {
      this.setState({ modalVisible: false, tweet: '' });
    })
  }

  reTweet = (item) => {
    const timestamp = new Date().getTime();

    firebase.database().ref('tweets').child(timestamp).set({
      tweet: item.tweet,
      timestamp: timestamp,
      user: this.state.user
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ width: width, height: 44 }}/>
        <View style={{ borderBottomWidth: 0.5, borderColor: 'lightgray', width: width, alignItems: 'center', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{uri: this.state.user.photo }}
          />
          <Icon name='twitter' size={40} type="material-community"  color='#00aced'/>
          <View style={{ width: 40, height: 40, borderRadius: 20 }}/>
        </View>
        <FlatList
          data={this.state.tweets}
          keyExtractor={(item,index)=>item.timestamp}
          renderItem={({item}) =>
          <View style={{ width: width, padding: 10, flexDirection: 'row', borderBottomWidth: 0.5, borderColor: 'lightgray' }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={{uri: item.user.photo}}
            />
            <View style={{ marginLeft: 10, width: width - 70 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.user.name}</Text>
              <Text style={{ fontSize: 12 }}>{item.tweet}</Text>
              <View style={{ width: width - 70, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Icon name='message' size={24} type="material-community"  color='gray'/>
                <TouchableOpacity onPress={() => this.reTweet(item)}>
                  <Icon name='replay' size={24} type="material-community"  color='gray'/>
                </TouchableOpacity>
                <Icon name='heart-outline' size={24} type="material-community"  color='gray'/>
                <Icon name='heart' size={24} type="material-community"  color='#fff'/>
                <Icon name='heart' size={24} type="material-community"  color='#fff'/>

              </View>
            </View>


</View>
        }
      />
        <TouchableOpacity style={{ position: 'absolute', right: 15, bottom: 45 }} onPress={() => this.setState({ modalVisible: true })}>
        <View style={{ alignItems: 'center', justifyContent: 'center', width: 70, height: 70, borderRadius: 35, backgroundColor: '#00aced' }}>
          <Icon name='message' size={40} type="material-community"  color='#fff'/>
        </View>
        </TouchableOpacity>
        <Modal
       animationType="slide"
       transparent={true}
       visible={this.state.modalVisible}
     >
       <View style={{ height: height, width: width, backgroundColor: 'white', paddingTop: 44 }}>
         <View style={{ width: width, alignItems: 'center', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
           <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
             <Text style={{ color: '#00aced', fontSize: 16 }}>Vazgeç</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => this.sendTweet()}>
           <View style={{ padding: 10, borderRadius: 25, backgroundColor: '#00aced' }}>
             <Text style={{ color: '#fff', fontSize: 16 }}>Tweet At</Text>
           </View>
           </TouchableOpacity>
         </View>
         <TextInput
           placeholder='Durumunuz veya atmak istediğiniz tweet'
           style={{ width: width - 20, padding: 10, fontSize: 16 }}
           underlineColorAndroid='transparent'
           onChangeText={tweet => this.setState({ tweet: tweet })}
           value={this.state.tweet}
           placeholderTextColor='gray'
         />
       </View>
     </Modal>
      </View>
    );
  }
}
