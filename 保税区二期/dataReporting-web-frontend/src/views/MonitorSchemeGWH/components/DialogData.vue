<template>
  <dialog-modal
    ref="dialogData"
    size="middle"
    content-class=""
    appendToBody
    :title="`${isEdit ? '编辑' : '新增'}${dictName}`"
    @close="closeDialog"
  >

    <!-- 按钮 -->
    <div class="title-info mar-l-lg">监测详情</div>
    <div class="mar-t-sm mar-b-xs mar-l-lg">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
    <hr class="mar-x-lg">

    <!-- 表单项 -->
    <el-form
      class="mar-x-lg"
      ref="form"
      label-position="right"
      label-width="85px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="监测类型：" prop="dictName">
            <el-input :value="dictName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监测指标：" prop="monitoringIndex">
            <el-select
              v-model="itemModel.monitoringIndex"
              clearable
              @blur="$refs.form.validateField('monitoringIndex')">
              <el-option
                v-for="(item,index) in $enum.monitoringIndex"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="监测时间：" prop="monitoringDate" v-if="itemModel.reportingPeriod === '1'">
            <!-- 监测时间——时间选择器 -->
            <el-date-picker
              style="width: 140px"
              v-model="itemModel.monitoringDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="监测时间：" prop="monitoringMonth" v-else-if="itemModel.reportingPeriod === '2'">
            <el-select v-model="itemModel.monitoringMonth" clearable>
              <el-option
                v-for="(item,index) in $enum.monitoringMonth"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="监测时间：" prop="monitoringQuarter" v-else-if="itemModel.reportingPeriod === '3'">
            <el-select v-model="itemModel.monitoringQuarter" clearable>
              <el-option
                v-for="(item,index) in $enum.monitoringQuarter"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="监测时间：" prop="monitoringYearHalf" v-else-if="itemModel.reportingPeriod === '4'">
            <el-select v-model="itemModel.monitoringYearHalf" clearable>
              <el-option
                v-for="(item,index) in $enum.monitoringYearHalf"
                :key="index"
                :label="item"
                :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="填报时间：">
            <!-- 填报时间——时间选择器 -->
            <el-date-picker
              style="width: 140px"
              v-model="itemModel.reportingDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 列表展示信息 -->
    <div class="mar-x-sm">
      <upload-list
        ref="uploadList"
        style="height: calc(86vh - 195px)"
        :disabled="this.formDisabled ? true : false"
        :id="id"
        :schemeReportData="{ ...itemModel, monitoringTypeCodeIdValue: dictName }"></upload-list>
    </div>

  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import { analyzeResp } from '@/global/libs/util';
