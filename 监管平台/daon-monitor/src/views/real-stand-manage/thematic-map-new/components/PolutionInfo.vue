<template>
  <el-container id="outer-wrapper1">
    <el-header>
      <h5>污染源情况</h5>
    </el-header>
    <el-main>
      <el-container>
        <el-header>
          <h5>重点污染源占比</h5>
          <i class="el-icon-right"></i>
          <h6>Proportion of emphasis pollution sources</h6>
        </el-header>
        <el-main>
          <el-row style="height: 100%;">
            <el-col :span="12" style="height: 100%;">
              <div
                v-for="(item, index) in pieChartData1.rows"
                :key="index"
                style="margin-bottom: 5%;height: 45%;"
              >
                <h6>{{item["名称"]}}</h6>
                <div>
                  <h3>{{item["数量"]}}</h3>
                </div>
                <div
                  style="height: 20%;width: 100%;border:2px solid rgba(86,101,124,1);padding: 2px; box-sizing: content-box;"
                >
                  <span v-for="(input, i) in Math.floor(item['数量']/compartment)" :key="i"></span>
                  <span :style="{'width': (item['数量']*10)%(compartment*10)/10/compartment + '%'}"></span>
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="height: 100%;">
              <ve-ring
                width="100%"
                height="100%"
                ref="pieChart1"
                :events="chartEvents1"
	            	:settings="chartSettings"
                :data="pieChartData1"
                :extend="chartExtend1"
              >
                <div class="container">
                  <p class="value">{{ chart1.value }}<span>%</span></p>
                  <p class="label">{{ chart1.label }}</p>
                </div>
              </ve-ring>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-container>
        <el-header>
          <h5>污染源点位占比</h5>
          <i class="el-icon-right"></i>
          <h6>Proportion of emphasis pollution sources</h6>
        </el-header>
        <el-main>
          <ve-ring
            ref="pieChart2"
            height="100%"
            width="100%"
            :events="chartEvents2"
		        :settings="chartSettings"
            :extend="chartExtend2"
            :data="pieChartData2"
          >
          <div class="container">
            <p class="value">{{ chart2.value }}<span>%</span> </p>
            <p class="label">{{ chart2.label }}</p>
          </div>
          </ve-ring>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import { getEmphasis, getCompanyType } from '@/api/modules/thematic-map.js';

