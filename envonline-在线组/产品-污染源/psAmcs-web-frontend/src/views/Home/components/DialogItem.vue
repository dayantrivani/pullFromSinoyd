<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="small"
    scrollbar
    :view="true"
    title="离线数据"
    @close="closeDialog"
  >
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 33px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="污染源" prop="psName" min-width="175" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点" prop="portName" min-width="135" show-overflow-tooltip></el-table-column>
      <el-table-column label="离线时间" prop="tstamp" min-width="151" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="remark" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- <paging-query :pager="pager" @query="getItemList"></paging-query> -->
  </dialog-modal>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      isAuto: false,
      url: 'amcs/homePage/',  // 必须, 接口地址
      itemList: [],           // 表格绑定数据
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  methods: {
    // 打开对话框
    openDialog() {
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    /* 请求接口 */
    getItemList() { // 获取列表数据
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, this.queryForm, {
        params: { page, rows, portType: this.amcsType },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.itemList.map((n) => {
            n.tstamp = n.tstamp.includes('1900') ? '' : n.tstamp;
            return n;
          });
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
