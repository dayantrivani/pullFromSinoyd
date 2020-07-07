<template>
  <el-card type="title" fill>
    <!-- 检索条件 -->
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-sm">
      <div class="fn-no-wrap">
        <el-form-item label="站点类型：" v-if="portInfo.portId === ''">
          <el-select v-model="queryForm.childPortTypes" collapse-tags multiple style="width: 150px;">
            <el-option
              v-for="item in childPortTypeList"
              :key="item.value"
              :value="+item.dictValue"
              :label="item.dictName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 多选点位 -->
        <div v-if="portInfo.portId === ''" style="display: inline-block;">
          <el-form-item label="站点：">
            <select-port
              width="180px"
              v-model="queryForm.portIds"
              filterable
              :options="portList"
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
        </div>
      </div>
      <el-form-item label="起止时间：">
        <el-date-picker
          style="width:140px"
          v-model="queryForm.fromDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>&nbsp;~
        <el-date-picker
          style="width:140px"
          v-model="queryForm.toDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="起止时间：">
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          v-model="dateRange"
          :clearable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-download" :loading="downloading" @click="onDownload">导 出</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表相关内容 -->
    <el-table
      border
      highlight-current-row
      :height="portInfo.portId === '' ? 'calc(100% - 63px)' : 'calc(100% - 30px)'"
      v-loading="loading"
      :data="itemList"
    >
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column property="sendUserName" label="发送人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column property="psName" label="企业名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column property="portName" label="排口名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column property="addDate" label="操作时间" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column
        property="cmdDesc"
        label="命令描述"
        min-width="280"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column property="releaseStatus" label="下发情况" min-width="120"></el-table-column>
      <el-table-column property="responseStatus" label="现场应答情况" min-width="120"></el-table-column>
      <el-table-column property="execState" label="最终执行情况" min-width="120"></el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <paging-query :pager="pager" @query="getItemList"></paging-query>
    <!-- 穿梭框选择点位 -->
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

export default {
  name: 'RemoteRecord',
  mixins: [queryList],
  components: { SelectPort, TransferPort },
  props: ['portList', 'portInfo'],
  data() {
    return {
      url: 'amcs/remoteControl',
      isAuto: false,
      queryForm: {                            // 查询条件
        isAll: true,
        portIds: [],
        fromDate: getDay(-2, false, false),   // 开始时间
        toDate: getDay(0, false, false),      // 结束时间
        childPortTypes: [],
        portType: 1,
      },
      downloading: false,
      childPortTypeList: [],
      pickerOneDate: '',                      // 日期控件定义变量
      pickerOptions: {                        // 日期控件方法
        onPick: ({ maxDate, minDate }) => {
          this.pickerOneDate = minDate.getTime();
          if (maxDate) {
            this.pickerOneDate = '';
          }
        },
        disabledDate: (time) => {
          if (this.pickerOneDate !== '') {
            let date = '';
            let max = '';
            let min = '';
            date = 30 * 24 * 3600000;
            max = this.pickerOneDate + date;
            min = this.pickerOneDate - date;
            return time.getTime() > max || time.getTime() < min || time.getTime() > +new Date();
          }
          return time.getTime() > +new Date();
        },
      },
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
    'queryForm.childPortTypes': function (val) {
      this.$emit('changeChildPortTypes', val);
    },
  },
  computed: {
    dateRange: {
      get() {
        return (!this.queryForm.fromDate && !this.queryForm.toDate)
          ? ''
          : [this.queryForm.fromDate, this.queryForm.toDate];
      },
      set(val) {
        [this.queryForm.fromDate, this.queryForm.toDate] = val || ['', ''];
      },
    },
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  created() {
    if (this.portInfo.portId === '') this.getChildPortTypeList();
    this.queryForm.portType = this.amcsType;
    this.queryForm.childPortTypes = this.portInfo.portId === ''
      ? this.$enum.get('CHILD_PORT_TYPES_ARR', this.amcsType) : [this.portInfo.childPortType];
    this.onQueryList();
  },
  methods: {
    onChangeCheck(val) {         // 全部站点选中后清空 querForm.portIds
      if (val) {
        this.queryForm.portIds = [];
      }
    },
    openTransfer() {             // 穿梭框方法 -- 打开穿梭框
      this.$refs.port.openDialog(this.queryForm.portIds);
    },
    getPortIdsList(portIds) {    // 站点穿梭框方法 -- 获取已选站点 id 的集合
      this.queryForm.portIds = portIds || [];
      this.onQueryList();
    },
    /** 请求层 */
    getChildPortTypeList() {     // 获取测点类型数据
      this.$http.get(`sys/enumCode/child/PortType/${this.amcsType === 1 ? 'Water' : 'Air'}`).then((response) => {
        if (response.data) {
          this.childPortTypeList = response.data || [];
          this.childPortTypeList = this.childPortTypeList.filter((n) => {
            const childPortTypesArr = this.$enum.getLabel('CHILD_PORT_TYPES_ARR', this.amcsType);
            return childPortTypesArr.includes(n.dictValue) || childPortTypesArr.includes(n.dictValue - 0);
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getItemList() {              // 获取记录列表
      const stamp = new Date(this.queryForm.toDate).getTime() - new Date(this.queryForm.fromDate).getTime();
      if (stamp > 30 * 3600 * 1000 * 24) {
        this.$message.warning('请选择30天内的时间');
      } else {
        this.loading = true;
        if (this.portInfo.portId !== '') {
          this.queryForm.isAll = false;
          this.queryForm.portIds = [this.portInfo.portId];
        }
        const { page, rows } = this.pager;
        this.$http.post(this.url, { ...this.queryForm }, {
          params: {
            page,
            rows,
            sort: 'addDate-',
          },
        }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.itemList = response.data.data;
            this.pager.count = response.data.count;
          } else {
            this.$message.warning({
              message: response.data.message,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    onDownload() {               // 下载数据
      this.downloading = true;
      this.$http.post(`${this.url}/export?sort=addDate-`, { ...this.queryForm }, {
        responseType: 'blob',
      }).then((response) => {
        const filename = `远程控制${new Date().toLocaleDateString()}.xls`;
        this.$tools.downloadFile(response, filename);
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.downloading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
