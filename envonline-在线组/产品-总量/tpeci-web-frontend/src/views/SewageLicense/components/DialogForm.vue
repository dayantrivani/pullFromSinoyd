<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${itemModel.id ? '编辑' : '新增'}许可证`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="rules"
      label-width="100px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <!-- 新增的时候从接口中获取,编辑的时候不能修改 -->
        <select-table
          v-model="itemModel.psId"
          :label="psName"
          :disable="isEdit"
          @change="getPsNameValue"
        >
        </select-table>
      </el-form-item>

      <el-form-item label="许可证编号：" prop="permitCode">
        <el-input v-model="itemModel.permitCode" clearable></el-input>
      </el-form-item>

      <el-form-item label="开始时间：" prop="permitStartDate">
        <el-date-picker
          v-model="itemModel.permitStartDate"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：" prop="permitEndDate">
        <el-date-picker
          v-model="itemModel.permitEndDate"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="签发日期：" prop="permitSignDate">
        <el-date-picker
          v-model="itemModel.permitSignDate"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="审批单位：" prop="signDepartment">
        <el-input v-model="itemModel.signDepartment" clearable></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
import SelectTable from '@/components/select-table';

export default {
  mixins: [saveItem],                       // 使用混合
  components: { SelectTable },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      url: 'bas/pollutantDischargePermit',  // 必须, 接口地址
      psName: '',                           // 企业名称--SelectTable组件
      itemModel: {                          // 表单对象
        psId: '',                           // 企业
        permitCode: '',                     // 许可证编码
        permitStartDate: `${new Date().getFullYear()}-01-01 00:00:00`,      // 开始日期
        permitEndDate: `${new Date().getFullYear()}-12-31 00:00:00`,        // 结束日期
        permitSignDate: `${new Date().getFullYear()}-01-01 00:00:00`,       // 签发日期
        permitStatus: 1,                    // 审核状态 0：未审核 1：已审核
        signDepartment: '',                 // 审核部门
      },
      rules: {                              // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        permitCode: [
          { required: true, message: '请输入许可证编码', trigger: ['blur', 'change'] },
        ],
        permitStartDate: [
          { required: true, message: '请选择开始日期', trigger: ['blur', 'change'] },
        ],
        permitEndDate: [
          { required: true, message: '请选择结束日期', trigger: ['blur', 'change'] },
        ],
        permitSignDate: [
          { required: true, message: '请选择签发日期', trigger: ['blur', 'change'] },
        ],
        signDepartment: [
          { required: true, message: '请输入审核部门', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    isEdit() {                      // 是否为编辑对话框
      return this.itemModel.id;
    },
  },
  methods: {
    openDialog(row) {               // 打开对话框
      this.$refs.dialog.openDialog();
      let val = row;
      this.psName = val ? val.psName : '';
      if (row) {
        val = _.cloneDeep(row);
        this.itemModel = this.setEmptyItem(val);
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /** 特殊方法 */
    getPsNameValue(name) {              // 企业组件修改父组件 PsName 值
      this.psName = name;
    },
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const st = new Date(this.itemModel.permitStartDate.replace(/-/g, '/')).getTime();
        const et = new Date(this.itemModel.permitEndDate.replace(/-/g, '/')).getTime();
        if (st > et) {
          this.$message({
            type: 'warning',
            message: '开始时间大于结束时间',
            showClose: true,
            duration: 3000,
          });
          return;
        }
        this.onSaveItem(callback);
      });
    },
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.psName = '';
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        psId: '',                 // 企业id
        permitCode: '',           // 许可证编码
        permitStartDate: `${new Date().getFullYear()}-01-01 00:00:00`,      // 开始日期
        permitEndDate: `${new Date().getFullYear()}-12-31 00:00:00`,        // 结束日期
        permitSignDate: `${new Date().getFullYear()}-01-01 00:00:00`,       // 签发日期
        permitStatus: 1,          // 审核状态 0：未审核 1：已审核
        signDepartment: '',       // 审核部门
      };
    },
    setEmptyItem(val) {             // 将列表数据赋值给表单数据
      return {
        id: val.id,                                      // 唯一标识符
        psId: val.psId || '',                            // 企业
        permitCode: val.permitCode || '',                // 许可证编码
        permitStartDate: val.permitStartDate || '',      // 开始日期
        permitEndDate: val.permitEndDate || '',          // 结束日期
        permitSignDate: val.permitSignDate || '',        // 签发日期
        permitStatus: val.permitStatus || '',            // 审核状态 0：未审核 1：已审核
        signDepartment: val.signDepartment || '',        // 审核部门
      };
    },
  },
};
</script>
