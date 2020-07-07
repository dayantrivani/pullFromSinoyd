<!-- 弹窗表格选择企业 -->
<template>
  <div>
    <!-- 弹窗 -->
    <dialog-modal ref="dialog"
                  title="选择指标"
                  @close="closeDialog"
                  append-to-body
                  scrollbar>
      <el-form inline
               class="pad-x-sm"
               :model="queryForm">
        <el-form-item label="指标名称："
                      prop="indexName">
          <el-input v-model="queryForm.indexName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="getItemList">查 询</el-button>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <hr class="mar-x-sm mar-t-0" />
      <div class="pad-x-sm pad-b-xs">
        <el-button icon="el-icon-check"
                   type="primary"
                   :disabled="!selected.length"
                   @click="onClickCheck(true)">保存并关闭
        </el-button>
        <el-button icon="el-icon-check"
                   :disabled="!selected.length"
                   @click="onClickCheck(false)">保存并继续
        </el-button>
      </div>
      <!-- 列表 -->
      <el-table border
                highlight-current-row
                height="calc(60vh - 80px)"
                v-loading="loading"
                :data="itemList"
                :row-class-name="rowClassName"
                @selection-change="onChangeSelected">
        <el-table-column align="center"
                         type="selection"
                         width="40"></el-table-column>
        <el-table-column align="center"
                         label="No."
                         width="50"
                         type="index"
                         :index="index"></el-table-column>
        <el-table-column property="indexName"
                         label="指标名称"
                         min-width="100"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="indexValue"
                         label="指标值"
                         min-width="120"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="remark"
                         label="备注"
                         min-width="130"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <paging-query :pager="pager"
                    @query="getItemList" />
    </dialog-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  name: 'SelectTable',
  created() {
    if (this.userType === 'ent') {
      this.queryForm.orgId = this.orgGuid;
    }
  },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      loading: false,
      queryForm: {
        indexName: '', // 企业id
        sort: 'indexName',
      },
      pager: {            // 分页
        page: 1,
        rows: 10,
        count: 0,
      },
      isAuto: false,
      size: 'small',
      url: 'wholeprocess/indexSetting',
      clearBol: true,
    };
  },
  methods: {
    onChangeSelected(selection) {
      this.selected = selection;
    },
    openDialog() {
      this.clearBol = true;
      this.selected = [];
      this.onQueryList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.clearBol = false;
      this.$refs.dialog.closeDialog();
    },
    onClickCheck(closed) {
      this.$emit('selectData', this.selected, this.clearBol);
      this.clearBol = false;
      if (closed) {
        this.$refs.dialog.closeDialog();
      }
    },
  },
};
</script>
