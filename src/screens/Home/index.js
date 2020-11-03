import React from 'react';
import useViewModel from './methods';
import {observer} from 'mobx-react';
import Container from '@/components/Container';
import BackgroundImage from '@/components/BackgroundImage';
import BackgroundMaskImage from '@/components/BackgroundMaskImage';
import LogoImage from '@/components/LogoImage';
import Images from "@/styles/Images";
import Colors from '@/styles/Colors';
import {scale} from '@/styles/Sizes';
import {StyleSheet, TouchableHighlight, View, Text, TouchableOpacity} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import Space from '@/components/Space';
import __ from '@/assets/lang';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Home = (props) => {
  const vm = useViewModel(props);

  return (
    <Container>
      <BackgroundImage source={Images.background.mask_bg} resizeMdoe="cover"/>

      <View style={styles.container}>

        <Text style={styles.description}>
          BADEN
        </Text>
        <TouchableHighlight style={styles.whiteButton1} onPress={vm.onPressSignUp}>
          <Text style={styles.buttonLabel}>
            {__('sign_up')}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.whiteButton2} onPress={vm.onPressLogin}>
          <Text style={styles.buttonLabel}>
            {__('login')}
          </Text>
        </TouchableHighlight>
        <Space height={hp('12%')}/>
        <Text style={styles.note}>
          {__('app_note')}
        </Text>
      </View>
    </Container>
  )
};


const styles = StyleSheet.create({
  bottomButton: {
    position: 'absolute',
    //top: 20,
    left: 20 * scale,
    bottom: 30 * scale,
    right: 20 * scale,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: Colors.white2,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: hp('2%')
  },
  whiteButton1: {
    backgroundColor: '#000000',
    width: wp('90%'),
    height: hp('8%'),
    padding: 18 * scale,
    margin: 10 * scale,
    borderRadius: wp('15%'),
    alignContent: 'center',
    justifyContent: 'center',
  },
  whiteButton2: {
    backgroundColor: '#0e0e0e',
    width: wp('90%'),
    height: hp('8%'),
    padding: 18 * scale,
    margin: 10 * scale,
    borderRadius: wp('15%'),
    alignContent: 'center',
    justifyContent: 'center',
  },
  whiteLabel: {
    color: '#FFF',
    fontWeight: 'bold',
    marginVertical: hp('2%'),
    fontSize: hp('2%')
  },
  description: {
    color: '#FFF',
    fontFamily: 'lucida grande, tahoma, verdana, arial, sans-serif',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: hp('8%'),
    marginVertical: hp('8%')
  },
  note: {
    position: 'absolute',
    width: wp('100%'),
    bottom: hp('0%'),
    backgroundColor: 'black',
    color: '#f0f4f4',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: hp('2%'),
    lineHeight: hp('3.5%'),
  }
});

export default observer(Home);
