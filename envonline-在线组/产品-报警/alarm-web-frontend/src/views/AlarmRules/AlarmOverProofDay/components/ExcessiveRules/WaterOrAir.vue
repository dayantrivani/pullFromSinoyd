<template>
  <div class="fill-h">
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
    <div class="mar-y-xs mar-l-sm">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem(getItemList)"
      >删 除</el-button>
    </div>
    <el-table
      border
      highlight-current-row
      height="calc(100% - 108px)"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="行政区域" prop="regionName" show-overflow-tooltip></el-table-column>
      <el-table-column label="企业名称" prop="psName" show-overflow-tooltip></el-table-column>
      <el-table-column label="排口名称" prop="portName" show-overflow-tooltip></el-table-column>
      <el-table-column label="因子名称" prop="factorName" show-overflow-tooltip></el-table-column>
      <el-table-column label="上限" prop="alertUpper" show-overflow-tooltip></el-table-column>
      <el-table-column label="下限" prop="alertLow" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <edit-form ref="editForm" @query="getItemList"></edit-form>
    <add-form
      ref="addForm"
      v-on="$listeners"
      :portType="portType"
      :parPortInfo="portInfo"
      @query="getItemList"
    ></add-form>
    <station-info
      ref="station"
      :portType="portType"
      :portInfo="portInfo"
      :childPortTypes="childPortTypes"
      @query="getQueryData"
      @change="onChangeChildPortTypes"
      @getPortInfo="onGetPortInfo"
    ></station-info>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import EditForm from './components/EditForm';
import AddForm from './components/AddForm';
import StationInfo from './components/StationInfo';

export default {
  name: 'ExcessiveRules',
  mixins: [queryList, deleteItem],
  components: {
    StationInfo,
    EditForm,
    AddForm,
  },
  provide() {
    return {
      grandPa: this,
    };
  },
  props: ['portType'],
  data() {
    return {
      isAuto: false,
      url: 'alarm/alarmRuleForOverProofPort',
      queryForm: {
        childPortTypes: [],
        regionCodeId: '',
        portIds: [],
        portType: this.portType,
        isAll: false,
        alarmTypeId: '',
        alarmTypeCode: '',
      },
      childPortTypes: [], // 排口子类型
      loading: false,
      itemList: [],
      portInfo: [],
    };
  },
  created() {
    this.queryForm.alarmTypeId = this.alarmType.id;
    this.queryForm.alarmTypeCode = this.alarmType.alarmTypeCode;
    this.getPortInfo();
    this.getItemList();
  },
  computed: {
    alarmType() {
      const [alarmType] = this.$store.state.sample.alarmType.filter(n => n.alarmTypeCode === this.$route.name);
      return alarmType;
    },
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.regionCodeId': function (val) {
      this.getPortInfo();
    },
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
  methods: {
    // 站点选择事件
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    getQueryData(portIds, childPortTypes) {
      this.queryForm.portIds = portIds || [];
      this.childPortTypes = childPortTypes || [];
      this.onQueryList();
    },
    onClickEdit(row) {
      this.$refs.editForm.openDialog(row);
    },
    onClickAdd() {
      this.$refs.addForm.openDialog();
    },
    onOpenStation() {
      this.$refs.station.openDialog(this.queryForm.portIds, this.queryForm.regionCodeId);
    },
    onChangeChildPortTypes(val) {
      this.childPortTypes = val;
      this.queryForm.childPortTypes = val;
      this.getPortInfo();
    },
    getItemList(param, item) {
      if (item) {
        this.queryForm.portIds = item.portIds;
      }
      this.loading = true;
      const { page, rows } = this.pager;
      // eslint-disable-next-line
      let data = item ? item : this.queryForm;
      if (+this.portType === 1 && ['AlarmCouWarn', 'AlarmCou'].includes(this.alarmType.alarmTypeCode)) {
        data = { ...data, factorsCode: 'W00000' };
      }
      this.$http.post('alarm/alarmRuleForOverProofPort', data, {
        params: {
          page,
          rows,
          sort: 'regionName+,psName+,portName',
        },
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
    // 获取站点/排口/点位数据
    getPortInfo() {
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: this.portType,
          childPortTypes: this.childPortTypes,
          regionCodeId: this.queryForm.regionCodeId,
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
      this.queryForm = { ...this.queryForm, ...val };
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
