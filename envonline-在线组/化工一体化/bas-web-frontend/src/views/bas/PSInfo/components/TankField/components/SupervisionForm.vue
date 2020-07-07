<template>
  <dialog-modal
    ref="supervisionform"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}监控因子`"
    append-to-body
    @close="closeDialog"
  >
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="80px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-form-item label="企业名称：">
        <el-input v-model="psnames" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="罐区名称：">
        <el-input v-model="tfname" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="摄像头：" prop="videoDeviceId">
        <el-select v-model="itemModel.videoDeviceId">
          <el-option
            v-for="item in vdioeData"
            :key="item.id"
            :label="item.channelName"
            :value="item.id">
          </el-option>
        </el-select>
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
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  props: {
    keyid: {
      default: '',
    },
    cutid: {
      default: '',
    },
    psnames: {
      default: '',
    },
    tfname: {
      default: '',
    },
  },
  data() {
    return {
      url: 'keypoints/tankFarmCameraInfo',
      itemModel: this.getEmptyItem(),
      rules: {
        videoDeviceId: [
          { required: true, message: '请选择摄像头', trigger: ['blur', 'change'] },
        ],
      },
      vdioeData: [],                    // 监控探头数据源
    };
  },
  watch: {
    'itemModel.videoDeviceId': {
      handler(val) {
        this.vdioeData.forEach((res) => {
          if (val === res.id) {
            this.itemModel.videoDeviceName = res.channelName;
            this.itemModel.videoDeviceCode = res.channelCode;
          }
        });
      },
    },
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {
    this.getVdioe();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.cutid,             // 企业Id
        tankFarmId: this.keyid,       // 罐区Id
        videoDeviceId: '',    // 设备Id
        videoDeviceName: '',          // 摄像头名称
        videoDeviceCode: '',          // 摄像头编码
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();

      // 是否获取单条记录
      // this.getItemOne(row);

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.supervisionform.openDialog();

      // 聚焦输入框
      // this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.$refs.supervisionform.closeDialog();
    },
    // 获取监控数据源
    getVdioe() {
      this.$http.get('cfg/videoDevice/find', {
        params: {
          psId: this.cutid,
        },
      }).then((response) => {
        if (response.data.success) {
          this.vdioeData = response.data.data;
        }
      });
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
