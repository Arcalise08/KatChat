import React, {createRef} from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight } from 'react-native';
import Button from 'react-native-button'
import { GiftedChat, Day, SystemMessage, Bubble, Time, Message, InputToolbar } from "react-native-gifted-chat";

class Chat extends React.Component {
    onSend= (message) => {
        message[0].to = this.props.route.params.friendID
        this.props.extra.sendMSG(message)
    }

    customSystemMessage (props, color) {
            return (
                <SystemMessage
                    {...props}
                    textStyle={{
                        color: color.system
                    }}
                />
            );
        }

        customDay (props, color) {
            return (
                <Day
                    {...props}
                    textStyle={{
                        color: color.system
                    }}
                />
            )
        }

        customBubble (props, color) {
                return (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: color.right.background,
                            },
                            left: {
                                backgroundColor: color.left.background
                            }
                        }}
                        textStyle={{
                            right: {
                                color: color.right.text,
                            },
                            left: {
                                color: color.left.text,
                            }
                        }}
                    />
                )
            }

            customMessage(props, color) {
                return (
                    <Message
                        {...props}
                        customTextStyle={{fontSize:20, lineHeight: 40}} // or more it's depend whats font you use}
                    />
                )
            }

            customTime(props, color) {
                return (
                    <Time
                        {...props}
                        timeTextStyle={{
                            right: {
                                color: color.right.time
                            },
                            left: {
                                color: color.left.time
                            }
                        }}
                    />
                )
            }

        renderInputToolbar(props) {
            if (this.props.extra.getConnection == false) {
                <Text style={{justifyContent: "center"}}>Currently offline!</Text>
            } else {
                return(
                    <InputToolbar
                        {...props}
                    />
                );
            }
        }


    render() {
        let name = this.props.route.params.contact;

        this.props.navigation.setOptions({
            title: name,
            headerTitleStyle: {fontSize: 20, fontWeight: "bold", textTransform: "capitalize", color: this.props.extra.getColor.text},
            headerStyle: {backgroundColor: this.props.extra.getColor.header},
        });

        return (
            <View style={{flex:1,height: '100%', backgroundColor: this.props.extra.getColor.background}}>
                <GiftedChat
                    messages={this.props.messages[this.props.route.params.friendID]}
                    onSend={messages => this.onSend(messages)}
                    renderBubble={(props) => this.customBubble(props, this.props.extra.getColor.message)}
                    renderSystemMessage={(props) => this.customSystemMessage(props, this.props.extra.getColor.message)}
                    renderDay={(props) => this.customDay(props, this.props.extra.getColor.message)}
                    renderMessage={this.customMessage}
                    inverted={false}
                    renderTime={(props) => this.customTime(props, this.props.extra.getColor.message)}
                    renderInputToolbar={(props) => this.renderInputToolbar(props)}
                    user={{
                        _id: this.props.extra.getUser.uid,
                        username: this.props.extra.getUser.username,
                        avatar: 'https://placeimg.com/140/140/any',
                    }}

                />
            </View>
        )
    }
}
export default Chat;
