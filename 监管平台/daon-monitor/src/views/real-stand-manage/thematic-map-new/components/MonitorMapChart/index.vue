<template>
  <!-- <el-amap
    vid="thematic"
    :center="center"
    :map-manager="amapManager"
    :zoom="zoom"
    :pitchEnable="pitchEnable" :pitch="pitch" :viewMode="viewMode"
    :mapStyle="mapStyle"
  >
    <el-amap-marker
      v-for="(marker, index) in markers"
      v-bind:key="index"
      :position="marker.position"
      :visible="marker.visible"
      :draggable="marker.draggable"
      :content="marker.content"
      :vid="index"
    ></el-amap-marker>
  </el-amap>-->
  <!-- <div style="width: 100%;height: 100%; z-index: -1;">
    <ve-amap
      :settings="chartSettings"
      width="100%"
      height="100%"
      :series="chartSeries"
      :tooltip="chartTooltip"
    ></ve-amap>
  </div>-->
  <div id="mapContainer" style="width: 100%;height: 100%;">
    <div id="container" style="width: 100%;height: 100%;"></div>
    <div style="position: absolute;width: 1px;height: 1px;bottom: -100px; overflow: hidden;">
      <KanbanInfo ref="KanbanInfo"></KanbanInfo>
    </div>
    <div ref:script-holder>
      <script id="kanban-template" type="text/template">
  <div class="amap-ui-smp-ifwn-container">
    <div class="amap-ui-smp-ifwn-combo-sharp" style="opacity: 0;"></div>
    <div class="kanban-container" style="z-index:1000">
          <div style="display: inline-block;position: absolute; top: -12rem;left: 0rem;">
          <svg width="10rem" height="13rem" viewBox="0, -30,240,180">
            <polyline
              id="polyline"
              style="fill:none;stroke: rgba(172,112,44);stroke-width: 2;"
              stroke-dasharray=""
              points="8.765,214.632 86.765,163.632 149.765,39.132
        202.265,35.132 "
            />
          </svg>
          <div style="display: inline-block;position: absolute; top: 5rem;">
            <div
              id="kanban"
              style="padding: 1rem;width: 14rem;height: 17rem;background-image: url('./static/kanban-bg.png');background-size:100% 100%;opacity: 0;margin-left: -2.8rem;margin-top: -1.4rem;transform: perspective(499px) rotateY(-20deg)"
              class="opacity-ease-in-out"
            >
              <%= infoBody %>
            </div>
            <div
              id="kanban-lf"
              style="width: 4rem;height: 4rem;background-image: url('./static/kanban-lt.png');background-size: 100% 100%; position:absolute;top: -2.5rem;left: -3.5rem;opacity: 0;"
              class="kanban-tl-alert opacity-ease-in-out"
            >
              <svg height="5rem" width="5rem" viewBox="-10, -10, 150, 150">
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  stroke="rgba(161, 238, 255)"
                  stroke-width="2"
                  fill="none"
                  stroke-dasharray="5, 4"
                  style="animation: act 2s ease-in-out infinite alternate;stroke-dashoffset: 100;"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
      </script>
    </div>
  </div>
</template>

<script>
import { getPoint } from '@/api/modules/thematic-map.js';
import AMap from '@/libs/amap.js';
import KanbanInfo from './components/KanbanInfo';

