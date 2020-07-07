<template>
  <div class="progress">
    <div class="label" :style="`width: ${labelWidth||''}`">{{label}}</div>
    <div :style="`width: ${percentage/max*100}%;background-color: ${color};`" class="percentage"></div>
    <div class="text">{{text || percentage}}</div>
  </div>
</template>

<script>
export default {
  name: 'progressBox',
  props: {
    label: { // 标签文字
      type: String,
      required: false,
    },
    percentage: { // 当前数据
      type: Number,
      required: false,
      default: 0,
    },
    max: { // 数据最大值
      type: Number,
      required: false,
      default: 1000,
    },
    text: { // 显示文字（后方）
      type: String,
      required: false,
    },
    labelWidth: { // label宽度
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
  },
  computed: {
    color() {
      let color;
      if (this.status === 'lastDay') {
        color = 'rgb(252,114,147)';
      } else if (this.status === 'sampleMonth') {
        color = 'rgb(255,159,127)';
      } else if (this.status === 'monthAvg') {
        color = 'rgb(157,150,245)';
      } else {
        color = this.status;
      }
      return color;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  display: flex;
  flex-direction: row;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  margin-top: 3.5%;
  .label {
    height: 100%;
    white-space: nowrap;
  }
  .percentage {
    height: 100%;
    min-width: 20px;
    background-color: #409EFF;
    border-radius: 12px;
    margin-left: 10px;
  }
  .text {
    height: 100%;
    margin-left: 10px;
    white-space: nowrap;
  }
}
</style>