import { saveItem } from '@/global/libs/mixins';
import UploadList from '@/components/upload-list';
import { formatDate } from '@/global/libs/tools';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  components: {
    UploadList,
  },
  // 传入参数项
  props: {
    title: String,
  },
  data() {
    return {
      url: 'sm/schemeReportDataGWH/',  // 必须, 接口地址
      itemModel: {
        reportingDate: formatDate(new Date(), 'Y-m-d 00:00:00'),
        monitoringDate: formatDate(new Date(), 'Y-m-d 00:00:00'),
      },          // 表单对象
      dictName: '',
      id: '',
      formDisabled: false,
      // 字典表 http://192.168.11.65:8099/frame/#/pro/dict
      dict: {},
      rules: {
        monitoringIndex: [
          { required: true, message: '请选择监测指标', trigger: ['blur', 'change'] },
        ],
        monitoringDate: [
          { required: true, message: '请选择监测时间', trigger: ['blur', 'change'] },
        ],
        monitoringMonth: [
          { required: true, message: '请选择监测时间', trigger: ['blur', 'change'] },
        ],
        monitoringQuarter: [
          { required: true, message: '请选择监测时间', trigger: ['blur', 'change'] },
        ],
        monitoringYearHalf: [
          { required: true, message: '请选择监测时间', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // 是否为编辑操作(这里rowGuid可能要变成id值)
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    pickStart() {},
    // onChangeDialog(isFull) {
    //   this.dialogHeight = isFull ? '100vh' : '86vh';
    // },
    // 获取空对象
    getEmptyItem() {
      return {
        schemeId: '',                           // 方案基本信息Id
        monitoringTypeCodeId: '',               // 监测类型（字典表）
        monitoringIndex: '',                    // 监测指标（1主要指标、2其他指标、10全部指标
        reportingPeriod: '',                    // 报告周期（1日、2月、3季、4年）
        reportingDate: formatDate(new Date(), 'Y-m-d 00:00:00'),              // 填报时间
        monitoringDate: formatDate(new Date(), 'Y-m-d 00:00:00'),             // 日 监测时间
      };
    },
    // onClickSave() {
    //   this.itemModel.dtoPSBaseInfoExtend = this.extendModel;
    //   this.onSaveCheck(this.saveCallback);
    // },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            if (this.isEdit) {
              this.$emit('query');
              this.closeDialog();
            }
            this.itemModel = response.data.data;
            this.itemModel.monitoringYearHalf = this.itemModel.monitoringYearHalf || 0;
            if (callback) {
              callback(response.data.data);
            } else {
              this.$emit('query');
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
    // 保存数据后回调
    saveCallback(row) {
      this.id = row.id;
      this.$set(this.itemModel, 'monitoringIndex', row.monitoringIndex.toString());
      this.$set(this.itemModel, 'reportingPeriod', row.reportingPeriod.toString());
      this.$set(this.itemModel, 'monitoringTypeCodeIdValue', this.dictName.toString());
      if (row.monitoringMonth !== null && row.monitoringMonth !== undefined) {
        this.$set(this.itemModel, 'monitoringMonth', row.monitoringMonth.toString());
      }
      if (row.monitoringQuarter !== null && row.monitoringQuarter !== undefined) {
        this.$set(this.itemModel, 'monitoringQuarter', row.monitoringQuarter.toString());
      }
      if (row.monitoringYearHalf !== null && row.monitoringYearHalf !== undefined) {
        this.$set(this.itemModel, 'monitoringYearHalf', row.monitoringYearHalf.toString());
      }
    },
    // 打开对话框
    openDialog(_row) {
      const row = { ..._row };
      this.dictName = row.dictName;
      // 合并参数对象
      if (row) {
        delete row.dictName;
        this.itemModel = Object.assign(this.getEmptyItem(), { ...row });
        if (row.id) {
          this.id = row.id;
          this.$set(this.itemModel, 'monitoringIndex', row.monitoringIndex.toString());
          this.$set(this.itemModel, 'reportingPeriod', row.reportingPeriod.toString());
          if (row.monitoringMonth !== null && row.monitoringMonth !== undefined) {
            this.$set(this.itemModel, 'monitoringMonth', row.monitoringMonth.toString());
          }
          if (row.monitoringQuarter !== null && row.monitoringQuarter !== undefined) {
            this.$set(this.itemModel, 'monitoringQuarter', row.monitoringQuarter.toString());
          }
          if (row.monitoringYearHalf !== null && row.monitoringYearHalf !== undefined) {
            this.$set(this.itemModel, 'monitoringYearHalf', row.monitoringYearHalf.toString());
          }
        }
      } else {
        this.itemModel = this.getEmptyItem();
      }

      // 是否获取单条记录
      // this.getItemOne(row, (data) => {
      //   this.extendModel = data.dtoPSBaseInfoExtend;
      // });

      // 是否需要获取字典表
      // this.getDictList();

      // 显示编辑表单
      this.$refs.dialogData.openDialog();

      // 获取文件列表
      this.$nextTick(() => {
        if (this.id !== '') this.$refs.uploadList.getItemList();
      });

      // 聚焦输入框
      // this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      this.id = '';
      this.$refs.form.resetFields();
      this.$refs.dialogData.closeDialog();
    },
  },
};
</script>
