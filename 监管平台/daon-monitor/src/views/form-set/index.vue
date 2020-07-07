<template>
  <div class="form_container">
    <container class="FormSet" v-show="!isShow">
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
            <a-form-item class="mar-r-0">
              <a-input-search
                v-model="queryForm.name"
                style="width: 220px"
                @search="onQueryList"
                placeholder="请输入表单名称" allowClear>
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
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :pagination="pagination"
          @change="_change"
        >
          <template slot="updatedAtSlot" slot-scope="text">
            {{text.split(' ')[0]}}
          </template>
          <template slot="operation" slot-scope="text, record">
            <!-- <a @click="onEditClick(record)"><a-icon type="edit"></a-icon> 编辑</a> -->
            <a-button type="primary" @click="onEditClick(record)" title="编辑">
              <a-icon type="edit" theme="filled"></a-icon>
            </a-button>
          </template>
        </a-table>
        <!-- <DialogForm ref="dialog" @refreshList="getItemList"></DialogForm> -->
      </a-card>
    </container>
    <form-page ref="formPage" v-if="isShow" @swtichType="swtichType"/>
  </div>
</template>

<script>
import FormPage from './components/form_edit';
import { queryTest } from '@/mixins';
import { getList, emptyQuery, remove } from '@/api/modules/form-set.js';

export default {
  name: 'FormSet',
  mixins: [queryTest],
  components: { FormPage },
  data() {
    return {
      isShow: false,
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      scopeData: [
        {
          id: '1',
          name: '通用',
        },
        {
          id: '2',
          name: '运维任务',
        },
        {
          id: '3',
          name: '审批流程',
        },
      ],
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
          title: '表单名称',
          dataIndex: 'name',
          key: 'name',
          width: 250,
        },
        {
          title: '字段量',
          dataIndex: 'fieldsCount',
          key: 'fieldsCount',
          scopedSlots: { customRender: 'fieldsCount' },
          width: 80,
        },
        {
          title: '引用方案项',
          dataIndex: 'plan_num',
          key: 'plan_num',
          width: 100,
        },
        {
          title: '表单说明',
          dataIndex: 'comment',
          key: 'comment',
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 100,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 100,
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
      selectedRowKeys: [],
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
              this.$message.success('删除成功', 1.5);
            } else {
              this.$message.warning(response.data.message || response.data.msg, 1.5);
            }
            this.selectedRowKeys = [];
            this.getItemList();
          });
        },
      });
    },
    // 新增事件
    onAddClick() {
      this.swtichType(true);
      this.$nextTick(() => {
        this.$refs.formPage.toEnter();
        this.$refs.formPage.id = '';
      });
    },
    swtichType(type) {
      this.isShow = type;
      if (!type) {
        this.getItemList();
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
    // 编辑事件
    onEditClick(row) {
      this.swtichType(true);
      this.$nextTick(() => {
        this.$refs.formPage.getOneData(row.id);
      });
    },
  },
  created() {
    this.getItemList();
  },
  beforeCreate() {
    // this.form = this.$form.createForm(this);
  },
};
</script>

<style lang="scss" scoped>
  .form_container{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
