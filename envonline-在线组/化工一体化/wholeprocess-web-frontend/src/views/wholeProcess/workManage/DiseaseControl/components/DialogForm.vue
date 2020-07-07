<template>
  <dialog-modal ref="dialog"
                title="新增职业病"
                maxScrollbar
                size="mini"
                @close="closeDialog">
    <el-form ref="form"
             :rules="rules"
             :model="itemModel"
             v-loading="formLoading"
             label-position="right"
             label-width="145px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="职业病名称：" prop="diseaseName">
            <el-input v-model="itemModel.diseaseName"></el-input>
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
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'DiseaseDialog',
  mixins: [
    saveItem,
  ],
  components: {
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/occupationalDisease',
      itemModel: this.getEmptyItem(),
      dict: {
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入职业病名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  methods: {
    // 获取初始对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : this.$store.state.auth.user.orgGuid,
        diseaseName: '',
      };
    },
    // 保存
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) { return; }
        this.saveLoading = true;
        this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel).then((response) => {
          if (response.data.success) {
            this.$message.success({
              showClose: true,
              message: '操作成功',
            });
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
