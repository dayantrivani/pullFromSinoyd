<template>
  <el-row :gutter="10" v-loading="loading">
    <el-col :span="24" :h="6">
      <el-row :gutter="10" class="fill-h">
        <el-col :span="12">
          <el-card type="title">
            <template slot="header">
              <span class="fn-left">站点统计信息</span>
              <button class="el-card__headerbtn" title="更多" @click="getMorepPortInfo">
                <i class="fas fa-angle-double-right"></i>
              </button>
            </template>
            <port-statistics ref="portStatistics" :data="portStatistics"/>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card type="title">
            <template slot="header">
              <span>昨日数据传输有效率</span>
              <button class="el-card__headerbtn" title="更多" @click="getMoreDate">
                <i class="fas fa-angle-double-right"></i>
              </button>
            </template>
            <transmission-efficiency :data="dataTransferEffective"/>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" :h="6">
      <el-row :gutter="0" class="fill-h">
        <el-card type="title">
          <template slot="header">
            <span>小时超标报警统计</span>
            <button class="el-card__headerbtn" title="更多" @click="getMoreAlarmRecord">
              <i class="fas fa-angle-double-right"></i>
            </button>
          </template>
          <hourly-excess-alarm :data="alarmRecord"/>
        </el-card>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import PortStatistics from './components/PortStatistics';
import TransmissionEfficiency from './components/TransmissionEfficiency';
import HourlyExcessAlarm from './components/HourlyExcessAlarm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'Home',
  components: {
    PortStatistics,
    TransmissionEfficiency,
    HourlyExcessAlarm,
  },
  data() {
    return {
      loading: false,                // 页面加载状态
      portStatistics: {              // 启用率、联网率、在线率饼图
        onlineRate: '',              // 在线率
        netWorkingRate: '',          // 联网率
        enablingRate: '',            // 启用率
      },
      alarmRecord: [],               // 报警记录列表
      dataTransferEffective: [],     // 传输有效率柱状图
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  created() {
    this.getHomePage();
  },
  methods: {
    getHomePage() {                // 各组件数据集合的接口
      this.loading = true;
      this.$http.get(`amcs/homePage/${this.amcsType}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          const data = response.data.data || {};
          this.portStatistics = data.portStatistics || {
            onlineRate: '',              // 在线率
            netWorkingRate: '',          // 联网率
            enablingRate: '',            // 启用率
          };
          this.alarmRecord = data.alarmRecord || [];
          this.dataTransferEffective = data.dataTransferEffective || [];
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
    getMorepPortInfo() {           // 获取更多排口信息
      this.$refs.portStatistics.openDialog();
    },
    getMoreDate() {
      this.$router.push({ name: 'DataTransmissionEfficiency' });
    },
    getMoreAlarmRecord() {
      this.$router.push({ name: 'AlarmRecord' });
    },
  },
};
</script>

<style scoped>
</style>
