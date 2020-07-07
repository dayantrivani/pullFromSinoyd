<template>
  <dialog-modal
    ref="dialogform"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}危化品因子`"
    @close="closeDialog"
  >
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="105px"
        v-loading="formLoading"
        :model="itemModel"
        :rules="rules"
      >
        <el-form-item label="因子名称：" prop="factorName">
          <el-input v-model.trim="itemModel.factorName"></el-input>
        </el-form-item>
        <el-form-item label="因子编码：" prop="factorCode">
          <el-input v-model.trim="itemModel.factorCode"></el-input>
        </el-form-item>
        <el-form-item label="所属类型：" prop="factorType">
          <el-select v-model="itemModel.factorType" @blur="$refs.form.validateField('factorType')">
            <el-option :value="1" label="易燃易爆"></el-option>
            <el-option :value="2" label="有毒有害"></el-option>
            <el-option :value="3" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位：">
          <el-input v-model.trim="itemModel.unit"></el-input>
        </el-form-item>
        <el-form-item label="缺省数据类型：">
          <el-input v-model.trim="itemModel.defaultDataType"></el-input>
        </el-form-item>
        <el-form-item label="排序号：">
          <el-input-number
            v-model="itemModel.sortNum"
            controls-position="right"
            :min="0"
            style="width: 100%">
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import rules from './rules';
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  data() {
    return {
      url: 'keypoints/majorHazardsFactors',   // 必须, 接口地址
      itemModel: this.getEmptyItem(),         // 表单内容
      rules: {
        factorName: [
          { required: true, message: '请输入因子名称', trigger: ['blur', 'change'] },
        ],
        factorCode: [
          { required: true, message: '请输入因子编码', trigger: ['blur', 'change'] },
        ],
        factorType: [
          { required: true, message: '请选择所属类型', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  created() {},
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        factorCode: '',                   // 因子编号
        factorName: '',                   // 因子名称
        factorType: '',                   // 因子类型
        unit: '',                         // 单位
        defaultDataType: '',              // 缺省数据类型
        sortNum: '',                      // 排序值
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并表单内容
      // this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      } else {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
        this.itemModel = this.getEmptyItem();
      }
      // 是否需要获取字典表
      // this.getDictList();

      // 显示编辑表单
      this.$refs.dialogform.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.$refs.dialogform.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
