<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '修改' : '新增'}用地规划`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="120px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="规划文件名称：" prop="planDocName" hint-down>
              <el-input v-model="itemModel.planDocName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="规划启用时间：" prop="planStartTime">
              <el-date-picker
                v-model="itemModel.planStartTime"
                type="date"
                placeholder="选择日期"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="添加附件：">
              <upload-plural
                ref="upload"
                :isUpload="isUpload"
                :id="itemModel.id || ''"
                :isOnly="true"
                @success="$refs.dialog.closeDialog()"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
// import { analyzeResp } from '@/global/libs/util';
import UploadPlural from '@/components/upload-plural';

export default {
  // 使用混合
  mixins: [saveItem],
  components: {
    UploadPlural,
  },
  data() {
    return {
      url: 'bas/parkLandUsePlanning',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      isUpload: false,
      saveLoading: false,           // 保存按钮加载状态
      formRules: {                  // 表单验证
        planDocName: [
          { required: true, message: '请输入规划文件名称', trigger: ['blur', 'change'] },
        ],
        planStartTime: [
          { required: true, message: '请选择规划启用时间', trigger: ['blur', 'change'] },
        ],
      },
      itemModel: {                  // 表单对象
        planDocName: '',            // 规划文件名称
        planStartTime: '',          // 规划启用时间
        remark: '',                 // 备注
        // uploadFileName: '',     // 上传文件名称
        // uploadFileTime: '',         // 上传文件时间
      },
      success: false,               // 是否上传成功
      row: null,                    // 记录第一次上传的数据
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.$refs.upload.getItemList();
      });
    },
    closeDialog() {       // 关闭对话框
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },

    /** 请求接口 */

    /** 特殊方法 */
    onSaveCheck(callback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    saveCallback() {         // 保存数据成功后的回调
      this.$emit('query');
      this.$refs.upload.isUpload = true;
      // this.$refs.dialog.closeDialog();
      // if (this.success) {
      //   this.$emit('query');
      //   this.$refs.dialog.closeDialog();
      // } else {
      //   this.$refs.upload.isUpload = true;
      //   this.itemModel = data || {};
      // }
    },
    getEmptyItem() {         // 获取空对象
      return {
        planDocName: '',            // 规划文件名称
        planStartTime: '',          // 规划启用时间
        remark: '',                 // 备注
        // uploadFileName: '',         // 上传文件名称
      };
    },
  },
};
</script>
