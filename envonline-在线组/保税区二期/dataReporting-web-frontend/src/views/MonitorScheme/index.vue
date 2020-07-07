<!-- 自行监测方案 -->
<template>
  <el-card>
    <!-- 查询表单——检索栏 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="执行年份：">
          <el-date-picker
            v-model="queryForm.executionYear"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业名称：" v-if="userType !== 'ent'">
          <el-select v-model="queryForm.psId" filterable clearable style="width: 260px;">
            <el-option
              v-for="(item, index) in psBaseList"
              :key="index"
              :label="item.psName"
              :value="item.psId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      :height="userType === 'ent' ? 'calc(100% - 35px)' : 'calc(100% - 70px)'"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          <el-button type="warning" icon="fas fa-cog" @click="onClickOpen(scope.row)">方案及报告</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="220" show-overflow-tooltip></el-table-column>
      <el-table-column property="isKeyPoint" label="是否重点源" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.isKeyPoint ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="监测类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope ? '自行监测' : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column property="executionYear" label="执行年份" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column property="latestUploadTime" label="最新上传时间" width="200" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <!-- 表单弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" :psList="psBaseList" />
    <!-- 方案与报告弹出框 -->
    <Deliverable ref="dialogOpen" @query="getItemList" />
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { mapGetters } from 'vuex';
import DialogForm from './components/DialogForm';
import Deliverable from './components/Deliverable';

export default {
  name: 'MonitorScheme',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    Deliverable,
  },
  provide() { // 向后代组件注入当前this
    return {
      schemeBasicData: this,
    };
  },
  data() {
    return {
      url: 'sm/schemeBasicData',
      itemList: [],                      // 列表数据源
      psBaseList: [],                    // 企业列表
      queryForm: {                       // 查询表单项
        executionYear: '',               // 执行年份
        psId: '',                        // 企业名称
        sort: 'psName',
      },
      schemeItem: {},                    // 选中的方案对象
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    this.getPsBaseList();
  },
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.id);
    },
    // 查询表单
    // onQueryList() {},
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
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
    // 方案与报告弹出框
    onClickOpen(row) {
      this.schemeItem = { ...row };
      this.$refs.dialogOpen.openDialog(row);
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      if (this.userType === 'ent') this.$set(this.queryForm, 'psId', this.orgGuid);
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
    // 删除记录
    onDeleteItem(callback) {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('是否确认删除？删除后将删除该企业年度所有方案！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}`, { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          if (callback) {
            callback(this.selectedIds);
          } else {
            this.getItemList();
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    setUpdateDate(id) {
      this.$http.get('sm/schemeBasicData/updateDate', {
        params: { id },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.getItemList();
        }
      });
    },
  },
};
</script>
