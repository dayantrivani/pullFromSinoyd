<template>
<!-- 运维情况 -->
  <div class="echart_class">
    <a-form class="form_class" layout="inline">
      <a-form-item>
        <a-select
          :allowClear="true"
          style="width: 200px"
          placeholder="请选择运维企业"
          v-model="corpUscc">
          <a-select-option
            v-for="item in companyData"
            :key="item.id"
            :value="item.uscc">
            {{item.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="mar-r-0">
        <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
      </a-form-item>
    </a-form>
    <chart v-if="type === 2" ref="chart" :option="option" :isAction="isAction"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getCory } from '@/api/modules/home.js';

export default {
  name: 'OperaCond',
  props: {
    companyData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isAction: false,
      corpUscc: undefined,
      myChart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            snap: true,
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
          textStyle: {
            color: '#90979c',
          },
          data: ['污染源企业', '站点', '仪器'],
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
            handleSize: '110%',
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
            name: '污染源企业',
            type: 'bar',
            barWidth: 15,
            barGap: '10%',
            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: '#C23531',
                barBorderRadius: 5,
              },
            },
            data: [],
          },
          {
            name: '站点',
            type: 'bar',
            barWidth: 15,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: '#2F4554',
                barBorderRadius: 5,
              },
            },
            data: [],
          },
          {
            name: '仪器',
            type: 'bar',
            barWidth: 15,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: '#61A0A8',
                barBorderRadius: 5,
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState('home', ['type']),
  },
  mounted() {
    this.onQueryList();
  },
  methods: {
    onQueryList() {
      this.isAction = false;
      getCory(this.corpUscc).then((res) => {
        this.option.xAxis[0].data = [];
        this.option.series[0].data = [];
        this.option.series[1].data = [];
        this.option.series[2].data = [];
        if (res.data.code === 200 && res.data.success) {
          const arr = [];
          const { data } = res.data;
          data.forEach((el) => {
            arr.push(Object.values(el)[0]);
            this.option.xAxis[0].data.push(Object.keys(el)[0]);
            this.option.series[0].data.push(Object.values(el)[0].companyNum);
            this.option.series[1].data.push(Object.values(el)[0].stationNum);
            this.option.series[2].data.push(Object.values(el)[0].instrumentNum);
          });
          const el = arr.find(val => val.corpUscc === this.corpUscc);
          if (el) {
            this.isAction = true;
          }
        }
      });
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
</style>
