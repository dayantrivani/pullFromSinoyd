<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}公辅设施情况`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="150px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="企业名称：" prop="psId" hint-down>
              <select-table v-model="itemModel.psId" :label="psName" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="是否使用天然气：" prop="isUseGas">
              <el-tooltip :content="itemModel.isUseGas ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isUseGas"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否使用蒸汽：" prop="isUseSteam">
              <el-tooltip :content="itemModel.isUseSteam ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isUseSteam"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="是否使用焚烧炉：" prop="isUseIncinerator">
              <el-tooltip :content="itemModel.isUseIncinerator ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isUseIncinerator"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否使用RTO：" prop="isUseRTO">
              <el-tooltip :content="itemModel.isUseRTO ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isUseRTO"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="是否使用锅炉：" prop="isUseBoiler">
              <el-tooltip :content="itemModel.isUseBoiler ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isUseBoiler"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否使用热导油炉：" prop="isUseOilStove">
              <el-tooltip :content="itemModel.isUseOilStove ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isUseOilStove"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="是否使用空气加热器：" prop="isAirHeater">
              <el-tooltip :content="itemModel.isAirHeater ? '是' : '否'" placement="top">
                <el-switch
                  v-model="itemModel.isAirHeater"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
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
// import { mapGetters } from 'vuex';
import SelectTable from '@/components/select-table';
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [saveItem],
  components: {
    SelectTable,
  },
  data() {
    return {
      url: 'bas/psPublicSupplySettings',  // 必须, 接口地址
      loading: false,               // 表单加载状态
      psName: '',                   // 企业名称
      formRules: {                  // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        // isUseGas: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isUseSteam: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isUseIncinerator: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isUseRTO: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isUseBoiler: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isUseOilStove: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isAirHeater: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
      },
      itemModel: {                  // 表单对象
        psId: '',                   // 企业
        isUseGas: false,            // 是否使用天然气
        isUseSteam: false,          // 是否使用蒸汽
        isUseIncinerator: false,    // 是否使用焚烧炉
        isUseRTO: false,            // 是否使用RTO
        isUseBoiler: false,         // 是否使用锅炉
        isUseOilStove: false,       // 是否使用热导油炉
        isAirHeater: false,         // 是否使用空气加热器
        remark: null,               // 备注
      },
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = row || this.getEmptyItem();
      this.psName = row ? row.psName : '';
      this.$refs.dialog.openDialog();
      this.getDictList();
    },
    closeDialog() {       // 关闭对话框
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },

    /** 请求接口 */

    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        psId: '',                   // 企业
        isUseGas: false,            // 是否使用天然气
        isUseSteam: false,          // 是否使用蒸汽
        isUseIncinerator: false,    // 是否使用焚烧炉
        isUseRTO: false,            // 是否使用RTO
        isUseBoiler: false,         // 是否使用锅炉
        isUseOilStove: false,       // 是否使用热导油炉
        isAirHeater: false,         // 是否使用空气加热器
        remark: null,               // 备注
      };
    },
  },
};
</script>
