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
          <el-form-item label="年度："
                        prop="belongYear">
            <el-date-picker v-model="itemModel.belongYear"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年份"></el-date-picker>
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
          <el-form-item label="项目说明："
                        prop="projectDescription">
            <el-input type="textarea"
                      v-model="itemModel.projectDescription"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="预算费用："
                        prop="budgetCost">
            <el-input v-model.number="itemModel.budgetCost"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="预算识别人："
                        prop="budgetIdentifyPeople">
            <el-input type="budgetIdentifyPeople"
                      v-model="itemModel.budgetIdentifyPeople"></el-input>
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

export default {
  data() {
    return {
      url: 'wholeprocess/safetyProductionCostBudget',
      itemModel: this.getEmptyItem(),
      rules: {
        belongYear: [
          { required: true, message: '请选择年份', trigger: ['blur', 'change'] },
        ],
        withdrawMoney: [
          { required: true, message: '请输入提取数目', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
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
        belongYear: '', // 年度
        expenditureTypeCodeId: '', // 支出项目类别（字典表）
        projectDescription: '', // 项目说明
        budgetCost: '', // 预算费用（万元）
        budgetIdentifyPeople: '', // 预算识别人
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
        this.itemModel.belongYear = this.itemModel.belongYear.toString();
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
