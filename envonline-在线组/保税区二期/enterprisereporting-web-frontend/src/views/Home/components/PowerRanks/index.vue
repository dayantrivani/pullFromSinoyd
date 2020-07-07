<template>
  <div class="power fill-h" ref="progress">
    <div class="power-unit" style="text-align:end;">单位：{{ unit }}</div>
    <el-row v-for="(item, key) of electricityData" class="power-row" :key="item.psName">
      <el-col :span="24" style="color:#1e1e1e">{{ item.psName }}&nbsp;</el-col>
      <el-col :span="24" class="power-col">
        <el-progress
          :class="classList[key]"
          :percentage="item.totalQty / max * 100"
          :stroke-width="9"
          :format="() => item.totalQty || '0'"
        ></el-progress>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'PowerRanks',
  props: {
    electricityData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      unitNum: false,
      classList: ['suoerwei', 'fumiao', 'geruite', 'tianpu', 'akema'],
    };
  },
  computed: {
    // 取所有数据里的最大值去计算比例
    max() {
      return Math.max(...this.electricityData.map(e => e.totalQty));
    },
    unit() {
      return this.unitNum ? '万千瓦时' : '千瓦时';
    },
    // 取前五家企业
    filterData() {
      if (this.electricityData && this.electricityData.length > 5) {
        return this.electricityData.slice(0, 5);
      }
      return this.electricityData;
    },
    // 取用电数长度最长的值
    maxLength() {
      if (this.electricityData && this.electricityData.length > 5) {
        return Math.max(...this.electricityData.slice(0, 5).map(data => (`${data.totalQty}`).length));
      }
      return Math.max(...this.electricityData.map(data => (`${data.totalQty}`).length));
    },
  },
};
</script>

<style lang="scss" scoped>
.power {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
