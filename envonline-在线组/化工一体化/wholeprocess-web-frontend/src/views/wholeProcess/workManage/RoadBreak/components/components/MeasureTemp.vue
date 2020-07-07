<template>
  <dialog-modal ref="dialog"
                title="安全措施模板"
                maxScrollbar
                size="small"
                appendToBody
                @close="closeDialog">
    <!-- 查询表单 -->
    <div class="mar-y-xs">
      <el-form inline :model="queryForm">
        <el-form-item label="是否外来措施：">
          <el-select v-model="queryForm.isExternal"
                       clearable>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <hr>
    <div class="mar-l-xs mar-y-xs">
      <el-button type="primary"
                 icon="far fa-save"
                 :disabled="!selectedItems.length"
                 @click="onSaveItem()">保存
      </el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
    <el-table border
              highlight-current-row
              :row-key="getRowKey"
              v-loading="loading"
              height="45vh"
              :data="itemList"
              @selection-change="onChangeSelected">
        <el-table-column align="center" type="selection" width="40" :reserve-selection="true"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column property="measuresContent" header-align="center" label="安全措施" show-overflow-tooltip />
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'SaftyMeasureTemp',
  mixins: [
    queryList,
  ],
  components: {
  },
  data() {
    return {
      url: 'wholeprocess/measuresTemplate',
      loading: false,
      workId: '',
      queryForm: {     // 查询表单绑定变量
        type: 1,       // 1安全措施 2安全分析
        workType: 64,  // 64断路作业
        isExternal: '',
        sort: 'orderNum-',
      },
      selectedItems: [],
    };
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    // 打开对话框
    openDialog(workId) {
      this.workId = workId || '';
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onChangeSelected(val) {
      this.selectedItems = val;
    },
    // 保存数据
    onSaveItem() {
      const tempArr = [];
      this.selectedItems.forEach((item) => {
        const tempObj = {
          workId: this.workId,
          measuresContent: item.measuresContent,
        };
        tempArr.push(tempObj);
      });
      this.$http.post('wholeprocess/workMeasures', tempArr).then((response) => {
        if (response.data.success) {
          this.$emit('query');
          this.closeDialog();
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
          });
          this.closeDialog();
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
  },
};
</script>
