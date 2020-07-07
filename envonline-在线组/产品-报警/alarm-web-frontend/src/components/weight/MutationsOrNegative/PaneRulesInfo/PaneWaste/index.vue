<template>
  <!-- 废水、废气、固废、噪声 -->
  <el-card>
    <!-- 查询条件 -->
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
            v-for="item in portList"
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
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮组 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem()">删 除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      height="calc(100% - 67px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-cog" @click="onClickConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
      <el-table-column property="regionName" label="行政区域"></el-table-column>
      <el-table-column property="psName" min-width="150" label="企业名称" show-overflow-tooltip></el-table-column>
      <el-table-column property="portName" min-width="100" label="排口名称" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />

    <!-- 站点 -->
    <station-info
      ref="stationinfo"
      :portType="portType"
      :portList="portList"
      :childPortTypes="childPortTypes"
      @query="getQueryData"
      @change="onChangeChildPortTypes"
      @getPortInfo="onGetPortInfo"/>

    <!-- 新增对话框 -->
    <list-water-dialog ref="dialog" :feild="feild" :portList="portList"
      :alarmType="alarmType" @query="getItemList"/>

    <!--
        配置按钮对话框
         未配置参数时 onOff 表示 false
         已配置参数时 onOff 表示 true
    -->
    <rules-edit-no-param ref="configdialog" :alarmType="alarmType" v-if="!onOff"
      :systemTypeList="systemTypeList" @query="getItemList"/>
    <rules-edit-param ref="configdialog" :alarmType="alarmType" v-else @query="getItemList"/>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import ListWaterDialog from  './components/ListWaterDialog.vue';
import RulesEditNoParam from '../components/RulesEditNoParam.vue';
import RulesEditParam from '../components/RulesEditParam.vue';
import StationInfo from './components/StationInfo.vue';


export default {
  mixins: [queryList],
  components: {
    ListWaterDialog,
    RulesEditNoParam,
    RulesEditParam,
    StationInfo,
  },
  props: {
    systemTypeList: {
      type: Array,
      required: true,
    },
    alarmType: {
      type: Object,
      required: true,
    },
    feild: {
      type: Object,
      required: true,
    },
    onOff: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      url: 'alarm/alarmRuleForAbnormalPort/query',
      isAuto: false,
      itemList: [],
      queryForm: {
        childPortTypes: [],
        regionCodeId: '',    // 行政区域
        systemTypeId: '',    // 系统类型
        portIds: [],         // 点位
        isAll: true,         // 全部点位
      },
      childPortTypes: [], // 排口子类型
      typeList: [
        { dictCode: 'Water', dictValue: '1' },
        { dictCode: 'Air', dictValue: '2' },
        { dictCode: 'Noise', dictValue: '3' },
        { dictCode: 'Solid', dictValue: '4' },
        { dictCode: 'Rain', dictValue: '1' },
      ],
      portList: [],          // 点位列表
    };
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.regionCodeId': function (val) {
      this.getPortList();
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
  computed: {
    portType() {
      return this.feild.dictValue;
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

    onPaneQuery() {
      this.$set(this.queryForm, 'systemTypeId', this.feild.rowGuid);
      this.getItemList();
      this.getPortList();
    },
    onChangeChildPortTypes(val) {
      this.childPortTypes = val;
      this.queryForm.childPortTypes = val;
      this.getPortList();
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post(`${this.url}?page=${page}&rows=${rows}&sort=psName-,portName`, this.queryForm)
        .then((response) => {
          if (response.status === 200 && (response.data.success
          || response.data.msg.includes('未查询到符合条件的数据'))) {
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
    getPortList() {
      const { dictValue } = this.typeList.filter(item => item.dictCode === this.feild.dictCode)[0];
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          key: '',
          portType: +dictValue,
          childPortTypes: this.childPortTypes,
          regionCodeId: this.queryForm.regionCodeId,
          sort: 'psName-,portName',
        },
      }).then((response) => {
        if (response.data.success) {
          this.portList = response.data.data || [];
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
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    onClickConfig(row) {
      this.$refs.configdialog.openDialog(row);
    },
    onDeleteItem() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('alarm/alarmRuleForAbnormalPort', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
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
    /* 表单 */
    onSaveItem() {
    },
    closeDialog() {
    },

    /** 特殊方法 */
    onOpenStation() {
      this.$refs.stationinfo.openDialog(this.queryForm.portIds, this.queryForm.regionCodeId);
    },
  },
};
</script>
