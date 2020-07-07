<template>
  <div class="water">
    <div class="water-wrap">
      <span class="content">{{ content }}</span>
      <span class="index">{{ index }}</span>
    </div>
    <div class="label" :title="label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'waterBox',
  mixins: [],
  props: {
    content: {
      type: [String, Number],
      default: 5000,
    },
    index: {
      type: [String, Number],
      default: 1,
    },
    label: {
      type: String,
      default: '北方天普',
    },
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scope>
.water-box {
  height: 300px !important;
}
// 水滴盒子
.water {
  height: 100%;
  $water-bg: '../../../../../assets/img/water/water_79x78_big.png';

  > .water-wrap {
    position: relative;
    width: 100%;
    height: calc( 100% - 20px);
    display: inline-block;
    background: url($water-bg) no-repeat;
    background-position: 50% 0;
    background-size: contain;
    > .content, .index {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    > .content {
      top: 15%;
      color: #10f6fe;
      font-size: 16px;
    }
    > .index {
      bottom: 16%;
      color: #f2ff25;
      font-size: 16px;
    }
  }
  > .label {
    max-width: 121px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1e1e1e;
  }
}
</style>
