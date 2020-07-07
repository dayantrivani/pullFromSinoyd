<template>
  <dialog-modal ref="dialog" title="部门信息" size="mini" @close="closeDialog">
    <el-form :model="itemModel" ref="psDeptform" label-width="100px" :rules="formRules">
      <el-form-item label="所属机构：">
        <el-input v-model="itemModel.orgName" disabled></el-input>
      </el-form-item>
      <el-form-item label="岗位编码：" prop="postCode">
        <el-input v-model="itemModel.postCode"></el-input>
      </el-form-item>
      <el-form-item label="岗位名称：" prop="postName">
        <el-input v-model="itemModel.postName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="上级岗位：">
        <el-cascader :options="treeList" v-model="label" :props="propsMerge" @change="handleChange">
        </el-cascader>
      </el-form-item> -->
      <el-form-item label="排序值：">
        <el-input v-model="itemModel.sortNum"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="itemModel.note"></el-input>
      </el-form-item>
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
        deptGuid: '',
        deptName: '',
        isEnabled: '启用',
        note: '',
        orgGuid: '',
        orgName: '',
        parentGuid: '',
        postCode: '',
        postName: '',
        sortNum: 1000,
      },          // 表单对象
      label: [],
      treeList: [],
      saveLoading: false,
      formRules: {
        postCode: [
          { required: true, message: '请输入岗位编码', trigger: ['blur', 'change'] },
        ],
        postName: [
          { required: true, message: '请输入岗位名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    // 树形控件配置项参数合并
    propsMerge() {
      const propsTemp = Object.assign({
        value: 'id',
        label: 'label',
        children: 'children',
      }, this.props);
      return propsTemp;
    },
  },
  methods: {
    openDialog(type, node) {
      if (type.includes('edit')) {
        this.itemModel = node;
      } else if (type.includes('add')) {
        this.itemModel = this.getEmptyItem();
        this.itemModel.orgGuid = node.data.id;
        this.itemModel.orgName = node.data.label;
      }
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    // 获取单条数据
    getEmptyItem() {
      return {
        deptGuid: '',
        deptName: '',
        isEnabled: '启用',
        note: '',
        orgGuid: '',
        orgName: '',
        parentGuid: '',
        postCode: '',
        postName: '',
        sortNum: 1000,
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
    // 保存单条记录
    saveItem() {
      const data = [];
      data.push(this.itemModel);
      this.$http[this.itemModel.id ? 'put' : 'post']('sinoyd-frame/sys/posts', data)
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
