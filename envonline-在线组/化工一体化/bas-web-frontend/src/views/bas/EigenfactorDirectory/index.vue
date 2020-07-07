<!-- 园区特征因子名录库 -->
<template>
  <el-card>
  <!-- 检索表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="因子类型：" prop="keyChemicalsNameCodeId">
          <el-select clearable v-model="queryForm.factorType" >
            <el-option
              v-for="(item, key) in $enum.FactorsType"
              :key="key"
              :label="item"
              :value="key - 0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="因子名称：">
          <el-input clearable style="width:150px" v-model="queryForm.factorName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
  <!-- 列表展示 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 32px)"
      v-loading="loading"
      :data="itemList.factorList">
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed align="center" label="因子" width="180" show-overflow-tooltip>
        <template slot-scope="{ row }">{{row}}</template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        v-for="item in itemList.psList"
        :key="item.psId"
        :label="item.psName"
        :min-width="getLabelLen(item)">
        <template slot-scope="{ row }">
          <i class="fas fa-check tagStyle" v-if="hanFactor(item.psId, row)"></i>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query v-model="pager" @query="getItemList()"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { tableTitleLen } from '@/global/libs/tools';

export default {
  name: 'EigenfactorDirectory',
  data() {
    return {
      url: 'bas/pSCharacteristicPollutants/query',
      // 【定义变量——检索条件】
      queryForm: {},                // 检索表单内容
      // 【定义变量——列表】
      loading: false,
      itemList: {                   // 获取到的数据源
        psList: [],
        factorList: [],
        psHaveFactor: [],
      },
      // 【定义变量——分页】
      pager: {        // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  computed: {
    // 对现有数据结构重构
    factorKeys() {
      if (!this.itemList.psHaveFactor.length) return [];
      const factorKeys = this.itemList.psHaveFactor.map(obj => Object.keys(obj)[0]);
      return factorKeys;
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 【方法——数据处理类】
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 数据内容辅助判断
    hanFactor(id, factor) {
      const index = this.factorKeys.findIndex(v => v === id);
      const factorList = index !== -1
        ? this.itemList.psHaveFactor[index][id]
        : [];
      return factorList.includes(factor) ? '√' : '';
    },
    // 设置列表表头的宽度
    getLabelLen(item) {
      const label = tableTitleLen(item.psName);
      return label;
    },
    // ----------【方法——接口请求类】-----------
    // 查询内容
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(`${this.url}`, {
        params: {
          page,
          rows,
          factorName: this.queryForm.factorName,
          factorType: this.queryForm.factorType,
        },
      }).then((response) => {
        if (response.data.success) {
          const { data } = response.data;
          this.itemList = data;
          this.pager.count = response.data.count;     // 获取到所有的总条数，用于在分页组件中渲染
        } else {
          // 对无法请求到数据时的错误判断
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
  },
};
</script>

<style lang="scss" scoped>
.tagStyle {
  color: #3196FA;
  font-size: 18px;
}
</style>
