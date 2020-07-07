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
            <el-input v-model="itemModel.subject"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="建议类别："
                        prop="type">
            <el-select v-model="itemModel.type"
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
        subject: [
          { required: true, message: '请输入主题', trigger: ['blur', 'change'] },
        ],
        type: [
          { required: true, message: '请选择建议类别', trigger: ['blur', 'change'] },
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
        propounderUserId: '', // 建言人id
        type: '', // 建议类别：
        subject: '', // 主题：
        propounderUserName: this.userName, // 建言人
        content: '',
        dealStatus: 0,
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
      } else {
        this.itemModel = this.getEmptyItem();
      }
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
