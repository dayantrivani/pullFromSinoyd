<!-- 弹窗表格选择企业 -->
<template>
  <div>
    <el-input v-model="labelModel"
              readonly
              class="z-pointer"
              :size="size">
      <el-button slot="append"
                 :size="size"
                 @click="openDialog()">
        <i class="fas fa-th-list"></i>
      </el-button>
    </el-input>
    <!-- 弹窗 -->
    <dialog-modal ref="dialog"
                  :title="`选择车间`"
                  @close="closeDialog"
                  append-to-body
                  scrollbar>
      <el-form inline
               :model="queryForm">
        <el-form-item label="部门名称/车间名称：">
          <el-input v-model="queryForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="fas fa-search"
                     @click="getItemList">查 询</el-button>
        </el-form-item>
      </el-form>
      <!-- 列表 -->
      <el-table border
                highlight-current-row
                height="calc(70vh - 115px)"
                v-loading="loading"
                :data="itemList"
                :row-class-name="rowClassName"
                @select="onChangeCheck"
                @select-all="onChangeCheckAll"
                @selection-change="onChangeSelected">
        <el-table-column align="center"
                         label="No."
                         width="50"
                         type="index"
                         :index="index"></el-table-column>
        <el-table-column align="center"
                         label="操作"
                         width="76">
          <template slot-scope="scope">
            <el-button icon="el-icon-check"
                       type="primary"
                       @click="onClickCheck(scope.row)">确认</el-button>
          </template>
        </el-table-column>
        <el-table-column property="departmentName"
                         label="部门名称/车间名称"
                         min-width="180"
                         show-overflow-tooltip></el-table-column>
        <el-table-column property="code"
                         label="车间编码"
                         min-width="180"
                         show-overflow-tooltip></el-table-column>
        <el-table-column property="explain"
                         label="车间说明"
                         show-overflow-tooltip></el-table-column>
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
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  computed: mapGetters('auth', ['userType', 'orgGuid']),
  data() {
    return {
      loading: false,
      labelModel: '',        // 显示值
      valueModel: '', // 实际值
      queryForm: {
        departmentName: '', // 车间名称
        psId: '', // 企业id
        sort: 'departmentName',
      },
      isAuto: false,
      size: 'small',
      url: 'wholeprocess/psDepartment',
    };
  },
  created() {
    if (this.userType === 'ent') {
      this.queryForm.psId = this.orgGuid;
    }
  },
  methods: {
    openDialog() {
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onClickCheck(row) {
      this.labelModel = row.departmentName;
      this.$emit('selectDeptData', row);
      this.$refs.dialog.closeDialog();
    },
    beforeDeptName(row) {
      this.labelModel = row.deptName;
    },
  },
};
</script>
