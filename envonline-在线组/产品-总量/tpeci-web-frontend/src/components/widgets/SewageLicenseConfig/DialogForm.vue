<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    append-to-body
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}排污许可因子`"
    @close="closeDialog">
    <el-form
      class="mar-t-xs pad-x-sm item-space el-box"
      ref="form"
      :rules="formRules"
      label-position="right"
      label-width="100px"
      v-loading="loading"
      :model="itemModel">
      <el-form-item label="因子名称：" prop="factorCode" hint-down>
        <el-select v-model="itemModel.factorCode" filterable @change="getFactorData">
          <el-option
            v-for="(item, index) in select.factorList"
            :key="index"
            :label="item.factorName"
            :value="item.factorCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位：" prop="unit">
        <el-input v-model="itemModel.unit" disabled></el-input>
      </el-form-item>
      <el-form-item label="许可排放量：" prop="permittedEmissions">
        <el-input v-model="itemModel.permittedEmissions" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [saveItem],                     // 使用混合
  props: {
    permitId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      url: 'bas/pollutantDischargePermitFactors',   // 必须, 接口地址
      loading: false,
      // psName: '',                // 显示企业名称
      itemModel: {               // 表单对象
        permitId: '',            // 许可证id
        factorId: '',            // 因子id
        factorCode: '',          // 因子编码
        factorName: '',          // 因子名称
        permittedEmissions: '',  // 许可排放量
        remark: '',              // 备注
        unit: '',                // 单位
      },
      select: {                  // 选择框数据
        factorList: [],          // 因子列表
      },
      formRules: {
        permittedEmissions: [
          { required: true, message: '请输入许可排放量', trigger: ['blur', 'change'] },
          { pattern: /(^[0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字,且不能为负数' },
        ],
        // unit: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        factorCode: [
          { required: true, message: '请选择因子', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    isEdit() {                  // 是否为编辑操作
      return this.itemModel.id;
    },
  },
  methods: {
    openDialog() {            // 打开对话框
      // let val = row;
      // if (val) { val = _.cloneDeep(row); }
      this.getFactorList();
      this.$set(this.itemModel, 'permitId', this.permitId);
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /** 接口请求层 */
    getFactorList() {            // 获取因子列表
      this.select.factorList = [];
      this.loading = true;
      this.$http.get('cfg/factors', {
        params: {
          page: 1,
          rows: 100000,
          category: 1,                // 总量因子皆为废水因子,此处固定
          factorName: '',             // 因子名称
          factorCode: '',             // 因子编码
          oldFactorCode: '',          // 因子原编码
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorList = response.data.data || [];
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
        this.loading = false;
      });
    },

    /** 特殊方法 */
    getFactorData(val) {            // 获取因子数据
      const data = this.select.factorList.filter(v => v.factorCode === val)[0] || {};
      this.$set(this.itemModel, 'factorId', data.id || '');
      this.$set(this.itemModel, 'factorName', data.factorName || '');
      this.$set(this.itemModel, 'unit', data.unitCou || '');
    },
    saveCallback() {             // 保存按钮回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {              // 关闭弹框
      this.psName = '';
      this.select.factorList = [];
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {             // 清空数据
      // if (val) {
      //   return [...Object.keys(this.itemModel), 'id'].forEach((v) => {
      //     if (val[v] !== '' && val[v] !== undefined && val[v] !== null) {
      //       this.$set(this.itemModel, v, val[v]);
      //     }
      //   });
      // }
      return {
        permitId: '',            // 许可证id
        factorId: '',            // 因子id
        factorCode: '',          // 因子编码
        factorName: '',          // 因子名称
        permittedEmissions: '',  // 许可排放量
        remark: '',              // 备注
        unit: '',                // 单位
      };
    },
  },
};
</script>
