<template>
  <!-- police-content 报警模块 -->
  <div>

    <search-extend>
      <template v-slot:default>
        <a class="back-class" @click="onBack">
          <a-icon type="backward"></a-icon>
          <span>{{company}}</span>
        </a>
      </template>
      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-date-picker
              v-model="queryForm.fromDate"
              placeholder="请选择开始日期"
              style="width: 150px"
              :disabledDate="disabledFromDate"
              :allowClear="false"/>
            ~
            <a-date-picker
              v-model="queryForm.endDate"
              placeholder="请选择结束日期"
              style="width: 150px"
              :disabledDate="disabledEndDate"
              :allowClear="false"/>
          </a-form-item>
          <a-form-item v-show="isType">
            <a-select style="width: 200px" placeholder="请选择报警类型" :allowClear="false" v-model="queryForm.type">
              <a-select-option v-for="item in alarmType" :key="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="plain" @click="onQueryList" title="查询">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-form-item>
        </a-form>
      </template>
    </search-extend>
    <a-card :bordered="false" class="PoliceContent-class">
      <!-- <a-button type="primary" class="back-class" @click="onBack"> <a-icon type="left" />返回 </a-button> -->
      <!-- 列表 -->
      <a-table
        class="dynamic-table"
        id="Page-WaterDataQuery"
        size="middle"
        rowKey="key"
        :loading='loading'
        :scroll="{y:460}"
        :columns='isType ? columns : OtherColumns'
        :dataSource='itemList'
        :pagination="false"
      >
        <!-- <template slot="companyNameTitleSlot" slot-scope="text, record, index"> -->
        <template slot="companyNameTitleSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span class="p-class">{{ text }}</span>
          </a-tooltip>
          <!-- <span>{{ text }}</span> -->
        </template>
        <template slot="stationSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span class="p-class">{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="beginAtSlot" slot-scope="text">
          {{ getTimestampDate(text, 'year') }}
        </template>
        <template slot="typeSlot" slot-scope="text">
          {{ swtichType(text)}}
        </template>
        <template slot="codeSlot" slot-scope="text, record">
          {{ rules[record.code]}}
        </template>
        <template slot="maxLimitSlot" slot-scope="text, record">
          {{ Math.round(record.minLimit) }}~{{Math.round(record.maxLimit)}}
        </template>
        <template slot="contentSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span class="p-class">{{ text }}</span>
          </a-tooltip>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment';
import { emptyQuery, getList } from '@/api/modules/water-alarm-manage.js';
import { getSessionStorage, getTimestampDate } from '@/libs/tools';
// import { queryTest } from '@/mixins';

