<template>
  <dialog-modal ref="dialog" size="small" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}承包商信息`" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="140px" :rules="rules" :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="承包商名称：" prop="contractorName">
            <el-input :maxlength="200" v-model="itemModel.contractorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承包项目：" prop="contractProject">
            <el-input :maxlength="200" v-model="itemModel.contractProject"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="作业内容：" prop="workContent">
            <el-input :maxlength="200" v-model="itemModel.workContent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业人数：" prop="workerNum">
            <el-input :maxlength="20" v-model="itemModel.workerNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="承包商责任人：" prop="personLiable">
            <el-input :maxlength="20" v-model="itemModel.personLiable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式：" prop="contacts">
            <el-input :maxlength="20" v-model="itemModel.contacts"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input :maxlength="500" type="textarea" v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="资质情况上传：">
            <upload-file :id="objectId" :is-update="isUpdate[0]" :isRequest="isRequest[0]" :size-limilt="0"
              :docTypeId="docTypeId[0]" :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承包协议上传：">
            <upload-file :id="objectId" :is-update="isUpdate[1]" :isRequest="isRequest[1]" :size-limilt="0"
              :docTypeId="docTypeId[1]" :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="安全工管协议上传：">
            <upload-file :id="objectId" :is-update="isUpdate[2]" :isRequest="isRequest[2]" :size-limilt="0"
              :docTypeId="docTypeId[2]" :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { validateNum, validateTel } from '@/libs/tools';

export default {
  data() {
    return {
      url: 'wholeprocess/contractorInfo',
      itemModel: this.getEmptyItem(),
      // 上传组件属性
      isUpdate: [false, false, false],  // 是否调用上传附件的接口
      isRequest: [false, false, false], // 是否调用获取附件列表的接口
      docTypeId: [],
      objectId: '',
      rules: {
        contractorName: [
          { required: true, message: '请输入承包商名称', trigger: ['blur', 'change'] },
        ],
        contractProject: [
          { required: true, message: '请输入承包项目', trigger: ['blur', 'change'] },
        ],
        personLiable: [
          { required: true, message: '请输入承包商负责人', trigger: ['blur', 'change'] },
        ],
        workerNum: [
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
        contacts: [
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
  },
  mixins: [saveItem],
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
  watch: {
    docType(val) {
      if (!val) return;
      const label = ['资质情况', '承包协议', '安全工管协议'];
      val.forEach((element) => {
        if (element.dictName === label[0]) {
          this.docTypeId[0] = element.rowGuid;
        }
        if (element.dictName === label[1]) {
          this.docTypeId[1] = element.rowGuid;
        }
        if (element.dictName === label[2]) {
          this.docTypeId[2] = element.rowGuid;
        }
      });
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        contractorName: '', // 承包商名称：
        contractProject: '', // 承包项目：
        workContent: '', // 作业内容：
        workerNum: '', // 作业人数：
        personLiable: '', // 承包商责任人：
        contacts: '', // 联系方式
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = [true, true, true];
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.isUpdate = [false, false, false];
      this.isRequest = [false, false, false];
      this.objectId = '';
      this.$emit('query');
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.objectId = this.itemModel.id;
      this.isUpdate = [true, true, true];
      this.$nextTick(() => {
        this.$refs.dialog.closeDialog();
      });
    },
  },
};
</script>
