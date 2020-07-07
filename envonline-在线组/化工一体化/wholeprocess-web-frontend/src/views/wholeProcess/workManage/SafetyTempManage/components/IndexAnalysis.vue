<template>
  <div>
    <el-card>
      <template slot="header">
        <el-form inline :model="queryForm">
          <el-form-item label="所属作业：">
            <el-select v-model="queryForm.workType"
                      clearable
                      class="z-pointer"
                      style="width: 200px;">
              <el-option v-for="(item, index) in $enum.WORKTYPE"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          <el-form-item>
          </el-form-item>
        </el-form>
      </template>
      <div class="mar-l-sm mar-t-xs mar-b-xs">
        <el-button type="primary"
                   icon='fas fa-plus'
                   @click="onClickAdd"
                   >新 增</el-button>
        <el-button type="danger"
                   icon='fas fa-trash-alt'
                   :disabled="!selectedIds.length"
                   @click="onDeleteItem()"
                   >删 除</el-button>
      </div>
      <!-- 列表 -->
      <el-table border
                class="mar-t-xs"
                highlight-current-row
                height="calc(100vh - 220px)"
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
                      @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column property="workType"
                        label="所属作业"
                        width="150"
                        show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ $enum.WORKTYPE.find(e => e.value === row.workType)
              && $enum.WORKTYPE.find(e => e.value === row.workType).label }}
          </template>
        </el-table-column>
        <el-table-column property="analysisContent"
                        label="分析内容"
                        min-width="100"
                        show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="isExternal"
                        label="是否外来方措施"
                        width="150"
                        show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ row.isExternal ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column property="isAutoApply"
                        label="是否自动应用"
                        width="150"
                        show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ row.isAutoApply ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column property="orderNum"
                        label="排序值"
                        width="100"
                        show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager" @query="getItemList()"/>
    </el-card>
    <dialog-analysis ref="analysis" @query="getItemList" />
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogAnalysis from './components/DialogAnalysis';

export default {
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogAnalysis,
  },
  data() {
    return {
      url: 'wholeprocess/analysisTemplate',
      queryForm: {
        workType: '',     // 特殊作业类型
        sort: 'orderNum-',
      },
      itemList: [],
    };
  },
  props: {},
  computed: {
  },
  watch: {
  },
  beforeCreate() {},
  created() {
  },
  methods: {
    onClickAdd() {
      this.$refs.analysis.openDialog();
    },
    onClickEdit(row) {
      this.$refs.analysis.openDialog(row);
    },
  },
};
</script>
