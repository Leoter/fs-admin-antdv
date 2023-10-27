import LayoutPass from "/@/layout/layout-pass.vue";

export const sysResources = [
  {
    title: "系统管理",
    name: "sys",
    path: "/born/user",
    meta: {
      icon: "ion:settings-outline",
      permission: "sys"
    },
    children: [
      {
        title: "权限管理",
        name: "authority",
        path: "/sys/authority",
        redirect: "/sys/authority/permission",
        meta: {
          icon: "ion:ribbon-outline",
          //需要校验权限
          permission: "sys:auth"
        },
        children: [
          {
            title: "权限资源管理",
            name: "permissions",
            path: "/born/permissions",
            component: "/born/permissions/index.vue",
            meta: {
              icon: "ion:home-outline",
              //需要校验权限
              permission: "sys:auth:per:view"
            },
          },
          {
            title: "角色管理",
            name: "roles",
            path: "/born/role",
            component: "/born/role/index.vue",
            meta: {
              icon: "ion:home-outline",
              //需要校验权限
              permission: "sys:auth:per:view"
            },
          },
        ]
      },
      {
        title: "用户管理",
        name: "user",
        path: "/born/user",
        component: "/born/user/index.vue",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
          permission: "sys:auth"
        },
      },
      {
        title: "地图测试",
        name: "map",
        path: "/framework/map",
        component: "/framework/map/index.vue",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
          permission: "sys:auth"
        },
      },
      {
        title: "地图围栏测试",
        name: "fence",
        path: "/framework/map/fence",
        component: "/framework/map/fence/index.vue",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
          permission: "sys:auth"
        },
      },
      {
        title: "地图测距测试",
        name: "map",
        path: "/framework/map/c",
        component: "/framework/map/distence.vue",
        meta: {
          icon: "ion:home-outline",
          isMenu: true,
          permission: "sys:auth"
        },
      },
    ]
  }
];
