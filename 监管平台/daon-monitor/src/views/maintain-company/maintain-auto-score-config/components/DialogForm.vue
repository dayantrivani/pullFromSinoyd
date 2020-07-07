<template>
  <a-modal
    class="auto_score_modal"
    width="80%"
    title="评分规则设置"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <div class="operations">
        <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
        <a-button icon="close" @click="closeDialog">关 闭</a-button>
      </div>
      <div class="basic-info">
        <div class="basic-title">
          <span class="title">基本信息</span>
          <span class="remark">（注意：每个周期前三天不得修改评分方法）</span>
        </div>
        <a-form layout="inline" :form="form">
          <a-form-item label="自动计分规则名称：" style="margin-left:10px;">
            <a-input v-decorator="[
              'planName',
              {
                rules: [
                  {required: true, message: '请输入评分方法名称！',}
                ],
              }]"></a-input>
          </a-form-item>
          <a-form-item label="是否启用：">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{form.getFieldValue('isActive')===undefined ? '是' : form.getFieldValue('isActive') ? '是' : '否'}}</span>
              </template>
              <a-switch v-decorator="[
                'isActive',
                { valuePropName: 'checked',
                  initialValue: true, }
              ]"></a-switch>
            </a-tooltip>
          </a-form-item>
        </a-form>
      </div>
      <div class="rules-info">
        <div class="rules-title">
          <span class="title">规则详情</span>
        </div>
        <div class="rules-operation" style="margin-left:10px;">
          <a-button type="primary" icon="setting" @click="onConfigClick">规则配置</a-button>
        </div>
        <a-table
          rowKey="pId"
          size="small"
          :columns='columns'
          :dataSource='makeData(itemList)'
          :pagination="false"
        >
        </a-table>
      </div>
      <DialogRule ref="dialogRule" @save="handleForm"></DialogRule>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash';
import {
  emptyForm, create, update, getOne,
} from '@/api/modules/maintain-company/maintain-auto-score-config.js';
import DialogRule from './components/DialogRule';

