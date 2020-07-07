<template>
  <!-- 因子管理 -->
  <el-card fill>
  <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="因子名称：">
          <el-input v-model="queryForm.factorName" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  <!-- 因子列表 -->
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
      height="calc(100% - 76px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="factorName" min-width="250" label="因子名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorCode" label="因子编号" show-overflow-tooltip></el-table-column>
      <el-table-column property="variableName" label="变量值" show-overflow-tooltip></el-table-column>
      <el-table-column property="orderNum" label="排序值" show-overflow-tooltip></el-table-column>
      <el-table-column property="phonetic" label="因子拼音" show-overflow-tooltip></el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" size="mini" :title="`${isEdit ? '编辑' : '新增'}因子信息`" @close="closeDialog">
      <el-form ref="form" label-position="right" label-width="100px" :model="itemModel" :rules="rules">
        <el-form-item label="因子名称：" prop="factorName">
          <el-input v-model="itemModel.factorName"></el-input>
        </el-form-item>
        <el-form-item label="因子编号：" prop="factorCode">
          <el-input v-model="itemModel.factorCode"></el-input>
        </el-form-item>
        <el-form-item label="变量值：">
          <el-input v-model="itemModel.variableName"></el-input>
        </el-form-item>
        <el-form-item label="排序值：">
          <el-input-number
            v-model="itemModel.orderNum"
            controls-position="right"
            :min="0"
            style="width:100%">
          </el-input-number>
        </el-form-item>
        <el-form-item label="拼音缩写：">
          <el-input v-model="itemModel.phonetic"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="saveLoading" @click="onSaveItem()">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> 保 存
        </el-button>
        <el-button size="small" @click="closeDialog">
          <i class="fa fa-times" aria-hidden="true"></i> 关 闭
        </el-button>
      </div>
    </dialog-modal>
  </el-card>
</template>

<script>
// import { queryList } from '@/plugins/mixins';

export default {
  name: 'FactorManage',
  // mixins: [queryList],
  data() {
    return {
      loading: false,         // 表格数据加载状态
      saveLoading: false,
      itemModel: {},          // 编辑表单绑定变量
      selectedIds: [],        // 已选择的数据 id 数组
      itemList: [],           // 数据项列表
      queryForm: {            // 查询表单绑定变量
        factorsType: '',        // 因子类型
        category: '',           // 所属类型
        factorCode: '',         // 编码
        oldFactorCode: '',      // 原编码
        factorName: '',         // 中文名称
        order: 'desc',
      },
      rules: {                // 编辑表单验证规则
        factorCode: [
          { required: true, trigger: 'blur', message: '请输入编码' },
        ],
        factorName: [
          { required: true, trigger: 'blur', message: '请输入中文名称' },
        ],
        factorsType: [
          { required: true, trigger: 'change', message: '请选择因子类型' },
        ],
        category: [
          { required: true, trigger: 'change', message: '请选择所属类型' },
        ],
        // showNameType: [
        //   { required: true, trigger: 'change', message: '请选择页面显示类型' },
        // ],
      },
      pager: {
        pags: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  computed: {
    // 含有id, 视为编辑状态，否则为新增状态，
    isEdit() {
      return this.itemModel && this.itemModel.id;
    },
  },
  created() {
    this.getItemList();
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
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取表单数据(空值)
    getEmptyItem() {
      return {
        id: '',
        factorCode: '',         // 编码
        factorsType: '',        // 因子类型
        oldFactorCode: '',      // 原编码
        unitCou: '',            // 单位排放量
        defaultDataTypeCou: '', // 排放量缺省数据类型
        factorName: '',         // 中文名称
        category: '',           // 所属类型
        unit: '',               // 单位浓度
        defaultDataType: '',    // 浓度缺省数据类型
        factorAliasName: '',    // 因子别名
        factorEnglishName: '',  // 因子英文名
        showNameType: '',       // 页面显示类型
        remark: '',             // 备注
      };
    },
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.itemModel = { ...row };
      this.$refs.dialog.openDialog();
    },
    // 获取数据列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('cfg/factorsMain', {
        params: { page, rows, ...this.queryForm },
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
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const { id } = this.itemModel;
        const url = 'cfg/factorsMain';
        this.$http[id ? 'put' : 'post'](url, this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '修改' : '新增'}成功`,
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              this.closeDialog();
            } else {
              this.$message.warning({
                message: response.data.message,
                duration: 1500,
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
        this.$http.delete('cfg/factorsMain', { data: this.selectedIds })
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
    // 编辑表单弹框关闭回调
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
