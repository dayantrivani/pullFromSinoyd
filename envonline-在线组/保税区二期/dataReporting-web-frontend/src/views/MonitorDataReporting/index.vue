<!-- 自行监测填报 -->
<template>
  <el-card>

    <!-- 查询表单 -->
    <template slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="时间范围：">
          <el-date-picker style="width: 220px" v-model="rangeDate" unlink-panels type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="样品类型：">
          <el-select style="width: 130px" filterable v-model="queryForm.sampleTypeCodeId"
            @change="(val) => val && this.getItemList()">
            <el-option filterable v-for="(item, index) in dict.DataReportingSampleType" :key="index"
              :label="item.dictName" :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业名称：" v-if="this.userType !== 'ent'">
          <el-tooltip placement="top-start"
            :disabled="!psBaseList.filter(v => queryForm.psIds.includes(v.psId)).map(v => v.psName).join('、')"
            :content="psBaseList.filter(v => queryForm.psIds.includes(v.psId)).map(v => v.psName).join('、')">
            <el-select multiple filterable collapse-tags style="width: 260px" v-model="queryForm.psIds">
              <el-option v-for="(item, index) in psBaseList" :key="index" :label="item.psName" :value="item.psId">
              </el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 操作按钮 -->
    <div class="mar-x-sm mar-y-xs fn-flex fn-no-wrap">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button type="danger" icon="fas fa-trash-alt" :disabled="!selectedIds.length" @click="onDeleteItem()">删 除
      </el-button>
      <div class="flex-1 text-right pad-l-sm">
        <data-upload @query="getItemList" />
        <el-button type="primary" icon="fas fa-upload" :disabled="!itemList.length" :loading="exportStatus"
          @click="onClickExport()">导 出
        </el-button>
        <el-button v-if="userType != 'ent'" type="warning" icon="fas fa-cog" @click="onClickFactor()">因子配置
        </el-button>
      </div>
    </div>

    <!-- 列表 -->
    <el-table border height="calc(100% - 70px)" v-loading="loading" :data="itemList"
      :class="{ 'mod-table-edit': 1, 'fixed2-header-height': !isRows }"
      :row-class-name="({ row, rowIndex }) => { $set(row, 'index', rowIndex) }"
      :header-cell-style="({ columnIndex }) => columnIndex >= 6 ? 'color: #409EFF !important' : ''"
      @cell-click="onCellClick" @select="onChangeCheck" @select-all="onChangeCheckAll"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column fixed align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column fixed property="psName" label="企业名称" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="portName" label="点位名称" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column fixed property="sampleTypeValue" label="样品类型" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed property="sampleTime" label="采样时间" min-width="154">
        <template slot-scope="scope">
          {{ scope.row.sampleTime | date(16 ) }}
        </template>
      </el-table-column>
      <el-table-column v-for="item in factorList" align="center" :key="item.factorCode"
        :min-width="getLabelLen(item.factorName, item.unit)" :property="item.factorCode">
        <template slot-scope="{ row }" slot="header">
          <p style="line-height: 20px">{{ item.factorName }}</p>
          <p v-show="item.unit" style="line-height: 20px">（{{ item.unit }}）</p>
          <span style="display: none">{{ row }}</span>
        </template>
        <template slot-scope="{ row, $index }">
          <el-input-number controls-position="right" v-if="cellEdit[0] === $index && cellEdit[1] === item.factorCode"
            v-model="row[item.factorCode]" :ref="`${$index}-${item.factorCode}`" :precision="2" :controls="false"
            @blur="onBlurSaveFactor(row, $index, item)">
          </el-input-number>
          <span v-else>{{ row[item.factorCode] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList" />

    <!-- 弹出框 -->
    <dialog-form ref="dialog" :factorType="queryForm.sampleTypeCodeId" @query="getItemList" />
    <select-factor ref="factor" :factorType="queryForm.sampleTypeCodeId" @query="getItemList" />
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import { queryList, deleteItem } from '@/global/libs/mixins';
import { getDay, tableTitleLen } from '@/libs/tools';
import SelectFactor from '@/components/select-factor';
import DialogForm from './components/DialogForm';
import DataUpload from './components/DataUpload';

export default {
  name: 'MonitorDataReporting',
  provide: {
    factor: this,
  },
  mixins: [
    queryList,
    deleteItem,
  ],
  components: {
    DialogForm,
    DataUpload,
    SelectFactor,
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    rangeDate: {
      get() {
        const form = this.queryForm.fromDate !== '1900-01-01 00:00:00'
          ? this.queryForm.fromDate
          : '';
        const to = this.queryForm.toDate !== '1900-01-01 00:00:00'
          ? this.queryForm.toDate
          : '';
        return [form, to];
      },
      set(val) {
        const [fromDate, toDate] = val || ['1900-01-01 00:00:00', '1900-01-01 00:00:00'];
        this.$set(this.queryForm, 'fromDate', fromDate);
        this.$set(this.queryForm, 'toDate', toDate);
      },
    },
  },
  data() {
    return {
      url: 'sm/sampleBasicData',
      itemList: [],
      itemListTemp: [],
      cellEdit: [], // 可编辑单元格定位
      psBaseList: [], // 企业列表
      factorList: [], // 因子列表
      exportStatus: false,
      // 查询表单绑定变量
      queryForm: {
        psIds: [],                                            // 企业 ids
        fromDate: getDay(-7, true),                           // 开始时间
        toDate: getDay(0, true),                              // 结束时间
        sampleTypeCodeId: '1242cffea4bb4712a11f9b0a17ae03ab', // 样品类型
      },
      // 字典数据
      dict: {
        DataReportingSampleType: [],  // 样品类型
      },
      isRows: false,
    };
  },
  created() {
    this.getDictList();
    this.getPsBaseList();
    this.getFactorList();
  },
  methods: {
    getLabelLen(label, unit) {
      const labelText = label.length > unit.length ? label : `（${unit}）`;
      return tableTitleLen(labelText);
    },
    // 单击新增回调
    onClickAdd() {
      this.$refs.dialog.openDialog();
    },
    // 单击配置因子
    onClickFactor(row) {
      this.$refs.factor.openDialog(row);
    },
    // 单击单元格获取输入焦点
    onCellClick(row, column) {
      this.cellEdit = [row.index, column.property];
      const code = this.cellEdit.join('-');
      this.$nextTick(() => {
        this.$refs[code][0].focus();
      });
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
    // 获取因子列表
    getFactorList() {
      this.$http.get('sm/sampleFactor', {
        params: { page: 1, rows: 10000, sampleTypeCodeId: this.queryForm.sampleTypeCodeId },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.factorList = response.data.data;
          this.isRows = this.factorList.every(v => !v.unit);
        }
      });
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      if (this.userType === 'ent') {
        this.queryForm.psIds = [this.orgGuid];
      }
      this.$http.post(this.url, this.queryForm, {
        params: { rows, page },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data || [];
          this.itemListTemp = JSON.parse(JSON.stringify(response.data.data));
          this.pager.count = response.data.count;
          this.getFactorList();
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
    // 保存单个因子数据
    onBlurSaveFactor(row, index, factor) {
      this.cellEdit = [];
      const factorKey = factor.factorCode;
      const oldRow = this.itemListTemp[index];
      // eslint-disable-next-line
      if (row[factorKey] == oldRow[factorKey]) {
        this.itemList[index][factorKey] = oldRow[factorKey];
        return;
      }
      const data = {
        sampleId: row.id,
        sampleTypeCodeId: row.sampleTypeCodeId,
        factorCode: factorKey,
        factorValue: row[factorKey] || '',
      };
      this.$http.post('sm/sampleFactorData', data).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '操作成功',
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
      }).finally(() => {
        this.saveLoading = false;
      });
    },
    // 导出
    onClickExport() {
      this.exportStatus = true;
      const queryForm = {
        psIds: this.userType === 'env' ? [this.orgGuid] : this.queryForm.psIds,
        sampleTypeCodeId: this.queryForm.sampleTypeCodeId,
        fromDate: this.queryForm.fromDate,
        toDate: this.queryForm.toDate,
      };
      this.$http.post('sm/sampleBasicData/export', queryForm, {
        responseType: 'arraybuffer',
      }).then((response) => {
        // const fileName = decodeURI(response.headers['content-disposition']).split('=')[1];
        // const fileName = `数据填报${new Date().getTime()}.xls`;
        const fileName = `数据填报${new Date().toLocaleDateString()}.xls`;
        const fileBlob = new Blob([response.data], { type: 'application/x-xls' });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(fileBlob, fileName);
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(fileBlob);
          link.download = fileName;
          document.body.appendChild(link);  // fix: 修复在火狐未触发下载问题
          link.click();
          window.URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.exportStatus = false;
      });
    },
  },
};
</script>
