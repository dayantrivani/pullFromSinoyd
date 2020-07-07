<template>
      <!-- <dialog-modal ref="dialog" size="mini" :title="`${isEdit ? '编辑' : '新增'}通用规则`" @close="closeDialog"> -->
    <dialog-modal ref="dialog" size="middle" append-to-body title="批量新增" @close="closeDialog">
      <el-form :model="queryForm" inline>
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
        <el-form-item label="点位：">
          <el-select v-model="queryForm.portIds" multiple>
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
          <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
          <el-button type="success" icon="fas fa-check" @click="onClickAdd">确 认</el-button>
        </el-form-item>
      </el-form>
      <el-table
        border
        height="calc(86vh - 115px)"
        v-loading="loading"
        :data="itemList"
        highlight-current-row
        @selection-change="onChangeSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
        <el-table-column property="regionName" label="行政区域"></el-table-column>
        <el-table-column property="psName" min-width="150" label="企业名称" show-overflow-tooltip></el-table-column>
        <el-table-column property="portName" min-width="100" label="排口名称" show-overflow-tooltip></el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList" />

      <station-info
        ref="stationinfo"
        :portType="queryForm.portType"
        :queryForm="queryForm"
        :portList="portList"
        @query="getQueryData"/>
    </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import StationInfo from './StationInfo.vue';


export default {
  mixins: [queryList],
  props: {
    feild: {
      type: Object,
      required: true,
    },
    portList: {
      type: Array,
      required: true,
    },
    alarmType: {
      type: Object,
      required: true,
    },
  },
  components: {
    StationInfo,
  },
  data() {
    return {
      url: 'bas/portInfo/queryAuthority',
      isAuto: false,
      queryForm: {
        regionCodeId: '',  // 行政区域
        portIds: [],       // 点位Ids
        portType: 1,       // 点位类型
      },
      systemTypeList: [
        { dictCode: 'Water', dictValue: '1' },
        { dictCode: 'Air', dictValue: '2' },
        { dictCode: 'Noise', dictValue: '3' },
        { dictCode: 'Solid', dictValue: '4' },
        { dictCode: 'Rain', dictValue: '1' },
      ],
      // 点位列表
      // portList: [],
      itemList: [],
    };
  },
  methods: {
    // 打开弹框
    openDialog() {
      const { dictValue } = this.systemTypeList.filter(item => item.dictCode === this.feild.dictCode)[0];
      this.$set(this.queryForm, 'portType', +dictValue);
      this.$refs.dialog.openDialog();
      this.getItemList();
    },
    getItemList() {
      this.loading = false;
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
    // 确认按钮
    onClickAdd() {
      this.sendAddQuery();
      this.$refs.dialog.closeDialog();
    },
    // 数据选中状态修改时
    onChangeSelected(val) {
      this.selectedIds = val;
    },
    getQueryData(portIds, childPortTypes) {
      this.queryForm.portIds = portIds || [];
      this.childPortTypes = childPortTypes || [];
      this.onQueryList();
    },
    // dialog框关闭前的回调
    closeDialog() {
      this.queryForm = this.getEmptyItem();
      this.selectedIds = [];   // 混合
    },
    // 调常量的接口
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },

    sendAddQuery() {
      const data = this.selectedIds.map((item) => {
        const str = {
          alarmTypeId: this.alarmType.id,
          regionCodeId: item.regionCodeId,
          regionName: item.regionName,
          psId: item.psId,
          psName: item.psName,
          portId: item.id,
          portName: item.portName,
          systemTypeId: this.feild.rowGuid,
          systemTypeCode: this.feild.dictCode,
        };
        return str;
      });
      this.$http.post('alarm/alarmRuleForAbnormalPort/batch', data)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$emit('query');
            this.$refs.dialog.closeDialog();
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
    /** 特殊方法 */
    onOpenStation() {
      this.$refs.stationinfo.openDialog();
    },
    getEmptyItem() {
      return {
        regionCodeId: '',  // 行政区域
        portIds: [],       // 点位Ids
        portType: 1,       // 点位类型
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
