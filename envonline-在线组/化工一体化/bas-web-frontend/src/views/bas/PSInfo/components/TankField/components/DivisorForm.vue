<template>
  <dialog-modal
    ref="divisor"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}监控气体`"
    append-to-body
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="103px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-form-item label="气体名称：" prop="factorName">
        <el-input v-model="itemModel.factorName"></el-input>
      </el-form-item>
      <el-form-item label="气体编号：" prop="factorCode">
        <el-input v-model="itemModel.factorCode"></el-input>
      </el-form-item>
      <el-form-item label="气体类型：" prop="factorType">
        <el-select v-model="itemModel.factorType" @change="changeCode">
          <el-option :value="1" label="易燃易爆"></el-option>
          <el-option :value="2" label="有毒有害"></el-option>
          <el-option :value="3" label="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位：">
        <el-input v-model="itemModel.unit"></el-input>
      </el-form-item>
      <el-form-item label="二级报警阀值：">
        <el-input v-model="itemModel.alertUpper"></el-input>
      </el-form-item>
      <el-form-item label="一级报警阀值：">
        <el-input v-model="itemModel.earlyAlertUpper"></el-input>
      </el-form-item>
      <el-form-item label="低限：">
        <el-input v-model="itemModel.earlyAlertLow"></el-input>
      </el-form-item>
      <el-form-item label="低低限：">
        <el-input v-model="itemModel.alertLow"></el-input>
      </el-form-item>
      <el-form-item label="排序号：">
        <el-input-number
          v-model="itemModel.sortNum"
          controls-position="right"
          style="width:100%"
          :min="0"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
// import { formatDate, getType } from '@/global/libs/tools';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  props: {
    mindid: {
      default: '',
    },
    psids: {
      default: '',
    },
  },
  data() {
    return {
      url: 'keypoints/monitorFactorSetting',                  // 必须, 接口地址
      isEidt: false,
      itemModel: {},
      // 字典数据
      dict: {},
      rules: {
        factorName: [
          { required: true, message: '请输入气体名称', trigger: ['blur', 'change'] },
        ],
        factorType: [
          { required: true, message: '请选择所属类型', trigger: ['blur', 'change'] },
        ],
        factorCode: [
          { required: true, message: '请选择因子', trigger: ['blur', 'change'] },
        ],
      },
      tankFarmData: [],
      type: '',
      watchType: '',
      saveLoading: false,
      formLoading: false,
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {},
  watch: {
    'itemModel.factorType': {
      handler(newData) {
        this.watchType = newData;
      },
    },
  },
  methods: {
    // 获取对应的因子
    changeCode(val) {
      if (this.watchType !== val && this.watchType !== undefined) {
        this.itemModel.factorCode = '';
      }
      this.getTankFarmId(val);
    },
    // 获取对应的name值
    changeName(val) {
      if (val) {
        this.tankFarmData.forEach((res) => {
          if (val === res.factorCode) {
            this.itemModel.factorName = res.factorName;
          }
        });
      }
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 调用所属罐区接口
    getTankFarmId(val) {
      const nav = {};
      nav.factorType = val;
      this.$http.post('keypoints/majorHazardsFactors/all', nav).then((response) => {
        if (response.data.success) {
          this.tankFarmData = response.data.data;
        }
      });
    },
    // 获取空对象
    getEmptyItem() {
      return {
        factorName: '',               // 因子编码
        factorType: '',
        factorCode: '',               // 因子编码
        unit: '',
        alertUpper: '',               // 报警上限
        alertLow: '',                 // 报警下限
        earlyAlertUpper: '',          // 预警上限
        earlyAlertLow: '',            // 预警下限
        sortNum: '',                  // 排序号
      };
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        if (row.factorType) {
          this.getTankFarmId(row.factorType);
        }
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.itemModel.psId = this.psids;
        this.itemModel.portId = this.mindid;
      } else {
        this.itemModel = this.getEmptyItem();
        this.itemModel.psId = this.psids;
        this.itemModel.portId = this.mindid;
      }

      // 显示编辑表单
      this.$refs.divisor.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.$refs.divisor.closeDialog();
    },
    // 判断对象是否为空
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    },
    // 保存记录
    onSaveCheck(callback) {
      // 表单是否需要验证
      if (this.isEmptyObj(this.rules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      this.formLoading = true;
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
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
          this.formLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
