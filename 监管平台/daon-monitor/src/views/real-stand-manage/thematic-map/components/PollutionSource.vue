<template>
  <!-- 污染源情况 -->
  <div class="content_map">
    <div class="after_map" v-show="!isShow"></div>
    <div class="model_bg">
      <span class="title">污染源情况</span>
      <div class="dersion">重点污染源占比<img src="@/assets/img/rightArrow.png" /></div>
      <p class="dersionEn">Proportion of emphasis poiiution sources</p>
      <!-- <chart class="chart" ref="chart" :option="option"/> -->
      <div class="importAccou">
        <div class="import_left">
          <div class="item_class" v-for="(item, i) in importData" :key="i">
            <p class="name">{{i ? '非' : ''}}重点污染源</p>
            <p class="value">{{item.value}}</p>
            <div class="accou_class">
              <div class="accou" :style="{ 'width': `${item.value / importMax * 100}%` }"></div>
              <ul>
                <li v-for="(item, i) in 10" :key="i"></li>
              </ul>
              <div class="accou_bg"></div>
            </div>
          </div>
        </div>
        <div class="import_right">
          <chart
            ref="pieChart"
            :pieDataLength="2"
            :isPieHighlight="true"
            :option="importOption"
          />
        </div>
      </div>
      <div class="dersion">污染源点位占比<img src="@/assets/img/rightArrow.png" /></div>
      <p class="dersionEn">Proportion of emphasis poiiution sources</p>
      <div class="polluAccou">
        <div class="import_left">
          <ul>
            <li
              v-for="(item, i) in polluData"
              :key="i"
            >
              <span
                class="colors"
                :style="{ 'background': colors[i] }"
              ></span>
              <span class="name">{{item.name}}</span>
              <span class="value">{{item.value}}</span>
            </li>
          </ul>
        </div>
        <div class="import_right">
          <chart
            ref="polluChart"
            :pieDataLength="4"
            :isPieHighlight="true"
            :option="polluOption"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEmphasis, getCompanyType } from '@/api/modules/thematic-map.js';

export default {
  name: 'PollutionSource',
  props: {
    // 控制背景阴影的显示隐藏
    isShow: String,
  },
  data() {
    return {
      importOption: {
        series: [
          {
            top: '50%',
            // hoverAnimation: false,
            color: ['#03A9F2', '#065991'],
            type: 'pie',
            radius: ['38', '48'],
            label: {
              normal: {
                show: false,
                position: 'center',
                color: '#fff',
              },
              emphasis: {
                show: true,
                // 自定义标签
                formatter: '{d}%',
                rich: {
                  num: {
                    fontSize: '14',
                    lineHeight: '20',
                  },
                  bt: {
                    fontSize: '10',
                  },
                },
              },
            },
            // 视觉引导线隐藏
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [],
          },
          {
            top: '50%',
            // hoverAnimation: false,
            color: ['#fff'],
            type: 'pie',
            radius: ['50', '51'],
            data: [100],
            label: {
              show: false,
            },
          },
        ],
      },
      polluOption: {
        series: [
          {
            left: '50%',
            color: [],
            type: 'pie',
            radius: ['38', '48'],
            label: {
              normal: {
                show: false,
                position: 'center',
                color: '#fff',
              },
              emphasis: {
                show: true,
                // 自定义标签
                formatter: '{d}%',
                rich: {
                  num: {
                    fontSize: '14',
                    lineHeight: '20',
                  },
                  bt: {
                    fontSize: '10',
                  },
                },
              },
            },
            data: [],
          },
          {
            // top: '20%',
            // hoverAnimation: false,
            color: ['#fff'],
            type: 'pie',
            radius: ['50', '51'],
            data: [100],
            label: {
              show: false,
            },
          },
        ],
      },
      colors: ['#6EEEFF', '#03A9F2', '#086FA3', '#0E4377'],
      polluData: [],
      importData: [],
      importMax: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.polluOption.series[0].data = this.polluData;
      this.polluOption.series[0].color = this.colors;
    });
    // 获取重点污染源占比
    getEmphasis().then((res) => {
      if (res.data.success && res.data.code === 200) {
        this.importData = [
          {
            name: '重点污染源',
            value: Object.values(res.data.data)[1],
          },
          {
            name: '非重点污染源',
            value: Object.values(res.data.data)[0],
          },
        ];
        this.importOption.series[0].data = this.importData;
        // 设置最大值
        if (Object.values(res.data.data)[1] < 100 && Object.values(res.data.data)[0] < 100) {
          this.importMax = 100;
        } else if (Object.values(res.data.data)[1] < 1000 && Object.values(res.data.data)[0] < 1000) {
          this.importMax = 1000;
        } else {
          this.importMax = 10000;
        }
      }
    });
    // 获取污染源点位占比
    getCompanyType().then((res) => {
      if (res.data.success && res.data.code === 200) {
        const { data } = res.data;
        this.polluData = [
          {
            name: '废水排口',
            value: Object.values(data)[0],
          },
          {
            name: '废气排口',
            value: Object.values(data)[1],
          },
          {
            name: '雨水排口',
            value: Object.values(data)[2],
          },
          {
            name: '噪声排口',
            value: Object.values(data)[3],
          },
        ];
        this.polluOption.series[0].data = this.polluData;
      }
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.importAccou {
  // padding: 8px;
  height: 42%;
  margin-bottom: 10px;
  .import_left {
    width: 50%;
    display: inline-block;
    float: left;
    height: 100%;
    >.item_class:nth-child(2){
      margin-top: 20px;
    }
    >.item_class{
      // height: 50%;
      width: 100%;
      >p{
        text-align: left;
        color: #fff;
      }
      >.name{
        font-size: 14px;
      }
      >.value{
        font-size: 25px;
      }
      >.accou_class{
        width: 100%;
        height: 16px;
        position: relative;
        >.accou{
          width: 60%;
          height: calc(100% - 2px);
          z-index: 3;
          position: absolute;
          left: 2px;
          top: 0;
          bottom: 0;
          margin: auto;
          z-index: 2;
          background: linear-gradient(to right, #0E4A7B 0%,#00BAFC 100%);
        }
        >.accou_bg{
          border: 1px solid #465F71;
          background: #0D2238;
          width: 100%;
          height: 100%;
        }
        >ul{
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          z-index: 3;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          margin: auto;
          >li{
            width: 10%;
            float: left;
            display: inline-block;
            height: 100%;
            border-right: 1px solid #0D2237;
          }
        }
      }
    }
  }
  .import_right {
    width: 50%;
    display: inline-block;
    float: left;
    height: 100%;
    padding: 40px 0 0 15px;
  }
}
.polluAccou {
  height: 26%;
  .import_left {
    width: 50%;
    display: inline-block;
    float: left;
    height: 100%;
    position: relative;
    ul {
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      padding: 10px 5px;
      >li:nth-child(1){
        margin-top: 0;
      }
      li {
        height: 25%;
        color: #fff;
        margin-top: 5px;
        line-height: 100%;
        >span{
          display: inline-block;
          float: left;
        }
        > .colors {
          width: 18px;
          height: 14px;
        }
        > .name {
          margin-left: 10px;
          font-size: 14px;
        }
        > .value {
          margin-left: 10px;
          font-size: 18px;
        }
      }
    }
  }
  .import_right {
    width: 50%;
    display: inline-block;
    float: left;
    height: 100%;
    padding-left: 15px;
  }
}
</style>
