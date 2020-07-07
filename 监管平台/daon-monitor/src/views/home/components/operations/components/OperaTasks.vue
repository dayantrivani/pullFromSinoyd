<template>
<!-- 运维任务 -->
  <div class="echart_class">
    <a-form class="form_class" layout="inline">
      <a-form-item>
        <a-select
          showSearch
          :allow-clear="true"
          style="width: 300px"
          placeholder="请选择运维企业"
          optionFilterProp="children"
          v-model="queryForm.corpUscc">
          <a-select-option
            v-for="item in companyData"
            :key="item.id"
            :value="item.uscc">
            {{item.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-date-picker
          v-model="queryForm.begin"
          placeholder="任务项规定时间开始时间"
          :allow-clear="false"
          style="width: 200px"
          format="YYYY-MM-DD">
        </a-date-picker>
      </a-form-item>
      <a-form-item>
        <a-date-picker
          v-model="queryForm.end"
          placeholder="任务项规定时间结束时间"
          :allow-clear="false"
          style="width: 200px"
          format="YYYY-MM-DD">
        </a-date-picker>
      </a-form-item>
      <a-form-item class="mar-r-0">
        <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
      </a-form-item>
    </a-form>
    <ul class="lenged">
      <li class="line" @click="isClick1">
        <span class="line_class"></span>
        <span class="name">总任务数</span>
      </li>
      <li class="bar"  @click="isClick2">
        <span class="bar_class"></span>
        <span class="name">非故障任务数</span>
      </li>
    </ul>
    <chart v-if="type === 1" ref="chart" :option="option" :isAction="isAction" :data="data" :isClick="true"/>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';
import { getList } from '@/api/modules/home.js';

export default {
  name: 'OperaTasks',
  props: {
    companyData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('home', ['type']),
  },
  data() {
    return {
      data: [],
      isShow1: true, // 显示 总任务数 的 lenged
      isShow2: true, // 显示 非故障任务数 的 lenged
      isAction: false,  // 启动自动高亮
      queryForm: {
        corpUscc: undefined,
        begin: moment().startOf('year'),
        end: moment().startOf('day'),
      },
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff',
            },
          },
        },
        grid: {
          borderWidth: 0,
          top: 40,
          bottom: 70,
          left: 60,
          right: 20,
          textStyle: {
            color: '#fff',
          },
        },
        legend: {
          right: '4%',
          top: 0,
          show: false,
          // selectedMode: false,
          selected: {
            '总任务数': true,
            '非故障任务数': true,
          },
          textStyle: {
            color: '#90979c',
          },
          data: ['总任务数', '非故障任务数'],
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#90979c',
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              color: '#979797',
              formatter: (params) => {
                let newParamsName = '';
                const paramsNameNumber = params.length;
                const provideNumber = 6;
                const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                if (paramsNameNumber > provideNumber) {
                  for (let p = 0; p < rowNumber; p++) {
                    let tempStr = '';
                    const start = p * provideNumber;
                    const end = start + provideNumber;
                    if (p === rowNumber - 1) {
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      tempStr = `${params.substring(start, end)}\n`;
                    }
                    newParamsName += tempStr;
                  }
                } else {
                  newParamsName = params;
                }
                return newParamsName;
              },
            },
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: '#EAE8E8',
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#90979c',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              color: '#B5B5B5',
            },
            splitArea: {
              show: false,
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 10,
            xAxisIndex: [0],
            bottom: 10,
            start: 0,
            end: 100,
            handleIcon:
              'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '100%',
            handleStyle: {
              color: '#d3dee5',
            },
            textStyle: {
              color: '#fff',
            },
            borderColor: '#90979c',
          },
        ],
        series: [
          {
            name: '总任务数',
            type: 'line',
            symbolSize: 20,
            hoverAnimation: false,
            smooth: true,
            itemStyle: {
              normal: {
                color: '#5D6D77',
                barBorderRadius: 0,
              },
            },
            data: [],
          },
          {
            name: '非故障任务数',
            type: 'bar',
            barMaxWidth: 20,
            // barWidth: '10%',
            stack: '总量',
            barWidth: 25,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: '#91C7AE',
              },
            },
            data: [],
          },
          {
            name: '故障任务数',
            type: 'bar',
            barMaxWidth: 20,
            stack: '总量',
            barWidth: 25,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: '#6FB7F7',
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.onQueryList();
  },
  methods: {
    ...mapMutations('home', ['SetHomeParams', 'GetCompanyName']),
    isClick1() {
      this.isShow1 = !this.isShow1;
      this.option.legend.selected['总任务数'] = this.isShow1;
    },
    isClick2() {
      this.isShow2 = !this.isShow2;
      this.option.legend.selected['非故障任务数'] = this.isShow2;
    },
    onQueryList() {
      this.$nextTick(() => {
        this.$refs.chart.resize();
      });
      this.isAction = false;
      const params = {
        begin: this.queryForm.begin ? this.queryForm.begin.format('YYYY-MM-DD') : '',
        end: this.queryForm.end ? this.queryForm.end.format('YYYY-MM-DD') : '',
        corpUscc: this.queryForm.corpUscc,
      };
      getList(params).then((res) => {
        this.option.series[0].data = [];
        this.option.series[1].data = [];
        this.option.series[2].data = [];
        this.option.xAxis[0].data = [];
        if (res.data.code === 200 && res.data.success) {
          this.$emit('changeOverrun', res.data.data.overrun);
          if (!res.data.data.data.length) return;
          this.data = res.data.data.data;
          res.data.data.data.forEach((el) => {
            this.option.series[0].data.push(el.total);
            this.option.series[1].data.push(el.noneBreakdown);
            // 这里给故障任务数插入总数的原因 - 因为故障数的图没法叠加
            this.option.series[2].data.push(el.breakdown);
            this.option.xAxis[0].data.push(el.corpName);
          });
          const el = res.data.data.data.find(val => val.corpUscc === this.queryForm.corpUscc);
          const obj = this.companyData.find(val => val.uscc === this.queryForm.corpUscc);
          const name = obj ? obj.name : '';
          this.GetCompanyName(name);
          if (this.queryForm.corpUscc && el) {
            this.isAction = true;
          }
        }
      });
      this.SetHomeParams(params);
    },
  },
};
</script>

<style lang="scss" scoped>
  .echart_class {
    position: absolute;
    height: 440px;
    width: 100%;
    bottom: 0;
    left: 0;
    >.form_class{
      position: absolute;
      top: -20px;
      left: 20px;
      z-index: 1000;
    }
  }
  .lenged{
    z-index: 1000;
    height: 20px;
    width: 210px;
    position: absolute;
    right: 50px;
    top: 0;
    >li{
      float: left;
      display: inline-block;
    }
    >.line{
      width: 85px;
      cursor: pointer;
      >span{
        display: inline-block;
        float: left;
      }
      >.line_class{
        width: 25px;
        height: 15px;
        background: #ADB5BA;
      }
      >.name{
        color: #90979C;
        font-size: 12px;
        margin-left: 10px;
      }
    }
    >.bar{
      width: 120px;
      margin-left: 5px;
      cursor: pointer;
      >span{
        display: inline-block;
        float: left;
      }
      >.bar_class{
        width: 25px;
        height: 15px;
        background: #91C7AE;
      }
      >.name{
        color: #90979C;
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
</style>
