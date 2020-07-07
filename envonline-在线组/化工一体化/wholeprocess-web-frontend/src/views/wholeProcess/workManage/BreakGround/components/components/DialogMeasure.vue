<template>
  <dialog-modal ref="dialog"
                :title="`${isEdit ? '编辑' : '新增'}安全措施`"
                maxScrollbar
                size="mini"
                appendToBody
                @close="closeDialog">
    <el-form ref="form"
             :rules="rules"
             :model="itemModel"
             label-position="right"
             label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="安全措施：" prop="measuresContent">
            <el-input type="textarea"
                  :rows="4"
                  v-model="itemModel.measuresContent">
                </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fa fa-save"
                 :loading="saveLoading"
                 @click="onSaveItem()">保 存</el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'SaftyMeasureDialog',
  mixins: [],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/workMeasures',
      loading: false,
      saveLoading: false,
      itemModel: this.getEmptyItem(),
      // 表单验证
      rules: {
        measuresContent: [
          { required: true, message: '请选择安全措施', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // 是否编辑
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取初始对象
    getEmptyItem() {
      return {
        workId: '',
        measuresContent: '',
      };
    },
    // 保存回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 保存
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        this.saveLoading = true;
        this.$http[this.isEdit ? 'put' : 'post'](this.url, [this.itemModel]).then((response) => {
          if (response.data.success) {
            this.$emit('query');
            this.saveLoading = false;
            this.closeDialog();
          } else {
            this.closeDialog();
            this.$message({
              showClose: true,
              message: response.data.msg,
            });
          }
        }, ({ response }) => {
          this.saveLoading = false;
          analyzeResp(response);
        });
      });
    },
    // 打开对话框
    openDialog(row) {
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
