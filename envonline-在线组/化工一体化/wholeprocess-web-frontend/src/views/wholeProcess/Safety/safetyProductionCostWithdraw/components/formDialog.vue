<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}费用提取`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="100px"
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
          <el-form-item label="月份："
                        prop="belongMonth">
            <el-select v-model="itemModel.belongMonth"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.MONTHS"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="销售收入："
                        prop="salesRevenue">
            <el-input v-model="itemModel.salesRevenue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="行业类别：">
            <select-tree v-model="itemModel.industryTypeCodeId"
                         :options="IndustryCategory"
                         :props="{ parent: 'parentId', value: 'rowGuid', label: 'dictName', children: 'children' }" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="提取标准："
                        prop="withdrawStandard">
            <el-input type="textarea"
                      v-model="itemModel.withdrawStandard"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="提取数："
                        prop="withdrawMoney">
            <el-input v-model.number="itemModel.withdrawMoney"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="remark">
            <el-input type="textarea"
                      v-model="itemModel.remark"></el-input>
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
      url: 'wholeprocess/safetyProductionCostWithdraw',
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
    IndustryCategory: {
      type: Array,
    },
  },
  created() {
    this.getDictList();
    this.getDictItem('IndustryCategory');
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        belongYear: '', // 年度
        belongMonth: '', // 月份
        industryTypeCodeId: '', // 行业类型
        withdrawStandard: '', // 提取标准
        withdrawMoney: '', // 提取数（万元）
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    // 获取字典表数据
    getDictItem() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: key }).then((val) => {
          this.dict[key] = val;
        });
      }));
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
