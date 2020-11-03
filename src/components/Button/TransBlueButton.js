import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet, ImageBackground} from "react-native";
import Colors from '@/styles/Colors';
import {scale} from '@/styles/Sizes';
import {heightPercentageToDP} from "react-native-responsive-screen";

const TransBlueButton = ({caption, onPress}) => {
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
  },
  caption: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: heightPercentageToDP('3%'),
  }
});

export default TransBlueButton;
