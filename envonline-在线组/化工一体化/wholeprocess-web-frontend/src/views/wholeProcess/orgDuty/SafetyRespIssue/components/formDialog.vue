<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}安全责任书下发`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="100px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="标题："
                        prop="title">
            <el-input v-model="itemModel.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="年份："
                        prop="belongYear">
            <el-date-picker v-model="itemModel.belongYear"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门："
                        prop="responsibleDepId"
                        hint-down>
            <dept-table v-model="itemModel.responsibleDepId"
                        :label="itemModel.responsibleName">
            </dept-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="下发备注：">
            <el-input type="textarea"
                      v-model="itemModel.issueRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="责任书下发：">
            <upload-file :id="objectId"
                         :is-update="isUpdate"
                         :isRequest="isRequest"
                         :size-limilt="0"
                         :docTypeId="docTypeId[0]"
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
import deptTable from '@/components/select-table-deptSingle';

export default {
  data() {
    return {
      url: 'wholeprocess/safetyResponsibilityAgreement',
      itemModel: this.getEmptyItem(),
      isUpdate: false,  // 是否调用上传附件的接口
      isRequest: false, // 是否调用获取附件列表的接口
      docTypeId: [],
      objectId: '',
      rules: {
        belongYear: [
          { required: true, message: '请选择年份', trigger: ['blur', 'change'] },
        ],
        title: [
          { required: true, message: '请输入标题', trigger: ['blur', 'change'] },
        ],
        responsibleDepId: [
          { required: true, message: '请选择部门', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  props: {
    docType: {
      type: Array,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [saveItem],
  components: { deptTable },
  watch: {
    docType(val) {
      if (!val) return;
      const label = ['安全责任书下发附件'];
      val.forEach((element) => {
        if (element.dictName === label[0]) {
          this.docTypeId[0] = element.rowGuid;
        }
      });
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        title: '', // 标题（不能重复）
        belongYear: '', // 所属年份
        issueRemark: '', // 备注
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
        this.itemModel.belongYear = this.itemModel.belongYear.toString();
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
