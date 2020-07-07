<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}建议信息`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="130px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="主题："
                        prop="subject">
            <el-input disabled
                      v-model="itemModel.subject"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类别："
                        prop="type">
            <el-select disabled
                       v-model="itemModel.type"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.AGREEMENTTYPE"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建言人："
                        prop="propounderUserName">
            <el-input disabled
                      v-model="itemModel.propounderUserName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="内容："
                        prop="content">
            <markdown v-model="itemModel.content"></markdown>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <hr class="block mar-y-0 mar-t-xs mar-b-xs" />
        <el-col :span="12"
                class="title-info mar-t-xs mar-b-xs">审核</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="审核意见："
                        prop="remark">
            <el-input type="textarea"
                      v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核人："
                        prop="dealUserName">
            <el-input disabled
                      v-model="itemModel.dealUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审核状态："
                        prop="dealStatus">
            <el-select v-model="itemModel.dealStatus"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.REVIEWSTATUS"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核时间："
                        prop="dealDate">
            <el-date-picker v-model="itemModel.dealDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
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
      url: 'wholeprocess/rationalizationProposal',
      itemModel: this.getEmptyItem(),
      rules: {
        dealDate: [
          { required: true, message: '请选择审核时间', trigger: ['blur', 'change'] },
        ],
        dealStatus: [
          { required: true, message: '请选择审核状态', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  components: { markdown },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid', 'userName']),
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
        propounderUserId: '', // 审核id
        type: '', // 审核人
        subject: '',
        propounderUserName: this.userName, // 批准人ID
        content: '',
        dealStatus: '',
        dealDate: '',
        dealUserId: this.orgGuid,
        dealUserName: this.userName,
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
      this.itemModel = Object.assign(this.getEmptyItem(), row);
      this.itemModel.dealUserId = this.orgGuid;
      this.itemModel.dealUserName = this.userName;
      this.objectId = this.itemModel.id;
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    callback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
