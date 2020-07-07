<template>
  <!-- 开阀时段设置 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>

        <el-form-item label="关键字：">
          <el-input
            v-model="queryForm.key"
            clearable
            placeholder="请输入企业名称、站点名称"
            style="width:220px"
            @keyup.enter.native="onQueryList()"
          ></el-input>
        </el-form-item>

        <el-form-item label="时间：">
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

        <el-form-item label="执行周期：" prop="execCycle">
          <el-select v-model="queryForm.execCycle" style="width: 90px;">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, index) in $enum.get('TIME_EXECCYCLE')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用：" prop="status">
          <el-select v-model="queryForm.status" style="width: 90px;">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, index) in $enum.get('TIME_STATUS')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="下发状态：" prop="execStatus">
          <el-select v-model="queryForm.execStatus" style="width: 160px;">
            <el-option :value="''" label="全部"></el-option>
            <el-option
              v-for="(item, index) in $enum.get('TIME_EXECSTATUS')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>

      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem(deleCallback)">删 除
      </el-button>
      <el-button
        type="success"
        icon="fas fa-sync-alt"
        v-loading="qloading"
        :disabled="!selectedIds.length"
        @click="onClickSend">下发启用命令
      </el-button>
      <el-button
        type="danger"
        icon="fas fa-ban"
        v-loading="sloading"
        :disabled="!selectedIds.length"
        @click="onClickStop">下发停用命令
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 71px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="105">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickRecord(scope.row)">开关阀记录</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="开阀时间" prop="beginTime" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <!-- {{ +row.execCycle === 2 ? `${row.beginTime.split('-')[1]}日` : row.beginTime }} -->
          {{ row | getBeginTime }}
        </template>
      </el-table-column>
      <el-table-column label="关阀时间" prop="endTime" min-width="100" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <!-- {{ +row.execCycle === 2 ? `${row.endTime.split('-')[1]}日` : row.endTime }} -->
          {{ row | getEndTime }}
        </template>
      </el-table-column>
      <el-table-column label="执行周期" prop="execCycle" min-width="90" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.getLabel('TIME_EXECCYCLE', +row.execCycle) }}
        </template>
      </el-table-column>
      <el-table-column label="是否启用" prop="status" min-width="90" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.getLabel('TIME_STATUS', +row.status, '--') }}
        </template>
      </el-table-column>
      <el-table-column label="命令下发状态" prop="execStatus" min-width="130" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.getLabel('TIME_EXECSTATUS', +row.execStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" min-width="160" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-item ref="dialogItem" @query="getItemList"/>
    <dialog-form ref="dialogForm" @query="getItemList"/>
  </el-card>
</template>

<script>
import DialogForm from './components/DialogForm';
import DialogItem from './components/DialogItem';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
// import { getDay } from '@/libs/tools';

export default {
  name: 'OpenValveTimeSet',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    DialogItem,
  },
  data() {
    return {
      url: 'tpeci/valveOpenPlan',
      isAuto: false,
      loading: false,
      qloading: false,
      sloading: false,
      queryForm: {       // 检索表单项
        key: '',         // 企业名称，站点名称
        fromDate: '',    // 开始时间
        toDate: '',      // 结束时间
        status: '',      // 是否启用
        execCycle: '',   // 执行周期
        execStatus: '',  // 命令下发状态
        sort: 'psName+,portName',
      },
      itemList: [],
    };
  },
  filters: {
    getBeginTime(row) {           // 获取开阀时间
      const execCycle = +row.execCycle;
      if (execCycle === 1) {
        return row.beginTime;
      }
      if (execCycle === 2) {
        // return `${row.beginTime.split('-')[1]}日`;
        return `${row.beginTime}日`;
      }
      if (execCycle === 3) {
        return `${row.beginTime}月`;
      }
      return '';
    },
    getEndTime(row) {             // 获取关阀时间
      const execCycle = +row.execCycle;
      if (execCycle === 1) {
        return row.endTime;
      }
      if (execCycle === 2) {
        // return `${row.endTime.split('-')[1]}日`;
        return `${row.endTime}日`;
      }
      if (execCycle === 3) {
        return `${row.endTime}月`;
      }
      return '';
    },
  },
  created() {
    // this.queryForm.fromDate = `${getDay(-1, false, false)} 00:00:00`;
    // this.queryForm.toDate = `${getDay(0, false, false)} 23:59:59`;
    this.onQueryList();
  },
  methods: {
    onClickAdd() {                // 新增按钮
      this.$refs.dialogForm.openDialog();
    },
    onClickSend() {               // 下发启动命令
      // if (this.selectedIds.filter(v => +(v.status) === 1).length) {
      //   this.$message({
      //     type: 'warning',
      //     showClose: true,
      //     duration: 3000,
      //     message: '所选计划中包含已启用的计划，已启用的计划不能重复下发启用命令',
      //   });
      //   return;
      // }
      this.qloading = false;
      this.$http.post('tpeci/valveOpenPlan/sendCommand', {
        ids: this.selectedIds,
        status: 1,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.getItemList();
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
        this.qloading = false;
      });
    },
    onClickStop() {               // 下发停用命令
      // if (this.selectedIds.filter(v => +(v.status) === 0).length) {
      //   this.$message({
      //     type: 'warning',
      //     showClose: true,
      //     duration: 3000,
      //     message: '所选计划中包含已停用的计划，已停用的计划不能重复下发停用命令',
      //   });
      //   return;
      // }
      this.sloading = false;
      this.$http.post('tpeci/valveOpenPlan/sendCommand', {
        ids: this.selectedIds,
        status: 0,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.getItemList();
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
        this.sloading = false;
      });
    },
    onClickRecord(row) {          // 开关阀记录
      this.$refs.dialogItem.openDialog(row);
    },

    /** 特殊方法 */
    deleCallback() {              // 删除回调
      this.getItemList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
