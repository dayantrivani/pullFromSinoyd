<template>
<!-- 运维记录 -->
  <container class="operat-records">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item class="mar-r-0">
            <a-input-search
              ref="input"
              :allowClear="true"
              v-model="queryForm.name"
              @search="onQueryList"
              style="width: 240px" placeholder="请输入企业名称">
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
        <template slot="address" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="isOperationSlot" slot-scope="text">
          <!-- <a-tag style="height:21px" :color="text ? '#87d068' : '#F5222D'">{{ text ? '是' : '否'}}</a-tag> -->
          <status :type="text ? 'success' : 'danger'">
            <template>{{text ? '是' : '否'}}</template>
          </status>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <a @click="onEditClick(record)">详情</a> -->
          <a-button type="primary" @click="onEditClick(record)" title="详情">
            <a-icon type="snippets" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
    </a-card>
    <detail-dailog ref="detailDailog"/>
  </container>
</template>

<script>
import { emptyQuery, getList } from '@/api/modules/operat-records.js';
import { queryTest } from '@/mixins';
import detailDailog from './components/detailDailog';

export default {
  name: 'OperatRecords',
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
      itemList: [],
      queryForm: emptyQuery(),
      getList,
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
          dataIndex: 'name',
          key: 'name',
          width: 240,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '社会信用代码',
          dataIndex: 'creditCode',
          key: 'creditCode',
          width: 180,
        },
        {
          title: '联系人',
          dataIndex: 'contactName',
          key: 'contactName',
          width: 100,
        },
        {
          title: '电话',
          dataIndex: 'contactPhone',
          key: 'contactPhone',
          width: 120,
        },
        // {
        //   title: '区域',
        //   dataIndex: 'districtName',
        //   key: 'districtName',
        //   width: 100,
        // },
        {
          title: '是否聘用专业运维公司',
          dataIndex: 'isOperation',
          key: 'isOperation',
          width: 120,
          scopedSlots: { customRender: 'isOperationSlot' },
        },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address',
          scopedSlots: { customRender: 'address' },
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
  created() {
    this.getItemList();
  },
  methods: {
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    // 详情点击事件
    onEditClick(row) {
      this.$refs.detailDailog.openDialog(row);
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
  },
};
</script>
