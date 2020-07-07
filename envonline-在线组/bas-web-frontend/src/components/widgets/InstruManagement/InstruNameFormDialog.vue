<template>
  <!-- <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false"
    title="仪器型号管理" width="90%" top="10vh" append-to-body> -->
  <dialog-modal ref="dialog" size="large" title="仪器型号管理" :append-to-body="true">
    <!-- 头部 -->
    <el-form class="clearfix mar-l-sm mar-y-xs" inline>
      <el-form-item>关键字：</el-form-item>
      <el-form-item>
        <el-input v-model="keyWord" clearable style="width: 220px;"
          placeholder="仪器名称、仪器编号">
        </el-input>
      </el-form-item>
      <el-form-item>仪器类型：</el-form-item>
      <el-form-item>
        <el-select v-model="instrumentType.data" placeholder="请选择" style="width: 120px;">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in instrumentType.option" :key="index"
            :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" size="small" @click="onSearchQuery()">
          <i class="fa fa-search" aria-hidden="true"></i>  查  询
        </el-button> -->
        <el-button type="primary" icon="fas fa-search" @click="onSearchQuery">查 询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <!-- <el-table stripe :data="tableData" v-loading="tableLoading" border
      class="mar-t-sm" style="width: 100%" height="50vh"> -->
    <el-table
      v-loading="tableLoading"
      border
      height="calc(100% - 76px)"
      highlight-current-row
      :data="tableData">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="success" icon="fas fa-check" @click="onClickEdit(scope.row)">确认</el-button>
        </template>
      </el-table-column>
      <!-- prop="" 内容 min-width="120" 长度-->
      <!--
        修改 - 原
        instrumentTypeName - instrumentType
        psName - psId
        statusName - status
        由于获取的数据只有编码,显示的却必须是名称;
        原字符串又会在其余地方使用,故添加新的字符串记录编码对应的名称
        -->
      <el-table-column prop="instrumentTypeName" label="仪器类型" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentName" label="仪器名称" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentCode" label="仪器编号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentModel" label="仪器型号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentNum" label="仪器数量" min-width="150" align="center"
        show-overflow-tooltip></el-table-column>
      <!-- 数据未确定 -->
      <el-table-column prop="manufacturer" label="制造厂商" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 15, 35, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->
    <paging-query :pager="pager" @query="onSearchQuery"/>
  </dialog-modal>
  <!-- </el-dialog> -->
</template>

<script>
export default {
  name: 'instrNameFormDialog', // 新增和编辑的公共组件
  data() {
    return {
      // 查询条件状态
      keyWord: '', // 关键字
      instrumentType: { // 仪器类型
        data: '',
        option: [
        ],
      },
      tableLoading: false, // 表格数据加载
      // 操作按钮状态
      // dialogVisible: false,
      // 表格状态
      tableData: [ // 表格数据
      ],
      // currentPage: 1, // 页码数
      // pageSize: 15, // 每页条数
      // total: 0, // 分页总条数
      pager: {   // 修改项
        page: 1,
        rows: 15,
        total: 0,
      },
    };
  },
  created() {
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'InstrumentCategory' }).then((val) => {
      this.instrumentType.option = val;
      this.onSearchQuery();
    });
  },
  methods: {
    openDialog() { // 父组件调用子组件方法
      // this.dialogVisible = true;
      this.$refs.dialog.openDialog();
      this.onSearchQuery();
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 主页方法
    onSearchQuery() { // 查询按钮
      this.tableLoading = true;
      // const { page, rows } = { // 分页条件
      //   rows: this.pageSize,
      //   page: this.currentPage,
      // };
      const { page, rows } = this.pager;
      const queryForm = { // 查询条件
        key: this.keyWord,
        instrumentType: this.instrumentType.data,
      };
      this.$http.get('bas/instrumentMainInfo/', {
        params: { page, rows, ...queryForm },
      }).then((response) => {
        if (response.status === 200) {
          // 企业名称字段
          response.data.data.forEach((item) => {
            // 仪器类型传过来的是一串编码
            this.instrumentType.option.forEach((data) => {
              // if (data.dictCode === item.instrumentType) {
              if (data.rowGuid === item.instrumentType) {
                this.$set(item, 'instrumentTypeName', data.dictName);
              }
            });
          });
          this.tableData = response.data.data;
          // this.total = response.data.total;
          this.pager.total = response.data.count;
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
    onClickEdit(val) { // 点击操作中的确认按钮
      this.$emit('getintruNameData', val);
      // this.dialogVisible = false;
      this.$refs.dialog.closeDialog();
    },
    // handleSizeChange(val) { // pageSize改变时
    //   this.pageSize = val;
    //   this.onSearchQuery();
    // },
    // handleCurrentChange(val) { // currentPage改变时
    //   this.currentPage = val;
    //   this.onSearchQuery();
    // },
    // 请求获取数据
  },
};
</script>

<style lang="scss" scoped>
</style>
