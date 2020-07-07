<template>
  <dialog-modal
    ref="dialogDownlode"
    size="mini"
    content-class=""
    appendToBody
    title="附件下载"
    @close="closeDialog"
  >
    <el-form
      class="item-space mar-x-sm"
      ref="form"
      label-position="right"
      label-width="113px"
      :rules="rules"
      :model="itemModel">
      <div v-if="itemModel.reportingPeriod === '1'">
        <el-form-item label="监测开始时间：" prop="fromDate">
          <!-- 监测时间开始时间 -->
          <el-date-picker
            v-model="itemModel.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            :picker-options="pickStart"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <!-- 监测结束时间 -->
        <el-form-item label="监测结束时间：" prop="toDate">
          <!-- 填报时间——时间选择器 -->
          <el-date-picker
            v-model="itemModel.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            :picker-options="pickStart"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </div>
      <div v-else-if="itemModel.reportingPeriod === '2'">
        <el-form-item label="监测年：" label-width="90px" prop="monitoringYear">
          <!-- 监测时间开始时间 -->
          <el-date-picker
            v-model="itemModel.monitoringYear"
            readonly
            type="year"
            format="yyyy"
            value-format="yyyy"
            :picker-options="pickStart"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="监测时间：" label-width="90px" prop="monitoringMonth">
          <el-select
            v-model="itemModel.monitoringMonth"
            multiple
            clearable
            @blur="$refs.form.validateField('monitoringIndex')">
            <el-option
              v-for="(item,index) in $enum.monitoringMonth"
              :key="index"
              :label="item"
              :value="index"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-else-if="itemModel.reportingPeriod === '3'">
        <el-form-item label="监测年：" label-width="90px" prop="monitoringYear">
          <!-- 监测时间开始时间 -->
          <el-date-picker
            v-model="itemModel.monitoringYear"
            readonly
            type="year"
            format="yyyy"
            value-format="yyyy"
            :picker-options="pickStart"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="监测时间：" label-width="90px" prop="monitoringQuarter">
          <el-select
            v-model="itemModel.monitoringQuarter"
            multiple
            clearable
            @blur="$refs.form.validateField('monitoringIndex')">
            <el-option
              v-for="(item,index) in $enum.monitoringQuarter"
              :key="index"
              :label="item"
              :value="index"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-else-if="itemModel.reportingPeriod === '4'">
        <el-form-item label="监测年：" label-width="90px" prop="monitoringYear">
          <!-- 监测时间开始时间 -->
          <el-date-picker
            v-model="itemModel.monitoringYear"
            readonly
            type="year"
            format="yyyy"
            value-format="yyyy"
            :picker-options="pickStart"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="监测时间：" label-width="90px" prop="monitoringYearHalf">
          <el-select
            v-model="itemModel.monitoringYearHalf"
            clearable
            @blur="$refs.form.validateField('monitoringIndex')">
            <el-option
              v-for="(item,index) in $enum.monitoringYearHalf"
              :key="index"
              :label="item"
              :value="index"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-cloud-download-alt"
          :loading="saveLoading"
          @click="onClickDownload"
        >批量打包下载</el-button>
      </el-form-item>
      <hint-text
        v-if="itemModel.reportingPeriod === '1'"
        label="注意："
        class="mar-b-sm mar-l-sm">由于文件大小问题，时间段尽可能少于1个月周期</hint-text>
    </el-form>
    <!-- <template slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onClickSave()">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </template> -->
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  // 传入参数项
  props: {
    title: String,
  },
  data() {
    return {
      url: 'sm/schemeReportDataGWH/date',  // 必须, 接口地址
      saveLoading: false,
      itemModel: {},                    // 表单对象
      dict: {},
      rules: {
        fromDate: [{ required: true, message: '请选择监测开始时间', trigger: ['blur', 'change'] }],
        toDate: [{ required: true, message: '请选择监测结束时间', trigger: ['blur', 'change'] }],
        monitoringYear: [{ required: true, message: '请选择监测年', trigger: ['blur', 'change'] }],
        monitoringMonth: [{ required: true, message: '请选择监测时间', trigger: ['blur', 'change'] }],
        monitoringQuarter: [{ required: true, message: '请选择监测时间', trigger: ['blur', 'change'] }],
        monitoringYearHalf: [{ required: true, message: '请选择监测时间', trigger: ['blur', 'change'] }],
      },
    };
  },
  computed: {},
  methods: {
    pickStart() {},
    // 获取空对象
    getEmptyItem() {
      return {
        monitoringYear: '', // 监测年
        monitoringIndex: '',                           // 监测指标
        reportingPeriod: '',                           // 报告周期（1日、2月、3季、4年）
      };
    },
    // 打开对话框
    openDialog(row) {
      this.itemModel = row ? Object.assign(this.getEmptyItem(), { ...row }) : this.getEmptyItem();
      this.itemModel.monitoringYear = row.executionYear.toString();
      // 显示编辑表单
      this.$refs.dialogDownlode.openDialog();
      this.$nextTick(() => this.$refs.form.clearValidate());
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialogDownlode.closeDialog();
    },
    // 批量下载相关内容
    onClickDownload() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http.post('sm/schemeReportDataGWH/date', this.itemModel).then((response) => {
          if (response.status === 200 && response.data.success) {
            if (response.data.data.length !== 0) {
              this.downLoad(response.data.data);
            } else {
              this.$message.warning({
                message: '没有获取到相应数据',
                duration: 3000,
                showClose: true,
              });
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
      });
    },
    // 点击下载
    downLoad(items) {
      this.$http.post('res/document/download', items, {
        responseType: 'blob',
      }).then((response) => {
        const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
        if (isFaild) {
          const reader = new FileReader();
          reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
          reader.readAsText(response.data);
        } else {
          const fileName = `${items[0].name}.zip`;
          const blob = new Blob([response.data], { type: 'application/x-xls' });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }
      }, (response) => {
        analyzeResp(response);
      });
    },
  },
};
</script>
