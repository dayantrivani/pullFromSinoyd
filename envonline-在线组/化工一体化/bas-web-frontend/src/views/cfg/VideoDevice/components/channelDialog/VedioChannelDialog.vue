<template>
  <dialog-modal ref="dialog" size="mini" :title="`${isEdit ? '编辑' : '新增'}通道`">
    <el-form
      ref="form"
      label-position="right"
      label-width="140px"
      :model="itemModel"
      :rules="rules"
    >
      <el-row>
        <el-form-item label="设备编号：" prop="devCode">
          <el-input v-model="itemModel.devCode"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="通道编号：" prop="channelCode">
            <el-input v-model="itemModel.channelCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="通道数：" prop="channelNum">
          <el-input v-model="itemModel.channelNum"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="通道名称：" prop="channelName">
          <el-input v-model="itemModel.channelName"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="Rtmp的配置信息：" prop="channelRtmp">
          <el-input v-model="itemModel.channelRtmp"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="完整配置信息：" prop="channelConfig">
            <el-input type="textarea" v-model="itemModel.channelConfig"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="formLoading"
        @click="onSaveCheck(saveCallback)"
      >保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import formRules from './rules';

export default {
  data() {
    return {
      url: 'cfg/videoChannel',
      itemModel: this.getEmptyItem(),
      rules: formRules,
    };
  },
  mixins: [saveItem],
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
        devId: '',
        devCode: '',
        channelCode: '',
        channelNum: '',
        channelName: '',
        channelRtmp: '',
        channelConfig: '',
      };
    },
    // 打开对话框
    openDialog(row, mainId) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
      }
      this.itemModel.devId = mainId;
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
  },
};
</script>
