<template>
  <!-- 排污因子配置 -->
  <dialog-modal ref="dialog" size="middle" title="排污因子配置" :append-to-body="true" @close="closeDialog">

    <!-- 头部 -->
    <div class="mar-l-xs mar-b-xs" v-if="isShow">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <!-- <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button> -->
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="loading"
      border
      :data="itemList"
      :height="isShow ? 'calc(86vh - 114px)' : 'calc(86vh - 80px)'"
      highlight-current-row>
      <el-table-column align="center" label="No." width="45" type="index" :index="index"></el-table-column>
      <!-- <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="success" icon="fas fa-check" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
      <el-table-column prop="factorName" label="许可因子" min-width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="permittedEmissions" label="许可排放量" min-width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="unit" label="单位" min-width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="160" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-form ref="factor" :permitId="queryForm.permitId" @query="getItemList"/>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
// import _ from 'lodash';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './DialogForm';

export default {
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/pollutantDischargePermitFactors',
      isAuto: false,
      isShow: true,
      queryForm: {              // 查询条件
        permitId: '',           // 许可证id
        permitCode: '',         // 许可证编码
        sort: 'factorName',
      },
      itemList: [],             // 列表数据
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.isShow = false;
      this.$set(this.queryForm, 'psId', this.orgGuid);
    }
  },
  methods: {
    openDialog(row) {           // 打开弹窗
      this.queryForm.permitId = row.id || '';
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    onClickAdd() {              // 新增按钮
      this.$refs.factor.openDialog();
    },
    // onClickEdit(row) {          // 编辑按钮
    //   this.$refs.factor.openDialog(row);
    // },
    /** 接口层 */
    getItemList() {             // 查询按钮
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
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
        this.loading = false;
      });
    },

    /* 特殊方法 */
    closeDialog() {             // 关闭弹框
      this.itemList = [];
      this.selectedIds = [];
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
