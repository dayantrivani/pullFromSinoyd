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

        <el-form-item label="阀门状态：">
          <el-select style="width:90px;" v-model="queryForm.valveStatus">
            <el-option label="全部" :value="''"></el-option>
            <el-option
              v-for="(item,index) in $enum.get('VALVE_STATUS')"
              :key="index"
              v-show="item.value !== 5"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>

      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" style="position: relative">
      <el-button
        type="primary"
        icon="fas fa-life-ring"
        :disabled="!selectedIds.length"
        @click="onDeleteItem('3810')">应急开阀</el-button>
      <el-button
        type="primary"
        icon="fas fa-power-off"
        :disabled="!selectedIds.length"
        @click="onDeleteItem('3811')">应急关阀</el-button>
      <el-button
        type="primary"
        icon="fa fa-times-circle"
        :disabled="!selectedIds.length"
        @click="onDeleteItem('3812')">取消应急</el-button>
      <hint-text class="posion mar-r-sm mar-t-xs fn-clear"><p>应急开关阀均属于强制开关状态</p></hint-text>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 39px)"
      v-loading="loading"
      :data="itemList"
      :row-class-name="rowClassName"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="阀门状态" prop="valveStatus" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('VALVE_STATUS', row.valveStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="控制状态" prop="controlWay" min-width="80" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{$enum.getLabel('VALVE_CONTROL_WAY', row.controlWay)}}
        </template>
      </el-table-column>
      <el-table-column label="最新命令发送时间" prop="tstamp" min-width="145" show-overflow-tooltip></el-table-column>
      <el-table-column label="最新命令执行结果" prop="execStatusName" min-width="145" show-overflow-tooltip></el-table-column>
    </el-table>
    <valve-info ref="dialog"></valve-info>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import valveInfo from './components/RemoteControl';

export default {
  name: 'BatchSwitchValve',
  mixins: [queryList, deleteItem],
  components: {
    valveInfo,
  },
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    return {
      url: 'tpeci/batchSwitchValve',
      isAuto: true,
      loading: false,
      queryForm: {                  // 检索表单项
        key: '',                 // 企业名称
        valveStatus: '',                 // 状态 1 有效 0 过期\
        psId,
        sort: 'psName+, portName+',
      },
    };
  },
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.portId);
    },
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    getItemList() {              // 获取记录列表
      this.loading = true;
      this.selectedIndexs = [];
      const body = { ...this.queryForm };
      this.$http.post(this.url, body).then((response) => {
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
    onDeleteItem(cn) {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要操作的数据');
        return;
      }
      let msg;
      if (cn === '3810') {
        msg = '是否确定执行应急开阀?';
      } else if (cn === '3811') {
        msg = '是否确定执行应急关阀?';
      } else if (cn === '3812') {
        msg = '是否确定执行取消应急功能?';
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.post(`${this.url}/execute`, {
          portIds: this.selectedIds,
          cn,
        })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
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
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.posion{
  position: absolute;
  right: 0;
  width: 250px;
  bottom: 2px;
}
</style>
