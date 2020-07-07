<template>
  <dialog-modal
    ref="dialog"
    size="middle"
    min-width="550px"
    scrollbar
    :title="title"
    @close="closeDialog">
    <div v-show="!disabled">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="formLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
      <hr>
    </div>
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="85px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="formRules">
      <fieldset-flex title="基本信息">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="企业名称：" prop="psId" hint-down>
              <el-select
                :disabled="disabled"
                v-model="itemModel.psId"
                autofocus
                filterable>
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
            <el-form-item label="项目名称：" prop="projectName">
              <el-input v-model="itemModel.projectName" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="项目时间：" prop="projectDate">
              <el-date-picker
                v-model="itemModel.projectDate"
                type="date"
                :disabled="disabled"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否验收：" prop="projectAcceptance">
              <el-tooltip :content="itemModel.projectAcceptance ? '是' : '否'" placement="top">
                <el-switch
                  :disabled="disabled"
                  v-model="itemModel.projectAcceptance"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset-flex>
      <template v-if="docType.length">
        <fieldset-flex
          v-for="(item, key) in docType"
          :key="key"
          :title="item.dictName">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="文号：">
                <el-input :maxlength="30" v-model="itemModel.dtoPSProjectApprovals[key].approvalNumber" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批复时间：">
                <el-date-picker
                  v-model="itemModel.dtoPSProjectApprovals[key].approvalTime"
                  type="date"
                  :disabled="disabled"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附件：">
                <upload-project-file
                  btn="add down remove"
                  :ref="`upload-${key}`"
                  :id="itemModel.id"
                  :disabled="disabled"
                  :index="key"
                  :doc-type-id="itemModel.dtoPSProjectApprovals[key].approvalType"
                  @change="uploadChange" />
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset-flex>
      </template>
    </el-form>
  </dialog-modal>
</template>


<script>
import formRules from './rules';
// 引入混合 - 保存记录方法
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import UploadProjectFile from './UploadProjectFile';

export default {
  components: {
    UploadProjectFile,
  },
  // 使用混合
  mixins: [
    saveItem,
  ],
  props: {
    docType: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    title() {
      const text = '项目建设信息';
      if (this.disabled) {
        return `${text}详情`;
      }
      return `${this.itemModel.id ? '编辑' : '新增'}${text}`;
    },
  },
  data() {
    return {
      url: 'bas/pSProjectInfo',  // 必须, 接口地址
      disabled: false,
      itemModel: {},
      once: true,
      // 表单验证
      formRules,
      // 企业基本信息列表
      psBaseList: [],
      // 文档列表
      docList: [],
    };
  },
  created() {
    this.getDictList();
    this.getPsBaseList();
  },
  watch: {
    docType(val) {
      if (val.length && this.once) {
        this.itemModel = this.getEmptyItem();
        this.once = false;
      }
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: '',  // 企业ID
        projectName: '',            // 项目名称
        projectDate: '',            // 项目时间
        projectAcceptance: 0,       // 0 未验收，1 已验收
        dtoPSProjectApprovals: this.docType.map(v => ({
          approvalNumber: '',             // 批文文号
          approvalTime: '',               // 批文时间
          approvalType: v.dictValue - 0,  // 批文类型 批文类型（枚举）
          approvalTypeName: v.dictName,   // 批文类型名称
        })),
      };
    },
    // 保存数据后回调
    saveCallback() {
      this.formLoading = false;
      this.$emit('query');
      this.closeDialog();
    },
    uploadChange(fileList, index) {
      const refName = `upload-${index}`;
      if (fileList.length) {
        if (!this.docList.includes(refName)) {
          this.docList.push(refName);
        }
      } else {
        const i = this.docList.findIndex(v => v === refName);
        if (i > -1) { this.docList.splice(i, 1); }
      }
    },
    // 打开对话框
    openDialog(row, type) {
      this.disabled = type === 'info';
      // 合并参数对象
      this.docList = [];
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (this.itemModel.id) {
        this.getItemOne(row);
        this.itemModel.dtoPSProjectApprovals.forEach((item, key) => {
          if (item.id) {
            this.$nextTick(() => {
              this.$refs[`upload-${key}`][0].getList();
            });
          }
        });
      } else {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
        this.itemModel.dtoPSProjectApprovals.forEach((item, key) => {
          this.$nextTick(() => {
            this.$refs[`upload-${key}`][0].reset();
          });
        });
      }
      this.$refs.dialog.openDialog(); // 显示编辑表单
    },
    // 关闭对话框
    closeDialog() {
      this.formLoading = false;
      this.$refs.dialog.closeDialog();
      this.itemModel = this.getEmptyItem();
    },
    getItemOne(row) {
      const expandOld = row.dtoPSProjectApprovals;
      const expandEmpty = this.getEmptyItem().dtoPSProjectApprovals;
      this.itemModel.dtoPSProjectApprovals = expandEmpty.map((v) => {
        const index = expandOld.findIndex(val => val.approvalType === v.approvalType);
        if (index > -1) {
          // eslint-disable-next-line
          v = expandOld[index];
        }
        if (row.id) {
          v.id = v.id || '';
          v.projectId = row.id;
        }
        return v;
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
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
            this.docList.forEach((item) => {
              this.$nextTick(() => {
                this.$refs[item][0].sendUpload(id || response.data.data.id, true);
              });
            });
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
            this.formLoading = false;
          }
        }, ({ response }) => {
          analyzeResp(response);
          this.formLoading = false;
        });
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
  },
};
</script>
