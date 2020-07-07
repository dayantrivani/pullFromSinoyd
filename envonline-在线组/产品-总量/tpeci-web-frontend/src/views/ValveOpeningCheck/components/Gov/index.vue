<template>
  <!-- 批量开关阀 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="关键字：">
          <el-input
            placeholder="企业名称、站点名称"
            v-model="queryForm.key"
            clearable
            style="width:180px"
            @keyup.enter.native="onQueryList()"></el-input>
        </el-form-item>

        <el-form-item label="申报时间：">
          <el-date-picker
            style="width:135px"
            v-model="queryForm.fromDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>&nbsp;~
          <el-date-picker
            style="width:135px"
            v-model="queryForm.toDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :editable="false"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="申报状态：">
          <el-select style="width:90px;" v-model="queryForm.status">
            <el-option value="" label="所有"></el-option>
            <el-option
              v-for="item in $enum.get('VALVE_CHECK_STATUS')"
              :key="item.value"
              v-show="[1, 2].includes(item.value)"
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
        type="warning"
        icon="el-icon-document-copy"
        :disabled="!selectedIds.length"
        @click="onClickEdit(selectedIds)"
      >批量审核
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 72px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-file-invoice"
            :disabled="+scope.row.status === 2"
            @click="onClickEdit([scope.row.id])">审核</el-button>
          <el-button
            type="primary"
            icon="fas fa-link"
            @click="onClickDoc(scope.row)">附件</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="关阀记录" prop="closeRecord" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="申报时间" prop="applyTime" min-width="145" show-overflow-tooltip></el-table-column>
      <el-table-column label="申报人" prop="applicantName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="申报原因" prop="applyReason" min-width="145" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="status" min-width="145" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('VALVE_CHECK_STATUS', +row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="处理意见" prop="dealRemark" min-width="145" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理时间" prop="dealTime" min-width="145" show-overflow-tooltip></el-table-column>
      <el-table-column label="当前阀门状态" prop="currentStatus" min-width="145" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <dialog-form ref="dialog" @query="getItemList"></dialog-form>
    <upload-dialog ref="upload" :isShow="isShow"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import UploadDialog from '@/components/UploadDialog';
import dialogForm from './components/DialogForm';
import { getDay } from '@/libs/tools';

export default {
  name: 'ValveOpeningCheckEnt',
  mixins: [queryList],
  components: {
    dialogForm,
    UploadDialog,
  },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      url: 'tpeci/valveOpenApply',
      // isAuto: false,
      loading: false,
      isShow: true, // 是否显示上传按钮
      queryForm: {                  // 检索表单项
        psId,
        fromDate: getDay(-7, false, false),  // 开始时间
        toDate: getDay(0, false, false),     // 结束时间
        key: '',
        status: '',                 // 0保存中、1申报中、2已审核、3已退回，空返回全部
        isManagement: true,
        sort: 'applyTime-',
      },
      itemList: [],
    };
  },
  methods: {
    onClickEdit(ids) {              // 审核按钮
      this.$refs.dialog.openDialog(ids);
    },
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    onClickDoc(row) {               // 附件上传
      this.isShow = +row.status !== 2;
      this.$refs.upload.openDialog(row);
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data.filter(n => [1, 2].includes(n.status));
          this.itemList.forEach((e) => {
            if (e.dealTime && e.dealTime.includes('1753')) e.dealTime = '';
          });
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

<style lang="scss" scoped>
</style>
