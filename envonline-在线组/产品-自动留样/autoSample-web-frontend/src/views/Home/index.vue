<template>
  <el-row :gutter="5">
    <el-col :span="6" class="topBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">留样仪在线情况</span>
          <!-- <button class="el-card__headerbtn">
            <i class="icon icon-cog">详情</i>
          </button> -->
        </template>
        <div style="width: 60%;float: left;" class="chartBox" ref="olineInfo"></div>
        <div style="width: 40%;float: left;position: relative;height: 100%">
          <div style="position: absolute;top: 50%;transform: translateY(-60%);">
            <p class="pieLegend" v-for="(item, index) in getOLInfoOption().series[0].data" :key="index">
              <span class="legendBox" :style="`background-color: ${getOLInfoOption().color[index]}`"></span>
              <span> {{item.name}}</span>
              <span><b> {{item.value}}</b>个</span>
            </p>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="9" class="topBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">超标留样次数</span>
          <!-- <button class="el-card__headerbtn">
            <i class="icon icon-cog">详情</i>
          </button> -->
        </template>
        <div class="mar-l-xs" style="height: 100%;">
          <progress-box
            label="昨日"
            labelWidth="38px"
            :percentage="this.overProofNum.lastDay"
            :text="this.overProofNum.lastDay + '次'"
            status="lastDay"
          ></progress-box>
          <progress-box
            label="当月"
            labelWidth="38px"
            :percentage="this.overProofNum.sampleMonth"
            :text="this.overProofNum.sampleMonth + '次'"
            status="sampleMonth"
          ></progress-box>
          <progress-box
            label="月平均"
            labelWidth="38px"
            :percentage="this.overProofNum.monthAvg"
            :text="this.overProofNum.monthAvg + '次'"
            status="monthAvg"
          ></progress-box>
        </div>
      </el-card>
    </el-col>
    <el-col :span="9" class="topBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">远程留样次数</span>
          <!-- <button class="el-card__headerbtn">
            <i class="icon icon-cog">详情</i>
          </button> -->
        </template>
        <div class="mar-l-xs" style="height: 100%;">
          <progress-box
            label="昨日"
            labelWidth="38px"
            :percentage="this.remoteSampleNum.lastDay"
            :text="this.remoteSampleNum.lastDay + '次'"
            status="lastDay"
          ></progress-box>
          <progress-box
            label="当月"
            labelWidth="38px"
            :percentage="this.remoteSampleNum.sampleMonth"
            :text="this.remoteSampleNum.sampleMonth + '次'"
            status="sampleMonth"
          ></progress-box>
          <progress-box
            label="月平均"
            labelWidth="38px"
            :percentage="this.remoteSampleNum.monthAvg"
            :text="this.remoteSampleNum.monthAvg + '次'"
            status="monthAvg"
          ></progress-box>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" class="midBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">满样提醒</span>
          <button class="el-card__headerbtn"
            @click="$router.replace({ name: 'RTOnlineListQuery', query: { alarmStatus: 2 } })">
            <i class="icon icon-cog">详情</i>
          </button>
        </template>
        <el-row :gutter="5" class="chartBox">
          <el-col :span="14">
            <div class="chartBox" ref="sample"></div>
          </el-col>
          <el-col :span="10" class="pad-y-lg">
            <marquee
              height="100%"
              width="95%"
              class="marquee"
              behavior="scroll"
              scrollamount="3"
              direction="up"
              onmouseover=this.stop()
              onmouseout=this.start()>
              <ul class="pad-l-md">
                <li v-for="(item, index) in this.alarmForFullSample.alarmRemindPort" :key="index">{{item.portName}}</li>
              </ul>
            </marquee>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="7" class="midBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">即将满样提醒</span>
          <button class="el-card__headerbtn"
            @click="$router.replace({ name: 'RTOnlineListQuery', query: { alarmStatus: 1 } })">
            <i class="icon icon-cog">详情</i>
          </button>
        </template>
        <el-row :gutter="5" class="chartBox">
          <el-col :span="14">
            <div class="chartBox" ref="aboutSample"></div>
          </el-col>
          <el-col :span="10" class="pad-y-lg">
            <marquee
              height="100%"
              width="95%"
              class="marquee"
              style="border-top: 1px solid #79DF9D;"
              behavior="scroll"
              scrollamount="3"
              direction="up"
              onmouseover=this.stop()
              onmouseout=this.start()>
              <ul class="pad-l-md">
                <li v-for="(item, index) in this.alarmWarnForFullSample.alarmRemindPort"
                  :key="index"
                >{{item.portName}}</li>
              </ul>
            </marquee>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="9" class="midBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">留样过期情况</span>
          <!-- <button class="el-card__headerbtn">
            <i class="icon icon-cog">详情</i>
          </button> -->
        </template>
        <el-row :gutter="5" class="chartBox">
          <el-col :span="7">
            <div class="chartBox" style="display: flex;justify-content: space-between;align-items: center;">
              <div style="width:58%;margin: 0 auto">
                <div style="width: 100%;padding-bottom: 100%;height：0;position: relative;
                  background: url('img/expire.png');background-repeat: no-repeat;background-size: 100% 100%;">
                  <div style="position:absolute;width:100%;height:10%;text-align:center;margin-top:20%;">
                    <span style="font-size:1.5vw;color:rgb(254,169,140)">{{this.sampleExpired.expiredPortNum}}</span>
                  </div>
                </div>
                <div style="width:100%;padding-bottom:100%;height0;position:relative;margin-top:7%;
                  background: url('img/aboutExpire.png');background-repeat: no-repeat;background-size: 100% 100%;">
                  <div style="position:absolute;width:100%;height:10%;text-align:center;margin-top:20%;">
                    <span style="font-size:1.5vw;color:rgb(254,129,158)"
                    >{{this.sampleExpired.aboutExpiredPortNum}}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="17">
            <el-table
          border
          height="100%"
          v-loading="loading"
          :data="sampleExpiredList"
          highlight-current-row>
          <el-table-column property="portName" label="排口名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="expiredBottle" label="过期瓶号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="aboutExpiredBottle" label="即将过期瓶号" show-overflow-tooltip>
          </el-table-column>
        </el-table>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="24" class="botBox">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">超标（远程）留样</span>
          <!-- <button class="el-card__headerbtn">
            <i class="icon icon-cog">详情</i>
          </button> -->
        </template>
        <el-table
          border
          height="100%"
          v-loading="loading"
          :data="itemList"
          highlight-current-row>
          <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
          <el-table-column property="psName" label="企业名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="portName" label="排口名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="tstamp" min-width="110" label="数据时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="relationBottle" label="关联瓶号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="sampleType" label="留样方式" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Echart from 'echarts';
