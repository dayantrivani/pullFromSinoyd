<template>
  <!-- 处理记录 -->
  <!-- <div style="width: 100%; height: 100%;"> -->
  <dialog-modal
    title="处理记录"
    scrollbar
    view
    size="small"
    ref="dialog"
    @close="closeDialog"
  >
    <div class="mar-b-xs mar-l-sm fill-auto">
      <el-button type="primary" icon="fas fa-save" @click="onSaveCheck(saveCallback)">保 存</el-button>
    </div>
    <div class="title-info mar-t-xs mar-l-sm">走航异常处理</div>
    <hr class="mar-x-sm">
    <el-form
      ref="form"
      :rules="formRules"
      label-width="100px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <!-- <el-row :gutter="10">
        <el-col :span="10"> -->
        <el-form-item label="处理状态：" prop="status">
          <el-select v-model="itemModel.status">
            <el-option
              v-for="(item,index) in $enum.get('DEAL_STATUS')"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="24"> -->
        <el-form-item label="处理意见：" prop="dealContent">
          <el-input
            type="textarea"
            v-model="itemModel.dealContent"
            :autosize="{ minRows: 2, maxRows: 2}"
          ></el-input>
        </el-form-item>
        <!-- </el-col> -->
      <!-- </el-row> -->
    </el-form>

    <hr class="mar-x-sm block">
    <div class="title-info mar-t-xs mar-l-sm">附件详情</div>
    <div class="mar-y-xs" style="height:calc(100% - 208px);">
      <upload-table ref="upload"/>
    </div>
  </dialog-modal>
  <!-- </div> -->
</template>

<script>
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
// import { analyzeResp } from '@/global/libs/util';
import UploadTable from './components/UploadTable';

export default {
  name: 'DealRecord',
  mixins: [saveItem],
  components: {
    UploadTable,
  },
  data() {
    return {
      url: 'voyage/resultInfo',
      itemModel: {
        status: 0,           // 处理状态
        dealContent: '',     // 处理意见
      },
      formRules: {
        status: [
          { required: true, message: '请选择处理状态', trigger: ['blur', 'change'] },
        ],
        // dealContent: [
        //   { required: true, message: '请输入处理意见', trigger: ['blur', 'change'] },
        // ],
      },
    };
  },
  methods: {
    openDialog(row) {
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.upload.openDialog(row.id);
        this.$refs.form.clearValidate();
      });
    },

    /* 特殊方法 */
    onSaveCheck(callback) {
      this.itemModel.dealDate = this.$tools.formatDate(new Date(), 'Y-m-d H:i:s');
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    closeDialog() {
      this.$refs.upload.closeDialog();
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        status: 0,           // 处理状态
        dealContent: '',     // 处理意见
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
