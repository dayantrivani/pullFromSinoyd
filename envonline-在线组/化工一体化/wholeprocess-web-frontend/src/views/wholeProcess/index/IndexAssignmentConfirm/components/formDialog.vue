<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}考核自评`"
                @close="closeDialog">
    <el-form ref="queryForm"
             v-if="show"
             label-position="right"
             label-width="60px"
             :rules="rules"
             :model="queryForm">
      <el-row :gutter="20">
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
          <el-form-item label="季度：">
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
                       @click="onQueryCheck()">查 询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <hr class="block mar-y-0 mar-t-xs mar-b-xs" />
        <el-col :span="24"
                class="title-info mar-t-xs mar-b-xs">目标自评信息</el-col>
      </el-row>
    </el-form>
    <el-form ref="form"
             label-position="right"
             label-width="110px"
             :rules="rules"
             :model="itemModel">
      <el-row>
        <el-form-item label="考核结论："
                      prop="confirmStatus">
          <el-radio v-model="itemModel.confirmStatus"
                    label="1">达标</el-radio>
          <el-radio v-model="itemModel.confirmStatus"
                    label="2">未达标</el-radio>
        </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="考核情况说明："
                        prop="confirmRemark">
            <el-input type="textarea"
                      v-model="itemModel.confirmRemark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
                           min-width="80"
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
                <el-radio disabled
                          v-model="scope.row.selfEvaluateStatus"
                          label="1">达标</el-radio>
                <el-radio disabled
                          v-model="scope.row.selfEvaluateStatus"
                          label="2">未达标</el-radio>
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           label="考核结果"
                           width="260"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <template>
                <el-radio v-model="scope.row.confirmStatus"
                          label="1">达标</el-radio>
                <el-radio v-model="scope.row.confirmStatus"
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
                 @click="onSaveCheck">保 存</el-button>
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
      itemModel: '',
      queryForm: this.getQueryEmptyItem(),
      show: true,
      indexAssignmentList: [],
      loading: false,
      rules: {
        belongYear: [
          { required: true, message: '请输入考核结论', trigger: ['blur', 'change'] },
        ],
        responsibleDepId: [
          { required: true, message: '请选择部门', trigger: ['blur', 'change'] },
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
    getEmptyItem() {
      return {
        responsibleDepId: '', // 部门
        responsibleLevel: '', // 级别
        belongYear: '', // 所属年份
        indexQty: '',
        selfReachStandardQty: '',
        confirmReachStandardQty: '',
        confirmStatus: '',
        confirmRemark: '',
        confirmDate: this.$tools.formatDate(new Date(), 'Y-m-d H:i:s'),
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    // 获取空对象
    getQueryEmptyItem() {
      return {
        page: 1,
        rows: 1000,
        belongYear: '',
        responsibleDepId: '',
        quarterSelect: '',
        fromTime: '',
        toTime: '',
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
        this.itemModel.confirmStatus = this.itemModel.confirmStatus.toString();
        this.queryForm.responsibleDepId = this.itemModel.responsibleDepId;
        this.queryForm.responsibleLevel = this.itemModel.responsibleLevel;
        this.queryForm.belongYear = this.itemModel.belongYear.toString();
        this.queryForm.isConfirm = '';
        this.show = false;
        this.onQueryIndexSettingList();
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.show = true;
      this.queryForm = this.getQueryEmptyItem();
      this.indexAssignmentList = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.itemModel.psId = this.orgGuid;
      this.itemModel.confirmUserId = this.orgGuid;
      this.itemModel.confirmUserName = this.userName;
      this.itemModel.responsibleDepId = this.queryForm.responsibleDepId;
      this.itemModel.responsibleLevel = this.queryForm.responsibleLevel;
      this.itemModel.belongYear = this.queryForm.belongYear;
      this.itemModel.confirmDate = this.$tools.formatDate(new Date(), 'Y-m-d H:i:s');
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post']('wholeprocess/indexAssignmentConfirm', this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
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
    },
    onQueryCheck() {
      this.$refs.queryForm.validate((valid) => {
        if (!valid) return;
        this.onQueryIndexSettingList();
      });
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
          this.indexAssignmentList.forEach((val) => {
            val.selfEvaluateStatus = val.selfEvaluateStatus.toString();
            val.confirmStatus = val.confirmStatus.toString();
          });
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
      if (this.indexAssignmentList.length === 0) {
        return;
      }
      this.indexAssignmentList.forEach((val) => {
        if (val.confirmStatus !== 0) {
          val.isConfirm = 1;
        }
      });
      this.$http.post('wholeprocess/indexAssignment/evaluate', this.indexAssignmentList)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.saveCallback();
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
    },
  },
};
</script>