export default {
  name: '',
  components: { DialogRule },
  data() {
    return {
      itemModel: emptyForm(),
      isVisible: false,
      row: {},
      spinning: false,
      spanArr: [],
      position: 0,
      count: 0,
      columns: [
        {
          title: '打分项名称',
          dataIndex: 'ruleName',
          key: 'ruleName',
          width: 180,
          customRender: (value, row) => {
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.rowSpan = row.rowSpan;
            return obj;
          },
        },
        {
          title: '权重',
          dataIndex: 'totalPoints',
          key: 'totalPoints',
          customRender: (value, row) => {
            const obj = {
              children: value,
              attrs: {},
            };
            obj.attrs.rowSpan = row.rowSpan;
            return obj;
          },
        },
        {
          title: '分值',
          dataIndex: 'minusPoints',
          key: 'minusPoints',
        },
        {
          title: '打分明细',
          dataIndex: 'remark',
          key: 'remark',
        },
      ],
      itemList: [],
      sumRow: {
        ruleName: '合计',
        totalPoints: 0,
      },
    };
  },
  watch: {
    itemList: {
      handler(val) {
        if (val.length !== 0) {
          val.forEach((el, index) => {
            this.$set(el, 'pId', index);
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    // 配置信息转为列表数据
    handleForm(val) {
      if (Object.keys(val) && Object.keys(val).length !== 0) {
        this.itemList = [];
        const temArr = Object.values(val);
        temArr.forEach((el) => {
          el.forEach((ele) => {
            ele.totalPoints = el[0].totalPoints;
            this.itemList.push(ele);
          });
        });
        this.calculateSum(this.itemList);
        this.$set(this.sumRow, 'id', this.itemList[this.itemList.length - 1].id + 1);
        this.itemList.push(this.sumRow);
      } else {
        this.itemList = [];
      }
    },
    // 遍历子元素，并赋值纵向合并数rowSpan
    makeData(data) {
      const sortResult = this.sortData(data);
      const dataSource = [];
      sortResult.forEach((item) => {
        if (item.children) {
          item.children.forEach((itemOne, indexOne) => {
            const myObj = itemOne;
            myObj.rowSpan = indexOne === 0 ? item.span : 0;
            dataSource.push(myObj);
          });
        }
      });
      return dataSource;
    },
    // 去重并合并到children
    sortData(dataArr) {
      const orgArrRe = dataArr.map(item => ({ ruleName: item.ruleName }));
      const orgArr = this.uniqueObjArr(orgArrRe, 'ruleName');// 数组去重
      orgArr.forEach((childOne) => { // 去重reportName合并到children，得到一共有几个不同的reportName要合并
        childOne.children = [];
        dataArr.forEach((childTwo) => {
          if (childOne.ruleName === childTwo.ruleName) { // childOne是去重的，childTwo是没去重的
            childOne.children.push(childTwo);
          }
        });
      });
      orgArr.forEach((every) => {
        every.span = every.children ? every.children.length : 0;
      });
      return orgArr;
    },
    // 对象数组去重
    uniqueObjArr(arr, fieldName) {
      const result = [];
      const resultArr = [];
      arr.forEach((child) => {
        if (result.indexOf(child[fieldName]) === -1) {
          result.push(child[fieldName]);
          resultArr.push(child);
        }
      });
      return resultArr;
    },
    // 弹框显示
    openDialog(row) {
      if (row) {
        this.spinning = true;
        this.row = row;
        getOne(row.id).then((response) => {
          this.setOneData(response.data.data);
          this.itemList = response.data.data.ruleDetails;
          if (this.itemList.length !== 0) {
            this.calculateSum(this.itemList);
            this.itemList.push(this.sumRow);
          }
          this.spinning = false;
        });
      }
      this.isVisible = true;
    },
    // 计算总分
    calculateSum(itemList) {
      this.sumRow.totalPoints = 0;
      const map = {};
      itemList.forEach((item) => { map[item.ruleId] = []; });
      itemList.forEach((item) => { map[item.ruleId].push(item); });
      Object.keys(map).forEach((item) => { this.sumRow.totalPoints += Number(map[item][0].totalPoints); });
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.itemModel = emptyForm();
      this.form.resetFields();
      this.itemList = [];
    },
    // 表单赋值
    setOneData(data) {
      this.form.setFieldsValue({
        'planName': data.planName,
        'isActive': data.isActive,
      });
    },
    // 保存事件
    onSave() {
      this.form.validateFields((err, fieldsValue) => {
        const setValue = {
          'planName': fieldsValue.planName,
          'isActive': fieldsValue.isActive,
        };
        Object.assign(this.itemModel, setValue);
        if (err) {
          return;
        }
        let autoPoints = 0;
        let diyPoints = 0;
        let ruleDetails = [];
        if (this.itemList.length !== 0) {
          if (this.itemList[this.itemList.length - 1].totalPoints > 100) {
            this.$message.warning('自动计分总分超过100分', 3);
            return;
          }
          autoPoints = this.itemList[this.itemList.length - 1].totalPoints;
          diyPoints = 100 - autoPoints;
          this.itemList.forEach((el, index) => {
            if (index === this.itemList.length - 1) {
              return;
            }
            ruleDetails.push(el);
          });
        } else {
          autoPoints = 0;
          diyPoints = 100 - autoPoints;
          ruleDetails = this.itemList;
        }
        const data = {
          ...this.itemModel,
          autoPoints,
          diyPoints,
          ruleDetails,
          id: this.row.id ? this.row.id : undefined,
        };
        const saveMethod = this.row ? update : create;
        saveMethod(data, this.row).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 3);
            this.closeDialog();
            this.$emit('refreshList');
          } else {
            this.$message.warning(response.data.msg, 3);
          }
        });
      });
    },
    // 点击配置事件
    onConfigClick() {
      const itemList = _.cloneDeep(this.itemList);
      if (itemList && itemList.length !== 0) {
        itemList.pop();
        // 创建一个对象和数组
        const map = {};
        itemList.forEach((item) => { map[item.ruleId] = []; });
        itemList.forEach((item) => { map[item.ruleId].push(item); });
        this.$refs.dialogRule.openDialog(map, itemList);
      } else {
        this.$refs.dialogRule.openDialog();
      }
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  created() {
  },
};
</script>
<style lang="scss">
  .auto_score_modal.ant-modal{
    .ant-modal-content{
      .ant-modal-body{
        padding: 6px 12px;
        .rules-info{
          .ant-table{
            margin-top: 5px;
            margin-left: 10px;
            .ant-table-content{
              // min-height: 406px;
              .ant-table-body{
                margin: 0;
              }
              // .ant-table-placeholder{
              //   .ant-empty{
              //     min-height: 368px;
              //     line-height: 368px;
              //   }
              // }
            }
          }
        }
      }
      .ant-modal-footer{
        display: none;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .auto_score_modal{
    .operations{
      padding-bottom: 6px;
      // border-bottom: 1px solid #e8e8e8;
    }
    .basic-info{
      border-bottom: 1px solid #e8e8e8;
      .basic-title{
        height: 37px;
        line-height: 37px;
        font-size: 14px;
        color: #409eff;
        .title{
          font-weight: 700;
        }
        .remark{
          color: rgb(170, 174, 184);
          font-size: 13px;
          margin-left: 25px;
        }
      }
    }
    .rules-info{
      .rules-title{
        height: 37px;
        line-height: 37px;
        font-size: 14px;
        color: #409eff;
        .title{
          font-weight: 700;
        }
      }
    }
  }
</style>
