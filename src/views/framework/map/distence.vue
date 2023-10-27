<template>
  <div id="container"></div>
  <div class="input-card">
    <div class="input-card" style="width: 200px">
      <h4 style="margin-bottom: 10px; font-weight: 600">利用mouseTool绘制覆盖物</h4>
      <button class="btn" @click="drawPolyline()" style="margin-bottom: 5px">绘制线段</button>
      <button class="btn" @click="drawPolygon()" style="margin-bottom: 5px">绘制多边形</button>
      <button class="btn" @click="drawRectangle()" style="margin-bottom: 5px">绘制矩形</button>
      <button class="btn" @click="drawCircle()" style="margin-bottom: 5px">绘制圆形</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  setup() {
    const map = ref(null);
    const start = ref([116.478935, 39.997761]);

    const mouseTool = ref(null);

    const drawPolyline = () => {
      mouseTool.value.polyline({
        strokeColor: "#00E5EE",
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeStyle: "solid",
      });
    };

    const drawPolygon = () => {
      mouseTool.value.polygon({
        strokeColor: "#00E5EE",
        strokeOpacity: 1,
        strokeWeight: 6,
        // strokeOpacity: 0.2,
        fillColor: "#1791fc",
        fillOpacity: 0.4,
        strokeStyle: "solid",
      });
    };

    const drawRectangle = () => {
      mouseTool.value.rectangle({
        strokeColor: "#00E5EE",
        strokeOpacity: 0.5,
        strokeWeight: 6,
        fillColor: "blue",
        fillOpacity: 0.5,
        strokeStyle: "solid",
      });
    };

    const drawCircle = () => {
      mouseTool.value.circle({
        strokeColor: "#00E5EE",
        strokeOpacity: 1,
        strokeWeight: 6,
        // strokeOpacity: 0.2,
        fillColor: "#1791fc",
        fillOpacity: 0.4,
        strokeStyle: "solid",
      });
    };


    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: '97879bf59dbacac90f7b9639c8f6ccb8',
          version: '2.0',
          plugins: ['AMap.Adaptor', 'AMap.MouseTool']
        });

        map.value = new AMap.Map('container', {
          resizeEnable: true,
          center: start.value,
          zoom: 17
        });


        // 创建鼠标工具
        mouseTool.value = new AMap.MouseTool(map.value);

        console.log("tool", mouseTool.value);
        mouseTool.value.on("draw", (event) => {
          // event.obj 为绘制出来的覆盖物对象
          const overlay = event.obj; // 获取绘制完成的覆盖物对象s
          const path = overlay.getPath(); // 获取线段的经纬度坐标数组
          console.log("线段的经纬度:", path);
          
          console.log("覆盖物对象绘制完成");
        });
      } catch (error) {
        console.log(error);
      }
    };


    onMounted(() => {
      initMap();
    });

    return {
      drawPolyline,
      drawPolygon,
      drawRectangle,
      drawCircle,
    };
  }
};
</script>

<style lang="less">
#container {
  width: 100%;
  height: 80%;
}

// .input-card .btn {
//   margin-right: 1.2rem;
//   margin-bottom: 0.5rem;
//   margin-left: 0.2rem;
//   width: 9rem;
// }

// .input-card .btn:last-child {
//   margin-right: 0;
// }
</style>
