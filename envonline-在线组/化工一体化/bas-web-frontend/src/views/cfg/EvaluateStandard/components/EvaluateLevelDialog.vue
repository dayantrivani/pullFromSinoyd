<!-- 等级配置 - 配置评价标准 -->
<template>
  <div>
    <dialog-modal title="等级配置" ref="dialog" @close="onCloseDialog">
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
        height="50vh"
        v-loading="loading"
        :data="itemList"
        highlight-current-row
        :row-class-name="_rowClassName"
        @selection-change="onSaveSelected">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="操作" width="76">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column property="name" label="等级名称" show-overflow-tooltip></el-table-column>
        <el-table-column property="orderNum" label="排序" show-overflow-tooltip></el-table-column>
        <el-table-column property="expression" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column property="remark" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList"/>
    </dialog-modal>
  <!-- 编辑表单 -->
    <dialog-modal :title="`${itemModel.id ? '编辑' : '新增'}等级`" ref="dialogForm" @close="onCloseForm">
      <el-form
        ref="form"
        label-position="right"
        label-width="70px"
        :model="itemModel"
        :rules="formRules">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="itemModel.name"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number
            v-model="itemModel.orderNum"
            controls-position="right"
            :min="0"
            style="width:100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="itemModel.expression"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" :autosize="{minRows: 2, maxRows: 6}" resize='none'  v-model="itemModel.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.dialogForm.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  </div>
</template>

<script>
// import { queryList } from '@/plugins/mixins';

export default {
  // mixins: [queryList],
  name: 'EvaluateLevelDialog',
  data() {
    return {
      saveLoading: false,
      id: '',
      url: 'bas/evaluationLevel',  // API接口 URL
      loading: false,              // 表格数据加载状态
      itemList: [],                // 等级配置列表
      itemModel: [],               // 等级配置表单
      selectedIds: [],             // 已选中等级Ids
      formRules: {
        name: [
          { required: true, trigger: 'blur', message: '请输入等级名称' },
        ],
      },
      pager: {
        pags: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  methods: {
    // 显示组件
    openDialog(id) {
      this.id = id;
      this.$refs.dialog.openDialog();
      this.getItemList();
    },
    onCloseDialog() {
      this.$emit('change');
    },
    // 获取表单空项
    getEmptyItem() {
      return {
        evaluationId: this.id,  // 评价id
        name: '',               // 评价等级名称
        remark: '',             // 备注
        orderNum: 1,            // 排序
        expression: '',         // 判断描述
      };
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
    // 单击新增等级
    onClickAdd() {
      this.itemModel = this.getEmptyItem();
      this.$refs.dialogForm.openDialog();
    },
    // 单击编辑等级
    onClickEdit(row) {
      this.itemModel = { ...row };
      this.$refs.dialogForm.openDialog();
    },
    // 关闭表单回调
    onCloseForm() {
      this.$refs.form.resetFields();
    },
    // 获取列表项
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          evaluationId: this.id,
          sort: 'orderNum',
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存数据
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const temp = this.itemModel.id;
        this.$http[temp ? 'put' : 'post'](this.url, this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${temp ? '修改' : '新增'}成功`,
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              this.$refs.dialogForm.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 1500,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 删除数据
    onDeleteItem() {
      if (!this.selectedIds.length) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(this.url, { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
