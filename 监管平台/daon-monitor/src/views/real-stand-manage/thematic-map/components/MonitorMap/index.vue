<template>
<!-- 地图 -->
<div class="MonitorMap">
  <div class="amap-wrapper">
    <div class="point_class" v-if="isShow">
      <span class="ex">图例</span>
      <img class="blue" src="@/assets/img/blueP.png" />
      <span class="com">在线</span>
      <img class="pink" src="@/assets/img/yelloP.png"/>
      <span class="park">离线</span>
    </div>
    <div class="input_class" v-if="isShow">
      <a-input placeholder="请输入污染源点位名称" allowClear v-model="name"/>
      <a-icon type="search" title="搜索"  @click="getPointData"/>
    </div>
    <el-amap ref="map" class="amap-box" vid="map"
      :amap-manager="amapManager"
      :events="mapEvents"
      :zoom="data.zoom"
      :center="data.center"
      :plugin="plugin">
      <!-- 标记 -->
      <template v-for="(item, index) in markerData.markers">
        <el-amap-marker
          v-show="isShowPoint"
          :key="index"
          :vid="`marker${index}`"
          :icon="item.icon"
          :topWhenClick="true"
          :position="item.position"
          :events="item.events"
        >
        </el-amap-marker>
      </template>
      <!-- 窗体 -->
      <el-amap-info-window
        v-if="isShowPoint"
        :position="currentWindow.position"
        :visible="currentWindow.visible"
        :events="currentWindow.events">
        <div class="uuuu">
          <station-imfor ref="stationImfor"/>
        </div>
      </el-amap-info-window>
    </el-amap>
  </div>
</div>
</template>

<script>
import VueAMap from 'vue-amap';
import { getPoint } from '@/api/modules/thematic-map.js';
import stationImfor from './components/stationImfor';

VueAMap.initAMapApiLoader({
  key: '0bcbdacfdaa65e4c02e107e4acb5f494',
  plugin: [
    // 'AMap.Autocomplete', // 输入提示插件
    // 'AMap.PlaceSearch', // POI搜索插件
    // 'AMap.Scale', // 右下角缩略图插件 比例尺
    // 'AMap.OverView', // 地图鹰眼插件
    // 'AMap.ToolBar', // 地图工具条
    // 'AMap.MapType', // 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    // 'AMap.PolyEditor', // 编辑 折线多，边形
    // 'AMap.CircleEditor', // 圆形编辑器插件
    // 'AMap.Geolocation', // 定位控件，用来获取和展示用户主机所在的经纬度位置
    'AMap.MarkerClusterer', // 点聚合
  ],
  uiVersion: '1.0',
});

const amapManager = new VueAMap.AMapManager();

