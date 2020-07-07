<template>
  <el-card type="title">
    <!-- 标题内容 -->
    <template slot="header">安全生产投入信息</template>
    <!-- 按钮栏内容 -->
    <div class="mar-l-sm">
      <el-button
        type="primary"
        icon="fa fa-save"
        :loading="saveLoading"
        class="mar-t-xs"
        @click="onSave"
      >保 存</el-button>
    </div>
    <hr class="mar-t-xs mar-x-sm">
    <!-- 表单项的相关内容 -->
    <el-form
      class="mar-t-xs pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="185px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="itemModel.isPayLiabilityInsurance ? rules : {}"
    >
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="安全生产责任险：">
            <el-tooltip :content="itemModel.isPayLiabilityInsurance ? '是' : '否'" placement="top">
              <el-switch
                v-model="itemModel.isPayLiabilityInsurance"
                :active-value="true"
                :inactive-value="false">
              </el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="安全生产责任险金额(元)：" prop="liabilityInsuranceAmount">
            <el-input-number
              style="width:100%"
              :min="0"
              controls-position="right"
              v-model="itemModel.liabilityInsuranceAmount"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="安全生产责任险起止时间：" prop="startDate">
            <!-- <date-range
              v-model="itemModel"
              from="startDate"
              to="endDate"
              noLink=true
            ></date-range> -->
            <el-date-picker
              v-model="toFormDate"
              unlink-panels
              type="daterange"
              format="yyyy-MM-dd"
              clearable
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="安全投入金额(元)：">
            <el-input-number
              style="width:100%"
              :min="0"
              controls-position="right"
              v-model="itemModel.safetyInputMoney"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="安全投入用途：">
            <el-input v-model="itemModel.safetyInputPurpose"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';
// import { getDay } from '@/libs/tools';

export default {
  name: 'SafetyProductInputInfo',
  data() {
    const validDate = (rule, value, callback) => {
      if (!value || !value[0] || !value[1] || value === '1900-01-01 00:00:00') {
        callback(new Error('请选择安全生产责任险起止时间'));
      } else {
        callback();
      }
    };
    return {
      formLoading: false,                 // 表单加载状态
      itemModel: {
        liabilityInsuranceAmount: '',
        times: [],
      },                      // 表单数据源
      saveLoading: false,                 // 按钮加载状态
      startData: '',
      endData: '',
      rules: {
        liabilityInsuranceAmount: [
          { required: true, message: '请输入安全生产责任险金额', trigger: ['blur', 'change'] },
        ],
        startDate: [
          // { required: true, message: '请选择安全生产责任险起止时间', trigger: ['blur', 'change'] },
          {
            required: true,
            validator: validDate,
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  created() {
    this.resetForm();
    this.getItemOne();
  },
  computed: {
    ...mapState({
      psInfo: state => state.psInfo,
    }),
    toFormDate: {
      get() {
        let date = '';
        if (this.itemModel.startDate === '1900-01-01 00:00:00' && this.itemModel.endDate === '1900-01-01 00:00:00') {
          date = '';
        } else if (!this.itemModel.startDate && !this.itemModel.endDate) {
          date = '';
        } else {
          date = [this.itemModel.startDate, this.itemModel.endDate];
        }
        // 为何为'', 当dateRange值不为 '' 时,时间选项会从 1970年1月1日开始
        return date;
      },
      set(val) {
        [this.itemModel.startDate, this.itemModel.endDate] = val || ['1900-01-01 00:00:00', '1900-01-01 00:00:00'];
      },
    },
    // valueDay: {
    //   get() {
    //     return (!this.queryForm.fromDate && !this.queryForm.toDate)
    //       ? ''
    //       : [this.queryForm.fromDate, this.queryForm.toDate];
    //   },
    //   set(val) {
    //     [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
    //   },
    // },
  },
  watch: {
    // eslint-disable-next-line
    'itemModel.isPayLiabilityInsurance': function(val) {
      if (!val) {
        this.$refs.form.clearValidate();
      }
    },
    // eslint-disable-next-line
    // 'itemModel.times': function (val) {
    //   console.log(val);
    //   if (val === 1) {
    //     this.queryForm.startData = getDay(-1, false, false);
    //     this.queryForm.toDate = getDay(0, false, false);
    //   } else {
    //     this.queryForm.startData = getDay(-1, false, false);
    //     this.queryForm.toDate = getDay(1, false, false);
    //   }
    //   this.pickerOneDate = '';
    // },
  },
  methods: {
    // 清空验证信息
    resetForm() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    // 时间选择器改变方法
    changeTimes(val) {
      if (val) {
        this.startData = formatDate(val[0], 'Y-m-d 00:00:00');
        this.endData = formatDate(val[1], 'Y-m-d 00:00:00');
      } else {
        this.startData = '';
        this.endData = '';
      }
    },
    getEmptyItem() {
      return {
        isPayLiabilityInsurance: false,             // 是否安全责任生产险
        liabilityInsuranceAmount: '',               // 安全生产责任险金额
        times: [],                                  // 许可证起始时间
        startData: '',
        endData: '',
        safetyInputMoney: '',                       // 安全投入金额
        safetyInputPurpose: '',                     // 安全投入用途
      };
    },
    // 获取数据内容
    getItemOne() {
      this.formLoading = true;
      this.$http.get(`bas/safetyProductInputInfo/${this.psInfo.id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel = Object.assign(this.getEmptyItem(), response.data.data);
          this.itemModel.times = [this.itemModel.startDate, this.itemModel.endDate];
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
        this.formLoading = false;
      });
    },
    // 保存按钮方法
    onSave() {
      // if (this.startData === '' || this.endData === '') {
      //   this.$message.warning({
      //     message: '请选择安全生产责任险起止时间',
      //     duration: 3000,
      //     showClose: true,
      //   });
      //   return;
      // }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const { id } = this.itemModel;
        this.itemModel.psId = this.psInfo.id;
        // this.itemModel.startDate = this.startData;
        // this.itemModel.endDate = this.endData;
        this.$http[id ? 'put' : 'post']('bas/safetyProductInputInfo', { ...this.itemModel })
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
              this.itemModel = response.data.data;
              this.itemModel.times = [this.itemModel.startDate, this.itemModel.endDate];
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
  },
};
</script>

<style scoped>

</style>
