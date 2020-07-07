<!-- 企业蒸汽使用情况上报 -->
<template>
  <el-row :gutter="10">
    <el-col style="width: 200px">
      <el-card>
        <template slot="header">
          <p class="title-info mar-t-xs pad-l-0" style="border-left: none;">上报年历</p>
        </template>

        <el-date-picker
          v-model="belongYear"
          type="year"
          size="normal"
          value-format="yyyy"
          :clearable="false"
          placeholder="选择年"
          style="width: 100%;">
        </el-date-picker>

        <div class="pad-x-sm pad-t-sm" style="height: calc(100% - 40px); overflow: scroll;">
          <ul class="month-box" v-loading="statusLoading">
            <li
              v-for="(item, index) in reportStatus"
              :key="index"
              @click="onClickMonth(item >= 0, index + 1)"
              :class="{
                disabled: +item === -1,
                'bg-danger': +item === 0,
                'bg-success': +item === 1,
                active: index + 1 === +queryForm.belongMonth,
              }"
            >
              {{index + 1}}<span class="mar-l-xs">月</span>
            </li>
          </ul>
        </div>
      </el-card>
    </el-col>
    <el-col style="width: calc(100% - 200px);">
      <el-card>
        <!-- 查询表单 -->
        <template slot="header">
          <el-form inline :model="queryForm">
            <el-form-item label="企业名称：" v-show="!['ent', 'Ent'].includes(this.userType)">
              <el-input
                v-model="queryForm.psName"
                placeholder="企业名称"
                clearable
                style="width:160px"
                @keyup.enter.native="onQueryList()"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="queryForm.status" clearable style="width: 150px;">
                <el-option label="未上报" :value="0"></el-option>
                <el-option label="已上报" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
            </el-form-item>
          </el-form>
        </template>
        <!-- 列表 -->
        <el-table
          border
          highlight-current-row
          height="calc(100% - 30px)"
          v-loading="loading"
          :data="itemList"
          @selection-change="onChangeSelected">
          <!-- <el-table-column align="center" type="selection" width="37"></el-table-column> -->
          <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
          <el-table-column align="center" label="操作" :width="['ent', 'Ent'].includes(userType) ? '120' : '67'">
            <template slot-scope="scope">
              <el-button type="primary" icon="fas fa-eye" @click="onClickEdit(scope.row, true)">查看</el-button>
              <el-button
                v-if="['ent', 'Ent'].includes(userType)"
                type="primary"
                icon="fas fa-pencil-alt"
                @click="onClickEdit(scope.row, false)"
              >编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column property="psName" label="企业名称" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column property="statusName" label="状态" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column property="remark" label="备注" min-width="160" show-overflow-tooltip></el-table-column>
        </el-table>

        <!-- 分页 -->
        <paging-query :pager="pager" @query="getItemList"/>
      </el-card>
    </el-col>
    <!-- 弹出框 -->
    <dialog-form ref="dialog"  @query="getReportStatus();getItemList()" />
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import DialogForm from './components/DialogForm';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'EntReported',
  mixins: [                   // 混合
    queryList,
  ],
  components: {
    DialogForm,               // 新增编辑弹窗
  },
  data() {
    return {
      // 左侧年历
      statusLoading: false,
      belongYear: new Date().getFullYear().toString(),
      reportStatus: [],
      // 右侧记录
      url: 'enterprise/energyConsumptionSteam/monReportStatus',
      isAuto: false,
      // 查询表单绑定变量
      queryForm: {
        belongYear: new Date().getFullYear().toString(),
        belongMonth: new Date().getMonth().toString(),
        psName: '',
        status: '',
      },
      itemList: [],
    };
  },
  watch: {
    belongYear(val) {
      this.queryForm.belongYear = val;
      this.getReportStatus();
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  mounted() {
    if (['ent', 'Ent'].includes(this.userType)) this.queryForm.psId = this.orgGuid;
    this.onQueryList();
  },
  created() {
    this.getReportStatus();
  },
  methods: {
    // 单击左侧选择年历
    onClickMonth(flag, month) {
      if (flag) {
        this.queryForm.belongMonth = month;
        this.onQueryList();
      }
    },
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 关闭选择新增报备类型弹窗
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onClickCheck() {
      this.$refs.checkForm.validate((valid) => {
        if (!valid) return;
        this.closeDialog();
        this.$refs.dialog.openDialog(this.checkModel.type);
      });
    },
    // 单击编辑回调
    onClickEdit(row, isDisabled) {
      this.$refs.dialog.openDialog(row, isDisabled);
    },

    // 请求接口
    getReportStatus() {
      this.statusLoading = true;
      const params = { belongYear: this.belongYear, psId: this.orgGuid };
      if (['ent', 'Ent'].includes(this.userType)) params.psId = this.orgGuid;
      this.$http.get('enterprise/energyConsumptionSteam/calReportStatus', {
        params,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.reportStatus = response.data.data;
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
        this.statusLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.month-box {
  height: 100%;
  user-select: none;
  >li {
    padding: 10px;
    height: 24px;
    box-sizing: content-box;
    text-align: center;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    &.active {
      filter: opacity(0.7);
    }
    &.disabled {
      background-color: #e1e1e1 !important;
      cursor: not-allowed;
    }
    &:not(.disabled):hover {
      background-color: #efefef;
      opacity: 0.8;
    }
  }
}
</style>
