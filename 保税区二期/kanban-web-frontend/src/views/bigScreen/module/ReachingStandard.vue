<template>
  <el-row>
    <el-col :span="12">
      <div class="bs-stand-out">
        <div class="bs-stand-title">空气达标天数</div>
        <div class="bs-stand-subtitle">数据截止至{{nowDate.getFullYear()}}年{{nowDate.getMonth()+1}}月{{nowDate.getDate()}}号</div>
        <el-row style="height:2.2rem;">
          <el-col :span="12"
                  style="padding:0.02rem 0 0 0.1rem">
            <div class="bs-rectangle-title">{{airData.thisYear.label}}</div>
            <div class="bs-rectangle-title-left">{{airData.thisYear.standardQty}}
              <span style="font-size:0.2rem;">天</span>
              <span class="bs-rectangle-title-right">{{airData.thisYear.substandardQty}}超标天数</span>
            </div>
            <div class="bs-container">
              <div class="bs-flex-container">
                <div :class="item === 2?'bs-flex1-item2':'bs-flex1-item1'"
                     v-for="(item,index) in dataLeft1"
                     :key="index"></div>
              </div>
            </div>
            <div class="bs-rectangle-title"
                 style="clear:both;">{{airData.lastYear.label}}
              <div class="bs-rectangle-title-left">{{airData.lastYear.standardQty}}
                <span style="font-size:0.2rem;">天</span>
                <span class="bs-rectangle-title-right">{{airData.lastYear.substandardQty}}超标天数</span>
              </div>
            </div>
            <div class="bs-container">
              <div class="bs-flex-container">
                <div :class="item === 2?'bs-flex2-item2':'bs-flex2-item1'"
                     v-for="(item,index) in dataLeft2"
                     :key="index"></div>
              </div>
            </div>
            <div style="padding-top:0.3rem;font-size:0.16rem;">每月达标天数同比</div>
          </el-col>
          <el-col :span="12"
                  class="fill-h">
            <div class="fill-h"
                 ref="circleLeft">
            </div>
          </el-col>
        </el-row>
        <el-row style="height:1.6rem;">
          <el-col class="fill-h">
            <div class="fill-h"
                 ref="histogramLeft"></div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="bs-stand-out">
        <div class="bs-stand-title">水质达标天数</div>
        <div class="bs-stand-subtitle">数据截止至{{nowDate.getFullYear()}}年{{nowDate.getMonth()+1}}月{{nowDate.getDate()}}号</div>
        <el-row style="height:2.2rem;">
          <el-col :span="12"
                  style="padding:0.02rem 0 0 0.1rem">
            <div style="margin-top:0.1rem;">
              <div class="bs-rectangle-title">{{waterData.thisYear.label}}</div>
              <div class="bs-rectangle-title-left">{{waterData.thisYear.standardQty}}
                <span style="font-size:0.2rem;">天</span>
                <span class="bs-rectangle-title-right">{{waterData.thisYear.substandardQty}}超标天数</span>
              </div>
              <div class="bs-container">
                <div class="bs-flex-container">
                  <div :class="item === 2?'bs-flex1-item2':'bs-flex1-item1'"
                       v-for="(item,index) in dataRight1"
                       :key="index"></div>
                </div>
              </div>
              <div class="bs-rectangle-title">{{waterData.lastYear.label}}</div>
              <div class="bs-rectangle-title-left">{{waterData.lastYear.standardQty}}
                <span style="font-size:0.2rem;">天</span>
                <span class="bs-rectangle-title-right">{{waterData.lastYear.substandardQty}}超标天数</span>
              </div>
              <div class="bs-container">
                <div class="bs-flex-container">
                  <div :class="item === 2?'bs-flex2-item2':'bs-flex2-item1'"
                       v-for="(item,index) in dataRight2"
                       :key="index"></div>
                </div>
              </div>
              <div style="padding-top:0.3rem;font-size:0.16rem;">每月达标天数同比</div>
            </div>
          </el-col>
          <el-col :span="12"
                  class="fill-h">
            <div class="fill-h"
                 ref="circleRight">
            </div>
          </el-col>
        </el-row>
        <el-row style="height:1.6rem;">
          <el-col class="fill-h">
            <div class="fill-h"
                 ref="histogramRight"></div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import echarts from 'echarts';
