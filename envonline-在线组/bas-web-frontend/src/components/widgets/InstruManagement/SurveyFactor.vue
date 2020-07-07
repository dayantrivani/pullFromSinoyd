<template>
  <el-card fill>
    <!-- <div slot="header" class="clearfix">
      <div class="mar-b-sm" style="display: inline-block;">关键字：</div>
      <div class="mar-b-sm" style="display: inline-block; width: 220px;">
        <el-input v-model="keyWord" placeholder="监测因子、因子编号"></el-input>
      </div>
      <div class="mar-b-sm" style="display: inline-block;">
        <el-button  type="primary"  size="small"  @click="onSearchQuery()">
          <i  class="fa  fa-search"  aria-hidden="true"></i>  查  询
        </el-button>
      </div>
    </div> -->
    <div slot="header">
      <el-form inline>
        <el-form-item label="关键字：">
          <el-input v-model="keyWord" clearable placeholder="监测因子、因子编号" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onSearchQuery">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" :v-loading="addLoading" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selection.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <!-- <div class="surveyButton">
      <el-button  type="primary"  size="small"  @click="onClickAdd()" :v-loading="addLoading">
        <i  class="fa  fa-plus-circle"  aria-hidden="true"></i>  新  增
      </el-button>
      <el-button  type="danger"  size="small"  @click="onDeleteItem()">
        <i  class="fa  fa-trash-o"  aria-hidden="true"></i>  删  除
      </el-button>
    </div> -->
    <!-- <el-table v-loading="tableLoading" border class="mar-t-sm" ref="surveyTable" height="45vh"
      :data="tableData" @selection-change="handleSelectionChange" stripe> -->
    <el-table
      v-loading="tableLoading"
      height="calc(100% - 69px)"
      ref="surveyTable"
      border
      highlight-current-row
      :row-class-name="_rowClassName"
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-cog" @click="onClickConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="factorsName" label="检测因子" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="factorsCode" label="因子编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusName" label="状态" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- <div class="surveyPagin mar-t-sm" style="text-align: right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 15, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div> -->
    <paging-query :pager="pager" @query="onSearchQuery"/>
    <el-dialog :visible.sync="dialogVisible" @close = "onCloseDialog" :close-on-click-modal="false"
      title="修改设置污染物" append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormSurveyFactor" label-position="right"
        label-width="100px" class="demo-ruleForm">
        <!-- factorsName 待定 -->
        <el-form-item label="污染物：" prop="factorsCode">
          <el-select v-model="ruleForm.factorsCode" style="width:100%;" clearable>
            <el-option v-for="(item,index) in formData.factorsName" :key="index"
              :label="item.factorName" :value="item.factorCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="ruleForm.status"  style="width:100%;" clearable>
            <el-option v-for="(item,index) in formData.status" :key="index"
              :label="item.Text" :value="item.CodeValue">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button  type="primary"  size="small"  @click="onSaveItem()">
          <i  class="fa  fa-floppy-o"  aria-hidden="true"></i>  保  存
        </el-button>
        <el-button  size="small"  @click="dialogVisible  =  false">
          <i  class="fa  fa-times"  aria-hidden="true"></i>  关  闭
        </el-button>
      </div>
    </el-dialog>
    <survey-dialog ref="surveySecondDialog" @fillTableData="fillTableData"></survey-dialog>
  </el-card>
</template>

<script>
import SurveyDialog from '@/components/widgets/InstruManagement/SurveyDialog';