export default {
  name: 'PoliceContent',
  // mixins: [queryTest],
  // inject: ['police'],
  props: {
    isType: {
      type: Boolean,
      required: false,
      default: true,
    },
    alarmType: {
      type: Array,
      required: false,
      default: () => [
        { name: '小时超标', id: 'HO' },
        { name: '日超标', id: 'DO' },
      ],
    },
    company: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      temporaryDate: '',
      queryForm: emptyQuery(4, 'months'),
      getTimestampDate,
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 55,
          customRender: (text, record, index) => index + 1,
        },
        {
          title: '污染源名称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 180,
          scopedSlots: { customRender: 'companyNameTitleSlot' },
        },
        {
          title: '站点名称',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 200,
          scopedSlots: { customRender: 'stationSlot' },
        },
        {
          title: '报警时间',
          dataIndex: 'beginAt',
          key: 'beginAt',
          width: 180,
          scopedSlots: { customRender: 'beginAtSlot' },
        },
        {
          title: '报警类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'typeSlot' },
          width: 120,
        },
        {
          title: '超标因子',
          dataIndex: 'code',
          key: 'code',
          scopedSlots: { customRender: 'codeSlot' },
          width: 150,
        },
        {
          title: '超标值',
          dataIndex: 'value',
          key: 'value',
          width: 100,
        },
        {
          title: '标准值',
          dataIndex: 'maxLimit',
          key: 'maxLimit',
          scopedSlots: { customRender: 'maxLimitSlot' },
          width: 100,
        },

      ],
      OtherColumns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => index + 1,
        },
        {
          title: '污染源名称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 180,
          scopedSlots: { customRender: 'companyNameTitleSlot' },
        },
        {
          title: '站点名称',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 200,
          scopedSlots: { customRender: 'stationSlot' },
        },
        {
          title: '开始时间',
          dataIndex: 'beginDate',
          key: 'beginDate',
          width: 180,
        },
        {
          title: '结束时间',
          dataIndex: 'endDate',
          key: 'endDate',
          width: 180,
        },
        {
          title: '报警类型',
          dataIndex: 'type',
          key: 'type',
          width: 120,
          scopedSlots: { customRender: 'typeSlot' },
        },
        {
          title: '报警内容',
          dataIndex: 'content',
          key: 'content',
          scopedSlots: { customRender: 'contentSlot' },
        },
      ],
      itemList: [],
      rules: {
        // 水
        w0000: '污水',
        w01001: 'ph值',
        w01018: '化学需氧量',
        w01020: '总有机碳',
        w21003: '氨氮',
        w21011: '总磷',
        // 气
        a34013: '烟尘',
        a21026: '二氧化硫',
        a21002: '氨氧化物',
      },
      temDate: [],
      arr: [],
      medianData: [],
      scrollTop: '',
    };
  },
  watch: {
    scrollTop(val) {
      for (let i = 0; i < this.medianData.length / 12; i++) {
        if (val === 92 + 550 * i) {
          const arr = this.arr.splice(0, 12);
          arr.forEach((el) => {
            this.itemList.push(el);
          });
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.onQueryList();
    });
    window.addEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    onBack() {
      this.$emit('changeIsShow', false);
    },
    onQueryList() {
      this.loading.spinning = true;
      this.itemList = [];
      getList(this.queryForm).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.arr = res.data.data;
          this.arr.forEach((el, index) => {
            this.$set(el, 'companyName', getSessionStorage('CHOOSECOM').name,);
            el.key = index;
          });
          this.medianData = [...this.arr];
          const arr = this.arr.splice(0, 12);
          arr.forEach((el) => {
            this.itemList.push(el);
          });
          this.loading.spinning = false;
        }
      });
    },
    handleScroll() {
      // eslint-disable-next-line
      let scrollTop = document.getElementById('Page-WaterDataQuery').getElementsByClassName('ant-table-body')[0].scrollTop;
      this.scrollTop = scrollTop;
    },
    onChange() {},
    // onChange(date, dateString) {
    //   console.log(date, dateString);
    // },
    // 开始日期限制
    disabledFromDate(current) {
      return current && current > moment().endOf('day');
    },
    // 结束日期限制
    disabledEndDate(current) {
      return current && current > moment().endOf('day');
    },
    // 日期范围限制
    disabledDate(current) {
      if (this.temDate.length !== 0) {
        return current < this.temDate[0] || current > this.temDate[1] || current > moment();
      }
      return current > moment();
    },
    // 日期选择器日历弹出事件
    openChange() {
      this.temDate = [];
    },
    changeDate(date) {
      let startTime = date[0];
      let endTime = date[0];
      startTime = startTime.format('YYYY-MM-DD');
      startTime = moment(startTime);
      endTime = endTime.format('YYYY-MM-DD');
      endTime = moment(endTime);
      startTime.startOf('day').subtract(1, 'months');
      endTime.endOf('day').add(1, 'months');
      this.temDate[0] = startTime;
      this.temDate[1] = endTime;
    },
    // 转换报警类型
    swtichType(val) {
      switch (val) {
        case 'HO':
          return '小时超标';
        case 'DO':
          return '日超标';
        case 'A':
          return '其他报警';
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss">
  .PoliceContent-class{
    >.ant-card-body{
      position: relative;
      .default{
        .left{
          padding: 10px 0;
          .back-class{
            .anticon{
              margin-right: 5px;
            }
            span{
              font-weight: bold;
            }
          }
        }
      }
    }
    .dynamic-table{
      .ant-table-content{
        .ant-table-placeholder{
          .ant-empty{
            min-height: 410px;
            line-height: 410px;
            margin: 0;
          }
        }
        .ant-table-tbody > tr > td,th{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .timeS{
    >.ant-form-item-control-wrapper{
      width: 43%;
    }
  }
</style>

<style lang="scss" scoped>

</style>
