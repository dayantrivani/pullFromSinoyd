<template>
  <div style="height: 100%">
    <div class="water-unit" style="text-align: end">单位：{{ unit }}</div>
    <el-row class="mar-t-xs" style="height: calc(100% - 20px)">
      <el-col
        v-for="(item, key) in waterData"
        :key="item.psName"
        :offset="key === 3 ? 4 : 0"
        :span="key === 3 ? 7 : key === 4 ? 10 : 8"
        class="text-center"
        style="height: 50%"
      >
        <water-box :content="item.totalQty" :index="key + 1" :label="item.psName"></water-box>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import waterBox from './components/waterBox';

export default {
  name: 'WaterRanks',
  props: {
    waterData: {
      type: Array,
      default: () => [],
    },
  },
  mixins: [],
  components: { waterBox },
  data() {
    return {
      unitNum: false,
    };
  },
  computed: {
    unit() {
      return this.unitNum ? '万立方米' : '立方米';
    },
    filterWaterData() {
      return this.waterData.slice(0, 5);
    },
  },
};
</script>

<style lang="scss">
</style>
