<!-- 排放量数据查询 -->
<template>
  <el-row>
    <el-col :span="7">
      <el-card>
        <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
          <el-form-item label="企业名称：">
            <el-input v-model="queryForm.psName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          </el-form-item>
        </el-form>
        <el-table border highlight-current-row height="100%" v-loading="loading" :data="itemList">
          <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
          <el-table-column label="企业名称" prop="psName" min-width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="color:#409EFF;cursor:pointer;" @click="openDetails(scope.row)">{{scope.row.psName}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="17">
      <el-card>
        <iframe :src="src" style="width:100%;height:100%" frameborder="0"></iframe>
      </el-card>
    </el-col>
  </el-row>

</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'DataQuery',
  mixins: [queryList],
  data() {
    return {
      url: 'bas/portInfo/queryAuthority',
      queryForm: {                          // 检索条件对象
        psName: '',
        portType: 5,
        sort: 'psName+,portName',
        status: 1,
      },
      src: '',
    };
  },
  methods: {
    openDetails(row) {
      this.src = `http://58.211.102.242:18020/EnvSubject/WRY/RainHome2.html?psId=${row.psId}`;
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      this.$http.get(this.url, {
        params: { page: 1, rows: 10000, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const hash = {};
          this.itemList = response.data.data.reduce((preVal, curVal) => {
            // eslint-disable-next-line no-unused-expressions
            hash[curVal.psId] ? '' : hash[curVal.psId] = true && preVal.push(curVal);
            return preVal;
          }, []);
          const [first] = this.itemList;
          if (first) {
            this.src = `http://58.211.102.242:18020/EnvSubject/WRY/RainHome2.html?psId=${first.psId}`;
          }
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
  },
};
</script>

<style lang="scss" scoped>
</style>
