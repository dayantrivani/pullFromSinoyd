<template>
  <!-- 污染源因子管理 -->
  <el-card fill>
  <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="因子类型：">
          <el-select v-model="queryForm.factorsType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key) in $hp.FactorsTypeList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型：">
          <el-select v-model="queryForm.category">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, key) in $hp.CategoryList" :key="key" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码：">
          <el-input v-model="queryForm.factorCode" placeholder="编码" clearable style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="原编码：">
          <el-input v-model="queryForm.oldFactorCode" placeholder="原编码" clearable style="width: 140px"></el-input>
        </el-form-item>
        <el-form-item label="中文名称：">
          <el-input v-model="queryForm.factorName" placeholder="中文名称" clearable style="width: 140px"></el-input>
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
      :data="randerList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-cog" @click="onClickSetting(scope.row)"
            :disabled="scope.row.factorsType !== 1">设置</el-button>
        </template>
      </el-table-column>
      <el-table-column property="factorCode" label="编码" show-overflow-tooltip></el-table-column>
      <el-table-column property="factorName" label="中文名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="oldFactorCode" label="原编码" show-overflow-tooltip></el-table-column>
      <el-table-column property="categoryName" label="所属类型" show-overflow-tooltip></el-table-column>
      <el-table-column label="因子类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $hp.FactorsTypeList[scope.row.factorsType] }}
        </template>
      </el-table-column>
      <el-table-column property="unit" label="单位(浓度)" show-overflow-tooltip min-width="100"></el-table-column>
      <el-table-column property="unitCou" label="单位(排放量)" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column property="defaultDataType" label="浓度缺省数据类型" min-width="140"
       show-overflow-tooltip></el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  <!-- 弹框表单 -->
    <dialog-modal :title="`${isEdit ? '配置' : '新增'}因子`" ref="dialog" @close="onCloseDialog">
      <el-form ref="form" label-position="right" label-width="160px" :model="itemModel" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="中文名称：" prop="factorName">
              <el-input v-model="itemModel.factorName">
                <el-button slot="append" @click="onClickAddItem()">
                  <i :class="'fa fa-th-list'"></i>
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="因子类型：" prop="factorsType">
              <el-select v-model="itemModel.factorsType">
                <el-option
                  v-for="(item, key) in $hp.FactorsTypeList"
                  :key="key"
                  :label="item"
                  :value="key - 0">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="英文名称：">
              <el-input v-model="itemModel.factorEnglishName"></el-input>
            </el-form-item>
            <el-form-item label="原编码：">
              <el-input v-model="itemModel.oldFactorCode"></el-input>
            </el-form-item>
            <el-form-item label="单位排放量：">
              <el-input v-model="itemModel.unitCou"></el-input>
            </el-form-item>
            <el-form-item label="排放量缺省数据类型：">
              <el-input v-model="itemModel.defaultDataTypeCou"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码：" prop="factorCode">
              <el-input v-model="itemModel.factorCode"></el-input>
            </el-form-item>
            <el-form-item label="所属类型：" prop="categoryList">
              <el-select v-model="itemModel.categoryList" multiple>
                <el-option
                  v-for="(item, key) in $hp.CategoryList"
                  :key="key"
                  :label="item"
                  :value="key - 0">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="中文别名：">
              <el-input v-model="itemModel.factorAliasName"></el-input>
            </el-form-item>
            <el-form-item label="页面显示类型：" prop="showNameType">
              <el-select v-model="itemModel.showNameType">
                <el-option
                  v-for="(item, key) in $hp.showNameTypeList"
                  :key="key"
                  :label="item"
                  :value="key - 0">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位浓度：">
              <el-input v-model="itemModel.unit"></el-input>
            </el-form-item>
            <el-form-item label="浓度缺省数据类型：">
              <el-input v-model="itemModel.defaultDataType"></el-input>
            </el-form-item>
          </el-col>
         <el-col :span="24">
            <el-form-item label="数据源：" prop="factorValueId">
              <el-select v-model.trim="itemModel.factorValueId" clearable>
                <el-option v-for="(item,index) in formData.factorValueSource" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="itemModel.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
        <el-button icon="fa fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
  <!-- 选择因子项弹框 -->
    <factor-select ref="factorSelect" @selected="factorSelected"/>
    <factor-setting ref="factorSetting" @selected="factorSelected"/>
  </el-card>
