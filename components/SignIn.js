import React from 'react';
import {
    StyleSheet, Text, View, Alert,
    Modal, TextInput, ImageBackground, Dimensions
} from 'react-native';
import Button from "react-native-button";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height;

class SignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            promptName: false,
            errorMSG: ""
        }
    }

    toChat = () => {
        if (this.props.extra.getUser.username.length <= 2) {
           this.setState({
               promptName: true
           })
        }
        else {
            this.props.navigation.navigate("Contacts", {name: this.props.extra.getUser.username})
        }
    }

    toChatFromPrompt = () => {
        if (this.state.username.length > 2) {
            this.setState({errorMSG: ""})
            try {
                const trimInput = this.state.username.replace(/^\s+|\s+$/gm,'');
                const lowerInput = trimInput.toLowerCase();
                this.props.extra.setUser(lowerInput);
            }
            catch {
                this.setState({
                    errorMSG: "There was an error setting your username!"
                })
            }
            finally {
                if (this.state.errorMSG === "") {
                    this.setState({
                        promptName: false
                    })
                    this.props.navigation.navigate("Contacts", {name: this.props.extra.getUser.username})
                }
            }

        }
        else {
            this.setState({errorMSG: "Your username should be at least 3 digits"})
        }


    }


    render() {
        return(
            <View style={{flex:1}}>
                <ImageBackground style={{width: width, height: height}} source={require('../assets/background.png')}>
                    <View style={{justifyContent:"center", alignItems:'center', marginTop: 25}}>
                        <Text style={{fontSize: 32, fontFamily:"monospace", fontWeight: "bold", }}>Kat Chat</Text>
                    </View>

                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.promptName}
                            onRequestClose={() => {
                                this.setState({
                                    promptName: false
                                })

                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Enter a display name.</Text>
                                    <TextInput
                                        placeholder={"Name"}
                                        style={{width: 120,padding: 5,height: 40, borderColor: 'gray', borderWidth: 1 }}
                                        textAlign="center"
                                        onChangeText={(text) => {
                                            this.setState({
                                                username: text
                                            })
                                        }}
                                    />
                                    <Text style={{color: "red"}}>{this.state.errorMSG}</Text>
                                    <View style={{flexDirection: "row",marginTop:10}}>
                                        <Button
                                            style={{color: "#24A9F0", marginRight: 20}}
                                            onPress={() => this.setState({promptName: false})}
                                        >Cancel</Button>
                                        <Button
                                            style={{color: "#24A9F0"}}
                                            onPress={() => {
                                                this.toChatFromPrompt();
                                            }}
                                        >Okay</Button>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <View style={{flex:1}}>
                        <Button containerStyle={{marginTop:25, alignSelf:"center", marginBottom: 10,width: 260, padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: "#31D13B"}}
                                style={{color: "black"}}
                                onPress={() => this.toChat()}>
                            Sign In
                        </Button>
                        <Button
                                style={{color: "black",fontWeight:"bold", fontSize: 12, marginTop: 15}}
                                onPress={() => {
                                    this.props.extra.setUser("")
                                    this.setState({promptName: true})
                                }}>
                            Don't like your display name? Click here to change it!
                        </Button>
                    </View>

                </ImageBackground>
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
    image: {
        flex: 1,
        width: "100%",
        justifyContent: "center"
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
        marginBottom: 15,
        textAlign: "center"
    }

})
export default SignIn;
