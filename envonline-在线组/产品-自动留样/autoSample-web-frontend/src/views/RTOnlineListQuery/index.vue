<template>
  <!--
    实时在线列表
  -->
  <el-card fill>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="行政区域：">
          <select-tree-lazy v-model="queryForm.regionCodeId" placeholder="行政区域"/>
        </el-form-item>
        <el-form-item label="关注程度：">
          <el-select v-model="queryForm.attentionDegree" clearable>
            <el-option label="国控" :value="1"></el-option>
            <el-option label="省控" :value="2"></el-option>
            <el-option label="市控" :value="4"></el-option>
            <el-option label="区控" :value="8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.key" style="width: 220px" placeholder="企业名称、排口名称、数采仪编号"></el-input>
        </el-form-item>
        <el-form-item label="留样仪状态：">
          <el-select v-model="queryForm.sampleInsStatus" placeholder="留样仪状态">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="待机" :value="0"></el-option>
            <el-option label="工作中" :value="1"></el-option>
            <el-option label="故障" :value="98"></el-option>
            <el-option label="维护" :value="99"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警状态：">
          <el-select v-model="queryForm.alarmStatus" placeholder="报警状态">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="满样预警" :value="1"></el-option>
            <el-option label="满样报警" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-sm mar-y-xs">
      <!-- <el-tooltip offset=8 effect="dark" transition placement="top-start">
        <div slot="content">
          <p>此页面实时值是超标留样时因子值。</p>
        </div>
        <i class="el-icon-info" style="color: #409eff;"></i>
      </el-tooltip>&nbsp; -->
      <span> 空白表示无数据&nbsp;
        <el-tag type="success" disable-transitions>正 常</el-tag>&nbsp;
        <el-tag type="warning" disable-transitions>满样预警</el-tag>&nbsp;
        <el-tag type="danger" disable-transitions>满样报警</el-tag>
      </span>
      <span style="color: #409eff;float: right;"><i class="el-icon-info" style="color: #409eff;"></i>
        此页面实时值是超标留样时因子值。&nbsp;</span>
    </div>
    <!-- 记录列表 -->
    <el-table
      border
      height="calc(100% - 63px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row>
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed prop="regionName" label="行政区域" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="attentionDegreeName" label="关注程度" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="psName" label="企业名称" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column fixed prop="portName" min-width="200" label="排口名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: #0ae;cursor: pointer;" @click="onPortClick(scope.row)">{{scope.row.portName}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed prop="isOnline" label="在线状态" show-overflow-tooltip>
        <template slot-scope="scope"><span>{{ scope.row.isOnline ? '在线' : '离线' }}</span></template>
      </el-table-column>
      <!-- 排口类型名称 -->
      <el-table-column prop="acTsTamp" min-width="160" label="门禁刷卡时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i33001" label="门禁开关" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i32001" label="门禁状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="i32002" label="门禁卡号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tstamp" min-width="160" label="最新的留样数据时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="scope.row.tstamp || 'color: #f56c6c;'">{{ scope.row.tstamp || '暂无数据' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sampleType" label="留样类别" show-overflow-tooltip></el-table-column>
      <el-table-column prop="relationBottle" label="关联瓶号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sampleNum" label="留样瓶数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="alarmStatus" min-width="105px" label="满样报警状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.alarmStatus">{{scope.row.alarmStatus}}</span>
          <el-tag v-else :type="getTagType(scope.row.alarmStatus)" disable-transitions>
            {{scope.row.alarmStatus}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="waterStorageStatus" min-width="95px" label="蓄水桶状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-file-invoice"
            @click="onClickInfo({ value: scope.row.waterStorageStatus, label: `蓄水桶状态 -- ${scope.row.portName}` })">
            详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sampleInsStatus" min-width="95px" label="留样仪状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sampleBottleStatus" min-width="95px" label="留样瓶状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-file-invoice"
            @click="onClickInfo({ value: scope.row.sampleBottleStatus, label: `留样瓶状态 -- ${scope.row.portName}` })">
            详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remainBottle" label="剩余瓶数" show-overflow-tooltip></el-table-column>
      <el-table-column
        v-for="(item, index) in gridFactorList" :key="index"
        :property="item.factorShowCode"
        min-width="135"
        :label="item.factorShowName"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="scope.row[item.factorShowCode].includes(':') ? 'color: red;' : ''">
            {{scope.row[item.factorShowCode].split(':')[scope.row[item.factorShowCode].split(':').length - 1]}}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal
      ref="dialog"
      :title="portItem.portName"
      :before-close="onBeforeClose"
      size='large'
      scrollbar
      contentClass=""
      @change="changeDialog">
      <el-tabs type="border-card" v-model="tabName" :style="`height: calc(${dialogHeight} - 50px)`">
        <el-tab-pane lazy label="报警信息" name="AlarmRecord">
          <alarm-record></alarm-record>
        </el-tab-pane>
        <el-tab-pane lazy label="超标留样" name="OverProofSample">
          <over-proof-sample></over-proof-sample>
        </el-tab-pane>
        <el-tab-pane lazy label="远程留样" name="RemoteSample">
          <remote-sample></remote-sample>
        </el-tab-pane>
        <el-tab-pane lazy label="自动监控数据" name="AutoSample">
          <auto-sample></auto-sample>
        </el-tab-pane>
        <el-tab-pane lazy label="门禁卡信息" name="AccessCardRecord">
          <access-card-record></access-card-record>
        </el-tab-pane>
      </el-tabs>
    </dialog-modal>
    <dialog-modal ref="statusDialog" :title="statusInfo.label">
      <el-table
        border
        :data="statusInfo.value"
        :show-header="false"
        class="hide-hover-light"
        style="border-top: 1px solid #EBEEF5;">
          <el-table-column
            align="center"
            v-for="(item, index) in statusInfo.value[0]"
            :key="index"
            :prop="index" show-overflow-tooltip>
          </el-table-column>
      </el-table>
      <div class="pad-b-sm"></div>
    </dialog-modal>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import * as _cloneDeep from 'lodash/cloneDeep'; // 深拷贝
import SelectTreeLazy from '@/components/global/SelectTreeLazy';
import AlarmRecord from './components/AlarmRecord'; // 报警信息
import OverProofSample from './components/OverProofSample'; // 超标留样
import RemoteSample from './components/RemoteSample'; // 远程留样
import AutoSample from './components/AutoSample'; // 自动监测数据
import AccessCardRecord from './components/AccessCardRecord'; // 门禁卡信息

export default {
  name: 'RTOnlineListQuery',
  components: {
    SelectTreeLazy,
    AlarmRecord,
    OverProofSample,
    RemoteSample,
    AutoSample,
    AccessCardRecord,
  },
  data() {
    return {
      loading: false,
      dialogHeight: '86vh', // 弹窗内容默认高度
      tabName: 'AlarmRecord',
      queryForm: {
        regionCodeId: '',
        key: '',
        factorCodes: [],
        alarmStatus: -1,
        sampleInsStatus: -1,
        sort: 'regionCodeId+,psName+,portName',
      },
      itemList: [],
      gridFactorList: [],
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        total: 0,
      },
      statusInfo: {
        label: '',
        value: [],
      }, // 状态详情
    };
  },
  computed: {
    ...mapState({
      portItem: state => state.sample.portItem,
    }),
  },
  created() {
    this.getFactorList();
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onPortClick(row) {
      this.$store.commit('sample/setPortItem', row);
      this.$refs.dialog.openDialog();
    },
    changeDialog(isFull) {
      this.dialogHeight = isFull ? '100vh' : '86vh';
    },
    onClickInfo(row) { // 点击详情按钮
      const copyStatus = _cloneDeep(row);
      const cel = 4;
      const num = Math.ceil(copyStatus.value.length / cel);
      const statusInfo = [];
      for (let i = 0; i < num; i += 1) {
        statusInfo[i] = {};
        copyStatus.value.splice(0, cel).forEach((element, index) => {
          statusInfo[i][`key${index % cel}`] = element.key;
          statusInfo[i][`value${index % cel}`] = element.value;
        });
      }
      this.statusInfo.label = copyStatus.label;
      this.statusInfo.value = statusInfo;
      this.$refs.statusDialog.openDialog();
    },
    getTagType(val) { // 获取标签类型
      let type;
      if (val === '正常') {
        type = 'success';
      } else if (val === '满样预警') {
        type = 'warning';
      } else if (val === '满样报警') {
        type = 'danger';
      } else {
        type = '';
      }
      return type;
    },
    getItemList() { // 获取列表数据
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.post('autoSample/realtime', { ...this.queryForm }, {
        params: {
          rows,
          page,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    getFactorList() { // 获取因子列表
      // this.loading = true;
      this.$http.get('cfg/pageShowItem?page=1&rows=100000&sort=valueType%2B,orderNum', {
        params: {
          pageShowMainCode: 'realForSample',
          isEnabled: true,
        },
      }).then((response) => {
        if (response.data.success) {
          this.gridFactorList = response.data.rows || response.data.data || response.data;
          this.queryForm.factorCodes = this.gridFactorList.filter(n => n.isShow).map(n => n.factorShowCode);
          // 根据首页详情参数跳转选择报警状态
          if (this.$route.query.alarmStatus !== undefined) {
            this.queryForm.alarmStatus = this.$route.query.alarmStatus;
          }
          this.getItemList();
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        // this.loading = false;
      });
    },
    onBeforeClose(done) {
      this.tabName = 'AlarmRecord';
      done();
    },
  },
};
</script>
<style lang="scss">
  .hide-hover-light {
    .el-table__body td {
      border-color: #ebeef5 #ebeef5 #ebeef5 #ebeef5;
    }
  }
</style>
