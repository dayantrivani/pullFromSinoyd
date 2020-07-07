<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    append-to-body
    :title="`${itemModel.id ? '编辑' : '新增'}走航结果`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="formRules"
      label-width="130px"
      :model="itemModel"
      class="mar-t-xs item-space el-box">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <el-select v-model="itemModel.psId" filterable @change="getpsBaseDate">
          <el-option
            v-for="(item, index) in select.psBaseInfoList"
            :key="index"
            :label="item.psName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="超标特征污染物：" prop="factorCode">
       <el-select v-model="itemModel.factorCode" filterable @change="getFactorData">
          <el-option
            v-for="(item, index) in select.factorList"
            :key="index"
            :label="item.factorName"
            :value="item.factorCode">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="因子编码：" prop="factorCode">
        <el-input v-model="itemModel.factorCode" disabled></el-input>
      </el-form-item>

      <el-form-item label="污染物浓度：" prop="factorValue">
        <el-input v-model="itemModel.factorValue" clearable>
          <template slot="append">{{itemModel.unit}}</template>
        </el-input>
      </el-form-item>

      <el-form-item label="标准限值：" prop="alertUpper">
        <el-input :value="itemModel.alertUpper" disabled>
          <template slot="append">{{itemModel.alertUpperUnit}}</template>
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [saveItem],                       // 使用混合
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      url: 'voyage/resultDetail',           // 必须, 接口地址
      ploading: false,
      floading: false,
      itemModel: {                          // 表单对象
        voyageId: '',        // 主任务id
        taskId: '',          // 任务id
        factorName: '',      // 因子名称
        factorCode: '',      // 因子编码
        unit: '',            // 浓度单位
        alertUpper: '',      // 上限值
        alertUpperUnit: '',  // 上限值单位
      },
      select: {
        factorList: [],         // 走航因子列表
        psBaseInfoList: [],     // 企业列表
      },
      formRules: {                              // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        factorName: [
          { required: true, message: '请选择因子名称', trigger: ['blur', 'change'] },
        ],
        factorValue: [
          { required: true, message: '请输入污染物浓度', trigger: ['blur', 'change'] },
          { pattern: /(^[0-9]+(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        // factorCode: [
        //   { required: true, message: '请输入因子编码', trigger: ['blur', 'change'] },
        // ],
        // unit: [
        //   { required: true, message: '请输入浓度单位', trigger: ['blur', 'change'] },
        // ],
        // alertUpper: [
        //   { required: true, message: '请输入上限值', trigger: ['blur', 'change'] },
        // ],
        // alertUpperUnit: [
        //   { required: true, message: '请输入上限值单位', trigger: ['blur', 'change'] },
        // ],
      },
    };
  },
  computed: {
    isEdit() {                      // 是否为编辑对话框
      return this.itemModel.id;
    },
  },
  methods: {
    openDialog(row) {               // 打开对话框
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.itemModel.voyageId = this.mainrow.id;
      this.$refs.dialog.openDialog();
      this.getFactorList();
      this.getPsBaseInfoList();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /* 接口请求 */
    getFactorList() {               // 获取因子列表
      this.floading = true;
      this.$http.get('voyage/factorInfo', {
        params: {
          page: 1,
          rows: 10000000,
          sort: 'orderNum-',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorList = response.data.data || [];
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
    getPsBaseInfoList() {               // 获取企业列表
      this.ploading = true;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1,
          rows: 1000000,
        },
      }).then((response) => {
        if (response.data.success) {
          this.select.psBaseInfoList = response.data.data || [];
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
        this.ploading = false;
      });
    },

    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    getpsBaseDate(val) {                // 企业选择框
      const data = this.select.psBaseInfoList.filter(v => v.id === val)[0] || {};
      this.$set(this.itemModel, 'psName', data.psName || '');
    },
    getFactorData(val) {            // 获取走航因子数据
      const data = this.select.factorList.filter(v => v.factorCode === val)[0] || {};
      // this.$set(this.itemModel, 'factorCode', data.id || '');
      this.$set(this.itemModel, 'factorName', data.factorName || '');
      this.$set(this.itemModel, 'unit', data.unitCou || '');
      this.$set(this.itemModel, 'alertUpper', data.alertUpper || '');
      this.$set(this.itemModel, 'alertUpperUnit', data.alertUpperUnit || '');
    },
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.itemModel = this.getEmptyItem();
      this.select = {
        factorList: [],         // 走航因子列表
        psBaseInfoList: [],     // 企业列表
      };
    },
    getEmptyItem() {                // 重置表单数据
      return {
        voyageId: '',        // 任务表id
        taskId: '',          // 任务id
        psName: '',          // 企业名称
        psId: '',            // 企业id
        factorName: '',      // 因子名称
        factorCode: '',      // 因子编码
        unit: '',            // 浓度单位
        alertUpper: '',      // 上限值
        alertUpperUnit: '',  // 上限值单位
      };
    },
  },
};
</script>
