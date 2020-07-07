<template>
  <dialog-modal type="title" size="mini" ref="dialog" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}生产装置开停车管理`" @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space el-box" ref="form" :rules="formRules" label-position="right" label-width="115px"
      :model="itemModel">
      <el-form-item label="方案名称：" prop="planName" hint-down>
        <el-input v-model="itemModel.planName" clearable></el-input>
      </el-form-item>
      <el-form-item label="方案编号：" prop="planCode">
        <el-input v-model="itemModel.planCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="编制部门：" prop="domainId">
        <select-info-table
          v-model="itemModel.domainId"
          :isPsId="false"
          type="dp"
          title="选择部门"
          :label="itemModel.depName || ''"
          @selectRow='dpSelectRow' />
      </el-form-item>
      <el-form-item label="实施负责人：" prop="mobilePhone">
        <select-info-table
          :value="1"
          :isPsId="false"
          type="pe"
          title="选择人员"
          :label="itemModel.contactName || ''"
          @selectRow='peSelectRow' />
      </el-form-item>
      <el-form-item label="停车时间：">
        <el-date-picker style="width: 100%;" v-model="itemModel.stopDate" type="datetime" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:00"></el-date-picker>
      </el-form-item>
      <el-form-item label="开车时间：">
        <el-date-picker style="width: 100%;" v-model="itemModel.startDate" type="datetime" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:00"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否完成审核批准：" prop="isApproved" label-width="140px">
        <el-tooltip :content="itemModel.isApproved ? '是' : '否'" placement="top">
          <el-switch
            v-model="itemModel.isApproved"
            active-color="#13ce66"
            inactive-color="#c3c3c3"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="审核批准时间：">
        <el-date-picker style="width: 100%;" v-model="itemModel.approveTime" type="datetime" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:00"></el-date-picker>
      </el-form-item>
    </el-form>
    <el-form label-width="215px" label-position="top">
      <el-form-item label="方案详情、各部门审核签字表：">
        <upload-file
          class="text-center"
          :id="itemModel.id"
          :is-update="isUpdate"
          :is-request="isRequest"
          @update-recover="updateRecover" />
          <!-- @update-success="updateSuccess"  -->
      </el-form-item>
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

export default {
  mixins: [saveItem], // 使用混合
  data() {
    return {
      url: 'wholeprocess/safetyDeviceStartStopPlan', // 必须, 接口地址
      itemModel: {}, // 表单对象
      contactId: true, // 人员ID
      formRules: {
        planName: [{ required: true, message: '请输入方案名称', trigger: ['blur', 'change'] }],
        planCode: [{ required: true, message: '请输入方案编号', trigger: ['blur', 'change'] }],
        domainId: [{ required: true, message: '请选择部门', trigger: ['blur', 'change'] }],
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
      } else {
        this.itemModel.psId = this.$store.state.auth.user.orgGuid;
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
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
      this.itemModel.depName = item.deptName;
    },
    peSelectRow(item) { // 选择负责人
      this.itemModel.contactName = item.name;
      this.itemModel.contactPhone = item.mobilePhone;
    },
  },
};
</script>
