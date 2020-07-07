<template>
  <dialog-modal
    ref="dialog"
    size="small"
    maxScrollbar
    :title="`${isEdit ? '修正' : '规划'}环评手续执行情况`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="100px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="规划名称：" prop="planningName" hint-down>
              <el-input v-model="itemModel.planningName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划时间：" prop="planningTime" hint-down>
              <el-date-picker
                style="width:135px"
                v-model="itemModel.planningTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="负责人：" prop="contactName">
              <el-input v-model="itemModel.contactName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="contactPhone">
              <el-input v-model="itemModel.contactPhone"></el-input>
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
  props: {
    // dictParent: {     // 常量
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      url: 'bas/parkPlanningImplSituation',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      isUpload: false,              // 上传附件
      formRules: {                  // 表单验证
        planningName: [
          { required: true, message: '请输入规划名称', trigger: ['blur', 'change'] },
        ],
        planningTime: [
          { required: true, message: '请选择规划时间', trigger: ['blur', 'change'] },
        ],
        contactName: [
          { required: true, message: '请输入负责人姓名', trigger: ['blur', 'change'] },
        ],
        contactPhone: [
          { required: true, message: '请输入联系方式', trigger: ['blur', 'change'] },
          { pattern: /^[0-9]+$/, message: '请输入数字' },
        ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: ['blur', 'change'] },
        // ],
      },
      itemModel: {                  // 表单对象
        planningName: '',  // 规划名称
        planningTime: '',  // 规划时间
        contactName: '',   // 负责人姓名
        contactPhone: '',  // 联系方式
        remark: '',        // 备注
      },
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  watch: {
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
        // const cRow = _.cloneDeep(row);
        // this.itemModel = {
        //   id: cRow.id,                       // 唯一标识
        //   planningName: cRow.planningName,   // 规划名称
        //   planningTime: cRow.planningTime,   // 规划时间
        //   contactName: cRow.contactName,     // 负责人姓名
        //   contactPhone: cRow.contactPhone,   // 联系方式
        //   remark: cRow.remark,        // 备注
        // };
        // this.$refs.upload.isUpload = true;
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.upload.getItemList();
      });
    },
    closeDialog() {       // 关闭对话框
      // this.tankFarmList = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },

    /** 请求接口 */

    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.upload.isUpload = true;
      // this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        planningName: '',  // 规划名称
        planningTime: '',  // 规划时间
        contactName: '',   // 负责人姓名
        contactPhone: '',  // 联系方式
        remark: '',        // 备注
      };
    },
  },
};
</script>
