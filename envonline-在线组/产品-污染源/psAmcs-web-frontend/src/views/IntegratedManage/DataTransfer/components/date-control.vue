<template>
  <el-form :model="dateControl" inline style="display: inline-block;">
    <el-form-item label="时间类型：">
      <el-select
        v-model="dateControl.queryDateType"
        style="width: 100px"
      >
        <el-option value="day" label="日"></el-option>
        <el-option value="week" label="周"></el-option>
        <el-option value="month" label="月"></el-option>
        <el-option value="quarter" label="季"></el-option>
        <el-option value="year" label="年"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="时间：">
      <!-- <el-date-picker
        v-show="dateControl.queryDateType === 'day'"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        v-model="dateRange"
        :picker-options="pickStart"
        :clearable="false"
      ></el-date-picker> -->
      <div v-show="dateControl.queryDateType === 'day'">
        <el-date-picker
          style="width:140px"
          v-model="dateControl.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:140px"
          v-model="dateControl.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </div>
      <el-date-picker
        v-show="dateControl.queryDateType === 'week'"
        class="mar-l-xs"
        v-model="week"
        type="week"
        format="yyyy 第 WW 周"
        value-format="yyyy-MM-dd WW"
        placeholder="选择周"
        :clearable="false"
      ></el-date-picker>
      <el-date-picker
        v-show="dateControl.queryDateType === 'month'"
        v-model="month"
        value-format="yyyy-MM"
        type="month"
        placeholder="选择月"
        :clearable="false"
      ></el-date-picker>
      <el-date-picker
        v-show="dateControl.queryDateType === 'quarter' || dateControl.queryDateType === 'year'"
        v-model="dateControl.year"
        type="year"
        value-format="yyyy"
        placeholder="选择年"
        :clearable="false"
        style="width: 100px;"
      ></el-date-picker>
      <el-select
        class="mar-l-xs"
        v-show="dateControl.queryDateType === 'quarter'"
        v-model="dateControl.quarter"
        style="width: 150px"
      >
        <el-option value="1" label="第一季度"></el-option>
        <el-option value="2" label="第二季度"></el-option>
        <el-option value="3" label="第三季度"></el-option>
        <el-option value="4" label="第四季度"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { getDay } from '@/libs/tools';

export default {
  // 设置绑定参数
  model: {
    prop: 'dateForm',
    event: 'selected',
  },
  props: {
    dateForm: {
      default: {
        queryDateType: 'day',
        fromDate: getDay(-1, false, false),
        toDate: getDay(-1, false, false),
      },
    },
  },
  data() {
    return {
      weekDate: getDay(0, false, false).replace(/.{4}/, ''),
      dateControl: {
        queryDateType: 'day',
        fromDate: getDay(-1, false, false),
        toDate: getDay(-1, false, false),
        weekCount: '01',
        mon: new Date().getMonth() + 1,
        quarter: `${Math.ceil((new Date().getMonth() + 1) / 3)}`,
        year: `${new Date().getFullYear()}`,
      },
      pickerOneDate: '',
      pickStart: {
        disabledDate: (time) => {
          if (this.dateControl.toDate === '' || this.dateControl.toDate === null) {
            return time.getTime() > Date.now();
          }
          return time.getTime() > new Date(this.dateControl.toDate).getTime();
        },
      },
      pickEnd: {
        disabledDate: time => time.getTime() < new Date(this.dateControl.fromDate).getTime()
          || time.getTime() > Date.now(),
      },
      // pickStart: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.pickerOneDate = minDate.getTime();
      //     if (maxDate) {
      //       this.pickerOneDate = '';
      //     }
      //   },
      //   disabledDate: (time) => {
      //     if (this.pickerOneDate !== '') {
      //       const date = 0 * 24 * 3600000;
      //       const max = this.pickerOneDate + date;
      //       const min = this.pickerOneDate - date;
      //       return time.getTime() > max || time.getTime() < min || time.getTime() > new Date();
      //     }
      //     return time.getTime() > new Date();
      //   },
      // },
    };
  },
  computed: {
    week: {
      get() {
        return `${this.dateControl.year}${this.weekDate} ${this.dateControl.weekCount}`;
      },
      set(val) {
        this.weekDate = val.split(' ')[0].replace(/.{4}/, '');
        [this.dateControl.year] = val.split('-');
        [, this.dateControl.weekCount] = val.split(' ');
      },
    },
    month: {
      get() {
        return `${this.dateControl.year}-${this.dateControl.mon}`;
      },
      set(val) {
        [this.dateControl.year, this.dateControl.mon] = val.split('-');
      },
    },
    dateRange: {
      get() {
        return (!this.dateControl.fromDate && !this.dateControl.toDate)
          ? '' : [this.dateControl.fromDate, this.dateControl.toDate];
      },
      set(val) {
        [this.dateControl.fromDate, this.dateControl.toDate] = val || ['', ''];
      },
    },
  },
  watch: {
    dateControl: {
      handler(val) {
        const {
          queryDateType,
          fromDate,
          toDate,
          weekCount,
          mon,
          quarter,
          year,
        } = val;
        let dateItem = { queryDateType, fromDate, toDate };
        if (queryDateType === 'week') {
          dateItem = { queryDateType, year, weekCount };
        } else if (queryDateType === 'month') {
          dateItem = { queryDateType, year, mon };
        } else if (queryDateType === 'quarter') {
          dateItem = { queryDateType, year, quarter };
        } else if (queryDateType === 'year') {
          dateItem = { queryDateType, year };
        }
        this.$emit('selected', dateItem);
      },
      deep: true,
    },
  },
  created() {
    this.dateControl = {
      ...this.dateControl,
      ...this.dateForm,
    };
    // 根据methods里方法（源自element源码），获取当前日期属于第几周
    // eslint-disable-next-line
    this.dateControl.weekCount = this.getWeekNumber(new Date(`${this.dateControl.year}${this.weekDate}`)) + '';
  },
  methods: {
    isDate(date) {
      if (date === null || date === undefined) return false;
      // eslint-disable-next-line
      if (isNaN(new Date(date).getTime())) return false;
      if (Array.isArray(date)) return false; // deal with `new Date([ new Date() ]) -> new Date()`
      return true;
    },
    getWeekNumber(src) {
      if (!this.isDate(src)) return null;
      const date = new Date(src.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      // January 4 is always in week 1.
      const week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
      // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
