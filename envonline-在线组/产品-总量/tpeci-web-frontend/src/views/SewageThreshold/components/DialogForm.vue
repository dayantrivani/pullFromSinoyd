<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${itemModel.id ? '编辑' : '新增'}配置方案`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="rules"
      label-width="100px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="方案名称：" prop="schemeName" hint-down>
        <el-input v-model="itemModel.schemeName" clearable></el-input>
      </el-form-item>

      <el-form-item label="方案编号：" prop="schemeCode">
        <el-input v-model="itemModel.schemeCode" clearable></el-input>
      </el-form-item>

      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"/>
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

export default {
  mixins: [saveItem],                       // 使用混合
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      url: 'tpeci/valveScheme',             // 必须, 接口地址
      itemModel: {                          // 表单对象
        schemeName: '',                     // 方案名称
        schemeCode: '',                     // 方案编码
        remark: '',                         // 备注
      },
      rules: {                              // 表单验证
        schemeName: [
          { required: true, message: '请选择方案名称', trigger: ['blur', 'change'] },
        ],
        schemeCode: [
          { required: true, message: '请输入方案编码', trigger: ['blur', 'change'] },
        ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: ['blur', 'change'] },
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
      let val = row;
      if (row) {
        val = _.cloneDeep(row);
        this.psName = val.psName || '';
        this.itemModel = this.setEmptyItem(val);
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
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
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        schemeName: '',                 // 方案名称
        schemeCode: '',                 // 方案编码
        remark: '',                     // 备注
      };
    },
    setEmptyItem(val) {             // 将列表数据赋值给表单数据
      return {
        id: val.id || '',                     // 唯一标识符
        schemeName: val.schemeName || '',     // 方案名称
        schemeCode: val.schemeCode || '',     // 方案编码
        remark: val.remark || '',             // 备注
      };
    },
  },
};
</script>