</template>

<script>
import { firstBy } from 'thenby';
import { queryList } from '@/plugins/mixins';
import FactorSelect from '@/views/cfg/CommonDialog/FactorSelectDialog';
import FactorSetting from '@/views/cfg/CommonDialog/FactorSettingDialog';

export default {
  components: {
    FactorSelect,
    FactorSetting,
  },
  mixins: [queryList],
  name: 'FactorPollution',
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
        sort: 'factorCode',
      },
      rules: {                // 编辑表单验证规则
        factorName: [
          { required: true, trigger: 'change', message: '请输入中文名称' },
        ],
        factorCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入编码',
          },
        ],
        factorsType: [
          {
            required: true,
            trigger: 'change',
            message: '请选择因子类型',
          },
        ],
        categoryList: [
          {
            type: 'array',
            required: true,
            trigger: 'change',
            message: '请选择所属类型',
          },
        ],
        // showNameType: [
        //   { required: true, trigger: 'change', message: '请选择页面显示类型' },
        // ],
      },
      pager: {
        page: 1,
        rows: 15,
        total: 0,
      },
      formData: {
        factorValueSource: [], // 因子值的来源
      },
    };
  },
  computed: {
    // 含有id, 视为编辑状态，否则为新增状态，
    isEdit() {
      return this.itemModel && this.itemModel.id;
    },
    // 排序列表数据
    randerList() {
      if (!this.itemList.length) return [];
      return this.sortByKey(this.itemList);
    },
    category: {
      get() {
        return this.itemModel.category;
      },
      set(val) {
        this.itemModel.category = val.reduce((val, newVal) => val + newVal, 0);
      },
    },
  },
  created() {
    this.getItemList();
    this.itemModel = this.getEmptyItem();
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
    // 编辑表单选中的因子项
    factorSelected(row) {
      this.itemModel.factorName = row.factorName;
      this.itemModel.factorCode = row.factorCode;
    },
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取表单数据(空值)
    getEmptyItem() {
      return {
        // id: '',
        factorCode: '',         // 编码
        factorsType: '',        // 因子类型
        oldFactorCode: '',      // 原编码
        unitCou: '',            // 单位排放量
        defaultDataTypeCou: '', // 排放量缺省数据类型
        factorName: '',         // 中文名称
        category: '',           // 所属类型
        categoryList: [],       // 所属类型列表
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
      this.getDictItem();
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.getDictItem();
      this.itemModel = { ...row };
      this.$refs.dialog.openDialog();
    },
    // 编辑表单中文名称选项弹框
    onClickAddItem() {
      this.$refs.factorSelect.openDialog();
    },
    // 单击设置回调
    onClickSetting(val) {
      this.$refs.factorSetting.openDialog(val);
    },
    // 获取产品数据列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('cfg/factors', {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
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
        const url = 'cfg/factors';
        const data = { ...this.itemModel };
        data.category = this.itemModel.categoryList.reduce((val, newVal) => val + newVal, 0);
        this.$http[id ? 'put' : 'post'](url, data)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '修改' : '新增'}成功`,
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              this.$refs.dialog.closeDialog();
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
        this.$http.delete('cfg/factors', { data: this.selectedIds })
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
    sortByKey(array) {
      return array.sort(firstBy((v1, v2) => v1.factorsType - v2.factorsType).thenBy('factorCode'));
    },
    // 编辑表单弹框关闭回调
    onCloseDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
    },
    // 获取关联数据
    getDictItem() {
      this.$store.dispatch('psInfo/GET_SELECT_FactorSource', { codeValue: 'FactorValueSource' }).then((val) => {
        this.formData.factorValueSource = val;
      });
    },
  },
};
</script>
