<template>
<!-- 新增或编辑按钮弹框 -->
  <dialog-modal
    ref="dialogform"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}危化品因子显示配置`"
    @close="closeDialog">
    <el-form
      class="mar-t-xs pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="85px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-form-item label="配置名称：" prop="configName">
        <el-input v-model="itemModel.configName"></el-input>
      </el-form-item>
      <el-form-item label="配置编号：" prop="configCode">
        <el-input v-model="itemModel.configCode"></el-input>
      </el-form-item>
      <el-form-item label="模块名称：">
        <el-input v-model="itemModel.moduleName"></el-input>
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-tooltip :content="itemModel.status === 1 ? '启用' : '停用'" placement="top">
          <el-switch
            v-model="itemModel.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number
          v-model="itemModel.sortNum"
          controls-position="right"
          style="width: 100%;"
          :min="0"
          :precision="0">
        </el-input-number>
      </el-form-item>
    </el-form>
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
      // isEdit: false,
      url: 'keypoints/factorDisplayMain',                  // 接口地
      itemModel: this.getEmptyItem(),
      rules: {
        configName: [
          { required: true, message: '请输入配置名称', trigger: ['blur', 'change'] },
        ],
        configCode: [
          { required: true, message: '请输入配置编号', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  watch: {},
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
        configName: '',                   // 因子编号
        configCode: '',                   // 因子名称
        moduleName: '',                   // 因子类型
        status: '0',                      // 单位
        sortNum: 0,                       // 排序值
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      } else {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
        this.itemModel = this.getEmptyItem();
      }
      // 显示编辑表单
      this.$refs.dialogform.openDialog();
    },
    // 关闭对话框
    closeDialog() {
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
