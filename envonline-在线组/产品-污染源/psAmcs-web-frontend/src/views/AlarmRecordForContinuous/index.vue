<template>
  <!-- 超标率 -->
  <el-card>
    <template slot="header">
      <el-form :model="queryForm" inline>

        <el-form-item label="时间：">
          <el-date-picker style="width:135px" v-model="queryForm.fromDate" type="date" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" :clearable="false" :editable="false"></el-date-picker>&nbsp;~
          <el-date-picker style="width:135px" v-model="queryForm.toDate" type="date" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" :clearable="false" :editable="false"></el-date-picker>
        </el-form-item>

        <el-form-item label="站点：">
          <select-port width="180px" v-model="queryForm.portIds" filterable :options="portList" :field="[
              { name: 'psName', key: 'psId' },
              { name: 'portName', key: 'id' }
            ]">
          </select-port>
          <el-button class="mar-l-xs" type="primary" icon="fas fa-map" @click="openTransfer">站 点</el-button>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="isAll" @change="onChangeCheck">全部站点</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button class="mar-l-sm" type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table border highlight-current-row height="calc(100% - 32px)" v-loading="loading" :data="itemList"
      :row-class-name="rowClassName" @selection-change="onChangeSelected">
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">处理</el-button>
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickDetail(scope.row)">详细</el-button>
          <!-- <el-upload style="display: inline-block"
                     action=""
                     :show-file-list="false"
                     :http-request="onUpload">
            <el-button icon="fas fa-cloud-upload-alt"
                       type="text"
                       @click="onObjectIdChange(scope.row)">
              上传
            </el-button>
          </el-upload> -->
          <el-button type="primary" icon="fas fa-cloud-download-alt" @click="onQueryDocId(scope.row)">导出超标通告单
          </el-button>
          <!-- <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">通报单下载</el-button> -->
        </template>
      </el-table-column>
      <el-table-column label="污染源名称" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="站点名称" prop="portName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="报警时间" prop="alarmTstamp" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.alarmTstamp.split(' ')[0] || row.alarmTstamp}}
        </template>
      </el-table-column>
      <el-table-column label="报警因子" prop="alarmFactorName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="dealStatus" min-width="80" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :class="`text-${row.dealStatus ? 'success' : 'danger'}`" style="cursor: pointer"
            @click="onStatusClick(row)">
            {{row.dealStatus ? '已处理' : '待处理'}}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>

    <!-- 弹出框 -->
    <dialog-form ref="dialog" @query="getItemList" />
    <alarm-record-dialog ref="alarmRecordDialog" />
    <detail-dialog ref="detailDialog"></detail-dialog>
    <Transfer-port ref="port" @getQueryData="getPortIdsList" />
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { queryList } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { getDay } from '@/libs/tools';
import SelectPort from '@/components/widget/select-port';
import TransferPort from '@/components/widget/transfer-port';
import DialogForm from './components/DialogForm';
import AlarmRecordDialog from './components/AlarmRecordDialog';
import DetailDialog from './components/DetailDialog';

