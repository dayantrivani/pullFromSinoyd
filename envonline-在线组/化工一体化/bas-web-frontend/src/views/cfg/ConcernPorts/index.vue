<template>
 <!-- 企业排口的关注 -->
  <el-card fill>
  <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="排口类型：">
          <select-tree-mod @getTreeData="getTreeData" :options="dict.portType"></select-tree-mod>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.key"
            style="width: 290px"
            placeholder="排口名称、MN号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        :disabled="!selectedIds.length"
        @click="onClickAdd">关 注
      </el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">取消关注
      </el-button>
    </div>
  <!-- 记录列表 -->
    <el-table
      border
      height="calc(100% - 76px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="125">
        <template slot-scope="scope">
          <el-button type="primary" icon="far fa-star" v-if="scope.row.isConcern">关注</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="排口类型"
        property="portTypeName"
        show-overflow-tooltip
        width="200">
      </el-table-column>
      <el-table-column property="portName" label="排口名称" show-overflow-tooltip></el-table-column>
      <el-table-column
        property="dgiMn"
        label="数采仪MN号"
        show-overflow-tooltip
        min-width="100">
      </el-table-column>
      <el-table-column property="isNetWorking" label="联网情况" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.isNetWorking === 0 || scope.row.isNetWorking === '0'">联网</span>
          <span v-if="scope.row.isNetWorking === 1 || scope.row.isNetWorking === '1'">不联网</span>
        </template>
      </el-table-column>
      <el-table-column property="statusName" label="排口状态" show-overflow-tooltip width="100"></el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
  </el-card>
</template>

<script>
import SelectTreeMod from '@/components/SelectTreeMod';
// import { queryList } from '@/plugins/mixins';

export default {
  name: 'ConcernPorts',
  components: { SelectTreeMod },
  // mixins: [queryList],
  data() {
    return {
      loading: false,
      baseURL: 'cfg/concernPort',
      sort: 'portName', // 排序字段
      queryForm: {
        portTypes: [],
        key: '',
      },
      itemList: [],
      selectedIds: [],
      pager: {
        page: 1,
        count: 0,
        rows: 15,
      },
      dict: {
        portType: [],
      },
    };
  },
  computed: {},
  created() {
    this.getItemList();
    this.getDictList();
  },
  methods: {
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
    getTreeData(val) { // 类型下拉框选择事件
      this.queryForm.portTypes = val || [];
    },
    // 当选择项发生变化时会触发该事件
    changeSelected(option) {
      this.selectedIds = option.map(val => val.id);
    },
    // 点击查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 点击关注
    onClickAdd() {
      this.loading = true;
      const url = this.baseURL;
      this.$http.post(url, this.selectedIds).then((response) => {
        if (!response.data.success) {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        } else {
          this.getItemList();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 点击取消关注
    onDeleteItem() {
      this.loading = true;
      const url = this.baseURL;
      this.$http.delete(url, { data: this.selectedIds }).then((response) => {
        if (!response.data.success) {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        } else {
          this.getItemList();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      const url = `${this.baseURL}/query?page=${page}&rows=${rows}&sort=${this.sort}`;
      return new Promise((resolve) => {
        this.$http.post(url, {
          ...this.queryForm,
        }).then((response) => {
          if (response.data.success) {
            this.itemList = response.data.data;
            this.pager.count = response.data.count;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
          resolve(response);
        }).finally(() => {
          this.loading = false;
        });
      });
    },
  },
};
</script>

<style lang="scss">
</style>
