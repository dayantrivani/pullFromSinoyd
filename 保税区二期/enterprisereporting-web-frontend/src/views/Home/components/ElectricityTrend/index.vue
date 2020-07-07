<template>
  <div>
    <el-form :model="queryForm" inline class="mar-t-sm">
      <el-form-item>
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.fromTime"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-01"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.toTime"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM-01"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getItemList">查 询</el-button>
      </el-form-item>
    </el-form>
    <div style="height: calc(100% - 40px);">
      <div style="height: calc(25% - 5px);">
        <div class="title">企业用电趋势统计</div>
        <chart-bar-electricity ref="electricity" :data="itemList.electricity" style="height: calc(100% - 21px)"/>
      </div>
      <div class="mar-t-sm" style="height: calc(25% - 5px);">
        <div class="title">企业用水趋势统计</div>
        <chart-line-water ref="water" :data="itemList.water" style="height: calc(100% - 21px)"/>
      </div>
      <div class="mar-t-sm" style="height: calc(25% - 10px);">
        <div class="title">企业用天然气趋势统计</div>
        <chart-line-gas ref="gas" :data="itemList.steam" style="height: calc(100% - 21px)"/>
      </div>
      <div class="mar-t-sm" style="height: calc(25% - 5px);">
        <div class="title">企业用水蒸汽趋势统计</div>
        <chart-line-steam ref="steam" :data="steamList.total" style="height: calc(100% - 21px)"/>
      </div>
    </div>
  </div>
</template>

<script>
import ChartBarElectricity from './components/ChartBarElectricity';
import ChartLineWater from './components/ChartLineWater';
import ChartLineGas from './components/ChartLineGas';
import ChartLineSteam from './components/ChartLineSteam';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';

export default {
  name: 'ElectricityTrend',
  components: {
    ChartBarElectricity,
    ChartLineWater,
    ChartLineGas,
    ChartLineSteam,
  },
  data() {
    return {
      queryForm: {
        fromTime: formatDate(new Date(Date.now() - 5 * 3600000 * 24 * 31), 'Y-m-01'),
        toTime: formatDate(new Date(), 'Y-m-01'),
      },
      itemList: {
        electricityData: {}, // 用电数据
        waterData: {}, // 用水数据
        gasData: {}, // 用汽数据
      },
      steamList: {},
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 查询趋势数据
    getItemList() {
      this.getSteamList();
      this.$http.get('enterprise/energyConsumption/monReportTrend', {
        params: { fromTime: this.queryForm.fromTime, toTime: this.queryForm.toTime },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data || [];
          this.$refs.electricity.init();
          this.$refs.water.init();
          this.$refs.gas.init();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getSteamList() {
      this.$http.get('enterprise/energyConsumptionSteam/monReportTrend', {
        params: { fromTime: this.queryForm.fromTime, toTime: this.queryForm.toTime },
      }).then((response) => {
        if (response.data.success) {
          this.steamList = response.data.data || [];
          this.$refs.steam.init();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .title {
    color: #066ceb;
    font-size: 16px;
    margin-bottom: 10px;
  }
</style>
