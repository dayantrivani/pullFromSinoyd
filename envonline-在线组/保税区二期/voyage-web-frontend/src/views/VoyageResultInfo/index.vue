<template>
  <!-- 异常管理 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="走航起止时间：">
          <el-date-picker
            style="width:135px"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width:135px"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 23:59:59"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="企业名称：">
          <el-input
            v-model="queryForm.psName"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()">
          </el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select style="width:90px;" v-model="queryForm.status">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, key) in $enum.get('DEAL_STATUS')"
              :key="key"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-pencil-alt"
        :disabled="!selectedIds.length"
        @click="onClickAllEdit">批量处理
      </el-button>
      <!-- <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button> -->
    </div>
    <div style="height: calc(100% - 38px)">
      <el-row :gutter="10" class="fill-h" v-resize>
        <el-col :span="12">
          <!-- 列表 -->
          <el-table
            border
            highlight-current-row
            height="calc(100% - 31px)"
            v-loading="loading"
            :data="itemList"
            @row-dblclick="onRowDblclick"
            @selection-change="onChangeSelected"
          >
            <el-table-column align="center" type="selection" width="37"></el-table-column>
            <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
            <el-table-column label="操作" align="center" width="117">
              <template slot-scope="scope">
                <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">处理记录</el-button>
              </template>
            </el-table-column>
            <el-table-column label="走航时间" prop="voyageDate" min-width="154" show-overflow-tooltip></el-table-column>
            <el-table-column label="企业名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
            <el-table-column label="处理状态" min-width="90" show-overflow-tooltip>
              <template slot-scope="{ row }">
                {{$enum.getLabel('DEAL_STATUS', row.status)}}
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页内容 -->
          <paging-query :pager="pager" @query="getItemList"></paging-query>
        </el-col>
        <el-col :span="12">
          <el-table
            border
            highlight-current-row
            height="100%"
            v-loading="rloading"
            :data="itemAttachList"
          >
            <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
            <el-table-column label="超标特征污染物" prop="factorName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" property="factorValue" min-width="160" show-overflow-tooltip>
              <template slot="header">
                <p>污染物浓度</p>
              </template>
              <template slot-scope="{ row }">
                {{ row.factorValue !== '' ? `${row.factorValue}${row.unit ? `（${row.unit}）` : ''}` : row.factorValue }}
              </template>
            </el-table-column>
            <el-table-column align="center" property="alertUpper" min-width="160" show-overflow-tooltip>
              <template slot="header">
                <p>标准限值</p>
              </template>
              <template slot-scope="{ row }">
                {{ row.alertUpper !== '' ? `${row.alertUpper}${row.alertUpperUnit ? `（${row.alertUpperUnit}）` : ''}` : row.alertUpper }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>

    <dialog-form ref="dialog" @query="getItemList"/>
    <dialog-deal ref="dealdialog" @query="getItemList"/>
  </el-card>
</template>

<script>
import { getDay } from '@/libs/tools.js';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import DialogDeal from './components/DialogDeal';

export default {
  name: 'VoyageResultInfo',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    DialogDeal,
  },
  data() {
    return {
      url: 'voyage/resultInfo',
      isAuto: false,
      loading: false,
      rloading: false,
      queryForm: {                  // 检索表单项
        fromDate: getDay(-2, true, false),               // 任务起止时间
        toDate: getDay(0, true, true),
        psName: '',                 // 企业名称
        status: '',                 // 状态 1 已处理 0 未处理
        sort: 'voyageDate-,psName+',
      },
      itemList: [],                // 左侧列表
      itemAttachList: [],          // 右侧列表
    };
  },
  created() {
    this.onQueryList();
  },
  methods: {
    onClickAllEdit() {              // 批量处理
      if (!this.selectedIds.length) {
        return;
      }
      const ids = this.selectedIds;
      const data = this.itemList[0];
      // row.ids = ids;
      const row = {
        ids,
        status: 0,
        dealContent: '',
        dealDate: '',
        dealUserId: data.dealUserId,
        dealUserName: data.dealUserName,
      };
      this.$refs.dealdialog.openDialog(row);
    },
    onClickEdit(row) {              // 处理记录按钮
      this.$refs.dialog.openDialog(row);
    },

    /* 接口请求 */
    getItemList() {
      const st = new Date(this.queryForm.fromDate.replace(/-/g, '/')).getTime();
      const et = new Date(this.queryForm.toDate.replace(/-/g, '/')).getTime();
      if (st > et) {
        this.$message({
          type: 'warning',
          message: '走航起始时间大于结束时间',
          showClose: true,
          duration: 3000,
        });
        return;
      }
      this.itemAttachList = [];
      this.loading = true;
      this.selectedIds = [];  // 触发查询时取消勾选高亮
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
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onRowDblclick(row) {           // 双击行
      this.itemAttachList = [];
      const { voyageId, psId } = row;
      this.rloading = true;
      this.$http.get('voyage/resultDetail', {
        params: {
          page: 1,
          rows: 1000000,
          sort: 'psName+,factorName+',
          voyageId,
          psId,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemAttachList = response.data.data || [];
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
        this.rloading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
