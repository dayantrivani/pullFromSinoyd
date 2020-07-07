<template>
  <!-- 异常日志推送 -->
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
              placeholder="请选择开始时间"
              @change="changeStartDate">
            </a-date-picker>
            ~
            <a-date-picker
              :allowClear="true"
              style="width: 150px"
              format="YYYY-MM-DD"
              placeholder="请选择结束时间"
              @change="changeEndDate">
            </a-date-picker>
          </a-form-item>
          <a-form-item>
            <select-enum v-model="queryForm.status" placeholder="请选择推送状态" type="PUSH_STATE" min-width="150px" />
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-input-search
              v-model="queryForm.content"
              :allowClear="true"
              @search="onQueryList"
              style="width: 220px"
              placeholder="请输入报警内容">
              <a-icon slot="prefix" type="search"></a-icon>
              <a-button slot="enterButton" title="查询">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-input-search>
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
        :scroll="{ x: 2060 }"
        :columns='columns'
        :dataSource='itemList'
        :pagination="pagination"
        @change="_change"
      >
        <template slot="partnerName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="type" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="content" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="message" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="data" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="status" slot-scope="text">
          <!-- <a-tag :color="text === 1 ? '#87d068' : '#F5222D'">
            {{text === 1 ? '成功' : '失败'}}
          </a-tag> -->
          <status :type="text === 1 ? 'success' : 'danger'">
            <template>{{text === 1 ? '成功' : '失败'}}</template>
          </status>
        </template>
      </a-table>
    </a-card>
  </container>
</template>

<script>
import { emptyQuery, getList } from '@/api/modules/exception-log-push.js';
import { queryTest } from '@/mixins';

export default {
  name: 'exceptionLogGPush',
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
          fixed: 'left',
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '污染源企业名称',
          dataIndex: 'partnerName',
          key: 'partnerName',
          width: 200,
          fixed: 'left',
          scopedSlots: { customRender: 'partnerName' },
        },
        {
          title: '污染源企业信用代码',
          dataIndex: 'partnerUscc',
          key: 'partnerUscc',
          scopedSlots: { customRender: 'partnerUscc' },
          width: 200,
        },
        {
          title: '报警时间',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          width: 160,
        },
        {
          title: '报警类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' },
          width: 160,
        },
        {
          title: '推送状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: 100,
        },
        {
          title: '报警内容',
          dataIndex: 'content',
          key: 'content',
          scopedSlots: { customRender: 'content' },
          width: 300,
        },
        {
          title: '推送日志',
          dataIndex: 'message',
          key: 'message',
          scopedSlots: { customRender: 'message' },
          width: 300,
        },
        {
          title: '数据',
          dataIndex: 'data',
          key: 'data',
          scopedSlots: { customRender: 'data' },
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
      this.queryForm.beginDate = val;
    },
    changeEndDate(val) {
      this.queryForm.endDate = val;
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

<style lang="scss" scoped>

</style>
