import React from 'react';
import {observer} from 'mobx-react';
import {
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import __ from '@/assets/lang';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import Space from '@/components/Space';
import {scale} from '@/styles/Sizes';
import Colors from '@/styles/Colors';
import useViewModel from './methods';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Separator from '@/components/Separator';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loading from '@/components/Loading';
import BlueButton from '@/components/Button/BlueButton';
import BlackButton from '@/components/Button/BlackButton';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Dialog from 'react-native-dialog';
import GreyInput from '@/components/Input/GreyInput';

const tag = 'Screens::RequestList';
const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

const DoctorsByCategory = (props) => {
    const vm = useViewModel(props);
    return (

        <BoardWithHeader title='Request List'>
            {vm.data.isProcessing ?
                <Loading/>
                :
                <ScrollView style={styles.container}>
                    <View>
                        <Text style={styles.title}>List of Open Requests</Text>
                    </View>
                    <Space height={hp('1%')}/>
                    <Separator color={Colors.grey} width={2}/>
                    <Space height={hp('2%')}/>
                    {vm.requestList && vm.requestList.length ? vm.requestList.map((item, index) => {
                            return (
                                <View key={index} style={{alignSelf: 'stretch', flex: 1}}>
                                    <RequestCard
                                        request={item}
                                        key={index}
                                        onPress={() => vm.checkLocation(item.clientId)}
                                        onPressSendPrice={() => vm.sendPrice(item.clientId)}
                                        onPressCancel={() => vm.removeRequest(item.clientId)}
                                    />
                                    <Space height={hp('2%')}/>
                                </View>
                            );
                        }) :
                        <Text>
                            <Text style={styles.listSubTitle}>
                                {'0 ' + 'result found'}
                            </Text>
                        </Text>
                    }
                    <Space height={hp('10%')}/>

                    <View style={styles.modalContainer}>
                        <Modal
                            animationType={'slide'}
                            transparent={false}
                            visible={vm.visible}
                            onRequestClose={() => {
                                vm.modalCancel();
                            }}
                        >
                            {vm.requestList && vm.requestList.length ? vm.requestList.map((item, index) => {
                                if (item.clientId === vm.offerId) {
                                    const latlng = {
                                        latitude: parseFloat(item.offerGeocoder.split(',')[0]),
                                        longitude: parseFloat(item.offerGeocoder.split(',')[1]),
                                        latitudeDelta: latitudeDelta,
                                        longitudeDelta: longitudeDelta,
                                    };
                                    return (
                                        <View key={index}>
                                            <MapView
                                                style={styles.locationPicker}
                                                initialRegion={latlng}
                                                provider={PROVIDER_GOOGLE}
                                                zoomEnabled={true}
                                                pitchEnabled={true}
                                                showsUserLocation={true}
                                                followsUserLocation={true}
                                                showsCompass={true}
                                                showsBuildings={true}
                                                showsTraffic={true}
                                                showsIndoors={true}
                                            >
                                                <Marker
                                                    coordinate={latlng}
                                                    title={item.offerLocation}
                                                    pinColor={'purple'}
                                                >
                                                </Marker>
                                            </MapView>
                                            <Text style={{position: 'absolute', top: 5, right: 5}} onPress={() => {
                                                vm.modalCancel();
                                            }}><Icon name={'times'} style={{fontSize: hp('3%')}}/></Text>
                                        </View>
                                    );
                                }
                            }) : <Text/>
                            }
                        </Modal>
                        <Dialog.Container visible={vm.isCancelDialogVisible}>
                            <Dialog.Title>Request Remove</Dialog.Title>
                            <Dialog.Description>
                                <View>
                                    <Text>
                                        Are you going to remove request?
                                    </Text>
                                </View>
                            </Dialog.Description>
                            <Dialog.Button onPress={vm.handleCancel} label="Cancel"/>
                            <Dialog.Button onPress={vm.removeApprove} label="Remove"/>
                        </Dialog.Container>

                        <Dialog.Container visible={vm.isSendDialogVisible}>
                            <Dialog.Title>Input your Price</Dialog.Title>
                            <Dialog.Description>
                                <View style={{width: wp('80%')}}>
                                    <GreyInput placeholder='SAR 100' value={vm.offerPrice}
                                               onChangeText={vm.setOfferPrice}
                                    />
                                </View>
                            </Dialog.Description>
                            <Dialog.Button onPress={vm.sentPriceCancel} label="Cancel"/>
                            <Dialog.Button onPress={vm.sentPrice} label="Confirm"/>
                        </Dialog.Container>
                    </View>
                </ScrollView>
            }
        </BoardWithHeader>
    );
};

export const RequestCard = ({request, onPress, onPressSendPrice, onPressCancel}) => {
    return (
        <View style={styles.requestItem}>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.requestRow}>
                    <Text style={styles.leftText}>Client Name:</Text>
                    <Text style={styles.rightText}>{request.clientName}</Text>
                </View>
                <View style={styles.requestRow}>
                    <Text style={styles.leftText}>Location:</Text>
                    <Text style={styles.rightText}>{request.offerLocation}</Text>
                </View>
                <View style={styles.requestRow}>
                    <Text style={styles.leftText}>Time:</Text>
                    <Text style={styles.rightText}>{request.offerTime}</Text>
                </View>
                <View style={styles.requestRow}>
                    <Text style={styles.leftText}>Status:</Text>
                    <Text style={styles.rightText}>{request.offerStatus}</Text>
                </View>
                {request.offerStatus === 'Response' ?
                    <View style={styles.requestRow}>
                        <Text style={styles.leftText}>Price:</Text>
                        <Text style={styles.rightText}>{ 'SAR ' + request.offerPrice}</Text>
                    </View> :
                    <View/>
                }
            </TouchableOpacity>
            <Space height={hp('2%')}/>
            <View style={styles.requestRow}>
                <View style={{width: wp('40%')}}>
                    <BlackButton onPress={onPressSendPrice} caption='Send Price'/>
                </View>
                <View style={{width: wp('40%')}}>
                    <BlackButton onPress={onPressCancel} caption='Cancel'/>
                </View>
            </View>
            <Space height={hp('1%')}/>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        flexDirection: 'column',
        padding: wp('5%'),
    },
    title: {
        fontSize: hp('2.4%'),
        fontWeight: 'bold',
    },
    listSubTitle: {
        fontWeight: 'bold',
        marginTop: hp('2%'),
        fontSize: wp('5%'),
    },
    requestItem: {
        borderColor: Colors.grey,
        borderWidth: 1,
        flex: 1,
        padding: 7 * scale,
    },
    requestRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftText: {
        width: wp('30%'),
        fontSize: hp('2.3%'),
        fontWeight: 'bold',
        padding: hp('1%'),
    },
    rightText: {
        width: wp('60%'),
        fontSize: hp('2.3%'),
    },
    modalContainer: {
        padding: wp('5%'),
        width: wp('80%'),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationPicker: {
        width: wp('100%'),
        height: hp('100%'),
    },
});
export default observer(DoctorsByCategory);
