<template>
  <dialog-modal ref="dialog" size="small" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}化学能演信息`" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="150px" :rules="rules" :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="能源名称："  prop="energyName">
            <el-input :maxlength="100" v-model="itemModel.energyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年用量（t/m³）：" prop="annualConsumption">
            <el-input :maxlength="20" v-model="itemModel.annualConsumption"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="最大储存量（t/m³）：" prop="maxStorageCapacity">
            <el-input :maxlength="20" v-model="itemModel.maxStorageCapacity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涉及工艺：" prop="involveProcess">
            <el-input :maxlength="30" v-model="itemModel.involveProcess"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否进行安全评价：" prop="isSafetyEvaluation">
            <el-select v-model="itemModel.isSafetyEvaluation" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否设置监控设施：" prop="isMonitor">
            <el-select v-model="itemModel.isMonitor" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="设置监控设施内容：" prop="remark">
            <el-input :maxlength="200" type="textarea" v-model="itemModel.monitorContent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input :maxlength="500" type="textarea" v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { validateNum } from '@/libs/tools';

export default {
  data() {
    return {
      url: 'wholeprocess/chemicalEnergySourceInfo',
      itemModel: this.getEmptyItem(),
      rules: {
        energyName: [
          { required: true, message: '请输入能源名称', trigger: ['blur', 'change'] },
        ],
        isSafetyEvaluation: [
          { required: true, message: '请选择是否进行安全评价', trigger: ['blur', 'change'] },
        ],
        isMonitor: [
          { required: true, message: '请选择是否设置监控设施', trigger: ['blur', 'change'] },
        ],
        annualConsumption: [
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
        maxStorageCapacity: [
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        energyName: '', // 能源名称
        annualConsumption: '', // 年用量
        maxStorageCapacity: '', // 最大储存量
        involveProcess: '', // 涉及工艺
        isSafetyEvaluation: '', // 是否进行安全评价
        isMonitor: '', // 是否设置监控设施
        monitorContent: '', // 设置监控设施内容
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
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
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
