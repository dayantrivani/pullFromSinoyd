<template>
  <!-- 一个站点配置一个方案 -->
  <dialog-modal type="title" ref="dialog" size="small"
    scrollbar :view="true" title="站点配置方案" @close="closeDialog">
    <el-form :model="queryForm" inline>

      <el-form-item label="配置方案名称：">
        <el-input
          v-model="queryForm.schemeName"
          clearable
          style="width:180px"
          @keyup.enter.native="onQueryList()">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>

    </el-form>
    <!-- 列表 -->
    <el-table border highlight-current-row height="calc(100% - 65px)"
      v-loading="loading" :data="itemList" @selection-change="onChangeSelected"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-check" @click="onClickCheck(scope.row)">确认</el-button>
        </template>
      </el-table-column>
      <el-table-column label="配置方案名称" prop="schemeName" min-width="150" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';

export default {
  mixins: [queryList],
  data() {
    return {
      url: 'tpeci/valveScheme',
      isAuto: false,
      queryForm: {
        schemeName: '',       // 配置方案名称
        sort: 'schemeName',
      },
      itemList: [],              // 表格绑定数据
      bindScheme: [],            // 站点绑定方案
    };
  },
  methods: {
    openDialog(row) {           // 打开对话框
      this.row = _.cloneDeep(row);
      this.$refs.dialog.openDialog();
      this.onQueryList();
    },
    onClickCheck(val) {         // 确认按钮
      this.isBindScheme(val);
    },
    closeDialog() {             // 关闭对话框
      this.itemList = [];
      this.queryForm = {
        schemeName: '',
        sort: 'schemeName',
      };
      this.bindScheme = [];
    },

    /* 接口层 */
    isBindScheme(val) {         // 是否配置了方案
      this.$http.post('tpeci/valveScheme2Port/portDispose/1', {
        schemeId: val.id,
        valveScheme2PortList: [{
          regionCodeId: this.row.regionCodeId,
          regionName: this.row.regionName,
          psId: this.row.psId,
          psName: this.row.psName,
          portId: this.row.portId,
          portName: this.row.portName,
          schemeId: val.id,
          isSend: this.row.isSend,
        }],
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.bindScheme = response.data.data || [];
          // const msg = this.bindScheme.map(item => item.portName).join(',');
          if (this.bindScheme.length) {
            this.$confirm('站点已经绑定了方案,是否更换此新方案?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.updateBindScheme(val);
            });
          } else {
            this.updateBindScheme(val);
          }
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
    updateBindScheme(val) {     // 更新绑定方案
      this.$http.post('tpeci/valveScheme2Port/portDispose/0', {
        schemeId: val.id,
        valveScheme2PortList: [{
          regionCodeId: this.row.regionCodeId,
          regionName: this.row.regionName,
          psId: this.row.psId,
          psName: this.row.psName,
          portId: this.row.portId,
          portName: this.row.portName,
          schemeId: val.id,
          isSend: this.row.isSend,
        }],
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$emit('query');
          this.$refs.dialog.closeDialog();
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
