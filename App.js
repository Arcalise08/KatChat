import React from 'react';
import { YellowBox, StyleSheet, Text, View,
  AsyncStorage, Alert, DeviceEventEmitter } from 'react-native';

// import react native gesture handler
import 'react-native-gesture-handler';
import _ from 'lodash';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from "./components/SignIn";
import Contacts from "./components/Contacts";
import Chat from "./components/Chat";

const Stack = createStackNavigator();
const firebase = require('firebase');
require('firebase/firestore');

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);

console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        messages: [],
        username: "",
        uid: "",
        queryContact: ""
    }
    const firebaseConfig = {
      apiKey: "AIzaSyBMydP5FWgVaHRnGdTUnUS6rnjmJPACWEw",
      authDomain: "chat-app-ad4fe.firebaseapp.com",
      databaseURL: "https://chat-app-ad4fe.firebaseio.com",
      projectId: "chat-app-ad4fe",
      storageBucket: "chat-app-ad4fe.appspot.com",
      messagingSenderId: "369007488043",
      appId: "1:369007488043:web:3e9c43deefd44faf47ce6e",
      measurementId: "G-J04MGQ23JY"
    };


    firebase.initializeApp(firebaseConfig);
  }

    componentDidMount() {
    this.unsubAuth = firebase.auth().onAuthStateChanged(async user => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
            })
            this.contacts = firebase.firestore()
                .collection('contacts')
                .doc(this.state.uid);

            this.messages = firebase.firestore()
                .collection('messages')
                .doc(this.state.uid);

            this.messages.get()
                .then(doc => {
                    if (!doc.exists) {
                        this.messages.set({
                            messages: []
                        })
                    }
                })

            this.contacts.get()
                .then(doc => {
                    if (!doc.exists) {
                        this.contacts.set({
                            username: "",
                            _id: this.state.uid,
                            contacts: []
                        })
                    }
                })


            this.unsubMSG = this.messages.onSnapshot(this.updateMessages)
            this.unsubCONTACTS = this.contacts.onSnapshot(this.updateContacts)

        })
    }

    componentWillUnmount() {
      this.unsubAuth();
      this.unsubCONTACTS();
      this.unsubMSG();
    }

    sendMessage = (message) => {
        let error = false;
        message[0].createdAt = Date.now();

        try {
            const toSender = firebase.firestore()
                .collection('messages')
                .doc(message[0].to);

            toSender.get()
                .then(doc => {
                    if (doc.exists) {
                        toSender.update({
                            messages: firebase.firestore.FieldValue.arrayUnion(message[0])
                        })
                    }
                    else {
                        throw new Error("Message targeted for user that doesnt exist! Canceling send...")
                    }
                })
        }
        catch {
            error = true;
        }
        finally {
            if (!error) {
                this.messages.update({
                    messages: firebase.firestore.FieldValue.arrayUnion(message[0])
                })
            }

        }

    }

    updateMessages = (querySnapshot) => {
        const data = querySnapshot.data();
        if (data) {
            const reverse = data.messages.reverse();
            this.setState({
                messages: data.messages
            })
        }
    }



    updateContacts = (querySnapshot) => {
        const data = querySnapshot.data();
        if (data) {
            this.setState({
                username: data.username,
                contacts: data.contacts
            })
        }
    }


    setUsername = (username) => {
        this.contacts.update({
            username: username
        })
    }

    searchContact = (query) => {
      const db = firebase.firestore().collection("contacts");

            db.where("username", "==", query).get()
                .then(snapshot => {
                    console.log("query: " + query)
                    if (snapshot.empty) {
                        console.log("no users")
                        DeviceEventEmitter.emit("searchContact", null)
                    }
                    snapshot.forEach(doc => {
                        const data = doc.data()
                        console.log("found result");
                        DeviceEventEmitter.emit("searchContact", data)
                    })
                });

    }

    addContact = (contact) => {
      this.contacts.update({
          contacts: firebase.firestore.FieldValue.arrayUnion(contact)
      })
    }

    render() {
      //extra consists of universal methods accessible to entire app
      const extra = {
            sendMSG: (message) => this.sendMessage(message),
            getUser: {username: this.state.username, uid: this.state.uid},
            setUser: (username) => this.setUsername(username),
            addContact: (contact) => this.addContact(contact),
            searchUser: (query) => this.searchContact(query)
        }
    return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SignIn"
                >
            <Stack.Screen
                name="SignIn"
                >{props => <SignIn {...props} extra={extra} />}
            </Stack.Screen>
            <Stack.Screen
                name="Contacts"
                >{props => <Contacts {...props} contacts={this.state.contacts} messages={this.state.messages} extra={extra} />}
            </Stack.Screen>
            <Stack.Screen
                name="Chat"
                >{props => <Chat messages={this.state.messages} {...props} extra={extra} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
    )
  }
}
export default App;
