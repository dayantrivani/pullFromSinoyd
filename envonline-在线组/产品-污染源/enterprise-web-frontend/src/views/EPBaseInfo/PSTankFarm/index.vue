<template>
  <!-- 储罐区 -->
  <el-card>
    <el-form class="mar-x-sm mar-t-xs" inline>

      <el-form-item label="企业名称：">
        <el-input
          v-model="queryForm.psName"
          clearable
          style="width:180px"
          placeholder="请输入企业名称"
          @keyup.enter.native="onQueryList()"></el-input>
      </el-form-item>

      <el-form-item label="储罐区名称：">
        <el-input
          v-model="queryForm.tankFarmName"
          clearable
          style="width:180px"
          placeholder="请输入储罐区名称"
          @keyup.enter.native="onQueryList()"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="fas fa-download"
          :loading="downloading"
          @click="onDownload"
        >导 出</el-button>
      </el-form-item>

    </el-form>

    <hr/>

    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
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
      <el-table-column property="psName" label="企业名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankFarmName" label="储罐区名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="longitude" label="经度" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="latitude" label="纬度" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankFarmArea" min-width="125" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span :scope="scope">占地面积（m<sup>2</sup>）</span>
        </template>
      </el-table-column>
    </el-table>

    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-form ref="dialogform" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'PSTankFarm',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/psTankFarm',
      isAuto: false,              // 是否自动调取查询接口 -- 来自queryList混合的created
      downloading: false,         // 下载按钮状态加载
      queryForm: {                // 查询条件
        psName: '',               // 企业名称
        tankFarmName: '',         // 储罐区名称
        sort: 'regionName-,psName-,tankFarmName',  // 排序
      },
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
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export`, this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `储罐区${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>
