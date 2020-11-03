import React from 'react';
import {observer} from 'mobx-react';
import {View, TextInput, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Text, ScrollView} from 'react-native';
import __ from '@/assets/lang';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import BoardWithHeader from '@/components/Panel/BoardWithHeader';
import useViewModel from './methods';
import Loading from '@/components/Loading';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, {PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import BlackButton from '@/components/Button/BlackButton';

const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

const AddLocation = (props) => {
    const vm = useViewModel(props);
    return (

        <BoardWithHeader title='Add Location'>
            {vm.data.isProcessing ?
                <Loading/>
                :
                <View style={{width: wp('100%'), position: 'absolute', top: 0, marginTop: hp('0%')}}>
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        fetchDetails={true}
                        styles={{
                            width: wp('90%'),
                            textInputContainer: {
                                backgroundColor: 'grey',
                            },
                            zIndex: 1000,
                            textInput: {
                                height: 38,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                        }}
                        onPress={(data, details = null) => {
                            console.log(data.description)
                            console.log(details.geometry.location.lat, details.geometry.location.lng);
                            const latitude = details.geometry.location.lat;
                            const longitude = details.geometry.location.lng;
                            vm.setInitialLocation({latitude, longitude, latitudeDelta, longitudeDelta});
                            vm.setAddress(data.description)
                        }}
                        query={{
                            key: 'AIzaSyD8OJWvqCanCoFm8ZQM8YFOaxIlAHwUIcQ',
                            language: 'en',
                            components: 'country:sa',
                        }}
                    />
                    <MapView
                        style={styles.locationPicker}
                        initialRegion={vm.initialLocation}
                        region={vm.initialLocation}
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
                            coordinate={vm.initialLocation}
                            title={vm.address}
                        />
                    </MapView>
                    <View style={styles.buttonPress}>
                        <BlackButton  onPress={vm.myLocation} caption='Set Location'/>
                    </View>
                </View>
            }
        </BoardWithHeader>
    );
};

const styles = StyleSheet.create({
    locationPicker: {
        width: wp('100%'),
        height: hp('85%'),
        zIndex: 999
    },
    buttonPress : {
        position: 'absolute',
        width: wp('100%'),
        bottom: -3,
        zIndex: 9999,
        backgroundColor: 'black',
        color: '#f0f4f4',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: hp('2%'),
        lineHeight: hp('3.5%'),
    }
})

export default observer(AddLocation);
