<template>
  <!-- 因子配置 -- 新增和编辑弹框 -->
  <dialog-modal
    ref="dialog"
    size="mini"
    :append-to-body="appendToBody"
    :title="`${title}`"
    @close="onCloseDialog">
    <el-form ref="form" label-width="100px" :model="dialogModel" :rules="rules">
      <el-form-item label="所属类型：" prop="category">
        <el-select v-model="dialogModel.category" clearable style="width: 100%;" placeholder="请选择所属类型">
          <el-option v-for="(item, key) in $enum.category" :key="key" :label="item" :value="key - 0">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="值类型：" prop="valueType">
        <el-select v-model="dialogModel.valueType" clearable style="width: 100%;" placeholder="请选择值类型">
          <el-option v-for="(item, key) in options.valueType" :key="key" :label="item.dictName" :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="因子名称：" prop="factorName">
        <el-select ref="factorSelect" v-model="dialogModel.factorCode" clearable filterable style="width: 100%;">
          <el-option
            v-for="(item, key) in options.factors"
            :key="key"
            :label="item.factorName"
            :value="item.factorCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示：" prop="isShow">
        <el-tooltip :content="dialogModel.isShow ? '显示' : '不显示'" placement="top">
          <el-switch v-model="dialogModel.isShow"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="是否启用：" prop="isEnabled">
        <el-tooltip :content="dialogModel.isEnabled ? '启用' : '停用'" placement="top">
          <el-switch v-model="dialogModel.isEnabled"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="排序：" prop="orderNum">
        <el-input-number
          v-model="dialogModel.orderNum"
          controls-position="right"
          style="width: 100%;"
          :min="0"
          :max="2147483647"
          :precision="0">
        </el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onClickSave">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'FactorDialog',
  props: {
    title: {
      type: String,
      required: true,
    },
    mainId: {
      required: true,
    },
  },
  data() {
    return {
      saveLoading: false,
      url: 'cfg/pageShowItem/batch', // 接口地址
      options: {
        valueType: [],
        factors: [],
      },
      dialogModel: {
        pageShowMainId: null, // 主页的id
        category: '',         // 所属类型
        valueType: '',        // 值类型
        valueTypeName: '',    // 值类型名称
        factorName: '',       // 因子名称
        factorCode: '',       // 因子编号
        factorId: '',         // 因子的id
        isShow: false,        // 是否显示
        isEnabled: false,     // 是否启用
        orderNum: 1,          // 排序
      },
      rules: {
        category: [
          { required: true, message: '请选择所属类型', trigger: 'change' },
        ],
        valueType: [
          { required: true, message: '请选择值类型', trigger: 'blur' },
        ],
        factorName: [
          { required: true, message: '请输入因子名称', trigger: 'blur' },
        ],
      },
      editOne: false,                // 判断是否是编辑按钮引起的计算属性category变化
      appendToBody: true,
    };
  },
  computed: {
    // 所属类型
    category() { return this.dialogModel.category; },
    // 因子编码
    factorCode() { return this.dialogModel.factorCode; },
    // 值类型
    valueType() { return this.dialogModel.valueType; },
  },
  watch: {
    category(val) {
      // 所属类型修改后, 清空可以修改的值
      if (!this.editOne) {
        this.dialogModel.valueType = '';
        this.dialogModel.factorName = '';
        this.dialogModel.factorCode = '';
        this.dialogModel.factorId = '';
        this.options = {
          valueType: [],
          factors: [],
        };
      }
      this.editOne = false;
      // 在将参数传给方法,调接口
      let valueType = '';
      if (val === 1) {
        valueType = 'FactorValueTypeWater';
      } else if (val === 2) {
        valueType = 'FactorValueTypeAir';
      } else if (val === 3) {
        valueType = 'FactorValueTypeSoild';
      } else if (val === 4) {
        valueType = 'FactorValueTypeNoise';
      }
      if (!val) {
        this.options.valueType = [];
        this.options.factors = [];
        return;
      }
      this.getValueTypeData(valueType);
      this.getFactorsData(val);
    },
    factorCode(val) {
      this.options.factors.forEach((item) => {
        if (val === item.factorCode) {
          this.dialogModel.factorName = item.factorName;
          this.dialogModel.factorId = item.id;
        }
      });
    },
    valueType(val) {
      this.options.valueType.forEach((item) => {
        if (val === item.dictValue) this.dialogModel.valueTypeName = item.dictName;
      });
    },
    dialogModel: {
      handler() {
        this.dialogModel.pageShowMainId = this.mainId;
      },
      deep: true,
    },
  },
  created() {
    this.dialogModel.pageShowMainId = this.mainId;
  },
  methods: {
    // 父组件调用子组件方法打开对话框
    openDialog(val) {
      if (val) {
        this.dialogModel = val;
        this.editOne = true;
      }
      this.$refs.dialog.openDialog();
    },
    // 保存按钮
    onClickSave() {
      const { id } = this.dialogModel;
      let dialogModel = _.cloneDeep(this.dialogModel);
      if (id) {
        this.url = 'cfg/pageShowItem';
      } else {
        dialogModel = [this.dialogModel];
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http[id ? 'put' : 'post'](this.url, dialogModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '编辑' : '新增'}成功`,
                duration: 3000,
                showClose: true,
              });
              this.$emit('query');
              this.$refs.dialog.closeDialog();
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
      });
    },
    // 弹窗关闭前触发
    onCloseDialog() {
      this.dialogModel = {
        pageShowMainId: null,   // 主页的id
        category: '',         // 所属类型
        valueType: '',        // 值类型
        valueTypeName: '',    // 值类型名称
        factorName: '',       // 因子名称
        factorCode: '',       // 因子编号
        factorId: '',         // 因子的id
        isShow: false,        // 是否显示
        isEnabled: false,     // 是否启用
        orderNum: 1,          // 排序
      };
      this.options = {
        valueType: [],
        factors: [],
      };
      this.$refs.form.resetFields();
    },
    // 获取值类型接口数据
    getValueTypeData(str) {
      this.$http.get('sys/enumCode', {
        params: { codeValue: str },
      }).then((response) => {
        // console.log(response);
        if (response.status === 200) { // 直接返回数据才能这么判断
          this.options.valueType = response.data || [];
        } else {
          this.$message.error({
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    // 获取因子名称接口数据
    getFactorsData(num) {
      this.$http.get('cfg/factors/', {
        params: {
          page: 1,
          rows: 1000000,
          factorsType: 1,
          category: num,
        },
      }).then((response) => {
        if (response.data.success) {
          this.options.factors = response.data.data || [];
        } else {
          this.$message.error({
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
  },
};
</script>
