<!-- 配置评价标准 -->
<template>
  <div>
    <dialog-modal title="配置评价标准" ref="dialog" size="large">
      <div class="mar-l-sm mar-y-xs fn-clear">
        <el-button type="primary" icon="fa fa-cog" @click="onClickLevel">等级配置</el-button>
        <el-button type="primary" icon="fa fa-cog" @click="onClickFactor">因子配置</el-button>
        <div class="fn-right text-info pad-r-sm" style="line-height: 28px">
          <i class="el-icon-warning-outline text-warning"></i>
          <span> 单击因子列单元格查看评价值信息</span>
        </div>
      </div>
      <el-table
        v-loading="loading"
        height="550px"
        border
        highlight-current-row
        :data="itemList"
        @cell-click="onCellClick">
        <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
        <el-table-column property="levelName" label="等级名称" min-width='100' show-overflow-tooltip></el-table-column>
        <el-table-column v-for="(item, index) in colsList" :key="index" :label="item" :prop="`${item}.expression`"
          min-width="170" align="center" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </dialog-modal>
    <!-- 编辑表单 -->
    <dialog-modal title="评价值信息" ref="dialogForm" @close="onCloseForm">
      <el-form
        ref="form"
        label-position="right"
        label-width="100px"
        :model="itemModel">
        <el-form-item label="因子名称：">
          <el-input v-model="itemModel.factorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="等级名称：">
          <el-input v-model="itemModel.levelName" disabled></el-input>
        </el-form-item>
        <el-form-item label="符号：">
          <el-input v-model="itemModel.symbol"></el-input>
        </el-form-item>
        <el-form-item label="标准值：">
          <el-input v-model="itemModel.value"></el-input>
        </el-form-item>
        <el-form-item label="表达式：">
          <el-input v-model="itemModel.expression"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="itemModel.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.dialogForm.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  <!-- 等级配置 -->
    <level-dialog ref="levelDialog" @change="getItemList"/>
  <!-- 因子配置 -->
    <factor-dialog ref="factorDialog" @change="getItemList"/>
  </div>
</template>

<script>
import LevelDialog from './EvaluateLevelDialog';
import FactorDialog from './EvaluateFactorDialog';

export default {
  components: {
    LevelDialog,
    FactorDialog,
  },
  name: 'EvaluateSettingDialog',
  data() {
    return {
      parent: '',                // 父组件传递编辑对象
      loading: false,            // 表格数据加载状态
      saveLoading: false,
      itemModel: {},             // 编辑表单绑定变量
      itemList: [],              // 配置项列表
      colsList: [],              // 列表头
      selectedIds: [],           // 等级配置已选项
      pager: {
        pags: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  methods: {
    // 父组件调用弹框
    openDialog(row) {
      this.parent = row;
      this.$refs.dialog.openDialog();
      this.getItemList();
    },
    // 获取表单空项
    getEmptyItem() {
      return {
        evaluationId: this.parent.id,  // 标准评价id
        factorId: '',           // 因子id
        factorCode: '',         // 因子编号
        factorName: '',         // 因子名称
        levelId: '',            // 等级id
        value: '',              // 标准值
        expression: '',         // 表达式
        symbol: '',             // 符号
        remark: '',             // 备注
      };
    },
    // 单击等级配置
    onClickLevel() {
      this.$refs.levelDialog.openDialog(this.parent.id);
    },
    // 单击因子配置
    onClickFactor() {
      this.$refs.factorDialog.openDialog(this.parent);
    },
    // // 单击单元格
    // onClickCell(row, column) {
    //   this.itemModel = { ...row[column.label] };
    //   this.itemModel.levelName = row.levelName;
    //   this.$refs.dialogForm.openDialog();
    // },
    // 点击编辑
    onCellClick(row, column) {
      if (column.label === '等级名称' || column.type === 'index') return;
      this.itemModel = {
        ...row[column.label],
        levelId: row.levelId,
        levelName: row.levelName,
        systemType: this.parent.systemType,
      };
      this.$refs.dialogForm.openDialog();
    },
    // 关闭表单回调
    onCloseForm() {
      this.$refs.form.resetFields();
    },
    // 获取配置列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/evaluationValue', {
        params: { page, rows, evaluationId: this.parent.id },
      }).then((response) => {
        if (response.data.success) {
          this.colsList = response.data.data.columns.splice(2);
          this.itemList = response.data.data.rows;
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
    onSaveItem() {
      const { id }  = this.itemModel;
      this.saveLoading = true;
      this.$http[id ? 'put' : 'post']('bas/evaluationValue', this.itemModel)
        .then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: `${id ? '修改' : '新增'}成功`,
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
    },
  },
};
</script>

<style scoped>
</style>
