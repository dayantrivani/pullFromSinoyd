<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}安全责任书回执`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="130px"
             :rules="rules"
             :model="itemModel">
      <el-row v-if="!showTitle">
        <el-col :span="24">
          <el-form-item label="责任书标题："
                        prop="belongYear">
            <el-select v-model="itemModel"
                       value-key="id"
                       @change="selectChange"
                       autofocus
                       clearable>
              <el-option v-for="item in choseItemList"
                         :key="item.id"
                         :label="item.title"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              v-if="showTitle">
        <el-col :span="24">
          <el-form-item label="标题："
                        prop="title">
            <el-input disabled
                      v-model="itemModel.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="show">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="年份："
                          prop="belongYear">
              <el-date-picker disabled
                              v-model="itemModel.belongYear"
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
              <el-input disabled
                        v-model="itemModel.responsibleName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="下发备注：">
              <el-input disabled
                        type="textarea"
                        v-model="itemModel.issueRemark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="签订人岗位："
                          prop="jobName">
              <el-input v-model="itemModel.jobName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="签订人姓名："
                          prop="contactName">
              <el-input v-model="itemModel.contactName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="签订人号码："
                          prop="contactPhone">
              <el-input v-model="itemModel.contactPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="签订时间："
                          prop="signingTime">
              <el-date-picker v-model="itemModel.signingTime"
                              type="date"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="回执备注：">
              <el-input type="textarea"
                        v-model="itemModel.receiptRemark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20"
                v-if="show">
          <el-col :span="24">
            <el-form-item label="责任书下发：">
              <upload-file :id="objectId"
                           :is-update="isUpdate[0]"
                           :isRequest="isRequest[0]"
                           :size-limilt="0"
                           :docTypeId="docTypeId[0]"
                           :btn="readOnly? 'down' : 'add down'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="责任书回执：">
              <upload-file :id="objectId"
                           :is-update="isUpdate[1]"
                           :isRequest="isRequest[1]"
                           :size-limilt="0"
                           :docTypeId="docTypeId[1]"
                           :btn="readOnly? 'down remove' : 'add down remove'" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck()">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  data() {
    const validateTel = (rule, value, callback) => {
      if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    return {
      url: 'wholeprocess/safetyResponsibilityAgreement',
      itemModel: this.getEmptyItem(),
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      show: false,
      showTitle: false,
      docTypeId: [],
      objectId: '',
      rules: {
        signingTime: [
          { required: true, message: '请选择日期', trigger: ['blur', 'change'] },
        ],
        jobName: [
          { required: true, message: '请输入签订人岗位名称', trigger: ['blur', 'change'] },
        ],
        contactName: [
          { required: true, message: '请输入签订人姓名', trigger: ['blur', 'change'] },
        ],
        contactPhone: [
          { required: true, message: '请输入签订人号码', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] },
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
    choseItemList: {
      type: Array,
    },
  },
  mixins: [saveItem],
  watch: {
    docType(val) {
      if (!val) return;
      const label = ['安全责任书下发附件', '安全责任书回执附件'];
      val.forEach((element) => {
        if (element.dictName === label[0]) {
          this.docTypeId[0] = element.rowGuid;
        }
        if (element.dictName === label[1]) {
          this.docTypeId[1] = element.rowGuid;
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
        responsibleDepId: '', //
        jobName: '', // 签订负责人岗位名称
        contactName: '', // 签订负责人姓名
        contactPhone: '', // 签订负责人联系方式
        issueRemark: '', // 备注
        signingTime: '', // 签订时间
        receiptRemark: '', // 回执备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.itemModel.belongYear = this.itemModel.belongYear.toString();
        this.objectId = this.itemModel.id;
        this.showTitle = true;
        this.show = true;
        this.isRequest = [true, true];
      }
      this.isUpdate = [false, false];
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.show = false;
      this.showTitle = false;
      this.isRequest = [false, false];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    selectChange() {
      this.show = true;
      this.objectId = this.itemModel.id;
      this.isRequest = [true, true];
      this.itemModel.belongYear = this.itemModel.belongYear.toString();
    },
    // 发送保存记录请求
    onSaveItem() {
      this.isUpdate = [true, true];
      this.saveLoading = true;
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.$refs.dialog.closeDialog();
            this.$emit('query');
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
    },
  },
};
</script>
