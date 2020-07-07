<template>
  <container class="Page-MaintainAutoScoreConfig">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 操作按钮 -->
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="plus" @click="onAddClick" class="mar-l-0"> 新 增</a-button>
          <a-button type="danger" icon="delete" :disabled="!selectedRowKeys.length" @click="onRemoveClick"> 删 除</a-button>
        </div>
      </template>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-date-picker
              mode="year"
              format="YYYY"
              v-model="queryForm.year"
              placeholder="请选择年份"
              :allowClear="true"
              :open="isOpen"
              @openChange="_openChange"
              @panelChange="_panaelChange"
              style="width:150px">
            </a-date-picker>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-input-search
              v-model="queryForm.key"
              style="width: 270px"
              @search="onQueryList"
              placeholder="请输入规则名称/配置人员" allowClear>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination="pagination"
        @change="_change"
      >
        <template slot="activeSlot" slot-scope="text">
          <status :type="text ? 'success' : 'danger'">
            <template>{{text ? '是' : '否'}}</template>
          </status>
        </template>
        <template slot="updatedAtSlot" slot-scope="text">
          {{text.split(' ')[0]}}
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="onEditClick(record)" title="编辑">
            <a-icon type="edit" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
      <DialogForm ref="dialog" @refreshList="getItemList"></DialogForm>
    </a-card>
  </container>
</template>

<script>
import DialogForm from './components/DialogForm';
import { queryTest } from '@/mixins';
import { emptyQuery, getList } from '@/api/modules/maintain-company/maintain-auto-score-config.js';
import { remove } from '@/api/modules/maintain-company/maintain-auto-score-config.js';

export default {
  name: 'MaintainAutoScoreConfig',
  mixins: [queryTest],
  components: { DialogForm },
  data() {
    return {
      queryForm: emptyQuery(),
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
          title: '自动计分规则名称',
          dataIndex: 'planName',
          key: 'planName',
          width: 180,
        },
        {
          title: '年度',
          dataIndex: 'year',
          key: 'year',
        },
        {
          title: '配置人员',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '配置时间',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          scopedSlots: { customRender: 'updatedAtSlot' },
        },
        {
          title: '是否启用',
          dataIndex: 'isActive',
          key: 'isActive',
          scopedSlots: { customRender: 'activeSlot' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 100,
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
      itemList: [],
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
    // 新增事件
    onAddClick() {
      this.$refs.dialog.openDialog();
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
    // 编辑事件
    onEditClick(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 删除事件
    onRemoveClick() {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的记录吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          remove(this.selectedRowKeys).then((response) => {
            if (response.data.code === 200) {
              this.$message.success('删除成功', 3);
            } else {
              this.$message.warning(response.data.message || response.data.msg, 3);
            }
            this.selectedRowKeys = [];
            this.getItemList();
          });
        },
      });
    },
  },
  created() {
    this.getItemList();
  },
};
</script>

<style>

</style>
