import React from 'react';
import useViewModel from './methods';
import {observer} from 'mobx-react';
import Colors from '@/styles/Colors';
import {StyleSheet,  View, TouchableOpacity, KeyboardAvoidingView,Image} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import BlueButton from '@/components/Button/BlueButton';
import TransBlueButton from '@/components/Button/TransBlueButton';
import ImageButton from '@/components/Button/ImageButton';
import IconButton from '@/components/Button/IconButton';
import Space from '@/components/Space';
import DropDownPicker from 'react-native-dropdown-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    uploadButton: {
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'column',
        width: wp('80%'),
        justifyContent: 'flex-start'
    },
    image: {
        width: hp('30%'),
        height: hp('30%'),
    },
    dropDownContainer: {
        height: hp('6%'),
        marginVertical: hp('1%'),
    },
    dropDownItem: {
        justifyContent: 'flex-start',
    },
    dropDown: {
        backgroundColor: Colors.grey_light,
        borderWidth: 0,
    },
    dropDownBack: {
        borderWidth: 0,
        backgroundColor: Colors.grey_light,
    },
    dropDownLabel: {
        backgroundColor: Colors.grey_light,
        color: Colors.grey_dark,
        fontSize: hp('2.2%'),
    },
    textInputContainer: {
        flexDirection: 'row',
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        height: 44,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 15,
        flex: 1,
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#c8c7cc',
        borderTopWidth: 0.5,
    },
    powered: {},
    listView: {},
    row: {
        backgroundColor: '#FFFFFF',
        padding: 13,
        height: 44,
        flexDirection: 'row',
    },
    separator: {
        height: 0.5,
        backgroundColor: '#c8c7cc',
    },
    description: {},
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
});

const ShareModeDetails = (props) => {
    const vm = useViewModel(props);

    console.log(vm.avatarSource.uri);
    return (
        <BoardWithHeader title={__('share_more_details')}>
            <TransBlueButton onPress={vm.onPressChoose} caption='Upload your Car Image'/>
            <View style={styles.socialContainer}>
                {vm.avatarSource && vm.avatarSource.uri ?
                    <ImageButton image={{uri: vm.avatarSource.uri}} imageStyle={styles.image}
                                 onPress={vm.onPressChoose}/>
                    :
                    <IconButton name={'camera'} size={hp('8%')} color={Colors.white2} style={styles.uploadButton}
                                iconStyle={{opacity: 0.7, margin: hp('3%')}} onPress={vm.onPressChoose}/>
                }
            </View>
            <View style={{width: '90%', ...(Platform.OS !== 'android' && {zIndex: 40})}}>
                <DropDownPicker
                    items={vm.carTypes}
                    style={styles.dropDownBack}
                    containerStyle={styles.dropDownContainer}
                    itemStyle={styles.dropDownItem}
                    dropDownStyle={styles.dropDown}
                    labelStyle={styles.dropDownLabel}
                    onChangeItem={item => vm.setCarName(item.value)}
                    placeholder='Select Vehicle Name'
                />
            </View>
            <Space height={hp('3%')}/>
            <View style={{width: '90%'}} key={3}>
                <BlueButton onPress={vm.onPressSubmit} caption={__('submit')}/>
            </View>
            <Space height={26}/>
        </BoardWithHeader>
    );
};

export default observer(ShareModeDetails);
