<!-- 实时监测 -->
<template>
  <el-card>
    <el-form inline class="mar-t-xs mar-x-sm fn-flex">
      <div class="flex-1 fn-no-wrap">
        <el-form-item label="关键字：">
          <el-input style="width: 160px" v-model="queryForm.key" clearable placeholder="企业名称、排口名称">
          </el-input>
        </el-form-item>

        <el-form-item label="排口类型：">
          <el-select style="width: 160px" v-model="queryForm.childPortType" clearable>
            <el-option v-for="item in childPortList" :key="item.rowGuid" :label="item.dictName" :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="行政区域：">
          <select-tree style="width: 130px" v-model="queryForm.regionCodeId" lazy joint rootKey="0" url="sys/area"
            :props="{ label: 'areaName' }"></select-tree>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="fas fa-upload" :loading="downloading" @click="onDownload">导出</el-button>
        </el-form-item>

      </div>

      <el-form-item class="text-right fn-no-wrap">
        <el-radio-group v-model="queryForm.online">
          <el-radio :label="-1" class="text-warning">总数：{{ onlineCount.totalCount }}</el-radio>
          <el-radio :label="1" class="text-success">在线：{{ onlineCount.onlineCount }}</el-radio>
          <el-radio :label="2" class="text-info">离线：{{ onlineCount.offlineCount }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <div class="text-right fn-no-wrap">
        <span style="vertical-align: -webkit-baseline-middle;">
          <span class="circle bg-success"></span>
          正常
        </span>
        <span style="vertical-align: -webkit-baseline-middle;">
          <span class="circle bg-danger"></span>
          离线
        </span>
        <span style="vertical-align: -webkit-baseline-middle;">
          <span class="circle bg-warning"></span>
          报警
        </span>
      </div> -->
    </el-form>

    <el-table border highlight-current-row class="border-cell" height="calc(100% - 31px)" v-loading="loading"
      :data="itemList" @select="onChangeCheck" @select-all="onChangeCheckAll" @selection-change="onChangeSelected">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="regionName" label="区域" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="portName" label="站点名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column property="tstamp" label="采集时间" width="160"></el-table-column>
      <el-table-column property="onlineStatus" label="状态" width="60" class-name="col-status" align="center">
        <template slot-scope="{ row }" class="circle" :class="row.isOnline ? 'bg-success' : 'bg-danger'">
          <!-- {{ row.onlineStatus }} -->
          <div :class="`${row.isOnline ? '' : 'no-'}online`"></div>
        </template>
      </el-table-column>
      <el-table-column property="overAlarmStateName" label="超标报警" width="80">
        <template slot-scope="{ row }">
          {{ row.overAlarmStateName }}
        </template>
      </el-table-column>
      <el-table-column property="funAlarm" label="功能报警" width="80">
        <template slot-scope="{ row }">
          {{ row.funAlarm }}
        </template>
      </el-table-column>
      <el-table-column property="rainPumpState" label="雨水泵" width="80"></el-table-column>
      <el-table-column property="waterHeightState" label="液位状态" width="80"></el-table-column>
      <el-table-column property="overProofPumpState" label="超标泵" width="80"></el-table-column>
      <el-table-column property="askAuthorizeState" label="申请授权状态" width="110"></el-table-column>
      <el-table-column property="authorizeState" label="授权状态" width="80"></el-table-column>
      <el-table-column property="w01018-Avg" label="COD" width="80">
        <template slot="header" slot-scope="{ row }">
          <p>COD</p>
          <p>(毫克/升)</p>
          <span v-show="false">{{ row }}</span>
        </template>
      </el-table-column>
      <el-table-column property="w01001-Avg" label="PH" width="80">
        <template slot="header" slot-scope="{ row }">
          <p>pH</p>
          <p>(无量纲)</p>
          <span v-show="false">{{ row }}</span>
        </template>
      </el-table-column>
    </el-table>
    <paging-query :refresh-time="300" :pager="pager" @query="getItemList(true)" />
  </el-card>
</template>

<script>
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'RealTimeMonitor',
  mixins: [queryList],
  data() {
    return {
      url: 'rain/realtime/',
      queryForm: {
        regionCodeId: '',       // 因子值类型（实时值）
        portType: 5,            // 点位类型（1：废水，2：废气，3，固废，4：噪声, 5: 雨水）
        childPortType: '',       // 排口子类型值（废水：1：废水，2：污水厂，3：重金属 4：留样排口）（烟气：1：烟气，2：焚烧，3：VOC）（雨水）
        online: -1,             // 在线状态（1：在线，2：离线 -1:总数）
        isAll: true,            // 默认选全部站点
        key: '',                // 关键字
      },
      downloading: false,
      onlineCount: {},          // 总数、离线、在线
      childPortList: [],
      itemList: [],
    };
  },
  watch: {
    'queryForm.online': {         // 在线（1）、离线（2）、总数（''）
      handler() {
        this.onQueryList(true);
      },
      deep: true,
    },
  },
  created() {
    this.getChildPortType();
  },
  methods: {

    /** 请求层 */
    getItemList(notCount) {        // 获取记录列表
      this.loading = true;
      this.selectedIndexs = [];
      const { page, rows } = this.pager;
      this.$http.post(this.url, this.queryForm, {
        params: { page, rows },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data.onlineList;
          /* 点击在线、离线时,返回数据的onlineList变的不符合要求 */
          if (!notCount) this.onlineCount = response.data.data.onlineCount;
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
    getChildPortType() {             // 获取顶部子类型列表
      return new Promise((resolve) => {
        this.$http.get('sys/enumCode/child/PortType/Rain').then((response) => {
          if (response.status === 200) {
            this.childPortList = response.data;
            resolve();
          }
        });
      });
    },

    /** 特殊方法 */
    isRed(val) {                   // 因子是否显示为红色
      return typeof val === 'string' ? val.includes('red') : false;
    },
    isOut(val) {                   // 因子显示的值
      return this.isRed(val) ? val.split(':')[1] : val;
    },
    // 导出数据
    onDownload() {
      this.downloading = true;
      // const { page, rows } = this.pager;
      this.$http.post('rain/realtime/export', this.queryForm, {
        'responseType': 'blob',
      }).then((response) => {
        this.exportExcel(response.data);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // 导出excel
    exportExcel(data) {
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      const filename = `雨水实时数据${new Date().toLocaleDateString()}.xls`;
      const linkNode = document.createElement('a');
      linkNode.download = filename;
      linkNode.style.display = 'none';
      linkNode.href = URL.createObjectURL(blob);
      document.body.appendChild(linkNode);
      linkNode.click();
      URL.revokeObjectURL(linkNode.href);
      document.body.removeChild(linkNode);
    },
  },
};
</script>

<style lang="scss" scoped>
.circle {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 0 solid transparent;
  border-radius: 8px;
  vertical-align: text-top;
}
.col-status {
  > .cell {
    line-height: 20px !important;
  }
  .online,
  .no-online {
    position: relative;
    top: 4px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: 20px;
    background-position: center center;
  }
  .online {
    background-image: url("~@/assets/img/online.svg");
  }
  .no-online {
    background-image: url("~@/assets/img/offline.svg");
  }
}
</style>
