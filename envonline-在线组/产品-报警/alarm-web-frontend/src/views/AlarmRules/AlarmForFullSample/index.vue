<template>
<el-card class="title-card" type="title">
  <template slot="header">
    {{title ? `${title}规则` : '报警规则'}}
  </template>
  <div style="height: calc(100% - 5px)" v-loading="loading">
    <!-- 头部的主要内容信息 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onClickSave">保 存</el-button>
    </div>
    <hr>
    <div class="pad-x-sm" style="height: calc(100% - 40px);overflow: auto;">
      <!-- 基本信息 -->
      <div class="title-info mar-y-xs mar-l-sm">基本信息</div>
      <el-form ref="form" label-position="right" label-width="120px" :model="alarmType" :rules="typeRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="报警名称：" prop="alarmTypeName">
              <el-input v-model="alarmType.alarmTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警编号：" prop="alarmTypeCode">
              <el-input v-model="alarmType.alarmTypeCode" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用：" prop="isEnabled">
              <el-switch v-model="alarmType.isEnabled"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号：" prop="orderNum">
              <!-- 正整数 -->
              <el-input-number
                v-model="alarmType.orderNum"
                controls-position="right"
                :min="0"
                :max="2147483647"
                :precision="0"
                style="width: 100%;"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" :rows="4" v-model="alarmType.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 条件 -->
      <div
        v-if="[
          'AlarmOffLine',
          'TpeciAlarmOffLine',
        ].includes(alarmType.alarmTypeCode)"
      >
        <hr class="mar-x-sm block">
        <div class="title-info mar-y-xs mar-l-sm">条件</div>
        <el-form ref="formRule" label-position="right" label-width="120px" :model="alarmRule" :rules="alarmRules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="报警级别：" prop="alarmLevel">
                <el-select v-model="alarmRule.alarmLevel" placeholder="请选择" style="width: 120px;">
                  <el-option label="一级报警" :value=1></el-option>
                  <el-option label="二级报警" :value=2></el-option>
                  <el-option label="三级报警" :value=3></el-option>
                  <el-option label="四级报警" :value=4></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="离线时长：" prop="offLineHours">
                <!-- 正整数 -->
                <el-input-number
                  v-model="alarmRule.offLineHours"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 条件 -->
      <div
        v-else-if="!['AlarmForOverSample',
          'AlarmValveClose',
          'AlarmValveCloseHasCou',
        ].includes(alarmType.alarmTypeCode)">
        <hr class="mar-x-sm block">
        <div class="title-info mar-y-xs mar-l-sm">条件</div>
        <el-form ref="formRule" label-position="right" label-width="120px" :model="alarmRule" :rules="alarmRules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="报警级别：" prop="alarmLevel">
                <el-select v-model="alarmRule.alarmLevel" placeholder="请选择" style="width: 120px;">
                  <el-option label="一级报警" :value=1></el-option>
                  <el-option label="二级报警" :value=2></el-option>
                  <el-option label="三级报警" :value=3></el-option>
                  <el-option label="四级报警" :value=4></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最大剩余数：" prop="alarmBottleMaxNum">
                <!-- 正整数 -->
                <el-input-number
                  v-model="alarmRule.alarmBottleMaxNum"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最小剩余数：" prop="alarmBottleMinNum">
                <!-- 正整数 -->
                <el-input-number
                  v-model="alarmRule.alarmBottleMinNum"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
// import { mapState } from 'vuex';

