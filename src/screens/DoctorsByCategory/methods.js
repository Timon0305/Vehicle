import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {DoctorStackScreens, PillStackScreens, Screens} from '@/constants/Navigation';
import {useStores} from '@/hooks';
import {SPECIALITIES} from '@/constants/MockUpData';
import Config from '@/config/AppConfig';
import __ from '@/assets/lang';
import awaitAsyncGenerator from '@babel/runtime/helpers/esm/awaitAsyncGenerator';

function useViewModel(props) {
    const tag = 'Screens::DoctorsByCategory';

    const nav = useNavigation(props);
    const [requestList, setRequestList] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [visible, setVisible] = useState(false);
    const [isSendDialogVisible, setIsSendDialogVisible] = useState(false);
    const [isCancelDialogVisible, setIsCanCelDialogVisible] = useState(false);
    const [offerId, setOfferId] = useState();
    const {user, data} = useStores();

    useEffect(() => {
        getRequestList();
    }, []);

    const getRequestList = async () => {
        await data.getOfferList(user.sessionToken);
        if (data.lastStatus === '401') {
            alert(__('session_expired'));
            user.logOut();
            nav.navigate(Screens.logIn);
            return;
        }
        setRequestList(data.offerRequestList);
    };

    const seeOffer = async (id) => {

    };

    const checkLocation = async (id) => {
        setOfferId(id);
        setVisible(true)
    }

    const sendPrice = async (id) => {
        setOfferId(id);
        setIsSendDialogVisible(true)
    };

    const cancelRequest = async () => {

    };

    const modalCancel = async () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setIsCanCelDialogVisible(false)
    }

    const setPrice = () => {
        console.log('asdf')
    }

    const removeRequest = () => {
        setIsCanCelDialogVisible(true)
    }

    const removeApprove = () => {
        console.log('Successfully Removed');
        setIsCanCelDialogVisible(false)
    }

    const sentPriceCancel = () => {
        setIsSendDialogVisible(false)
    }

    const sentPrice = async () => {
        if (!offerPrice) {
            Alert.alert('Validation', 'Input Price');
            return false;
        }
        await data.sentPriceToClient(user.sessionToken, offerId, offerPrice)
        setIsSendDialogVisible(false)
    }

    return {
        requestList, setRequestList,
        user, data,
        visible, setVisible,
        isSendDialogVisible, setIsSendDialogVisible,
        isCancelDialogVisible, setIsCanCelDialogVisible,
        offerPrice, setOfferPrice,
        offerId, setOfferId,
        getRequestList,
        seeOffer,
        sendPrice,
        cancelRequest,
        modalCancel,
        checkLocation,
        handleCancel,
        setPrice,
        removeRequest,
        removeApprove,
        sentPriceCancel,
        sentPrice
    };
}

export default useViewModel;
