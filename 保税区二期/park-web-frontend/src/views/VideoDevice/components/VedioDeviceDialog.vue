<template>
  <dialog-modal ref="dialog"
                size="middle"
                :title="`${isEdit ? '编辑' : '新增'}摄像头装置`">
    <el-form ref="form"
             label-position="right"
             label-width="160px"
             :model="itemModel"
             :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属企业："
                        prop="psId"
                        hint-down>
            <el-select v-model="itemModel.psId"
                       autofocus
                       filterable
                       :disabled="itemModel.id">
              <el-option v-for="(item, index) in psBaseList"
                         :key="index"
                         :label="item.psName"
                         :value="item.psId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编号："
                        prop="devCode">
            <el-input v-model="itemModel.devCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备名称："
                        prop="devName">
            <el-input v-model="itemModel.devName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备状态："
                        prop="devStatus">
            <el-select v-model="itemModel.devStatus"
                       autofocus>
              <el-option v-for="(item, key) in $enum.get('DEVSTATUS')"
                         :key="key"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备ip："
                        prop="devIp">
            <el-input v-model="itemModel.devIp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备流端口："
                        prop="devStreamPort">
            <el-input v-model="itemModel.devStreamPort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备端口："
                        prop="devPort">
            <el-input v-model="itemModel.devPort"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备用户名："
                        prop="devUser">
            <el-input v-model="itemModel.devUser"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备密码："
                        prop="devPassWord">
            <el-input v-model="itemModel.devPassWord"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="webSocktIp地址："
                        prop="webSocktIp">
            <el-input v-model="itemModel.webSocktIp"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产型号："
                        prop="devModel">
            <el-input v-model="itemModel.devModel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="webSockPort端口号："
                        prop="webSockPort">
            <el-input v-model="itemModel.webSockPort"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="生产厂商："
                        prop="devManufactureName">
            <el-input v-model="itemModel.devManufactureName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备的类型："
                        prop="devTypeId">
            <el-select v-model="itemModel.devTypeId"
                       autofocus>
              <el-option v-for="(item, key) in $enum.get('DEVTYPE')"
                         :key="key"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备描述："
                        prop="devDesc">
            <el-input type="textarea"
                      v-model="itemModel.devDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="formLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import formRules from './rules';

export default {
  data() {
    return {
      url: 'cfg/videoDevice',
      itemModel: this.getEmptyItem(),
      psBaseList: [],
      rules: formRules,
    };
  },
  mixins: [saveItem],
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.getPsBaseList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: '',
        devCode: '',
        devName: '',
        devStatus: '',
        devIp: '',
        devStreamPort: '',
        devPort: '',
        devUser: '',
        devPassWord: '',
        webSocktIp: '',
        devModel: '',
        webSockPort: '',
        devManufactureName: '',
        devDesc: '',
        devTypeId: 'default',
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
      }
      // 这个字段暂时无效,填写默认
      this.itemModel.devTypeId = 'default';
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
    /** 特殊方法 */
    onSaveCheck(saveCallback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(saveCallback);
      });
    },
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
  },
};
</script>
