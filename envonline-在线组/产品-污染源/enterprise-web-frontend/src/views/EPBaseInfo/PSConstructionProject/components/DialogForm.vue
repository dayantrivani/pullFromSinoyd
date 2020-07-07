<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}建设项目`"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="formRules"
      label-width="130px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <select-table v-model="itemModel.psId" :label="psName"></select-table>
      </el-form-item>
      <el-form-item label="项目名称：" prop="projectName">
        <el-input
          v-model="itemModel.projectName"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="建设地点：">
        <el-input
          v-model="itemModel.constructionLocation"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="总投资(万元)：">
        <el-input-number
          v-model="itemModel.totalInvestment"
          controls-position="right"
          :precision="0"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="环保投资(万元)：">
        <el-input-number
          v-model="itemModel.protectionInvestment"
          controls-position="right"
          :precision="0"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="项目负责人：" prop="leader">
        <el-input
          v-model="itemModel.leader"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="负责人电话：" prop="telephone">
        <el-input
          v-model="itemModel.telephone"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          v-model="itemModel.remark"
          :autosize="{ minRows: 2 }"
        ></el-input>
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
        @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import SelectTable from '@/components/select-table';

export default {
  mixins: [saveItem],                     // 使用混合
  components: { SelectTable },
  data() {
    return {
      url: 'bas/psConstructionProject',  // 必须, 接口地址
      psName: '', // 显示企业名称
      itemModel: {
        psId: '',
        projectName: '',
        constructionLocation: '',
        totalInvestment: '',
        protectionInvestment: '',
        leader: '',
        telephone: '',
        remark: '',
      },          // 表单对象
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: ['blur', 'change'] },
        ],
        leader: [
          { required: true, message: '请输入项目负责人', trigger: ['blur', 'change'] },
        ],
        telephone: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的联系方式',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    getEmptyItem() {
      return {
        psId: '',
        projectName: '',
        constructionLocation: '',
        totalInvestment: '',
        protectionInvestment: '',
        leader: '',
        telephone: '',
        remark: '',
      };
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) this.psName = row.psName;

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
