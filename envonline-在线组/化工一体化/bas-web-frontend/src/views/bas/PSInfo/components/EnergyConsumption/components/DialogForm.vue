<template>
  <dialog-modal
    ref="dialogform"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}能耗表信息`"
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="89px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-form-item label="所属类型：" prop="type">
        <el-select v-model="itemModel.type">
          <el-option :value="1" label="电表"></el-option>
          <el-option :value="2" label="水表"></el-option>
          <el-option :value="3" label="汽表"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isGas" label="汽表类型：" prop="subType">
        <el-select v-model="itemModel.subType">
          <el-option :value="1" label="低压"></el-option>
          <el-option :value="2" label="中压"></el-option>
          <el-option :value="3" label="高压"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model="itemModel.name" autofocus></el-input>
      </el-form-item>
      <el-form-item label="编码：" prop="code">
        <el-input v-model="itemModel.code" autofocus></el-input>
      </el-form-item>
      <el-form-item label="是否总进线：">
        <el-tooltip :content="itemModel.isIncomingLine ? '是' : '否'" placement="top">
          <el-switch
            v-model="itemModel.isIncomingLine"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="经度：">
        <el-input v-model="itemModel.longitude">
          <template slot="append">
            <el-button @click="selectLngLat()" icon="fas fa-map-marker-alt"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="纬度：">
        <el-input v-model="itemModel.latitude">
          <template slot="append">
            <el-button @click="selectLngLat()" icon="fas fa-map-marker-alt"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="安装位置：">
        <el-input v-model="itemModel.address" autofocus></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          v-model="itemModel.remark"
          :autosize="{ minRows: 2, maxRows: 2}"
        ></el-input>
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
    <dialog-modal ref="lngLatDialog" append-to-body size="middle" scrollbar>
      <iframe
        ref="iframe"
        src="selectLngLat/selectLngLat.html"
        style="width: 100%; height: calc(86vh - 60px);">
      </iframe>
    </dialog-modal>
  </dialog-modal>
</template>

<script>
import { mapState } from 'vuex';
// import rules from './rules';
import { saveItem } from '@/global/libs/mixins';

export default {
  name: 'SafetyProductLicenseInfo',
  // 使用混合
  mixins: [
    saveItem,
  ],
  // components: { UploadPicture },
  // props: ['psid'],
  data() {
    return {
      url: 'energy/equipmentInfo',                  // 必须, 接口地址
      itemModel: this.getEmptyItem(),
      rules: {
        type: [{ required: true, message: '请选择所属类型', trigger: ['blur', 'change'] }],
        subType: [{ required: true, message: '请选择汽表类型', trigger: ['blur', 'change'] }],
        name: [{ required: true, message: '请输入名称', trigger: ['blur', 'change'] }],
        code: [{ required: true, message: '请输入编码', trigger: ['blur', 'change'] }],
      },
      isGas: false,
    };
  },
  created() {
    this.getDictList();
  },
  watch: {
    'itemModel.type': {
      handler(newData, oldData) {
        if (newData !== oldData) {
          this.itemModel.isIncomingLine = false;
        }
        if (newData === 3) {
          this.isGas = true;
        } else {
          this.isGas = false;
        }
      },
    },
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
    // 企业信息
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  methods: {
    selectLngLat() {
      this.$refs.lngLatDialog.openDialog();
      this.$nextTick(() => {
        this.iframeWindow = this.$refs.iframe.contentWindow;
        this.iframeWindow.addEventListener('message', this.receiveMessage, false);
      });
    },
    receiveMessage(event) {
      this.itemModel.longitude = event.data.longitude;
      this.itemModel.latitude = event.data.latitude;
      this.$refs.lngLatDialog.closeDialog();
    },
    // 获取经度
    getLongitude() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.itemModel.longitude = position.coords.longitude;
        });
      }
    },
    // 获取纬度
    getLatitude() {
      this.$refs.map.openDialog();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.itemModel.longitude = position.coords.latitude;
        });
      }
    },
    // 获取空对象
    getEmptyItem() {
      return {
        type: '',                         // 发证机关
        subType: '',
        name: '',                         // 名称
        code: '',
        isIncomingLine: false,
        longitude: '',                    // 经度
        latitude: '',                     // 纬度
        address: '',                      // 安装地址
        remark: '',                       // 备注
      };
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.isGas = row.type === 3 ? 1 : 0;
      }
      this.itemModel.psId = this.psInfo.id;
      // 是否获取单条记录
      // this.getItemOne(row);

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.dialogform.openDialog();

      // 聚焦输入框
      // this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.$refs.dialogform.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
