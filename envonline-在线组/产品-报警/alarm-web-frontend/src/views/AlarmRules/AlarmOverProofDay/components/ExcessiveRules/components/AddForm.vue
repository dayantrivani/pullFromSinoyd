<template>
  <dialog-modal ref="dialog" @close="closeDialog" title="新增超标规则" size="middle" scrollbar>
    <el-form :model="queryForm" inline class="mar-t-xs mar-l-sm">
      <el-form-item label="行政区域：">
        <select-tree
          style="width: 130px"
          v-model="queryForm.regionCodeId"
          lazy
          joint
          rootKey="0"
          url="sys/area"
          :props="{ label: 'areaName' }"
        ></select-tree>
      </el-form-item>
      <el-form-item label="排口类型：">
        <el-select
          style="width:150px"
          v-model="childPortTypes"
          collapse-tags
          multiple
          clearable
          @change="onChangeChildPortTypes"
        >
          <el-option
            v-for="(item, index) in $enum.portType[portType].children"
            :key="index"
            :value="index"
            :label="item.dictName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点位：">
        <el-select style="width:220px" v-model="queryForm.portIds" collapse-tags multiple filterable clearable>
          <el-option
            v-for="item in portInfo"
            :key="item.id"
            :value="item.id"
            :label="item.portName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-map-marker-alt" @click="onOpenStation">站 点</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr class="mar-t-0">
    <el-button
      class="mar-b-xs"
      type="primary"
      icon="fas fa-cog"
      :disabled="!selectedIds.length"
      @click="onClickConfig"
    >配 置</el-button>
    <el-table
      border
      highlight-current-row
      height="593px"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column label="区域" prop="regionName" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" show-overflow-tooltip></el-table-column>
      <el-table-column label="排口名称" prop="portName" show-overflow-tooltip></el-table-column>
      <el-table-column label="已配置标准" prop="evaluationName" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <standard-option ref="dialog" :portId="portIds" @query="getItemList"></standard-option>
    <station-info
      ref="station"
      :portType="portType"
      :portInfo="portInfo"
      :childPortTypes="childPortTypes"
      @query="getQueryData"
      @change="onChangeChildPortTypes"
      @getPortInfo="onGetPortInfo"
    ></station-info>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import StandardOption from './StandardOption';
import StationInfo from './StationInfo';

export default {
  name: 'AddForm',
  mixins: [queryList],
  components: { StandardOption, StationInfo },
  props: ['portType', 'parPortInfo'],
  data() {
    return {
      isAuto: false,
      queryForm: {
        regionCodeId: '',
        portIds: [],
        portType: this.portType,
        childPortTypes: [],
        isShowEvaluation: true,
        isAll: true,
      },
      portInfo_: [],
      childPortTypes: [], // 排口子类型
      portIds: [],
      loading: false,
    };
  },
  computed: {
    portInfo: {
      get() {
        return this.portInfo_.length === 0 ? this.parPortInfo : this.portInfo_;
      },
      set(val) {
        this.portInfo_ = val;
      },
    },
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
    selectPort(val) {
      if (val) {
        this.queryForm.portIds = val;
      }
    },
  },
  methods: {
    onChangeCheck(val) {        // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds, childPortTypes) {
      this.queryForm.portIds = portIds || [];
      this.childPortTypes = childPortTypes || [];
      this.onQueryList();
    },
    onChangeChildPortTypes(val) {
      this.childPortTypes = val;
      this.queryForm.childPortTypes = val;
      this.getPortInfo();
    },
    getItemList(param, item) {
      this.loading = true;
      const { page, rows } = this.pager;
      // eslint-disable-next-line
      const data = item ? item : this.queryForm;
      this.$http.post('bas/portInfo/queryAuthority', data, {
        params: { page, rows, sort: 'regionName+psName+portName' },
      })
        .then((response) => {
          if (response.data.success) {
            this.itemList = response.data.data;
            this.pager.count = response.data.count;
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
    },
    openDialog() {
      this.queryForm.portIds = [];
      this.$refs.dialog.openDialog();
      if (!this.portInfo) this.getPortInfo();
      this.getItemList();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onOpenStation() {
      this.$refs.station.openDialog(this.queryForm.portIds, this.queryForm.regionCodeId);
    },
    onClickConfig() {
      this.$refs.dialog.openDialog();
    },
    onChangeSelected(select) {
      this.selectedIds = select.map(e => e.id);
      this.portIds = select;
    },
    // 获取站点/排口/点位数据
    getPortInfo() {
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: this.portType,
          childPortTypes: this.childPortTypes,
          key: '',
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.portInfo = response.data.data || [];
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onGetPortInfo(val) { // 站点弹窗修改行政区域检索站点列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: this.portType,
          childPortTypes: this.childPortTypes,
          key: '',
          ...val,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.portInfo = response.data.data || [];
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
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
</style>
