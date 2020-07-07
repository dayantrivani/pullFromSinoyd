<template>
  <div class="time-line">
    <el-scrollbar class="scrollbar">
      <ul class="time-list">
        <li class="time-item" v-for="(item, index) in (reverse ? listReverse : list)" :key="index">
          <div class="time-item__tail"></div>
          <div class="time-item__ring" :class="{ 'time-item__ring--select': selectIndex === index }" @click="selectIndex = index">
            <div class="time-item__ring--inner"></div>
          </div>
          <div class="time-item__node">
            <slot v-bind:item="item">{{item.timestamp}}</slot>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'TimeLine',
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {          // 时间线数据集合
      type: Array,
      default() {
        return [];
      },
    },
    reverse: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectIndex: 0,
      // listReverse: [],
    };
  },
  computed: {
    listReverse() {
      return _.cloneDeep(this.list).reverse();
    },
  },
  watch: {
    reverse(val) {
      // this.selectIndex = this.list.length - this.selectIndex - 1;
      this.selectIndex = 0;
      if (val) {
        this.$emit('input', this.listReverse[0] || {});
      } else {
        this.$emit('input', this.list[0] || {});
      }
    },
    selectIndex: {
      handler(val) {
        if (this.reverse) {
          this.$emit('input', this.listReverse[val] || {});
        } else {
          this.$emit('input', this.list[val] || {});
        }
      },
      immediate: true,
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.time-line{
  width: 100%;
  height: 100%;
  .scrollbar{
    width: 100%;
    height: 100%;
    margin: 0;
    .time-list{
      font-size: 14px;
      .time-item {
        position: relative;
        padding-bottom: 20px;
        font-size: 14px;
        &:not(:last-child) {
          .time-item__tail {
            position: absolute;
            left: 9px;
            top: 2px;
            height: 100%;
            border-left: 2px solid #E4E7ED;
          }
        }
        .time-item__ring {
          cursor: pointer;
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid #E4E7ED;
          .time-item__ring--inner{
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: #E4E7ED;
          }
        }
        .time-item__ring--select {
          // border: 2px solid #409EFF;
          .time-item__ring--inner{
            border: 2px solid #409EFF;
            // background-color: #409EFF;
          }
        }
        .time-item__node {
          width: 100%;
          min-height: 20px;
          padding-left: 24px;
        }
      }
    }
  }
}
</style>
