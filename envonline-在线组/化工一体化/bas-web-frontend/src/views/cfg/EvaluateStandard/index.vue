<template>
  <!-- 评价标准管理 -->
  <el-card fill>
  <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="标准名称：">
          <el-input v-model="queryForm.name" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="queryForm.evaluationType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key) in $enum.evalTypeList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  <!-- 评价标准列表 -->
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
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-cog" @click="onClickCog(scope.row)">设置</el-button>
        </template>
      </el-table-column>
      <el-table-column property="name" label="标准名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="code" label="标准编号" show-overflow-tooltip></el-table-column>
      <el-table-column property="year" label="年份" show-overflow-tooltip></el-table-column>
      <el-table-column property="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  <!-- 弹框表单 -->
    <dialog-modal
      ref="dialog"
      :title="`${isEdit ? '编辑' : '新增'}评价标准信息`"
      :before-close="beforeClose"
      size="mini">
      <div class="box-dialog">
        <el-form ref="form" label-position="right" label-width="100px" :model="itemModel" :rules="rules">
          <el-form-item label="标准名称：" prop="name">
            <el-input v-model="itemModel.name"></el-input>
          </el-form-item>
          <el-form-item label="标准编号：">
            <el-input v-model="itemModel.code"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="evaluationType">
            <el-select v-model="itemModel.evaluationType">
              <el-option
                v-for="(item, key) in $enum.evalTypeList"
                :key="key"
                :label="item"
                :value="key - 0">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份：" prop="year">
            <el-date-picker
              v-model="itemModel.year"
              type="year"
              placeholder="选择年"
              value-format="yyyy"
              style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="itemModel.remark">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
        <el-button icon="fa fa-times" @click="beforeClose">关 闭</el-button>
      </div>
    </dialog-modal>
  <!-- 配置标准弹框 -->
    <evaluate-setting ref="evaluateSetting"/>
  </el-card>
</template>

<script>
// import { queryList } from '@/plugins/mixins';
import { analyzeResp } from '@/global/libs/util';
import EvaluateSetting from './components/EvaluateSettingDialog';

export default {
  components: {
    EvaluateSetting,
  },
  name: 'EvaluateStandard',
  // mixins: [queryList],
  data() {
    return {
      url: 'bas/evaluationCriteria',  // API接口 URL
      loading: false,                 // 表格数据加载状态
      saveLoading: false,
      dialogVisibleCog: false,
      itemModel: {},                  // 编辑表单绑定变量
      selectedIds: [],                // 已选择的数据 id 数组
      itemList: [],                   // 数据项列表
      levelList: [],
      queryForm: {                    // 查询表单绑定变量
        name: '',                     // 标准名称
        evaluationType: '',           // 标准类型
      },
      pager: {
        pags: 1,
        rows: 15,
        count: 0,
      },
      rules: {                // 编辑表单验证规则
        name: [
          { required: true, trigger: 'blur', message: '请输入标准名称' },
        ],
        evaluationType: [
          { required: true, trigger: 'change', message: '请选择类型' },
        ],
        year: [
          { required: true, trigger: 'change', message: '请选择年份' },
        ],
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
    // 获取表单数据(空值)
    getEmptyItem() {
      return {
        id: '',
        code: '',
        name: '',
        remark: '',
        year: '',
        evaluationType: '',
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
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.itemModel = { ...row };
      this.itemModel.year += '';
      this.$refs.dialog.openDialog();
    },
    // 单击配置回调
    onClickCog(row) {
      this.$refs.evaluateSetting.openDialog(row);
    },
    // 编辑表单弹框关闭回调
    onCloseDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
    },
    // 获取数据列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.body.msg,
            duration: 1500,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
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
        const { url } = this;
        this.$http[id ? 'put' : 'post'](url, this.itemModel).then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: `${id ? '修改' : '新增'}成功`,
              duration: 1500,
              showClose: true,
            });
            this.getItemList();
            this.beforeClose();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        },  ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    // 删除数据项
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
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    beforeClose() {
      this.itemModel = {};
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style scoped>
  .box-dialog {
    width: calc(100% - 5px);
    max-height: 55vh;
    padding-right: 5px;
    overflow-y: auto;
  }
</style>
