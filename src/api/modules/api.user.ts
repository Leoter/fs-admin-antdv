import { request, requestForMock } from "../service";
import { env } from "/@/utils/util.env";
import { additionalInformationData } from '../../model/login'
import { commonEnv } from "/@/utils/util.common.env";
const apiPrefix = commonEnv.SERVICE_UAA;


/**
 * @description: Login interface parameters
 */
export interface LoginReq {
  username: string;
  password: any;
  userPassword: any;
}

export interface AdditionalInformation {
  id: string | number;
  username: string;
  nickName: string;
}

export interface LoginRes {
  token: string;
  expire: number;
}

export async function login(data: LoginReq): Promise<additionalInformationData> {
  if (env.PM_ENABLED === "false") {
    //没有开启权限模块，模拟登录
    return await requestForMock({
      url: "/login",
      method: "post",
      data
    });
  }
  //如果开启了登录与权限模块，则真实登录
  return await request({
    url: apiPrefix + "/user/login",
    method: "post",
    data
  });
}

export async function mine(): Promise<any> {
  if (env.PM_ENABLED === "false") {
    //没有开启权限模块，模拟登录
    return await requestForMock({
      url: "/sys/authority/user/mine",
      method: "post"
    });
  }
  return await request({
    url: "/sys/authority/user/mine",
    method: "post"
  });
}
