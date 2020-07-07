<template>
  <dialog-modal ref="dialog" title="部门信息" size="small" @close="closeDialog">
    <el-form :model="itemModel" ref="psDeptform" label-width="100px" :rules="formRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门名称：" prop="deptName">
            <el-input v-model="itemModel.deptName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="itemModel.telephone"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：">
            <el-input v-model="itemModel.email"></el-input>
          </el-form-item>
          <el-form-item label="排序号：">
            <el-input v-model="itemModel.sortNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门编码：" prop="deptCode">
            <el-input v-model="itemModel.deptCode"></el-input>
          </el-form-item>
          <el-form-item label="分机号码：">
            <el-input v-model="itemModel.ext"></el-input>
          </el-form-item>
          <el-form-item label="传真：">
            <el-input v-model="itemModel.fax"></el-input>
          </el-form-item>
          <el-form-item label="部门状态：">
            <el-input v-model="itemModel.isEnabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="itemModel.note"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck()">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>


<script>
export default {
  data() {
    return {
      itemModel: {
        deptName: '',
        deptCode: '',
        parentGuid: '0',
        deptTypeCode: 'wh',
        principal: 'a2aa9c911f404bc984027b7373a6b60c',
        telephone: '',
        ext: '',
        email: '',
        fax: '',
        sortNum: 1000,
        isEnabled: '启用',
        note: '',
        orgGuid: '', // 企业id
        parentName: '',
      },          // 表单对象
      saveLoading: false,
      formRules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: ['blur', 'change'] },
        ],
        deptCode: [
          { required: true, message: '请输入部门编码', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  methods: {
    openDialog(type, node) {
      if (type.includes('edit')) {
        this.itemModel = node.data.detail;
      } else if (type.includes('add')) {
        this.itemModel = this.getEmptyItem();
        if (node.data.dept) {
          // 部门下面新增,部门二级,需要父id
          this.itemModel.parentGuid = node.data.id;
          this.itemModel.orgGuid = node.data.detail.orgGuid;
        } else {
          // 企业下面新怎,为一级部门
          this.itemModel.orgGuid = node.data.id;
        }
      }
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    // 获取单条数据
    getEmptyItem() {
      return {
        deptName: '',
        deptCode: '',
        parentGuid: '0',
        deptTypeCode: 'wh',
        principal: 'a2aa9c911f404bc984027b7373a6b60c',
        telephone: '',
        ext: '',
        email: '',
        fax: '',
        sortNum: 1000,
        isEnabled: '启用',
        note: '',
        orgGuid: '', // 父id
        parentName: '',
      };
    },
    // 判断是否需要验证
    onSaveCheck() {
      // 表单是否需要验证
      this.$refs.psDeptform.validate((valid) => {
        if (!valid) return;
        this.saveItem();
      });
    },
    // 保存自查单条记录
    saveItem() {
      const data = [];
      data.push(this.itemModel);
      this.$http[this.itemModel.id ? 'put' : 'post']('sinoyd-frame/sys/departments', data)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
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
        });
    },
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
