<template>
  <!-- 排污核定 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>
        <el-form-item label="企业名称：">
          <el-input
            v-model="queryForm.psName"
            clearable
            placeholder="企业名称"
            style="width:180px"
            @keyup.enter.native="onQueryList()"
          ></el-input>
        </el-form-item>

        <el-form-item label="核定年份：" prop="approvedYear">
          <el-date-picker
            v-model="queryForm.approvedYear"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :clearable="false"
            :editable="false"
            style="width: 100px"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="因子：">
          <el-select
            v-model="queryForm.factorCodeList"
            v-loading="floading"
            multiple
            collapse-tags
            filterable
            style="width: 200px"
            clearable
          >
            <el-option v-for="item in select.factorList" :key="item.factorCode"
              :label="item.factorName" :value="item.factorCode"
            ></el-option>
            <!-- <el-option-group v-for="group in factorTreeList" :key="group.name" :label="group.name">
              <el-option
                v-for="item in group.children"
                :key="item.factorShowCode"
                :label="item.factorShowName"
                :value="item.factorShowCode"
              ></el-option>
            </el-option-group> -->
          </el-select>
        </el-form-item>

        <el-form-item label="站点：">
          <select-port
            v-loading="ploading"
            width="180px"
            v-model="queryForm.portIds"
            filterable
            :options="select.portList"
            :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]">
          </select-port>
          <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="openTransfer">站 点</el-button>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>

      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs" v-if="isShow">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="calc(100% - 69px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column v-if="isShow" align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column label="操作" align="center" width="67" v-if="isShow">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" prop="psName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column label="因子名称" prop="factorName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="排放量" prop="emissions" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="单位" prop="unit" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="核定年份" prop="approvedYear" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="remark" min-width="180" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <dialog-form ref="dialog" @query="getItemList"/>
    <Transfer-port ref="port" @getQueryData="getPortIdsList"/>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import SelectPort from '@/components/widgets/select-port';
import TransferPort from '@/components/widgets/transfer-port';
import DialogForm from './components/DialogForm';


export default {
  name: 'SewageApproval',
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
    SelectPort,
    TransferPort,
  },
  data() {
    return {
      url: 'tpeci/pollutantDischargeApproved',
      isAuto: false,
      loading: false,
      floading: false,
      ploading: false,
      isShow: true,
      queryForm: {                  // 检索表单项
        psName: '',                 // 企业名称
        portIds: [],                // 站点ids
        isAll: true,                // 全选站点
        portName: '',               // 站点名称
        factorCodeList: [],         // 因子编号
        approvedYear: '',           // 核定年份
      },
      select: {                     // 查询条件选择框
        factorList: [],
        portList: [],
      },
      itemList: [],
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this.queryForm, 'isAll', false);
        } else {
          this.$set(this.queryForm, 'isAll', true);
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.isShow = false;
      this.$set(this.queryForm, 'psId', this.orgGuid);
    }
    this.queryForm.approvedYear = new Date().getFullYear().toString();
    this.onQueryList();
    this.getPortList();
    this.getFactorList();
  },
  methods: {
    onChangeCheck(val) {            // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {                // 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {       // 关闭穿梭框时触发
      this.queryForm.portIds = portIds || [];
      this.queryForm.isAll = portIds.length === 0;
      this.onQueryList();
    },
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
    /** 请求层 */
    getFactorList() {               // 获取因子列表
      this.select.factorList = [];
      this.floading = true;
      this.$http.get('cfg/pageShowItem', {
        params: {
          pageShowMainCode: 'TPECI_PollutantDischargeProgress',
          isEnabled: true,                // 总量因子皆为废水因子,此处固定
          page: 1,                        // 因子名称
          rows: 1000000,                  // 因子编码
          sort: 'orderNum-',              // 因子原编码
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.factorList = response.data.data || [];
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
        this.floading = false;
      });
    },
    getPortList() {                 // 获取站点列表
      this.select.portList = [];
      this.ploading = true;
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 1000000,
          childPortType: 5,
          portType: 1,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data || [];
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
        this.ploading = false;
      });
    },
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.post('tpeci/pollutantDischargeApproved/find', this.queryForm, {
        params: { page, rows, sort: 'approvedTime-,psName+,portName' },
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
  },
};
</script>

<style lang="scss" scoped>
</style>
