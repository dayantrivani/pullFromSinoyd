<template>
  <!-- 企业产值维护 -->
  <el-card class="block">
    <el-form class="mar-x-sm mar-t-xs" inline>
      <el-form-item label="所属年份：">
        <el-date-picker
          style="width:135px"
          v-model="queryForm.year"
          type="year"
          format="yyyy"
          value-format="yyyy"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="企业名称：">
        <el-select
          :loading="ploading"
          v-model="queryForm.psId"
          autofocus
          clearable
          filterable
          collapse-tags
          style="width: 220px">
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

    <!-- 按钮组 -->
    <div class="mar-y-xs mar-l-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <el-table
      border
      highlight-current-row
      :height="height"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="76">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row)">编 辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属年份" prop="belongYear" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="开票销售（万元）" prop="totalOutputValue" min-width="160" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column v-if="itemList.length !== 0" > -->
      <template>
        <el-table-column
          v-for="(item,index) in positionList"
          :key="index"
          :label="`${item.industryName}（万元）`"
          min-width="160"
          show-overflow-tooltip>
          <!-- {{ item.value }} -->
          <template slot-scope="{ row }">
            {{ getValue(row.detail, item.id) }}
          </template>
        </el-table-column>
      </template>
      <!-- </el-table-column> -->
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-form ref="dialogform"
      :psBaseList="psBaseList"
      :positionList="positionList"
      @query="getItemList"
    />
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'EPOutputValueMaintain',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/parkPSOutputValue', // 上传文件请求地址
      isShow: true,       // 是否显示
      ploading: false,
      height: 'calc(100% - 70px)',
      isAuto: false,      // 触发混合
      queryForm: {
        psId: [],
        year: new Date().getFullYear().toString(),
        sort: 'psId+,belongYear+',
      },
      itemList: [],       // 列表数据
      positionList: [],   // 产业定位列表
      psBaseList: [],     // 企业列表
      loading: false,     // 加载状态
    };
  },
  watch: {
    $route: {
      handler(val) {
        if (val.name === 'EPOutputValueMaintain') {
          this.getIndustryPosition();
          this.getPSIdList();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onClickEdit(row) {          // 编辑
      this.$refs.dialogform.openDialog(row);
    },
    onClickAdd() {           // 单击新增回调
      this.$refs.dialogform.openDialog();
    },

    // 接口请求
    getIndustryPosition() {   // 获取列表数据
      this.loading = true;
      this.$http.get('bas/parkIndustryPosition', {
        params: {
          page: 1,
          rows: 1000000,
          sort: 'createDate-',
          key: '',                    // 园区现有企业产业类型
          type: -1,                   // 产业类型
          isNegativeIistIndustry: '',
        },
      }).then((response) => {
        if (response.data.success) {
          this.positionList = response.data.data || [];
          this.height = 'calc(100% - 71px)';
          this.getItemList();
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
    getItemList() {
      this.loading = true;
      this.selectedIds = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      // const queryForm = {  ...this.queryForm, psIds: this.queryForm.psIds.join(',') };
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
          this.height = 'calc(100% - 72px)';
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
    getPSIdList() {       // 获取企业列表
      this.tankFarmList = [];
      this.ploading = true;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1,
          rows: 100000,
          psType: -1,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data || [];
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
        this.ploading = false;
      });
    },

    /* 特殊方法 */
    getValue(arr, id) {          // 获取产业名称
      let val = '';
      arr.forEach((v) => {
        if (v.key === id) {
          val = v.value;
        }
      });
      return val;
      // return (this.positionList.filter(v => v.id === id)[0] || {}).industryName;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
