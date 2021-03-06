import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
const firebase = require('firebase');
require('firebase/firestore');
import * as Location from 'expo-location';

/**
 * @module CustomActions
 * @description Actions menu for gifted chat.
 * */
class CustomActions extends React.Component {
    constructor() {
        super();
        this.state= {
            image: null
        }
    }

    componentDidUpdate() {
        if (!this.props.imgStatus && this.state.image) {
            this.setState({image: null})
        }
    }
    /**
     * @function onActionPress
     * @description toggles Action menu from gifted chat with options.
     */
    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        await this.pickImage();
                        return;
                    case 1:
                        await this.takeImage();
                        return;
                    case 2:
                        await this.sendLocation();
                    default:
                }
            },
        );
    };
    /**
     * @function sendLocation
     * @async
     * @description function to retrieve location object containing latitude and longitude and pass
     * values to chat screen.
     */
    sendLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if(status === 'granted') {
            let result = await Location.getCurrentPositionAsync({
                enableHighAccuracy:true
            });

            if (result) {
                this.props.sendLocation(result)
            }
        }
    }

    /**
     * @function pickImage
     * @async
     * @description prompts permission for camera roll then passes image picked to saveImg function.
     */

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if(status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
            }).catch(error => console.log(error));

            await this.saveImg(result)

        }
    }
    /**
     * @function pickImage
     * @async
     * @description prompts permission for camera. then passes image taken to saveImg function.
     */
    takeImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const status2 = await Permissions.askAsync(Permissions.CAMERA);

        if(status === 'granted' && status2.status === 'granted') {
            let result = await ImagePicker.launchCameraAsync()

            await this.saveImg(result)
        }
    }

    /**
     * @function saveImg
     * @async
     * @param image
     * accepts image as param.
     * @description Uploads image to firebase then passes the url of the image as props to chatapp.
     */
    saveImg = async (result) => {
        if (!result.cancelled) {

            const response = await fetch(result.uri);
            const blob = await response.blob();
            const ref = firebase.storage().ref().child("g");
            const snapshot = await ref.put(blob);
            const download = await snapshot.ref.getDownloadURL();
            this.props.imgQued(download);
            this.setState({
                image: download
            });

        }
    }
    render() {
        return (
            <View>
                {this.state.image ?
                <View style={{marginBottom: 25, marginLeft: 10}}>
                     <Image style={{width: 35, height: 35, marginTop: 10}} source={{uri: this.state.image}}/>
                </View>
                    : null}
            <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',

    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};
export default CustomActions;
