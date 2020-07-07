<template>
  <el-container id="outer-wrapper">
    <el-header>
      <h5>监察统计情况</h5>
    </el-header>
    <el-main>
      <el-container>
        <el-header>
          <span>
            <h5>监察任务统计</h5>
            <i class="el-icon-right"></i>
            <h6>Inspection task statistics</h6>
          </span>
        </el-header>
        <el-main>
          <ve-bar
            height="100%"
            width="100%"
            ref="chart1"
            :colors="color1"
            :legend-visible="false"
            :data="chartData"
            :extend="chartExtend"
            :after-config="afterConfig"
          ></ve-bar>
        </el-main>
      </el-container>
      <el-container>
        <el-header>
          <span>
            <h5>近期督查趋势</h5>
            <i class="el-icon-right"></i>
          </span>
        </el-header>
        <el-main>
          <ve-histogram
            height="100%"
            width="100%"
            ref="chart2"
            :colors="color1"
            :legend-visible="false"
            :data="chart2Data"
            :extend="chart2Extend"
            :mark-line="chart2Markline"
          ></ve-histogram>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import {
  getStatisticsType,
  getStatisticsTrend,
} from '@/api/modules/thematic-map.js';

export default {
  data() {
    this.color1 = ['#508EC3'];
    this.yAxis1 = {
      type: 'category',
      axisLabel: {
        color: '#fff',
        fontSize: 24,
      },
    };
    this.xAxis1 = {
      show: false,
    };
    this.chartExtend = {
      'yAxis.0.inverse': true,
      series(v) {
        v[0].backgroundStyle = { color: 'rgba(56, 65, 84, 0.8)' };
        return v;
      },
      tooltip(v) {
        v.trigger = 'none';
        return v;
      },
    };
    this.chart2Extend = {
      backgroundColor: 'rgba(13,26,52,1)',
      'yAxis.0.show': false,
      'xAxis.0.show': false,
      grid: {
        show: false,
        top: 0,
        left: '-5%',
        bottom: 0,
        right: '5%',
      },
    };
    this.chart2Markline = {
      data: [
        [
          {
            name: '标准1',
            coord: [1, 10],
            symbol: 'none',
          },
          {
            type: 'max',
            symbol: 'arrow',
          },
        ],
      ],
      label: {
        show: true,
      },
      itemStyle: {
        normal: {
          lineStyle: {
            type: 'dashed',
            color: 'red',
            width: 2,
          },
          label: {
            formatter: '',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bolder',
            },
          },
        },
      },
    };
    return {
      chartData: {
        columns: ['参数名', '参数'],
        rows: [
          { 序列: '1', 参数: 64, 参数名: '超标' },
          { 序列: '2', 参数: 58, 参数名: '恒定值' },
          { 序列: '3', 参数: 48, 参数名: '离线' },
          { 序列: '4', 参数: 25, 参数名: '数据异常' },
          { 序列: '5', 参数: 21, 参数名: '突击抽查' },
        ],
      },
      chart2Data: {
        columns: ['日期', '事件'],
        rows: [{ 日期: 1, 事件: 20 }],
      },
    };
  },
  created() {
    this.initChart2Data();
  },
  mounted() {
    getStatisticsType().then((res) => {
      if (res.status == 200 && res.data && res.data.code == 200) {
        this.chartData.rows = res.data.data.map(_ => ({ 参数: _.count, 参数名: _.type }));
      } else {
        this.$message.warning(res.data.msg);
      }
    });
    getStatisticsTrend().then((res) => {
      if (res.status == 200 && res.data && res.data.code == 200) {
        this.chart2Data.rows = res.data.data.map(_ => ({ 日期: Object.keys(_)[0], 事件: Object.values(_)[0] }));
      } else {
        this.$message.warning(res.data.msg);
      }
    });
  },
  methods: {
    afterConfig(opt) {
      opt.series[0].label = {
        position: 'insideLeft',
        formatter(i) {
          return `${i.name} ${i.value}`;
        },
        show: true,
        fontSize: 16,
      };
      opt.grid = {
        show: false,
        x: 20,
        x2: 20,
        y: 12,
        y2: 12,
      };
      opt.xAxis[0].show = false;
      opt.xAxis[1].show = false;
      opt.yAxis[0].axisLabel = {
        formatter: (i, j) => j + 1,
        color: 'white',
        fontSize: 20,
      };
      return opt;
    },
    afterConfig2(opt) {},
    initChart2Data() {
      this.chart2Data.rows = this.sinDataGenerator(30);
    },
    sinDataGenerator(arrLen) {
      const arr = [];
      for (let i = 0; i < (arrLen || 100); i++) {
        arr.push({
          日期: +i,
          事件: Math.abs(Math.sin(i / 2) * (i / 2 - 10) + i / 6) * Math.log(i),
        });
      }
      return arr;
    },
    resizeChart() {
      this.$nextTick(() => {
        this.$refs.chart1.resize();
        this.$refs.chart2.resize();
      });
    },
  },
};
</script>

<style lang="scss">
$blue: rgba(106, 186, 238, 1);
$gray: rgba(152, 159, 181, 1);
#outer-wrapper {
  height: 100%;
  width: 100%;
  > header {
    margin-top: -2%;
    margin-left: 10%;
    height: 1.5rem !important;
    > h5 {
      color: $blue;
      font-size: 0.83rem;
      font-weight: bold;
    }
  }
  > main {
    margin-top: 0;
    padding-top: 0;
    margin-left: 0;
    color: white;
    overflow: hidden;
    width: 100%;
    height: 100%;
    > section {
      height: 50%;
      width: 100%;
    }
    header {
      h5 {
        display: inline;
        font-size: 0.75rem;
        color: white;
      }
      i {
        font-size: 0.75rem;
      }
      h6 {
        font-size: 0.5rem;
        color: $gray;
        margin-top: 0.2rem;
      }
    }
    main:first-child {
      padding: 0;
      width: 100%;
      height: 90%;
    }
    main:last-child {
      padding: 0 3%;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
