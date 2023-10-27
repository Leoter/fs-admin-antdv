import LayoutFramework from "/src/layout/layout-framework.vue";
import { crudResources } from "/@/router/source/modules/crud";
// import { uiResources } from "/@/router/source/modules/ui";
import { integrationResources } from "/@/router/source/modules/integration";
import { sysResources } from "/@/router/source/modules/sys";
import { indexResources } from "/@/router/source/modules/index";




export const frameworkResource = [
  {
    title: "框架",
    name: "framework",
    path: "/",
    redirect: "/index",
    component: LayoutFramework,
    meta: {
      icon: "ion:accessibility"
    },
    children: [
      // 首页
      ...indexResources,
      // crud
      ...crudResources,
      // 系统管理
      ...sysResources,
      // ...integrationResources,
      // ...uiResources
    ]
  },
];
console.assert(frameworkResource.length === 1, "frameworkResource数组长度只能为1，你只能配置framework路由的子路由");
