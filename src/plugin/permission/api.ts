import { request } from "/src/api/service";
import { commonEnv } from '/@/utils/util.common.env';

const apiPrefix = commonEnv.SERVICE_UAA;

export async function getPermissions() {
  const ret = await request({
    url: apiPrefix + "/sys/permission/allPermission",
    method: "get"
  });
  // 如果使用你自己的后端，需要在此处将返回结果改造为本模块需要的结构
  // 结构详情，请参考示例中打印的日志 ”获取权限数据成功：{...}“ （实际上就是“资源管理”页面中列出来的数据）
  return ret;
}
