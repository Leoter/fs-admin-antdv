<template>
  <div id="container"></div>
  <Layout>
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline">
        AAAA
      </Menu>
      <Menu theme="dark" mode="inline">
        BBBB
      </Menu>
      <Menu theme="dark" mode="inline">
        CCCC
      </Menu>
      <VideoCameraOutlined />

    </Sider>

  </Layout>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  setup() {
    const map = ref(null);
    const start = ref([114.229345, 22.68153]);
    const path = ref([
      [114.229345, 22.68153], [114.224589, 22.681761], [114.218132, 22.688773], [114.216977, 22.694802], [114.216664, 22.696012], [114.21709, 22.696953], [114.217493, 22.697481], [114.217123, 22.704523], [114.21719, 22.705113], [114.220397, 22.705423], [114.221495, 22.706116], [114.222773, 22.70625], [114.225377, 22.705399], [114.227058, 22.704758], [114.230932, 22.709174], [114.236758, 22.70806], [114.245361, 22.714099], [114.253612, 22.718876], [114.255417, 22.715888], [114.242567, 22.705389], [114.248384, 22.700773], [114.245142, 22.695511], [114.237268, 22.691788], [114.23086, 22.68684], [114.229364, 22.681532]
      // ... 省略其余坐标点
    ]);
    const marker = ref(null);

    const initMap = async () => {
      try {
        AMapLoader.load({
          key: '97879bf59dbacac90f7b9639c8f6ccb8',
          version: '2.0',
        }).then((AMap) => {
          const map = new AMap.Map('container', {
            center: start.value,
            zoom: 14,
          });

          const polygon = new AMap.Polygon({
            map: map,
            path: path.value,
            strokeColor: '#FF33FF',
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            fillColor: '#1791fc',
            zIndex: 50,
          });

          map.add(polygon);
          map.setFitView([polygon]);
        });
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(() => {
      initMap();
    });
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
