<template>
  <!-- 特种作业 -->
  <el-card type="title" class="SpecialOperator">
    <template slot="header">特种作业人员</template>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <el-table
      class="mar-t-xs"
      border
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="operatorName" label="作业人员姓名" show-overflow-tooltip min-width="150">
      </el-table-column>
      <el-table-column property="operatorTypeName" label="作业人员类型" show-overflow-tooltip min-width="150">
      </el-table-column>
      <el-table-column property="idTypeName" label="证件种类" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column property="masterCertificateNumber" label="主证号" show-overflow-tooltip min-width="150">
      </el-table-column>
      <el-table-column property="effectiveStartDate" label="有效开始日期" show-overflow-tooltip min-width="150">
      </el-table-column>
      <el-table-column property="effectiveEndDate" label="有效结束日期" show-overflow-tooltip min-width="150">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList()"/>
    <dialog-modal ref="dialog" size="middle" :title="isEdit ? '编辑特种作业人员' : '新增特种作业人员'" @close="closeDialog">
      <div>
        <el-button type="primary" icon="fas fa-save" @click="save">保 存</el-button>
        <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
      </div>
    <hr>
      <el-form ref="form" label-width="160px" :model="form" class="mar-t-xs pad-x-sm item-space" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业人员姓名：" prop="operatorName">
              <el-input v-model="form.operatorName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码：">
            <el-input v-model="form.idCard"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-radio v-model="form.sex" :label="0">保密</el-radio>
              <el-radio v-model="form.sex" :label="1">男</el-radio>
              <el-radio v-model="form.sex" :label="2">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期"
              value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码：">
              <el-input v-model="form.mobilePhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许操作项目：">
            <el-input v-model="form.allowOperationItems"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="作业人员类型：" prop="operatorTypeCodeId">
              <select-try
                filterable
                ref="personType"
                v-model="form.operatorTypeCodeId"
                :options="dict.SpecialOperationPersonTypes"
                @refresh="getDictList"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件种类：" prop="idTypeCodeId">
                <select-try
                  ref="Type"
                  v-model="form.idTypeCodeId"
                  :options="dict.SpecialOperatorsCredentialsTypes"
                  @refresh="getDictList"
                />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件状态：" prop="idStatus">
               <el-select v-model="form.idStatus" placeholder="请选择">
                  <el-option  v-for="item in CertifStatus" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发证机构：">
            <el-input v-model="form.certificationAuthority"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机构所在市：">
              <el-input v-model="form.certificationAuthorityCity"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主证号：" prop="masterCertificateNumber">
              <el-input v-model="form.masterCertificateNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副证号：">
              <el-input v-model="form.subCertificateNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发证日期：" prop="issueDate">
              <el-date-picker v-model="form.issueDate" type="date" placeholder="选择日期"
              value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复审日期：" prop="reviewDate">
              <el-date-picker v-model="form.reviewDate" type="date" placeholder="选择日期"
              value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作证有效开始日期：" prop="effectiveStartDate">
              <el-date-picker v-model="form.effectiveStartDate" type="date" placeholder="选择日期"
              value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作证有效结束日期：" prop="effectiveEndDate">
              <el-date-picker v-model="form.effectiveEndDate" type="date" placeholder="选择日期"
              value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="上传证件照片：" style="margin-bottom: 15px;">
          <uploadPicture ref="upload" :objectId="objectId"/>
        </el-form-item>
      </el-form>
    </dialog-modal>
  </el-card>
</template>

