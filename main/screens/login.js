import React from 'react';
import { StatusBar, StyleSheet, Text, TextInput, View, RefreshControl, Dimensions, ScrollView, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements'
import * as firebase from "firebase";
import { StackActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default class Login extends React.Component {
  state = {
    email: '',
    password: '',
    loading: true,
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(auth=>{
      if (auth) {
        this.props.navigation.dispatch(
  StackActions.replace('Home')
);
      } else {
        this.setState({ loading: false });
      }
    });
  }

  loginApp = () => {
    this.setState({ loading: true });

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      //giriş başarılı
    }).catch((err) => {
      this.setState({ loading: false });
      Alert.alert(
        'Oops',
        'Giriş Yapılamadı. Lütfen tekrar deneyiniz.',
        [
          { text: 'Tamam' }
        ]
      )
    })
  }

  goSignUp = () => {
    const pushAction = StackActions.push('SignUp');

    this.props.navigation.dispatch(pushAction);
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
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hesaba giriş yap</Text>
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
            <TouchableOpacity onPress={() => this.loginApp()}>
              <View style={{ alignItems: 'center', width: width - 20, padding: 15, borderRadius: 4, backgroundColor: '#00aced', marginVertical: 15 }}>
                <Text style={{ fontSize: 12, color: '#fff' }}>Hesaba giriş yap</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.goSignUp()}>
              <Text style={{ fontSize: 12, color: '#000' }}>Hesabınız mı yok? <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#000' }}>Kayıt Ol</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

  }
}
