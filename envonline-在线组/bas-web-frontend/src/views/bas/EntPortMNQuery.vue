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
          <select-tree-mod @getTreeData="getTreeData" placeholder="请选择" :options="options" />
        </el-form-item>
        <el-form-item label="排口状态：">
          <el-select v-model="queryForm.status" clearable>
            <el-option v-for="(item, key) in $enum.status" :key="key" :label="item" :value="key - 0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.key" style="width: 230px" clearable placeholder="企业名称、排口名称、数采仪编号"></el-input>
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
      highlight-current-row
      :data="itemList"
      :row-class-name="_rowClassName">
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
import { queryList } from '@/plugins/mixins';

export default {
  name: 'EntPortMNQuery',
  mixins: [queryList],
  data() {
    return {
      url: 'bas/portInfo/dgiMN?sort=portName&page=1&rows=15',
      type: 'post',
      isAuto: true,
      isUrl: true,
      queryForm: {
        portTypes: [],
        status: '',
        key: '',
      },
      options: [
      ],
    };
  },
  computed: {
    _URL() {
      const { page, rows } = this.pager;
      return `bas/portInfo/dgiMN?page=${page}&rows=${rows}&sort=portName`;
    },
  },
  created() {
    if (this.isAuto) this.onQueryList();
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'PortType' })
      .then((val) => { this.options = val; });
  },
  methods: {
    getTreeData(val) {
      this.queryForm.portTypes = val || [];
    },
  },
};
</script>
