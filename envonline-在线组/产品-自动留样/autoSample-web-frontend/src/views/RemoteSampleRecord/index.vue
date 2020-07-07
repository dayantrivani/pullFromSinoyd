<template>
  <!-- 远程留样记录 -->
  <el-card class="db">
    <!-- 查询表单 -->
    <div slot="header">
      <drop-query-form row="2" @onQueryList="onQueryList">
        <el-form inline :model="queryForm">
          <el-form-item label="时间：">
            <el-date-picker
              style="width:330px"
              v-model="date"
              unlink-panels
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="行政区：">
            <select-tree-lazy
              :label="region.regionLabel"
              placeholder="请选择行政区域"
              v-model="region.regionCodeId"
              @setLabel="setLabel"/>
          </el-form-item>
          <el-form-item label="点位：">
            <el-select
              v-model="queryForm.portIds"
              filterable
              multiple
              style="width:235px"
              class="z-pointer">
              <el-option v-for="(item, key) in portList" :key="key" :label="item.portName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-file-invoice" @click="$refs.dialog.openDialog()">站 点</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="queryForm.isAll" @change="onChangeCheck">全部站点</el-checkbox>
          </el-form-item>
          <br/>
          <el-form-item label="样品类型：">
            <el-select v-model="queryForm.sampleType">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="单样" :value="1"></el-option>
              <el-option label="时间等比" :value="2"></el-option>
              <el-option label="排放量等比" :value="3"></el-option>
              <el-option label="实时流量等比" :value="4"></el-option>
              <el-option label="液位等比" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="留样模式：">
            <el-select v-model="queryForm.sampleModule">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="定时留样" :value="1"></el-option>
              <el-option label="立即留样" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="留样结果：">
            <el-select v-model="queryForm.sampleStatus">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="失败" :value="0"></el-option>
              <el-option label="成功" :value="1"></el-option>
              <el-option label="留样中" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行状态：">
            <el-select v-model="queryForm.execFlag">
              <el-option label="全部" :value="-1"></el-option>
              <el-option label="执行中" :value="1"></el-option>
              <!-- <el-option label="待执行" :value="1"></el-option> -->
              <el-option label="已执行" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </drop-query-form>
    </div>
  <!-- 因子列表 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onCancelSample">取消远程留样</el-button>
    </div>
    <el-table
      border
      height="calc(100% - 71px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected"
      @expand-change="changeExpand">
      <el-table-column fixed type="expand">
        <template slot-scope="props">
          <el-table
            border :data="props.row.bottleStatus"
            highlight-current-row
            style="width: 660px;">
            <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
            <el-table-column prop="bottleNumber" min-width="150" label="瓶号" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="bottleSampleTime" min-width="160" label="样品时间" show-overflow-tooltip>
              <template slot-scope="props">
                <span>{{formatTime(props.row.bottleSampleTime)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="result" min-width="150" label="是否成功" show-overflow-tooltip></el-table-column>
            <el-table-column prop="describe" min-width="150" label="无效原因" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column fixed align="center" type="selection" width="37"></el-table-column>
      <el-table-column fixed align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column fixed property="regionName" min-width="80" label="行政区域" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="psName" min-width="180" label="企业名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="portName" min-width="200" label="排口名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="taskCode" min-width="150" label="任务编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="sampleTsTamp" min-width="160" label="留样时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sampleModuleName" label="留样模式" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sampleTypeName" label="样品类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="mixingTimes" label="混合次数" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sampleBottle" label="采样瓶数" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="equalRatio" label="等比量" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="mixingAmount" label="混合量" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="userName" min-width="100" label="发布人" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="execFlagName" label="执行状态" show-overflow-tooltip>
      </el-table-column>
       <el-table-column property="exeRtn" label="执行结果" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sampleStatusName" label="留样结果" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="resultDescName" label="失败原因" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" title="站点选择">
      <div class="mar-l-sm mar-y-xs">
        <el-form inline :model="queryForm">
          <el-form-item label="行政区域：">
            <select-tree-lazy
              :label="region.regionLabel"
              placeholder="行政区域"
              v-model="region.regionCodeId"
              @setLabel="setLabel"/>
          </el-form-item>
          <el-form-item style="float: right;">
            <el-button type="success" icon="fas fa-check" @click="onClickCheck">确 认</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-transfer
        v-model="queryForm.portIds"
        :titles="['待选', '已选']"
        style="height: 400px"
        :data="portList"
        :props="{
          key: 'id',
          label: 'portName'
        }">
      </el-transfer>
      <div class="pad-b-xs"></div>
    </dialog-modal>
  </el-card>
</template>

<script>
import { queryList } from '@/plugins/mixins';

export default {
  name: 'RemoteSampleRecord',
  mixins: [queryList],
  data() {
    return {
      // loading2: false, // 下拉表格加载
      isAuto: false,
      region: { // 行政区域
        regionLabel: '',
        regionCodeId: '',
      },
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)),
          'Y-m-d 00:00:00'),
        toDate: this.$hp.formatDate(new Date(), 'Y-m-d 23:59:59'),
        portIds: [],
        execFlag: -1,
        sampleType: -1,
        sampleModule: -1,
        sampleStatus: -1,
        isAll: true,
      },
      itemList: [],
      portList: [], // 点位列表
      pager: {
        page: 1,
        rows: 15,
        total: 0,
      },
    };
  },
  computed: {
    date: {
      get() {
        let date;
        if (this.queryForm.fromDate !== '' && this.queryForm.toDate !== '') {
          date = [this.queryForm.fromDate, this.queryForm.toDate];
        } else {
          date = '';
        }
        return date;
      },
      set(val) {
        if (val) {
          [this.queryForm.fromDate, this.queryForm.toDate] = val;
        } else {
          [this.queryForm.fromDate, this.queryForm.toDate] = ['', ''];
        }
      },
    },
  },
  watch: {
    'region.regionCodeId': {
      handler(val) {
        if (!val) {
          this.region.regionLabel = '';
        }
        this.queryForm.portIds = [];
        this.getPortList();
      },
      deep: true,
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
  created() {
    this.getItemList();
    this.getPortList();
  },
  methods: {
    formatTime(_str) {
      const str = _str.toString();
      const date = [];
      const time = [];
      date[0] = str.slice(0, 4);
      date[1] = str.slice(4, 6);
      date[2] = str.slice(6, 8);
      time[0] = str.slice(8, 10);
      time[1] = str.slice(10, 12);
      time[2] = str.slice(12, 14);
      return `${date.join('-')} ${time.join(':')}`;
    },
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    onMoreQuery(e) {
      if (e.target.classList.contains('fa-angle-double-down') || e.target.classList.contains('fa-angle-double-up')) {
        e.target.classList.toggle('fa-angle-double-down');
        e.target.classList.toggle('fa-angle-double-up');
      }
      const [card] = document.querySelectorAll('.db');
      card.classList.toggle('dbHeader');
      const [table] = document.querySelectorAll('.el-table');
      if (card.classList.contains('dbHeader')) {
        table.style.height = 'calc(100% - 110px)';
      } else {
        table.style.height = 'calc(100% - 78px)';
      }
    },
    setLabel(val) { // 行政区选择储存label值
      this.region.regionLabel = val;
      this.$nextTick(() => {
        // this.getPortList();
      });
    },
    onChangeCheck(val) { // 全部站点选中后清空选中排口 portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    changeExpand(row, expandedRows) {
      const flag = expandedRows.filter(n => n.id === row.id);
      if (row.bottleStatus.length === 0 && flag.length !== 0) {
        this.getResultList(row.id).then((response) => {
          // console.log(row, expandedRows, this.portList, response);
          this.$set(row, 'bottleStatus', response.data.rows || response.data.data || response.data);
        });
      }
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onClickCheck() {
      this.$refs.dialog.closeDialog();
      this.onQueryList();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.post('autoSample/remoteSampleRecord/query?sort=sampleTsTamp-', this.queryForm, {
        params: {
          page,
          rows,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.itemList.map((n) => {
            this.$set(n, 'bottleStatus', []);
            return n;
          });
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
    onCancelSample() { // 取消远程留样
    // .取消远程留样，只能针对定时留样，并且当前时间小于留样时间的才能进行取消（其实就是待处理的）
      this.$confirm('此操作将永久取消该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http.delete('autoSample/remoteSampleRecord', { data: this.selectedIds }).then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '取消成功',
              duration: 3000,
              showClose: true,
            });
            this.getItemList();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
            });
          }
        }, (response) => {
          this.$hp.resp(response);
        });
      });
    },
    // 获取下拉表格数据列表
    getResultList(recordId) {
      return new Promise((resolve) => {
        // this.loading2 = true;
        this.$http.get('autoSample/remoteSampleResult', {
          params: {
            recordId,
          },
        }).then((response) => {
          if (response.data.success) {
            resolve(response);
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
          // this.loading2 = false;
        });
      });
    },
    getPortList() {
      // this.loading = true;
      this.$http.get('bas/portInfo/queryAuthority/?'
      + 'page=1&rows=100000&key=&childPortType=4&portType=1&sort=psName%2B,portName', {
        params: {
          regionCodeId: this.region.regionCodeId,
        },
      }).then((response) => {
        if (response.data.success) {
          this.portList = response.data.rows || response.data.data || response.data;
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
  },
};
</script>

<style lang="scss">
.dbHeader {
  >.el-card__header {
    height: 72px;
  }
}
</style>
