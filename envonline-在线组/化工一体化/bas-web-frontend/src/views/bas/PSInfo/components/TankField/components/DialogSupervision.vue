<template>
  <dialog-modal
    scrollbar
    ref="dialogsupervision"
    size="middle"
    title="摄像头信息"
    @close="closeDialog"
  >
    <!-- 操作按钮 -->
    <div class="mar-b-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(86vh - 115px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @select="onChangeCheck"
      @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="tfName" label="罐区名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="videoDeviceName" label="摄像头名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="videoDeviceCode" label="摄像头编码" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <!-- 新增编辑弹出框 -->
    <supervision-form ref="supervisionform" :keyid="keyid" :cutid="cutid" :psnames="psnames" :tfname="tfname"
      @query="getItemList"></supervision-form>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import SupervisionForm from './SupervisionForm';

export default {
  // 使用混合
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    SupervisionForm,
  },
  data() {
    return {
      url: 'keypoints/tankFarmCameraInfo',        // 接口地址
      itemList: [],                               // 列表数据源
      queryForm: {
        videoDeviceCode: '',
        videoDeviceName: '',
        tankFarmId: '',
      },
      keyid: '',
      cutid: '',
      psnames: '',
      tfname: '',
      kid: '',
    };
  },
  created() {
    // this.getItemList();
  },
  methods: {
    // 新增按钮
    onClickAdd() {
      this.$refs.supervisionform.openDialog();
    },
    // 编辑按钮
    onClickEdit(row) {
      this.$refs.supervisionform.openDialog(row);
    },
    // 打开对话框
    openDialog(row) {
      this.kid = row.id;
      this.keyid = row.id;
      this.cutid = row.psId;
      this.psnames = row.psName;
      this.tfname = row.tfName;
      this.getItemList();
      this.$refs.dialogsupervision.openDialog(row);
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialogsupervision.closeDialog();
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.queryForm.tankFarmId = this.kid;
      this.$http.post('keypoints/tankFarmCameraInfo/find', this.queryForm, {
        params: {
          page,
          rows,
          sort: 'videoDeviceName',
        },
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
  },
};
</script>

<style lang="sass" scoped>

</style>
