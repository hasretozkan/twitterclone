import React from 'react';
import { StatusBar, StyleSheet, Text, TextInput, View, RefreshControl, Dimensions, ScrollView, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements'
import * as firebase from "firebase";
import { StackActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default class Login extends React.Component {
  state = {
    email: '',
    name: '',
    password: '',
    loading: false,
  }

  signUpApp = () => {
    this.setState({ loading: true });

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then((auth) => {
      let uid = auth.user.uid;
      this.createUser(uid)
    }).catch((err) => {
      this.setState({ loading: false });
      Alert.alert(
        'Oops',
        'Kayıt Olunamadı. Lütfen tekrar deneyiniz.',
        [
          { text: 'Tamam' }
        ]
      )
    })
  }

  createUser = (uid) => {
    firebase.database().ref('users').child(uid).set({
      email: this.state.email,
      uid: uid,
      name: this.state.name,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='small' color='black' />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ width: width, height: 44 }}/>
          <View style={{ width: width, alignItems: 'center', padding: 10 }}>
            <Icon name='twitter' size={40} type="material-community"  color='#00aced'/>
          </View>
          <View style={{ width: width, paddingLeft: 20, marginTop: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Kayıt Ol</Text>
            <TextInput
              placeholder='Adınız'
              style={{ width: width - 20, paddingVertical: 20, borderBottomWidth: 0.5, borderColor: 'lightgray', color: '#00aced' }}
              underlineColorAndroid='transparent'
              onChangeText={name => this.setState({ name: name })}
              value={this.state.name}
              placeholderTextColor='gray'
            />
            <TextInput
              placeholder='Telefon, e-posta veya kullanıcı adı'
              style={{ width: width - 20, paddingVertical: 20, borderBottomWidth: 0.5, borderColor: 'lightgray', color: '#00aced' }}
              underlineColorAndroid='transparent'
              onChangeText={email => this.setState({ email: email })}
              value={this.state.email}
              keyboardType='email-address'
              placeholderTextColor='gray'
            />
            <TextInput
              placeholder='Şifre'
              style={{ width: width - 20, paddingVertical: 20, borderBottomWidth: 0.5, borderColor: 'lightgray', color: '#00aced' }}
              underlineColorAndroid='transparent'
              onChangeText={password => this.setState({ password: password })}
              value={this.state.password}
              secureTextEntry
              placeholderTextColor='gray'
            />
          </View>
          <View style={{ width: width, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.signUpApp()}>
              <View style={{ alignItems: 'center', width: width - 20, padding: 15, borderRadius: 4, backgroundColor: '#00aced', marginVertical: 15 }}>
                <Text style={{ fontSize: 12, color: '#fff' }}>Kayıt Ol</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.dispatch(StackActions.pop(1))}>
            <Text style={{ fontSize: 12, color: '#000' }}>Hesabınız var mı? <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000' }}>Giriş Yap</Text></Text>
            </TouchableOpacity>

          </View>
        </View>
      );
    }

  }
}
