<template><!--地图模块-->
  <dialog-modal
    ref="dialog"
    size="small"
    min-width="600px"
    title="百度地图"
    @close="closeDialog">
    <!--地图模块-->
    <label>地址：<input v-model="keyword"></label>
    <br>
    <!-- getPoint方法，给地图加点击事件，点击地图获取所需要的信息，-->
    <!--scroll-wheel-zoom属性是否可以用鼠标滚轮控制地图缩放-->
    <baidu-map class="map" id="mapID" center="杭州市" :zoom="zoom" :scroll-wheel-zoom="true" @click="getPoint" >
      <!--地图类型，两种：一种是路线一种是绿的那种-->
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <!--地图搜索功能，绑定上面的input，-->
      <!--display: none样式很关键，因为下面默认会有地址提示信息很长，很烦，这样搜索会很舒服，-->
      <!--zoom是搜索结果的视图比例，个人觉得12.8很舒服显示-->
      <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" zoom="12.8" style="display: none"></bm-local-search>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <!--信息窗口，show属性是控制显示隐藏，infoWindowClose和infoWindowOpen是控制信息窗口关闭隐藏的方法-->
      <bm-marker :position="postionMap" >
        <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
          <p>站点：{{ add.siteName }}</p>
          <p>站点地址：{{ add.site }}</p>
        </bm-info-window>
      </bm-marker>
    </baidu-map>
  </dialog-modal>
</template>

<script>
import {
  BMap,
  BaiduMap,
  BmMapType,
  BmLocalSearch,
  BmNavigation,
  BmMarker,
  BmInfoWindow,
} from 'vue-baidu-map';

export default {
  name: 'BdMap',
  components: {
    BaiduMap,
    BmMapType,
    BmLocalSearch,
    BmNavigation,
    BmMarker,
    BmInfoWindow,
  },
  data() {
    return {
      jgNameDialog: false,
      show: false,
      postionMap: {  // 地图坐标
        lng: 120.211486,
        lat: 30.256576,
      },
      location: '',
      keyword: '',  // 搜索框关键词
      zoom: 12.8,   // 放大比例
      address: '',   // 位置详细信息
      add: {
        siteName: '',
        site: '',
        jd: '',
        wd: '',
        desce: '',
        type: '',
        jgName: '',
        jgNum: '',
      },
      organizationData: [],
      jgName: '',
      jgNum: '',
    };
  },
  methods: {
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    getPoint(e) {    // 点击地图获取一些信息，
      this.show = true;
      this.postionMap.lng = e.point.lng;     // 通过  e.point.lng获取经度
      this.postionMap.lat = e.point.lat;     // 通过  e.point.lat获取纬度
      this.add.jd = e.point.lng;
      this.add.wd = e.point.lat;
      this.zoom = e.target.getZoom();

      const geocoder = new BMap.Geocoder();  // 创建地址解析器的实例
      geocoder.getLocation(e.point, (rs) => {
        this.add.site = rs.address;
        // 地址描述(string)=
        // console.log(rs.address);    // 这里打印可以看到里面的详细地址信息，可以根据需求选择想要的
        // console.log(rs.addressComponents);// 结构化的地址描述(object)
        // console.log(rs.addressComponents.province); // 省
        // console.log(rs.addressComponents.city); // 城市
        // console.log(rs.addressComponents.district); // 区县
        // console.log(rs.addressComponents.street); // 街道
        // console.log(rs.addressComponents.streetNumber); // 门牌号
        // console.log(rs.surroundingPois); // 附近的POI点(array)
        // console.log(rs.business); // 商圈字段，代表此点所属的商圈(string)
      });
    },
    infoWindowClose() {
      this.show = false;
    },
    infoWindowOpen() {
      // 这里有个问题纠结了很久，百度的信息窗口默认有个点击其他地方就消失的事件，我没有找到
      // 并且信息窗口点击一次显示，一次消失
      // 于是我加了一个100毫秒的定时器，保证每次点击地图都可以展示信息窗口
      window.setInterval(() => { this.show = true; }, 100);
    },
  },
};
