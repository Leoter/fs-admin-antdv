import router from "/src/router";
import { useUserStore } from "/@/store/modules/user";
import { usePermissionStore } from "./store.permission";
import util from "./util.permission";
import { message } from "ant-design-vue";
import NProgress from "nprogress";
import { usePageStore } from "/@/store/modules/page";

export function registerRouterHook() {
  // 注册路由beforeEach钩子，在第一次加载路由页面时，加载权限

  // const permissionStoreE = usePermissionStore();
  // const userPermissionList = permissionStoreE.getPermissions;

  // if (userPermissionList.length == 0) {
  //   //没有权限          
  //   message.warn("请登录");
  //   // throw new Error("对不起，您没有权限");
  //   // NProgress.done();
  //   router.push("/login");
  //   return false;
  // }
  // console.log("@userPermissionList", userPermissionList.length);

  router.beforeEach(async (to, from, next) => {
    const permissionStore = usePermissionStore();

    console.log("@to", to);
    console.log("@from", router);
    console.log("@route", next);
    console.log("@permissionStore", permissionStore);
    console.log("@per bool", permissionStore.isInited);


    const userPermissionList = permissionStore.getPermissions;
    console.log("@userPermissionList", userPermissionList);

    console.log("@topath", to.fullPath);
    
    if (permissionStore.isInited) {
      if (to.meta.permission) {
        //校验权限
        // @ts-ignore
        if (!util.hasPermissions(to.meta.permission)) {
          //没有权限          
          message.warn("对不起，您没有权限");
          // throw new Error("对不起，您没有权限");
          NProgress.done();
          return false;
        }
      }
      next();
      return;
    }

    const userStore = useUserStore();
    const token = userStore.getToken;

    if (!token || token === "undefined") {
      next();
      return;
    }

    // 初始化权限列表
    try {
      console.log("permission is enabled");
      await permissionStore.loadFromRemote();
      console.log("PM load success");
      
      // clear tab
      const pageStore = usePageStore();
      pageStore.closeAll();
      next({ ...to, replace: true });
    } catch (e) {
      console.error("加载动态路由失败", e);
      next();
    }
  });
}
