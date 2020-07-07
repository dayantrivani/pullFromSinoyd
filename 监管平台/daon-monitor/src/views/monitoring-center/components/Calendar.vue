<template>
<!-- 日历 -->
  <div class="calendar">
    <div class="legend fn-flex mar-b-sm">
      <a-icon class="left" type="left" @click="reduce"/>
      <ul class="work_cla">
        <li class="yes_cla" v-show="!isWork" @click="changeWork(true)">到岗签到</li>
        <li class="no_cla" v-show="isWork" @click="changeWork(false)">取消签到</li>
      </ul>
      <span class="year_mouth">
        <span class="mouth">{{currentMonth}}月</span>
        <span class="year">{{currentYear}}年</span>
      </span>
      <ul class="duty_cla">
        <li class="yes_cla" v-show="!isDuty" @click="changeDuty(true)">值班签到</li>
        <li class="no_cla" v-show="isDuty" @click="changeDuty(false)">取消值班</li>
      </ul>
      <a-icon class="right" type="right" :style="{ 'cursor': addDisabled ? 'no-drop' : 'pointer' }" @click="add"/>
    </div>
    <div style="height: 270px;">
      <ul class="led-color data-control">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <ul>
        <li v-for="(item, index) in emptyList" :key="`0${index}`"></li>
        <li v-for="(item, index) in dateList" :key="index">
          <!-- <div v-show="item.num"> -->
            <a-tooltip placement="topRight">
              <template slot="title">
                <div>
                  <div>
                    <span style="margin-right: 5px">
                      今日到岗 {{singArr[index] && singArr[index][1] ? singArr[index][1].length : 0}}人
                    </span>
                    <span
                      style="margin-left: 5px"
                      v-for="(item, index) in singArr[index] ? singArr[index][1] : []"
                      :key="index">{{item}}</span>
                  </div>
                  <div>
                    <span style="margin-right: 5px">
                      今日值班 {{singArr[index] && singArr[index][0] ? singArr[index][0].length : 0}}人
                    </span>
                    <span
                      style="margin-left: 5px"
                      v-for="(item, index) in singArr[index] ? singArr[index][0] : []"
                     :key="index">{{item}}</span>
                  </div>
                </div>
              </template>
              <span
                class="spn_content"
                :class="{ 'duty_class': singArr[index] && singArr[index][0].length,
                  'work_class': singArr[index] && singArr[index][1].length }">
                {{item ? item.num : ''}}
              </span>
            </a-tooltip>
          <!-- </div> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getCheck, getSign, getSignUsers } from '@/api/modules/monitoring-center.js';

