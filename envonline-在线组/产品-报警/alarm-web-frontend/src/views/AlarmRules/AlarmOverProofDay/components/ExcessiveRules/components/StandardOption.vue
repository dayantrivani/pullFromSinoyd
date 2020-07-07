<template>
  <dialog-modal ref="dialog" title="标准选择" @close="closeDialog" size="mini" appendToBody>
    <el-form ref="form" :model="itemModel" :rules="rules" label-width="85px" class="mar-t-sm mar-x-sm item-space">
      <el-form-item label="标准名称：" prop="evaluationId">
        <el-select v-model="itemModel.evaluationId" @change="getStandardLevel">
          <el-option
            v-for="item in standardName"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准等级：" prop="evaluationLevelId">
        <el-select v-model="itemModel.evaluationLevelId">
          <el-option
            v-for="item in standardLevel"
            :key="item.id"
            :value="item.id"
            :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" @click="onSaveCheck">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'StandardOption',
  props: ['portId'],
  mixins: [queryList],
  components: {},
  inject: ['grandPa'],
  data() {
    return {
      isAuto: false,
      itemModel: {
        evaluationId: '',
        evaluationLevelId: '',
        alarmTypeId: '',
        alarmTypeCode: '',
        evaluationName: '',
        evaluationCode: '',
        dtoAlarmRuleForAbnormalPorts: [],
      },
      hasEvaluation: false,
      rules: {
        evaluationId: [
          { required: true, message: '请选择标准名称', trigger: ['change', 'blur'] },
        ],
        evaluationLevelId: [
          { required: true, message: '请选择标准等级', trigger: ['change', 'blur'] },
        ],
      },
      standardName: [],
      standardLevel: [],
    };
  },
  created() {
    this.getStandardName();
  },
  computed: {
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  watch: {},
  methods: {
    openDialog() {
      this.hasEvaluation = this.portId.some(e => e.evaluationId);
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 点击保存
    onSaveCheck() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.itemModel.alarmTypeId = this.alarmType.id;
        this.itemModel.alarmTypeCode = this.alarmType.alarmTypeCode;
        this.itemModel.evaluationName = this.standardName.find(e => e.id === this.itemModel.evaluationId).name;
        this.itemModel.evaluationCode = this.standardName.find(e => e.id === this.itemModel.evaluationId).code;
        if (this.hasEvaluation) {
          this.$confirm('此操作将覆盖已配置标准, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.configEvaluation();
          });
        } else {
          this.configEvaluation();
        }
      });
    },
    // 批量配置标准
    configEvaluation() {
      const { evaluationId, evaluationLevelId } = this.itemModel;
      const data = this.portId.map(e => ({ id: e.id, evaluationId, evaluationLevelId }));
      this.$http.put('bas/portInfo/batch', data).then((response) => {
        if (response.data.success) {
          this.itemModel.dtoAlarmRuleForAbnormalPorts = this.portId.map(e => ({ portId: e.id }));
          this.$http.post('alarm/alarmRuleForOverProofPort/batch', this.itemModel).then((res) => {
            if (res.data.success) {
              this.$emit('query');
              this.grandPa.getItemList();
              this.closeDialog();
            } else {
              this.$message({
                type: 'warning',
                showClose: true,
                message: res.data.msg,
              });
            }
          });
        } else {
          this.$message({
            type: 'warning',
            showClose: true,
            message: response.data.msg,
          });
        }
      });
    },
    // 批量新增报警规则
    // addAlarmRule() {
    //   this.itemModel.dtoAlarmRuleForAbnormalPorts = this.portId;
    //   return this.$http.post('alarm/alarmRuleForOverProofPort/batch', this.itemModel);
    // },
    // 批量修改评价标准
    // editEvaluation() {
    //   const { evaluationId, evaluationLevelId } = this.itemModel;
    //   const data = this.portId.map(e => ({ id: e.portId, evaluationId, evaluationLevelId }));
    //   return this.$http.put('bas/portInfo/batch', data);
    // },
    // 获取标准等级
    getStandardLevel() {
      this.itemModel.evaluationLevelId = '';
      this.$http.get('bas/evaluationLevel', {
        params: {
          page: 1,
          rows: 100000,
          evaluationId: this.itemModel.evaluationId,
          sort: 'orderNum+, name',
        },
      }).then((response) => {
        if (response.data.success) {
          this.standardLevel = response.data.data;
        } else {
          this.$message({
            type: 'warning',
            showClose: true,
            message: response.data.msg,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 获取标准名称
    getStandardName() {
      this.$http.get('bas/evaluationCriteria', {
        params: {
          page: 1,
          rows: 100000,
        },
      }).then((response) => {
        if (response.data.success) {
          this.standardName = response.data.data || [];
        } else {
          this.$message({
            type: 'warning',
            showClose: true,
            message: response.data.msg,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
