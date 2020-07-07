<template>
  <dialog-modal
    ref="dialog"
    size="small"
    min-width="550px"
    :title="title"
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="96px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="企业名称：" prop="psId" hint-down>
            <el-select
              v-model="itemModel.psId"
              autofocus
              filterable
              :disabled="userType === 'ent'">
              <el-option
                v-for="(item, index) in psBaseList"
                :key="index"
                :label="item.psName"
                :value="item.psId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="因子类型：" prop="factorType">
            <el-select v-model="itemModel.factorType">
              <el-option
                v-for="(item, key) in $enum.FactorsType"
                :key="key"
                :label="item"
                :value="key - 0">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="执行标准：">
            <el-input v-model="itemModel.implementationCriteria"></el-input>
            <!-- <el-select v-model="itemModel.implementationCriteria">
              <el-option
                v-for="(item, index) in dict.FifteenKeyHazardousProcesses"
                :key="index"
                :label="item.dictName"
                :value="item.rowGuid">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="因子名称：" prop="factorName">
            <el-input v-model="itemModel.factorName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="浓度单位：">
            <el-input v-model="itemModel.unit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上限值：">
            <el-input v-model="itemModel.upperLimitValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="排放量：">
            <el-input v-model="itemModel.cou"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下限值：">
            <el-input v-model="itemModel.lowerLimitValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="排放规律：">
            <el-select v-model="itemModel.outPutRuleCodeId">
              <el-option
                v-for="(item, index) in dict.CharacteristicPollutantsOutPutRule"
                :key="index"
                :label="item.dictName"
                :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排放范围：">
            <el-input v-model="itemModel.outPutRange"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="排放量单位：">
            <el-input v-model="itemModel.couUnit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="formLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>


<script>
import formRules from './rules';
// 引入混合 - 保存记录方法
import { mapGetters } from 'vuex';
import { saveItem } from '@/plugins/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  props: {
    readOnly: Boolean,
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    title() {
      const text = '因子';
      return this.readOnly ? `${text}信息` : `${this.itemModel.id ? '编辑' : '新增'}${text}`;
    },
  },
  data() {
    return {
      url: 'bas/pSCharacteristicPollutants',  // 必须, 接口地址
      itemModel: this.getEmptyItem(),
      // 表单验证
      rules: formRules,
      // 字典表
      dict: {
        CharacteristicPollutantsOutPutRule: [], // 企业特征污染物排放规律
      },
      // 企业基本信息列表
      psBaseList: [],
    };
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : '',  // 企业ID
        factorType: '',             // 因子类型（1废水、2废气、3土壤）
        factorName: '',             // 因子名称
        implementationCriteria: '', // 执行标准
        upperLimitValue: '',        // 上限值
        lowerLimitValue: '',        // 下限值
        unit: '',                   // 浓度单位
        cou: '',                    // 排放量
        couUnit: '',                // 排放量单位
        outPutRuleCodeId: '',       // 排放规律（字典表）
        outPutRange: '',            // 排放范围
      };
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();

      if (!this.itemModel.id) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }

      // 是否需要获取字典表
      this.getDictList();
      this.getPsBaseList();

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
    // 判断对象是否为空
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    },
    // 获取字典表数据
    getDictList() {
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      Object.keys(this.dict).forEach(((key) => {
        if (this.dict[key].length === 0) {
          this.$http.get('sys/enumCode', {
            params: { codeValue: key },
          }).then((response) => {
            this.dict[key] = [...response.data];
          });
        }
      }));
    },
  },
};
</script>
