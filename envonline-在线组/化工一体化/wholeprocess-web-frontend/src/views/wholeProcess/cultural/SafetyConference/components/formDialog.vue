<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}会议信息`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="130px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="会议主题："
                        prop="subject">
            <el-input v-model="itemModel.subject"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="会议时间："
                        prop="conferenceDate">
            <el-date-picker v-model="itemModel.conferenceDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="会议类型："
                        prop="type">
            <el-select v-model="itemModel.type"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.CONFERENCETYPE"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议状态："
                        prop="status">
            <el-select v-model="itemModel.status"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.CONFERENCESTATUS"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="会议地址："
                        prop="address">
            <el-input v-model="itemModel.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="会议记录："
                        prop="remark">
            <markdown v-model="itemModel.remark"></markdown>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="会议附件：">
            <upload-file :id="objectId"
                         :is-update="isUpdate"
                         :isRequest="isRequest"
                         :size-limilt="0"
                         :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(callback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import markdown from '@/components/markdown';

export default {
  data() {
    return {
      url: 'wholeprocess/safetyConference',
      itemModel: this.getEmptyItem(),
      isUpdate: false,  // 是否调用上传附件的接口
      isRequest: false, // 是否调用获取附件列表的接口
      objectId: '',
      rules: {
        subject: [
          { required: true, message: '请输入会议主题', trigger: ['blur', 'change'] },
        ],
        conferenceDate: [
          { required: true, message: '请选择会议日期', trigger: ['blur', 'change'] },
        ],
        status: [
          { required: true, message: '请选择会议状态', trigger: ['blur', 'change'] },
        ],
        address: [
          { required: true, message: '请选择会议地址', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  components: { markdown },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        subject: '', // 会议主题：
        conferenceDate: '', // 会议时间：
        type: '', // 会议类型：
        address: '', // 会议地址：
        status: 3, // 会议状态：
        remark: '', // 会议记录：
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(saveCallback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(saveCallback);
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = true;
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.isUpdate = false;
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isRequest = false;
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    callback() {
      this.objectId = this.itemModel.id;
      this.isUpdate = true;
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
