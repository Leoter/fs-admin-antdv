import { defineStore } from "pinia";
import { store } from "../index";
import router from "../../router";
// @ts-ignore
import { LocalStorage } from "/src/utils/util.storage";
// @ts-ignore
import * as UserApi from "/src/api/modules/api.user";
// @ts-ignore
import { LoginReq, UserInfoRes } from "/@/api/modules/api.user";
import {  AdditionalInformation } from "/@/model/login"
import { Modal } from "ant-design-vue";
import { useI18n } from "vue-i18n";

import { mitter } from "/src/utils/util.mitt";
import { encryptPass } from "/@/utils/util.pass";

interface UserState {
  userInfo: Nullable<UserInfoRes>;
  token?: string;
}

const USER_INFO_KEY = "USER_INFO";
const TOKEN_KEY = "TOKEN";
export const useUserStore = defineStore({
  id: "app.user",
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined
  }),
  getters: {
    getUserInfo(): AdditionalInformation {
      return this.userInfo || LocalStorage.get(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || LocalStorage.get(TOKEN_KEY);
    }
  },
  actions: {
    setToken(info: string, expire: number) {
      this.token = 'bearer ' + info;
      LocalStorage.set(TOKEN_KEY, this.token, expire);
    },
    setUserInfo(info: AdditionalInformation) {
      console.log("@setUserInfo", info);
      
      this.userInfo = info;
      LocalStorage.set(USER_INFO_KEY, info);
    },
    resetState() {
      this.userInfo = null;
      this.token = "";
      LocalStorage.remove(TOKEN_KEY);
      LocalStorage.remove(USER_INFO_KEY);
    },
    /**
     * @description: login
     */
    async login(params: LoginReq): Promise<any> {
      try {
        params.password  = encryptPass(params.userPassword);
        params.userPassword = "";
        const data = await UserApi.login(params);

        const { value, expiration } = data.additionalInformation;
        
        // save token
        this.setToken(value, expiration);
        // get user info , no use because login will return
        // const userInfo = await this.getUserInfoAction();
        await router.replace("/");
        const userInfo = data.additionalInformation.additionalInformation;
        console.log("@userInfo", userInfo);
        this.setUserInfo(userInfo);
        // 事件总线传递，但是好像没找到定位的地方 定位应为 mitter.on("app.login")
        mitter.emit("app.login", { userInfo , token: value });
        return userInfo;
      } catch (error) {
        return null;
      }
    },
    async getUserInfoAction(): Promise<UserInfoRes> {
      const userInfo = await UserApi.mine();
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    logout(goLogin = true) {
      this.resetState();
      goLogin && router.push("/login");
      mitter.emit("app.logout");
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { t } = useI18n();
      Modal.config({
        iconType: "warning",
        title: t("app.login.logoutTip"),
        content: t("app.login.logoutMessage"),
        onOk: async () => {
          await this.logout(true);
        }
      });
    }
  }
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
