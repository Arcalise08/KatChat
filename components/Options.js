import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, Alert,
    Modal, TextInput, ImageBackground, Dimensions,
    TouchableHighlight
} from 'react-native';
import Button from "react-native-button";

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height;

function Options(props) {

    const [ modal, setModal ] = useState(false);

    useEffect(() => {
        if (props.showModal) {
            setModal(true)
        }
        else {
            setModal(false)
        }
    }, [props.showModal]);

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                    props.closeReq()
                }}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {backgroundColor: props.extra.getColor.modalBG}]}>
                        <Text style={[styles.modalText, {color: props.extra.getColor.text}]}>Options</Text>
                        <View>
                            <Text style={{marginBottom: 10,color: props.extra.getColor.text, fontSize: 15}}>{"\n"}UI Color</Text>
                            <View style={{flexWrap: 'wrap', flexDirection: 'row', borderWidth: 1, borderColor:'black'}}>
                                <TouchableHighlight onPress={() => props.extra.setColor("black")}>
                                    <View style={{width: 50, height: 50, borderRadius: 100/2, margin:5, backgroundColor: "black"}}/>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=> props.extra.setColor("white")}>
                                    <View style={{width: 50, height: 50, borderRadius: 100/2, margin:5, borderWidth: 2, borderColor: "black",backgroundColor: "white"}}/>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=> props.extra.setColor("blue")}>
                                    <View style={{width: 50, height: 50, borderRadius: 100/2, margin:5, borderWidth: 2, borderColor: "black",backgroundColor: "blue"}}/>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={()=> props.extra.setColor("red")}>
                                    <View style={{width: 50, height: 50, borderRadius: 100/2, margin:5, borderWidth: 2, borderColor: "black",backgroundColor: "#E48982"}}/>
                                </TouchableHighlight>
                            </View>
                            <Button
                                containerStyle={{marginTop:25, padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: props.extra.getColor.button}}
                                style={{color: props.extra.getColor.text}}
                                onPress={() => props.closeReq()}
                            >Done</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
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

export default Options;
