<template>
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline
               :model="queryForm">
        <el-form-item label="指标名称："
                      prop="indexName">
          <el-input v-model="queryForm.indexName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary"
                 icon="fas fa-plus"
                 @click="onOpenDialog()">新 增</el-button>
      <el-button type="danger"
                 icon="fas fa-trash-alt"
                 :disabled="!selectedIds.length"
                 @click="onDeleteItem()">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table border
              highlight-current-row
              height="calc(100% - 71px)"
              v-loading="loading"
              :data="itemList"
              :row-class-name="rowClassName"
              @select="onChangeCheck"
              @select-all="onChangeCheckAll"
              @selection-change="onChangeSelected">
      <el-table-column align="center"
                       type="selection"
                       width="40"></el-table-column>
      <el-table-column align="center"
                       label="No."
                       width="50"
                       type="index"
                       :index="index"></el-table-column>
      <el-table-column align="center"
                       label="操作"
                       width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="fas fa-pencil-alt"
                     @click="onOpenDialog(scope.row)">详细</el-button>
        </template>
      </el-table-column>
      <el-table-column property="belongYear"
                       label="所属年份"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="responsibleLevel"
                       label="责任部门"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="responsibleLevelName"
                       label="级别"
                       min-width="100"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="indexName"
                       label="指标名称"
                       min-width="150"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="indexValue"
                       label="指标值"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="budget"
                       label="预算（万元）"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="liableUserName"
                       label="责任人"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="expectedCompletionTime"
                       label="预计完成时间"
                       min-width="120"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.expectedCompletionTime === '1753-01-01 00:00:00' ? '' : scope.row.expectedCompletionTime | date}}
        </template>
      </el-table-column>
      <el-table-column property="formulateUserName"
                       label="制定人"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="dealUserName"
                       label="审核人"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="approverUserName"
                       label="批准人"
                       min-width="120"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query v-model="pager"
                  @query="getItemList()" />
    <form-dialog @query="getItemList"
                 ref="formDialog"></form-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import formDialog from './components/formDialog';

export default {
  mixins: [queryList, deleteItem],
  components: { formDialog },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      url: 'wholeprocess/indexAssignment',
      isAuto: false,
      exportStatus: false,
      queryForm: {
        psId: '',
        indexName: '',
        sort: 'indexName+',
      },
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
    this.onQueryList();
  },
  methods: {
    // 新增编辑窗口
    onOpenDialog(row) {
      this.$refs.formDialog.openDialog(row);
    },
  },
};
</script>
