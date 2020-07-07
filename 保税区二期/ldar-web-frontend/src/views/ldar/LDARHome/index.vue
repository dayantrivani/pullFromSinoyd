<template>
  <div>
    <el-card style="width: 400px;height:300px;float:left">
      <div slot="header">
        <span style="font-size: 16px;font-weight:bold;line-height: 30px">年度计划查询</span>
        <span style="float:right">
          <el-date-picker v-model="planForm.belongYear"
                          style="width:100px"
                          value-format="yyyy"
                          type="year"
                          @change="queryPlan"></el-date-picker>
        </span>
      </div>
      <div style="height:300px"
           id="eCharts-pie"></div>
    </el-card>
    <el-card style="width:calc(100% - 410px);height:300px;float:left;margin-left:10px">
      <div slot="header">
        <span style="font-size: 16px;font-weight:bold;line-height: 30px">排放量统计</span>
        <span style="float:right;">
          <!-- 类型 -->
          <el-select placeholder="选择类型"
                     style="width:120px;"
                     @change="cycleCouYearChange"
                     v-model="cycleCouForm.type">
            <el-option v-for="(item, index)  in $enum.typeOptions"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
          <!-- 年份 -->
          <el-date-picker placeholder="选择年份"
                          v-model="cycleCouForm.belongYear"
                          value-format="yyyy"
                          type="year"
                          style="width:120px;margin-left:10px;margin-right:10px"></el-date-picker>
          <!-- 类型为全年 -->
          <el-select style="width:120px;"
                     v-model="cycleCouForm.cycle">
            <el-option v-for="(item, index)  in cycleCouOptions"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
          <el-button type="primary"
                     style="margin-left:10px;"
                     icon="fas fa-search"
                     @click="queryCycleCou()">查 询</el-button>
        </span>
      </div>
      <div style="height:260px"
           id="eCharts-bar"></div>
    </el-card>
    <el-card style="width:calc(100% - 550px);height:300px;float:left;margin-top:10px">
      <div slot="header">
        <span style="font-size: 16px;font-weight:bold;line-height: 30px">减排量统计</span>
        <span style="float:right;">
          <!-- 类型 -->
          <el-select placeholder="选择类型"
                     style="width:120px;"
                     @change="cycleReduceYearChange"
                     v-model="cycleReduceForm.type">
            <el-option v-for="(item, index)  in $enum.typeOptions"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
          <!-- 年份 -->
          <el-date-picker placeholder="选择年份"
                          v-model="cycleReduceForm.belongYear"
                          value-format="yyyy"
                          type="year"
                          style="width:120px;margin-left:10px;margin-right:10px"></el-date-picker>
          <!-- 类型为全年 -->
          <el-select style="width:120px;"
                     v-model="cycleReduceForm.cycle">
            <el-option v-for="(item, index)  in cycleReduceOptions"
                       :key="index"
                       :label="item"
                       :value="index"></el-option>
          </el-select>
          <el-button type="primary"
                     style="margin-left:10px;"
                     icon="fas fa-search"
                     @click="queryCycleReduce()">查 询</el-button>
        </span>
      </div>
      <div style="height:260px;"
           id="eCharts-bar2"></div>
    </el-card>
    <el-card style="width: 540px;height:300px;float:left;margin-top:10px;margin-left:10px">
      <div slot="header">
        <span style="font-size: 16px;font-weight:bold;line-height: 30px">年度已检测机构项目占比</span>
        <span style="float:right">
          <el-date-picker v-model="testCompany.belongYear"
                          style="width:100px"
                          value-format="yyyy"
                          type="year"
                          @change="queryTestCompany"></el-date-picker>
        </span>
      </div>
      <div style="height:300px;"
           id="eCharts-pie2"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'LDARHome',
  data() {
    return {
      // 计划执行率
      planForm: {
        belongYear: '2020',
      },
      // 排放量
      cycleCouForm: {
        type: 'H',
        belongYear: '2019',
        cycle: '5',
      },
      cycleCouOptions: this.$enum.cycleOptionHalf,
      // 减排量
      cycleReduceForm: {
        type: 'H',
        belongYear: '2019',
        cycle: '5',
      },
      cycleReduceOptions: this.$enum.cycleOptionHalf,
      // 检测机构
      testCompany: {
        belongYear: '2019',
      },
      queryYear: 2019,
      planRate: 0,
    };
  },
  created() {
    this.initializeQuery();
  },
  mounted() {
    this.queryPlan();
    this.queryCycleCou();
    this.queryCycleReduce();
    this.queryTestCompany();
  },
  methods: {
    // 初始化查询条件
    initializeQuery() {
      const date = new Date();
      this.queryYear = date.getFullYear();
      const month = date.getMonth() + 1;
      if (month > 0 && month <= 6) {
        this.cycleCouForm.cycle = '6';
        this.cycleReduceForm.cycle = '6';
        this.queryYear = date.getFullYear() - 1;
      }
      if (month > 6 && month <= 12) {
        this.cycleCouForm.cycle = '5';
        this.cycleReduceForm.cycle = '5';
      }
      //   this.planForm.belongYear = this.queryYear.toString()
      this.cycleCouForm.belongYear = this.queryYear.toString();
      this.cycleReduceForm.belongYear = this.queryYear.toString();
      this.testCompany.belongYear = this.queryYear.toString();
    },
    // 年度计划查询
    queryPlan() {
      this.$http.get('ldar/plan/planRate', {
        params: { ...this.planForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const rate = response.data.data;
          this.BindChartPie(rate);
        } else {
          const val = {
            'initial': 0,
            'isPlanned': 0,
            'plannedNot': 0,
          };
          this.BindChartPie(val);
        }
      });
    },
    // 排放量统计 类型改变
    cycleCouYearChange() {
      this.cycleCouForm.cycle = '';
      if (this.cycleCouForm.type === 'H') {
        this.cycleCouOptions = this.$enum.cycleOptionHalf;
      }
      if (this.cycleCouForm.type === 'Q') {
        this.cycleCouOptions = this.$enum.cycleOptionQuarter;
      }
      if (this.cycleCouForm.type === 'Y') {
        this.cycleCouOptions = this.$enum.cycleOptionAll;
      }
    },
    // 排放量统计查询
    queryCycleCou() {
      this.$http.get('ldar/project/currentCycleCou', {
        params: { ...this.cycleCouForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const { currentCycleCou, psNames } = response.data.data;
          this.BindChartBar(currentCycleCou, psNames);
        }
      });
    },
    // 减排放量统计 类型改变
    cycleReduceYearChange() {
      this.cycleReduceForm.cycle = '';
      if (this.cycleReduceForm.type === 'H') {
        this.cycleReduceOptions = this.$enum.cycleOptionHalf;
      }
      if (this.cycleReduceForm.type === 'Q') {
        this.cycleReduceOptions = this.$enum.cycleOptionQuarter;
      }
      if (this.cycleReduceForm.type === 'Y') {
        this.cycleReduceOptions = this.$enum.cycleOptionAll;
      }
    },
    // 减排放量统计查询
    queryCycleReduce() {
      this.$http.get('ldar/project/currentCycleReduceCou', {
        params: { ...this.cycleReduceForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const { currentCycleReduceCou, psNames } = response.data.data;
          this.BindChartBar2(currentCycleReduceCou, psNames);
        }
      });
    },
    queryTestCompany() {
      this.$http.get('ldar/project/testCompany', {
        params: { ...this.testCompany },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const list = response.data.data;
          const nameList = list.map(item => item.name);
          this.BindChartPie2(list, nameList);
        }
      });
    },
    // 饼图一 左
    BindChartPie(rate) {
      const val = rate;
      const angle = Math.PI * val / 50 / 2;
      const pointStart = [
        0.5 - 0.5 * Math.cos(angle) * Math.sin(angle),
        0.5 + 0.5 * Math.cos(angle) * Math.cos(angle),
      ];
      const pointEnd = [
        0.5 - 0.5 * Math.cos(angle),
        0.5 + 0.5 * Math.cos(angle),
      ];
      const myChartFrist = echarts.init(document.getElementById('eCharts-pie'));
      const option = {
        legend: {
          textStyle: {
            color: '#90979c',
          },
          top: 10,
          data: ['按计划检测', '未按计划检测', '初始未执行'],
        },
        series: [{
          name: '占比',
          type: 'pie',
          startAngle: 270,
          radius: ['50%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: ({ data }) => `${data.value.toFixed(2)}%`,
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '18',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: true,
            },
          },
          data: [{
            name: '未按计划检测',
            value: val.plannedNot,
            label: {
              normal: {
                fontSize: 18,
                color: '#585F6E',
                fontWeight: 'bolder',
              },
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: pointStart[0],
                  y: pointStart[1],
                  x2: pointEnd[0],
                  y2: pointEnd[1],
                  colorStops: [
                    { offset: 0, color: '#FF8571' },
                    { offset: 1, color: '#FF8571' },
                  ],
                },
                shadowColor: 'rgba(34,192,245,0.3)',
                shadowBlur: 10,
              },
            },
          }, {
            name: '按计划检测',
            value: val.isPlanned,
            label: {
              normal: {
                fontSize: 18,
                color: '#585F6E',
                fontWeight: 'bolder',
              },
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: pointStart[0],
                  y: pointStart[1],
                  x2: pointEnd[0],
                  y2: pointEnd[1],
                  colorStops: [
                    { offset: 0, color: '#33CCFF' },
                    { offset: 1, color: '#33CCFF' },
                  ],
                },
                shadowColor: 'rgba(34,192,245,0.8)',
                shadowBlur: 10,
              },
            },
          },
          {
            name: '初始未执行',
            value: val.initial,
            label: {
              normal: {
                fontSize: 18,
                color: '#585F6E',
                fontWeight: 'bolder',
              },
            },
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: pointStart[0],
                  y: pointStart[1],
                  x2: pointEnd[0],
                  y2: pointEnd[1],
                  colorStops: [
                    { offset: 0, color: '#F5F5F5' },
                    { offset: 1, color: '#F5F5F5' },
                  ],
                },
                shadowColor: 'rgba(34,192,245,0.8)',
                shadowBlur: 10,
              },
            },
          },
          ],
        }],
      };
      myChartFrist.setOption(option, true);
      window.onresize = myChartFrist.resize;
    },
    // 饼图二 右
    BindChartPie2(list) {
      const myChartFrist = echarts.init(document.getElementById('eCharts-pie2'));
      const colorList = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6',
        '#e75fc3', '#f87be2', '#f2719a', '#fca4bb', '#f59a8f', '#fdb301', '#57e7ec'];
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '45%'],
            data: list,
            itemStyle: {
              normal: {
                color(params) {
                  return colorList[params.dataIndex];
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: '{b} : {c} ({d}%)',
              },
            },
          },
        ],
      };

      myChartFrist.setOption(option, true);
      window.onresize = myChartFrist.resize;
    },
    // 柱形图一 右
    BindChartBar2(currentCycleReduceCou, psNames) {
      const myChartFrist = echarts.init(document.getElementById('eCharts-bar2'));
      const data2 = currentCycleReduceCou;
      const titlename = psNames;
      const myColor = ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6'];
      const option = {
        xAxis: {
          show: false,
        },
        grid: {
          top: 10,
          containLabel: true,
          left: 2,
          right: '1%',
          bottom: 10,
        },
        yAxis: [{
          show: true,
          data: titlename,
          inverse: true,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        }],
        series: [{
          name: '条',
          type: 'bar',
          yAxisIndex: 0,
          data: data2,
          barWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: (params) => {
                const num = myColor.length;
                return myColor[params.dataIndex % num];
              },
            },
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{c}吨',
            },
          },
        }],
      };
      myChartFrist.setOption(option, true);
      window.onresize = myChartFrist.resize;
    },
    // 柱形图一 左
    BindChartBar(currentCycleCou, psNames) {
      const myChartFrist = echarts.init(document.getElementById('eCharts-bar'));
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: '{a} <br/>{b} : {c}吨',
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '14%',
          top: '16%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: psNames,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          show: false,
        },
        series: [{
          name: '排放量',
          type: 'bar',
          barWidth: '35',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#8bd46e',
              }, {
                offset: 1,
                color: '#09bcb7',
              }]),
              barBorderRadius: 11,
            },
          },
          data: currentCycleCou,
          label: {
            show: true,
            position: 'top',
            formatter: '{c}吨',
          },
        }],
      };
      myChartFrist.setOption(option, true);
      window.onresize = myChartFrist.resize;
    },
  },
};
</script>
