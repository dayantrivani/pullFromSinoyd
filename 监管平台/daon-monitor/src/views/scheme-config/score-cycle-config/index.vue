<template>
  <container class="Page-ScoreCycleConfig">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 操作按钮 -->
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="plus" @click="onAddClick" class="mar-l-0"> 新 增</a-button>
          <span style="margin-left:20px;color:#aaaeb8">
            <a-icon type="exclamation-circle" theme="filled"></a-icon>
            <span style="margin-left:5px">说明：新增、修改只能操作今年及以后，修改当年周期次年生效</span>
          </span>
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
        <template slot="periodSlot" slot-scope="text">
          {{text === 'season' ? '季度' : '月份'}}
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="onEditClick(record)" title="编辑">
            <a-icon type="edit" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
      <a-modal
        :visible="isVisible"
        :title="`${row.id ? '编辑' : '新增'}计分周期`"
        @cancel="closeDialog"
        :maskClosable="false"
        :centered="true"
      >
        <a-spin :spinning="spinning">
          <a-form :form="form">
            <a-form-item label="年度：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-input placeholder="请输入年份" :readOnly="row.id ? true : false" v-decorator="[
                'year',
                {
                  initialValue: initialYear,
                  rules: [
                    {required: true, type: 'number', message: '请输入数字年份！',
                      transform(value) {
                        if(value){
                          return Number(value);
                        }
                      },
                    },
                  ],
                }
              ]" />
            </a-form-item>
            <a-form-item label="计分周期：" :labelCol="{span:4}" :wrapperCol="{span:20}">
              <a-select
                placeholder="请选择"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-decorator="[
                  'period',
                  {
                    rules: [
                      {required: true, message: '请选择周期！',}
                    ],
                  }
                ]">
                <a-select-option v-for="(item, index) in $enum.SCORE_CYCLING" :key="index" :value="item.value">
                  {{item.label}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-spin>
        <div slot="footer">
          <a-button type="primary" icon="save" @click="onSave" v-if="row.id && row.year < initialYear ? false : true">保 存</a-button>
          <a-button icon="close" @click="closeDialog">关 闭</a-button>
        </div>
      </a-modal>
    </a-card>
  </container>
</template>

<script>
import moment from 'moment';
import { queryTest } from '@/mixins';
import {
  emptyQuery, getList, emptyForm, getOne, create, update,
} from '@/api/modules/score-cycle-config.js';

export default {
  name: 'ScoreCycleConfig',
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
          title: '年度',
          dataIndex: 'year',
          key: 'year',
        },
        {
          title: '计分周期',
          dataIndex: 'period',
          key: 'period',
          scopedSlots: { customRender: 'periodSlot' },
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
      row: {},
      itemModel: emptyForm(),
      isOpen: false,
      initialYear: Number(moment().format('l').slice(0, 4)),
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
        'year': data.year,
        'period': data.period,
      });
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'year': fieldsValue.year,
          'period': fieldsValue.period,
        };
        Object.assign(this.itemModel, setValue);
        if (err) {
          return;
        }
        const saveMethod = this.row ? update : create;
        this.$confirm({
          title: '提示',
          content: '计分周期配置一旦生效，不允许修改，是否保存当前计分周期配置信息？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            saveMethod(this.itemModel, this.row).then((response) => {
              if (response.data.code === 200 && response.data.success) {
                this.$message.success(response.data.msg, 3);
                this.closeDialog();
                this.getItemList();
              } else {
                this.$message.warning(response.data.msg, 3);
              }
            });
          },
        });
      });
    },
    // 新增事件
    onAddClick() {
      this.openDialog();
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
