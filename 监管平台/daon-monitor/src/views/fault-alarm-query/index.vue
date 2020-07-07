<template>
<!-- 故障报警查询 -->
  <container class="FaultAlarmQuery">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="upload" @click="onExport" class="mar-l-0">导 出</a-button>
        </div>
      </template>
      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-select
              @change="changeCompany"
              style="width: 150px"
              v-model="queryForm.companyId"
              :allowClear="true"
              placeholder="请选择企业">
              <a-select-option v-for="item in companyData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 150px" v-model="queryForm.stationId" :allowClear="true" placeholder="请选择站点">
              <a-select-option v-for="item in stationData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="timeS">
            <a-date-picker
              v-model="queryForm.beginDate"
              style="width: 150px;"
              format="YYYY-MM-DD"
              placeholder="请选择开始日期"
              :disabledDate="disabledFromDate"
              :allowClear="true"/>
            ~
            <a-date-picker
              v-model="queryForm.endDate"
              style="width: 150px;"
              format="YYYY-MM-DD"
              placeholder="请选择结束日期"
              :disabledDate="disabledEndDate"
              :allowClear="true"/>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 150px" v-model="queryForm.status" :allowClear="true" placeholder="请选择处理状态">
              <a-select-option v-for="item in statusData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="plain" @click="onQueryList" title="查询">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-form-item>
          <!-- <a-form-item class="mar-r-0">
            <a-button type="primary" icon="upload" @click="onExport">导 出</a-button>
          </a-form-item> -->
        </a-form>
      </template>
    </search-extend>
    <a-card :bordered="false">

      <!-- 列表 -->
      <a-table
        class="mar-t-table"
        rowKey="id"
        size="middle"
        :loading='loading'
        :columns='columns'
        :dataSource='itemList'
        :pagination="pagination"
        @change="_change"
      >
        <template slot="message" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="stationNameSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="partnerName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="corpName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <a @click="onDetailsClick(record)">详情</a> -->
          <a-button type="primary" @click="onDetailsClick(record)" title="详情">
            <a-icon type="snippets" theme="filled"></a-icon>
          </a-button>
        </template>
        <template slot="status" slot-scope="text">
          <!-- <a-tag :color="changeText(text)[1]">{{changeText(text)[0]}}</a-tag> -->
          <status :type="changeText(text)[1]">
            <template>{{changeText(text)[0]}}</template>
          </status>
        </template>
      </a-table>
    </a-card>
    <detail-dailog ref="detailDailog"/>
  </container>
</template>

<script>
import moment from 'moment';
import {
  emptyQuery, getList, exportFile, getStation,
} from '@/api/modules/fault-alarm-query.js';
import { getCompanyList } from '@/api/modules/enter-management.js';
import { queryTest } from '@/mixins';
import detailDailog from './components/detailDailog';

export default {
  name: 'FaultAlarmQuery',
  mixins: [queryTest],
  components: {
    detailDailog,
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      queryForm: emptyQuery(),
      itemList: [],
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '警报信息',
          dataIndex: 'message',
          key: 'message',
          width: 200,
          scopedSlots: { customRender: 'message' },
        },
        {
          title: '发生站点',
          dataIndex: 'stationName',
          key: 'stationName',
          scopedSlots: { customRender: 'stationNameSlot' },
        },
        {
          title: '报警企业',
          dataIndex: 'partnerName',
          key: 'partnerName',
          scopedSlots: { customRender: 'partnerName' },
        },
        {
          title: '运维企业',
          dataIndex: 'corpName',
          key: 'corpName',
          scopedSlots: { customRender: 'corpName' },
        },
        {
          title: '首次报警时间',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          width: 150,
        },
        {
          title: '处理时间',
          dataIndex: 'fixedAt',
          key: 'fixedAt',
          width: 160,
        },
        {
          title: '报警状态',
          dataIndex: 'status',
          key: 'status',
          width: 160,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      statusData: [
        { id: '0', name: '待处理' },
        { id: '1', name: '处理中' },
        { id: '2', name: '已处理' },
        { id: '-1', name: '不处理' },
      ],
      companyData: [],
      stationData: [],
      getList,
    };
  },
  created() {
    this.getItemList();
    getCompanyList({ rows: 2147483647 }).then((res) => {
      if (res.data.code === 200 && res.data.success) {
        this.companyData = res.data.data;
      }
    });
  },
  methods: {
    changeCompany(val) {
      if (val) {
        getStation({ rows: 2147483647, companyId: val }).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            this.stationData = res.data.data;
          }
        });
      } else {
        this.stationData = [];
      }
    },
    // 导出事件
    onExport() {
      /* eslint-disable */
      const params = { ...this.queryForm };
      // eslint-disable-next-line no-unused-expressions
      params.beginDate = params.beginDate ? params.beginDate.format('YYYY-MM-DD') : null,
      params.endDate = params.endDate ? params.endDate.format('YYYY-MM-DD') : null,
      exportFile(params).then((response) => {
        this.downloadFn(response, '故障报警.xls');
      });
    },
    /* eslint-disable */
    downloadFn(res, name) {
      if (res.headers.success) {
        // IE 浏览器：a标签的download属性不支持IE，使用微软自带的 msSaveBlob 方法
        // 其他浏览器：创建a标签 ，添加download属性，模拟鼠标点击事件
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        // const filename = res.headers['content-disposition'].split(';')[1].replace('filename=', '');
        if (window.navigator.msSaveBlob) {   // 兼容ie
          try {
            window.navigator.msSaveBlob(blob, name);
          } catch (e) {
            return e;
          }
        } else {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
        }
      } else {
        this.$message.error('当前文件不存在，请联系管理员');
      }
    },
    // 转换状态
    changeText(val) {
      switch (val) {
        case 0:
          return ['待处理', 'primary'];
        case 1:
          return ['处理中', 'warning'];
        case 2:
          return ['已处理', 'success'];
        case -1:
          return ['不处理', 'danger'];
        default:
          return [];
      }
    },
    // 开始日期限制
    disabledFromDate(current) {
      if (!current || !this.queryForm.endDate) {
        return current > moment().endOf('day');
      }
      const endValue = this.queryForm.endDate.format('YYYY-MM-DD 00:00:00');
      const currentDate = current.format('YYYY-MM-DD 00:00:00');
      return currentDate.valueOf() > endValue.valueOf() || moment(currentDate).valueOf() > moment().endOf('day').valueOf();
    },
    // 结束日期限制
    disabledEndDate(current) {
      if (!current || !this.queryForm.beginDate) {
        return current > moment().endOf('day');
      }
      const beginValue = this.queryForm.beginDate.format('YYYY-MM-DD 00:00:00');
      const currentDate = current.format('YYYY-MM-DD 00:00:00');
      return currentDate.valueOf() < beginValue.valueOf() || moment(currentDate).valueOf() > moment().endOf('day').valueOf();
    },
    // 详情点击事件
    onDetailsClick(row) {
      this.$refs.detailDailog.openDialog(row);
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
  },
};
</script>

<style lang="scss">
  .timeS{
    // margin-right: 30px!important;
    >.ant-form-item-control-wrapper{
      width: 43%;
    }
  }
</style>

<style lang="scss" scoped>
</style>
