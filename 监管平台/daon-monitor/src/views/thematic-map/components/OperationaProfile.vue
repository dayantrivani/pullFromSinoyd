<template>
<!-- 运维概况 -->
<div class="content_map">
  <div class="after_map right_bg" v-show="!isShow"></div>
  <div class="model_bg">
    <span class="title">运维概况</span>
    <div class="dersion">运维情况统计<img src="@/assets/img/rightArrow.png" /></div>
    <p class="dersionEn">Operation and maintenance statistics</p>
    <!-- autoplay -->
    <div class="OperationaProfile_carousel">
      <a-icon class="left_circle" type="left-circle" @click="$refs.carousel.prev()"/>
      <a-icon class="right_circle" type="right-circle" @click="$refs.carousel.next()"/>
      <a-carousel arrows autoplay class="oprer_carousel" ref="carousel">
        <div class="item" v-for="(item, i) in Math.ceil(situationData.length / 5)" :key="i">
          <ul v-for="(serial, index) in situationData.slice(i * 5, (i + 1) * 5)" :key="index">
            <li class="name">{{serial.corpName}}</li>
            <li class="type1" :style="{ 'width': `${serial.companyNum / (serial.companyNum + serial.stationNum) * 100}%` }"></li>
            <li class="type2" :style="{ 'width': `${(1 - serial.companyNum / (serial.companyNum + serial.stationNum)) * 100}%` }"></li>
          </ul>
        </div>
      </a-carousel>
    </div>
    <p class="type_name">
      运维企业
      <span>{{totalCorpNum}}</span>
    </p>
    <div class="dersion">运维任务统计<img src="@/assets/img/rightArrow.png" /></div>
    <p class="dersionEn">Trade Union ststistics of market value</p>
    <chart style="height: 27%" ref="chart" :option="option"/>
  </div>
</div>
</template>

<script>
import { getOperaConditions, getOperaTasks } from '@/api/modules/thematic-map.js';

export default {
  name: 'OperationaProfile',
  props: {
    // 控制背景阴影的显示隐藏
    isShow: String,
  },
  data() {
    return {
      totalCorpNum: 0, // 运维企业数
      situationData: [], // 运维企业数据
      option: {
        grid: {
          top: 0,
          bottom: 70,
          left: 0,
          right: 0,
          textStyle: {
            color: '#fff',
          },
        },
        dataZoom: [
          {
            show: true,
            height: 10,
            xAxisIndex: [0],
            bottom: 0,
            start: 0,
            end: 80,
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
              rotate: 90,
              color: '#BFC2C5',
              fontSize: 12,
              formatter: params =>  params.slice(0, 4),
            },
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitArea: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: '故障任务数',
            type: 'pictorialBar',
            barWidth: '10%',
            stack: '总量',
            symbol: 'roundRect',
            symbolSize: [20, 3],
            symbolMargin: 2,
            symbolRepeat: 'repeat',
            z: -10,
            itemStyle: {
              normal: {
                color: '#00A3F4',
              },
            },
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    // 运维情况统计
    getOperaConditions().then((res) => {
      if (res.data.success && res.data.code === 200) {
        this.situationData = res.data.data.corpList;
        this.totalCorpNum = res.data.data.totalCorpNum;
      } else {
        this.$message.warning(res.data.msg);
      }
    });
    // 运维任务统计
    getOperaTasks().then((res) => {
      if (res.data.success && res.data.code === 200) {
        this.option.xAxis[0].data = res.data.data.map(val => val.corpName);
        this.option.series[0].data = res.data.data.map(val => val.total);
      } else {
        this.$message.warning(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss">
.OperationaProfile_carousel{
  height: 35%;
  width: 100%;
  margin: 0 auto;
  position: relative;
  &:hover{
    .left_circle{
      display: block;
    }
    .right_circle{
      display: block;
    }
  }
  i{
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #fff;
    z-index: 2;
    height: 14px;
    cursor: pointer;
  }
  >.left_circle{
    left: -15px;
    display: none;
  }
  >.right_circle{
    right: -15px;
    display: none;
  }
  .oprer_carousel{
    height: 100%;
    width: 100%;
    z-index: 1;
    >.slick-slider{
      height: 100%;
      >.slick-list{
        height: 100%;
        >.slick-track{
          height: 100%;
          >.slick-slide{
            height: 100%;
            >div{
              height: 100%;
            }
          }
        }
      }
    }
    .slick-dots{
      display: none!important;
    }
    .item{
      height: 100%;
      >ul{
        width: 100%;
        height: 18%;
        margin-top: 2px;
        >li{
          height: calc(100% - 20px);
          display: inline-block;
          float: left;
        }
        >.name{
          color: #fff;
          height: 15px;
          text-align: left;
          width: 100%;
          font-size: 12px;
        }
        >.type1{
          background: #00A3F4;
          margin-top: 3px;
        }
        >.type2{
          background: #6EE0FF;
          margin-top: 3px;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.type_name{
  color: #fff;
  text-align: left;
  font-size: 16px;
  margin-bottom: 10px;
  >span{
    margin-left: 10px;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
