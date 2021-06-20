import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import visualizer from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import PurgeIcons from "vite-plugin-purge-icons";
import path from "path";
// https://vitejs.dev/config/
// 增加环境变量
process.env.VITE_APP_VERSION = require("./package.json").version;
process.env.VITE_APP_BUILD_TIME = require("dayjs")().format("YYYY-M-D HH:mm:ss");

export default ({ command, mode }) => {
  console.log("args", command, mode);

  let devAlias = [];
  if (mode === "debug") {
    devAlias = [
      { find: /@fast-crud\/fast-crud\/dist/, replacement: path.resolve("../fast-crud/src/") },
      { find: /@fast-crud\/fast-crud$/, replacement: path.resolve("../fast-crud/src/") },
      { find: /@fast-crud\/extends-uploader\/dist/, replacement: path.resolve("../extends/extends-uploader/src/") },
      { find: /@fast-crud\/extends-uploader$/, replacement: path.resolve("../extends/extends-uploader/src/") },
      { find: /@fast-crud\/ui-antdv$/, replacement: path.resolve("../ui/ui-antdv/src/") }
    ];
  }
  console.log("devAlias", devAlias);
  return {
    base: "/",
    plugins: [
      vueJsx(),
      vue(),
      viteCompression(),
      PurgeIcons({
        iconSource: "local",
        remoteDataAPI: "https://gitee.com/fast-crud/collections-json/raw/master/json",
        includedCollections: ["ion"]
      })
    ],
    // optimizeDeps: {
    //   exclude: ["@fast-crud/fast-crud-extends"],
    // },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    resolve: {
      alias: [...devAlias, { find: "/@", replacement: path.resolve("./src") }],
      dedupe: ["vue"]
    },
    build: {
      rollupOptions: {
        plugins: [visualizer()]
      }
    },
    server: {
      proxy: {
        // with options
        "/api": {
          target: "http://127.0.0.1:7001"
        }
      }
    }
  };
};
