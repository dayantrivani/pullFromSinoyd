<template>
  <el-card type="title" fill style="border-top: 1px solid #ebeef5;">
    <!-- 检索条件 -->
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-sm">
      <!-- 多选点位 -->
      <el-form-item label="起止时间：">
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.fromTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width: 140px;"
          v-model="queryForm.toTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 23:59:59"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表相关内容 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 30px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="modifyName" label="发送人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="createDate" label="操作时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="valveStatus" label="阀门状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('VALVE_STATUS', `${row.valveStatus}`)}}
        </template>
      </el-table-column>
      <el-table-column
        property="cmdDesc"
        label="命令描述"
        min-width="280"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column property="execState" label="命令执行情况" min-width="120">
        <!-- <template slot-scope="{ row }">
          {{status[row.status]}}
        </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';

export default {
  name: 'RemoteRecord',
  mixins: [queryList],
  props: ['portId'],
  data() {
    return {
      url: 'tpeci/oriSend',
      queryForm: {                            // 查询条件
        cnList: ['3810', '3811', '3812'],
        fromTime: getDay(-2, true, false),   // 开始时间
        toTime: getDay(0, true, true),      // 结束时间
      },
      status: ['下发中', '执行成功', '执行失败'],
      downloading: false,
    };
  },
  methods: {
    /** 请求层 */
    getItemList() {              // 获取记录列表
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(this.url, { ...this.queryForm, portId: this.portId }, {
        params: {
          page,
          rows,
          sort: 'createDate-',
        },
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
  },
};
</script>

<style lang="scss" scoped>
</style>
