<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '修改' : '新增'}产值维护`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs item-space"
        ref="form"
        label-position="right"
        label-width="150px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="企业名称：" prop="psId" hint-down>
              <el-select
                :disabled="isEdit"
                v-model="itemModel.psId"
                autofocus
                filterable>
                <el-option
                  v-for="(item, index) in select.psIds"
                  :key="index"
                  :label="item.psName"
                  :value="item.psId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="所属年份：" prop="belongYear">
              <el-date-picker
                :disabled="isEdit"
                v-model="itemModel.belongYear"
                type="year"
                placeholder="选择日期"
                :clearable="false"
                format="yyyy"
                value-format="yyyy">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="开票销售（万元）：" prop="totalOutputValue">
              <el-input :disabled="true" v-model="itemModel.totalOutputValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-loading="ploading" :gutter="10"  v-for="(item,index) in itemModel.detail" :key="index">
          <el-col :span="24">
            <!-- <el-form-item :class="{ 'is-error': item.value === ''}"
              :label="`${getName(item.key)}值：`" hint-down>
              <el-input placeholder="值不能为空" v-model="item.value"></el-input>
            </el-form-item> -->
            <el-form-item
              :class="{ 'is-error': !isNum(item.value) || item.value === '' }">
              <template slot="label">
                <div style="overflow-x:auto;white-space:nowrap;" :title="getName(item.key)">{{ getName(item.key) }}（万元）：</div>
              </template>
              <el-tooltip
                effect="dark"
                placement="top-start"
                :disabled="isNum(item.value)"
                :content="item.value === '' ? '值不能为空'
                  : (item.value && item.value.length > 9)
                  ? '位数不能超过10位' : '请输入数字'"
              >
                <el-input v-model="item.value"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [saveItem],
  props: ['positionList'],
  data() {
    return {
      url: 'bas/parkPSOutputValue', // 必须, 接口地址
      loading: false,               // 表单加载状态
      ploading: false,              // 产业加载状态
      saveLoading: false,           // 保存按钮加载状态
      formRules: {                  // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        belongYear: [
          { required: true, message: '请选择所属年份', trigger: ['blur', 'change'] },
        ],
        totalOutputValue: [
          { required: true, message: '请输入开票销售', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
      },
      itemModel: {                  // 表单对象
        psId: '',                   // 企业
        belongYear: new Date().getFullYear().toString(),             // 所属年份
        totalOutputValue: 0,        // 总产值
        detail: [],
      },
      select: {
        psIds: [],
      },
      once: true,                   // 是否编辑进入
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  watch: {
    'itemModel.detail': {
      handler(arr) {
        // val.reduce((o, n) => {  // o 代表旧值，n代表新值
        //   if () {

        //   }
        // }, 0);
        let value = 0;
        arr.forEach((v) => {
          if (v.value && this.isNum(v.value)) {
            value += Number(v.value);
          }
        });
        this.itemModel.totalOutputValue = value;
      },
      deep: true,
      immediate: true,
    },
    'itemModel.psId': {   // 企业id改变触发所在罐区接口查询
      handler() {
        if (!this.once || !this.isEdit) {
          this.getPositionList();
        }
        this.once = false;
      },
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.once = true;
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
        this.itemModel.belongYear = row.belongYear.toString();
      }
      this.getPSIdList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {       // 关闭对话框
      this.projectList = [];
      this.select.psIds = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },

    /** 请求接口 */
    getPSIdList() {       // 获取企业列表
      this.tankFarmList = [];
      this.loading = true;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1,
          rows: 100000,
          psType: -1,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.psIds = response.data.data || [];
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
    getPositionList() {    // 获取产业列表
      if (!this.itemModel.psId) return;
      // this.positionList = [];
      this.ploading = true;
      this.$http.get('bas/parkIndustryPosition2PS', {
        params: {
          page: 1,
          rows: 100000,
          psId: this.itemModel.psId,  // 企业id
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const data = response.data.data || [];
          this.itemModel.detail = data.map(v => ({
            key: v.industryId,
            value: 0,
          }));
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
        this.ploading = false;
      });
    },

    /** 特殊方法 */
    isNum(val) {
      if (val && val.length && val.length > 9) {    // 是否是超长值
        return false;
      }
      return /(^[-]?[0-9]+(\.[0-9]+)?)$/.test(val);
    },
    onSaveCheck(callback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const len = this.itemModel.detail.filter(v => v.value === '').length;
        if (len) {
          // this.$message.warning({
          //   showClose: true,
          //   duration: 3000,
          //   message: '产业产值不能为空',
          // });
          return;
        }
        let onOff = false;
        this.itemModel.detail.forEach((v) => {
          if (!this.isNum(v.value)) {
            onOff = true;
          }
        });
        if (onOff) {
        //   this.$message.warning({
        //     showClose: true,
        //     duration: 3000,
        //     message: '产业产值必须是数字',
        //   });
          return;
        }
        this.onSaveItem(callback);
      });
    },
    getName(id) {          // 获取产业名称
      return (this.positionList.filter(v => v.id === id)[0] || {}).industryName;
    },
    saveCallback() {      // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {      // 获取空对象
      return {
        psId: '',                   // 企业
        belongYear: new Date().getFullYear().toString(),             // 所属年份
        totalOutputValue: '',       // 总产值
        detail: [],
      };
    },
  },
};
</script>
