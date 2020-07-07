<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}目标自评`"
                @close="closeDialog">
    <el-form ref="queryForm"
             label-position="right"
             label-width="80px"
             :rules="rules"
             v-if="show"
             :model="queryForm">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="年份："
                        prop="belongYear">
            <el-date-picker v-model="queryForm.belongYear"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="部门："
                        prop="responsibleDepId"
                        hint-down>
            <dept-table v-model="queryForm.responsibleDepId"
                        ref="selectTable">
            </dept-table>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="季度："
                        prop="quarterSelect">
            <el-select v-model="queryForm.quarterSelect"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.QUARTER"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary"
                       icon="fas fa-search"
                       @click="onSaveCheck()">查 询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form ref="form"
             label-position="right"
             label-width="110px"
             :model="itemModel">
      <el-row v-if="show">
        <hr class="block mar-y-0 mar-t-xs mar-b-xs" />
        <el-col :span="24"
                class="title-info mar-t-xs mar-b-xs">目标自评信息</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="评定人："
                        prop="selfEvaluateUserId">
            <el-input disabled
                      v-model="itemModel.selfEvaluateUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自评日期：">
            <el-date-picker v-model="itemModel.selfEvaluateDate"
                            type="date"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!show">
        <el-form-item label="自评结果：">
          <el-radio v-model="itemModel.selfEvaluateStatus"
                    label="1">达标</el-radio>
          <el-radio v-model="itemModel.selfEvaluateStatus"
                    label="2">未达标</el-radio>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="selfEvaluateRemark">
            <el-input type="textarea"
                      v-model="itemModel.selfEvaluateRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="show">
        <el-table border
                  highlight-current-row
                  height="calc(100% - 71px)"
                  v-loading="loading"
                  :data="indexAssignmentList">
          <el-table-column align="center"
                           label="No."
                           width="50"
                           type="index"></el-table-column>
          <el-table-column property="responsibleLevelName"
                           label="级别"
                           min-width="120"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="indexName"
                           label="指标名称"
                           min-width="120"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="indexValue"
                           label="指标值"
                           min-width="120"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center"
                           label="自评结果"
                           width="260"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <template>
                <el-radio v-model="scope.row.selfEvaluateStatus"
                          label="1">达标</el-radio>
                <el-radio v-model="scope.row.selfEvaluateStatus"
                          label="2">未达标</el-radio>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 v-if="itemModel.isConfirm===0"
                 @click="onSaveItem">保 存</el-button>
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
      url: 'wholeprocess/indexAssignment',
      itemModel: this.getEmptyItem(),
      indexAssignmentList: [],
      queryForm: this.getQueryEmptyItem(),
      loading: false,
      show: true,
      isAuto: false,
      rules: {
        belongYear: [
          { required: true, message: '请输入指标名称', trigger: ['blur', 'change'] },
        ],
        quarterSelect: [
          { required: true, message: '请输入指标值', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  components: { deptTable },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid', 'userName']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取空对象
    getQueryEmptyItem() {
      return {
        page: 1,
        rows: 1000,
        belongYear: '',
        responsibleDepId: '',
        quarterSelect: '',
        responsibleLevel: '',
        fromTime: '',
        isSelfEvaluate: 0,
        toTime: '',
      };
    },
    // 获取空对象
    getEmptyItem() {
      return {
        responsibleDepId: '', // 部门
        responsibleLevel: '', // 级别
        belongYear: '', // 所属年份
        formulateUserId: '', // 制定人
        formulateUserName: '',
        approverUserId: '', // 批准人
        approverUserName: '',
        dealUserId: '', // 审核人
        dealUserName: '',
        approvalDate: '', // 批准日期
        indexName: '', // 指标名称
        indexValue: '', // 指标值
        budget: '', // 预算
        liableUserId: '', // 责任人id
        liableUserName: '', // 责任人
        expectedCompletionTime: '', // 预计完成时间
        remark: '', // 备注
        isSelfEvaluate: 0, // 是否自评
        isConfirm: 0, // 是否考核
        selfEvaluateUserId: this.orgGuid, // 自评人id
        selfEvaluateUserName: this.userName, // 自评评定人
        selfEvaluateRemark: '', //  自评评定备注
        selfEvaluateStatus: '', // 自评评定达标情况（1达标、2未达标）
        selfEvaluateDate: this.$tools.formatDate(new Date(), 'Y-m-d H:i:s'),
        confirmStatus: '', // 考核达标情况（1达标、2未达标）
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck() {         // 保存记录
      this.$refs.queryForm.validate((valid) => {
        if (!valid) return;
        this.onQueryIndexSettingList();
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.itemModel.selfEvaluateStatus = this.itemModel.selfEvaluateStatus.toString();
        this.show = false;
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.show = true;
      this.indexAssignmentList = [];
      this.queryForm = this.getQueryEmptyItem();
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 查询未自评的
    onQueryIndexSettingList() {
      this.loading = true;
      if (this.queryForm.quarterSelect && this.queryForm.belongYear) {
        if (this.queryForm.quarterSelect === 1) {
          this.queryForm.fromTime = `${this.queryForm.belongYear}-01-01 00:00:00`;
          this.queryForm.toTime = `${this.queryForm.belongYear}-03-31 00:00:00`;
        }
        if (this.queryForm.quarterSelect === 2) {
          this.queryForm.fromTime = `${this.queryForm.belongYear}-04-01 00:00:00`;
          this.queryForm.toTime = `${this.queryForm.belongYear}-06-30 00:00:00`;
        }
        if (this.queryForm.quarterSelect === 3) {
          this.queryForm.fromTime = `${this.queryForm.belongYear}-07-01 00:00:00`;
          this.queryForm.toTime = `${this.queryForm.belongYear}-09-30 00:00:00`;
        }
        if (this.queryForm.quarterSelect === 4) {
          this.queryForm.fromTime = `${this.queryForm.belongYear}-10-01 00:00:00`;
          this.queryForm.toTime = `${this.queryForm.belongYear}-12-31 00:00:00`;
        }
      } else {
        this.queryForm.fromTime = '';
        this.queryForm.toTime = '';
      }
      this.$http.get('wholeprocess/indexAssignment', {
        params: { ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.indexAssignmentList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 发送保存记录请求
    onSaveItem() {
      if (!this.show) {
        this.$http.put('wholeprocess/indexAssignment', this.itemModel)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.$emit('query');
              this.$refs.dialog.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          });
        return;
      }
      this.saveIndexAssignmentList();
    },
    // 保存自评
    saveIndexAssignmentList() {
      const saveIndexAssignmentList = [];
      this.indexAssignmentList.forEach((val) => {
        if (val.selfEvaluateStatus) {
          val.isSelfEvaluate = 1;
          val.psId = this.orgGuid;
          val.selfEvaluateUserId = this.orgGuid;
          val.selfEvaluateUserName = this.userName;
          val.selfEvaluateRemark = this.itemModel.selfEvaluateRemark;
          val.selfEvaluateDate = this.itemModel.selfEvaluateDate;
          saveIndexAssignmentList.push(val);
        }
      });
      if (saveIndexAssignmentList.length > 0) {
        this.$http.post('wholeprocess/indexAssignment/evaluate', saveIndexAssignmentList)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 3000,
                showClose: true,
              });
              this.$emit('query');
              this.$refs.dialog.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      } else {
        this.$emit('query');
        this.$refs.dialog.closeDialog();
      }
    },
  },
};
</script>
