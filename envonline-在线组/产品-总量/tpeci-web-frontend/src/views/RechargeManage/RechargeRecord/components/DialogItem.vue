<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="small"
    scrollbar
    :view="true"
    title="充值详情"
    @close="closeDialog"
  >

    <!-- 操作按钮 -->
    <!-- <div class="mar-b-xs" v-if="isShow">
      <el-button type="primary" icon="fas fa-cart-plus" @click="onClickPay">充 值</el-button>
    </div> -->

    <!-- 列表 -->
    <!--
      :height="isShow ? 'calc(100% - 65px)' : 'calc(100% - 31px)'"
     -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 31px)"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="96" v-if="isShow">
        <template slot-scope="{ row }">
          <template v-if="row.depositStatusString === '充值失败' && row.depositTypeString === '远程充值'">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickPay(row, 3)">充 值</el-button>
          </template>
          <template v-else-if="row.depositStatusString === '充值中'">
            <el-dropdown split-button type="primary">更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="primary" icon="fas fa-pencil-alt" title="修改充值状态为成功"
                    @click="onClickPay(row, row.depositTypeString === '远程充值' ? 1 : 4)">充值成功</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="warning" icon="fas fa-pencil-alt" title="修改充值状态为失败"
                    @click="onClickPay(row, row.depositTypeString === '远程充值' ? 2 : 5)">充值失败</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else-if="row.depositStatusString === '充值成功' || row.depositTypeString === 'IC卡充值'">
            <i class="fas fa-ban"></i>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" prop="createDate" min-width="155" show-overflow-tooltip></el-table-column>
      <el-table-column label="起止日期" min-width="185" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ `${row.beginTime ? row.beginTime.split(' ')[0] : '-'} - ${row.endTime ? row.endTime.split(' ')[0] : '-'}` }}
        </template>
      </el-table-column>
      <el-table-column label="充值量" prop="depositData" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="充值方式" prop="depositTypeString" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="充值状态" prop="depositStatusString" min-width="90" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      isAuto: false,
      isShow: true,
      url: 'tpeci/iCCardDepositRecord/recordDetail',  // 必须, 接口地址
      loading: false,
      queryForm: {
        depositYear: '',        // 充值年份
        portId: '',             // 排口id
        sort: 'createDate-',
      },
      itemList: [],           // 表格绑定数据
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  methods: {
    openDialog(row) {               // 打开对话框
      if (this.userType === 'ent') {
        this.isShow = false;
      }
      this.queryForm.portId = row.portId;
      this.queryForm.depositYear = row.depositYear;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {                 // 关闭对话框
      this.itemList = [];
      this.queryForm = {
        depositYear: '',
        portId: '',
        sort: 'createDate-',
      };
    },
    onClickPay(row, n) {            // 充值
      this.loading = true;
      this.$http.get('tpeci/iCCardDepositRecord/depositManage', {
        params: {
          id: row.id,    // 因为有ic卡充值和远程充值，后统一改为传主键id
          depositManage: n,
        },
      }).then((response) => {
        if (response.data.success) {
          this.getItemList();
        } else {
          this.loading = false;
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        this.loading = false;
        analyzeResp(response);
      });
    },
  },
};
</script>
