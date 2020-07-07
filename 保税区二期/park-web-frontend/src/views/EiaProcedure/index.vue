<template>
  <!-- 环评手续执行情况 -->
  <el-card>
    <el-form class="mar-x-sm mar-t-xs" inline>

      <el-form-item label="规划名称：">
        <el-input
          v-model="queryForm.key"
          clearable
          style="width:180px"
          @keyup.enter.native="onQueryList()"></el-input>
      </el-form-item>

      <el-form-item label="规划时间：">
        <el-date-picker
          style="width:135px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :clearable="true"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:135px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 23:59:59"
          :clearable="true"
          :editable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>

    </el-form>

    <hr/>

    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem(deleCallback)">删 除
      </el-button>
    </div>

    <el-table
      border
      highlight-current-row
      :height="`calc(100% - 71px)`"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="planningName" label="规划名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="planningTime" label="规划时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="contactName" label="负责人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="contactPhone" label="联系电话" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="remark" label="备注" min-width="180" show-overflow-tooltip></el-table-column>
    </el-table>

    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-form ref="dialogform" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'EiaProcedure',
  mixins: [                   // 混合
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/parkPlanningImplSituation',
      isAuto: false,              // 是否自动调取查询接口 -- 来自queryList混合的created
      downloading: false,         // 下载按钮状态加载
      queryForm: {                // 查询条件
        // psId: '',              // 该字段废弃
        key: '',
        fromDate: '',
        toDate: '',
      },
      // dict: {                     // 常量
      // },
      itemList: [],               // 表格列表
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    onClickAdd() {           // 单击新增回调
      this.$refs.dialogform.openDialog();
    },
    onClickEdit(row) {       // 单击编辑回调
      this.$refs.dialogform.openDialog(row);
    },

    /** 请求层 */
    getItemList() {          // 获取记录列表
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          sort: 'planningTime-',
          ...this.queryForm,
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

    /** 特殊方法 */
    deleCallback() {
      this.getItemList();
    },
    // getDictList() {          // 获取常量接口
    //   Object.keys(this.dict).forEach((key) => {
    //     this.$store.dispatch('dict/GET_SELECT_TYPE_URL', key).then((val) => {
    //       this.dict[key] = val;
    //     });
    //   });
    // },
    // onDownload() {           // 下载数据
    //   this.downloading = true;
    //   this.$http.post(`${this.deleteUrl}/export`, this.queryForm, {
    //     'responseType': 'blob',
    //   }).then((response) => {
    //     const filename = `储罐${new Date().toLocaleDateString()}.xls`;
    //     this.$tools.downloadFile(response, filename);
    //   }, ({ response }) => {
    //     analyzeResp(response);
    //   }).finally(() => {
    //     this.downloading = false;
    //   });
    // },
  },
};
</script>
