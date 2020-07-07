<template>
  <a-modal
    centered
    ref="modal"
    width="65%"
    wrapClassName="mod-map-coordinate"
    :title="title"
    :visible="visible"
    :maskClosable="false"
    :bodyStyle="{ position: 'relative', padding: 0 }"
    @cancel="closeMap">
    <div class="map-info">
      <p><span>经度</span> {{hoverGeo.lng}}</p>
      <p><span>纬度</span> {{hoverGeo.lat}}</p>
    </div>
    <span v-show="loading" class="map-loading">定位中...</span>
    <baidu-map
      class="baidu-map"
      :zoom="zoom"
      :center="center"
      :ak="$config.bdMap.ak"
      :scroll-wheel-zoom="true"
      @ready="readyMap"
      @click="onMapClick"
      @mousemove="onMouseMove">
      <bm-view style="width: 100%; height:100%; min-height:200px; flex: 1"></bm-view>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <bm-marker :position="formItem" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    </baidu-map>
    <template v-slot:footer>
      <a-form layout="inline">
        <div class="fn-left">
          <a-form-item label="经度：">
            <a-input-number
              v-model="formItem.lng"
              style="width: 140px"
              :step="0.001"
              @keyup.enter.native="onChangeGeo"
              @blur="onChangeGeo">
            </a-input-number>
          </a-form-item>
          <a-form-item label="纬度：">
            <a-input-number
              v-model="formItem.lat"
              style="width: 140px"
              :step="0.001"
              @keyup.enter.native="onChangeGeo"
              @blur="onChangeGeo">
            </a-input-number>
          </a-form-item>
        </div>
        <a-form-item class="mar-r-0">
          <a-button icon="close" @click="onCheckGeo">取 消</a-button>
          <a-button type="primary" icon="check" @click="onCheckGeo">确 认</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script>
import {
  BaiduMap,
  BmView,
  BmMarker,
  BmGeolocation,
  BmMapType,
} from 'vue-baidu-map';

export default {
  name: 'MapCoordinate',
  components: {
    BaiduMap,
    BmView,
    BmMarker,
    BmGeolocation,
    BmMapType,
  },
  props: {
    title: {
      type: String,
      default: '获取定位',
    },
  },
  data() {
    return {
      loading: true,
      visible: false,
      point: {
        lng: 116.404,
        lat: 39.915,
      },
      formItem: {
        lng: '',
        lat: '',
      },
      hoverGeo: {
        lng: '',
        lat: '',
      },
      center: {
        lng: '',
        lat: '',
      },
      zoom: 15,
    };
  },
  methods: {
    openMap(pointCustom) {
      this.point = pointCustom || this.point;
      this.visible = true;
    },
    closeMap() {
      this.visible = false;
    },
    readyMap({ BMap, map }) {
      this.center = { ...this.point };
      this.hoverGeo = { ...this.center };
      this.zoom = 15;
      const geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition((geo) => {
        this.center.lng = geo.point.lng;
        this.center.lat = geo.point.lat;
        this.formItem = { ...this.center };
        this.hoverGeo = { ...this.center };
        this.loading = false;
      });
      // map.enableMapClick = false;
      window.map = map; // 将map变量存储在全局
    },
    onMapClick({ point }) {
      this.formItem = point;
    },
    onMouseMove({ point }) {
      this.hoverGeo = point;
    },
    onChangeGeo() {
      if (this.formItem.lng && this.formItem.lat) {
        this.center = { ...this.formItem };
      }
    },
    onCheckGeo() {
      this.$emit('selected', this.formItem.lng, this.formItem.lat);
      this.closeMap();
    },
  },
};
</script>
