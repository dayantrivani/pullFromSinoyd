<template>
<!-- 上传评审附件 -->
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    append-to-body
    maxScrollbar
    :title="`${isSee ? '查看' : '新增'}${title}`"
    @close="closeDialog">
    <el-form ref="form"
      :rules="formRules"
      label-width="90px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="评审时间：" prop="operateTime">
        <el-date-picker
          style="width: 100%;"
          popper-class="datehour-picker"
          v-model="itemModel.operateTime"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
          :readonly="isSee"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="评审意见：">
        <el-input
          type="textarea"
          v-model="itemModel.auditRemark"
          :autosize="{ minRows: 2 }"
          clearable
          :readonly="isSee"
        ></el-input>
      </el-form-item>
      <el-form-item label="附件上传：">
        <upload-file
          :id="itemModel.id"
          :is-update="isUpdate"
          :isRequest="isRequest"
          :col="2"
          :btn="isSee? 'down' : 'add down remove'"/>
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="!isSee">
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
import * as _cloneDeep from 'lodash/cloneDeep';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'FileReviewDialog',
  mixins: [saveItem],
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      url: 'wholeprocess/fileReviewRecord',
      itemModel: {},
      emptyModel: {},
      isSee: false,
      formRules: {
        operateTime: [{ required: true, message: '请选评审时间', trigger: ['blur', 'change'] }],
      },
      // 附件上传相关参数
      readonly: false,
      isUpdate: false,
      isRequest: false,
      objectId: '',
    };
  },
  methods: {
    getEmptyItem() {
      return {
        fileId: '',
        operatorName: '',
        operatorId: '',
        operateTime: this.$tools.formatDate(new Date(), 'Y-m-d H:00:00'),
        auditRemark: '',
      };
    },
    openDialog(item) {
      if (item && item.id) {
        this.isSee = true;
        this.isRequest = true;
      }
      this.itemModel = Object.assign(this.getEmptyItem(), item.id ? item : {});
      this.itemModel.fileId = item.fileId;
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      // 重置获取附件，上传附件变量
      this.isUpdate = false;
      this.isRequest = false;
      this.isSee = false;
      this.itemModel = _cloneDeep(this.getEmptyItem());
      this.$refs.dialog.closeDialog();
    },
    // 保存弹窗 以及附件
    // 获取附件全网唯一标识符
    getAttachGuId() {
      return new Promise((resolve) => {
        this.loading = true;
        this.$http.get('sys/guid/new').then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$set(this.itemModel, 'id', response.data.data);
            resolve(response);
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
      });
    },
    // 保存记录
    onSaveCheck(callback) {
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        // 调用接口获取id
        if (!this.itemModel.id) { // 只有新增没有编辑
          this.getAttachGuId().then(() => {
            this.isUpdate = true;
            this.onSaveItem();
          });
        }
      });
    },
    // 发送保存记录请求
    onSaveItem() {
      this.saveLoading = true;
      this.$http.post(this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            this.$emit('query');
            this.closeDialog();
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
    },
  },
};
</script>

<style>
</style>
