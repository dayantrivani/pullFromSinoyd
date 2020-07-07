<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    title="报警处理"
    @close="closeDialog"
  >
    <!-- 企业故障申报 -->
    <el-form ref="form"
      :rules="formRules"
      label-width="80px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="处置人员：" prop="dealUserName">
        <el-input v-model="itemModel.dealUserName" readonly></el-input>
      </el-form-item>
      <el-form-item label="当前状态：">
        <el-select v-model="itemModel.dealType">
          <el-option label="已处理" :value="1"></el-option>
          <el-option label="待处理" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处置时间：" prop="dealDate">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.dealDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="超标原因：">
        <el-input
          type="textarea"
          v-model="itemModel.exceedReason"
          :autosize="{ minRows: 2 }"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="处置说明：" prop="dealContext">
        <el-input
          type="textarea"
          v-model="itemModel.dealContext"
          :autosize="{ minRows: 2 }"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="附件：">
        <upload-File
          ref="uploadFile"
          :isRequest="false"
          :isUpdate="isUpdate"
          :id="itemModel.id || ''"
          btn="add down remove"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck()"
      >
        保 存
      </el-button>
      <el-button icon="fas fa-times"  @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDate } from '@/global/libs/tools';
import { saveItem } from '@/global/libs/mixins';
// import UploadFile from '@/components/upload-file';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [saveItem],                     // 使用混合
  // components: { UploadFile },
  data() {
    const required = (rule, value, callback) => {
      if (this.$refs.uploadFile.fileList.length === 0 && !value) {
        callback(new Error('请输入处置说明'));
      } else {
        callback();
      }
    };
    return {
      url: 'amcs/alarmRecordForContinuousDeal',  // 必须, 接口地址
      itemModel: {
        dealUserName: '',
        dealType: 1,
        dealDate: formatDate(new Date(), 'Y-m-d H:i:s'),
      },          // 表单对象
      isUpdate: false,
      formRules: {
        dealContext: [
          { validator: required, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'userName', 'orgGuid']),
  },
  methods: {
    getEmptyItem() {
      return {
        dealType: 1,
        dealDate: formatDate(new Date(), 'Y-m-d H:i:s'),
      };
    },
    // 打开对话框
    openDialog(row) {
      this.getAttachGuId();
      // 合并参数对象
      this.$set(this.itemModel, 'alarmId', row.id);
      this.$set(this.itemModel, 'dealUserName', this.userName);
      this.$set(this.itemModel, 'dealUserId', this.orgGuid);
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.isUpdate = false;
      this.itemModel = this.getEmptyItem();
    },

    /** 请求层 */
    getAttachGuId() {             // 获取附件全网唯一标识符
      this.loading = true;
      this.$http.get('sys/guid/new').then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel.id = response.data.data || '';
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.isUpdate = true;
        this.$http.post(this.url, this.itemModel)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.itemModel = response.data.data;
              if (callback) {
                callback(response.data.data);
              } else {
                this.$emit('query');
                this.closeDialog();
              }
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
            this.saveLoading = false;
          });
      });
    },
  },
};
</script>
