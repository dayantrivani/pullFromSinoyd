<template>
  <a-modal
    class="enter-dialog"
    width="1150px"
    title="运维档案"
    :visible="isVisible"
    :maskClosable="false"
    :footer="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-card :bordered="false">
      <search-extend>
        <!-- 检索表单 -->
        <template v-slot:right>
          <a-form layout="inline">
            <a-form-item label="运维时间：">
              <a-date-picker
                style="width: 130px;"
                v-model="queryForm.fromDate"
                :allowClear="true"/>
              ~
              <a-date-picker
                style="width: 130px;"
                v-model="queryForm.toDate"
                :allowClear="true"/>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
            </a-form-item>
          </a-form>
        </template>
      </search-extend>
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
        <template slot="name" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="partner" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="worked_at" slot-scope="text">
          <span>{{text.split(' ')[0]}}</span>
        </template>
        <!-- <template slot="isOperationSlot" slot-scope="text">
          <a-tag :color="text ? 'blue' : 'red'">{{ text ? '是' : '否'}}</a-tag>
        </template> -->
        <template slot="operation" slot-scope="text, record">
          <a @click="onDetilClick(record)">详情</a>
        </template>
      </a-table>
    </a-card>
    <task-details ref="TaskDetails"/>
  </a-modal>
</template>

<script>
import { emptyDialogForm, getDialogList } from '@/api/modules/operat-records.js';
import TaskDetails from '@/components/locally/TaskDetails';
import { queryTest } from '@/mixins';

export default {
  name: 'detailDailog',
  mixins: [queryTest],
  components: {
    TaskDetails,
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      isVisible: false,           // 弹框显示隐藏
      queryForm: emptyDialogForm(),
      getList: getDialogList,
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
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          width: 200,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '企业名称',
          dataIndex: 'partner.name',
          key: 'partner.name',
          width: 200,
          scopedSlots: { customRender: 'partner' },
        },
        {
          title: '任务状态',
          dataIndex: 'status_text',
          key: 'status_text',
          width: 200,
          scopedSlots: { customRender: 'status_text' },
        },
        {
          title: '运维日期',
          dataIndex: 'worked_at',
          key: 'worked_at',
          width: 200,
          scopedSlots: { customRender: 'worked_at' },
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
    };
  },
  methods: {
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    openDialog(row) {
      if (row) {
        this.queryForm.creditCode = row.creditCode;
        this.getItemList();
      }
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.queryForm = emptyDialogForm();
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.queryForm.rows = 10;
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
    // 详情点击事件
    onDetilClick(row) {
      this.$refs.TaskDetails.openDialog(row);
    },
  },
};
</script>

<style lang="scss" scoped>
  .card-class{
    display: inline-block;
    >.ant-card-body{
      .ant-card-grid{
        padding: 12px!important;
        width:100%;
      }
    }
  }
  .click-class{
    text-decoration: underline;
  }
</style>
