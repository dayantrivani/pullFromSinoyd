<template>
  <!-- 首页 -->
  <el-row :gutter="10" class="home-box">
    <el-col :span="12">
      <div class="contain" style="height: calc(33.3% - 5px);">
        <div class="title">用电排名</div>
        <div class="main">
          <power-ranks :electricityData="itemList.electricity"></power-ranks>
        </div>
      </div>
      <div class="contain mar-t-sm" style="height: calc(33.3% - 5px);">
        <div class="title">用水排名</div>
        <div class="main">
          <water-ranks :waterData="itemList.water"></water-ranks>
        </div>
      </div>
      <div class="contain mar-t-sm" style="height: calc(33.3% - 10px);">
        <div class="title">用天然气排名</div>
        <div class="main">
          <gas-ranks :gasData="itemList.steam"></gas-ranks>
        </div>
      </div>
      <div class="contain mar-t-sm" style="height: calc(33.3% - 10px);">
        <div class="title">用水蒸汽排名</div>
        <div class="main">
          <steam-ranks></steam-ranks>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="contain" style="height: 133.3%">
        <electricity-trend style="height: 100%"></electricity-trend>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import PowerRanks from './components/PowerRanks';
import WaterRanks from './components/WaterRanks';
import SteamRanks from './components/SteamRanks';
import GasRanks from './components/GasRanks';
import ElectricityTrend from './components/ElectricityTrend';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'Home',
  components: {
    PowerRanks,
    WaterRanks,
    SteamRanks,
    GasRanks,
    ElectricityTrend,
  },
  data() {
    return {
      belongYear: new Date().getFullYear().toString(),
      itemList: {},
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.$http.get('enterprise/energyConsumption/yearReportCount', {
        params: { belongYear: this.belongYear },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data || [];
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
.home-box {
  height: calc(100% -39px);
  overflow-y: scroll;
  >div.el-row {
    height: calc(50% - 5px);
  }
  .contain {
    height: 100%;
    padding: 10px;
    background-color: #fff;
    border: 0 solid transparent;
    border-radius: 10px;
    .title {
      padding-left: 10px;
      font-size: 18px;
      font-weight: 700;
      user-select: none;
      color: #1598ff;
    }
    .main {
      height: calc(100% - 25px);
    }
  }
}
</style>

<style lang="scss">
.home-box {
  // 进度条
  .progress {
    height: 100%;
    // height: 180px;
    margin-top: 5px;
    font-size: 14px;
    .label {
      text-align: center;
    }
    .progress-outer {
      position: relative;
      border: 2px solid #ccc;
      padding: 1px;
      width: 22px;
      height: calc(100% - 60px);
      background-color: transparent;
      border-radius: 11px;
      margin: 8px auto;
    }
    .progress-inner {
      max-height: 140px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 18px;
      border-radius: 9px;
    }
    .text {
      text-align: center;
      color: #c0c6cb;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .power {
    .el-progress-bar__outer {
      background-color: #ccc;
    }
    .el-progress__text {
      color: #c0c6cb;
    }
    .suoerwei {
      .el-progress-bar__inner {
        background: linear-gradient(to right, #1598ff, #2ad2ff);
      }
    }
    .fumiao {
      .el-progress-bar__inner {
        background: linear-gradient(to right, #e97818, #f9d701);
      }
    }
    .geruite {
      .el-progress-bar__inner {
        background: linear-gradient(to right, #5affaa, #54fef2);
      }
    }
    .tianpu {
      .el-progress-bar__inner {
        background: linear-gradient(to right, #d5f530, #49cb7c);
      }
    }
    .akema {
      .el-progress-bar__inner {
        background: linear-gradient(to right, #ff4343, #fdaf77);
      }
    }
  }
}
</style>
