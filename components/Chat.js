import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight } from 'react-native';
import Button from 'react-native-button'
import { GiftedChat, SystemMessage } from "react-native-gifted-chat";

class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }

    onSend= (message) => {
        message[0].to = this.props.route.params.friendID
        this.props.extra.sendMSG(message)
    }

    render() {
        let name = this.props.route.params.contact;

        this.props.navigation.setOptions({
            title: name,
            headerTitleStyle: {fontSize: 20, fontWeight: "bold", textTransform: "capitalize"},
            headerStyle: {backgroundColor: "grey"},
        });

        return (
            <View style={{flex:1,height: '100%', backgroundColor: "#c2c2c2"}}>
                <GiftedChat
                    messages={this.props.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        username: this.props.extra.getUser.username,
                        _id: this.props.extra.getUser.uid,
                        avatar: 'https://placeimg.com/140/140/any',
                    }}

                />
            </View>
        )
    }
}
export default Chat;
