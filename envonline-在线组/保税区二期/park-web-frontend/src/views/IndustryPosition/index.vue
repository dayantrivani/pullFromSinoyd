<template>
  <!-- 产业定位 -->
  <div class="block">
    <div class="block-top">
      <upload-picture objectId="000003" />
    </div>
    <div class="block-bottom">
      <!-- 表单 -->
      <el-form inline class="mar-x-sm mar-t-xs">
        <el-form-item label="园区现有企业产业类型：">
          <el-input v-model="queryForm.key" clearable style="width:180px" @keyup.enter.native="onQueryList"></el-input>
        </el-form-item>

        <el-form-item label="产业类型：">
          <el-select v-model="queryForm.type">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="(item, index) in $enum.get('INDUSTRY_TYPE')" :key="index" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮组 -->
      <div class="mar-b-xs mar-l-xs">
        <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
        <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
        </el-button>
      </div>

      <el-table border highlight-current-row height="calc(100% - 102px)" v-loading="loading" :data="itemList"
        @selection-change="onChangeSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column label="操作" align="center" width="76">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row)">编 辑</el-button>
          </template>
        </el-table-column>
        <el-table-column label="产业类型名称" prop="industryName" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否主导产业" prop="isLeadingIndustry" min-width="160" show-overflow-tooltip>
          <template v-slot="{ row }">{{ row.isLeadingIndustry ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column label="是否负面清单产业" prop="isNegativeIistIndustry" min-width="160" show-overflow-tooltip>
          <template v-slot="{ row }">{{ row.isNegativeIistIndustry ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column label="企业数量" prop="psCount" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="getPsName(scope.row)">{{scope.row.psCount}}</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="160" show-overflow-tooltip></el-table-column>
      </el-table>

      <!-- 分页内容 -->
      <paging-query :pager="pager" @query="getItemList"></paging-query>

      <dialog-form ref="dialogform" :dictParent="dict" @query="getItemList" />
      <ps-dialog ref="psDialog" :psList="psList" />
    </div>
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm';
import PsDialog from './components/PsDialog';

export default {
  name: 'IndustryPosition',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    PsDialog,
  },
  data() {
    return {
      url: 'bas/parkIndustryPosition', // 请求地址
      isAuto: false,      // 是否触发混合
      queryForm: {
        key: '',         // 园区现有企业产业类型
        type: -1,        // 产业类型
        // isNegativeIistIndustry: '',
      },
      dict: {             // 常量
      },
      itemList: [],       // 列表数据
      psList: [],         // 企业列表
      loading: false,     // 加载状态
    };
  },
  created() {
    this.getItemList();
    this.getPSIdList();
  },
  methods: {
    getItemList() {   // 获取列表数据
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: {
          page,
          rows,
          sort: 'createDate-',
          ...this.queryForm,
          isNegativeIistIndustry: this.queryForm.type === 0 ? 1 : '',
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data || [];
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
    getPSIdList() {            // 获取企业列表
      this.loading = true;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1,
          rows: 100000,
          psType: -1,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psList = response.data.data || [];
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
    onClickEdit(row) {   // 编辑
      this.$refs.dialogform.openDialog(row);
    },
    onClickAdd() {    // 单击新增回调
      this.$refs.dialogform.openDialog();
    },
    getPsName(row) {
      this.$refs.psDialog.openDialog(row);
    },
    /* 特殊方法 */
  },
};
</script>

<style lang="scss" scoped>
.block {
  width: 100%;
  height: 100%;
  > .block-top {
    width: 100%;
    height: 50%;
    background-color: #fff;
  }
  > .block-bottom {
    width: 100%;
    height: calc(50% - 10px);
    margin-top: 10px;
    background-color: #fff;
    overflow: hidden;
  }
}
</style>
