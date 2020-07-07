<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                title="生产技术标准"
                @close="closeDialog">
    <el-form ref="form"
             disabled
             label-position="right"
             label-width="80px"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="标题："
                        prop="title">
            <el-input v-model="itemModel.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="remark">
            <el-input type="textarea"
                      v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-col :span="24">
            <el-form-item label="其他附件：">
              <upload-file :id="objectId"
                          :is-update="isUpdate"
                          :isRequest="isRequest"
                          :size-limilt="0"
                          :btn="readOnly? 'down remove' : 'add down remove'" />
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isAuto: false,
      itemModel: this.getEmptyItem(),
      // 附件相关
      objectId: '',
      isUpdate: false,  // 是否调用上传附件的接口
      isRequest: false, // 是否调用获取附件列表的接口
      readOnly: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
        title: '',  // 标题
        remark: '', // 备注
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = true;
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.isUpdate = false;
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
