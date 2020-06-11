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
import NetInfo from "@react-native-community/netinfo";

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
        connected: false,
        messages: [],
        filteredMessages: [],
        username: "",
        uid: "",
        queryContact: "",
        appColor: {}
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

    async componentDidMount() {
        NetInfo.fetch().then(state => {
            if(!state.isConnected) {
                this.offlineData();
            }
        });

      this.testInternet();
      const color = await this.localStorage("get","appColor")
        if (color) {
            this.changeAppColor(color)
        }
        else {
            this.changeAppColor("white")
        }
    }

    componentWillUnmount() {
        if (this.unsubAuth) {
            this.unsubAuth();
        }
        if (this.unsubMSG) {
            this.unsubMSG();
        }
        if (this.unsubCONTACTS) {
            this.unsubCONTACTS();
        }
        this.unsubscribeWeb();
    }


    async testInternet() {
        this.unsubscribeWeb = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (state.isConnected && !this.state.connected) {
                this.setState({connected: true})
                this.SignIn()
            }
            if (!state.isConnected && this.state.connected) {
                this.setState({connected: false})
                this.offlineData()
            }
        });
    }

    SignIn = async () => {
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

    async offlineData() {
      const messages = await this.localStorage("get", "messages");
      const contacts = await this.localStorage("get", "contacts");
      const userinfo = await this.localStorage("get", "userInfo");

      const messagesExists = messages ? JSON.parse(messages) : [];
      const contactsExists = contacts ? JSON.parse(contacts) : [];
      const userinfoExists = userinfo ? JSON.parse(userinfo) : {username: "offline", uid: ""};



      this.setState({
          messages: messagesExists,
          contacts: contactsExists.contacts,
          username: userinfoExists.username,
          uid: userinfoExists.uid
      })

    }

    //async reusable function for getting and setting items to local storage.
    async localStorage(type, key,  value) {
        if (type === "get") {
            let val;
            try {
                val = await AsyncStorage.getItem(key);
                return val;
            }
            catch {
                console.log("An error has occurred while getting item. ")
                if (key === "color") { //safeguard check if error occurs in getting ui color
                    return "white"; //default UI color
                }
                return;
            }

        }
        if (type === "set") {
            try {
                await AsyncStorage.setItem(key, value)
            }
            catch {
                Alert.alert("Error", "An error has occurred while saving preferences!")
            }

            return;
        }
    }




    sendMessage = (message) => {
        let error = false;
        const target = message[0].to
        message[0].createdAt = Date.now();

        if (this.state.connected) {
            try {
                const toSender = firebase.firestore()
                    .collection('messages')
                    .doc(message[0].to);

                toSender.get()
                    .then(doc => {
                        if (doc.exists) {

                            toSender.update({
                                [this.state.uid]: firebase.firestore.FieldValue.arrayUnion(message[0])
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
                        [target]: firebase.firestore.FieldValue.arrayUnion(message[0])
                    })
                }
            }
        }

    }

    updateMessages = (querySnapshot) => {
        const data = querySnapshot.data();

        if (data) {
            this.setState({
                messages: data
            })
            this.localStorage("set", "messages", JSON.stringify(data))
        }

    }


    updateContacts = (querySnapshot) => {
        const data = querySnapshot.data();
        if (data) {
            this.setState({
                username: data.username,
                contacts: data.contacts
            })
            this.localStorage("set", "contacts", JSON.stringify(data))
        }
    }


    setUsername = (username) => {
        if (this.state.connected) {
            this.contacts.update({
                username: username
            })
            const data = {username: username, uid: this.state.uid}
            this.localStorage("set", "userInfo", JSON.stringify(data))
        }
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

    changeAppColor = (color) => {
        switch(color) {
            case "white":
                var temp = {
                    modalBG: "white",
                    button: "#E3E0C9",
                    header: "#D6D6D6",
                    text: "black",
                    background: "white",
                    message: {
                        left: {background: "#6FEF25", text: "black", time: "grey"},
                        right: {background: "#22ABDE", text: "black", time: "grey"},
                        system: 'grey'
                    }

                }
                this.setState({appColor: temp});
                break;

            case "black":
                var temp = {
                    modalBG: "#6D6B6B",
                    button: "#97A0B0",
                    header: "#6D6B6B",
                    text: "white",
                    background: "black",
                    message: {
                        left: {background: "white", text: "black", time: "grey"},
                        right: {background: "grey", text: "black", time: "#ccc3ca"},
                        system: "#647ef2"
                    }
                }
                this.setState({appColor: temp});
                break;
            case "blue":
                var temp = {
                    modalBG: "#89D7F2",
                    button: "#4fb7d9",
                    header: "#4f77db",
                    text: "black",
                    background: "#1BDAED",
                    message: {
                        left: {background: "#ffb49d", text: "black", time: "#49a2a8"},
                        right: {background: "#9dfff8", text: "black", time: "#49a2a8"},
                        system: '#647ef2'
                    }
                }
                this.setState({appColor: temp});
                break;
            case "red":
                var temp = {
                    modalBG: "#F5927A",
                    button: "#B20000",
                    header: "#C02C2C",
                    text: "#00014F",
                    background: "#E48982",
                    message: {
                        left: {background: "#05A705", text: "black", time: "#ccc3ca"},
                        right: {background: "#9B04AD", text: "black", time: "#ccc3ca"},
                        system: '#647ef2'
                    }
                }
                this.setState({appColor: temp});
                break;
        }
        this.localStorage("set", "appColor", color)

    }


    render() {
      //extra consists of universal methods accessible to entire app
      const extra = {
            sendMSG: (message) => this.sendMessage(message),
            getUser: {username: this.state.username, uid: this.state.uid},
            setUser: (username) => this.setUsername(username),
            addContact: (contact) => this.addContact(contact),
            searchUser: (query) => this.searchContact(query),
            setColor: (color) => this.changeAppColor(color),
            getColor: this.state.appColor,
            getConnection: this.state.connected


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
                >{props => <Chat {...props} messages={this.state.messages} extra={extra} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
    )
  }
}
export default App;
