<template>
  <div>
    <el-card>
      <div slot="header"
           class="clearfix">
        <el-form inline
                 :model="queryForm">
          <el-form-item label="企业名称：">
            <el-input clearable
                      v-model="queryForm.psName"></el-input>
          </el-form-item>
          <el-form-item label="年度：">
            <el-date-picker v-model="queryForm.belongYear"
                            type="year"
                            placeholder="选择年"
                            value-format="yyyy"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       icon="fas fa-search"
                       @click="onQueryList">查 询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="mar-l-sm mar-y-xs">
        <el-button type="primary"
                   icon="fas fa-plus"
                   @click="addDialog()"
                   aria-hidden="true">新 增</el-button>
        <el-button type="danger"
                   icon="fas fa-trash-alt"
                   @click="filterItem()">删 除</el-button>
      </div>
      <el-table :data="itemList"
                border
                stripe
                height="calc(100% - 70px)"
                @select="onChangeCheck"
                @select-all="onChangeCheckAll"
                v-loading="loading"
                @selection-change="onChangeSelected">
        <el-table-column type="selection"
                         width="55"></el-table-column>
        <el-table-column align="center"
                         type="index"
                         width="50"
                         label="No."></el-table-column>
        <el-table-column align="left"
                         width="300"
                         prop="psName"
                         label="企业名称"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         width="200"
                         prop="belongYear"
                         label="年度"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center"
                         width="200"
                         prop="type"
                         label="类型"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{$enum.typeOptions[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="cycle"
                         label="周期"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{$enum.cycleOptions[scope.row.cycle]}}</template>
        </el-table-column>
        <el-table-column align="center"
                         prop="status"
                         label="当前状态"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status==0"
                  style="color:red;">{{$enum.LDARPlanStatus[scope.row.status]}}</span>
            <span v-if="scope.row.status==1"
                  style="color:#55C19F;">{{$enum.LDARPlanStatus[scope.row.status]}}</span>
            <span v-if="scope.row.status==2"
                  style="color:#7B7977;">{{$enum.LDARPlanStatus[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="status"
                         label="动静设备"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.deviceTypes==0"></span>
            <span v-if="scope.row.deviceTypes==1">动设备</span>
            <span v-if="scope.row.deviceTypes==2">静设备</span>
            <span v-if="scope.row.deviceTypes==3">动设备,静设备</span>
          </template>
        </el-table-column>
      </el-table>
      <paging-query :pager="pager"
                    @query="getItemList" />
    </el-card>
    <dialog-form ref="dialog"
                 @query="getItemList" />
  </div>
</template>

<script>
import { queryList, deleteItem } from '@/libs/mixins';
import { analyzeResp } from '@/libs/util';
import DialogForm from './components/DialogForm';

export default {
  name: 'LDARPlan',
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
  },
  data() {
    return {
      url: 'ldar/plan',
      flag: true,
      itemList: [],
      queryForm: {
        psName: '',
        belongYear: '',
        sort: 'psName+,type+,cycle',
      },
    };
  },
  methods: {
    addDialog() {
      this.$refs.dialog.openDialog();
    },
    // 过滤已开始的企业
    filterItem() {
      this.flag = true;
      const items = [];
      this.selectedIds.forEach((e) => {
        const item = this.itemList.find(v => v.id === e);
        if (item.status === 0) {
          items.push(item.id);
        } else {
          this.flag = false;
        }
      });
      this.selectedIds = items;
      this.onDeleteItem();
    },
    // 删除
    onDeleteItem(callback) {
      if (this.flag === false) {
        this.$message('勾选的检测计划中，部分计划已经开始，禁止删除，请选择未开始的计划删除');
        return;
      }
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}`, { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          if (callback) {
            callback(this.selectedIds);
          } else {
            this.getItemList();
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
      });
    },
  },
};
</script>
