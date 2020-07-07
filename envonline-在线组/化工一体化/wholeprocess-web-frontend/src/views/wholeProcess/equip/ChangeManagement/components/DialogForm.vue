<template>
  <dialog-modal type="title" size="mini" ref="dialog" maxScrollbar :title="title" @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space el-box" ref="form" :rules="formRules" label-position="right" label-width="115px"
      :model="itemModel">
      <el-form-item label="变更名称：" prop="changeName" hint-down>
        <el-input v-model="itemModel.changeName" clearable :readonly="+params.type !== 1"></el-input>
      </el-form-item>
      <el-form-item label="申请人：" prop="applicantId">
        <select-info-table
          v-model="itemModel.applicantId"
          :isPsId="false"
          type="pe"
          title="选择人员"
          :label="itemModel.applicantName || ''"
          :readonly="+params.type !== 1"
          @selectRow='peSelectRow' />
      </el-form-item>
      <el-form-item label="部门：" prop="deptId">
        <select-info-table
          v-model="itemModel.deptId"
          :isPsId="false"
          type="dp"
          title="选择部门"
          :label="itemModel.deptName || ''"
          :readonly="+params.type !== 1"
          @selectRow='dpSelectRow' />
      </el-form-item>
      <el-form-item label="变更日期：">
        <el-date-picker style="width: 100%;" v-model="itemModel.changeDate" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00" :disabled="+params.type !== 1"></el-date-picker>
      </el-form-item>
      <el-form-item label="变更说明的技术依据：">
        <el-input type="textarea" v-model="itemModel.technicalBasis" :autosize="{ minRows: 2 }" :readonly="+params.type !== 1"></el-input>
      </el-form-item>
      <el-form-item label="风险分析的管控对策：">
        <el-input type="textarea" v-model="itemModel.controlMeasures" :autosize="{ minRows: 2 }" :readonly="+params.type !== 1"></el-input>
      </el-form-item>
      <el-form-item label="上传技术文件：">
        <upload-file
          :id="itemModel.id"
          docTypeId="1"
          :btn="+params.type !== 1 ? 'down' : 'add down remove'"
          :is-update="isUpdate"
          :is-request="isRequest"
          @update-recover="updateRecover"
          :readonly="+params.type !== 1" />
          <!-- @update-success="updateSuccess"  -->
      </el-form-item>
      <el-form-item label="现场照片：">
        <upload-file
          :typeLimilt="['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']"
          :id="itemModel.id"
          docTypeId="2"
          :btn="+params.type !== 1 ? 'down' : 'add down remove'"
          :is-update="isUpdate"
          :is-request="isRequest"
          @update-recover="updateRecover"
          :readonly="+params.type !== 1" />
          <!-- @update-success="updateSuccess"  -->
      </el-form-item>
      <!-- 审核人员 审核表单 -->
      <template v-if="+params.type >= 2">
        <el-form-item label="审核人：" prop="auditorId">
          <select-info-table
            v-model="itemModel.auditorId"
            :isPsId="false"
            type="pe"
            title="选择人员"
            :label="itemModel.auditorName || ''"
            :readonly="+params.type !== 2"
            @selectRow='peAuditorSelectRow' />
        </el-form-item>
        <el-form-item label="审核结果：" prop="dataStatus">
          <el-select v-model="itemModel.dataStatus" :readonly="+params.type !== 2">
            <el-option label="同意" :value="10"></el-option>
            <el-option label="不同意" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期：">
          <el-date-picker style="width: 100%;" v-model="itemModel.auditDate" type="date" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00" :disabled="+params.type !== 2"></el-date-picker>
        </el-form-item>
      <el-form-item label="审核意见：">
        <el-input type="textarea" v-model="itemModel.auditRemark" :autosize="{ minRows: 2 }" :readonly="+params.type !== 2"></el-input>
      </el-form-item>
      </template>
      <!-- 验收人员 验收表单 -->
      <template v-if="+params.type >= 3">
        <el-form-item label="验收人：" prop="acceptId">
          <select-info-table
            v-model="itemModel.acceptId"
            :isPsId="false"
            type="pe"
            title="选择人员"
            :label="itemModel.acceptName || ''"
            :readonly="+params.type !== 3"
            @selectRow='peAcceptSelectRow' />
        </el-form-item>
        <el-form-item label="验收结果：" prop="acceptStatus">
          <el-select v-model="itemModel.acceptStatus" :readonly="+params.type !== 3">
            <el-option label="同意" :value="10"></el-option>
            <el-option label="不同意" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="验收时间：">
          <el-date-picker style="width: 100%;" v-model="itemModel.acceptDate" type="date" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00" :disabled="+params.type !== 3"></el-date-picker>
        </el-form-item>
        <el-form-item label="验收结论：">
          <el-input type="textarea" v-model="itemModel.acceptRemark" :autosize="{ minRows: 2 }" :readonly="+params.type !== 3"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [saveItem], // 使用混合
  data() {
    return {
      params: { // 当前模块配置，区分变更申请，变更审核，变更验收
        title: '',
        type: 1,
      },
      url: 'wholeprocess/changeManagement', // 必须, 接口地址
      itemModel: {}, // 表单对象
      contactId: true, // 人员ID
      formRules: {
        changeName: [{ required: true, message: '请输入变更名称', trigger: ['blur', 'change'] }],
        applicantId: [{ required: true, message: '请选择申请人', trigger: ['blur', 'change'] }],
        deptId: [{ required: true, message: '请选择部门', trigger: ['blur', 'change'] }],
      },
      // 附件上传参数
      isUpdate: false,
      isRequest: false,
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
    route() { return this.$route; },
    title() {
      let type = '';
      if (this.params.type === 1) {
        type = this.isEdit ? '编辑' : '新增';
      }
      return `${type}${this.params.title}`;
    },
  },
  watch: {
    route: {
      handler(val) {
        this.params = { ...val.meta };
      },
      immediate: true,
    },
  },
  methods: {
    getEmptyItem() {
      return {
        inspectionDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        expiryDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
      };
    },
    // 打开对话框
    openDialog(row) {
      this.getDictList();
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.isRequest = true;
        if (+this.params.type === 2) {
          this.itemModel.dataStatus = row.dataStatus || '';
        } else if (+this.params.type === 3) {
          this.itemModel.acceptStatus = row.acceptStatus || '';
        }
      } else {
        this.itemModel.psId = this.$store.state.auth.user.orgGuid;
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.isUpdate = false;
      this.isRequest = false;
      this.$refs.dialog.closeDialog();
    },
    saveCallback() { // 保存结束后关闭弹窗
      this.isUpdate = true;
    },
    updateRecover() { // 上传附件结束后关闭弹窗
      this.closeDialog();
      this.$emit('query');
    },
    dpSelectRow(item) { // 选择部门
      this.itemModel.deptName = item.deptName;
    },
    peSelectRow(item) { // 选择负责人
      this.itemModel.applicantName = item.name;
      this.itemModel.applicantPhone = item.mobilePhone;
    },
    peAuditorSelectRow(item) { // 选择审核人
      this.itemModel.auditorName = item.name;
    },
    peAcceptSelectRow(item) { // 选择验收人
      this.itemModel.acceptName = item.name;
    },
    // 发送请求
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      const { id } = this.itemModel;
      let type = id ? 'put' : 'post';
      let url = '';
      if (+this.params.type > 1) {
        type = 'post';
        if (+this.params.type === 2) {
          url = '/review';
        } else if (+this.params.type === 3) {
          url = '/check';
        }
      }
      this.$http[type](`${this.url}${url}`, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            if (callback) {
              callback(response.data.data);
            } else {
              // this.$emit('query');
            }
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
