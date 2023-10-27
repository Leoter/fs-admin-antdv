import { AddReq, DelReq, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
// import _ from "lodash-es";
import { request } from "/src/api/service";
import { commonEnv } from '/@/utils/util.common.env';

const apiPrefix = commonEnv.SERVICE_UAA + "/sys/users";

export async function GetList(query: any) {
    return request({
        url: apiPrefix + "/index",
        method: "post",
        data: query
    });
}


export async function AddObj(obj: any) {
    return request({
        url: apiPrefix + "/create",
        method: "post",
        data: obj
    });
}

export async function UpdateObj(obj: any) {
    return request({
        url: apiPrefix + "/update",
        method: "post",
        data: obj
    });
}

export async function DelObj(ids: any) {
    console.log("@id", ids);

    return request({
        url: apiPrefix + "/delete",
        method: "post",
        data: {
            ids
        }
    });
}

export async function GetObj(id: any) {
    return request({
        url: apiPrefix + "/info",
        method: "post",
        params: { id }
    });
}


export async function RelateObj(roleId: string, userIds: any) {
    return request({
        url: apiPrefix + "/relate/user",
        method: "post",
        data: { "roleId": roleId, "userIds": userIds }
    });
}

export async function UnRelateObj(roleId: string, userIds: any) {
    return request({
        url: apiPrefix + "/un/relate/user",
        method: "post",
        data: { "roleId": roleId, "userIds": userIds }
    });
}

/**
 * 获取角色权限资源
 * @param roleId
 * @returns {*}
 * @constructor
 */
export function getPermissionIds(roleId: any) {
    return request({
        url: apiPrefix + "/getPermissionIds",
        method: "post",
        params: { id: roleId }
    });
}

/**
 * 授权
 * @param roleId
 * @param permissionIds
 * @returns {*}
 * @constructor
 */
export function DoAuthz(roleId: any, permissionIds: any) {
    return request({
        url: apiPrefix + "/authz",
        method: "post",
        data: { roleId, permissionIds }
    });
}
