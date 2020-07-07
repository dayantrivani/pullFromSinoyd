<template>
  <dialog-modal ref="dialog"
                title="安全分析"
                maxScrollbar
                size="small"
                @close="closeDialog">
    <div class="mar-b-sm">
      <el-button type="primary"
                 icon="fa fa-plus"
                 @click="onClickAdd()">新 增</el-button>
      <el-button type="primary"
                 icon="fas fa-file-invoice"
                 @click="onClickTemp()">选择模板</el-button>
      <el-button type="danger"
                  icon='fas fa-trash-alt'
                  :disabled="!selectedIds.length"
                  @click="onDeleteItem()">删 除</el-button>
    </div>
    <el-table border
              highlight-current-row
              height="40vh"
              v-loading="loading"
              :data="itemList"
              class="mar-b-sm"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                        type="selection"
                        width="40"></el-table-column>
      <el-table-column align="center"
                       type="index"
                       width="50"
                       label="No."></el-table-column>
      <el-table-column align="center"
                        label="操作"
                        width="100"
                        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                    icon="fas fa-pencil-alt"
                    @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="analysisContent"
                       header-align="center"
                       label="安全分析"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <dialog-analysis ref="dialog" @query="getItemList" />
    <analysis-temp ref="temp" @query="getItemList" />
  </dialog-modal>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogAnalysis from './components/DialogAnalysis';
import AnalysisTemp from './components/AnalysisTemp';

export default {
  name: 'SafetyAnalysis',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogAnalysis,
    AnalysisTemp,
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/workAnalysis',
      loading: false,
      queryForm: {      // 查询表单绑定变量
        workId: '',     // 作业主键
        sort: 'orderNum-',
      },
      pager: {
        page: 1,
        rows: 999,
      },
      itemList: [],
    };
  },
  methods: {
    // 新增
    onClickAdd() {
      const item = { workId: this.queryForm.workId };
      this.$refs.dialog.openDialog(item);
    },
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 模板
    onClickTemp() {
      this.$refs.temp.openDialog(this.queryForm.workId);
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.queryForm.workId = row.id;
        this.getItemList();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 获取安全分析
    getItemList() {
      const { page, rows } = this.pager;
      this.loading = true;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
