<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="onTabClick">
    <el-tab-pane label="超标报警" lazy name="exceedAlarm">
      <exceed-alarm ref="exceedAlarm" />
    </el-tab-pane>
    <el-tab-pane label="其他报警" lazy name="otherAlarm">
      <other-alarm ref="otherAlarm" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapState } from 'vuex';
import ExceedAlarm from './components/ExceedAlarm';
import OtherAlarm from './components/OtherAlarm';

export default {
  name: 'AlarmRecord',
  components: {
    ExceedAlarm,
    OtherAlarm,
  },
  data() {
    return {
      activeName: '',
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  created() {
    /** 1. 默认选中超标报警
     *  2. 在内容渲染完毕后调取子组件方法
     *     该方法用于完成在 子组件渲染时 需要进行的操作: 请求接口...
     */
    this.activeName = 'exceedAlarm';
    this.$nextTick(() => {
      this.$refs.exceedAlarm.onTabClick(this.amcsType);
    });
  },
  methods: {
    onTabClick(tab) {          // 标签页切换时触发
      this.$nextTick(() => {
        this.$refs[tab.name].onTabClick(this.amcsType);
      });
    },
  },
};
</script>