import arrowDown from '@/assets/img/boardOne/arrow-down-solid.svg';
import arrowUp from '@/assets/img/boardOne/arrow-up-solid.svg';

export default {
  name: 'ReachingStandard',
  data() {
    return {
      dataLeft1: [],
      dataLeft2: [],
      dataRight1: [],
      dataRight2: [],
      waterData: {},
      airData: {},
      nowDate: '',
    };
  },
  created() {
    this.nowDate = new Date();
    this.getWaterData();
    this.getAirData();
  },
  methods: {
    getAirData() {
      this.airData = {
        'thisYear': {
          'label': '2020年 1.1-2.18',
          'totalQty': 49,
          'standardQty': 20,
          'substandardQty': 29,
          'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          'standardData': [15, 18, 16, 18, 12, 18, 13, 14, 11, 15, 12, 31],
          'substandardData': [8, 5, 7, 3, 9, 2, 4, 7, 5, 2, 5, 2],
        },
        'lastYear': {
          'label': '2019年 1.1-2.18',
          'totalQty': 49,
          'standardQty': 16,
          'substandardQty': 33,
          'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          'standardData': [2, 4, 3, 1, 7, 6, 5, 5, 1, 1, 2, 11],
          'substandardData': [2, 1, 2, 0, 3, 6, 3, 2, 4, 5, 1, 4],
        },
      };
      this.leftRate();
      this.histogramLeftMycharts();
      this.circleLeftMycharts();
    },
    // 横向柱状图比列计算
    leftRate() {
      // 一共16个格子,按比例分配格子.左边达标的,右边超标的
      // (达标/总天数)*16=达标的格子(取整)
      // 16-达标=超标
      const standard = this.airData.thisYear.standardQty / this.airData.thisYear.totalQty * 16;
      this.dataLeft1 = [];
      for (let i = 0; i < 16; i++) {
        if (i < standard) {
          this.dataLeft1.push(1);
        } else {
          this.dataLeft1.push(2);
        }
      }
      const lastStandard = this.airData.lastYear.standardQty / this.airData.lastYear.totalQty * 16;
      this.dataLeft2 = [];
      for (let i = 0; i < 16; i++) {
        if (i < lastStandard) {
          this.dataLeft2.push(1);
        } else {
          this.dataLeft2.push(2);
        }
      }
    },
    getWaterData() {
      this.waterData = {
        'thisYear': {
          'label': '2020年 1.1-2.18',
          'totalQty': 49,
          'standardQty': 30,
          'substandardQty': 38,
          'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          'standardData': [15, 18, 16, 18, 12, 18, 13, 14, 11, 15, 12, 18],
          'substandardData': [8, 5, 7, 3, 9, 2, 4, 7, 5, 2, 5, 2],
        },
        'lastYear': {
          'label': '2019年 1.1-2.18',
          'totalQty': 49,
          'standardQty': 11,
          'substandardQty': 19,
          'time': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          'standardData': [14, 12, 13, 11, 17, 16, 15, 15, 14, 18, 13, 13],
          'substandardData': [10, 1, 2, 3, 8, 6, 3, 2, 4, 5, 1, 4],
        },
      };
      this.rightRate();
      this.histogramRightMycharts();
      this.circleRihtMycharts();
    },
    // 横向柱状图比列计算
    rightRate() {
      // 一共16个格子,按比例分配格子.左边达标的,右边超标的
      // (达标/总天数)*16=达标的格子(取整)
      // 16-达标=超标
      const standard = this.waterData.thisYear.standardQty / this.waterData.thisYear.totalQty * 16;
      this.dataRight1 = [];
      for (let i = 0; i < 16; i++) {
        if (i < standard) {
          this.dataRight1.push(1);
        } else {
          this.dataRight1.push(2);
        }
      }
      const lastStandard = this.waterData.lastYear.standardQty / this.waterData.lastYear.totalQty * 16;
      this.dataRight2 = [];
      for (let i = 0; i < 16; i++) {
        if (i < lastStandard) {
          this.dataRight2.push(1);
        } else {
          this.dataRight2.push(2);
        }
      }
    },
    // 右上
    circleRihtMycharts() {
      const dataStyle = {
        normal: {
          label: { show: false },
          labelLine: { show: false },
          shadowBlur: 20,
          shadowColor: 'rgba(40, 40, 40)',
        },
      };
      const placeHolderStyle = {
        normal: {
          color: 'rgba(0,0,0,0)',
          label: { show: false },
          labelLine: { show: false },
        },
        emphasis: {
          color: 'rgba(0,0,0,0)',
        },
      };
      const color = ['rgb(8, 153, 234)', 'rgb(257, 33, 88)', 'rgb(6, 235, 274)', 'rgb(246, 84, 22)', '#626262'];
      const option = {
        color: ['rgb(8, 153, 234)', 'rgb(257, 33, 88)', 'rgb(6, 235, 274)', 'rgb(246, 84, 22)'],
        graphic: {
          elements: [{
            type: 'image',
            z: 3,
            style: {
              image: this.waterData.thisYear.substandardQty > this.waterData.lastYear.substandardQty ? arrowUp : arrowDown,
              width: 40,
              height: 40,
            },
            left: '58%',
            top: '45%',
            position: [100, 100],
          }],
        },
        title: [{
          text: '上年相比',
          top: '60%',
          textAlign: 'center',
          left: '50%',
          textStyle: {
            color: '#fff',
            fontSize: 45,
            fontWeight: '400',
          },
        }, {
          text: this.waterData.thisYear.substandardQty > this.waterData.lastYear.substandardQty ? this.waterData.thisYear.substandardQty - this.waterData.lastYear.substandardQty : this.waterData.lastYear.substandardQty - this.waterData.thisYear.substandardQty,
          top: '45%',
          textAlign: 'center',
          left: '48%',
          textStyle: {
            color: '#fff',
            fontSize: 50,
            fontWeight: '400',
          },
        }],
        series: [
          {
            name: 'pie0',
            type: 'pie',
            clockWise: true,
            radius: ['94%', '96%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: 100,
                name: '01',
              },
              {
                value: 0,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },

            ],
          },
          {
            name: 'pie1',
            type: 'pie',
            clockWise: true,
            radius: ['78%', '85%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.waterData.lastYear.standardQty,
                name: '01',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[0],
                    shadowColor: color[0],
                  },
                },
              },
              {
                value: this.waterData.lastYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },

            ],
          },
          {
            center: ['50%', '50%'],
            name: 'pie2',
            type: 'pie',
            clockWise: true,
            radius: ['69%', '76%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.waterData.lastYear.substandardQty,
                name: '02',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[1],
                    shadowColor: color[1],
                  },
                },
              },
              {
                value: this.waterData.lastYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },
            ],
          },
          {
            center: ['50%', '50%'],
            name: 'pie3',
            type: 'pie',
            clockWise: false,
            radius: ['62%', '69%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.waterData.thisYear.standardQty,
                name: '03',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[2],
                    shadowColor: color[2],
                  },
                },
              },
              {
                value: this.waterData.thisYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },
            ],
          },
          {
            center: ['50%', '50%'],
            name: 'pie4',
            type: 'pie',
            clockWise: false,
            radius: ['55%', '62%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.waterData.thisYear.substandardData,
                name: '04',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[3],
                    shadowColor: color[3],
                  },
                },
              },
              {
                value: this.waterData.thisYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },
            ],
          },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.circleRight);
        myChart.clear();
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    // 左上
    circleLeftMycharts() {
      const dataStyle = {
        normal: {
          label: { show: false },
          labelLine: { show: false },
          shadowBlur: 20,
          shadowColor: 'rgba(40, 40, 40)',
        },
      };
      const placeHolderStyle = {
        normal: {
          color: 'rgba(0,0,0,0)',
          label: { show: false },
          labelLine: { show: false },
        },
        emphasis: {
          color: 'rgba(0,0,0,0)',
        },
      };
      const color = ['rgb(8, 153, 234)', 'rgb(257, 33, 88)', 'rgb(6, 235, 274)', 'rgb(246, 84, 22)', '#626262'];
      const option = {
        color: ['rgb(8, 153, 234)', 'rgb(257, 33, 88)', 'rgb(6, 235, 274)', 'rgb(246, 84, 22)'],
        graphic: {
          elements: [{
            type: 'image',
            z: 3,
            style: {
              image: this.airData.thisYear.substandardQty > this.airData.lastYear.substandardQty ? arrowUp : arrowDown,
              width: 40,
              height: 40,
            },
            left: '58%',
            top: '45%',
            position: [100, 100],
          }],
        },
        title: [{
          text: '上年相比',
          top: '60%',
          textAlign: 'center',
          left: '50%',
          textStyle: {
            color: '#fff',
            fontSize: 45,
            fontWeight: '400',
          },
        }, {
          text: this.airData.thisYear.substandardQty > this.airData.lastYear.substandardQty ? this.airData.thisYear.substandardQty - this.airData.lastYear.substandardQty : this.airData.lastYear.substandardQty - this.airData.thisYear.substandardQty,
          top: '45%',
          textAlign: 'center',
          left: '48%',
          textStyle: {
            color: '#fff',
            fontSize: 50,
            fontWeight: '400',
          },
        }],
        series: [
          {
            name: 'pie0',
            type: 'pie',
            clockWise: true,
            radius: ['94%', '96%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: 100,
                name: '01',
              },
              {
                value: 0,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },

            ],
          },
          {
            name: 'pie1',
            type: 'pie',
            clockWise: true,
            radius: ['78%', '85%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.airData.lastYear.standardQty,
                name: '01',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[0],
                    shadowColor: color[0],
                  },
                },
              },
              {
                value: this.airData.lastYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },

            ],
          },
          {
            center: ['50%', '50%'],
            name: 'pie2',
            type: 'pie',
            clockWise: true,
            radius: ['69%', '76%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.airData.lastYear.substandardQty,
                name: '02',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[1],
                    shadowColor: color[1],
                  },
                },
              },
              {
                value: this.airData.lastYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },
            ],
          },
          {
            center: ['50%', '50%'],
            name: 'pie3',
            type: 'pie',
            clockWise: false,
            radius: ['62%', '69%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.airData.thisYear.standardQty,
                name: '03',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[2],
                    shadowColor: color[2],
                  },
                },
              },
              {
                value: this.airData.thisYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },
            ],
          },
          {
            center: ['50%', '50%'],
            name: 'pie4',
            type: 'pie',
            clockWise: false,
            radius: ['55%', '62%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.airData.thisYear.substandardData,
                name: '04',
                itemStyle: {
                  normal: {
                    borderWidth: 5,
                    shadowBlur: 10,
                    borderColor: color[3],
                    shadowColor: color[3],
                  },
                },
              },
              {
                value: this.airData.thisYear.totalQty,
                name: 'invisible',
                itemStyle: placeHolderStyle,
              },
            ],
          },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.circleLeft);
        myChart.clear();
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    // 左下
    histogramRightMycharts() {
      const lineOption = {
        grid: {
          left: '8%',
          right: '1%',
          bottom: '10%',
          top: '15%',
          //   containLabel: true,
        },
        legend: {
          data: ['达标去年', '超标去年', '达标今年', '超标今年'],
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 50,
            fontSize: 30,
          },
        },
        xAxis: {
          data: this.waterData.lastYear.time,
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 20,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#626992',
            },
          },
        },
        yAxis: {
          name: '单位:天数',
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 20,
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#626992',
            },
          },
        },
        series: [{
          name: '达标去年',
          type: 'bar',
          data: this.waterData.lastYear.standardData,
          barGap: 5, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(138, 195, 235)',
              }, {
                offset: 1,
                color: 'rgb(8, 153, 234)',
              }]),
              borderWidth: 0,
            },
          },
        },
        {
          name: '超标去年',
          type: 'bar',
          data: this.waterData.lastYear.substandardData,
          barGap: 5, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(257, 33, 88)',
              }, {
                offset: 1,
                color: 'rgb(231, 122, 159)',
              }]),
              borderWidth: 0,
            },
          },
        },
        {
          name: '达标今年',
          type: 'bar',
          data: this.waterData.thisYear.standardData,
          barGap: 5, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(6, 235, 274)',
              }, {
                offset: 1,
                color: 'rgb(144, 235, 204)',
              }]),
              borderWidth: 0,
            },
          },
        },
        {
          name: '超标今年',
          type: 'bar',
          data: this.waterData.thisYear.substandardData,
          barGap: 0, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(246, 84, 22)',
              }, {
                offset: 1,
                color: 'rgb(233, 122, 116)',
              }]),
              borderWidth: 0,
            },
          },
        },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.histogramRight);
        myChart.clear();
        myChart.setOption(lineOption);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    // 右下
    histogramLeftMycharts() {
      const lineOption = {
        grid: {
          left: '8%',
          right: '1%',
          bottom: '10%',
          top: '15%',
          //   containLabel: true,
        },
        legend: {
          data: ['达标去年', '超标去年', '达标今年', '超标今年'],
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 50,
            fontSize: 30,
          },
        },
        xAxis: {
          data: this.airData.lastYear.time,
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 20,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#626992',
            },
          },
        },
        yAxis: {
          name: '单位:天数',
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 20,
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(255,255,255,0.1)',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#626992',
            },
          },
        },
        series: [{
          name: '达标去年',
          type: 'bar',
          data: this.airData.lastYear.standardData,
          barGap: 5, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(138, 195, 235)',
              }, {
                offset: 1,
                color: 'rgb(8, 153, 234)',
              }]),
              borderWidth: 0,
            },
          },
        },
        {
          name: '超标去年',
          type: 'bar',
          data: this.airData.lastYear.substandardData,
          barGap: 5, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(257, 33, 88)',
              }, {
                offset: 1,
                color: 'rgb(231, 122, 159)',
              }]),
              borderWidth: 0,
            },
          },
        },
        {
          name: '达标今年',
          type: 'bar',
          data: this.airData.thisYear.standardData,
          barGap: 5, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(6, 235, 274)',
              }, {
                offset: 1,
                color: 'rgb(144, 235, 204)',
              }]),
              borderWidth: 0,
            },
          },
        },
        {
          name: '超标今年',
          type: 'bar',
          data: this.airData.thisYear.substandardData,
          barGap: 0, // 柱间距离
          itemStyle: {
            normal: {
              show: true,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(246, 84, 22)',
              }, {
                offset: 1,
                color: 'rgb(233, 122, 116)',
              }]),
              borderWidth: 0,
            },
          },
        },
        ],
      };
      this.$nextTick(() => {
        const myChart = this.$echarts.init(this.$refs.histogramLeft);
        myChart.clear();
        myChart.setOption(lineOption);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
  },
};
</script>

<style scoped>
.bs-stand-out {
  height: 4.66rem;
  width: calc(100% - 0.15rem);
  margin-right: 0.15rem;
}
.bs-stand-title {
  font-size: 0.3rem;
}
.bs-stand-subtitle {
  font-size: 0.15rem;
  color: #ffd61a;
}
.bs-rectangle-title {
  font-size: 0.16rem;
}
.bs-rectangle-title-left {
  font-size: 0.15rem;
}
.bs-rectangle-title-right {
  margin-left: 0.1rem;
  font-size: 0.15rem;
  color: #e42c77;
}
.bs-container {
  background-color: #4e565f;
  width: 1.9rem;
  height: 0.15rem;
  border-radius: 3px;
}
.bs-flex-container {
  display: -webkit-flex;
  display: flex;
  width: 1.8rem;
  height: 0.15rem;
  margin-left: 0.05rem;
  background-color: #2a2929;
}
.bs-flex1-item1 {
  background-color: #04acf5;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.bs-flex1-item2 {
  background-color: #e42465;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.bs-flex2-item1 {
  background-color: #05f0c2;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.bs-flex2-item2 {
  background-color: #fd9602;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
</style>
