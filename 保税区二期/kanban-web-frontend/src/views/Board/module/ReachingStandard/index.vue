<template>
  <el-row class="reaching-standard fill-h">
    <el-col :span="12">
      <div style="width:calc(100% - 0.15rem);height:100%;margin-right: 0.15rem;background-color: #1a1a1a;">
        <el-row style="height:50%; ">
          <el-col :span="12" style="height: 100%;padding:0.15rem 0 0 0.15rem">
            <div style="font-size: 0.16rem;">空气达标天数</div>
            <div class="subtitle">数据截止至{{nowDate.getFullYear()}}年{{nowDate.getMonth()+1}}月{{nowDate.getDate()-1}}号</div>
            <div style="margin-top:0.1rem;">
              <div class="rectangle-title">{{airData.thisYear.label}}</div>
              <div>
                <span class="rectangle-title-left">{{airData.thisYear.standardQty}}</span>天
                <span class="rectangle-title-right">{{airData.thisYear.substandardQty}}超标天数</span>
              </div>
              <div style="background-color: #4E565F;width: 1.9rem;height: 0.15rem;border-radius: 3px;">
                <div class="flex-container">
                  <div :class="item === 2?'flex1-item2':'flex1-item1'" v-for="(item,index) in dataLeft1" :key="index">
                  </div>
                </div>
              </div>

              <div class="rectangle-title" style="clear:both;">{{airData.lastYear.label}}</div>
              <div>
                <span class="rectangle-title-left">{{airData.lastYear.standardQty}}</span>天
                <span class="rectangle-title-right">{{airData.lastYear.substandardQty}}超标天数</span>
              </div>
              <div style="background-color: #4E565F;width: 1.9rem;height: 0.15rem;border-radius: 3px;">
                <div class="flex-container">
                  <div :class="item === 2?'flex2-item2':'flex2-item1'" v-for="(item,index) in dataLeft2" :key="index">
                  </div>
                </div>
              </div>
              <div style="padding-top:0.3rem;font-size:0.16rem;">每月达标天数同比</div>
            </div>
          </el-col>
          <el-col :span="12" class="fill-h">
            <div class="fill-h" ref="circleLeft">
            </div>
          </el-col>
        </el-row>
        <el-row style="height:50%;">
          <el-col class="fill-h">
            <div class="fill-h" ref="histogramLeft"></div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="12">
      <div style="width:calc(100% - 0.15rem);height:100%;background-color: #1a1a1a;">
        <el-row style="height:50%; ">
          <el-col :span="12" style="height: 100%;padding:0.15rem 0 0 0.15rem">
            <div style="font-size: 0.16rem;">水质达标天数</div>
            <div class="subtitle">数据截止至{{nowDate.getFullYear()}}年{{nowDate.getMonth()+1}}月{{nowDate.getDate()-1}}号</div>
            <div style="margin-top:0.1rem;">
              <div class="rectangle-title">{{waterData.thisYear.label}}</div>
              <div>
                <span class="rectangle-title-left">{{waterData.thisYear.standardQty}}</span>天
                <span class="rectangle-title-right">{{waterData.thisYear.substandardQty}}超标天数</span>
              </div>
              <div style="background-color: #4E565F;width: 1.9rem;height: 0.15rem;border-radius: 3px;">
                <div class="flex-container">
                  <div :class="item === 2?'flex1-item2':'flex1-item1'" v-for="(item,index) in dataRight1" :key="index">
                  </div>
                </div>
              </div>
              <div class="rectangle-title">{{waterData.lastYear.label}}</div>
              <div>
                <span class="rectangle-title-left">{{waterData.lastYear.standardQty}}</span>天
                <span class="rectangle-title-right">{{waterData.lastYear.substandardQty}}超标天数</span>
              </div>
              <div style="background-color: #4E565F;width: 1.9rem;height: 0.15rem;border-radius: 3px;">
                <div class="flex-container">
                  <div :class="item === 2?'flex2-item2':'flex2-item1'" v-for="(item,index) in dataRight2" :key="index">
                  </div>
                </div>
              </div>
              <div style="padding-top:0.3rem;font-size:0.16rem;">每月达标天数同比</div>
            </div>
          </el-col>
          <el-col :span="12" class="fill-h">
            <div class="fill-h" ref="circleRight">
            </div>
          </el-col>
        </el-row>
        <el-row style="height:50%;">
          <el-col class="fill-h">
            <div class="fill-h" ref="histogramRight"></div>
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
import { analyzeResp } from '@/libs/util';

