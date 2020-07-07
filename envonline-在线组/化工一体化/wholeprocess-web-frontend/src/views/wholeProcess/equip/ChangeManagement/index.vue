<!-- 设备管理-变更申请 -->
<template>
  <el-card v-if="isRouterCheck">
    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="申请日期：">
          <el-date-picker v-model="queryForm.fromDate" type="date" style="width: 140px" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间"></el-date-picker>
          <span class="demonstration"> ~ </span>
          <el-date-picker v-model="queryForm.toDate" type="date" style="width: 140px" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00"
            placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="变更名称：">
          <el-input v-model="queryForm.changeName" placeholder="变更名称" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态：">
          <el-select v-model="queryForm.dataStatus" clearable>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="审核通过" :value="10"></el-option>
            <el-option label="审核未通过" :value="5"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="申请部门：">
          <select-info-table v-model="queryForm.deptId" :isPsId="false" type="dp" title="选择部门" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" style="position: relative" v-if="+params.type === 1">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table border highlight-current-row :height="`calc(100% - ${+params.type === 1 ? '70px' : '33px'})`" v-loading="loading"
      :data="itemList" @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="69">
        <template slot-scope="scope">
          <el-button
            :disabled="+scope.row.dataStatus === 10"
            v-if="+params.type === 1" type="primary"
            icon="fas fa-pencil-alt"
            @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button v-else type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">
            {{+params.type === 2 ? '审核' : '验收'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="createDate" label="申请时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="changeName" label="变更名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="applicantName" label="申请人" min-width="95" show-overflow-tooltip></el-table-column>
      <el-table-column property="deptName" label="部门" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="changeDate" label="变更日期" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="status" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
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
  name: 'applyFor',
  mixins: [                   // 混合
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      isRouterCheck: true, // 切换路由刷新组件
      params: { // 当前模块配置，区分变更申请，变更审核，变更验收
        title: '',
        type: 1,
      },
      isAuto: false,
      url: 'wholeprocess/changeManagement',
      // 查询表单绑定变量
      queryForm: {
        fromTime: '', // 开始停车时间
        toTime: '', // 结束停车时间
        changeName: '', // 变更名称
        dataStatus: 0, // 0未审核、5不同意/审核不通过、10同意/审核通过
        deptId: '', // 部门id
        sort: 'psName+,changeDate-',
      },
      itemList: [],
      dict: { // 字典表数据
        safetyFacilities: [],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    route() { return this.$route; },
  },
  watch: {
    route: {
      handler(val) {
        this.reload();
        this.params = { ...val.meta };
      },
      immediate: true,
    },
  },
  created() {
    this.queryForm.psId = this.orgGuid;
    this.getDictList();
    this.$nextTick(() => {
      if (+this.params.type === 1) {
        this.queryForm.dataStatus = '';
      } else if (+this.params.type === 2) {
        this.queryForm.dataStatus = 0;
      } else if (+this.params.type === 3) {
        this.queryForm.dataStatus = 10;
        this.queryForm.acceptStatus = 0;
      }
      this.onQueryList();
    });
  },
  methods: {
    reload() { // 切换路由刷新当前实例
      this.isRouterCheck = false;
      this.$nextTick(() => {
        this.isRouterCheck = true;
      });
    },
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
