<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}费用提取`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="130px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="使用日期："
                        prop="useDate">
            <el-date-picker v-model="itemModel.useDate"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="部门："
                        prop="useDepId"
                        hint-down>
            <dept-table v-model="itemModel.useDepId"
                        :label="itemModel.useDepName">
            </dept-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="支出项目类别："
                        prop="expenditureTypeCodeId">
            <el-select v-model="itemModel.expenditureTypeCodeId"
                       autofocus
                       clearable>
              <el-option v-for="item in ExpenditureType"
                         :key="item.rowGuid"
                         :label="item.dictName"
                         :value="item.rowGuid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="金额（万元）："
                        prop="useMoneyAmount">
            <el-input v-model="itemModel.useMoneyAmount"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="经办人："
                        prop="operatorId">
            <person-single @selected="selectOperatorData"
                           :label="itemModel.operatorName">
            </person-single>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="审核人："
                        prop="dealUserId">
            <person-single @selected="selectDealUserData"
                           :label="itemModel.dealUserName">
            </person-single>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="批准人："
                        prop="approverUserId">
            <person-single @selected="selectApproverUserData"
                           :label="itemModel.approverUserName">
            </person-single>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="具体用途："
                        prop="specificUse">
            <el-input type="textarea"
                      v-model="itemModel.specificUse"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import personSingle from '@/components/select-table-personSingle';
import deptTable from '@/components/select-table-deptSingle';

export default {
  data() {
    return {
      url: 'wholeprocess/safetyProductionCostUse',
      itemModel: this.getEmptyItem(),
      rules: {
        useDepId: [
          { required: true, message: '请选择部门', trigger: ['blur', 'change'] },
        ],
        useDate: [
          { required: true, message: '请选择日期', trigger: ['blur', 'change'] },
        ],
        useMoneyAmount: [
          { required: true, message: '请输入金额', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  components: { deptTable, personSingle },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  props: {
    ExpenditureType: {
      type: Array,
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        useDate: '', // 使用日期
        useDepId: '', // 使用部门（单选）
        expenditureTypeCodeId: '', // 支出项目类别
        specificUse: '', // 具体用途
        useMoneyAmount: '', // 金额（万元）
        operatorId: '', // 经办人ID
        operatorName: '', // 经办人
        dealUserId: '', // 审核id
        dealUserName: '', // 审核人
        approverUserId: '', // 批准人ID
        approverUserName: '', // 批准人
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
    // 审核人
    selectDealUserData(row) {
      this.itemModel.dealUserId = row.id;
      this.itemModel.dealUserName = row.name;
    },
    // 批准人
    selectApproverUserData(row) {
      this.itemModel.approverUserId = row.id;
      this.itemModel.approverUserName = row.name;
    },
    selectOperatorData(row) {
      this.itemModel.operatorId = row.id;
      this.itemModel.operatorName = row.name;
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
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
