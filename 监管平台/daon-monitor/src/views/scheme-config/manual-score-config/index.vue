<template>
  <container class="Page-ManualScoreConfig">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 操作按钮 -->
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="plus" @click="onAddClick" class="mar-l-0"> 新 增</a-button>
        </div>
      </template>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item class="mar-r-0">
            <a-input-search
              allowClear
              ref="input"
              v-model="queryForm.ruleName"
              @search="onQueryList"
              style="width: 220px" placeholder="请输入规则名称">
              <a-icon slot="prefix" type="search"></a-icon>
              <a-button slot="enterButton" title="查询">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-input-search>
          </a-form-item>
          <!-- <a-form-item class="mar-r-0">
            <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
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
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="onEditClick(record)" title="编辑">
            <a-icon type="edit" theme="filled"></a-icon>
          </a-button>
          <a-button type="danger" @click="onRemoveClick(record)" title="删除">
            <a-icon type="delete" theme="filled"></a-icon>
          </a-button>
          <!-- <a style="margin-left:10px;color:red;" @click="onRemoveClick(record)"><a-icon type="delete"></a-icon> 删除</a> -->
        </template>
      </a-table>
      <a-modal
        :visible="isVisible"
        :title="`${row.id ? '编辑' : '新增'}手动计分规则`"
        @cancel="closeDialog"
        :maskClosable="false"
        :centered="true"
      >
        <a-spin :spinning="spinning">
          <a-form :form="form">
            <a-form-item label="手动计分规则名称：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-input v-decorator="[
                'ruleName',
                {
                  rules: [
                    {required: true, message: '请输入规则名称！',}
                  ],
                }
              ]" />
            </a-form-item>
            <a-form-item label="说明：" :labelCol="{span:7}" :wrapperCol="{span:17}">
              <a-input v-decorator="[
                'remark',
              ]" />
            </a-form-item>
          </a-form>
        </a-spin>
        <div slot="footer">
          <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
          <a-button icon="close" @click="closeDialog">关 闭</a-button>
        </div>
      </a-modal>
    </a-card>
  </container>
</template>

<script>
import { queryTest } from '@/mixins';
import {
  emptyQuery, getList, emptyForm, getOne, create, update, remove,
} from '@/api/modules/manual-score-config.js';

export default {
  name: 'ManualScoreConfig',
  mixins: [queryTest],
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      spinning: false,
      isVisible: false,
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
          title: '手动计分规则名称',
          dataIndex: 'ruleName',
          key: 'ruleName',
        },
        {
          title: '说明',
          dataIndex: 'remark',
          key: 'remark',
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
      row: {},
      itemModel: emptyForm(),
    };
  },
  methods: {
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    // 弹框显示
    openDialog(row) {
      if (row) {
        this.row = row;
        this.spinning = true;
        getOne(row.id).then((response) => {
          this.setOneData(response.data.data);
          this.spinning = false;
        });
      }
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.itemModel = emptyForm();
      this.form.resetFields();
    },
    // 表单项赋值
    setOneData(data) {
      this.form.setFieldsValue({
        'ruleName': data.ruleName,
        'remark': data.remark,
      });
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'ruleName': fieldsValue.ruleName,
          'remark': fieldsValue.remark,
        };
        Object.assign(this.itemModel, setValue);
        if (err) {
          return;
        }
        const saveMethod = this.row ? update : create;
        saveMethod(this.itemModel, this.row).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeDialog();
            // this.$emit('refreshList');
            this.getItemList();
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
    // 新增事件
    onAddClick() {
      this.openDialog();
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
      this.openDialog(row);
    },
    // 删除事件
    onRemoveClick(row) {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的规则吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          remove(row.id).then((response) => {
            if (response.data.code === 200) {
              this.$message.success('删除成功', 3);
            } else {
              this.$message.warning(response.data.message || response.data.msg, 3);
            }
            this.getItemList();
          });
        },
      });
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

<style>

</style>
