<template>
  <div class="fill-h">
    <div class="pad-x-scope pad-b-scope">
      <el-button
        plain
        type="primary"
        size="medium"
        class="fill-w"
        @click="onEdit()"
      >新增报告</el-button>
    </div>
    <scrollbar v-loading="loading" height="calc(100% - 47px)">
      <div class="pad-x-scope">
        <card-report
          v-for="item in itemList"
          :key="item.id"
          show-btn
          :data="item"
          @edit="onEdit"
          @submit="onSubmit"
          @remove="onRemove"
        />
      </div>
    </scrollbar>
    <form-report ref="formReport" :row="row" @query="getItemList()" />
  </div>
</template>

<script>
import CardReport from './CardReport';
import FormReport from './FormReport';
import { getReportList, removeReport } from '../request';

export default {
  components: {
    CardReport,
    FormReport,
  },
  data() {
    return {
      loading: false,
      row: {},
      itemList: [],
    };
  },
  methods: {
    init(row) {
      this.row = row || {};
      if (row) {
        this.getItemList();
      } else {
        this.itemList = [];
      }
    },
    getItemList() {
      this.loading = true;
      getReportList(this.row.id)
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            this.itemList = data || [];
            this.$emit('update-row', this.row);
          } else {
            this.$message.warning(msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onEdit(data) {
      this.$refs.formReport.open(data);
    },
    onSubmit() {},
    onRemove({ id, code }) {
      this.$confirm(`将删除 <strong>${code}</strong> 数据, 是否继续?`, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        removeReport(id)
      )).then((response) => {
        const { success, msg } = response.data;
        this.$message[success ? 'success' : 'warning'](msg);
        if (success) {
          this.getItemList();
        }
      });
    },
  },
};
</script>
