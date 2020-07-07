<template>
  <!-- 日期检索栏 -->
  <el-form :model="queryForm"
           inline
           class="mar-t-xs mar-l-sm">
    <el-form-item>
      <el-select v-model="queryForm.dataType"
                 style="width: 100px;">
        <el-option label="年"
                   :value="1"></el-option>
        <el-option label="自定义"
                   :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <div v-if="['1', 1].includes(queryForm.dataType)">
        <el-date-picker style="width: 100px;"
                        v-model="queryForm.year"
                        type="year"
                        value-format="yyyy"
                        :clearable="false"
                        :editable="false"
                        @change="onQueryList"></el-date-picker>
      </div>
      <div v-else>
        <el-date-picker style="width: 120px;"
                        v-model="queryForm.fromDate"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        :editable="false"
                        @change="onQueryList"></el-date-picker>&nbsp;~
        <el-date-picker style="width: 120px;"
                        v-model="queryForm.toDate"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        :editable="false"
                        @change="onQueryList"></el-date-picker>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 icon="fas fa-search"
                 @click="onQueryList">查 询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatDate } from '@/global/libs/tools';

export default {
  name: 'QueryControl',
  data() {
    return {
      queryForm: {
        dataType: 1,
        year: new Date().getFullYear().toString(),
        fromDate: formatDate(new Date(), 'Y-m-01'),
        toDate: formatDate(new Date(), 'Y-m-01'),
      },
    };
  },
  methods: {
    onQueryList() {
      let queryForm = {};
      if (this.queryForm.dataType === 1) {
        queryForm = {
          fromDate: `${this.queryForm.year}-01-01`,
          toDate: `${this.queryForm.year}-12-01`,
        };
      } else {
        queryForm = {
          fromDate: this.queryForm.fromDate,
          toDate: this.queryForm.toDate,
        };
      }
      const year = new Date(queryForm.fromDate).getFullYear() + 2;
      const date = new Date(queryForm.fromDate.replace(/\w{4}/, year)).getTime();
      if (new Date(queryForm.toDate).getTime() <= date) {
        this.$emit('queryList', { ...queryForm });
      } else {
        this.$message.warning('请选择时间范围不超过24个月');
      }
    },
  },
};
</script>

<style>
</style>