<script>
import { deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import uploadPicture from '@/components/upload-picture';
import selectTry from './components/select-try';

export default {
  name: 'SpecOperationPerson',
  components: {
    uploadPicture,
    selectTry,
  },
  mixins: [deleteItem],
  data() {
    return {
      url: 'bas/specOperationPerson',
      isEdit: false, // 区别新增和编辑
      itemList: [],
      objectId: '', // 当前上传文件的对象id
      form: {
        psId: '',                       // 当前选中企业的id
        operatorName: '',               // 作业人员姓名
        idCard: '',                     // 身份证号码
        sex: 0,                       // 性别
        birthday: '',                   // 生产日期
        mobilePhone: '',                // 手机号码
        allowOperationItems: '',        // 允许操作项目
        operatorTypeCodeId: '',         // 作业人员类型
        idTypeCodeId: '',               // 证件种类
        idStatus: '',                   // 证件状态
        certificationAuthority: '',     // 发证机构
        certificationAuthorityCity: '', // 发证机构所在市
        masterCertificateNumber: '',    // 主证号
        subCertificateNumber: '',       // 副证号
        issueDate: '',                  // 发证日期
        reviewDate: '',                 // 复审日期
        effectiveStartDate: '',         // 操作证有效开始日期
        effectiveEndDate: '',           // 操作证有效结束日期
      },
      rules: {
        operatorName: [
          { required: true, message: '请输入作业人员姓名', trigger: 'blur' },
        ],
        birthday: [
          { required: true, message: '请选择生产日期', trigger: 'change' },
        ],
        operatorTypeCodeId: [
          { required: true, message: '请选择作业人员类型', trigger: 'change' },
        ],
        idTypeCodeId: [
          { required: true, message: '请选择证件种类', trigger: 'change' },
        ],
        masterCertificateNumber: [
          { required: true, message: '请输入主证号', trigger: 'blur' },
        ],
        issueDate: [
          { required: true, message: '请选择发证日期', trigger: 'change' },
        ],
        reviewDate: [
          { required: true, message: '请选择复审日期', trigger: 'change' },
        ],
        effectiveStartDate: [
          { required: true, message: '请选择操作证有效开始日期', trigger: 'change' },
        ],
        effectiveEndDate: [
          { required: true, message: '请选择操作证有效结束日期', trigger: 'change' },
        ],
      },
      // 证件状态数据
      CertifStatus: [
        { id: 0, name: '失效' },
        { id: 1, name: '有效' },
      ],
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      loading: false,
      selectedIds: [],
      dict: {
        SpecialOperationPersonTypes: [],
        SpecialOperatorsCredentialsTypes: [],
      },
    };
  },
  computed: {
    // 记录企业列表选中当前行id
    id() {
      return this.$store.state.psInfo.id || JSON.parse(window.sessionStorage.getItem('psInfo')).id;
    },
  },
  watch: {},
  created() {
    this.getItemList();
    this.getDictList();
  },
  methods: {
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n.parentId === parentId) {
            n.children = fa(n.rowGuid);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
    },
    // 获取字典表数据
    getDictList() {
      let personTypes = [];
      this.$http.get('sys/enumCode?codeValue=SpecialOperationPersonTypes').then((response) => {
        personTypes = response.data;
        this.dict.SpecialOperationPersonTypes = this.cleanChildren(this.buildTree(personTypes, '0'));
      });
      let credentialsTypes = [];
      this.$http.get('sys/enumCode?codeValue=SpecialOperatorsCredentialsTypes').then((response) => {
        credentialsTypes = response.data;
        this.dict.SpecialOperatorsCredentialsTypes = this.cleanChildren(this.buildTree(credentialsTypes, '0'));
      });
    },
    // 表格勾选
    onChangeSelected(rows) {
      this.selectedIds = rows.map(row => row.id);
    },
    getItemList() {
      const { page, rows } = this.pager;
      this.loading = true;
      this.$http.get('bas/specOperationPerson/', {
        params: {
          page,
          rows,
          psId: this.id,
        },
      }).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            showClose: true,
            type: 'warning',
            message: response.data.msg,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 新增点击事件
    onClickAdd() {
      this.$refs.dialog.openDialog();
      this.isEdit = false;
    },
    // 表格编辑事件
    onClickEdit(row) {
      this.isEdit = true;
      this.form = { ...row };
      this.objectId = row.id;
      this.$refs.dialog.openDialog();
      if (this.$refs.upload) this.$refs.upload.getImg(row.id);
    },
    // 新增编辑弹框关闭事件
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.$refs.upload.fileList = [];
      this.objectId = '';
      this.$refs.personType.labelModel = '';
      this.$refs.Type.labelModel = '';
      this.$refs.form.resetFields();
      this.form = {
        psId: '',
        operatorName: '',
        idCard: '',
        sex: 0,
        birthday: '',
        mobilePhone: '',
        allowOperationItems: '',
        operatorTypeCodeId: '',
        idTypeCodeId: '',
        idStatus: '',
        certificationAuthority: '',
        certificationAuthorityCity: '',
        masterCertificateNumber: '',
        subCertificateNumber: '',
        issueDate: '',
        reviewDate: '',
        effectiveStartDate: '',
        effectiveEndDate: '',
      };
    },
    // 表单保存事件
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.form.psId = this.id;
        this.$http[this.objectId ? 'put' : 'post']('bas/specOperationPerson/', this.form)
          .then((response) => {
            if (response.data.code === 200 && response.data.success) {
              this.$message.success({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
              if (!this.objectId) {
                this.objectId = response.data.data.id;
                this.$refs.upload.onUpload(this.objectId);
              }
              this.closeDialog();
              this.getItemList();
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
        if (this.objectId) {
          this.$refs.upload.onUpload(this.objectId);
        }
      });
    },
  },
};
</script>

<style>

</style>
