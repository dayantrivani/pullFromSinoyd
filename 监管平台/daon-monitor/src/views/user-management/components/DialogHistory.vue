<template>
  <a-modal
    class="history-dialog"
    width="50%"
    :visible="isVisible"
    title="历史记录"
    :maskClosable="false"
    :footer="false"
    @cancel="closeDialog">
    <a-card :bordered="false">
      <search-extend>
        <!-- 检索表单 -->
        <template v-slot:right>
          <a-form layout="inline">
            <a-form-item label="日期：">
              <a-date-picker
                style="width: 130px;"
                v-model="queryForm.beginDate"
                :allowClear="true"
                @change="changeDate"/>
              ~
              <a-date-picker
                style="width: 130px;"
                v-model="queryForm.endDate"
                :allowClear="true"
                @change="changeDate"/>
            </a-form-item>
            <a-form-item class="mar-r-0">
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
        :scroll="queryForm.rows > 10 ? { y: 465 } : {}"
        :pagination="pagination"
        @change="_change"
      >
        <template slot="statusSlot" slot-scope="text">
          <a-tag :color="text === 1 ? '#F5222D' : '#87d068'" style="height: 21px;">
            {{ text === 1 ? '拒绝' : '通过'}}
          </a-tag>
        </template>
      </a-table>
    </a-card>
  </a-modal>
</template>

<script>
import { historyQuery, getHistoryList } from '@/api/modules/user-management.js';
import { queryTest } from '@/mixins';

export default {
  name: '',
  components: {},
  mixins: [queryTest],
  data() {
    return {
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
          width: 50,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          key: 'userName',
          width: 120,
          scopedSlots: { customRender: 'nameSlot' },
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone',
          width: 120,
        },
        {
          title: '申请时间',
          dataIndex: 'operatedAt',
          key: 'operatedAt',
          width: 120,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 120,
          scopedSlots: { customRender: 'statusSlot' },
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
      isVisible: false,
      itemList: [],
      queryForm: historyQuery(),
      getList: getHistoryList,
    };
  },
  methods: {
    // 日期改变，判断开始日期是否大于结束日期，若是，二者交换
    changeDate() {
      if (this.queryForm.beginDate && this.queryForm.endDate) {
        if (this.queryForm.beginDate.valueOf() > this.queryForm.endDate.valueOf()) {
          const tem = this.queryForm.beginDate;
          this.queryForm.beginDate = this.queryForm.endDate;
          this.queryForm.endDate = tem;
        }
      }
    },
    // 弹框显示
    openDialog() {
      this.isVisible = true;
      this.getItemList();
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.queryForm = historyQuery();
      this.pagination.defaultPageSize = 10;
    },
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.getItemList();
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
  },
  created() {},
};
</script>
<style lang="scss">
  .history-dialog{
    top: 5vh;
    .ant-modal-content{
      .ant-modal-body{
        padding: 0;
        height: 81vh;
        overflow-y: auto;
      }
    }
  }
</style>