export default {
  name: 'MonitorMapChart',
  components: {
    KanbanInfo,
  },
  data() {
    const data = [];
    for (let i = 0; i <= 360; i++) {
      const t = (i / 180) * Math.PI;
      const r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }
    return {
      map: null,
      count: 1,
      isMapKanban: false,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa',
      },
      animateSign: false,
      markerArr: [],
      pitchEnable: true,
      viewMode: '3D',
      pitch: 40,
      mapStyle: 'amap://styles/ce0a36fdb2020191ca69000800ac299c',
      zoom: 8,
      center: [120.555994, 31.876698],
      kanbanRoot: null,
      markerArr: [],
      cluster: null,
      infoWindow: null,
      markers: [
        {
          position: [120.555994, 31.876698],
          icon: './static/point-mark-blue.png',
          size: [58, 82],
          imageSize: [1344, 82],
          imageOffset: [0, 0],
          animateDurantion: 4,
          frame: 24,
          visible: true,
          draggable: false,
        },
        {
          position: [120.455994, 31.676698],
          icon: './static/marker-alert.png',
          size: [58, 82],
          imageSize: [1344, 82],
          imageOffset: [0, 0],
          animateDurantion: 4,
          frame: 24,
          visible: true,
          draggable: false,
        },
      ],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      try {
        this.resMap = await AMap();
        this.map = new this.resMap.Map('container', {
          resizeEnable: true, // 是否监控地图容器尺寸变化
          center: this.center,
          //   zooms: [8, 19], //设置地图级别范围
          zoomEnable: true, // 是否缩
          zoom: 12, // 初始化地图层级
          //   jogEnable: true, // 是否支持缓动效果
          //   buildingAnimation: true, // 模块消失是否有动画效果
          pitchEnable: this.pitchEnable,
          pitch: this.pitch,
          viewMode: this.viewMode,
          mapStyle: this.mapStyle,
          // 初始化地图中心点
        });
        this.createKanban();
        getPoint(this.name).then((res) => {
          if (res.status === 200 && res.data && res.data.code === 200) {
            this.formmatData(res.data.data);
            this.addMarkers();
            // setTimeout(() => {
            //   this.animateInit();
            // }, 1000);
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    formmatData(markersData) {
      this.markers = markersData.map(o => ({
        id: o.id,
        position: [o.lng, o.lat],
        name: o.name,
        icon: o.isEnabled
          ? './static/point-mark-blue.png'
          : './static/marker-alert.png',
        isEnabled: o.isEnabled,
        address: o.address,
        size: [58, 82],
        imageSize: [1344, 82],
        imageOffset: [0, 0],
        animateDurantion: 4,
        isEnabled: o.isEnabled,
        frame: 24,
      }));
    },
    createKanban() {
      if (window.UI) {
        console.log('AmapUI', AMapUI);
        AMapUI.defineTpl(
          'ui/overlay/SimpleInfoWindow/tpl/container.html',
          [],
          () => document.getElementById('kanban-template').innerHTML
        );
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], (SimpleInfoWindow) => {
          this.infoWindow = new SimpleInfoWindow({
            infoBody: this.$refs.KanbanInfo.$el.innerHTML,
          });
        });
      } else {
        setTimeout(this.createKanban, 100);
      }
    },
    polylineAction() {
      const dashLineLength = document.getElementById('polyline').getTotalLength();
      let animateLength = dashLineLength - 5;
      const sDashArray = [8, dashLineLength];
      const computeLength = function (resolve) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            sDashArray.unshift(8, 5);
            animateLength -= 15;
            document
              .getElementById('polyline')
              .setAttribute('stroke-dasharray', sDashArray.join(','));
            if (animateLength > 0) {
              computeLength(resolve);
            } else {
              resolve();
            }
          });
        }, 10);
      };
      document
        .getElementById('polyline')
        .setAttribute('stroke-dasharray', sDashArray.join(','));
      return new Promise((resolve, reject) => {
        computeLength(resolve);
      });
    },
    async showKanban() {
      if (document.getElementsByClassName('kanban-container').length) this.isMapKanban = true;
      else {
        return setTimeout(this.showKanban, 100);
      }
      document.getElementsByClassName('kanban-container')[0].className = 'kanban-container';
      document.getElementById('kanban-lf').style.opacity = 0;
      document.getElementById('kanban').style.opacity = 0;
      await this.polylineAction();
      // show kanban left-top div
      await new Promise((resolve) => {
        document.getElementById('kanban-lf').addEventListener(
          'transitionend',
          () => {
            resolve();
          },
          { once: true }
        );
        document.getElementById('kanban-lf').style.opacity = 1;
      });
      // show kanban container;
      await new Promise((resolve) => {
        document.getElementById('kanban').addEventListener(
          'transitionend',
          () => {
            resolve();
          },
          { once: true }
        );
        document.getElementById('kanban').style.opacity = 1;
      });
      await new Promise((resolve) => {
        resolve();
      });
    },
    hideKanban() {
      document.getElementById('kanban-container').className = 'kanban-container kanban-ctr-fade-out';
      document.getElementById('kanban').addEventListener(
        'animationend',
        () => {
          document.getElementById('kanban-lf').style.opacity = 0;
          document.getElementById('kanban').style.opacity = 0;
          this.isMapKanban = false;
        },
        { once: true }
      );
    },
    // addIconmarkListener() {
    //   if (document.getElementsByClassName("amap-markers")[0] === undefined) {
    //     setTimeout(this.addIconmarkListener, 100);
    //   } else {
    //     document
    //       .getElementsByClassName("amap-markers")[0]
    //       .addEventListener("click", e => {
    //         e.target.parentElement.parentElement.appendChild(this.kanbanRoot);
    //         this.map.setCenter();
    //         this.showKanban();
    //       });
    //     this.map.on("click", e => {
    //       if (this.isMapKanban) {
    //         this.hideKanban();
    //       }
    //     });
    //     this.map.on("dragstart", e => {
    //       if (this.isMapKanban) {
    //         this.hideKanban();
    //       }
    //     });
    //     this.map.on("zoomchange", e => {
    //       if (this.isMapKanban) {
    //         this.hideKanban();
    //       }
    //     });
    //   }
    // },
    addMarkers() {
      const count = this.markers.length;
      this.markers.forEach((mark, index) => {
        this.markerArr[index] = new this.resMap.Marker({
          icon: this.addIcon(mark),
          position: mark.position,
          offset: new this.resMap.Pixel(
            -Math.floor(mark.size[0] / 2),
            -mark.size[1]
          ),
          isEnabled: mark.isEnabled,
          title: `marker${index}`,
          content: `<div style="width: ${mark.size[0]}px;height: ${
            mark.size[1]
            }px;background-image: url(${
            mark.icon
            });animation: stepByStep 4s steps(24) infinite;animation-delay: ${Math.random()
            * 3}s"></div>`,
        });
        this.markerArr[index].on('click', (e) => {
          console.log(e, this.infoWindow);
          this.infoWindow.open(this.map, e.lnglat);
          this.map.setCenter(e.lnglat);
          this.$refs.KanbanInfo.getFactorData(e.target.getId());
          this.showKanban();
        });
      });
      const _renderClusterMarker = function (context) {
        const factor = Math.pow(context.count / count, 1 / 18);
        // var div = document.createElement("div");
        // div.style.backgroundImage =
        //   "radial-gradient(at 35% 35%, #ddd 1%,rgba(106, 186, 238, 1), #000 85%)";
        // let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        // div.style.width = div.style.height = size + "px";
        // div.style.borderRadius = size / 2 + "px";
        // div.innerHTML = context.count;
        // div.style.lineHeight = size + "px";
        // div.style.color = "#555";
        // div.style.fontSize = "18px";
        // div.style.fontWeight = "bold";
        // div.style.textAlign = "center";
        context.markers.some(_ => _.w.isEnabled);
        const clusterPoint = `<div style="width: 77px;height: 78px;background-image: url('./static/cluster-point-blue.png'); animation: stepByStep2 5s steps(30) infinite;animation-delay: ${Math.random() * 3}s;display:flex;"><span style="margin:20% auto auto;font-size: 1rem;color: white">${context.count}</span></div>`;
        context.marker.setOffset(new this.resMap.Pixel(-38.5, -39));
        context.marker.setContent(clusterPoint);
      };
      if (this.cluster) {
        this.cluster.setMap(null);
      }
      this.cluster = new this.resMap.MarkerClusterer(this.map, this.markerArr, {
        gridSize: 100,
        maxZoom: 16,
        renderClusterMarker: _renderClusterMarker.bind(this),
      });
      // this.map.add(markerArr);
      // this.map.add();
    },
    addIcon(options) {
      return new this.resMap.Icon({
        // 图标尺寸
        size: new this.resMap.Size(options.size[0], options.size[1]),
        // 图标的取图地址
        image: options.icon,
        // 图标所用图片大小
        imageSize: new this.resMap.Size(
          options.imageSize[0],
          options.imageSize[1]
        ),
        // 图标取图偏移量
        imageOffset: new this.resMap.Pixel(
          options.imageOffset[0],
          options.imageOffset[1]
        ),
      });
    },
    animateInit() {
      const _ = this;
      this.markers.forEach((ele, index) => {
        // console.log(Math.floor(ele.animateDurantion / ele.frame * 1000));
        // TODO: 第一次加载需要fitView渲染所有节点，结束后才到相应zoom的位置
        if (Math.abs(ele.imageOffset[0]) >= ele.imageSize[0]) {
          ele.imageOffset[0] = ele.imageOffset[0] + ele.imageSize[0];
        } else {
          ele.imageOffset[0] = ele.imageOffset[0] - ele.imageSize[0] / ele.frame;
        }
        var setElementOffest = function () {
          if (document.getElementsByClassName('amap-icon')[index]) {
            document.getElementsByClassName('amap-icon')[index].getElementsByTagName('img')[0].style.left = `${ele.imageOffset[0]}px`;
            requestAnimationFrame(() => {
              _.animatePointMark(ele, Math.floor((ele.animateDurantion / ele.frame) * 1000), index);
            });
          } else {
            setTimeout(setElementOffest, 100);
          }
        };
        setTimeout(() => {
          setElementOffest();
        }, Math.random() * 4000 + 1000);
      });
    },
    animatePointMark(ele, gap, i) {
      // img的点动画，点多了卡（已废）
      if (Math.abs(ele.imageOffset[0]) >= ele.imageSize[0]) {
        ele.imageOffset[0] = ele.imageOffset[0] + ele.imageSize[0];
      } else {
        ele.imageOffset[0] = ele.imageOffset[0] - ele.imageSize[0] / ele.frame;
      }
      setTimeout(() => {
        document
          .getElementsByClassName('amap-icon')
        [i].getElementsByTagName(
          'img'
        )[0].style.left = `${ele.imageOffset[0]}px`;
        requestAnimationFrame(() => {
          this.animatePointMark(ele, gap, i);
        });
      }, gap);
    },
  },
};
</script>