// 超标满样报警规则
export default {
  name: 'AlarmForFullSample',
  data() {
    return {
      title: '',
      loading: false,
      saveLoading: false,
      alarmType: {
        alarmTypeName: '',
        isEnabled: '',
        orderNum: 0,
        alarmTypeCode: '',
      },
      alarmRule: {
        alarmLevel: '',
        alarmBottleMaxNum: 0,
        alarmBottleMinNum: 0,
      },
      typeRules: {
        alarmTypeName: [
          { required: true, message: '报警名称为必填项', trigger: ['blur', 'change'] },
        ],
        isEnabled: [
          { required: true, message: '是否启用为必填项', trigger: ['blur', 'change'] },
        ],
        alarmTypeCode: [
          { required: true, message: '报警编号为必选项', trigger: ['blur', 'change'] },
        ],
        orderNum: [
          { required: true, message: '排序号为必填项', trigger: ['blur', 'change'] },
        ],
      },
      alarmRules: {
        alarmLevel: [
          { required: true, message: '报警级别为必填项', trigger: ['blur', 'change'] },
        ],
        alarmBottleMaxNum: [
          { required: true, message: '最大剩余数为必填项', trigger: ['blur', 'change'] },
        ],
        alarmBottleMinNum: [
          { required: true, message: '最小剩余数为必选项', trigger: ['blur', 'change'] },
        ],
        offLineHours: [
          { required: true, message: '离线时长为必选项', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // ...mapState({
    //   alarmTypeItem: state => state.sample.alarmType,
    //   alarmTypeCode: state => state.sample.alarmType.alarmTypeCode || '',
    // }),
    alarmTypeItem() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
    alarmTypeCode() {
      return this.alarmTypeItem.alarmTypeCode;
    },
  },
  watch: {
    alarmTypeCode(val) {
      if (val) {
        this.getItemList();
      }
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    onClickSave() {
      this.saveLoading = true;
      if ([
        'AlarmForOverSample',
        'AlarmValveClose',
        'AlarmValveCloseHasCou',
      ].includes(this.alarmTypeItem.alarmTypeCode)) {
        this.$http.put('alarm/alarmType', { ...this.alarmType }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          } else {
            this.$message({
              type: 'warning',
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
      } else if ([
        'AlarmOffLine',
        'TpeciAlarmOffLine',
      ].includes(this.alarmTypeItem.alarmTypeCode)) {
        this.$http.post('alarm/alarmRuleForOffLine', {
          alarmType: this.alarmType,
          alarmRule: this.alarmRule,
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          } else {
            this.$message({
              type: 'warning',
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
      } else {
        this.$http.post('alarm/alarmRuleForSampleBottle', {
          alarmType: this.alarmType,
          alarmRule: this.alarmRule,
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          } else {
            this.$message({
              type: 'warning',
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
      }
    },
    getItemList() { // 获取表单数据
      this.loading = true;
      if ([
        'AlarmForOverSample',
        'AlarmValveClose',
        'AlarmValveCloseHasCou',
      ].includes(this.alarmTypeItem.alarmTypeCode)) {
        this.$http.get(`alarm/alarmType/${this.alarmTypeItem.id}`).then((response) => {
          if (response.data.success) {
            this.alarmType = response.data.data;
            this.title = response.data.data.alarmTypeName;
            //  active-color="#13ce66"
            this.$nextTick(() => {
              this.$refs.form.clearValidate();
              if (this.$refs.formRule) this.$refs.formRule.clearValidate();
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      } else if ([
        'AlarmOffLine',
        'TpeciAlarmOffLine',
      ].includes(this.alarmTypeItem.alarmTypeCode)) {
        this.$http.get(`alarm/alarmRuleForOffLine/${this.alarmTypeItem.id}`).then((response) => {
          if (response.data.success) {
            this.alarmType = response.data.data.alarmType;
            this.alarmRule = response.data.data.alarmRule;
            if (response.data.data.alarmRule.id === '' || response.data.data.alarmRule.id === null) {
              delete this.alarmRule.id;
            }
            this.alarmRule.alarmTypeId = response.data.data.alarmType.id;
            this.$nextTick(() => {
              this.$refs.form.clearValidate();
              if (this.$refs.formRule) this.$refs.formRule.clearValidate();
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      } else {
        this.$http.get(`alarm/alarmRuleForSampleBottle/${this.alarmTypeItem.id}`).then((response) => {
          if (response.data.success) {
            this.alarmType = response.data.data.alarmType;
            this.alarmRule = response.data.data.alarmRule;
            if (response.data.data.alarmRule.id === '' || response.data.data.alarmRule.id === null) {
              delete this.alarmRule.id;
            }
            this.alarmRule.alarmTypeId = response.data.data.alarmType.id;
            this.$nextTick(() => {
              this.$refs.form.clearValidate();
              if (this.$refs.formRule) this.$refs.formRule.clearValidate();
            });
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
  },
};
</script>
