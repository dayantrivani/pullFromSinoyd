<!-- 报告表单 -->
<template>
  <modal ref="dialog" title="报告" width="60%" @close="close()">
    <el-tabs v-model="tabActive" type="card">
      <el-tab-pane label="基本信息" name="base">
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="pad-y-sm">
              <el-dropdown split-button type="primary" @click="onValidate()" @command="onValidate">
                <span>保 存</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">保存并继续新增</el-dropdown-item>
                  <el-dropdown-item command="close">保存并关闭</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="success" class="mar-l-sm">提 交</el-button>
            </div>
            <el-divider class="mar-y-0"></el-divider>
            <el-form
              ref="form"
              class="pad-t-md"
              label-position="right"
              label-width="auto"
              :model="formModel"
              :rules="formRules"
              :disabled="!!saveLoading"
            >
              <el-form-item label="项目编号：">
                <span class="pad-r-xs">{{ row.projectCode }}</span>
                <icon v-if="$enum.getLabel('GRADE', row.grade) === '特急'" name="danger" color="#FD3C7C" />
                <icon v-if="row.isStress" name="attention" color="#FF9900" />
              </el-form-item>
              <el-form-item label="项目名称：">
                <span> {{ row.projectName }}</span>
              </el-form-item>
              <el-form-item label="报告类型：" prop="reportTypeId">
                <select-report-type
                  v-model="formModel.reportTypeId"
                  clearable
                  :type="5"
                  :disabled="!!formModel.id"
                  @label="v => formModel.reportTypeName = v"
                />
              </el-form-item>
              <el-form-item label="年份：" prop="reportYear">
                <el-date-picker
                  v-model="formModel.reportYear"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="报告编号：" prop="code">
                <el-input v-model="formModel.code" style="width: 220px"></el-input>
                <el-button type="text" class="mar-l-sm" :loading="codeLoading" @click="getReportCode">生成编号</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <card-report class="mar-t-sm border-primary border-dashed" :data="formModel" />
            <comment
              ref="comment"
              class="mar-t-sm"
              min-height="163px"
              :object-id="formModel.id"
              :object-type="4"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="报告附件（1）" name="report"></el-tab-pane>
      <el-tab-pane label="关联样品（3）" name="sample"></el-tab-pane>
    </el-tabs>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import CardReport from './CardReport';
import Comment from './Comment';
import SelectReportType from './SelectReportType';

import {
  emptyForm,
  formRules,
  getReportCode,
  saveReport,
} from '../request';

export default {
  name: 'FormReport',
  components: {
    CardReport,
    Comment,
    SelectReportType,
  },
  props: {
    // 项目信息
    row: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tabActive: 'base',
      codeLoading: false,
      saveLoading: false,
      formModel: emptyForm(),
      formRules,
    };
  },
  computed: mapGetters('auth', ['userName']),
  methods: {
    open(data) {
      this.init(data);
      this.$refs.dialog.open();
    },
    close() {
      this.$refs.dialog.close();
    },
    init(data) {
      this.formModel = emptyForm(data || {
        status: this.$enum.get('REPORT_STATUS')[0].label,
        reportMakerName: this.userName,
        submitTime: this.$tools.getDay(0, true),
        projectId: this.row.id,
      });
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 验证表单
    onValidate(command) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveReport()
          .then(() => {
            if (command === 'add') {
              this.init();
            } else if (command === 'close') {
              this.close();
            }
          });
      });
    },
    // 保存报告
    onSaveReport() {
      return new Promise((resolve) => {
        this.saveLoading = true;
        saveReport(this.formModel)
          .then((response) => {
            const { success, data, msg } = response.data;
            this.$message[success ? 'success' : 'warning'](msg);
            if (success) {
              this.formModel = data;
              this.$emit('query');
              resolve();
            }
          })
          .finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 获取生成编号
    getReportCode() {
      const { reportTypeName, reportYear } = this.formModel;
      if (!reportTypeName || !reportYear) return;
      this.codeLoading = true;
      getReportCode(reportTypeName, reportYear)
        .then((response) => {
          const { success, data } = response.data;
          if (success && data) {
            this.formModel.code = data;
          } else {
            this.$message.warning({
              message: `生成编号失败${success && data ? '成功' : '失败'}`,
            });
          }
        })
        .finally(() => {
          this.codeLoading = false;
        });
    },
  },
};
</script>