export default {
  name: 'PolutionInfo',
  data() {
    this.chartExtend1 = {
      tooltip: { show: false },
      'series.0.hoverOffset': 1,
      'series.0.radius': ['80%', '60%'],
      'series.0.center': ['50%', '50%'],
      'series.0.label': {
        show: false,
      },
      // "series.0.emphasis": {
      //   label: {
      //     formatter: _ => [`{a|${_.percent}%}`, `{b|${_.name}}`].join("\n"),
      //     show: true,
      //     rich: {
      //       a: {
      //         color: "white",
      //         fontSize: 25,
      //         fontWeight: "bold"
      //       },
      //       b: {
      //         color: "white",
      //         fontSize: 14,
      //         verticalAlign: "bottom"
      //       }
      //     }
      //   }
      // },
      legend: {
        show: false,
      },
      grid: {
        show: false,
        showBackground: true,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };
    this.chartExtend2 = {
      tooltip: { show: false },
      'series.0.radius': ['70%', '55%'],
      'series.0.label': {
        show: false,
      },
      'series.0.hoverOffset': 1,
      'series.0.center': ['70%', '50%'],
      // "series.0.emphasis": {
      //   label: {
      //     formatter: _ => [`{a|${_.percent}%}`, `{b|${_.name}}`].join("\n"),
      //     show: true,
      //     rich: {
      //       a: {
      //         color: "white",
      //         fontSize: 25,
      //         fontWeight: "bold"
      //       },
      //       b: {
      //         color: "white",
      //         fontSize: 14,
      //         verticalAlign: "bottom"
      //       }
      //     }
      //   }
      // },
      legend: {
        left: 0,
        top: '20%',
        orient: 'vertical',
        width: '1rem',
        padding: '10%',
        textStyle: {
          fontSize: 14,
          color: 'white',
        },
      },
    };
    this.chartSettings = {
      selectedMode: 'single',
    };
    this.chartEvents1 = {
		  pieselectchanged: this.selectHandler1,
      pieSelected: this.selectHandler1,
    };
    this.chartEvents2 = {
		  pieselectchanged: this.selectHandler2,
      pieSelected: this.selectHandler2,
    };
    return {
      compartment: 10,
      pieChartData1: {
        columns: ['名称', '数量'],
        rows: [
          { 名称: '重点污染源', 数量: 63 },
          { 名称: '非重点污染源头', 数量: 37 },
        ],
      },
      pieChartData2: {
        columns: ['名称', '数量'],
        rows: [
          { 名称: '废水排口', 数量: 124 },
          { 名称: '废气排口', 数量: 96 },
          { 名称: '雨水排口', 数量: 50 },
          { 名称: '噪声排口', 数量: 95 },
        ],
      },
      chart1: { label: '重点污染源', value: 63 },
      chart2: { label: '废水排口', value: 31 },
    };
  },
  methods: {
    afterConfig(opt) {
      console.log(opt);
      opt.series[0].selectedMode = 'single';
      return opt;
    },
    resizeChart() {
      this.$nextTick(() => {
        this.$refs.pieChart1.resize();
        this.$refs.pieChart2.resize();
        // this.$refs.pieChart2.echarts.dispatchAction({
        //   type: 'pieSelect',
        //   seriesIndex:0,  // 显示第几个series
        //   dataIndex: 0
        // });
      });
    },
    selectHandler1(v) {
      let value = 0;
      this.chart1.label = v.name;
      for (const { '名称': x, '数量': y } of this.pieChartData1.rows) {
        if (x === v.name) { value = y; break; }
      }
      this.chart1.value = (value / (Object.values(this.pieChartData1.rows).reduce((_, __) => _ + __['数量'], 0)) * 100).toFixed(1);
    },
    selectHandler2(v) {
      let value = 0;
      this.chart2.label = v.name;
      for (const { '名称': x, '数量': y } of this.pieChartData2.rows) {
        if (x === v.name) { value = y; break; }
      }
      console.log(value, Object.values(this.pieChartData2.rows).reduce((_, __) => _ + __['数量'], 0));
      this.chart2.value = (value / (Object.values(this.pieChartData2.rows).reduce((_, __) => _ + __['数量'], 0)) * 100).toFixed(1);
    },
  },
  mounted() {
    // 获取重点污染源占比
    getEmphasis().then((res) => {
      if (res.status === 200 && res.data && res.data.code === 200) {
        this.pieChartData1.rows[0]['数量'] = res.data.data[0];
        this.pieChartData1.rows[0].selected = true;
        this.pieChartData1.rows[1]['数量'] = res.data.data[1];
        this.compartment = (res.data.data[0] + res.data.data[1]) / 10;
      } else {
        this.$message.warning(res.data.msg);
      }
    });
    // 获取污染源点位占比
    getCompanyType().then((res) => {
      if (res.status === 200 && res.data && res.data.code === 200) {
        this.pieChartData2.rows[0]['数量'] = res.data.data[1];
        this.pieChartData2.rows[1]['数量'] = res.data.data[2];
        this.pieChartData2.rows[2]['数量'] = res.data.data[3];
        this.pieChartData2.rows[3]['数量'] = res.data.data[4];
      } else {
        this.$message.warning(res.data.msg);
      }
    });
    setTimeout((_) => {
      console.log(this.$refs);
		  this.$refs.pieChart1.echarts.dispatchAction({
        type: 'pieSelect',
        name: '重点污染源',
      });
      this.$refs.pieChart2.echarts.dispatchAction({
        type: 'pieSelect',
        name: '废水排口',
      });
    }, 500);
  },
};
</script>

<style lang="scss">
$blue: rgba(106, 186, 238, 1);
$gray: rgba(152, 159, 181, 1);
#outer-wrapper1 {
  height: 100%;
  width: 100%;
  > header {
    margin-top: -2%;
    margin-left: 10%;
    height: 1.5rem !important;
    color: $blue;
    > h5 {
      color: $blue;
      font-size: 0.83rem;
      font-weight: bold;
    }
  }
  > main {
    height: 100%;
    width: 100%;
    margin-top: 0;
    padding-top: 0;
    margin-left: 0;
    color: white;
    overflow: auto;
    header {
      padding: 0;
      > h5 {
        display: inline;
        font-size: 0.75rem;
        color: white;
      }
      i {
        font-size: 0.75rem;
      }
      > h6 {
        font-size: 0.5rem;
        color: $gray;
        margin-top: 0.2rem;
      }
    }
    main {
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 90%;
      h6 {
        font-size: 0.6rem;
        color: white;
      }
      h3 {
        font-size: 1.17rem;
        color: white;
      }
      span {
        background-color: $blue;
        width: 8.5%;
        height: 100%;
        display: inline-block;
        margin-right: 2px;
        vertical-align: top;
      }
    }
    > section:first-child {
      height: 55%;
      width: 100%;
      .container {
        position:absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -40%);
        text-align: center;
        >.value{
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: .3rem;
          >span{
            font-size: .6rem;
            background-color: transparent;
            vertical-align: middle;
          }
        }
        >.label{
          font-weight: bold;
          font-size: .55rem;
        }
      }
    }
    > section:last-child {
      height: 44%;
      width: 100%;
      .container {
        position:absolute;
        left: 70%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        >.value{
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: .3rem;
          >span{
            font-size: .6rem;
            background-color: transparent;
            vertical-align: middle;
          }
        }
        >.label{
          font-weight: bold;
          font-size: .55rem;
        }
      }
    }
  }
}
</style>
