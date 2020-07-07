<template>
  <div class="list" ref="list">
    <div :class="{ 'cc': 1, 'rowup': isMax }" :style="{ 'animation-duration': `${time}s` }">
      <div class="s" v-for="(v, i) in num" :key="i">
        <div v-for="(item, index) in data" :key="index">
          <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ContentUp',
  props: {
    num: {
      type: Number,
      default: 2,
    },
    play: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      required: true,
    },
    time: {
      type: Number,
      default: 10,
    },
    itemHeight: {
      type: [Number, String],
      default: 20,
    },
  },
  computed: {
    dataLen() {
      return this.data ? this.data.length : 0;
    },
    boxHeight() {
      return this.$refs.list.getBoundingClientRect().height;
    },
    itemsHeight() {
      return this.dataLen * this.itemHeight;
    },
    isMax() {
      if (this.$refs.list && this.itemsHeight && this.play) {
        return this.itemsHeight > this.boxHeight;
      }
      return this.play && 1;
    },
  },
  watch: {
    data(val) {
      if (val) {
        this.addKeyFrames(`-${(this.dataLen) * this.itemHeight + 10}px`);
      }
    },
  },
  mounted() {
    if (this.play) {
      this.addKeyFrames(`-${this.dataLen * this.itemHeight + 10}px`);
    }
  },
  methods: {
    addKeyFrames(y) {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = 'rowup';
      // eslint-disable-next-line
      const keyFrames = '\
        @-webkit-keyframes rowup {\
          0% {\
            -webkit-transform: translate3d(0, 0, 0);\
            transform: translate3d(0, 0, 0);\
          }\
          100% {\
            -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
            transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
          }\
        }\
        @keyframes rowup {\
          0% {\
            -webkit-transform: translate3d(0, 0, 0);\
            transform: translate3d(0, 0, 0);\
          }\
          100% {\
            -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
            transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
          }\
        }';
      style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, y);
      const item = document.getElementById('rowup');
      if (item) {
        document.getElementsByTagName('head')[0].replaceChild(style, item);
      } else {
        document.getElementsByTagName('head')[0].appendChild(style);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .list{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &:hover .rowup {
      animation-play-state: paused;
    }
  }
  .list .s {
    // margin-bottom: 10px;
    >div:nth-child(2n) {
      @extend .bg;
    }
  }
  .list .rowup{
    -webkit-animation: 3s rowup linear infinite normal;
    animation: 3s rowup linear infinite normal;
    animation-delay: 1s;
    position: relative;
    >.s{
      >div:nth-child(2n) {
        @extend .bg;
      }
    }
  }
  .bg{
    width: 97%;
    margin: 0 auto;
    background: #001228;
  }
</style>
