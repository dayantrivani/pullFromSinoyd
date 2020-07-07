<template>
  <!-- 总量阈值 -->

  <!-- 主体内容 -->
  <div class="main-box">
    <!-- 表单 -->
    <el-form inline class="mar-x-sm mar-t-xs">
      <!-- <el-form-item label="阈值年限：" prop="thresholdYear">
        <el-date-picker
          v-model="queryForm.thresholdYear"
          type="year"
          value-format="yyyy"
          format="yyyy"
          :clearable="false"
          style="width: 100px"
        ></el-date-picker>
      </el-form-item> -->

      <el-form-item label="阈值模式：" prop="thresholdMode">
        <el-select style="width:90px;" v-model="queryForm.thresholdMode" clearable>
          <el-option label="全部" :value="''"></el-option>
          <el-option
            v-for="(item, index) in $enum.get('THRESHOLD_MODE')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="是否启用：" prop="status">
        <el-select style="width:90px;" v-model="queryForm.status" :clearable="false">
          <el-option label="全部" :value="''"></el-option>
          <el-option
            v-for="(item, index) in $enum.get('APPROVAL_ISENABLE')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>

    <!-- 按钮组 -->
    <div class="mar-b-xs mar-l-xs" v-if="isShow">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem(deleCallback)"
      >删 除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      :height="isShow ? 'calc(86vh - 194px)' : 'calc(86vh - 160px)'"
      v-loading="loading"
      :data="itemList"
      @selection-change="onChangeSelected"
    >
      <el-table-column align="center" type="selection" width="37" v-if="isShow"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67" v-if="isShow">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="阈值模式" prop="thresholdMode" align="center" min-width="90" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ $enum.getLabel('THRESHOLD_MODE', +row.thresholdMode) }}
        </template>
      </el-table-column>
      <el-table-column label="因子名称" prop="factorName" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="排放量阈预警值" prop="warnAlertUpper" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="排放量阈报警值" prop="alertUpper" min-width="120" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="阈值年份" prop="thresholdYear" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column label="开始时间" prop="beginDate" min-width="155" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.thresholdMode !== 3 ? row.beginDate : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="endDate" min-width="155" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.thresholdMode !== 3 ? row.endDate : '--' }}
        </template>
      </el-table-column> -->
      <el-table-column label="单位" prop="unit" min-width="90" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="是否启用" prop="status" min-width="90" show-overflow-tooltip>
        <template slot-scope="{ row }">
           {{ $enum.getLabel('APPROVAL_ISENABLE', +row.status) }}
        </template>
      </el-table-column> -->
      <el-table-column label="更新时间" prop="modifyDate" min-width="155" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList" />

    <dialog-form ref="dialog" @query="getItemList" :mainrow="mainrow"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import { analyzeResp } from '@/global/libs/util';
import DialogForm from './components/DialogForm.vue';
import { queryList, deleteItem } from '@/global/libs/mixins';

export default {
  mixins: [queryList, deleteItem],
  components: {
    DialogForm,
  },
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      /** 阈值列表 */
      url: 'tpeci/valveSchemeDetail',
      isAuto: false,                // 告诉混合不要在created时调取查询接口
      loading: false,               // 列表加载状态
      isShow: true,
      queryForm: {                  // 查询条件
        schemeId: '',
        thresholdYear: '',          // 阈值年限
        thresholdMode: '',          // 阈值模式(1 日, 2月, 3年)
        status: '',                 // 是否启用(0代表停用, 1 代表启用)
        type: 1,                    // 类型(1 总量阈值 2 浓度阈值)
        factorName: '',             // 因子（预留）
        sort: 'modifyDate-,thresholdMode+,factorName',
      },
      itemList: [],                 // 列表数据
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.isShow = false;
    }
  },
  methods: {
    openDialog() {                  // 打开弹框
      // this.queryForm.thresholdYear = new Date().getFullYear().toString();
      this.queryForm.schemeId = this.mainrow.id;
      this.onQueryList();
    },
    onClickAdd() {                  // 新增按钮
      this.$refs.dialog.openDialog();
    },
    onClickEdit(row) {              // 编辑按钮
      this.$refs.dialog.openDialog(row);
    },
    onChangeCheck(val) {            // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {                // 打开穿梭框
      this.$refs.port.openDialog(this.queryPortForm.portIds);
    },
    getPortIdsList(portIds) {       // 关闭穿梭框时触发
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },

    /** 请求层 */

    /** 特殊方法 */
    deleCallback() {
      this.getItemList();
    },
    closeDialog() {                // 标签页对话框关闭时调取此方法
      this.selectedIds = [];
      this.queryForm = {
        schemeId: '',
        thresholdYear: '',          // 阈值年限
        thresholdMode: '',          // 阈值模式(1 日, 2月, 3年)
        status: '',                 // 是否启用(0代表停用, 1 代表启用)
        type: 1,                    // 类型(1 总量阈值 2 浓度阈值)
        factorName: '',             // 因子（预留）
        sort: 'modifyDate-,thresholdMode+,factorName',
      };
      this.itemList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
