<template>
<!-- 废水报警管理 -->
  <container>
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb/> -->
      <enter-manage ref="EnterManage" v-if="!isShow" @changeIsShow="changeIsShow"/>
      <a-tabs @change="callback" type="card" :defaultActiveKey="0" v-if="isShow">
        <a-tab-pane tab="超标报警" :key="0">
          <PoliceContent ref="excessive"  @changeIsShow="changeIsShow2" :company="currentCom"></PoliceContent>
        </a-tab-pane>
        <a-tab-pane tab="其他报警" :key="1">
          <PoliceContent ref="other" :isType="false" @changeIsShow="changeIsShow2" :company="currentCom"></PoliceContent>
        </a-tab-pane>
      </a-tabs>
    </template>
  </container>
</template>

<script>
import EnterManage from '@/components/locally/EnterManage';

export default {
  name: 'WaterAlarmManage',
  components: {
    EnterManage,
  },
  data() {
    return {
      type: 0,
      isShow: false,
      currentCom: '',
    };
  },
  // provide() {
  //   return { police: this };
  // },
  mounted() {},
  methods: {
    onBack() {
      this.isShow = false;
    },
    changeIsShow(val) {
      // this.isShow = val;
      this.isShow = val.isShow;
      this.currentCom = val.comName;
    },
    changeIsShow2(val) {
      this.isShow = val;
    },
    callback(key) {
      this.type = key;
      this.$nextTick(() => {
        if (!key) {
          this.$refs.excessive.queryForm.type = 'HO';
        } else {
          this.$refs.other.queryForm.type = 'A';
        }
      });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>