export default {
  name: 'MonitorMap',
  components: {
    stationImfor,
  },
  data() {
    /* eslint-disable */
    return {
      name: '', // 点位名称
      isShowPoint: false,
      isShow: false,
      currentWindow: { // 窗体信息
        position: [],
        visible: false,
      },
      markerRefs: [],
      // 标注数据及事件
      markerData: {
        // 标注事件
        // events: {
        //   click: a => {
        //     // 获取索引
        //     const index = a.target.F.vid.replace(/[marker]/g, '');
        //     const item = this.markerData.markers[+index];
        //     // 修改icon
        //       // 重置所有图标
        //     // this.markerData.markers.forEach((el) => {
        //     //   el.icon = require('../../../../assets/img/po_yellow.png');
        //     // });
        //     // this.$set(item, 'icon', require('../../../../assets/img/po_yellow.png'));
        //     // 将点击的点坐标设为地图中心
        //     // console.log(this.markerData.markers);
        //     // console.log(item.position);
        //     // this.data.center = a.target.getPosition();
        //     this.data.center = item.position;
        //     // console.log(this.data.center);
        //     // 控制窗体的位置
        //     // this.currentWindow.visible = true;
        //     this.$nextTick(() => {
        //       console.log(123);
        //       this.$refs.stationImfor.getFactorData(item.id);
        //       this.currentWindow.position = item.position;
        //       this.currentWindow.visible = true;
        //     });
        //   },
        // },
        // 模拟点数据
        markers: [
          // {
          //   id: 2,
          //   position: [120.621468, 31.298083],
          //   name: '点位名称2',
          //   icon: require('../../../../assets/img/po_yellow.png'),
          //   type: 2,
          //   visible: true,
          // },
          // {
          //   id: 3,
          //   position: [120.617225, 31.298644],
          //   name: '点位名称3',
          //   icon: require('../../../../assets/img/po_yellow.png'),
          //   type: 1,
          //   visible: true,
          // },
        ],
      },
      cluster: null,
      // 地图
      data: {
        zoom: 10,
        center: [120.621468, 31.298083],
      },
      amapManager,
      // 插件
      plugin: [
        // {
        //   // tileLayer: new AMap.TileLayer({
        //   //   //显示的是google上显示的图层
        //   //   tileUrl: 'amap://styles/4fb692c6ee6fb3c7acb889a1b1c39b5a', // 图块取图地址
        //   // }),
        //   pName:'OverView',
        //   isOpen: true, // 鹰眼是否打开
        // },
      ],
      // 地图事件
      mapEvents: {
        init: (o) => {
          // 自定义样式
          o.setMapStyle('amap://styles/4fb692c6ee6fb3c7acb889a1b1c39b5a');
          this.getPointData().then(() => {
            setTimeout(() => {
              this.cluster = new window.AMap.MarkerClusterer(o, this.markerRefs, {
              gridSize: 40,
              maxZoom: 14,
              // renderCluserMarker: this._renderCluserMarker
            });
            }, 0);
          });
        },
        // 地图点击事件
        click: () => {
          // 重置所有图标
          this.markerData.markers.forEach((el) => {
            el.icon = el.isEnabled ? require('../../../../assets/img/po_blue.png') : require('../../../../assets/img/po_yellow.png');
          });
          // 隐藏窗体
          this.currentWindow.visible = false;
        },
      },
    };
  },
  methods: {
    // 绘制聚合点
    _renderCluserMarker(context) {
      const count = this.corpList.length;
      const div = document.createElement('div');
      const bgImg = 'url("https://webapi.amap.com/theme/v1.3/m1.png")';
      const fontColor = '#fff';
      div.style.backgroundImage = bgImg;
      div.style.backgroundSize = '100% 100%';
      const size = Math.round(46 + (context.count / count) ** (1 / 5) * 20);
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.innerHTML = context.count;
      div.style.lineHeight = `${size}px`;
      div.style.color = fontColor;
      div.style.fontSize = '14px';
      div.style.textAlign = 'center';
      context.marker.setOffset(new window.AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(div);
    },
    getPointData() {
      return new Promise((resolve) => {
        getPoint(this.name).then((res) => {
          if (res.data.success && res.data.code === 200) {
            const arr = [];
            res.data.data.forEach((val) => {
              if (val.formatLat && val.formatLng && Number(val.formatLat) && Number(val.formatLng)) {
                arr.push({
                  id: val.id,
                  position: [val.lng, val.lat],
                  name: val.name,
                  icon: val.isEnabled ? require('../../../../assets/img/po_blue.png') : require('../../../../assets/img/po_yellow.png'),
                  isEnabled: val.isEnabled,
                  address: val.address,
                  events: {
                    init: (o) => {
                      this.markerRefs.push(o);
                    },
                    click: (a) => {
                      // 获取索引
                      const index = a.target.F.vid.replace(/[marker]/g, '');
                      const item = this.markerData.markers[+index];
                      this.$nextTick(() => {
                        this.$refs.stationImfor.getFactorData(item.id);
                        this.currentWindow.position = item.position;
                        this.currentWindow.visible = true;
                        this.data.center = item.position;
                      });
                    },
                  },
                });
              }
            });
            this.markerData.markers = arr;
            resolve();
            this.data.center = this.markerData.markers[0].position;
            this.currentWindow.position = this.markerData.markers[0].position;
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      });
    },
    show(type) {
      this.isShow = type;
      this.isShowPoint = type;
      // this.getPointData();
      if (type) {
        this.data.center = this.markerData.markers[0].position;
        this.currentWindow.position = this.markerData.markers[0].position;
      }
    },
  },
};
</script>

<style lang="scss">
.amap-logo{
  display: none;
  opacity:0 !important;
}
.amap-copyright {
    opacity:0;
}
.amap-overlay-text-container{
  background: none;
  border: none;
  color: yellow;
}
.g-wrap > div.g-main {
  overflow: hidden;
  $time: all 1.5s ease-out;
  width: 100%;
  height: 1080px;
  // padding: 101px $-base-size $-base-size;
  background-color: #101e2a;
  // background-image: url("../assets/img/common/bg-black.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transition: $time;
  -moz-transition: $time; /* Firefox 4 */
  -webkit-transition: $time; /* Safari 和 Chrome */
  -o-transition: $time; /* Opera */
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
body, div,
th, td, dl, dt, dd, ul, ol, li, p {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ol, ul { list-style: none }

.img-title{
  position: absolute;
  top: 15px;
  left: 24px;
  color: white;
}
.plan{
  position: relative;
}

.input_class{
  >.ant-input-affix-wrapper{
    width: 200px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    >.ant-input{
      border: none;
      background: none;
      width: 100%;
      color: #40a9ff;
      outline: none;
      &:focus{
        outline: none;
        box-shadow:none;
      }
    }
    >.ant-input-suffix{
      >i{
        color: #1BABEE;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
  .MonitorMap{
    height: 100%;
    background-image: url('../../../../assets/img/map_bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  // .amap-wrapper{
  //   >.top{
  //     z-index: 100;
  //     width: 100%;
  //     height: 75px;
  //     // background-image: url('../../assets/img/logo.png');
  //     position: absolute;
  //     top: 0;
  //     // background: no-repeat;
  //   }
  // }
  .input_class{
    width: 300px;
    height: 30px;
    background-image: url('../../../../assets/img/input_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 1000;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    >i{
      cursor: pointer;
      color: #1BABEE;
      position: absolute;
      right: 20px;
      top: 10px;
    }
  }
  .point_class{
    color: #fff;
    z-index: 1000;
    width: 300px;
    height: 45px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding-top: 7px;
    background-image: url('../../../../assets/img/tootip.png');
    background-size: 100% 100%;
    font-size: 12px;
    >img{
      width: 32px;
    }
    >.ex{
      position: absolute;
      left: 60px;
      top: 10px;
    }
    .blue{
      position: absolute;
      left: 100px;
    }
    >.com{
      position: absolute;
      left: 140px;
      top: 10px;
    }
    .pink{
      position: absolute;
      left: 175px;
    }
    >.park{
      position: absolute;
      left: 215px;
      top: 10px;
    }
  }
  .click-class{
    position: absolute;
    right: 15px;
    top: 40px;
    z-index: 1000;
    color: #07F0F0;
    cursor: pointer;
  }
  .amap-wrapper{
    width: 93%;
    height: 87%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
</style>
