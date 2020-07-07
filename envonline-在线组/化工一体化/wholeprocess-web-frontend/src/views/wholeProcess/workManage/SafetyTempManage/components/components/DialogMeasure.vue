<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}安全措施标准模板`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="120px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属作业："
                        prop="indexName">
            <el-select v-model="itemModel.workType"
                      class="z-pointer"
                      style="width: 200px;">
              <el-option v-for="(item, index) in $enum.WORKTYPE"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="措施内容："
                        prop="measuresContent">
            <el-input type="textarea"
                      v-model="itemModel.measuresContent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="是否外来方措施："
                        prop="isExternal">
            <el-switch v-model="itemModel.isExternal"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="是否自动应用："
                        prop="isAutoApply">
            <el-switch v-model="itemModel.isAutoApply"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序值："
                        prop="orderNum">
            <el-input-number v-model="itemModel.orderNum"
                             controls-position="right"
                             :min="0"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  data() {
    return {
      url: 'wholeprocess/measuresTemplate',
      itemModel: this.getEmptyItem(),
      rules: {
        measuresContent: [
          { required: true, message: '请输入措施内容', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  props: {
  },
  mixins: [saveItem],
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {

  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        workType: 1,
        measuresContent: '',
        orderNum: 999,
        isExternal: true,
        isAutoApply: true,
      };
    },
    // 保存记录
    onSaveCheck(callback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      this.getDictList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
