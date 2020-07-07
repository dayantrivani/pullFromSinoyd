<template>
  <dialog-modal ref="dialog" size="middle" title="规则配置" @close="closeDialog">

    <!-- 按钮组 -->
    <div class="mar-b-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      height="calc(86vh - 114px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="factorName" min-width="100" label="因子名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column v-for="(item, index) in paramsList" :key="index"
        min-width="100" :label="item.name" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.dtoAlarmRuleForAbnormalDetails[index]
            ? scope.row.dtoAlarmRuleForAbnormalDetails[index].paramsValue
            : '--'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />

    <!-- 新增或编辑对话框 -->
    <dialog-modal ref="dialogbody" size="mini" :title="`${isEdit ? '编辑' : '新增'}规则`"
      :append-to-body="true" @close="closeBodyDialog"
    >
      <el-form :model="itemForm" :rules="rules" ref="form" v-loading="floading" label-width="120px" class="pad-x-sm">
        <el-form-item label="因子名称：" prop="factorId">
          <el-select v-model="itemForm.factorId" filterable @change="onInputChange">
            <el-option v-for="(item, index) in select.factorsList"
              :key="index" :label="item.factorName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, index) in itemForm.dtoAlarmRuleForAbnormalDetails" :key="index">
          <template slot="label">
            <span style="color: #F78E8E;">*</span>&nbsp;<span>{{`${item.paramsName}：`}}</span>
          </template>
          <el-input v-model.trim="item.paramsValue" @blur="onLoseBlur"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-loading="saveLoading" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
        <el-button @click="$refs.dialogbody.closeDialog()" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  props: {
    alarmType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'alarm/alarmRuleForAbnormalFactor',
      isAuto: false,
      floading: false,
      saveLoading: false,
      field: {},
      queryForm: {
        objectId: '',
        sort: 'factorName',
      },
      paramsList: [
        // {
        //   alarmTypeId: '',
        //   code: '',
        //   id: '',
        //   isDeleted: false,
        //   name: '突变值',
        //   orderNum: '',
        //   remark: '',
        //   verification: '',
        // },
      ],
      // 列表数据
      itemList: [
        // {
        //   objectId: '',
        //   alarmTypeId: '',
        //   factorId: '',
        //   factorCode: '',
        //   factorName: '因子1',
        //   dtoAlarmRuleForAbnormalDetails: [
        //     {
        //       id: '',
        //       paramsId: '',
        //       paramsCode: '1324',
        //       paramsName: '突变值',
        //       paramsValue: 12,
        //       abnormalFactorId: '',
        //     },
        //   ],
        // },
      ],
      itemForm: {
        objectId: '',
        alarmTypeId: '',
        factorId: '',
        factorCode: '',
        factorName: '',
        dtoAlarmRuleForAbnormalDetails: [
          // {
          //   id: '',
          //   paramsId: '',
          //   paramsCode: '1324',
          //   paramsName: '突变值',
          //   paramsValue: 12,
          //   abnormalFactorId: '',
          // },
          // {
          //   id: '',
          //   paramsId: '',
          //   paramsCode: '1122',
          //   paramsName: '下限值',
          //   paramsValue: 11,
          //   abnormalFactorId: '',
          // },
        ],
      },
      systemTypeList: [
        { dictCode: 'Water', dictValue: '1' },
        { dictCode: 'Air', dictValue: '2' },
        { dictCode: 'Noise', dictValue: '3' },
        { dictCode: 'Solid', dictValue: '' },
        { dictCode: 'Rain', dictValue: '1' },
      ],
      select: {
        factorsList: [],
      },
      rules: {
        factorId: [{ required: true, message: '请输入名称', trigger: ['change', 'blur'] }],
      },
    };
  },
  computed: {
    isEdit() { return this.itemList.id; },
  },
  methods: {
    openDialog(item) {
      this.itemForm.dtoAlarmRuleForAbnormalDetails = [];
      this.field = Object.assign({}, item);
      this.$set(this.queryForm, 'objectId', this.field.id);
      this.$set(this.itemForm, 'alarmTypeId', this.alarmType.id);
      this.getParamsList();
      this.$refs.dialog.openDialog();
    },
    onSaveItem() {
      // 1. 判断是否为空
      if (this.itemForm.dtoAlarmRuleForAbnormalDetails
        .filter(item => item.paramsValue === '').length) {
        this.$message({
          type: 'warning',
          message: '存在未填项',
          showClose: true,
          duration: 3000,
        });
        return;
      }
      this.saveLoading = true;
      const { id } = this.itemForm;
      if (id) {
        this.itemForm.dtoAlarmRuleForAbnormalDetails.forEach((item) => {
          this.$set(item, 'abnormalFactorId', id);
        });
      }
      this.$http[id ? 'put' : 'post']('alarm/alarmRuleForAbnormalFactor', this.itemForm)
        .then((response) => {
          if (response.status === 200
          && (response.data.success
            || response.data.msg.includes('未查询到符合条件的数据'))) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.getItemList();
            this.$refs.dialogbody.closeDialog();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
    },
    onClickAdd() {
      this.$set(this.itemForm, 'objectId', this.field.id);
      this.createParamsFeild();
      this.getSelectFactors();
      this.$refs.dialogbody.openDialog();
    },
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('alarm/alarmRuleForAbnormalFactor', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onClickEdit(row) {
      // this.itemForm = Object.assign({}, row);
      this.itemForm = JSON.parse(JSON.stringify(row));
      this.putParamsFeild(JSON.parse(JSON.stringify(row)));
      this.getSelectFactors();
      this.$refs.dialogbody.openDialog();
    },
    closeDialog() {
      /* 测试完解除注释 */
      this.itemList = [];
      this.paramsList = [];
      this.$set(this.queryForm, 'objectId', '');
    },
    closeBodyDialog() {
      this.$refs.form.clearValidate();
      this.itemForm = this.getItemEmpty();
      /* 测试完解除注释 */
      // this.select.factorsList = [];
    },

    /** 请求层 */
    getParamsList() {
      this.loading = true;
      this.$http.get('alarm/alarmRuleParams', {
        params: {
          page: 1,
          rows: 100000,
          alarmTypeId: this.alarmType.id,
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200
        && (response.data.success
          || response.data.msg.includes('未查询到符合条件的数据'))) {
          this.paramsList = response.data.data;
          this.createParamsFeild();
          this.getItemList();
          this.loading = false; // 待删除
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
          this.loading = false;
        }
      }, ({ response }) => {
        analyzeResp(response);
        this.loading = false;
      });
    },
    getSelectFactors() {
      this.floading = true;
      const { dictValue } = this.systemTypeList.filter(val => val.dictCode === this.field.systemTypeCode)[0];
      this.$http.get('cfg/factors', {
        params: {
          page: 1,
          rows: 100000,
          factorsType: 1,
          category: dictValue,
          sort: 'factorCode',
        },
      }).then((response) => {
        if (response.status === 200
        && (response.data.success
          || response.data.msg.includes('未查询到符合条件的数据'))) {
          this.select.factorsList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.floading = false;
      });
    },

    /** 特殊方法 */
    createParamsFeild() {
      const str = [];
      this.paramsList.forEach((item) => {
        const _item = Object.assign({}, item);
        const data = {
          id: '',
          paramsId: _item.id,
          paramsCode: _item.code,
          paramsName: _item.name,
          paramsValue: '',
          abnormalFactorId: '',
        };
        str.push(data);
      });
      this.itemForm.dtoAlarmRuleForAbnormalDetails = str;
    },
    putParamsFeild(row) {
      const params = row.dtoAlarmRuleForAbnormalDetails;
      const str = [];
      this.paramsList.forEach((item, index) => {
        const _item = Object.assign({}, item);
        const data = {
          id: params[index] ? params[index].id : '',
          paramsId: params[index] ? params[index].paramsId : _item.id,
          paramsCode: params[index] ? params[index].paramsCode : _item.code,
          paramsName: params[index] ? params[index].paramsName : _item.name,
          paramsValue: params[index] ? params[index].paramsValue : '',
          abnormalFactorId: params[index] ? params[index].paramsValue : '',
        };
        str.push(data);
      });
      this.itemForm.dtoAlarmRuleForAbnormalDetails = str;
    },
    getItemEmpty() {
      return {
        objectId: '',
        alarmTypeId: '',
        factorId: '',
        factorCode: '',
        factorName: '',
        dtoAlarmRuleForAbnormalDetails: [
        ],
      };
    },
    onInputChange(val) {
      const [row] = this.select.factorsList.filter(item => item.id === val);
      this.$set(this.itemForm, 'factorId', row.id);
      this.$set(this.itemForm, 'factorCode', row.factorCode);
      this.$set(this.itemForm, 'factorName', row.factorName);
    },
    onLoseBlur(el) {
      if (el.target.value) {
        el.target.className = 'border-success el-input__inner';
      } else {
        el.target.className = 'border-danger el-input__inner';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
