<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    append-to-body
    :title="`${isEdit ? '编辑' : '新增'}浓度阈值`"
    @close="closeDialog">
    <el-form ref="form" :rules="rules" label-width="100px" :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box" v-loading="loading">
      <el-form-item label="因子名称：" prop="factorCode" hint-down>
        <el-select style="width:100%;" v-model="itemModel.factorCode" clearable filterable @change="getFactorData">
          <el-option
            v-for="(item, index) in select.factorsList"
            :key="index"
            :label="item.factorName"
            :value="item.factorCode">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="阈值年份：" prop="thresholdYear">
        <el-date-picker
          v-model="itemModel.thresholdYear"
          type="year"
          value-format="yyyy"
          :clearable="false"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item> -->

      <el-form-item label="浓度上限值：" prop="alertUpper">
        <el-input v-model="itemModel.alertUpper" clearable></el-input>
      </el-form-item>

      <el-form-item label="浓度下限值：" prop="alertLow">
        <el-input v-model="itemModel.alertLow" clearable></el-input>
      </el-form-item>

      <el-form-item label="单位：" prop="unit">
        <el-input v-model="itemModel.unit" disabled></el-input>
      </el-form-item>

      <!-- <el-form-item label="是否启用：" prop="status">
        <el-tooltip :content="itemModel.status ? '是' : '否'" placement="top">
          <el-switch
            v-model="itemModel.status"
            :active-value="1"
            :inactive-value="0">
          </el-switch>
        </el-tooltip>
      </el-form-item> -->
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
  mixins: [saveItem],               // 使用混合
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      loading: false,
      url: 'tpeci/valveSchemeDetail',
      itemModel: {                          // 表单对象
        schemeId: '',
        type: 2,
        factorId: '',
        factorName: '',
        unit: '',                           // 单位
        status: 1,                          // 是否启用(0 代表停用 1 代表启用)
        factorCode: '',                     // 因子名称
        // thresholdYear: '',                  // 阈值年份
        alertUpper: '',                     // 浓度上限值
        alertLow: '',                       // 浓度下限值
      },
      select: {
        factorsList: [],
      },
      rules: {                              // 表单验证
        factorCode: [
          { required: true, message: '请选择因子名称', trigger: ['blur', 'change'] },
        ],
        // thresholdYear: [
        //   { required: true, message: '请选择阈值年份', trigger: ['blur', 'change'] },
        // ],
        alertUpper: [
          { required: true, message: '请输入浓度上限值', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        alertLow: [
          { required: true, message: '请输入浓度下限值', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        // unit: [
        //   { required: true, message: '请输入单位', trigger: ['blur', 'change'] },
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
      this.$refs.dialog.openDialog();
      this.getFactorsList();
      let val = row;
      if (row) {
        val = _.cloneDeep(row);
        this.psName = val.psName || '';
        this.itemModel = this.setEmptyItem(val);
      }
      this.itemModel.schemeId = this.mainrow.id || '';
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.once = false;
      });
    },

    /** 接口层 */
    getFactorsList() {              // 获取因子数据列表
      this.loading = true;
      this.$http.get('cfg/factors/', {
        params: {
          page: 1,
          rows: 100000,
          factorsType: 1,
          category: 1,
          sort: 'factorName+',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorsList = response.data.data || [];
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },

    /** 特殊方法 */
    getFactorData(val) {            // 获取因子数据
      const data = this.select.factorsList.filter(v => v.factorCode === val)[0] || {};
      this.$set(this.itemModel, 'factorId', data.id || '');
      this.$set(this.itemModel, 'factorName', data.factorName || '');
      this.$set(this.itemModel, 'unit', data.unit || '');
    },
    onSaveCheck(callback) {         // 保存记录
      if (+(this.itemModel.alertUpper) < +(this.itemModel.alertLow)) {
        this.$message.warning({
          message: '下限值不能高于上限值',
          duration: 3000,
          showClose: true,
        });
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.once = true;
      this.type = '';
      this.psName = '';
      this.select.factorsList = [];
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        schemeId: '',                       // 配置方案id
        type: 2,                            // 类型 1 总量 2 浓度
        factorId: '',                       // 因子id
        factorName: '',                     // 因子名称
        unit: '',                           // 单位
        status: 1,                          // 是否启用(0 代表停用 1 代表启用)
        factorCode: '',                     // 因子名称
        // thresholdYear: '',                  // 阈值年份
        alertUpper: '',                     // 浓度上限值
        alertLow: '',                       // 浓度下限值
      };
    },
    setEmptyItem(val) {             // 将列表数据赋值给表单数据
      return {
        id: val.id || '',                             // 唯一标识
        schemeId: val.schemeId || '',                 // 配置方案id
        type: val.type || 2,                          // 类型 1 总量 2 浓度
        factorId: val.factorId || '',                 // 因子id
        factorCode: val.factorCode || '',             // 因子编号
        factorName: val.factorName || '',             // 因子编号
        // thresholdYear: val.thresholdYear || '',       // 阈值年份
        unit: val.unit || '',                         // 单位
        alertUpper: val.alertUpper || '',             // 浓度上限值
        alertLow: val.alertLow || '',                 // 浓度下限值
        status: val.status || 0,                      // 是否启用
      };
    },
  },
};
</script>
