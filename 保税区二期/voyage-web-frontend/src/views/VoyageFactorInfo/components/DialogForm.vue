<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${itemModel.id ? '编辑' : '新增'}走航因子`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="rules"
      label-width="100px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="因子名称：" prop="factorName" hint-down>
        <el-input v-model="itemModel.factorName" clearable></el-input>
      </el-form-item>

      <el-form-item label="因子编码：" prop="factorCode">
        <el-input v-model="itemModel.factorCode" clearable></el-input>
      </el-form-item>

      <el-form-item label="浓度单位：" prop="unit">
        <el-input v-model="itemModel.unit" clearable></el-input>
      </el-form-item>

      <el-form-item label="上限值：" prop="alertUpper">
        <el-input v-model="itemModel.alertUpper" clearable></el-input>
      </el-form-item>

      <el-form-item label="上限值单位：" prop="alertUpperUnit">
        <el-input v-model="itemModel.alertUpperUnit" clearable></el-input>
      </el-form-item>

      <el-form-item label="排序值：" prop="orderNum">
        <el-input v-model="itemModel.orderNum" clearable></el-input>
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
// import SelectTable from '@/components/select-table';

export default {
  mixins: [saveItem],                       // 使用混合
  // components: { SelectTable },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      url: 'voyage/factorInfo',             // 必须, 接口地址                       // 企业名称--SelectTable组件
      itemModel: {                          // 表单对象
        factorName: '',      // 因子名称
        factorCode: '',      // 因子编码
        unit: '',            // 浓度单位
        alertUpper: '',      // 上限值
        alertUpperUnit: '',  // 上限值单位
        orderNum: 0,        // 排序值
      },
      rules: {                              // 表单验证
        factorName: [
          { required: true, message: '请输入因子名称', trigger: ['blur', 'change'] },
        ],
        factorCode: [
          { required: true, message: '请输入因子编码', trigger: ['blur', 'change'] },
        ],
        unit: [
          { required: true, message: '请输入浓度单位', trigger: ['blur', 'change'] },
        ],
        alertUpper: [
          { required: true, message: '请输入上限值', trigger: ['blur', 'change'] },
        ],
        alertUpperUnit: [
          { required: true, message: '请输入上限值单位', trigger: ['blur', 'change'] },
        ],
        orderNum: [
          { required: true, message: '请输入排序值', trigger: ['blur', 'change'] },
          { pattern: /^[0-9]*$/, message: '请输入非负数' },
        ],
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
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /** 特殊方法 */
    getPsNameValue(name) {              // 企业组件修改父组件 PsName 值
      this.psName = name;
    },
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        // const st = new Date(this.itemModel.permitStartDate.replace(/-/g, '/')).getTime();
        // const et = new Date(this.itemModel.permitEndDate.replace(/-/g, '/')).getTime();
        // if (st > et) {
        //   this.$message({
        //     type: 'warning',
        //     message: '开始时间大于结束时间',
        //     showClose: true,
        //     duration: 3000,
        //   });
        //   return;
        // }
        this.onSaveItem(callback);
      });
    },
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        factorName: '',      // 因子名称
        factorCode: '',      // 因子编码
        unit: '',            // 浓度单位
        alertUpper: '',      // 上限值
        alertUpperUnit: '',  // 上限值单位
        orderNum: 0,         // 排序值
      };
    },
  },
};
</script>
