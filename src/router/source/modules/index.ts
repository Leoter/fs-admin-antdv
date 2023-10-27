import LayoutPass from "/@/layout/layout-pass.vue";

export const indexResources = [
  {
    title: "首页",
    name: "index",
    path: "/index",
    component: "/framework/home/index.vue",
    meta: {
      icon: "ion:home-outline",
    },
    children: [
      {
        title: "首页",
        name: "index",
        path: "/index",
        component: "/framework/home/index.vue",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
        },
      },
      {
        title: "菜单管理",
        name: "menus",
        path: "/born/menus",
        component: "/born/menus/index.vue",
        meta: {
          icon: "ion:home-outline",
          // isMenu: true,
        },
      },
      {
        title: "地图测试",
        name: "map",
        path: "/framework/map",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
        },
      },
      {
        title: "用户管理",
        name: "user",
        path: "/born/user",
        component: "/born/user/index.vue",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
        },
      },
    ]
  }
];
