<template>
  <!-- 生产设施 -->
  <el-card type="title">
    <!-- 标题内容 -->
    <template slot="header">生产设施</template>
    <div class="mar-l-sm mar-y-xs">
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
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="facilityName"
        show-overflow-tooltip
        label="设备名称"
        min-width='200'
      ></el-table-column>
      <el-table-column property="specification" show-overflow-tooltip label="规格型号" min-width="100"></el-table-column>
      <el-table-column property="facilityNum" label="数量" min-width="60"></el-table-column>
      <el-table-column property="useCase" show-overflow-tooltip label="使用情况"></el-table-column>
      <el-table-column property="workshopName" label="隶属车间名称" show-overflow-tooltip min-width="140"></el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <!-- 弹出框内容 -->
    <dialog-modal
      ref="dialog"
      size="mini"
      :title="`${isEdio ? '编辑' : '新增'}生产设施信息`"
      @closed="onDialogClose"
    >
      <el-form
        ref="form"
        class="mar-t-sm pad-x-sm item-space"
        label-position="right"
        label-width="103px"
        :model="itemModel"
        :rules="rules"
      >
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
          <!-- <el-input v-model="itemModel.facilityNum"></el-input> -->
          <el-input-number
            v-model="itemModel.facilityNum"
            controls-position="right"
            :min="0"
            style="width: 100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="使用情况：">
          <el-input v-model="itemModel.useCase"></el-input>
        </el-form-item>
        <el-form-item label="隶属车间名称：">
          <el-input v-model="itemModel.workshopName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PSInfoDetailProduce',
  data() {
    return {
      loading: false,                         // 表格数据加载状态
      psName: '',                             // 企业名称
      psId: '',                               // 弹框中企业编码
      itemModel: {                            // 编辑表单绑定变量
        facilityName: '',       // 设备名称
        specification: '',      // 规格型号
        facilityNum: '',        // 数量
        useCase: '',            // 使用情况
        workshopName: '',       // 隶属车间名称
      },
      itemList: [],                           // 表格数据项列表
      selectedIds: [],                        // 已选择的数据 id 数组
      saveLoading: false,                     // 保存按钮加载状态
      pager: {
        count: 0,
        page: 1,
        rows: 15,
      },
      rules: { // 表单验证规则
        facilityName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' },
        ],
      },
      isEdio: false, // 区分新增和编辑
    };
  },
  created() {
    this.itemModel = this.getEmptyItem();
    this.getItemList();
  },
  computed: {
    ...mapState({
      psInfo: state => state.psInfo,
    }),
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
      this.psName = this.psInfo.psName;
      this.isEdio = false;
    },
    // 单击编辑按钮
    onClickEdit(row) {
      this.itemModel = { ...row };
      this.$refs.dialog.openDialog();
      this.isEdio = true;
      this.psName = this.psInfo.psName;
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/productionFacilities', {
        params: { page: this.pager.page, rows: this.pager.rows, psId: this.psInfo.id },
      }).then((response) => {
        this.itemList = response.data.data;
        this.pager.count = response.data.count;
        this.loading = false;
      }, ({ response }) => {
        this.loading = false;
        this.$hp.resp(response);
      });
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const id = this.isEdio;
        const url = 'bas/productionFacilities';
        this.$http[id ? 'put' : 'post'](url, { psId: this.psInfo.id, ...this.itemModel })
          .then((response) => {
            this.saveLoading = true;
            if (response.status === 200) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '操作成功',
                duration: '1500',
              });
              this.getItemList();
              this.$refs.dialog.closeDialog();
              this.saveLoading = false;
            }  else {
              this.$message({
                message: response.body.msg,
                type: 'warning',
                duration: '1500',
              });
              this.saveLoading = false;
            }
          }, ({ response }) => {
            this.$hp.resp(response);
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
        this.$http.delete('bas/productionFacilities', { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功',
            duration: '1500',
          });
          this.getItemList();
        } else {
          this.$message({
            message: response.body.msg,
            type: 'warning',
            duration: '1500',
          });
        }
      }, ({ response }) => {
        this.$hp.resp(response);
      });
    },
  },
};
</script>

<style scoped>

</style>