export default {
  name: 'surveyFactor',
  data() {
    return {
      keyWord: '', // 关键字
      tableLoading: false, // 表格加载项
      addLoading: false, // 操作按钮加载项
      tableData: [ // 表格数据
      ],
      // total: 0, // 表格总数
      selection: [], // 选中数据
      // pageSize: 15, // 分页条数
      // currentPage: 1, // 分页页码
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      factorData: '', // 记录点击操作的表格行数据
      dialogVisible: false, // 编辑dialog框显示隐藏
      ruleForm: { // 表单数据
        status: '', // '状态',
        factorsCode: '', // '污染物编码',
        factorsName: '', // 污染物名称
      },
      formData: { // 表单数据
        status: [
          {
            Text: '启用',
            CodeValue: 0,
          },
          {
            Text: '停用',
            CodeValue: 1,
          },
        ],
        factorsName: [
          {
            factorCode: '12',
            factorName: '12',
          },
          {
            factorCode: '14',
            factorName: '14',
          },
        ],
      },
      rules: { // 表单验证规则
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        factorsCode: [
          { required: true, message: '请选择污染物名称', trigger: 'change' },
        ],
      },
      addData: [], // 新增数据
    };
  },
  props: ['basicFormData'],
  components: {
    SurveyDialog,
  },
  watch: {
    basicFormData: {
      handler() {
        this.onSearchQuery();
      },
      deep: true,
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
      return this.selection.includes(row.id) ? className : '';
    },
    onSearchQuery() { // 查询按钮
      this.tableLoading = true;
      // const { page, rows } = { // 分页条件
      //   rows: this.pageSize,
      //   page: this.currentPage,
      // };
      const { page, rows } = this.pager;
      const queryForm = { // 查询条件
        instrumentId: this.basicFormData.id, // 主页rowGuid
        key: this.keyWord,
      };
      this.$http.get('bas/instrumentFactors/', {
        params: { page, rows, ...queryForm },
      }).then((response) => {
        if (response.data.success) {
          response.data.data.forEach((item) => {
            this.$set(item, 'statusName', this.$hp.StatusList[item.status]);
          });
          this.tableData = response.data.data;
          // this.total = response.data.total;
          this.pager.total = response.data.total;
          // 修复分页存在的bug
          // if (!this.tableData.length && this.total) {
          //   this.currentPage--;
          //   this.onSearchQuery();
          // }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
        this.tableLoading = false;
      });
    },
    onClickAdd() { // 新增按钮
      this.addData = [];
      this.$refs.surveySecondDialog.openDialog('');
    },
    fillTableData(val) { // 新增表格数据
      val.selection.forEach((item) => {
        const data = {
          instrumentId: this.basicFormData.id, // 主页的rowGuid
          factorsId: item.id, // 检测项目id
          status: 0, // 状态
          factorsName: item.factorName, // 因子名称
          factorsCode: item.factorCode, // 因子编码
        };
        this.addData.push(data);
      });
      this.postInstrument();
    },
    onDeleteItem() { // 删除按钮
      if (this.selection.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/instrumentFactors/', { data: this.selection })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.onSearchQuery();
          this.selection = [];
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    onClickConfig(val) { // 操作中的配置按钮
      // this.factorData = val;
      this.ruleForm = val;
      this.getPollutionData();
      this.dialogVisible = true;
    },
    handleSelectionChange(val) { // 表格数据被选中时
      this.selection = [];
      val.forEach((item) => {
        this.selection.push(item.id);
      });
    },
    clearSelection() { // 清空表格选项
      this.$refs.surveyTable.clearSelection();
    },
    // handleSizeChange(val) { // pagesize改变时
    //   this.pageSize = val;
    //   this.onSearchQuery();
    // },
    // handleCurrentChange(val) { // currentPage改变时
    //   this.currentPage = val;
    //   this.onSearchQuery();
    // },
    onSaveItem() { // 保存按钮
      // 获取污染物名称
      this.formData.factorsName.forEach((item) => {
        if (item.factorCode === this.ruleForm.factorsCode) {
          this.ruleForm.factorsName = item.factorName;
        }
      });
      this.$refs.ruleFormSurveyFactor.validate((valid) => {
        if (valid) {
          this.putInstrument();
        }
        return false;
      });
    },
    onCloseDialog() { // dialog框关闭前的回调
      this.$refs.ruleFormSurveyFactor.resetFields();
      this.ruleForm = {
        status: '',
        factorsName: '',
        factorsCode: '',
      };
    },
    // 请求层方法
    putInstrument() { // 编辑数据保存
      const data = this.factorData;
      this.$http.put('bas/instrumentFactors/', {
        id: data.id,
        instrumentId: data.instrumentId,
        factorsId: data.factorsId,
        status: this.ruleForm.status,
        factorsName: this.ruleForm.factorsName,
        factorsCode: this.ruleForm.factorsCode,
      }).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 1500,
            showClose: true,
          });
          this.onSearchQuery();
          this.dialogVisible = false;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    postInstrument() { // 新增数据
      // 现在addData为数组，且未json化
      this.$http.post('bas/instrumentFactors/', this.addData)
        .then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 1500,
              showClose: true,
            });
            this.onSearchQuery();
            this.dialogVisible = false;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        });
    },
    getPollutionData() { // 获取污染物数据
      this.$http.get('cfg/factors/', {
        params: {
          page: 1,
          rows: 1000000,
          factorCode: '',
          factorsType: '',
          oldFactorCode: '',
          factorsname: '',
        },
      }).then((response) => {
        if (response.data.success) {
          this.formData.factorsName = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
  },
  created() {
    this.onSearchQuery();
  },
};
</script>

<style lang="scss" scoped>
</style>
