<template>
  <!-- 储罐 -->
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

      <el-form-item label="储罐名称：">
        <el-input
          v-model="queryForm.tankStorageName"
          clearable
          style="width:180px"
          placeholder="请输入储罐名称"
          @keyup.enter.native="onQueryList()"></el-input>
      </el-form-item>

      <el-form-item label="CAS编号：">
        <el-input
          v-model="queryForm.casCode"
          clearable
          style="width:180px"
          placeholder="请输入CAS编号"
          @keyup.enter.native="onQueryList()"></el-input>
      </el-form-item>

      <el-form-item label="储罐类型：">
        <el-select
          multiple
          collapse-tags
          style="width:180px;"
          v-model="queryForm.tankTypeList"
          clearable
        >
          <el-option
            v-for="(item, index) in dict.TankType"
            :key="index"
            :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
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
      <el-table-column property="tankStorageName" label="储罐名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="casCode" label="CAS编号" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankFarmName" label="所在罐区" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankType" label="储罐类型" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ getFieldTypeName(scope.row.tankType) }}
        </template>
      </el-table-column>
      <el-table-column property="tankMaxTemp" label="最大温度" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankMaxPress" label="最大压强" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankMaxStorage" label="最大储存量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="tankSingleVolume" min-width="180" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span :scope="scope">单个存储罐容积（m<sup>2</sup>）</span>
        </template>
      </el-table-column>
    </el-table>

    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-form ref="dialogform" :dictParent="dict" @query="getItemList" />
  </el-card>
</template>

<script>
import { queryListEnt, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'PSPlantBuildInfo',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'bas/psTankInfo/query',
      deleteUrl: 'bas/psTankInfo',
      isAuto: false,              // 是否自动调取查询接口 -- 来自queryList混合的created
      downloading: false,         // 下载按钮状态加载
      queryForm: {                // 查询条件
        // psId: '',              // 该字段废弃
        psName: '',               // 企业名称
        tankStorageName: '',      // 储罐名称
        casCode: '',              // cas编号
        tankTypeList: [],         // 储罐类型
      },
      dict: {                     // 常量
        TankType: [],             // 储罐类型
      },
      itemList: [],               // 表格列表
    };
  },
  created() {
    this.getDictList();
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
    getDictList() {          // 获取常量接口
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE_URL', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
    getItemList() {          // 获取记录列表
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows, sort: 'psName-,tankStorageName' },
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
    onDownload() {           // 下载数据
      this.downloading = true;
      this.$http.post(`${this.deleteUrl}/export`, this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        const filename = `储罐${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },

    /** 特殊方法 */
    getFieldTypeName(val) {
      if (!val && val !== 0) {
        return '--';
      }
      const type = this.dict.TankType.filter(item => item.rowGuid === val)[0] || {};
      return type.dictName || '--';
    },
  },
};
</script>
