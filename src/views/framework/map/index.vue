<template>
  <div id="container"></div>
  <div class="input-card">
    <h4>轨迹回放控制</h4>
    <div class="input-item">
      <fs-button class="btn" @click="startAnimation">开始动画</fs-button>
      <fs-button class="btn" @click="pauseAnimation">暂停动画</fs-button>
    </div>
    <div class="input-item">
      <fs-button class="btn" @click="resumeAnimation">继续动画</fs-button>
      <fs-button class="btn" @click="stopAnimation">停止动画</fs-button>
    </div>
    <div class="input-item">
      <fs-button class="btn" @click="usePointLine">用指定的经纬度</fs-button>
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
    const lineArr = ref([
      [116.478935, 39.997761], [116.478939, 39.997825], [116.478912, 39.998549], [116.478912, 39.998549], [116.478998, 39.998555], [116.478998, 39.998555], [116.479282, 39.99856], [116.479658, 39.998528], [116.480151, 39.998453], [116.480784, 39.998302], [116.480784, 39.998302], [116.481149, 39.998184], [116.481573, 39.997997], [116.481863, 39.997846], [116.482072, 39.997718], [116.482362, 39.997718], [116.483633, 39.998935], [116.48367, 39.998968], [116.484648, 39.999861]
      // ... 省略其余坐标点
    ]);
    const marker = ref(null);

    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: '97879bf59dbacac90f7b9639c8f6ccb8',
          version: '2.0',
          plugins: ['AMap.Adaptor']
        });

        map.value = new AMap.Map('container', {
          resizeEnable: true,
          center: start.value,
          zoom: 17
        });

        marker.value = new AMap.Marker({
          map: map.value,
          position: start.value,
          icon: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          offset: new AMap.Pixel(-13, -26)
        });

        AMap.plugin('AMap.MoveAnimation', () => {
          const polyline = new AMap.Polyline({
            map: map.value,
            path: lineArr.value,
            showDir: true,
            strokeColor: '#28F',
            strokeWeight: 6
          });

          // marker.value.on('moving', (e) => {
          //   polyline.setPath(e.passedPath);
          // });

          map.value.setFitView();
        });
      } catch (error) {
        console.log(error);
      }
    };

    const startAnimation = () => {
      marker.value.moveAlong(lineArr.value, {
        duration: 3000,
        autoRotation: true
      });
    };

    const pauseAnimation = () => {
      marker.value.pauseMove();
    };

    const resumeAnimation = () => {
      marker.value.resumeMove();
    };

    const stopAnimation = () => {
      marker.value.stopMove();
    };

    const usePointLine = () => {
      start.value = [116.481573, 39.997997];
      lineArr.value = [
        [116.481573, 39.997997], [116.481863, 39.997846], [116.482072, 39.997718], [116.482362, 39.997718], [116.483633, 39.998935], [116.48367, 39.998968], [116.484648, 39.999861]
        // ... 省略其余坐标点
      ];
      initMap();
    };

    onMounted(() => {
      initMap();
    });

    return {
      startAnimation,
      pauseAnimation,
      resumeAnimation,
      stopAnimation,
      usePointLine
    };
  }
};
</script>

<style lang="less">
#container {
  width: 100%;
  height: 80%;
}

.input-card .btn {
  margin-right: 1.2rem;
  margin-bottom: 0.5rem;
  margin-left: 0.2rem;
  width: 9rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}
</style>
