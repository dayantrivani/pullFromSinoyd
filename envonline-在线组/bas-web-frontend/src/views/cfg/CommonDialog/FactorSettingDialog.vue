<template>
  <!-- 污染源因子设置弹框 -->
  <div>
    <dialog-modal title="值类型管理" ref="dialog">
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
        height="50vh"
        v-loading="loading"
        border
        stripe
        :data="itemList"
        highlight-current-row
        :row-class-name="_rowClassName"
        @selection-change="onSaveSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
        <el-table-column align="center" label="操作" width="76">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column property="factorName" label="因子名称" show-overflow-tooltip></el-table-column>
        <el-table-column property="factorCode" label="因子编号" show-overflow-tooltip></el-table-column>
        <el-table-column property="oldFactorCode" label="原编码" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $hp.CategoryList[scope.row.category] }}
          </template>
        </el-table-column>
        <el-table-column property="valueType" label="值类型" show-overflow-tooltip></el-table-column>
        <el-table-column property="unit" label="单位" show-overflow-tooltip></el-table-column>
        <el-table-column property="defaultDataType" label="缺省数据类型" min-width="110"
         show-overflow-tooltip></el-table-column>
      </el-table>
    <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList"/>
    </dialog-modal>
  <!-- 弹框表单 -->
    <dialog-modal ref="dialogForm" :title="`${isEdit ? '编辑' : '新增'}因子值类型`" @close="onCloseDialog">
      <el-form ref="form" label-position="right" label-width="160px" :model="itemModel" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="因子名称：" prop="factorName">
              <el-input v-model="itemModel.factorName" disabled></el-input>
            </el-form-item>
            <el-form-item label="原编码：">
              <el-input v-model="itemModel.oldFactorCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="值类型：" prop="valueType">
              <el-select v-model="itemModel.valueType" filterable style="width: 100%">
                <el-option
                  v-for="(item, key) in factorsTypeItems"
                  :key="key"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="因子编号：" prop="factorCode">
              <el-input v-model="itemModel.factorCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属类型：" prop="category">
              <el-select v-model="itemModel.category" style="width: 100%" disabled>
                <el-option
                  v-for="(item, key) in $hp.CategoryList"
                  :key="key"
                  :label="item"
                  :value="key - 0">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位：">
              <el-input v-model="itemModel.unit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排放量缺省数据类型：">
              <el-input v-model="itemModel.defaultDataType"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.dialogForm.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  </div>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  mixins: [queryList],
  name: 'FactorSettingDialog',
  data() {
    return {
      loading: false,            // 表格数据加载状态
      saveLoading: false,
      itemModel: {},             // 编辑表单绑定变量
      selectedIds: [],           // 已选择的数据 id 数组
      itemList: [],              // 数据项列表
      queryForm: {               // 查询表单绑定变量
        factorsType: '',         // 因子类型
        category: '',            // 所属类型
        factorCode: '',          // 编码
        oldFactorCode: '',       // 原编码
        factorName: '',          // 中文名称
        order: 'desc',
      },
      factorItem: {}, // 父级点击对象
      factorsTypeItems: [
        'Avg', 'Rtd', 'Cou', 'Max', 'Min', 'ZsMax', 'ZsMin', 'ZsAvg', 'ZsRtd', 'ZsCou',
      ], // 值类型下拉框枚举
      rules: {                // 编辑表单验证规则
        factorCode: [
          { required: true, trigger: 'blur', message: '请输入编码' },
        ],
        factorName: [
          { required: true, trigger: 'blur', message: '请输入中文名称' },
        ],
        valueType: [
          { required: true, trigger: 'blur', message: '请选择因子类型' },
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
        total: 0,
      },
    };
  },
  computed: {
    // 含有id, 视为编辑状态，否则为新增状态，
    isEdit() {
      return this.itemModel && this.itemModel.id;
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 父组件调用弹框
    openDialog(val) {
      this.factorItem = { ...val };
      this.getItemList();
      this.$refs.dialog.openDialog();
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
      ['factorName', 'factorCode', 'category', 'oldFactorCode'].forEach((ele) => {
        this.itemModel[ele] = this.factorItem[ele];
      });
      this.itemModel.factorsId = this.factorItem.id;
      this.itemModel = { ...this.getEmptyItem(), ...this.itemModel };
      // this.itemModel = { ...this.factorItem };
      this.$refs.dialogForm.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.itemModel = { ...row };
      ['factorName', 'factorCode', 'category', 'oldFactorCode'].forEach((ele) => {
        this.itemModel[ele] = this.factorItem[ele];
      });
      this.$refs.dialogForm.openDialog();
    },
    // 获取数据列表
    getItemList() {
      this.loading = true;
      this.$http.get('cfg/factorsValueType/', {
        params: {
          factorsId: this.factorItem.id,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.itemList.forEach((ele) => {
            this.$set(ele, 'factorName', this.factorItem.factorName);
          });
          this.pager.total = response.data.count;
        } else {
          this.$message.warning({
            message: response.body.msg,
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
        const url = 'cfg/factorsValueType/';
        this.$http[id ? 'put' : 'post'](url, this.itemModel)
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
        this.$http.delete('cfg/factorsValueType/', { data: this.selectedIds })
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
    onCloseDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
    },
  },
};
</script>
