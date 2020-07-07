
<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}班组信息`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="110px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="企业名称：" prop="psId" hint-down>
              <select-table v-model="itemModel.psId" :label="psName" @selected="selected" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车间名称：" prop="departmentId" hint-down>
              <el-select v-model="itemModel.departmentId">
                <el-option
                  v-for="(item, index) in departmentList"
                  :key="index"
                  :label="item.departmentName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="班组名称：" prop="teamName">
              <el-input v-model="itemModel.teamName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="班组岗位说明：" prop="jobDescription">
              <el-input v-model="itemModel.jobDescription"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="负责人姓名：" prop="leaderName">
              <el-input v-model="itemModel.leaderName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系方式：" prop="telephone">
              <el-input v-model="itemModel.telephone"></el-input>
            </el-form-item>
          </el-col>
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
import SelectTable from '@/components/select-table';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [saveItem],
  components: {
    SelectTable,
  },
  data() {
    return {
      url: 'bas/psTeamManage',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      psName: '',                   // 企业名称
      formRules: {                  // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        departmentId: [
          { required: true, message: '请选择车间名称', trigger: ['blur', 'change'] },
        ],
        teamName: [
          { required: true, message: '请输入班组名称', trigger: ['blur', 'change'] },
        ],
        // jobDescription: [
        //   { required: true, message: '请输入班组岗位说明', trigger: ['blur', 'change'] },
        // ],
        leaderName: [
          { required: true, message: '请输入负责人姓名', trigger: ['blur', 'change'] },
        ],
        telephone: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确格式的联系方式',
            trigger: 'blur',
          },
        ],
      },
      departmentList: [],           // 车间/部门数据集合
      itemModel: {                  // 表单对象
        psId: '',                   // 企业id
        departmentId: '',           // 车间/部门id
        teamName: '',               // 班组名称
        jobDescription: '',         // 班组岗位说明
        leaderName: '',             // 负责人姓名
        telephone: '',              // 联系方式
        remark: '',                 // 备注
      },
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  watch: {
    'itemModel.psId': {   // 企业id改变触发车间/部门接口查询
      handler() {
        this.getDepartmentList();
      },
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.psName = row ? row.psName : '';
      this.$refs.dialog.openDialog();
    },
    closeDialog() {       // 关闭对话框
      this.departmentList = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },
    selected() { // 选择企业同时清空所在罐区
      this.itemModel.departmentId = '';
    },

    /** 请求接口 */
    getDepartmentList() {            // 获取车间/部门数据集合
      if (!this.itemModel.psId) return;
      this.departmentList = [];
      this.loading = true;
      this.$http.get('bas/psDepartment', {
        params: {
          page: 1,
          rows: 100000,
          psId: this.itemModel.psId,  // 企业id
          sort: 'regionName-,psName-,departmentName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.departmentList = response.data.data || [];
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
        psId: '',                   // 企业id
        departmentId: '',           // 车间/部门id
        teamName: '',               // 班组名称
        jobDescription: '',         // 班组岗位说明
        leaderName: '',             // 负责人姓名
        telephone: '',              // 联系方式
        remark: '',                 // 备注
      };
    },
  },
};
</script>
