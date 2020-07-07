<template>
<!-- 运维监管排名明细 -->
  <container class="Page-MaintainRankDetail">

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
              mode="year"
              format="YYYY"
              v-model="queryForm.year"
              placeholder="请选择年份"
              :open="isOpen"
              :allowClear="false"
              @openChange="_openChange"
              @panelChange="_panaelChange"
              style="width:150px">
            </a-date-picker>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-input-search
              v-model="queryForm.key"
              style="width: 240px"
              @search="onQueryList"
              placeholder="请输入运维单位名称" allowClear>
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
        rowKey="corpId"
        size="middle"
        :loading='loading'
        :columns='columns'
        :dataSource='itemList'
        :pagination="pagination"
        @change="_change"
      >
        <template slot="currentRank" slot-scope="txt, record">
          <a-tooltip placement="top">
            <template slot="title">
              <span v-if="record.deltaRank > 0">{{`上升${record.deltaRank}名` }}</span>
              <span v-if="record.deltaRank < 0">{{`下降${Math.abs(record.deltaRank)}名` }}</span>
            </template>
            <span>{{txt}}</span>
            <a-icon
              :style="{color: record.deltaRank > 0 ? 'green' : 'black'}"
              type="arrow-up"
              v-if="record.deltaRank && record.deltaRank > 0"
            />
            <a-icon
              :style="{color: record.deltaRank < 0 ? 'red' : 'black'}"
              type="arrow-down"
              v-if="record.deltaRank && record.deltaRank < 0"
            />
          </a-tooltip>
        </template>
        <template slot="operation" slot-scope="text, record">
          <i @click="onEditClick(record)">
            <icon name="icon-xiangqingchakan" customClass="iconClass" size="14px" topOffset="4px"></icon>
          </i>
        </template>
      </a-table>
      <DialogForm ref="dialog" @refreshList="getItemList"></DialogForm>
    </a-card>
  </container>
</template>

<script>
import DialogForm from './components/DialogForm';
import { queryTest } from '@/mixins';
import { emptyQuery, getList } from '@/api/modules/maintain-company/maintain-rank-detail.js';

export default {
  name: 'MaintainRankDetail',
  mixins: [queryTest],
  components: { DialogForm },
  data() {
    return {
      loading: {
        // spinning: false,
        tip: '数据加载中',
      },
      queryForm: emptyQuery(),
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
          title: '年度',
          dataIndex: 'year',
          key: 'year',
        },
        {
          title: '运维单位名称',
          // dataIndex: 'companyName',
          // key: 'companyName',
          dataIndex: 'corpName',
          key: 'corpName',
        },
        {
          title: '年度得分',
          dataIndex: 'points',
          key: 'points',
          scopedSlots: { customRender: 'points' },
        },
        {
          title: '最新排名',
          dataIndex: 'currentRank',
          key: 'currentRank',
          scopedSlots: { customRender: 'currentRank' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 200,
          align: 'center',
        },
      ],
      itemList: [],
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
      isOpen: false,
    };
  },
  methods: {
    // 日期选择器日历面板显示
    _openChange(val) {
      this.isOpen = val;
    },
    // 选择日期日历面板隐藏
    _panaelChange(val) {
      if (val) {
        this.isOpen = false;
        this.queryForm.year = val;
      }
    },
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
    // 详情点击事件
    onEditClick(row) {
      this.$refs.dialog.openDialog(row);
      // this.$refs.dialog.companyId = row.companyId;
      this.$refs.dialog.corpId = row.corpId;
      // this.$refs.dialog.title = row.companyName;
      this.$refs.dialog.title = row.corpName;
    },
  },
  created() {
    this.getItemList();
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
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
