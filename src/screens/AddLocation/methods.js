import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {DoctorStackScreens, PillStackScreens, Screens} from '@/constants/Navigation';
import {useStores} from '@/hooks';
import axios from 'axios'
import Config from '@/config/AppConfig';
import __ from '@/assets/lang';
import awaitAsyncGenerator from '@babel/runtime/helpers/esm/awaitAsyncGenerator';
const latitudeDelta = 0.09;
const longitudeDelta = 0.09;

function useViewModel(props) {
    const nav = useNavigation(props);
    const {user, data} = useStores();
    const [initialLocation, setInitialLocation] = useState({
        latitude: 24.774265,
        longitude: 46.738586,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
    });
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState('');

    const myLocation = async () => {
        await user.addMyLocation(user.sessionToken, initialLocation, address)
        nav.navigate(Screens.userFlow)
    }

    return {
        user, data,
        initialLocation, setInitialLocation,
        address, setAddress,
        location, setLocation,
        myLocation,
    };
}

export default useViewModel;
