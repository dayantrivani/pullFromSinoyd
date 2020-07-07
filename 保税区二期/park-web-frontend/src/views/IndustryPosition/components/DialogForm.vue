<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '修改' : '新增'}产业定位`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="150px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="产业类型名称：" prop="industryName" hint-down>
              <el-input v-model="itemModel.industryName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="是否主导产业：" prop="isLeadingIndustry" hint-down>
              <el-tooltip :content="itemModel.isLeadingIndustry ? '是' : '否'" placement="top">
                <el-switch v-model="itemModel.isLeadingIndustry"></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="是否负面清单产业：" prop="isNegativeIistIndustry">
              <el-tooltip :content="itemModel.isNegativeIistIndustry ? '是' : '否'" placement="top">
                <el-switch v-model="itemModel.isNegativeIistIndustry"></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="企业：" prop="psIds">
              <el-tooltip effect="dark" placement="top-start"
                :disabled="!getPsNames(select.psIdList)" :content="getPsNames(select.psIdList)">
                <el-select
                  multiple
                  filterable
                  collapse-tags
                  v-model="itemModel.psIds">
                  <el-option
                    v-for="(item, index) in select.psIdList"
                    :key="index"
                    :label="item.psName"
                    :value="item.psId">
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"/>
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
        @click="onSaveCheck(saveCallback)">保 存</el-button>
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
  // props: {
  //   // dictParent: {     // 常量
  //   //   type: Object,
  //   //   required: true,
  //   // },
  // },
  data() {
    return {
      url: 'bas/parkIndustryPosition',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      formRules: {                  // 表单验证
        industryName: [
          { required: true, message: '请输入产业类型名称', trigger: ['blur', 'change'] },
        ],
        isLeadingIndustry: [
          { required: true, message: '是否主导产业', trigger: ['blur', 'change'] },
        ],
        isNegativeIistIndustry: [
          { required: true, message: '是否负面清单产业', trigger: ['blur', 'change'] },
        ],
        psIds: [
          { required: true, message: '请选择企业', trigger: ['blur', 'change'] },
        ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: ['blur', 'change'] },
        // ],
      },
      itemModel: {                  // 表单对象
        industryName: '',              // 企业
        isLeadingIndustry: false,      // 是否主导产业
        isNegativeIistIndustry: false, // 是否负面清单产业
        psIds: [],                     // 企业
        remark: '',                    // 备注
      },
      select: {
        psIdList: [],
      },
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.$refs.dialog.openDialog();
      this.getPSIdList();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    closeDialog() {       // 关闭对话框
      this.select.psIdList = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },
    getPsNames(value) {
      // console.log(value, this);
      let psNames = '';
      if (value.length) {
        psNames = value.filter(n => this.itemModel.psIds.includes(n.psId)).map(n => n.psName).join(',');
      }
      return psNames;
    },

    /** 请求接口 */
    getPSIdList() {            // 获取企业列表
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
          this.select.psIdList = response.data.data || [];
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
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        industryName: '',              // 企业
        isLeadingIndustry: false,      // 是否主导产业
        isNegativeIistIndustry: false, // 是否负面清单产业
        psIds: [],                     // 企业
        remark: '',                    // 备注
      };
    },
  },
};
</script>