export default {
  name: 'ReachingStandard',
  data() {
    return {
      dataLeft1: [],
      dataLeft2: [],
      dataRight1: [],
      dataRight2: [],
      waterData: {
        thisYear: {
          label: '2020年 1.1-2.18',
          totalQty: 49,
          standardQty: 30,
          substandardQty: 38,
          time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          standardData: [15, 18, 16, 18, 12, 18, 13, 14, 11, 15, 12, 18],
          substandardData: [8, 5, 7, 3, 9, 2, 4, 7, 5, 2, 5, 2],
        },
        lastYear: {
          label: '2019年 1.1-2.18',
          totalQty: 49,
          standardQty: 11,
          substandardQty: 19,
          time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          standardData: [14, 12, 13, 11, 17, 16, 15, 15, 14, 18, 13, 13],
          substandardData: [10, 1, 2, 3, 8, 6, 3, 2, 4, 5, 1, 4],
        },
      },
      airData: {
        thisYear: {
          label: '2020年 1.1-2.18',
          totalQty: 49,
          standardQty: 30,
          substandardQty: 38,
          time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          standardData: [15, 18, 16, 18, 12, 18, 13, 14, 11, 15, 12, 18],
          substandardData: [8, 5, 7, 3, 9, 2, 4, 7, 5, 2, 5, 2],
        },
        lastYear: {
          label: '2019年 1.1-2.18',
          totalQty: 49,
          standardQty: 11,
          substandardQty: 19,
          time: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          standardData: [14, 12, 13, 11, 17, 16, 15, 15, 14, 18, 13, 13],
          substandardData: [10, 1, 2, 3, 8, 6, 3, 2, 4, 5, 1, 4],
        },
      },
      nowDate: new Date(),
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.getWaterData();
      this.getAirData();
    },
    getAirData() {
      this.$http.get('redis/AirQualityReachStandardDays_s').then((response) => {
        if (response.data.success) {
          this.airData = response.data.data;
          // 废水废气曲线图数据
          this.$nextTick(() => {
            this.leftRate();
            this.histogramLeftMycharts();
            this.circleLeftMycharts();
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 横向柱状图比列计算
    leftRate() {
      // 一共16个格子,按比例分配格子.左边达标的,右边超标的
      // (达标/总天数)*16=达标的格子(取整)
      // 16-达标=超标
      const standard = this.airData.thisYear.standardQty / (this.airData.thisYear.standardQty + this.airData.thisYear.substandardQty) * 16;
      this.dataLeft1 = [];
      for (let i = 0; i < 16; i++) {
        if (i < standard) {
          this.dataLeft1.push(1);
        } else {
          this.dataLeft1.push(2);
        }
      }
      const lastStandard = this.airData.lastYear.standardQty / (this.airData.lastYear.standardQty + this.airData.lastYear.substandardQty) * 16;
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
      this.$http.get('redis/SurfaceWaterReachStandardDays_h/909c8ede-d830-4516-818c-549a933f0230').then((response) => {
        if (response.data.success) {
          this.waterData = response.data.data;
          // 废水废气曲线图数据
          this.$nextTick(() => {
            this.rightRate();
            this.histogramRightMycharts();
            this.circleRihtMycharts();
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 横向柱状图比列计算
    rightRate() {
      // 一共16个格子,按比例分配格子.左边达标的,右边超标的
      // (达标/总天数)*16=达标的格子(取整)
      // 16-达标=超标
      const standard = this.waterData.thisYear.standardQty / (this.waterData.thisYear.standardQty + this.waterData.thisYear.substandardQty) * 16;
      this.dataRight1 = [];
      for (let i = 0; i < 16; i++) {
        if (i < standard) {
          this.dataRight1.push(1);
        } else {
          this.dataRight1.push(2);
        }
      }
      const lastStandard = this.waterData.lastYear.standardQty / (this.waterData.lastYear.standardQty + this.waterData.lastYear.substandardQty) * 16;
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
              image: this.waterData.thisYear.standardQty > this.waterData.lastYear.standardQty ? arrowUp : arrowDown,
              width: 20,
              height: 20,
            },
            left: '58%',
            top: '48%',
            position: [100, 100],
          }],
        },
        tooltip: {
          formatter: (params) => {
            if (params.name !== 'invisible') {
              if (params.componentIndex === 0) {
                return null;
              }
              return `<p>
            ${params.marker}<span>${params.value}天</span>
            </p>`;
            }
            return null;
          },
        },
        title: [
          {
            text: '上年相比',
            top: '60%',
            textAlign: 'center',
            left: '50%',
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '400',
            },
          }, {
            text: this.waterData.thisYear.standardQty > this.waterData.lastYear.standardQty ? this.waterData.thisYear.standardQty - this.waterData.lastYear.standardQty : this.waterData.lastYear.standardQty - this.waterData.thisYear.standardQty,
            top: '45%',
            textAlign: 'center',
            left: '48%',
            textStyle: {
              color: '#fff',
              fontSize: 30,
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
            name: '去年达标',
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
            name: '去年超标',
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
            name: '今年达标',
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
            name: '今年超标',
            type: 'pie',
            clockWise: false,
            radius: ['55%', '62%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.waterData.thisYear.substandardQty,
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
        tooltip: {
          formatter: (params) => {
            if (params.name !== 'invisible') {
              if (params.componentIndex === 0) {
                return null;
              }
              return `<p>
            ${params.marker}<span>${params.value}天</span>
            </p>`;
            }
            return null;
          },
        },
        graphic: {
          elements: [{
            type: 'image',
            z: 3,
            style: {
              image: this.airData.thisYear.standardQty > this.airData.lastYear.standardQty ? arrowUp : arrowDown,
              width: 20,
              height: 20,
            },
            left: '58%',
            top: '48%',
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
            fontSize: 14,
            fontWeight: '400',
          },
        }, {
          text: this.airData.thisYear.standardQty > this.airData.lastYear.standardQty ? this.airData.thisYear.standardQty - this.airData.lastYear.standardQty : this.airData.lastYear.standardQty - this.airData.thisYear.standardQty,
          top: '45%',
          textAlign: 'center',
          left: '48%',
          textStyle: {
            color: '#fff',
            fontSize: 30,
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
            name: '去年达标',
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
            name: '去年超标',
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
            name: '今年达标',
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
            name: '今年超标',
            type: 'pie',
            clockWise: false,
            radius: ['55%', '62%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [
              {
                value: this.airData.thisYear.substandardQty,
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
        backgroundColor: '#1a1a1a',
        grid: {
          left: '8%',
          right: '1%',
          bottom: '10%',
          top: '15%',
          //   containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const res = `<p>${params[0].name}月</p>
            <p>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color.colorStops[0].color};"></span><span>${params[0].data}天</span>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[1].color.colorStops[0].color};"></span><span>${params[1].data}天</span>
            </p>
            <p>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[2].color.colorStops[1].color};"></span><span>${params[2].data}天</span>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[3].color.colorStops[1].color};"></span><span>${params[3].data}天</span>
            </p>`;
            return res;
          },
        },
        legend: {
          data: ['达标去年', '超标去年', '达标今年', '超标今年'],
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 50,
            fontSize: 10,
          },
        },
        xAxis: {
          data: this.waterData.lastYear.time,
          axisLine: {
            lineStyle: {
              color: '#626992',
            },
          },
        },
        yAxis: {
          name: '单位:天数',
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
        backgroundColor: '#1a1a1a',
        grid: {
          left: '8%',
          right: '1%',
          bottom: '10%',
          top: '15%',
          //   containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const res = `<p>${params[0].name}月</p>
            <p>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color.colorStops[0].color};"></span><span>${params[0].data}天</span>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[1].color.colorStops[0].color};"></span><span>${params[1].data}天</span>
            </p>
            <p>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[2].color.colorStops[0].color};"></span><span>${params[2].data}天</span>
            <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[3].color.colorStops[1].color};"></span><span>${params[3].data}天</span>
            </p>`;
            return res;
          },
        },
        legend: {
          data: ['达标去年', '超标去年', '达标今年', '超标今年'],
          right: 10,
          textStyle: {
            color: 'white',
            fontWeight: 50,
            fontSize: 10,
          },
        },
        xAxis: {
          data: this.airData.lastYear.time,
          axisLine: {
            lineStyle: {
              color: '#626992',
            },
          },
        },
        yAxis: {
          name: '单位:天数',
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

<style>
.reaching-standard {
  height: 100%;
}
.subtitle {
  font-size: 0.15rem;
  color: rgb(91, 91, 91);
}
.rectangle-title {
  font-size: 0.16rem;
}
.rectangle-title-left {
  font-size: 0.22rem;
}
.rectangle-title-right {
  margin-left: 6vh;
  font-size: 0.16rem;
  color: #e42c77;
}
.flex-container {
  display: -webkit-flex;
  display: flex;
  width: 1.8rem;
  height: 0.15rem;
  margin-left: 0.05rem;
  background-color: #2a2929;
}
.flex1-item1 {
  background-color: #05f0c2;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.flex1-item2 {
  background-color: #fd9602;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.flex2-item1 {
  background-color: #04acf5;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.flex2-item2 {
  background-color: #e42465;
  width: 0.1rem;
  height: 0.15rem;
  margin-left: 0.01rem;
  border-radius: 3px;
}
.circle {
  width: 14vw;
  height: 20vh;
}
.histogram {
  margin-top: 1vh;
  height: 26vh;
  clear: both;
}
</style>
