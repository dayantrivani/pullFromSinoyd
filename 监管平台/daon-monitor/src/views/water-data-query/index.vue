<template>
  <container class="Page-WaterDataQuery">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>
    <enter-manage ref="EnterManage" v-if="!isShow" @changeIsShow="changeIsShow" />
    <search-extend v-if="isShow">
      <template v-slot:default>
        <a class="back-class" @click="onBack">
          <a-icon type="backward"></a-icon>
          <span>{{currentCom}}</span>
        </a>
      </template>
      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-select
              v-model="queryForm.type"
              :allowClear="false"
              style="width:150px"
              @change="changeType"
            >
              <a-select-option
                v-for="(item,index) in $enum.DATA_TYPE.splice(1,5)"
                :key="index"
                :value="item.value"
              >{{item.label}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-date-picker
              :allowClear="false"
              v-model="startDate"
              style="width: 180px"
              :showTime="queryForm.type==='M' || queryForm.type==='R' ? Mtime : queryForm.type==='H'
                ? Htime : queryForm.type==='HA' ? Htime : false"
              :format="queryForm.type==='M' || queryForm.type==='R' ? 'YYYY-MM-DD HH:mm' : queryForm.type==='H'
                ? 'YYYY-MM-DD HH' : queryForm.type==='HA' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD'"
              @openChange="_openChange"
              :disabledDate="disabledStartDate"
              :disabledTime="disabledStartTime"
            ></a-date-picker>~
            <a-date-picker
              :allowClear="false"
              v-model="endDate"
              style="width: 180px"
              :showTime="queryForm.type==='M' || queryForm.type==='R' ? Mtime : queryForm.type==='H'
                ? Htime : queryForm.type==='HA' ? Htime : false"
              :format="queryForm.type==='M' || queryForm.type==='R' ? 'YYYY-MM-DD HH:mm' : queryForm.type==='H'
                ? 'YYYY-MM-DD HH' : queryForm.type==='HA' ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD'"
              @openChange="_openChange"
              :disabledDate="disabledEndDate"
              :disabledTime="disabledEndTime"
            ></a-date-picker>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="plain" :disabled="disDupClick" @click="onQueryList" title="查询">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-form-item>
        </a-form>
      </template>
    </search-extend>
    <a-card
      :bordered="false"
      style="height: calc(100% - 52px);"
      v-if="isShow"
      class="WaterDataQuery-class"
    >
      <!-- <a-button type="primary" class="back-class" @click="onBack"> <a-icon type="left" />返回 </a-button> -->
      <!-- 列表 -->
      <a-table
        class="dynamic-table WaterDataQuery"
        id="Page-WaterDataQuery"
        size="middle"
        rowKey="key"
        :loading="loading"
        :columns="columns"
        :scroll="{ x: 2660, y: 475 }"
        :dataSource="itemList"
        :pagination="false"
      >
        <!-- <template slot="nameSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span class="p-class">{{ text }}</span>
          </a-tooltip>
        </template>-->
        <template slot="stationNameSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span class="p-class">{{ text }}</span>
          </a-tooltip>
        </template>
      </a-table>
    </a-card>
  </container>
</template>

<script>
import moment from 'moment';
import { emptyQuery, getList } from '@/api/modules/water-data-query.js';
import { getSessionStorage } from '@/libs/tools';
import EnterManage from '@/components/locally/EnterManage';

export default {
  name: 'WaterDataQuery',
  components: {
    EnterManage,
  },
  computed: {
    // currentCom() {
    //   return getSessionStorage('CHOOSECOM').name;
    // },
    startDate: {
      get() {
        return this.queryForm.beginTime;
      },
      set(val) {
        this.queryForm.beginTime = val;
      },
    },
    endDate: {
      get() {
        return this.queryForm.endTime;
      },
      set(val) {
        this.queryForm.endTime = val;
      },
    },
  },
  data() {
    return {
      Mtime: {
        format: 'HH:mm',
      },
      Htime: {
        format: 'HH',
      },
      cuurentCom: '',
      isShow: false,
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 55,
          customRender: (text, record, index) => index + 1,
          fixed: 'left',
        },
        // {
        //   title: '污染源名称',
        //   dataIndex: 'name',
        //   key: 'name',
        //   width: 180,
        //   scopedSlots: { customRender: 'nameSlot' },
        //   fixed: 'left',
        // },
        {
          title: '站点名称',
          dataIndex: 'station_name',
          key: 'station_name',
          width: 200,
          scopedSlots: { customRender: 'stationNameSlot' },
          fixed: 'left',
        },
        {
          title: '数据时间',
          dataIndex: '_time',
          key: '_time',
          width: 180,
          scopedSlots: { customRender: '_time' },
          fixed: 'left',
        },
        {
          title: '污水平均值(升/秒)',
          dataIndex: 'w00000-Avg',
          key: 'w00000-Avg',
          width: 100,
          align: 'center',
        },
        {
          title: '污水排放量(立方米)',
          dataIndex: 'w00000-Cou',
          key: 'w00000-Cou',
          width: 100,
          align: 'center',
        },
        {
          title: 'pH值平均值(无量纲)',
          dataIndex: 'w01001-Avg',
          key: 'w01001-Avg',
          width: 100,
          align: 'center',
        },
        {
          title: 'pH值排放量',
          dataIndex: 'w01001-Cou',
          key: 'w01001-Cou',
          width: 100,
          align: 'center',
        },
        {
          title: '化学需氧量平均值(毫克/升)',
          dataIndex: 'w01018-Avg',
          key: 'w01018-Avg',
          width: 140,
          align: 'center',
        },
        {
          title: '化学需氧量排放量(千克)',
          dataIndex: 'w01018-Cou',
          key: 'w01018-Cou',
          width: 140,
          align: 'center',
        },
        {
          title: '总有机碳平均值(毫克/升)',
          dataIndex: 'w01020-Avg',
          key: 'w01020-Avg',
          width: 130,
          align: 'center',
        },
        {
          title: '总有机碳排放量(千克)',
          dataIndex: 'w01020-Cou',
          key: 'w01020-Cou',
          width: 130,
          align: 'center',
        },
        {
          title: '氨氮平均值(毫克/升)',
          dataIndex: 'w21003-Avg',
          key: 'w21003-Avg',
          width: 100,
          align: 'center',
        },
        {
          title: '氨氮排放量(千克)',
          dataIndex: 'w21003-Cou',
          key: 'w21003-Cou',
          width: 100,
          align: 'center',
        },
        {
          title: '总磷平均值(毫克/升)',
          dataIndex: 'w21011-Avg',
          key: 'w21011-Avg',
          width: 100,
          align: 'center',
        },
        {
          title: '总磷排放量(千克)',
          dataIndex: 'w21011-Cou',
          key: 'w21011-Cou',
          width: 100,
          align: 'center',
        },
        {
          title: '总氮平均值(毫克/升)',
          dataIndex: 'w21001-Avg',
          key: 'w21001-Avg',
          width: 100,
          align: 'center',
        },
        {
          title: '总氮排放量(千克)',
          dataIndex: 'w21001-Cou',
          key: 'w21001-Cou',
          width: 100,
          align: 'center',
        },
        {
          title: '烟尘平均值(毫克/立方米)',
          dataIndex: 'a34013-Avg',
          key: 'a34013-Avg',
          width: 100,
          align: 'center',
        },
        {
          title: '烟尘排放量(千克)',
          dataIndex: 'a34013-Cou',
          key: 'a34013-Cou',
          width: 100,
          align: 'center',
        },
        {
          title: '二氧化硫平均值(毫克/立方米)',
          dataIndex: 'a21026-Avg',
          key: 'a21026-Avg',
          width: 130,
          align: 'center',
        },
        {
          title: '二氧化硫排放量(千克)',
          dataIndex: 'a21026-Cou',
          key: 'a21026-Cou',
          width: 130,
          align: 'center',
        },
        {
          title: '氮氧化物平均值(毫克/立方米)',
          dataIndex: 'a21002-Avg',
          key: 'a21002-Avg',
          width: 130,
          align: 'center',
        },
        {
          title: '氮氧化物排放量(千克)',
          dataIndex: 'a21002-Cou',
          key: 'a21002-Cou',
          width: 130,
          align: 'center',
        },
      ],
      itemList: [],
      arr: [],  // 存储请求返回列表数据
      queryForm: emptyQuery(),
      temDate: [], // 存储时间范围禁选边界
      defaultValue: 'M',
      scrollTop: '',
      medianData: [],
      array: [],
      disDupClick: false, // 禁止loading时多次查询
    };
  },
  methods: {
    transformQueryDate() {
      if (this.queryForm.type === 'H' || this.queryForm.type === 'HA') {
        const sTime = this.queryForm.beginTime.format('YYYY-MM-DD HH:mm:ss');
        const eTime = this.queryForm.endTime.format('YYYY-MM-DD HH:mm:ss');
        this.queryForm.beginTime = moment(new Date(`${sTime.slice(0, 13)}:00:00`).getTime());
        this.queryForm.endTime = moment(new Date(`${eTime.slice(0, 13)}:59:59`).getTime());
      } else if (this.queryForm.type === 'M' || this.queryForm.type === 'R') {
        const sTime = this.queryForm.beginTime.format('YYYY-MM-DD HH:mm:ss');
        const eTime = this.queryForm.endTime.format('YYYY-MM-DD HH:mm:ss');
        this.queryForm.beginTime = moment(new Date(`${sTime.slice(0, 16)}:00`).getTime());
        this.queryForm.endTime = moment(new Date(`${eTime.slice(0, 16)}:00`).getTime());
      } else {
        const sTime = this.queryForm.beginTime.format('YYYY-MM-DD HH:mm:ss');
        const eTime = this.queryForm.endTime.format('YYYY-MM-DD HH:mm:ss');
        this.queryForm.beginTime = moment(new Date(`${sTime.slice(0, 11)}00:00:00`).getTime());
        this.queryForm.endTime = moment(new Date(`${eTime.slice(0, 11)}23:59:59`).getTime());
      }
    },
    onBack() {
      this.isShow = false;
    },
    changeIsShow(val) {
      this.isShow = val.isShow;
      this.currentCom = val.comName;
      this.queryForm.type = 'R';
      this.queryForm.beginTime = moment().subtract(1, 'hours');
      this.queryForm.endTime = moment();
      this.getItemList();
    },
    // 数据类型改变事件
    changeType(value) {
      switch (value) {
        case 'M':
          this.queryForm = emptyQuery();
          this.queryForm.type = 'M';
          break;
        case 'H':
          this.queryForm = emptyQuery(23, 'hours');
          this.queryForm.type = 'H';
          break;
        case 'HA':
          this.queryForm = emptyQuery(23, 'hours');
          this.queryForm.type = 'HA';
          break;
        case 'D':
          this.queryForm = emptyQuery(29, 'days');
          this.queryForm.type = 'D';
          break;
        case 'DA':
          this.queryForm = emptyQuery(29, 'days');
          this.queryForm.type = 'DA';
          break;
        default:
          break;
      }
    },
    _openChange(status) {
      if (status) {
        if (this.startDate && this.endDate) {
          this.queryForm.beginTime = null;
          this.queryForm.endTime = null;
        }
      }
    },
    disabledStartDate(current) {
      if (this.endDate) {
        // const endValue = this.endDate;
        let endValue = this.endDate.format('YYYY-MM-DD');
        endValue = moment(endValue);
        // console.log(endValue);
        if (!current || !endValue) {
          return current > moment().endOf('day');
        }
        /* eslint-disable */
        // if (this.queryForm.type === 'H' || this.queryForm.type === 'HA') {
        //   return current.valueOf() < (endValue.valueOf() - 48 * 3600 * 1000) || current.valueOf() > endValue.valueOf() || current > moment().endOf('day');
        // } else if (this.queryForm.type === 'D' || this.queryForm.type === 'DA') {
        //   return current.valueOf() < (endValue.valueOf() - 29 * 24 * 3600 * 1000) || current.valueOf() > endValue.valueOf() || current > moment().endOf('day');
        // }
        return current.valueOf() > (endValue.valueOf() + 24 * 3600 * 1000) || current > moment().endOf('day');
      }
      return current > moment().endOf('day');
    },
    disabledEndDate(current) {
      if (this.startDate) {
        // const startValue = this.startDate;
        let startValue = this.startDate.format('YYYY-MM-DD');
        startValue = moment(startValue);
        if (!current || !startValue) {
          return current > moment().endOf('day');
        }
        /* eslint-disable */
        // if (this.queryForm.type === 'H' || this.queryForm.type === 'HA') {
        //   return current.valueOf() <= startValue.valueOf() || current.valueOf() > (startValue.valueOf() + 48 * 3600 * 1000) || current > moment().endOf('day');
        // } else if (this.queryForm.type === 'D' || this.queryForm.type === 'DA') {
        //   return current.valueOf() <= startValue.valueOf() || current.valueOf() > (startValue.valueOf() + 30 * 24 * 3600 * 1000) || current > moment().endOf('day');
        // }
        return current.valueOf() <= startValue.valueOf() || current > moment().endOf('day');
      }
      return current > moment().endOf('day');
    },
    disabledStartTime() {
      // const startTime = this.startDate;
      // const endTime = this.endDate;
      // if (startTime.startOf('day') === endTime.startOf('day')) {
      //   return {
      //     disabledHours() {
      //       const hours = [];
      //       const startHour = endTime.hours();
      //       for (let h = 0; h < 24; h++) {
      //         if (h >= startHour) {
      //           hours.push(h);
      //         }
      //       }
      //       return hours;
      //     },
      //     disabledMinutes() {
      //       const minutes = [];
      //       const startMinute = endTime.minutes();
      //       for (let m = 0; m < 60; m++) {
      //         if (m >= startMinute) {
      //           minutes.push(m);
      //         }
      //       }
      //       return minutes;
      //     },
      //     disabledSeconds() {
      //       const seconds = [];
      //       const startSecond = endTime.seconds();
      //       for (let s = 0; s < 60; s++) {
      //         if (s >= startSecond) {
      //           seconds.push(s);
      //         }
      //       }
      //       return seconds;
      //     },
      //   };
      // }
      // return false;
    },
    disabledEndTime() { },
    // 点击查询事件
    onQueryList() {
      this.getItemList();
    },
    getItemList() {
      if (!this.queryForm.beginTime) {
        this.$message.warning('起始时间不能为空');
        return;
      }
      if (!this.queryForm.endTime) {
        this.$message.warning('结束时间不能为空');
        return;
      }
      // if (this.queryForm.type === 'H' || this.queryForm.type === 'HA') {
      //   this.test();
      // }
      this.transformQueryDate();
      if (this.queryForm.beginTime.valueOf() > this.queryForm.endTime.valueOf()) {
        const tem = this.queryForm.endTime;
        this.queryForm.endTime = this.queryForm.beginTime;
        this.queryForm.beginTime = tem;
      }
      this.loading.spinning = true;
      this.disDupClick = true;
      this.queryForm.uscc = getSessionStorage('CHOOSECOM').creditCode;
      this.itemList = [];
      getList(this.queryForm).then((response) => {
        if (response.data.code === 200) {
          this.arr = response.data.data;
          this.arr.forEach((el, index) => {
            el.name = getSessionStorage('CHOOSECOM').name;
            el.key = index;
            el._time = moment(el._time * 1000).format('YYYY-MM-DD HH:mm:ss');
          });
          this.medianData = [...this.arr];
          const arr = this.arr.splice(0, 12);
          arr.forEach((el) => {
            this.itemList.push(el);
          });
          this.loading.spinning = false;
          this.disDupClick = false;
        } else {
          this.$message.warning(response.data.msg);
          this.loading.spinning = false;
          this.disDupClick = false;
        }
      });
    },
    handleScroll() {
      // eslint-disable-next-line
      let scrollTop = document.getElementById('Page-WaterDataQuery').getElementsByClassName('ant-table-body')[0].scrollTop;
      this.scrollTop = scrollTop;
    },
  },
  created() {
    // this.getItemList();
  },
  mounted() {
    if (this.isShow) {
      window.addEventListener('scroll', this.handleScroll, true);
    }
  },
  watch: {
    currentCom(val) {
      return val;
    },
    isShow(val) {
      if (!val) {
        window.removeEventListener('scroll', this.handleScroll, true);
      } else if (val) {
        window.addEventListener('scroll', this.handleScroll, true);
      }
    },
    $route(to, form) {
      // 离开当前页面时取消滚动事件  返回时重新绑定
      if (form.name === 'WaterDataQuery') {
        window.removeEventListener('scroll', this.handleScroll, true);
      } else if (to.name === 'WaterDataQuery' && this.isShow) {
        window.addEventListener('scroll', this.handleScroll, true);
      }
    },
    scrollTop(val) {
      for (let i = 0; i < this.medianData.length / 12; i++) {
        if (val === 94 + 552 * i && !this.array.includes(i)) {
          this.array.push(i);
          const arr = this.arr.splice(0, 12);
          arr.forEach((el) => {
            this.itemList.push(el);
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.WaterDataQuery-class {
  > .ant-card-body {
    position: relative;
    .default {
      .left {
        padding: 10px 0;
        .back-class {
          .anticon {
            margin-right: 5px;
          }
          span {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
</style>