export default {
  name: 'AlarmRecordForContinuous',
  mixins: [queryList],
  components: {
    SelectPort,
    TransferPort,
    DialogForm,
    AlarmRecordDialog,
    DetailDialog,
  },
  data() {
    return {
      url: 'amcs/alarmRecordForContinuous/query',
      isAuto: false,
      queryForm: {                  // 检索表单项
        fromDate: getDay(-7, false, false),  // 开始时间
        toDate: getDay(0, false, false),     // 结束时间
        portIds: [],                         // 站点信息
        systemTypeCode: 1,                   // WaterSystem 废水 AirSystem 废气
        psId: '',
        sort: 'alarmTstamp-',
      },
      objectId: '',
      isAll: true,                           // 是否选择全部
      portList: [],                 // 站点数据源
    };
  },
  created() {
    this.getPortList();
    this.onQueryList();
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  watch: {
    queryForm: {                       // 监控站点
      handler(val) {
        if (val.portIds.length !== 0) {
          this.$set(this, 'isAll', false);
        } else {
          this.$set(this, 'isAll', true);
        }
      },
      deep: true,
    },
  },
  methods: {
    onClickDetail(row) {
      this.$refs.detailDialog.openDialog(row.dtoAlarmRecordForContinuousDetails);
    },
    onChangeCheck(val) {         // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      } else if (!val && this.queryForm.portIds.length === 0) {
        this.isAll = true;
      }
    },
    openTransfer() {             // 穿梭框方法 -- 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {    // 站点穿梭框方法 -- 获取已选站点 id 的集合
      /** 穿梭框选择站点确认后触发列表查询 */
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },
    onClickEdit(row) {
      this.$refs.dialog.openDialog(row);
    },
    onStatusClick(row) {
      this.$refs.alarmRecordDialog.openDialog(row);
    },

    /** 请求层 */
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {              // 获取列表内容
      this.loading = true;
      const { page, rows } = this.pager;
      this.queryForm.systemTypeCode = this.amcsType === 1 ? 'WaterSystem' : 'AirSystem';
      this.$http.post(this.url, this.queryForm, {
        params: {
          page,
          rows,
          sort: 'alarmTstamp-',
        },
      }).then((response) => {
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
    onQueryDocId(row) { // 导出Excel
      this.downloading = true;
      this.$http.post(`amcs/alarmRecordExcel/export/${row.id}`, this.queryData, {
        'responseType': 'blob',
        params: { sort: this.sort },
      }).then((response) => {
        const filename = `通告单-${new Date().toLocaleDateString()}-${row.psName}-${row.portName}(${row.alarmFactorName}).xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
    // // 附件问题,后期会删除,应付检查
    // onObjectIdChange(row) {
    //   this.objectId = row.id;
    // },
    // // 附件上传
    // onUpload({ file }) {
    //   const formatData = new FormData();
    //   formatData.append('file', file);
    //   this.loadStatus = true;
    //   return new Promise(() => {
    //     this.$http.post(`res/document/upload/?objectId=${this.objectId}`, formatData).then((response) => {
    //       if (response.status === 200) {
    //         this.$message.success({
    //           message: '上传成功',
    //           duration: 1500,
    //           showClose: true,
    //         });
    //         this.getItemList();
    //       } else {
    //         this.$message.warning({
    //           message: response.data.msg,
    //           duration: 1500,
    //           showClose: true,
    //         });
    //       }
    //     }, ({ response }) => {
    //       analyzeResp(response);
    //     }).finally(() => {
    //       this.loadStatus = false;
    //     });
    //   });
    // },
    // // 调取文件id接口
    // onQueryDocId(row) {
    //   this.$http.get('res/document', {
    //     params: {
    //       objectId: row.id,
    //     },
    //   }).then((response) => {
    //     if (response.status === 200) {
    //       const [first] = response.data.data;
    //       if (first) {
    //         this.onDownloadClick(first);
    //       } else {
    //         this.$message.warning({
    //           message: '文件为空',
    //           duration: 1500,
    //           showClose: true,
    //         });
    //       }
    //     } else {
    //       this.$message.warning({
    //         message: response.data.msg,
    //         duration: 1500,
    //         showClose: true,
    //       });
    //     }
    //   }, ({ response }) => {
    //     analyzeResp(response);
    //   });
    // },
    // // 下载文件
    // onDownloadClick(row) {
    //   this.$http.get(`res/document/download?id=${row.id}`, {
    //     responseType: 'blob',
    //   }).then((response) => {
    //     const isFaild = response.headers['content-type'] === 'application/json;charset=UTF-8';
    //     if (isFaild) {
    //       const reader = new FileReader();
    //       reader.onload = e => this.$message.warning(JSON.parse(e.target.result).msg);
    //       reader.readAsText(response.data);
    //     } else {
    //       const fileName = row.docName;
    //       const blob = new Blob([response.data], { type: 'application/x-xls' });
    //       if (window.navigator.msSaveOrOpenBlob) {
    //         navigator.msSaveBlob(blob, fileName);
    //       } else {
    //         const link = document.createElement('a');
    //         link.href = window.URL.createObjectURL(blob);
    //         link.download = fileName;
    //         link.click();
    //         window.URL.revokeObjectURL(link.href);
    //       }
    //     }
    //   }, (response) => {
    //     analyzeResp(response);
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