// 引入折线图
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import progressBox from './components/progress';

export default {
  name: 'Home',
  components: { progressBox },
  data() {
    return {
      loading: false,
      OLChart: {},
      line: {}, // 在线率
      overProofNum: {
        lastDay: 0, // 昨日
        sampleMonth: 0, // 当月
        monthAvg: 0, // 月平均
      }, // 超标留样次数
      remoteSampleNum: {
        lastDay: 0, // 昨日
        sampleMonth: 0, // 当月
        monthAvg: 0, // 月平均
      }, // 远程留样次数
      alarmForFullSample: {
        alarmRemindPort: [],
        allPortNum: 0,
        portNum: 0,
      }, // 满样提醒
      alarmWarnForFullSample: {
        alarmRemindPort: [],
        allPortNum: 0,
        portNum: 0,
      }, // 即将满样提醒
      sampleExpired: {
        expiredPortNum: 0,
        aboutExpiredPortNum: 0,
      }, // 留样过期计划
      itemList: [],
      sampleExpiredList: [],
      pager: {
        rows: 15,
        page: 1,
        total: 1,
      },
    };
  },
  mounted() {
  },
  created() {
    this.getData();
  },
  watch: {
    line: {
      handler() {
        this.initOLEcharts();
      },
    },
    alarmForFullSample: {
      handler() {
        this.initSampleEcharts();
      },
    },
    alarmWarnForFullSample: {
      handler() {
        this.initAboutSampleEcharts();
      },
    },
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    getData() { // 获取首页数据
      this.$http.get('autoSample/homePage').then((response) => {
        if (response.data.success) {
          this.line = response.data.data.line; // 留样仪在线情况
          this.overProofNum = response.data.data.overProofNum; // 超标留样次数
          this.remoteSampleNum = response.data.data.remoteSampleNum; // 远程留样次数
          this.alarmForFullSample = response.data.data.alarmForFullSample; // 满样提醒
          this.alarmWarnForFullSample = response.data.data.alarmWarnForFullSample; // 即将满样提醒
          this.sampleExpired = response.data.data.sampleExpired; // 留样过期情况
          this.itemList = response.data.data.sampleRecord;
          this.sampleExpiredList = response.data.data.sampleExpired.expiredPort;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
      });
    },
    initOLEcharts() { // 初始化在线饼图
      this.OLChart = Echart.init(this.$refs.olineInfo);
      this.OLChart.setOption(this.getOLInfoOption());
      window.onresize = () => {
        this.OLChart.resize();
      };
    },
    initSampleEcharts() { // 初始化满样饼图
      this.SampleCharts = Echart.init(this.$refs.sample);
      this.SampleCharts.setOption(this.getSampleOption());
      window.onresize = () => {
        this.SampleCharts.resize();
      };
    },
    initAboutSampleEcharts() { // 初始化即将满样饼图
      this.AboutSampleCharts = Echart.init(this.$refs.aboutSample);
      this.AboutSampleCharts.setOption(this.getAboutSampleOption());
      window.onresize = () => {
        this.AboutSampleCharts.resize();
      };
    },
    getOLInfoOption() { // 在线饼图配置
      return {
        series: [
          {
            type: 'pie',
            hoverAnimation: false,
            radius: '70%',
            center: ['50%', '50%'],
            label: { show: false },
            data: [
              { value: this.line.online, name: '在线' },
              { value: this.line.offline, name: '离线' },
            ],
          },
        ],
        color: ['#37A2DA', '#DDE6EB'],
      };
    },
    getSampleOption() { // 满样饼图配置
      return {
        color: ['#37A2DA', '#37A2DA', '#CAE2EE'],
        tooltip: {
          show: false,
        },
        legend: {
          selectedMode: false,
          bottom: '20',
          data: ['满样站点', '全部站点'],
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            radius: [0, '40%'],
            center: ['50%', '40%'],
            label: {
              normal: {
                formatter: '{a|{c}} \n {b|{b}}',
                position: 'center',
                rich: {
                  a: {
                    color: '#fefffe',
                    fontSize: 18,
                    fontWeight: 600,
                    lineHeight: 20,
                  },
                  b: {
                    fontSize: 12,
                    color: '#fefffe',
                  },
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              { value: this.alarmForFullSample.portNum, name: '满样' },
            ],
          }, {
            // name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            radius: ['50%', '65%'],
            center: ['50%', '40%'],
            label: {
              normal: {
                position: 'inner',
                formatter: '',
              },
            },
            data: [
              { value: this.alarmForFullSample.portNum, name: '满样站点' },
              { value: this.alarmForFullSample.allPortNum, name: '全部站点' },
            ],
          },
        ],
      };
    },
    getAboutSampleOption() { // 即将满样饼图配置
      return {
        color: ['#79DF9D', '#79DF9D', '#D9EFE1'],
        tooltip: {
          show: false,
        },
        legend: {
          selectedMode: false,
          bottom: '20',
          data: ['即将满样站点', '全部站点'],
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            radius: [0, '40%'],
            center: ['50%', '40%'],
            label: {
              normal: {
                formatter: '{a|{c}} \n {b|{b}}',
                position: 'center',
                rich: {
                  a: {
                    color: '#fefffe',
                    fontSize: 18,
                    fontWeight: 600,
                    lineHeight: 20,
                  },
                  b: {
                    fontSize: 12,
                    color: '#fefffe',
                  },
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              { value: this.alarmWarnForFullSample.portNum, name: '即将满样' },
            ],
          }, {
            // name: '访问来源',
            type: 'pie',
            hoverAnimation: false,
            radius: ['50%', '65%'],
            center: ['50%', '40%'],
            label: {
              normal: {
                position: 'inner',
                formatter: '',
              },
            },
            data: [
              { value: this.alarmWarnForFullSample.portNum, name: '即将满样站点' },
              { value: this.alarmWarnForFullSample.allPortNum, name: '全部站点' },
            ],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.topBox {
  height: calc(26% - 5px);
}
.botBox {
  height: 40%;
}
.midBox {
  height: calc(34% - 10px);
}
.chartBox {
  height: 100%;
}
.marquee {
  border-top: 1px solid #409EFF;
  background: #eff;
}
.pieLegend {
  >.legendBox {
    display: inline-block;
    width: 10px;height: 10px;
  }
  >span {
    vertical-align: middle;
  }
}
// 进度条
.progress {
  display: flex;
  flex-direction: row;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  .label {
    height: 100%;
  }
  .percentage {
    height: 100%;
    min-width: 20px;
    background-color: #409EFF;
    border-radius: 12px;
    margin-left: 10px;
  }
  .text {
    height: 100%;
    margin-left: 10px;
  }
}
</style>
