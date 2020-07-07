/* eslint-disable no-sequences */
<template>
<!-- 真实超标管理 -->
  <container class="RealStandManage">
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
              placeholder="请输入企业名称">
              <a-select-option v-for="item in companyData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 150px" v-model="queryForm.stationId" :allowClear="true" placeholder="请输入站点名称">
              <a-select-option v-for="item in stationData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="timeS">
            <a-date-picker
              style="width: 150px;"
              v-model="queryForm.beginDate"
              placeholder="请选择开始日期"
              :disabledDate="disabledFromDate"
              :allowClear="true"/>
            ~
            <a-date-picker
              style="width: 150px;"
              v-model="queryForm.endDate"
              placeholder="请选择结束日期"
              :disabledDate="disabledEndDate"
              :allowClear="true"/>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 150px" v-model="queryForm.status" :allowClear="true" placeholder="请选择运维状态">
              <a-select-option v-for="item in verifyData" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 180px" v-model="queryForm.verifyStatus" :allowClear="true" placeholder="请选择大队处理状态">
              <a-select-option value="1">已处理</a-select-option>
              <a-select-option value="0">未处理</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="plain" @click="onQueryList">
              <a-icon type="search">查询</a-icon>
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
        <template slot="messageSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="stationName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span style="width: 100px">{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="partnerName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span style="width: 100px">{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="corpName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span style="width: 100px">{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="status" slot-scope="text">
          <!-- <a-tag :color="swtichColor(text)">{{swtichStatus(text)}}</a-tag> -->
          <status :type="swtichColor(text)">
            <template>{{swtichStatus(text)}}</template>
          </status>
        </template>
        <template slot="verifyStatus" slot-scope="text">
          <!-- <a-tag :color="text === 1 ? '#87d068' : '#F5222D'">{{text === 1 ? '已处理' : '未处理'}}</a-tag> -->
          <status :type="text ? 'success' : 'danger'">
            <template>{{text ? '已处理' : '未处理'}}</template>
          </status>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <a :class="{'noallow-class' : record.verifyStatus}" @click="onConfirm(record)">大队确认</a> -->
          <a-button :class="{'noallow-class' : record.verifyStatus}" type="primary" @click="onConfirm(record)" title="大队确认">
            <a-icon type="highlight" theme="filled"></a-icon>
          </a-button>
          <!-- <a style="marginLeft: 10px" @click="onEditClick(record)">详情</a> -->
          <a-button type="primary" @click="onEditClick(record)" title="详情">
            <a-icon type="snippets" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
    </a-card>
    <confirm-dialog ref="confirmDialog" @getItemList="getItemList"/>
    <detail-dailog ref="detailDailog"/>
  </container>
</template>

<script>
import moment from 'moment';
import { emptyQuery, getList, exportFile } from '@/api/modules/real-stand-manage.js';
import { getCompanyList } from '@/api/modules/enter-management.js';
import { getStation } from '@/api/modules/fault-alarm-query.js';
import { queryTest } from '@/mixins';
import detailDailog from './components/detailDailog';
import confirmDialog from './components/confirmDialog';

export default {
  name: 'RealStandManage',
  mixins: [queryTest],
  components: {
    detailDailog,
    confirmDialog,
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
          width: 120,
          scopedSlots: { customRender: 'messageSlot' },
        },
        {
          title: '发生站点',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 120,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '报警企业',
          dataIndex: 'partnerName',
          key: 'partnerName',
          width: 120,
          scopedSlots: { customRender: 'partnerName' },
        },
        {
          title: '运维企业',
          dataIndex: 'corpName',
          key: 'corpName',
          width: 120,
          scopedSlots: { customRender: 'corpName' },
        },
        {
          title: '首次报警时间',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          width: 80,
        },
        {
          title: '处理时间',
          dataIndex: 'fixedAt',
          key: 'fixedAt',
          width: 80,
        },
        {
          title: '运维状态',
          dataIndex: 'status',
          key: 'status',
          // width: 80,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '大队处理状态',
          dataIndex: 'verifyStatus',
          key: 'verifyStatus',
          // width: 80,
          scopedSlots: { customRender: 'verifyStatus' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      selectedRowKeys: [],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      verifyData: [
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
    // 切换企业事件
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
      const params = { ...this.queryForm };
      /* eslint-disable */
      // eslint-disable-next-line no-unused-expressions
      params.beginDate = params.beginDate ? params.beginDate.format('YYYY-MM-DD') : null,
      params.endDate = params.endDate ? params.endDate.format('YYYY-MM-DD') : null,
      exportFile(params).then((response) => {
        this.downloadFn(response, '真实超标.xls');
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
    // 转换类型
    swtichStatus(val) {
      switch (val) {
        case 0:
          return '待处理';
        case 1:
          return '处理中';
        case 2:
          return '已处理';
        case -1:
          return '不处理';
        default:
          return '';
      }
    },
    // 颜色转换
    swtichColor(val) {
      switch (val) {
        case 0:
          return 'primary';
        case 1:
          return 'warning';
        case 2:
          return 'success';
        case -1:
          return 'danger';
        default:
          return 'primary';
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
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
    // 大队确认事件
    onConfirm(row) {
      if (row.verifyStatus) return;
      this.$refs.confirmDialog.openDialog(row);
    },
    // 详情点击事件
    onEditClick(row) {
      this.$refs.detailDailog.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
  // .timeS{
  //   margin-right: 32px;
  // }
  .noallow-class{
    color: #B9B9BC;
    cursor: not-allowed;
  }
</style>
