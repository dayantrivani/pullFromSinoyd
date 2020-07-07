<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}排污核定`"
    @close="closeDialog">
    <el-form ref="form" :rules="rules" label-width="100px" :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <!-- 新增的时候从接口中获取,编辑的时候不能修改 -->
        <select-table
          v-model="itemModel.psId"
          :label="itemModel.psName"
          :disable="isEdit"
          @change="getPSDate"
        ></select-table>
      </el-form-item>

      <el-form-item label="核定年份：" prop="approvedYear">
        <el-date-picker
          v-model="itemModel.approvedYear"
          type="year"
          value-format="yyyy"
          format="yyyy"
          :clearable="false"
          :editable="false"
          style="width: 100%"
          @change="getYearDate"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="站点名称：" prop="portId">
        <el-select
          v-loading="fploading"
          v-model="itemModel.portId"
          filterable
          @change="getPortDate"
        >
          <el-option
            v-for="(item, key) in select.portList"
            :key="key"
            :label="item.portName"
            :value="item.id">
          </el-option>
        </el-select>
        <!-- <select-port
          v-loading="ploading"
          width="100%"
          v-model="itemModel.portId"
          filterable
          :options="select.portList"
          :field="[
            { name: 'psName', key: 'psId' },
            { name: 'portName', key: 'id' },
          ]"
          @change="getPortDate">
        </select-port> -->
      </el-form-item>

      <el-form-item label="因子名称：" prop="factorId">
        <el-select
          v-loading="fploading"
          v-model="itemModel.factorId"
          filterable
          style="width: 100%"
          clearable
          @change="getFactorDate"
        >
          <el-option v-for="item in select.factorList" :key="item.factorId"
            :label="item.factorName" :value="item.factorId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单位：" prop="unit">
        <el-input v-model="itemModel.unit" disabled clearable></el-input>
      </el-form-item>

      <el-form-item prop="emissions">
        <template slot="label">
          排放量
          <span>
            <el-tooltip
              effect="dark"
              :content="`提示：许可排放量：${permittedEmissions} ${unit}
                | 剩余排放量：${notPermittedEmissions.toString() === '0.00' ? 0 : notPermittedEmissions} ${unit}`"
              placement="top">
              <i class="el-tooltip el-icon-info"></i>
            </el-tooltip>
          </span>
          <span> ：</span>
        </template>
        <el-input v-model="itemModel.emissions" clearable></el-input>
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
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { saveItem } from '@/global/libs/mixins';
import SelectTable from '@/components/select-table';
// import SelectPort from '@/components/widgets/select-port';

export default {
  mixins: [saveItem],               // 使用混合
  components: {
    SelectTable,
    // SelectPort,
  },
  data() {
    return {
      saveLoading: false,                   // 保存按钮
      url: 'tpeci/pollutantDischargeApproved',  // 必须, 接口地址
      fploading: false,
      once: true,                           // 是否是点击编辑按钮进入
      itemModel: {                          // 表单对象
        psName: '',                         // 企业名称--SelectTable组件
        psId: '',                           // 企业id
        portId: '',                         // 站点id
        portName: '',                       // 站点名称
        factorId: '',                       // 因子id
        factorName: '',                     // 因子名称
        factorCode: '',                     // 因子编码
        unit: '',                           // 单位
        emissions: '',                      // 排放量
        approvedTime: '',                   // 核定时间
        approvedYear: '',                   // 核定年份
        remark: '',                         // 备注
      },
      select: {                             // 查询条件选择框
        portList: [],                       // 站点接口数据
        factorList: [],                     // 因子接口数据
      },
      /** 因子提示文字 */
      notPermittedEmissions: '',            // 剩余排放量
      permittedEmissions: '',               // 许可排放量
      unit: '',                             // 因子单位
      rules: {                              // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        portId: [
          { required: true, message: '请选择站点', trigger: ['blur', 'change'] },
        ],
        factorId: [
          { required: true, message: '请选择因子', trigger: ['blur', 'change'] },
        ],
        // unit: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        emissions: [
          { required: true, message: '请输入排放量', trigger: ['blur', 'change'] },
          { pattern: /(^[0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字,且不能为负数' },
        ],
        approvedYear: [
          { required: true, message: '请输入核定年份', trigger: ['blur', 'change'] },
        ],
        // unit: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
      },
    };
  },
  computed: {
    isEdit() {                      // 是否为编辑对话框
      return this.itemModel.id;
    },
  },
  watch: {
    'itemModel.psId': {
      handler() {
        if (this.itemModel.approvedYear !== ''
          && this.itemModel.psId !== ''
          && !this.once) {
          this.getSelectList();
          this.itemModel.portId = '';
          this.itemModel.portName = '';
          this.itemModel.factorId = '';
          this.itemModel.factorName = '';
          this.itemModel.factorCode = '';
          this.itemModel.unit = '';
        }
      },
      deep: true,
    },
    'itemModel.approvedYear': {
      handler() {
        if (this.itemModel.approvedYear !== ''
          && this.itemModel.psId !== ''
          && !this.once) {
          this.getSelectList();
          this.itemModel.portId = '';
          this.itemModel.portName = '';
          this.itemModel.factorId = '';
          this.itemModel.factorName = '';
          this.itemModel.factorCode = '';
          this.itemModel.unit = '';
        }
      },
      deep: true,
    },
  },
  methods: {
    openDialog(row) {               // 打开对话框
      this.itemModel.approvedYear = new Date().getFullYear().toString();
      this.getYearDate();
      let val = row;
      if (row) {
        val = _.cloneDeep(row);
        this.itemModel.psName = val.psName || '';
        this.permittedEmissions = row.permittedEmissions || '';
        this.notPermittedEmissions = row.notPermittedEmissions || '';
        // console.log();
        this.unit = row.unit || '';
        this.itemModel = this.setEmptyItem(val);
        this.getSelectList();
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.once = false;
        this.$refs.form.clearValidate();
      });
    },

    /** 接口层 */
    getSelectList() {               // 获取因子列表
      this.select.factorList = [];
      this.select.portList = [];
      this.fploading = true;
      this.$http.get('tpeci/pollutantDischargeApproved/factor', {
        params: {
          psId: this.itemModel.psId,                   // 企业id
          approvedYear: this.itemModel.approvedYear,   // 审核年份
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const data = response.data.data || {};
          this.select.factorList = data.factorList || [];
          this.select.portList = data.portList || [];
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
        this.fploading = false;
      });
    },

    /** 表单下拉框方法 */
    getPSDate(val) {                 // 企业选择框
      this.itemModel.psName = val;
    },
    getFactorDate(val) {             // 因子下拉框
      let obj = {};
      obj = this.select.factorList.find(item => item.factorId === val) || {};
      this.itemModel.factorName = obj.factorName || '';
      this.itemModel.factorCode = obj.factorCode || '';
      this.itemModel.unit = obj.unit || '';
      this.notPermittedEmissions = obj.notPermittedEmissions || '';
      this.permittedEmissions = obj.permittedEmissions || '';
      this.unit = obj.unit || '';
    },
    getYearDate() {                  // 阈值年份日期选择框
      this.itemModel.approvedTime = this.$tools.formatDate(new Date(), 'Y-m-d H:i:s');
    },
    getPortDate(val) {               // 站点选择框
      let obj = {};
      obj = this.select.portList.find(item => item.id === val);
      this.itemModel.portName = obj.portName || '';
      this.itemModel.regionCodeId = obj.regionCodeId || '';
      this.itemModel.regionName = obj.regionName || '';
    },

    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    saveCallback() {                // 保存请求回调
      this.once = true;
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.once = true;
      this.select = {
        portList: [],               // 站点接口数据
        factorList: [],             // 因子接口数据
      };
      this.notPermittedEmissions = '';
      this.permittedEmissions = '';
      this.unit = '';
      this.psName = '';
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        psName: '',                         // 企业名称--SelectTable组件
        psId: '',                           // 企业id
        portId: '',                         // 站点id
        portName: '',                       // 站点名称
        factorId: '',                       // 因子id
        factorName: '',                     // 因子名称
        factorCode: '',                     // 因子编码
        unit: '',                           // 单位
        emissions: '',                      // 排放量
        approvedTime: '',                   // 核定时间
        approvedYear: '',                   // 核定年份
        remark: '',                         // 备注
      };
    },
    setEmptyItem(val) {             // 将列表数据赋值给表单数据
      const yearStr = (val.approvedYear || '').toString();
      return {
        id: val.id || '',                       // 唯一标识
        psName: val.psName || '',
        psId: val.psId || '',                   // 企业id
        portId: val.portId || '',               // 站点id
        factorId: val.factorId || '',           // 因子id
        factorName: val.factorName || '',       // 因子名称
        factorCode: val.factorCode || '',       // 因子编号
        unit: val.unit || '',                   // 单位
        emissions: val.emissions || '',         // 排放量
        approvedTime: val.approvedTime || '',   // 核定时间
        approvedYear: yearStr,                  // 核定年份
        remark: val.remark || '',               // 备注
      };
    },
  },
};
</script>
