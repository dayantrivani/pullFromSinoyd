<template>
  <div class="mod-home-box" v-loading="loading">
    <el-row class="box-content">

      <!-- 上部分 -->
      <el-col :span="24" :h="3">

        <el-row>
          <!-- 图-数字-文字 -->
          <el-col :span="7" class="col-one">
            <el-row>
              <el-col :span="24" :h="6">
                <section data-mod-margin data-mod-radius @click="onClickPath('')">
                  <picture-info :index="0" :num="homeData.psAmount"/>
                </section>
                <section data-mod-margin data-mod-radius @click="onClickPath('ValveOpeningCheck')">
                  <picture-info :index="1" :num="homeData.openValveAmount"/>
                </section>
              </el-col>
              <el-col :span="24" :h="6" class="mar-t-xs">
                <section data-mod-margin data-mod-radius @click="onClickPath('')">
                  <picture-info :index="2" :num="homeData.portAmount" @click="onClickPath"/>
                </section>
                <section data-mod-margin data-mod-radius @click="onClickPath('SewageLicense')">
                  <picture-info :index="3" :num="homeData.pollutantPermitAmount"/>
                </section>
              </el-col>
            </el-row>
          </el-col>
          <!-- 排放情况 -->
          <el-col :span="7" class="col-two">
            <discharge-conditions ref="dischargeConditions"/>
          </el-col >
          <!-- 报警情况 -->
          <el-col :span="5" class="col-three">
            <alarm-condition ref="AlarmCondition"/>
          </el-col>
          <!-- 在线离线设备 -->
          <el-col :span="5" class="col-four">
            <online-devices ref="onlineDevices"/>
          </el-col>
        </el-row>

      </el-col>

      <!-- 下部分 -->
      <el-col :span="24" :h="9" class="mar-t-xs">

        <el-row>
          <!-- 报警信息 -->
          <el-col :span="17" :h="12" class="col-five">
            <AlarmInfo ref="alarmInfo"/>
          </el-col>
          <el-col :span="7" :h="12" class="col-six">
            <displacement ref="displacement"/>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import AlarmCondition from './components/AlarmCondition';
import AlarmInfo from './components/AlarmInfo';
import DischargeConditions from './components/DischargeConditions';
import OnlineDevices from './components/OnlineDevices';
import Displacement from './components/Displacement';

const refreshTime = 300;

export default {
  name: 'Home',
  mixins: [queryList],
  components: {
    AlarmCondition,
    AlarmInfo,
    DischargeConditions,
    OnlineDevices,
    Displacement,
  },
  data() {
    return {
      url: 'tpeci/homeTpeciWater',
      loading: false,
      homeData: {
        alarmInfo: [],                 // 报警信息
        alarmRecord: [],               // 报警记录
        alreadyEmissions: 0,           // 排放总量
        offlineAmount: 0,              // 离线数量
        onlineAmount: 0,               // 在线数量
        openValveAmount: 0,            // 开发申报审核数量
        otherAlarmAmount: 0,           // 其他报警数量
        overAlarmAmount: 0,            // 超标报警数量
        pollutantPermitAmount: 0,      // 许可证数量
        portAmount: 0,                 // 站点数
        psAmount: 0,                   // 企业数
        surplusEmissions: 0,           // 剩余排放量
        totalAlarmAmount: 0,           // 报警数量
        tpeciAmount: 0,                // 核定总量
      },
      countDown: refreshTime, // 倒计时 单位：s
      timer: () => {},
    };
  },
  watch: {
    countDown() {
      return this.countDown === 0 && this.onResetCountDown();
    },
  },
  created() {
    if (refreshTime) {
      this.timer = setInterval(() => this.countDown > 0 && this.countDown--, 1000);
    }
  },
  methods: {
    onClickPath(name) {  // 路径
      if (name) {
        this.$router.push({ name });
      }
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.homeData = response.data.data || [];
          this.$refs.dischargeConditions.dealBefore(this.homeData);
          this.$refs.AlarmCondition.dealBefore(this.homeData);
          this.$refs.onlineDevices.dealBefore(this.homeData);
          this.$refs.alarmInfo.dealBefore(this.homeData);
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 重置计时
    onResetCountDown() {
      this.getItemList();
      if (refreshTime) {
        this.countDown = refreshTime;
        clearInterval(this.timer);
        this.timer = setInterval(() => this.countDown > 0 && this.countDown--, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mod-home-box{
  // 通用样式
  .el-row{
    width: 100%;
    height: 100%;
    overflow: hidden;
    section[data-mod-margin][data-mod-radius]{
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
  }
  // 指定样式
  > .el-row{
    .el-col{
      &.col-one{
        section{
          cursor: pointer;
          float: left;
          &:nth-child(2){
            margin-left: 5px;
          }
          width: calc(50% - 2.5px);
          height: 100%;
        }
      }
      &.col-two{
        section{
          width: calc(100% - 7.5px);
          height: 100%;
          margin: 0 2.5px 0 5px;
        }
      }
      &.col-three{
        section{
          width: calc(100% - 5px);
          height: 100%;
          margin: 0 2.5px;
        }
      }
      &.col-four{
        section{
          width: calc(100% - 2.5px);
          height: 100%;
          margin: 0 0 0 2.5px;
        }
      }
      &.col-five{
        section{
          width: calc(100% - 2.5px);
          height: 100%;
          margin: 0 2.5px 0 0
        }
      }
    }
  }
}
</style>
