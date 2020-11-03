import {applySnapshot, flow, types} from "mobx-state-tree";
import {observable} from "mobx";
import {isEmpty} from 'lodash';
import {defNumber, defString} from './Types';
import Config from '@/config/AppConfig';
import 'mobx-react-lite/batchingForReactDom';
import * as Api from '@/Services/Api';
import * as SocialApi from '@/Services/SocialApi';
import AsyncStorage from "@react-native-community/async-storage";
import {Platform} from "react-native";
import __ from "../assets/lang";

// import * as Api from '@services/Api';

const tag = 'MST.User::';
let statusCode = 0;
const User = types
  .model('Driver', {
    sessionToken: defString,
    id: defString,
    email: defString,
    fullName: defString,
    password: defString,
    carName: defString,
    carUrl: defString,
    licenseUrl: defString,
    insuranceUrl: defString,
    phoneNumber: defString,
    accountType: defString,
    hadSignedUp: false,
    statusCode: 0,
    createdAt: defString,
    lastError: defString,
  })
  .views((self) => ({
    get isValid() {
      return !isEmpty(self.id) && !isEmpty(self.sessionToken) && !isEmpty(self.accountType)
    },
    get getStatusCode() {
      return self.statusCode;
    },
  }))
  .actions((self) => {
    const _updateFromLoginResponse = (data) => {
      // Copy data to store
      const {userDetails, sessionToken} = data;
      self.sessionToken = sessionToken;
      if (userDetails) {
        self.id = userDetails.id;
        self.fullName = userDetails.fullName;
        self.password = data.password;
        self.email = userDetails.email;
        self.phoneNumber = userDetails.phoneNumber;
        self.carName = userDetails.carName;
        self.location = userDetails.location;
        self.address = userDetails.address;
        self.carUrl = userDetails.carUrl.startsWith('http') ? userDetails.carUrl : Config.appBaseUrl + userDetails.carUrl;
        self.licenseUrl = userDetails.licenseUrl.startsWith('http') ? userDetails.licenseUrl: Config.appBaseUrl + userDetails.licenseUrl;
        self.insuranceUrl = userDetails.insuranceUrl.startsWith('http') ? userDetails.insuranceUrl: Config.appBaseUrl + userDetails.insuranceUrl;
        self.createdAt = userDetails.createdAt;
        self.accountType = userDetails.accountType;
        self.speciality = userDetails.speciality;
      }
    };

    const logIn = flow(function* logIn(email, password) {
      self.setLoggingIn(true);
      try {
        const deviceUserId = yield AsyncStorage.getItem(Config.oneSignalUserIDStorageKey);
        const deviceType = Platform.OS;
        const response = yield Api.logIn(email, password, deviceUserId, deviceType);
        let {data, ok} = response;
        console.log(tag, 'Response from Login', data);
        self.setLoggingIn(false);
        if (!ok) {
          self.statusCode = response.status;
          self.lastError = data.error;
          return;
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        } else {
          data.password = password;
          _updateFromLoginResponse(data);
        }
      } catch (e) {
        console.log(tag, 'Login Filed --', e.message)
      } finally {
        self.setLoggingIn(false);
      }
    });

    const logOut = flow(function* logOut() {
      try {
        const response = yield Api.logOut(self.sessionToken);
        console.log(tag, 'Response from Logout', response)
      } catch (e) {

      }

      // Just simply apply snapshot of empty object
      applySnapshot(self, {
        hadSignedUp: true,
      });
    });

    const signUp = flow(function* signUp(email, fullName, password, phoneNumber = "") {
      if (self.isValid) {
        yield logOut()
      }

      self.setLoggingIn(true);
      try {
        const deviceUserId = yield AsyncStorage.getItem(Config.oneSignalUserIDStorageKey);
        const deviceType = Platform.OS;
        const response = yield Api.register(email, fullName, password, phoneNumber, deviceUserId, deviceType);
        console.log(tag, 'Response from SignUp', response);
        let {data, ok} = response;
        // self.setLoggingIn(false);
        if (!ok) {
          self.statusCode = response.status;
          self.lastError = data.error;
          return;
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        } else {
          data.password = password;
          _updateFromLoginResponse(data);
        }
      } catch (e) {
        console.log(tag, 'SignUp Failed --', e.message);
      } finally {
        self.setLoggingIn(false);
      }
    });

    const updateProfile = flow(function* updateProfile(
        carName,
        avatarSource
    ) {

      // self.setLoggingIn(true);
      try {
        const response = yield Api.updateProfile(self.sessionToken, carName ,avatarSource);
        let {data, ok} = response;
        console.log(tag, 'Response from updateProfile', data);
        data.sessionToken = self.sessionToken;
        // self.setLoggingIn(false);
        if (!ok) {
          self.statusCode = parseInt(response.status);
          return;
        }
        if (!data) {
          alert(__('can_not_connect_server'));
        } else {
          _updateFromLoginResponse(data);
        }
      } catch (e) {
        console.log(tag, 'UpdateProfile Failed --', e.message);
      } finally {
        self.setLoggingIn(false);
      }

    });

    const addMyLocation = flow(function* myAddLocation(
        userToken, initialLocation, address
    ) {
      self.setLoggingIn(true);
      try {
        const response = yield Api.myAddLocation(userToken, initialLocation, address);
        const {ok, data} = response;
        data.sessionToken = userToken
        if (ok) {
          console.log('response all data', data)
          _updateFromLoginResponse(data);
        }
      } catch (e) {
        console.log(e.message)
      } finally {
        self.setLoggingIn(false);
      }
    })

    const load = (snapshot) => {
      try {
        applySnapshot(self, snapshot);
      } catch (e) {
        console.log('User.actions.load(): Load from snapshot failed');
      }
    };

    return {logIn, logOut, signUp, updateProfile, addMyLocation, load}
  })
  .extend((self) => {
    const localState = observable.box(false);
    return {
      views: {
        get isLoggingIn() {
          return localState.get();
        },
      },
      actions: {
        setLoggingIn(value) {
          localState.set(value)
        },
      },
    };
  });

export default User;
