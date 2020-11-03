import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '@/constants/Navigation';
import ImagePicker from 'react-native-image-picker';
import __ from '@/assets/lang';
import {Platform, PermissionsAndroid} from 'react-native';
import {carMockTypes} from '@/constants/MockUpData';
import {useStores} from "@/hooks";

function useViewModel(props) {
  const nav = useNavigation(props);
  const tag = 'Screens::ShareMoreDetails';


  const {user, data} = useStores();
  const [carName, setCarName] = useState(user.carName);
  const [avatarSource, setAvatarSource] = useState('');

  const onPressSubmit = async () => {
    try {
      console.log('carName=>', carName)
      await user.updateProfile(carName, avatarSource);
      nav.navigate(Screens.addLocation)
    } catch (e) {
      console.log(tag, 'OnPressSubmit, Ex', e.message)
    }
  };

  const onPressChoose = async () => {
    const tag = 'ShareMoreDetails::onPressChoose()';

    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);

        const cameraGrant = grants[PermissionsAndroid.PERMISSIONS.CAMERA];
        if (cameraGrant === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(tag, 'You can use camera')
        } else {
          console.log(tag, 'Camera permission denied')
        }

        const storageGrant = grants[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
        if (storageGrant === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use store photos and videos')
        } else {
          console.log('Storage permission denied')
        }

      } catch (e) {
        console.log(tag, 'error', e.message);

      }
    }
    const options = {
      title: __('select_photo'),
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log(tag, 'User cancelled image picker');
      } else if (response.error) {
        console.log(tag, 'ImagePicker error: ', response.error);
        alert(response.error)
      } else if (response.customButton) {
        console.log(tag, 'User tapped custom button: ', response.customButton);
      } else {
        setAvatarSource({uri: 'data:image/jpeg;base64,' + response.data});
      }
    })
  };

  useEffect(() => {
    getVehicleName();
    if (user.carUrl) {
      setAvatarSource({uri: user.carUrl})
    }
  }, []);
  let carTypes = [];
  data.vehicleName.map(item => {
    carTypes.push({
      label: item.fullName,
      value: item.id,
    })
  });
  const getVehicleName = async () => {

    await data.getVehicleName(user.sessionToken);
    if (data.lastStatus === "401") {
      alert(__('session_expired'));
      user.logOut();
      nav.navigate(Screens.logIn);
      return;
    }
    // data.vehicleName.map(item => {
    //   carTypes.push({
    //     label: item.id,
    //     value: item.fullName,
    //   })
    // });
  }

  return {
    user, data,
    carTypes,
    carName, setCarName,
    avatarSource, setAvatarSource,
    onPressSubmit,
    onPressChoose,
    getVehicleName,
  }
}

export default useViewModel;