<style>
/* 去高德logo */
.amap-logo {
  display: none !important;
}
.amap-copyright {
  opacity: 0 !important;
}
@keyframes act {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(0.4rem);
  }

  50% {
    transform: translateY(0.6rem) scale(1.2, 0.9);
  }

  75% {
    ransform: translateY(0.4rem);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes shadow {
  0%,
  40%,
  70%,
  100% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(1.2);
  }
}

.kanban-tl-alert::after {
  content: "";
  height: 0.15rem;
  width: 1rem;
  background: rgba(232, 192, 108);
  opacity: 0.4;
  border-radius: 50%;
  position: absolute;
  top: 2.6rem;
  left: 1.45rem;
  animation: shadow 1.5s linear infinite;
}

.kanban-tl-alert::before {
  border-radius: 5px;
  background-image: url("~@/assets/img1/kanban-point1.png");
  background-size: 100% 100%;
  animation: jump 1.5s linear infinite;
  content: "";
  position: absolute;
  left: 1.6rem;
  top: 1rem;
  width: 0.8rem;
  height: 1rem;
}

.kan-tl-normal::after {
  content: "";
  height: 8px;
  width: 2rem;
  background: rgba(232, 192, 108);
  opacity: 0.4;
  border-radius: 50%;
  position: absolute;
  top: 67px;
  left: 2.5rem;
  animation: shadow 1.5s linear infinite;
}

.kanban-tl-normal::before {
  border-radius: 5px;
  background-image: url("~@/assets/img1/kanban-point2.png");
  background-size: 100% 100%;
  animation: jump 1.5s linear infinite;
  content: "";
  position: absolute;
  left: 1.8 rem;
  top: 1rem;
  width: 1rem;
  height: 1.2rem;
}

.opacity-ease-in-out {
  transition: opacity 1s ease-in-out;
}

.kanban-ctr-fade-out {
  display: none;
  animation: fadeOut 1s ease-in-out forwards;
}

@keyframes stepByStep {
  from {
    background-position: 0px;
  }

  to {
    background-position: -1344px;
  }
}

@keyframes stepByStep2 {
  from {
    background-position: 0px;
  }

  to {
    background-position: -2310px;
  }
}

@keyframes fadeOut {
  100% {
    opacity: 0;
  }
  0% {
    opacity: 1;
  }
}
</style>
