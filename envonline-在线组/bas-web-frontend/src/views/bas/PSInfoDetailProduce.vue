<template>
  <!-- 生产设施 -->
  <el-card fill>
    <div slot="header" class="mar-b-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <el-table
      border
      height="calc(100% - 36px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="facilityName" show-overflow-tooltip label="设备名称" width='200'></el-table-column>
      <el-table-column property="specification" show-overflow-tooltip label="规格型号"></el-table-column>
      <el-table-column property="facilityNum" label="数量"></el-table-column>
      <el-table-column property="useCase" show-overflow-tooltip label="使用情况"></el-table-column>
      <el-table-column property="workshopName" label="隶属车间名称" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog"  :title="`${isEdit ? '编辑' : '新增'}生产设施信息`" @closed="onDialogClose">
      <el-form ref="form" label-position="right" label-width="110px" :model="itemModel" :rules="rules">
        <el-form-item label="企业：">
          <el-input v-model="psName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备名称：" prop="facilityName">
          <el-input v-model="itemModel.facilityName"></el-input>
        </el-form-item>
        <el-form-item label="规格型号：">
          <el-input v-model="itemModel.specification"></el-input>
        </el-form-item>
        <el-form-item label="数量：">
          <el-input-number
            v-model="itemModel.facilityNum"
            controls-position="right"
            :min="0"
            :max="2147483647"
            :precision="0"
            :step="1"
            step-strictly
            >
          </el-input-number>
        </el-form-item>
        <el-form-item label="使用情况：">
          <el-input v-model="itemModel.useCase"></el-input>
        </el-form-item>
        <el-form-item label="隶属车间名称：">
          <el-input v-model="itemModel.workshopName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-card>
</template>

<script>

export default {
  name: 'PSInfoDetailProduce',
  data() {
    return {
      loading: false, // 表格数据加载状态
      saveLoading: false,
      psName: '', // 企业名称
      psId: '', // 弹框中企业编码
      itemModel: {         // 编辑表单绑定变量
        facilityName: '',  // 设备名称
        specification: '', // 规格型号
        facilityNum: '',   // 数量
        useCase: '',       // 使用情况
        workshopName: '',  // 隶属车间名称
      },
      itemList: [], // 表格数据项列表
      selectedIds: [], // 已选择的数据 id 数组
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      rules: { // 表单验证规则
        facilityName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' },
        ],
      },
      isEdit: false, // 区分新增和编辑
    };
  },
  created() {
    this.itemModel = this.getEmptyItem();
    this.getItemList();
  },
  computed: {
    activeInfo() {
      return this.$store.state.psInfo.activeInfo;
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // dialog 表单关闭回调
    onDialogClose() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
    },
    // 获取表单数据(空值)
    getEmptyItem() {
      return {
        facilityName: '',
        specification: '',
        facilityNum: '',
        useCase: '',
        workshopName: '',
      };
    },
    // 单击新增按钮
    onClickAdd() {
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.openDialog();
      this.psName = this.activeInfo.psName;
      this.isEdit = false;
    },
    // 单击编辑按钮
    onClickEdit(row) {
      this.itemModel = { ...row };
      this.$refs.dialog.openDialog();
      this.isEdit = true;
      this.psName = this.activeInfo.psName;
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/productionFacilities', {
        params: { page: this.pager.page, rows: this.pager.rows, psId: this.activeInfo.id },
      }).then((response) => {
        this.itemList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const id = this.isEdit;
        const url = 'bas/productionFacilities';
        this.itemModel.facilityNum = this.itemModel.facilityNum || 0;
        this.$http[id ? 'put' : 'post'](url, { psId: this.activeInfo.id, ...this.itemModel })
          .then((response) => {
            if (response.data.success) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '操作成功',
                duration: '1500',
              });
              this.getItemList();
              this.$refs.dialog.closeDialog();
            }  else {
              this.$message({
                message: response.data.msg,
                type: 'warning',
                duration: '1500',
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 删除数据项
    onDeleteItem() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/productionFacilities/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功',
            duration: '1500',
          });
          this.getItemList();
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning',
            duration: '1500',
          });
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
