<template>
  <dialog-modal ref="dialog" size="small" title="仪器信息" @closed="closeDialog">
    <el-form ref="form" label-width="120px" :model="itemModel"
      :rules="rules" v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="仪器名称：" prop="instrumentName">
            <el-input v-model.trim="itemModel.instrumentName" disabled>
              <el-button slot="append" icon="fas fa-list" @click="openInstruList"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-cloak label="仪器类型：" prop="instrumentType">
            <el-select v-model.trim="itemModel.instrumentType" disabled>
              <el-option v-for="(item,index) in dict.InstrumentCategory" :key="index"
                :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="仪器编号：" prop="instrumentCode">
            <el-input v-model.trim="itemModel.instrumentCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器型号：" prop="instrumentModel">
            <el-input v-model.trim="itemModel.instrumentModel" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="本站编号：">
            <el-input v-model.trim="itemModel.innerCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="污染源名称：" prop="psId">
            <el-input v-model.trim="psInfo.psName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item v-cloak label="站点名称：" prop="portId">
            <el-select v-model.trim="itemModel.portId">
              <el-option v-for="(item,index) in select.portList" :key="index"
                :label="item.portName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂日期：" prop="leaveTime">
            <el-date-picker v-model.trim="itemModel.leaveTime" type="date"
              value-format="yyyy-MM-dd HH:mm:ss" :editable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="登记日期：" prop="registerDate">
            <el-date-picker v-model.trim="itemModel.registerDate" type="date"
              value-format="yyyy-MM-dd HH:mm:ss" :editable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在位置：">
            <el-input v-model.trim="itemModel.location"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="状态：" prop="status">
            <el-select v-model.trim="itemModel.status">
              <el-option v-for="(item, index) in $enum.instrumentStatus" :key="index"
                :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装时间：" prop="setupDate">
            <el-date-picker v-model.trim="itemModel.setupDate" type="date"
              value-format="yyyy-MM-dd HH:mm:ss" :editable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="有效期：" prop="effectiveDate">
            <el-date-picker v-model.trim="itemModel.effectiveDate" type="date"
              value-format="yyyy-MM-dd HH:mm:ss" :editable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仪器校准日期：" prop="calibrationDate">
            <el-date-picker v-model.trim="itemModel.calibrationDate" type="date"
              value-format="yyyy-MM-dd HH:mm:ss" :editable="false">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" v-loading="saveLoading"
        @click="onSaveItem">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>

    <!-- 仪器型号管理 -->
    <instr-model-list ref="basin" @getInstruData="getInstruData"/>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { mapState } from 'vuex';
import InstrModelList from '@/components/widgets/InstrModelList.vue';

export default {
  components: {
    InstrModelList,
  },
  data() {
    return {
      itemModel: {
        instrumentName: '', // 仪器名称
        instrumentCode: '', // 仪器编号
        instrumentType: '', // 仪器类型（常量）
        instrumentModel: '', // 仪器型号
        innerCode: '', // 本站编号
        portId: '', // 点位id
        psId: '', // 企业id
        leaveTime: '', // 出厂日期
        registerDate: '', // 登记日期
        setupDate: '', // 安装日期
        effectiveDate: '', // 有效日期
        calibrationDate: '', // 仪器校准日期
        location: '', // 所在位置
        status: '', // 状态（0：报废 1：正常 2：停用 3：过期)
      },
      loading: false,      // 表单状态
      saveLoading: false,  // 保存按钮状态
      rules: {
        instrumentName: [
          { required: true, message: '请输入仪器名称', trigger: 'blur' },
        ],
        instrumentType: [
          { required: true, message: '请选择仪器类型', trigger: 'change' },
        ],
        instrumentCode: [
          { required: true, message: '请选择仪器编号', trigger: 'blur' },
        ],
        instrumentModel: [
          { required: true, message: '请选择仪器型号', trigger: 'blur' },
        ],
        psId: [
          { required: true, message: '请输入污染源企业名称', trigger: 'blur' },
        ],
        portId: [
          { required: true, message: '请选择站点', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        leaveTime: [
          { required: true, message: '请选择出厂日期', trigger: 'change' },
        ],
        registerDate: [
          { required: true, message: '请选择登记日期', trigger: 'change' },
        ],
        setupDate: [
          { required: true, message: '请选择安装日期', trigger: 'change' },
        ],
        effectiveDate: [
          { required: true, message: '请选择有效日期', trigger: 'change' },
        ],
        calibrationDate: [
          { required: true, message: '请选择仪器校准日期', trigger: 'change' },
        ],
      },
      dict: {
        InstrumentCategory: [],
      },
      select: {
        portList: [],
      },
    };
  },
  computed: {
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  methods: {
    openDialog(id) {
      this.getDictList();
      this.getPortList();
      this.$refs.dialog.openDialog();
      this.$set(this.itemModel, 'psId', id);
    },
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http.post('bas/instrument/', this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 1500,
                showClose: true,
              });
              this.$refs.dialog.closeDialog();
              this.$emit('query');
            } else {
              this.$message.warning({
                showClose: true,
                message: response.data.msg,
                duration: 3000,
              });
            }
          }, ({ response }) => {
            analyzeResp(response);
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    closeDialog() {
      this.saveLoading = false;
      this.loading = false;
      this.itemModel = {
        instrumentName: '', // 仪器名称
        instrumentCode: '', // 仪器编号
        instrumentType: '', // 仪器类型（常量）
        instrumentModel: '', // 仪器型号
        innerCode: '', // 本站编号
        portId: '', // 点位id
        psId: '',  // 企业id
        leaveTime: '', // 出厂日期
        registerDate: '', // 登记日期
        setupDate: '', // 安装日期
        effectiveDate: '', // 有效日期
        calibrationDate: '', // 仪器校准日期
        location: '', // 所在位置
        status: '', // 状态（0：报废 1：正常 2：停用 3：过期)
      };
      this.$refs.form.clearValidate();
    },

    /* 特殊方法 */
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
    getPortList() {
      this.$http.get('bas/portInfo/', {
        params: { page: 1, rows: 100000, psId: this.psInfo.id },
      }).then((response) => {
        if (response.data.success) {
          this.select.portList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    /* 仪器模型管理 -- 子组件 */
    openInstruList() {
      this.$refs.basin.openDialog();
    },
    getInstruData(val) {
      this.$set(this.itemModel, 'instrumentName', val.instrumentName);
      this.$set(this.itemModel, 'instrumentCode', val.instrumentCode);
      this.$set(this.itemModel, 'instrumentType', val.instrumentType);
      this.$set(this.itemModel, 'instrumentModel', val.instrumentModel);
      // this.$refs.tableForm.clearValidate();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
