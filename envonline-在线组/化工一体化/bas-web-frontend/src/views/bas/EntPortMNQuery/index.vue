<template>
  <!--
    企业排口MN号查询 -- 新页面
    enterprise outlet MN query
  -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="排口类型：">
          <select-tree-mod @getTreeData="getTreeData" :options="dict.portType" />
        </el-form-item>
        <el-form-item label="排口状态：">
          <el-select v-model="queryForm.status" clearable>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.key" style="width: 290px" placeholder="企业名称、排口名称、数采仪编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          <!-- <el-button type="primary" icon="fas fa-upload">导 出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 记录列表 -->
    <el-table
      border
      height="calc(100% - 36px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column prop="regionName" label="行政区域" show-overflow-tooltip></el-table-column>
      <el-table-column prop="psName" label="企业名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="portName" label="排口名称" min-width="180" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="isOnline" label="在线情况" show-overflow-tooltip>
        <template slot-scope="scope"><span>{{ scope.row.isOnline === 1 ? '在线' : '不在线' }}</span></template>
      </el-table-column> -->
      <!-- 排口类型名称 -->
      <el-table-column prop="portTypeName" label="排口类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dgiMn" label="数采仪MN号" min-width="120" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="accessPassword" label="访问密码" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="statusName" label="排口状态" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import SelectTreeMod from '@/components/SelectTreeMod';

export default {
  name: 'EntPortMNQuery',
  components: { SelectTreeMod },
  data() {
    return {
      loading: false,
      url: 'bas/portInfo/dgiMN',
      queryForm: {
        portTypes: [],
        status: '',
        key: '',
      },
      itemList: [],
      selectedIds: [],
      dict: {
        portType: [],
      },
      pager: {
        page: 1,
        count: 0,
        rows: 15,
      },
    };
  },
  created() {
    this.onQueryList();
    this.getDictList();
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    isEmptyObj(obj) { // 判断对象是否为空
      return Object.keys(obj).length === 0;
    },
    getDictList() { // 获取字典表数据
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    getItemList() { // 获取数据列表
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: {
          rows,
          page,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getTreeData(val) {
      this.queryForm.portTypes = val || [];
    },
  },
};
</script>
