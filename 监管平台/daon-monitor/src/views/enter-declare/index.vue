<template>
  <container class="Page-EnterDeclare">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-date-picker
              :allowClear="true"
              style="width: 150px"
              format="YYYY-MM-DD"
              placeholder="请选择开始日期"
              @change="changeStartDate">
            </a-date-picker>
          </a-form-item>
          <a-form-item>
            <a-date-picker
              :allowClear="true"
              style="width: 150px"
              format="YYYY-MM-DD"
              placeholder="请选择结束日期"
              @change="changeEndDate">
            </a-date-picker>
          </a-form-item>
          <a-form-item>
            <a-select placeholder="请选择运行状态" v-model="queryForm.runStatus" style="width: 150px">
              <a-select-option v-for="item in runStatusData" :key="item.id" :value="item.id">
                <status :type="item.id === 1 ? 'danger' : item.id === 3 ? 'info' : item.id === 2 ? 'warning' : ''">
                  {{ item.name }}
                </status>
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select placeholder="请选择审核状态" v-model="queryForm.status" style="width: 150px">
              <a-select-option v-for="item in statusData" :key="item.id" :value="item.id">
                <status :type="item.id === 1 ? 'primary' : item.id === 3 ? 'success' : item.id === 2 ? 'danger' : ''">
                  {{ item.name }}
                </status>
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
        <template slot="nameSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="portName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="runStatusSlot" slot-scope="text, record">
          <status :type="text === 1 ? 'danger' : text === 3 ? 'info' : text === 2 ? 'warning' : ''">
            {{ $enum.RUN_STATUS[record.runStatus] || '-'}}
          </status>
        </template>
        <template slot="statusSlot" slot-scope="text, record">
          <status :type="text === 1 ? 'primary' : text === 3 ? 'success' : text === 2 ? 'danger' : ''">
            <template>{{$enum.CHECK_STATUS[record.status] || '-'}}</template>
          </status>
        </template>
        <template slot="operation" slot-scope="text, record">
          <i @click="onEditClick(record)">
            <icon name="icon-shenhebtn" customClass="iconClass" size="14px"></icon>
          </i>
        </template>
      </a-table>
      <DialogForm ref="dialogForm" @refreshList="getItemList"></DialogForm>
    </a-card>
  </container>
</template>

<script>
import DialogForm from './components/DialogForm';
import { emptyQuery, getList } from '@/api/modules/enter-declare.js';
import { queryTest } from '@/mixins';

export default {
  name: 'EnterDeclare',
  mixins: [queryTest],
  components: {
    DialogForm,
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      runStatusData: [
        { id: 1, name: '停产' },
        { id: 2, name: '检修' },
        { id: 3, name: '停运' },
      ],
      statusData: [
        { id: 1, name: '待审核' },
        { id: 2, name: '不通过' },
        { id: 3, name: '通过' },
      ],
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
          title: '企业名称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          scopedSlots: { customRender: 'nameSlot' },
        },
        {
          title: '站点名称',
          dataIndex: 'portName',
          key: 'portName',
          width: 200,
          scopedSlots: { customRender: 'portName' },
        },
        {
          title: '运行状态',
          dataIndex: 'runStatus',
          key: 'runStatus',
          scopedSlots: { customRender: 'runStatusSlot' },
        },
        {
          title: '开始时间',
          dataIndex: 'beginAt',
          key: 'beginAt',
          width: 180,
        },
        {
          title: '结束时间',
          dataIndex: 'endAt',
          key: 'endAt',
          width: 180,
        },
        {
          title: '申报日期',
          dataIndex: 'reportedAt',
          key: 'reportedAt',
          width: 180,
        },
        {
          title: '审核状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'statusSlot' },
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
      itemList: [],
      queryForm: emptyQuery(),
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
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    // 编辑事件
    onEditClick(row) {
      this.$refs.dialogForm.openDialog(row);
    },
    changeStartDate(val) {
      this.queryForm.fromDate = val;
    },
    changeEndDate(val) {
      this.queryForm.toDate = val;
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
  },
  created() {
    this.getItemList();
  },
};
</script>

<style lang="scss">
.iconClass{
  color: #fff;
  background: #0A98DE;
  border-radius: 5px;
  height: 22px;
  width: 26px;
  cursor: pointer;
  >svg{
    top: 2px!important;
  }
}
</style>
