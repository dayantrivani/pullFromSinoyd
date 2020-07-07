<template>
  <!-- 监理任务一览 -->
  <container class="SupervisionTasks">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>
      <!-- 操作按钮 -->
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="plus" @click="onAddClick" class="mar-l-0">新 增</a-button>
        </div>
      </template>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-input
              ref="input"
              :allowClear="true"
              v-model="queryForm.key"
              @keyup.enter="onQueryList()"
              style="width: 240px"
              placeholder="请输入任务名称/编号/企业名称"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-select
              style="width: 160px"
              v-model="queryForm.type"
              :allowClear="true"
              placeholder="请选择任务类型"
            >
              <a-select-option value="1">例行任务</a-select-option>
              <a-select-option value="2">协同任务</a-select-option>
              <a-select-option value="3">督办任务</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-date-picker
              style="width: 150px;"
              v-model="queryForm.beginDate"
              placeholder="请选择开始日期"
              :disabledDate="disabledFromDate"
              :allowClear="true"
            />~
            <a-date-picker
              style="width: 150px;"
              v-model="queryForm.endDate"
              placeholder="请选择结束日期"
              :disabledDate="disabledEndDate"
              :allowClear="true"
            />
          </a-form-item>
          <a-form-item>
            <a-select
              style="width: 160px"
              v-model="queryForm.status"
              :allowClear="true"
              placeholder="请选择任务状态"
            >
              <a-select-option value="0">已创建</a-select-option>
              <a-select-option value="10">工作中</a-select-option>
              <a-select-option value="20">已提交</a-select-option>
              <a-select-option value="30">已关闭</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select
              style="width: 140px"
              v-model="queryForm.isOver"
              :allowClear="true"
              placeholder="请选择超标状态"
            >
              <a-select-option value="true">超标</a-select-option>
              <a-select-option value="false">未超标</a-select-option>
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
    <a-card :bordered="false">
      <!-- 列表 -->
      <a-table
        class="mar-t-table"
        rowKey="id"
        size="middle"
        :loading="loading"
        :columns="columns"
        :dataSource="itemList"
        :pagination="pagination"
        @change="_change"
      >
        <template slot="taskSlot" slot-scope="text, record">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ record.name }}#{{ record.sn }}</span>
            </template>
            <img v-if="record.type === 3" :src="taskFlag" />
            <span>{{ record.name }}#{{ record.sn }}</span>
          </a-tooltip>
        </template>
        <template slot="stationName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="companyName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="isOver" slot-scope="text">
          <status :type="text?'danger' : 'success'">
            <template>{{text? '超标' : '未超标'}}</template>
          </status>
        </template>
        <template slot="statusSlot" slot-scope="text">
          <!-- <a-tag :color="text === 0 ? '#faad14' : text === 10 ? '#3399ff' : text === 20 ? '#52c41a' : ''">
            {{text === 0 ? '已创建' : text === 10 ? '工作中' : text === 20 ? '已提交' : '已关闭'}}
          </a-tag>-->
          <status
            :type="text === 0 ? 'warning' : text === 10 ? 'primary' : text === 20 ? 'success' : 'info'"
          >
            <template>{{text === 0 ? '已创建' : text === 10 ? '工作中' : text === 20 ? '已提交' : '已关闭'}}</template>
          </status>
        </template>
        <template slot="dateSlot" slot-scope="text, record">
          <span :style="{ color: record.flag ? '#f5222d' : '' }">{{text}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <a @click="onDeatailClick(record)"><a-icon type="zoom-in"/>详情</a> -->
          <a-button type="primary" @click="onDeatailClick(record)" title="详情">
            <a-icon type="snippets" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
      <DialogForm ref="dialogForm" @refreshList="onQueryList"></DialogForm>
      <DialogDetail ref="dialogDetail" @refreshList="onQueryList"></DialogDetail>
    </a-card>
  </container>
</template>

<script>
import moment from 'moment';
import { emptyQuery, getList } from '@/api/modules/supervision-tasks.js';
import { queryTest } from '@/mixins'; // 公用接口请求方式
import DialogForm from './components/DialogForm';
import DialogDetail from './components/DialogDetail';
import taskFlag from '@/assets/img/task-flag.png';

export default {
  name: 'SupervisionTasks',
  mixins: [queryTest],
  components: {
    DialogForm,
    DialogDetail,
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      taskFlag,
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
          title: '任务名称（编号）',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          scopedSlots: { customRender: 'taskSlot' },
        },
        {
          title: '站点名称',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 180,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '企业名称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 180,
          scopedSlots: { customRender: 'companyName' },
        },
        {
          title: '是否超标',
          dataIndex: 'isOver',
          key: 'isOver',
          width: 80,
          scopedSlots: { customRender: 'isOver' },
        },
        {
          title: '任务状态',
          dataIndex: 'status',
          key: 'status',
          width: 80,
          scopedSlots: { customRender: 'statusSlot' },
        },
        {
          title: '任务完成日期',
          dataIndex: 'finishedAt',
          key: 'finishedAt',
          width: 80,
          scopedSlots: { customRender: 'dateSlot' },
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
      getList,
    };
  },
  methods: {
    // 新增任务
    onAddClick() {
      this.$refs.dialogForm.openDialog();
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
    // 点击查看详情事件
    onDeatailClick(row) {
      this.$refs.dialogDetail.openDialog(row);
    },
  },
  created() {
    this.getItemList();
  },
};
</script>

<style lang="scss" scoped>
</style>
