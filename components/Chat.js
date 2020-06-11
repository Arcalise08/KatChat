import React, {createRef} from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight } from 'react-native';
import Button from 'react-native-button'
import { GiftedChat, Day, SystemMessage, Bubble, Time, Message, InputToolbar } from "react-native-gifted-chat";
import CustomActions from "./CustomActions";
import MapView from 'react-native-maps';
import Random from 'expo-random';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null
        }
    }


    onSend = (message) => {
        if (this.state.image) {
            message[0].image = this.state.image
            this.setState({
                image: null
            })
        }

        message[0].to = this.props.route.params.friendID
        this.props.extra.sendMSG(message)
        console.log(message)
    }


    customSystemMessage(props, color) {
        return (
            <SystemMessage
                {...props}
                textStyle={{
                    color: color.system
                }}
            />
        );
    }

    customDay(props, color) {
        return (
            <Day
                {...props}
                textStyle={{
                    color: color.system
                }}
            />
        )
    }

    customBubble(props, color) {
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
                customTextStyle={{fontSize: 20, lineHeight: 40}} // or more it's depend whats font you use}
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
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    locationSend = (location, props) => {
        const random = props.messageIdGenerator()
        const messageTemplate = [{
            _id: random ,
            createdAt: new Date(),
            to: this.props.route.params.friendID,
            text: "",
            user: {
                username: this.props.extra.getUser.username,
                _id: this.props.extra.getUser.uid,
                avatar: "https://placeimg.com/140/140/any"
            },
            location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            },
        }]
        this.props.extra.sendMSG(messageTemplate)
    }

    imageQueued = (url) => {
        if (url) {
            this.setState({
                image: url
            })
        }
    }

    renderCustomActions = (props) => {
        return <CustomActions {...props} imgQued={(url) => this.imageQueued(url) } sendLocation={(location) => this.locationSend(location, props)} imgStatus={this.state.image}/>;
    };

    renderCustomView (props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            const coordinate = {
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude
            }
            return (
                <View style={{borderRadius: 25, width: 150, height: 100}}>
                    <MapView
                        style={{width: 130,
                            height: 85,
                            marginLeft: 10,
                            borderRadius: 50,
                            marginTop: 10}}
                        region={{
                            latitude: currentMessage.location.latitude,
                            longitude: currentMessage.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    ><MapView.Marker
                        coordinate={coordinate}
                    /></MapView>
                </View>
            );
        }
        return null;
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
                    renderCustomView={this.renderCustomView}
                    renderActions={this.renderCustomActions}
                    renderBubble={(props) => this.customBubble(props, this.props.extra.getColor.message)}
                    renderSystemMessage={(props) => this.customSystemMessage(props, this.props.extra.getColor.message)}
                    renderDay={(props) => this.customDay(props, this.props.extra.getColor.message)}
                    renderMessage={this.customMessage}
                    inverted={false}
                    user={{
                        username: this.props.extra.getUser.username,
                        _id: this.props.extra.getUser.uid,
                        avatar: "https://placeimg.com/140/140/any"
                    }}
                    renderTime={(props) => this.customTime(props, this.props.extra.getColor.message)}
                    renderInputToolbar={(props) => this.renderInputToolbar(props)}

                />
            </View>
        )
    }
}
export default Chat;
