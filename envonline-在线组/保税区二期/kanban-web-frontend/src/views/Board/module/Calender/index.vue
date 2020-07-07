<template>
  <div class="calendar">
    <el-row class="fill-h">
      <el-col :span="7" style="background-color:#333333;">
        <div class="calendar-title">环境质量日历图</div>
        <div class="calendar-year">{{nowDate.getFullYear()}}年</div>
        <div class="calendar-month">{{nowDate.getMonth() + 1}}月</div>
        <div class="calendar-button1">
          <i class="el-icon-caret-top" @click="plusClick"></i>
        </div>
        <div class="calendar-button2">
          <i class="el-icon-caret-bottom" @click="reduceClick"></i>
        </div>
        <div class="calendar-subTitle">今日环境空气指数</div>
        <div class="calendar-realtimeAQI" :style="{ color: aqiData.aqiColor}">{{aqiData.realtimeAQI}}</div>
        <div class="calendar-AQI">
          <div class="calendar-classLevel">{{aqiData.classLevel}}</div>
          <div class="calendar-AQI-index">AQI指数</div>
        </div>
        <div>
          <img style="width:0.7rem;height:0.6rem;" :src="leftUrl" alt=""></div>
        <div class="calendar-factor" :key="index" v-for="(item,index) in aqiData.primaryPollutant">
          <div style="font-size:0.14rem;">{{item.name}}：
            <span :style="{color:aqiData.aqiColor}" class="calendar-value">{{item.value}}</span>{{item.unit}}</div>
        </div>
        <div class="calendar-remind"><i class="el-icon-first-aid-kit"></i>健康提醒：</div>
        <div class="calendar-remind-left">
          <marquee direction=left>{{aqiData.healthEffect}}</marquee>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="calender-top">
          <div class="calender-top-week" v-for="item in week" :key=item>{{ item }}</div>
        </div>
        <div class="calender-bottom">
          <div class="calender-bottom-day" v-for="(item,index) in calenderData" :key="index">
            <div v-show="getShow(item)">
              <div>
                {{ item.dayIndex  }}
              </div>
              <div class="day-pic-out">
                <div class="day-pic-in">
                  <img style="width:0.11rem;height:0.11rem;" :src="getIconWater(item)" alt=""></div>
                <div class="day-pic-in">
                  <img style="width:0.11rem;height:0.11rem;" :src="getIconAir(item)" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="3" style="background-color:#333333">
        <div style="height:50%;margin-top:0.05rem;">
          <div v-for="(item,index) in iconTitle1" :key="index" style="height: calc(100% / 6.4);width: 100%;">
            <img v-bind:src="item.src" style="width:0.12rem;height:0.12rem;padding-left:0.16rem;" alt=""><span
              style="color:#6E6E6E;font-size:0.16rem;"> {{ item.title  }}</span>
          </div>
        </div>
        <hr style="background-color:#1a1a1a" />
        <div style="height:50%;margin-top:0.01rem;">
          <div v-for="(item,index) in iconTitle2" :key="index" style="height: calc(100% / 6.4);width: 100%;">
            <img style="width:0.12rem;height:0.12rem;padding-left:0.16rem;" v-bind:src="item.src" alt=""><span
              style="color:#6E6E6E;font-size:0.16rem;"> {{ item.title  }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { analyzeResp } from '@/libs/util';
import e1 from '@/assets/img/boardOne/expression1.svg';
import e2 from '@/assets/img/boardOne/expression2.svg';
import e3 from '@/assets/img/boardOne/expression3.svg';
import e4 from '@/assets/img/boardOne/expression4.svg';
import e5 from '@/assets/img/boardOne/expression5.svg';
import e6 from '@/assets/img/boardOne/expression6.svg';
import w1 from '@/assets/img/boardOne/w1.svg';
import w2 from '@/assets/img/boardOne/w2.svg';
import w3 from '@/assets/img/boardOne/w3.svg';
import w4 from '@/assets/img/boardOne/w4.svg';
import w5 from '@/assets/img/boardOne/w5.svg';
import w6 from '@/assets/img/boardOne/w6.svg';
import a1 from '@/assets/img/boardOne/a1.svg';
import a2 from '@/assets/img/boardOne/a2.svg';
import a3 from '@/assets/img/boardOne/a3.svg';
import a4 from '@/assets/img/boardOne/a4.svg';
import a5 from '@/assets/img/boardOne/a5.svg';
import a6 from '@/assets/img/boardOne/a6.svg';
import { analyzeResp } from '@/libs/util';


export default {
  name: 'Calender',
  data() {
    return {
      leftUrl: e1, // 脸的地址
      aqiData: {},
      nowDate: new Date(),
      week: ['日', '一', '二', '三', '四', '五', '六'],
      monthList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      calenderData: [],
      lastDate: '', // 最后一天
      iconTitle1: [
        { 'title': 'Ⅰ', 'src': w1 },
        { 'title': 'Ⅱ', 'src': w2 },
        { 'title': 'Ⅲ', 'src': w3 },
        { 'title': 'Ⅳ', 'src': w4 },
        { 'title': 'Ⅴ', 'src': w5 },
        { 'title': '劣Ⅴ', 'src': w6 },
      ],
      iconTitle2: [
        { 'title': '优', 'src': a1 },
        { 'title': '良', 'src': a2 },
        { 'title': '轻度', 'src': a3 },
        { 'title': '中度', 'src': a4 },
        { 'title': '重度', 'src': a5 },
        { 'title': '严重', 'src': a6 },
      ],
      reponseDataAir: {},
      reponseDataWater: {},
    };
  },
  components: {
  },
  created() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.setCalenderData();
      this.getRedisAQI();
    },
    // 获取AQI
    getRedisAQI() {
      this.$http.get('redis/AirQualityRealTimeAir_s').then((response) => {
        if (response.status === 200 && response.data.success) {
          this.aqiData = response.data.data;
          this.aqiDataProcess();
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
    // aqi数据处理
    aqiDataProcess() {
      if (this.aqiData.classLevel === '优') {
        this.leftUrl = e1;
      } else if (this.aqiData.classLevel === '良') {
        this.leftUrl = e2;
      } else if (this.aqiData.classLevel === '轻度污染') {
        this.leftUrl = e3;
      } else if (this.aqiData.classLevel === '中度污染') {
        this.leftUrl = e4;
      } else if (this.aqiData.classLevel === '重度污染') {
        this.leftUrl = e5;
      } else if (this.aqiData.classLevel === '严重污染') {
        this.leftUrl = e6;
      }
    },
    // 设置最后一天
    setCalenderData() {
      this.lastDate = this.leapDate();
      this.getRedisCalenderData();
    },
    getAirRedisData() {
      return this.$http.get('redis/AirQualityCalendar_s');
    },
    getWaterRedisData() {
      return this.$http.get('redis/SurfacewaterCalendar_h/909c8ede-d830-4516-818c-549a933f0230');
    },
    // 获取日历Redis
    getRedisCalenderData() {
      this.$http.all([this.getAirRedisData(), this.getWaterRedisData()]).then(this.$http.spread((air, water) => {
        if (air.status === 200 && water.status === 200) {
          this.reponseDataAir = air.data.data;
          this.reponseDataWater = water.data.data;
          this.dataHandle();
        } else {
          this.$message.warning({
            message: air.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }));
    },
    getAirData() {
      return this.$http.get('airquality/gis/calendar', {
        params: {
          month: this.nowDate.getMonth() + 1,
          year: this.nowDate.getFullYear(),
        },
      });
    },
    getWaterData() {
      return this.$http.get('surfacewater/gis/calendar', {
        params: {
          month: this.nowDate.getMonth() + 1,
          year: this.nowDate.getFullYear(),
          portId: '909c8ede-d830-4516-818c-549a933f0230',
        },
      });
    },
    // 获取日历数据
    getCalenderData() {
      this.$http.all([this.getAirData(), this.getWaterData()]).then(this.$http.spread((air, water) => {
        if (air.status === 200 && water.status === 200) {
          this.reponseDataAir = air.data.data;
          this.reponseDataWater = water.data.data;
          this.dataHandle();
        } else {
          this.$message.warning({
            message: air.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }));
    },
    // 数据处理
    dataHandle() {
      // 数据处理
      this.calenderData = [];
      const day = this.nowDate.getDay();
      for (let i = 0; i < 42; i++) {
        const data = {};
        this.$set(data, 'dayIndex', i - day);
        this.$set(data, 'air', this.reponseDataAir.level[i - day - 1]);
        this.$set(data, 'water', this.reponseDataWater.level[i - day - 1]);
        this.calenderData.push(data);
      }
    },
    // 加月
    plusClick() {
      this.$set(this, 'nowDate', new Date(this.nowDate.setMonth(this.nowDate.getMonth() + 1)));
      this.lastDate = this.leapDate();
      this.getCalenderData();
    },
    // 减月
    reduceClick() {
      this.$set(this, 'nowDate', new Date(this.nowDate.setMonth(this.nowDate.getMonth() - 1)));
      this.lastDate = this.leapDate();
      this.getCalenderData();
    },
    // center
    getShow(item) {
      return item.dayIndex > 0 && item.dayIndex <= this.lastDate;
    },
    // 获取最后一天
    leapDate() {
      const year = this.nowDate.getFullYear();
      const month = this.nowDate.getMonth();
      if (year % 100 === 0) {
        if (year % 400 === 0) {
          if (month === 1) {
            return 29;
          }
          return this.monthList[month];
        }
      } else if ((year % 4) === 0) {
        if (month === 1) {
          return 29;
        }
        return this.monthList[month];
      }
      return this.monthList[month];
    },
    // 空气图标
    getIconAir(item) {
      if (item.air === 1) {
        return a1;
      } if (item.air === 2) {
        return a2;
      } if (item.air === 3) {
        return a3;
      } if (item.air === 4) {
        return a4;
      } if (item.air === 5) {
        return a5;
      } if (item.air === 6) {
        return a6;
      }
      return '';
    },
    // 水图标
    getIconWater(item) {
      if (item.water === 1) {
        return w1;
      } if (item.water === 2) {
        return w2;
      } if (item.water === 3) {
        return w3;
      } if (item.water === 4) {
        return w4;
      } if (item.water === 5) {
        return w5;
      } if (item.water === 6) {
        return w6;
      }
      return '';
    },
  },
};
</script>

<style>
.calendar {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
}
.calendar-title {
  font-size: 0.15rem;
  padding-left: 0.1rem;
  margin-top: 0.1rem;
}
.calendar-year {
  font-size: 0.15rem;
  padding-left: 0.1rem;
}
.calendar-month {
  float: left;
  height: 0.4rem;
  font-size: 0.3rem;
  padding-left: 0.1rem;
  color: #00e4ff;
}
.calendar-button1,
.calendar-button2 {
  height: 0.2rem;
  cursor: pointer;
}
.calendar-button1 {
  padding-top: 0.05rem;
}
.calendar-subTitle {
  padding-left: 0.1rem;
  font-size: 0.15rem;
  clear: both;
}
.calendar-realtimeAQI {
  float: left;
  width: 0.45rem;
  height: 0.4rem;
  margin-top: 0.1rem;
  font-size: 0.25rem;
  margin-left: 0.1rem;
}
.calendar-AQI {
  float: left;
  margin-top: 1vh;
  width: 3vw;
}
.calendar-classLevel {
  text-align: center;
  font-size: 0.1rem;
  background: #1a1a1a;
  height: 0.15rem;
}
.calendar-AQI-index {
  font-size: 0.1rem;
}
.calendar-factor {
  padding-left: 0.1rem;
  clear: both;
  /* border: 1px solid #ddf841; */
}
.calendar-remind {
  padding-left: 0.1rem;
  float: left;
}
.calendar-value {
  color: #02da02;
  font-size: 0.15rem;
}
.calendar-remind {
  float: left;
  width: 1rem;
  color: #1da177;
  font-size: 0.15rem;
}
.calendar-remind-left {
  font-size: 0.15rem;
  color: #1da177;
}
/* 中间 */
.calender-top {
  margin-top: 0.1rem;
  height: 0.25rem;
  display: flex;
}
.calender-top div {
  flex: 1;
  text-align: center;
  display: inline-block;
}
.calender-top-week {
  font-size: 0.15rem;
}
.calender-bottom {
  height: 2.75rem;
}
.calender-bottom-day {
  vertical-align: top;
  text-align: center;
  display: inline-block;
  width: 14.28%;
  height: 0.35rem;
  padding: 0.1rem 0 0.06rem 0;
  font-size: 0.1rem;
}
.day-pic-out {
  display: flex;
}
.day-pic-in {
  flex: 1;
}
</style>
