<!-- 现场管理-生产装置开停车管理 -->
<template>
  <el-card>
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.keyWord" placeholder="方案名称、方案编号" clearable style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="停车时间：">
          <el-date-picker
            v-model="queryForm.fromTime"
            type="datetime"
            style="width: 180px"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:00"
            placeholder="开始时间"></el-date-picker>
          <span class="demonstration"> ~ </span>
          <el-date-picker
            v-model="queryForm.toTime"
            type="datetime"
            style="width: 180px"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:00"
            placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" style="position: relative">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 70px)" v-loading="loading" :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="planName" label="方案名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="planCode" label="方案编号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="depName" label="编制部门" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="contactName" label="实施负责人" min-width="95" show-overflow-tooltip></el-table-column>
      <el-table-column property="stopDate" label="停车时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="startDate" label="开车时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="approveTime" label="审核批准时间" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';

export default {
  name: 'safetyDevice',
  mixins: [                   // 混合
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/safetyDeviceStartStopPlan',
      // 查询表单绑定变量
      queryForm: {
        fromTime: '', // 开始停车时间
        toTime: '', // 结束停车时间
        keyWord: '', // 关键字
        sort: 'stopDate',
      },
      dict: { // 字典表数据
        safetyFacilities: [],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.queryForm.psId = this.orgGuid;
    this.getDictList();
    this.$nextTick(() => {
      this.onQueryList();
    });
  },
  methods: {
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击编辑回调
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 特殊方法
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.posion {
    position: absolute;
    right: 0;
    width: 300px;
    bottom: 2px;
}
</style>
