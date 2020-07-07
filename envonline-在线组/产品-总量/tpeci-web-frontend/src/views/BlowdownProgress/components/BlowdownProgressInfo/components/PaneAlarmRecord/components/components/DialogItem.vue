<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="small"
    scrollbar
    title="历史记录"
    @close="closeDialog"
  >
    <div class="mar-l-xs mar-b-xs">
      <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit">更新信息</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        v-if="user === 'gov'"
        @click="onDeleteItem(deleCallback)">删 除
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(70vh - 117px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" v-if="user === 'gov'"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="处理日期" prop="dealDate" min-width="175" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理人员" prop="dealUserName" min-width="135" show-overflow-tooltip></el-table-column>
      <el-table-column label="处置说明" prop="dealContext" min-width="151" show-overflow-tooltip></el-table-column>
      <el-table-column property="portName" label="详情记录" min-width="90" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-button type="text" @click="onClickLink(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-form
      ref="dialogform"
      title="基本信息"
      :dealDis="true"
      :noEdit="noEdit"
      @getItemList="getItemList"
    />
  </dialog-modal>
</template>

<script>
// import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './DialogForm';

export default {
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  data() {
    return {
      isAuto: false,
      url: 'alarm/AlarmRecordDealDetail',  // 必须, 接口地址
      itemList: [],                        // 表格绑定数据
      systemItem: {},                      // 报警列表数据
      noEdit: true,                        // 判断打开表单是否不能被编辑
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    openDialog(row) {              // 打开对话框
      this.systemItem = Object.assign({}, row);
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    onChangeSelected(option) {     // 选择项改变时触发
      this.selectedIds = option.map(val => val.id);
    },
    onClickEdit() {               // 点击编辑按钮
      this.noEdit = false;
      this.$refs.dialogform.openDialog(this.systemItem, 'id');
    },
    closeDialog() {               // 关闭对话框
      this.itemList = [];
      this.selectedIds = [];
      this.systemItem = {};
      this.noEdit = true;
    },

    /* 请求接口 */
    onClickLink(row) {            // 打开详情页面
      this.noEdit = true;
      this.$refs.dialogform.openDialog(row, 'alarmId');
    },
    getItemList() {               // 获取列表数据
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, alarmId: this.systemItem.id },
      }).then((response) => {
        if (response.data.success) {
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

    /** 特殊方法 */
    deleCallback() {              // 删除回调
      this.getItemList();
    },
  },
};
</script>