export default {
  name: 'Calendar',
  props: {
    controle: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      isWork: false,  // 是否到岗签到
      isDuty: false,  // 是否值班值班
      loading: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      dateList: [],
      emptyList: [],
      singArr: [],
    };
  },
  computed: {
    // 禁止月份增加
    addDisabled() {
      return this.currentYear === new Date().getFullYear() && this.currentMonth === new Date().getMonth() + 1;
    },
  },
  watch: {
    queryForm: {
      handler() {
        this.getItemList();
      },
      deep: true,
    },
  },
  created() {
    this.getItemList();
  },
  mounted() {
    // 签到
    getCheck().then((res) => {
      if (res.data.code === 200 && res.data.success) {
        [this.isDuty, this.isWork] = Object.values(res.data.data);
        // this.isWork = Object.values(res.data.data)[1];
        // this.isDuty = Object.values(res.data.data)[0];
      } else {
        this.$message.error(res.data.msg, 1);
      }
    });
    // 签到人员查询
    this.getSignUsers({ year: this.currentYear, month: this.currentMonth });
  },
  methods: {
    // 切换到岗签到
    changeWork(type) {
      this.isWork = type;
      this.getSign(1);
    },
    // 切换值班签到
    changeDuty(type) {
      this.isDuty = type;
      this.getSign(2);
    },
    // 切换签到
    getSign(type) {
      getSign(type).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.$message.success(res.data.msg, 1);
          this.getSignUsers({ year: this.currentYear, month: this.currentMonth });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 签到人员查询
    getSignUsers(data) {
      getSignUsers(data).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.singArr = [];
          const { data } = res.data;
          data.forEach((el) => {
            this.singArr.push([Object.values(el)[1], Object.values(el)[2]]);
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 月份减少
    reduce() {
      this.currentMonth--;
      if (!this.currentMonth) {
        this.currentMonth = 12;
        this.currentYear--;
      }
      this.getCalendarDate();
    },
    // 月份增加
    add() {
      if (this.addDisabled) return;
      this.currentMonth++;
      if (this.currentMonth > 12) {
        this.currentMonth = 1;
        this.currentYear++;
      }
      this.getCalendarDate();
    },
    // 获取记录列表
    getItemList() {
      this.getCalendarDate();
    },
    getCalendarDate() {
      this.dateList = [];
      const startDate = new Date(this.currentYear, this.currentMonth - 1, 1);
      const endDate = new Date(this.currentYear, this.currentMonth, 0);
      // 获取月份第一天星期几  对数组索引赋值  将前几位置为empty
      this.emptyList = new Array(startDate.getDay());
      // this.dateList[startDate.getDay()] = {
      //   type: 1,
      //   num: startDate.getDate(),
      // };
      for (let i = 1; i <= endDate.getDate(); i++) {
        this.dateList.push({
          type: 1,
          num: i,
        });
      }
      this.getSignUsers({ year: this.currentYear, month: this.currentMonth });
    },
  },
};
</script>

<style lang="scss" scoped>
$color-box-width: 14px;
$font-mini: 12px;
$color-box-height: 14px;
.work_class{
  background: radial-gradient(circle,#ffffff 0,#e8f5f7 100%);
  &:hover{
    cursor: pointer;
    background: radial-gradient(circle, #ffffff 0, #fdde88 100%);
    border-color: #E08821!important;
  }
}
.duty_class{
  border-color: #4DB489!important;
  &:hover{
    cursor: pointer;
    background: radial-gradient(circle, #ffffff 0, #fdde88 100%);
    border-color: #E08821!important;
  }
}
// 日历
.calendar {
  height: 355px;
  .legend {
    height: 80px;
    position: relative;
    >ul{
      position: absolute;
      height: 45px;
      width: 80px;
      top: 10px;
      color: #fff;
      >li{
        cursor: pointer;
        display: block;
        height: 30px;
        width: 100%;
        padding: 10px 10px;
        margin-top: 10px;
        line-height: 100%;
        font-size: 12px;
        border-radius: 5px;
        box-shadow: 0px 4px 4px #888888;
      }
      >.no_cla{
        background: #B6B6B6;
      }
      >.yes_cla{
        background: #90C7B0;
      }
    }
    >.duty_cla{
      right: 60px;
    }
    >.work_cla{
      left: 60px;
    }
    >.year_mouth{
      user-select: none;
      width: 50px;
      height: 50px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      >.mouth{
        width: 100%;
        height: 50%;
        color: #858585;
        text-align: center;
        display: block;
        font-size: 18px;
        font-weight: 600;
      }
      >.year{
        width: 100%;
        height: 50%;
        color: #BBBBBB;
        text-align: center;
        display: block;
      }
    }
    >i{
      height: 14px;
      cursor: pointer;
    }
    >.left{
      position: absolute;
      left: 10px;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    >.right{
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    >.legend-box {
      font-size: $font-mini;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 5px;
    }
    .color-box {
      width: $color-box-width;
      height: $color-box-height;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
    padding-bottom: 5px;
    height: 25px;
    li {
      height: 40px;
      user-select: none;
      width: 14.28%;
      text-align: center;
      .spn_content {
        width: 35px;
        display: block;
        height: 35px;
        line-height: 35px;
        margin: 0 auto;
        border-radius: 50%;
        border: 1px dashed #fff;
      }
    }
  }
}
</style>
