<template>
  <div class="fill-h">
    <div class="gas-unit fn-right">单位：{{ unit }}</div>
    <el-row class="fn-flex flex-x-around fill-w" style="height:calc(100% - 20px)" :gutter="10">
      <div style="width: calc(20% - 10px);" v-for="(item, key) in gasData" :key="item.psName">
        <progress-box
          :max="max"
          :text="item.psName"
          :label="item.totalQty"
          :percentage="item.totalQty"
          :color="colorList[key]"
        ></progress-box>
      </div>
    </el-row>
    <!-- </div> -->
  </div>
</template>

<script>
import progressBox from './components/progressBox';

export default {
  name: 'GasRanks',
  props: {
    gasData: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [],
  components: { progressBox },
  data() {
    return {
      unitNum: false,
      colorList: ['#ffe300', '#b156f7', '#04abfa', '#23e680', '#fecc60'],
    };
  },
  computed: {
    unit() {
      return this.unitNum ? '万吨' : '吨';
    },
    filterData() {
      if (this.gasData && this.gasData.length > 5) {
        return this.gasData.slice(0, 5);
      }
      return this.gasData;
    },
    max() {
      return Math.max(...this.gasData.map(gas => gas.totalQty));
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.gas-unit {
  text-align: right;
}
</style>
