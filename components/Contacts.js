import React from 'react';
import {
    StyleSheet, Text, View, Alert, Image, FlatList, TouchableHighlight,
    TouchableOpacity, Modal, TextInput, DeviceEventEmitter
} from 'react-native';
import { Dimensions } from "react-native";
import Button from "react-native-button";
import Options from "./Options";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height;

class Contacts extends React.Component {
    constructor() {
        super();
        this.state = {
            toggleAdd: false,
            userSearch: "",
            errorMSG: "",
            showOptions: false
        }
    }

    componentDidMount() {
        this.eventListener = DeviceEventEmitter.addListener('searchContact', (event) => this.searchContactsCompleted(event));
    }

    componentWillUnmount(){
        //remove listener
        this.eventListener.remove();
    }



    listItem(title) {

        return (
            <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => {this.props.navigation.navigate("Chat", { contact: title.username, friendID: title.friendID})}}
                style={{ marginBottom:15, borderWidth:1, borderRadius: 5, backgroundColor: this.props.extra.getColor.button, height: 70}}
            >
                <Text style={[styles.title, {color: this.props.extra.getColor.text}]}>{title.username}</Text>
            </TouchableHighlight>
        );
    }

    userInitiateSearch = () => {
        if (this.state.userSearch.length > 2) {
            const trimInput = this.state.userSearch.replace(/^\s+|\s+$/gm,'');
            const lowerInput = trimInput.toLowerCase()
            this.props.extra.searchUser(lowerInput);
        }
        else {
            this.setState({
                errorMSG: "Usernames all have at least 2 digits!"
            })
        }

    }
    searchContactsCompleted = (data) => {
        if (data) {

            if (data.username != this.props.extra.getUser.username) {
                const newContact = {
                    username: data.username,
                    friendID: data._id
                }
                this.props.extra.addContact(newContact)
                this.setState({toggleAdd: false})
            }
            else {
                this.setState({errorMSG: "You cant add yourself as a contact.. i get it though."})
            }
        }
        else if (data === null) {
            this.setState({errorMSG: "Couldnt find a user with that name! Sorry!"})
        }
    }

    render() {
        this.props.navigation.setOptions({ title: "Contacts", headerTitleStyle:{fontSize: 20, fontWeight: "bold", color: this.props.extra.getColor.text}, headerStyle:{backgroundColor: this.props.extra.getColor.header}, headerRight: () => (
                <TouchableHighlight
                    onPress={() => this.setState({showOptions: true})}
                    style={{marginRight: 5}}
                    underlayColor="#DDDDDD">
                    <Image
                        style={{ width: 35, height: 35 }}
                        source={require('../assets/controls.png')}
                    />
                </TouchableHighlight>
            ), });
        return (
            <View style={{flex:1, backgroundColor: this.props.extra.getColor.background}}>
                <FlatList
                    data={this.props.contacts}
                    renderItem={({ item }) => this.listItem(item)}
                    keyExtractor={item => item.friendID}
                    style={styles.container}
                />

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.toggleAdd}
                        onRequestClose={() => {
                            this.setState({
                                errorMSG: "",
                                toggleAdd: false

                            })
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView, {backgroundColor: this.props.extra.getColor.modalBG}]}>
                                <Text style={styles.modalText}>Search for a friend!</Text>
                                <TextInput
                                    placeholder={"Username"}
                                    style={{padding: 5, alignSelf:"stretch",height: 40, backgroundColor: "white", borderColor: 'gray', borderWidth: 1 }}
                                    textAlign="center"
                                    textAlign="center"
                                    onChangeText={(text) => {
                                        this.setState({
                                            userSearch: text
                                        })
                                    }}
                                />
                                <Text style={{color: "red", marginTop: 5,textAlign:"center"}}>{this.state.errorMSG}</Text>
                                <View style={{flexDirection: "row",marginTop:10}}>
                                    <Button
                                        containerStyle={{marginTop:25, margin: 5, flex: 1,alignSelf:"center", marginBottom: 10, padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: this.props.extra.getColor.button}}
                                        style={{color: this.props.extra.getColor.text}}
                                        onPress={() => this.setState({toggleAdd: false, errorMSG: ""})}
                                    >Cancel</Button>
                                    <Button
                                        containerStyle={{marginTop:25, margin: 5, flex: 1,alignSelf:"center", marginBottom: 10, padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: this.props.extra.getColor.button}}
                                        style={{color: this.props.extra.getColor.text}}
                                        onPress={() => {
                                            this.userInitiateSearch()
                                        }}
                                    >Search</Button>
                                </View>

                            </View>
                        </View>
                    </Modal>
                </View>
                <Options showModal={this.state.showOptions} closeReq={() => this.setState({showOptions: false})} extra={this.props.extra}/>
                <View>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={()=> this.setState({toggleAdd: true})}
                        style={{marginRight:15, marginBottom:15, alignSelf: "flex-end"}}
                    >
                        <Image
                            style={{width:70,height:70}}
                            source={require('../assets/plus.png')}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    inputName: {
        height: 40,
        padding: 10,
        width: 235,
        marginBottom: 25,
        backgroundColor: "white",
        borderColor: 'cyan',
        borderWidth: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 25,
        fontSize: 25,
        textAlign: "center"
    },
    container: {
        flex: 1,
        padding: 10,
    },
    item: {
        backgroundColor: 'grey',
        padding: 20,
        marginVertical: 4,
        marginHorizontal: 16,
        width: width-35,
        height: 60
    },
    title: {
        fontSize: 32,
        marginTop: 10,
        alignSelf: "center",
        textTransform: "capitalize"
    },

})
export default Contacts;
