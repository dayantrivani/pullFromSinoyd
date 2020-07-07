<template>
<!-- 监察统计情况 -->
<div class="content_map">
  <div class="after_map" v-show="!isShow"></div>
  <div class="model_bg">
    <span class="title">监察统计情况</span>
    <div class="dersion">监察任务统计<img src="@/assets/img/rightArrow.png"/></div>
    <p class="dersionEn">Inspection task statistics</p>
    <div class="MonitorStatistics_chart">
      <a-icon v-if="typeData.length > 5" class="left_circle" type="left-circle" @click="$refs.carousel.prev()"/>
      <a-icon v-if="typeData.length > 5" class="right_circle" type="right-circle" @click="$refs.carousel.next()"/>
      <a-carousel arrows autoplay class="oprer_carousel" ref="carousel">
        <div class="item" v-for="(item, i) in Math.ceil(typeData.length / 5)" :key="i">
          <ul v-for="(serial, index) in typeData.slice(i * 5, (i + 1) * 5)" :key="index">
            <li>
              <div class="left">{{ i * 5 + index + 1 }}</div>
              <div class="right">
                <div class="all_account">
                  <p class="name">{{serial.type}} {{serial.count}}</p>
                  <div class="account" :style="{ 'width': `${serial.count / maxNum * 100}%` }"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </a-carousel>
    </div>
    <div class="dersion">近期督查趋势<img src="@/assets/img/rightArrow.png"/></div>
    <chart class="barchart" ref="barchart" :option="barOption"/>
  </div>
</div>
</template>

<script>
import { getStatisticsType, getStatisticsTrend } from '@/api/modules/thematic-map.js';

export default {
  name: 'MonitorStatistics',
  props: {
    // 控制背景阴影的显示隐藏
    isShow: String,
  },
  data() {
    return {
      maxNum: 0,
      typeData: [],
      barOption: {
        grid: {
          top: 10,
          bottom: 0,
          left: 0,
        },
        tooltip: {

        },
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: {
          type: 'value',
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
        },
        series: [
          {
            data: [],
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#01B4F5',
              },
            },
          },
        ],
      },
    };
  },
  mounted() {
    getStatisticsType().then((res) => {
      if (res.data.success && res.data.code === 200) {
        this.typeData = res.data.data;
        const arr = this.typeData.map(val => val.count);
        this.maxNum = Math.max(...arr);
      } else {
        this.$message.warning(res.data.msg);
      }
    });
    getStatisticsTrend().then((res) => {
      if (res.data.success && res.data.code === 200) {
        const { data } = res.data;
        const xAxis = data.map(val => Object.keys(val)[0]);
        const seriesData = data.map(val => Object.values(val)[0]);
        this.barOption.series[0].data = seriesData;
        this.barOption.xAxis.data = xAxis;
      } else {
        this.$message.warning(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.barchart{
  height: 37%!important;
}
</style>

<style lang="scss">
.MonitorStatistics_chart{
  height: 40%!important;
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
        height: 19%;
        >li{
          width: 100%;
          height: 100%;
          display: inline-block;
          color: #fff;
          >div{
            display: inline-block;
            float: left;
            height: 100%;
          }
          >.left{
            width: 22px;
            text-align: left;
            line-height: 25px;
          }
          >.right{
            width: calc(100% - 30px);
            >.all_account{
              position: relative;
              height: 20px;
              background: #23272F;
              margin-top: 3px;
              >.name{
                position: absolute;
                left: 0;
                line-height: 20px;
                font-size: 12px;
                padding-left: 10px;
                height: 100%;
              }
              >.account{
                background: linear-gradient(to right, #0D4573 0%,#00B9FB 100%);
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
