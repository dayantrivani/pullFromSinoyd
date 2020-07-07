<template>
  <div class="page-home">
    <el-button @click="openDialog" type="primary" round size="large" class="mar-b-lg">查看</el-button>
    <br/>
    <el-button @click="getMarker" type="success" round size="large" class="mar-b-lg">保存</el-button>
    <br/>
    <el-button @click="setMarker(1)" type="primary" round size="large" class="mar-b-lg">类型1</el-button>
    <el-button @click="setMarker(2)" type="warning" round size="large" class="mar-b-lg">类型2</el-button>
    <el-button @click="setMarker(3)" type="danger" round size="large" class="mar-b-lg">类型3</el-button>
    <div style="width: 100%; height: 500px">
      <el-scrollbar style="height: 100%;width: 80%;margin: auto;" class="pad-x-sm">
        <ui-marker ref="marker" :imgUrl="imgUrl"></ui-marker>
      </el-scrollbar>
    </div>
    <el-dialog :visible="visible" @close="closeDialog">
      <el-scrollbar style="height: 100%;width: 80%;margin: auto;" class="pad-x-sm">
        <ui-marker ref="dialogMarker" :imgUrl="imgUrl" :readOnly="true"></ui-marker>
      </el-scrollbar>
    </el-dialog>
    <!-- <footer class="page-footer"></footer> -->
  </div>
</template>

<script>
import { AIMarker } from 'Vue-Picture-BD-Marker';
import { mapActions } from 'vuex';
import imgUrl from '../../assets/marker.png';

export default {
  name: 'Home',
  inject: ['app'],
  components: {
    uiMarker: AIMarker,
  },
  data() {
    return {
      imgUrl,
      visible: false,
      markerData: [],
    };
  },
  created() {},
  computed: {
    name() {
      return this.$store.state.auth.userInfo.userName || '';
    },
  },
  methods: {
    ...mapActions('auth', ['Logout']),
    openDialog() {
      this.visible = true;
      // this.$nextTick(() => {
      //   this.$refs.dialogMarker.getMarker().renderData(this.markerData);
      // });
      setTimeout(() => {
        this.$refs.dialogMarker.getMarker().clearData();
        this.$refs.dialogMarker.getMarker().renderData(this.markerData);
      }, 1000);
    },
    closeDialog() {
      this.visible = false;
    },
    setMarker(type) {
      this.$refs.marker.setTag({
        tagName: `类型${type}`,
      });
    },
    getMarker() {
      const marker = this.$refs.marker.getMarker().getData();
      this.markerData = marker;
    },
  },
};
</script>
