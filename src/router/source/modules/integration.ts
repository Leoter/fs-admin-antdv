export const integrationResources = [
  {
    title: "集成",
    name: "integration",
    path: "/integration",
    redirect: "/integration/bpmn",
    meta: {
      icon: "ion:apps-sharp",
      permission: "sys:auth"
    },
    children: [
      {
        title: "FsBpmn",
        name: "FsBpmn",
        path: "/integration/bpmn",
        component: "/integration/bpmn/index.vue",
        meta: {
          icon: "ion:disc-outline",
          permission: "sys:auth"
        }
      }
    ]
  }
];
