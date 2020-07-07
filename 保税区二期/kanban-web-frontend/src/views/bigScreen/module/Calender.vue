<template>
  <div class="bs-calendar">
    <div style="font-size:0.3rem;">日历图</div>
    <el-row style="background-color:#1B2C3E">
      <el-col :span="4"
              style="height:0.6rem;">
        <div class="bs-calendar-year">{{nowDate.getFullYear()}}年</div>
        <div class="bs-calendar-month">{{nowDate.getMonth() + 1}}月</div>
        <!-- <div class="calendar-button1">
          <i class="el-icon-caret-top"
             @click="plusClick"></i>
        </div>
        <div class="calendar-button2">
          <i class="el-icon-caret-bottom"
             @click="reduceClick"></i>
        </div> -->
      </el-col>
      <el-col :span="20">
        <div style="float:right;margin-top:0.2rem;">
          <div v-for="(item,index) in iconTitle1"
               style="height:0.2rem;width:0.6rem;float:left;"
               :key="index">
            <img v-bind:src="item.src"
                 style="height:0.15rem;float:left;"
                 alt=""><span style="font-size:0.15rem;float:left;"> {{ item.title  }}</span>
          </div>
          <div style="clear:both;">
            <div v-for="(item,index) in iconTitle2"
                 style="height:0.2rem;width:0.6rem;float:left;"
                 :key="index">
              <img v-bind:src="item.src"
                   style="height:0.15rem;float:left;"
                   alt=""><span style="font-size:0.15rem;float:left;"> {{ item.title  }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :span="14">
      <div class="bs-calender-top">
        <div class="bs-calender-top-week"
             v-for="item in week"
             :key=item>{{ item }}</div>
      </div>
      <div class="bs-calender-bottom">
        <div class="bs-calender-bottom-day"
             v-for="(item,index) in calenderData"
             :key="index">
          <div v-show="getShow(item)">
            <div>
              {{ item.dayIndex  }}
            </div>
            <div class="bs-day-pic-out">
              <div class="bs-day-pic-in">
                <img style="width:0.2rem;"
                     :src="getIconWater(item)"
                     alt=""></div>
              <div class="bs-day-pic-in">
                <img style="width:0.2rem;"
                     :src="getIconAir(item)"
                     alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
// import { analyzeResp } from '@/libs/util';
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


export default {
  name: 'Calender',
  data() {
    return {
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
    };
  },
  components: {
  },
  created() {
    this.nowDate = new Date();
    this.setCalenderData(this.nowDate);
    this.getRedisAQI();
  },
  methods: {
    // 设置最后一天
    setCalenderData() {
      this.lastDate = this.leapDate();
      this.getRedisCalenderData();
    },
    // 获取日历诗句Redis
    getRedisCalenderData() {
      //   this.$http.get('redis/AirQualityCalendar_s').then((response) => {
      //     if (response.status === 200 && response.data.success) {
      //       this.calenderData = response.data.data;
      //       this.$emit('parentFn', this.calenderData);
      //     } else {
      //       this.$message.warning({
      //         message: response.data.msg,
      //         duration: 3000,
      //         showClose: true,
      //       });
      //     }
      //   }, ({ response }) => {
      //     analyzeResp(response);
      //   });
      const reponseDataAir = {
        'level': [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
        ],
        'values': [
          '60',
          '80',
          '54',
          '120',
          '70',
          '80',
          '59',
          '57',
          '50',
          '32',
          '67',
          '152',
          '198',
          '189',
          '62',
          '32',
          '69',
          '94',
          '120',
          '',
        ],
        'levelName': [
          '良',
          '良',
          '良',
          '轻度污染',
          '良',
          '良',
          '良',
          '良',
          '优',
          '优',
          '良',
          '中度污染',
          '中度污染',
          '中度污染',
          '良',
          '优',
          '良',
          '良',
          '轻度污染',
          '',
        ],
        'dates': [
          '2020-01-01',
          '2020-01-02',
          '2020-01-03',
          '2020-01-04',
          '2020-01-05',
          '2020-01-06',
          '2020-01-07',
          '2020-01-08',
          '2020-01-09',
          '2020-01-10',
          '2020-01-11',
          '2020-01-12',
          '2020-01-13',
          '2020-01-14',
          '2020-01-15',
          '2020-01-16',
          '2020-01-17',
          '2020-01-18',
          '2020-01-19',
          '2020-01-20',
        ],
      };
      const reponseDataWater = {
        'level': [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
        ],
        'values': [
          '60',
          '80',
          '54',
          '120',
          '70',
          '80',
          '59',
          '57',
          '50',
          '32',
          '67',
          '152',
          '198',
          '189',
          '62',
          '32',
          '69',
          '94',
          '120',
          '',
        ],
        'levelName': [
          '良',
          '良',
          '良',
          '轻度污染',
          '良',
          '良',
          '良',
          '良',
          '优',
          '优',
          '良',
          '中度污染',
          '中度污染',
          '中度污染',
          '良',
          '优',
          '良',
          '良',
          '轻度污染',
          '',
        ],
        'dates': [
          '2020-01-01',
          '2020-01-02',
          '2020-01-03',
          '2020-01-04',
          '2020-01-05',
          '2020-01-06',
          '2020-01-07',
          '2020-01-08',
          '2020-01-09',
          '2020-01-10',
          '2020-01-11',
          '2020-01-12',
          '2020-01-13',
          '2020-01-14',
          '2020-01-15',
          '2020-01-16',
          '2020-01-17',
          '2020-01-18',
          '2020-01-19',
          '2020-01-20',
        ],
      };
      // 数据处理
      this.dataHandle(reponseDataAir, reponseDataWater);
    },
    // 获取日历数据
    getCalenderData() {
      //   this.$http.get('redis/AirQualityCalendar_s').then((response) => {
      //     if (response.status === 200 && response.data.success) {
      //       this.calenderData = response.data.data;
      //       this.$emit('parentFn', this.calenderData);
      //     } else {
      //       this.$message.warning({
      //         message: response.data.msg,
      //         duration: 3000,
      //         showClose: true,
      //       });
      //     }
      //   }, ({ response }) => {
      //     analyzeResp(response);
      //   });
      const reponseDataAir = {
        'level': [
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
        ],
        'values': [
          '60',
          '80',
          '54',
          '120',
          '70',
          '80',
          '59',
          '57',
          '50',
          '32',
          '67',
          '152',
          '198',
          '189',
          '62',
          '32',
          '69',
          '94',
          '120',
          '',
        ],
        'levelName': [
          '良',
          '良',
          '良',
          '轻度污染',
          '良',
          '良',
          '良',
          '良',
          '优',
          '优',
          '良',
          '中度污染',
          '中度污染',
          '中度污染',
          '良',
          '优',
          '良',
          '良',
          '轻度污染',
          '',
        ],
        'dates': [
          '2020-01-01',
          '2020-01-02',
          '2020-01-03',
          '2020-01-04',
          '2020-01-05',
          '2020-01-06',
          '2020-01-07',
          '2020-01-08',
          '2020-01-09',
          '2020-01-10',
          '2020-01-11',
          '2020-01-12',
          '2020-01-13',
          '2020-01-14',
          '2020-01-15',
          '2020-01-16',
          '2020-01-17',
          '2020-01-18',
          '2020-01-19',
          '2020-01-20',
        ],
      };
      const reponseDataWater = {
        'level': [
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
          '6',
          '5',
          '4',
          '3',
          '2',
          '1',
        ],
        'values': [
          '60',
          '80',
          '54',
          '120',
          '70',
          '80',
          '59',
          '57',
          '50',
          '32',
          '67',
          '152',
          '198',
          '189',
          '62',
          '32',
          '69',
          '94',
          '120',
          '',
        ],
        'levelName': [
          '良',
          '良',
          '良',
          '轻度污染',
          '良',
          '良',
          '良',
          '良',
          '优',
          '优',
          '良',
          '中度污染',
          '中度污染',
          '中度污染',
          '良',
          '优',
          '良',
          '良',
          '轻度污染',
          '',
        ],
        'dates': [
          '2020-01-01',
          '2020-01-02',
          '2020-01-03',
          '2020-01-04',
          '2020-01-05',
          '2020-01-06',
          '2020-01-07',
          '2020-01-08',
          '2020-01-09',
          '2020-01-10',
          '2020-01-11',
          '2020-01-12',
          '2020-01-13',
          '2020-01-14',
          '2020-01-15',
          '2020-01-16',
          '2020-01-17',
          '2020-01-18',
          '2020-01-19',
          '2020-01-20',
        ],
      };
      // 数据处理
      this.dataHandle(reponseDataAir, reponseDataWater);
    },
    // 数据处理
    dataHandle(reponseDataAir, reponseDataWater) {
      // 数据处理
      this.calenderData = [];
      const day = this.nowDate.getDay();
      for (let i = 0; i < 42; i++) {
        const data = {};
        this.$set(data, 'dayIndex', i - day);
        this.$set(data, 'air', reponseDataAir.level[i - day - 1]);
        this.$set(data, 'water', reponseDataWater.level[i - day - 1]);
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
      if (item.air === '1') {
        return a1;
      } if (item.air === '2') {
        return a2;
      } if (item.air === '3') {
        return a3;
      } if (item.air === '4') {
        return a4;
      } if (item.air === '5') {
        return a5;
      } if (item.air === '6') {
        return a6;
      }
      return '';
    },
    // 水图标
    getIconWater(item) {
      if (item.water === '1') {
        return w1;
      } if (item.water === '2') {
        return w2;
      } if (item.water === '3') {
        return w3;
      } if (item.water === '4') {
        return w4;
      } if (item.water === '5') {
        return w5;
      } if (item.water === '6') {
        return w6;
      }
      return '';
    },
  },
};
</script>

<style scoped>
.bs-calendar {
  width: 100%;
  height: 100%;
}
.bs-calendar-year {
  font-size: 0.2rem;
}
.bs-calendar-month {
  font-size: 0.3rem;
  color: #ffd61a;
}
.calendar-button1,
.calendar-button2 {
  height: 0.2rem;
  cursor: pointer;
}
.calendar-button1 {
  padding-top: 0.05rem;
}
/* 中间 */
.bs-calender-top {
  height: 0.25rem;
  display: flex;
}
.bs-calender-top div {
  flex: 1;
  text-align: center;
  display: inline-block;
}
.bs-calender-top-week {
  font-size: 0.15rem;
}
.bs-calender-bottom {
  height: 3rem;
}
.bs-calender-bottom-day {
  vertical-align: top;
  text-align: center;
  width: 14.28%;
  height: 0.5rem;
  float: left;
  font-size: 0.15rem;
}
.bs-day-pic-out {
  display: flex;
}
.bs-day-pic-in {
  flex: 1;
}
</style>
