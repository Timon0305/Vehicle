import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, ImageBackground} from "react-native";
import Colors from '@/styles/Colors';
import {scale} from '@/styles/Sizes';
import {heightPercentageToDP} from "react-native-responsive-screen";

const BlackButton = ({caption, onPress}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.caption}>
                {caption}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'black',
        borderRadius: heightPercentageToDP('2%'),
    },
    caption: {
        color: Colors.white2,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 9 * scale,
        fontSize: heightPercentageToDP('2.3%'),
    }
});

export default BlackButton;
