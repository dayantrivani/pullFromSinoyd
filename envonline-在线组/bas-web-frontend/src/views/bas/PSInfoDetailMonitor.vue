<template>
  <!-- 监测设施 -->
  <el-card fill>
    <!-- <div slot="header" class="mar-b-sm">
      <el-button type="primary" size="small" @click="onClickAdd">
        <i class="fa fa-plus-circle" aria-hidden="true"></i> 新 增
      </el-button>
      <el-button type="danger" size="small" @click="onDelClick">
        <i class="fa fa-trash-o" aria-hidden="true"></i> 删 除
      </el-button>
    </div> -->
    <div slot="header" class="mar-b-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelClick">删 除
      </el-button>
    </div>
    <!-- <el-table :data="monitorList" border stripe
    @selection-change="onSaveSelected" v-loading="loading"> -->
    <el-table
      v-loading="loading"
      height="calc(100% - 36px)"
      :data="monitorList"
      border
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onEditClick(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-paperclip" @click="onClickUpload(scope.row)">附件</el-button>
        </template>
      </el-table-column>
      <!-- <el-button type="primary" size="small" title="编辑" @click="onEditClick(scope.row)">
        <i class="fa fa-pencil" aria-hidden="true"></i>
      </el-button>
      <el-button type="primary" size="small" title="附件" @click="onClickUpload(scope.row)">
        <i class="fa fa-paperclip" aria-hidden="true"></i>
      </el-button> -->
      <el-table-column prop="monitorCode" width="140" show-overflow-tooltip label="监测仪器编号"></el-table-column>
      <el-table-column prop="monitorName" width="140" show-overflow-tooltip label="监测仪器名称"></el-table-column>
      <el-table-column prop="monitorModel" width="140" show-overflow-tooltip label="监测仪器型号"></el-table-column>
      <el-table-column prop="contact" show-overflow-tooltip label="联系人"></el-table-column>
      <el-table-column prop="contactPhone" show-overflow-tooltip label="联系电话"></el-table-column>
      <el-table-column prop="channelNum" show-overflow-tooltip label="通道号"></el-table-column>
      <el-table-column prop="remark" show-overflow-tooltip label="备注"></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="formdialog" size="large" :title="`${isEdit ? '编辑' : '新增'}监测设施信息`"  @close="resetMonitorDialog">
      <div class="box-dialog">
        <div class="mar-b-sm">
          <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveMonitor">保 存</el-button>
          <el-button icon="fas fa-times" @click="$refs.formdialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="monitorForm" :model="monitorModel" label-width="140px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="污染源：">
                <el-input v-model.trim="psName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="监测仪器编号：" prop="monitorCode">
                <el-input v-model.trim="monitorModel.monitorCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="监测仪器名称：" prop="monitorName">
                <el-input v-model.trim="monitorModel.monitorName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数采仪：" prop="dgiId">
                <el-select v-model="monitorModel.dgiId" style="width:100%">
                  <el-option v-for="(item, i) in DGIList" :label="item.dgiMN"
                  :value="item.id" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="监测仪器型号：" prop="monitorModel">
                <el-input v-model.trim="monitorModel.monitorModel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排放口类型：" prop="monitorOutputType">
                <el-select v-model="monitorModel.monitorOutputType"
                @change="emissionsChange"
                style="width:100%">
                  <el-option v-for="(item, i) in monitorOutputTypeList" :label="item.label" :value="item.value"
                  :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所监测污染物：" prop="monitorPollutantId">
                <el-select v-model="monitorModel.monitorPollutantId" style="width:100%">
                  <el-option v-for="(item, i) in contaminantList" :label="item.factorName" :value="item.id"
                  :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="监测仪器类型：" prop="montiorTypeId">
                <el-select v-model="monitorModel.montiorTypeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in instrumentTypeList" :label="item.dictName" :value="item.rowGuid"
                  :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所监测排放口：" prop="monitorOutputId">
                <el-select v-model="monitorModel.monitorOutputId" style="width:100%">
                  <el-option v-for="(item, i) in outputPortList" :label="item.portName" :value="item.id"
                  :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否在线：" prop="isOnline">
                <el-select v-model="monitorModel.isOnline" style="width:100%">
                  <el-option label="在线" :value="0"></el-option>
                  <el-option label="不在线" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="量程单位：" prop="measureUnit">
                <el-input v-model="monitorModel.measureUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最小里程：" prop="measureMin">
                <!-- 正整数 -->
                <el-input-number
                  v-model="monitorModel.measureMin"
                  controls-position="right"
                  :min="0"
                  :max="10 ** 9 - 0.001"
                  :precision="3"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="最大里程：" prop="measureMax">
                <!-- 正整数 -->
                <el-input-number
                  v-model="monitorModel.measureMax"
                  controls-position="right"
                  :min="0"
                  :max="10 ** 9 - 0.001"
                  :precision="3"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用人：" prop="getter">
                <el-input v-model.trim="monitorModel.getter"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="领用单位：" prop="getterUnit">
                <el-input v-model.trim="monitorModel.getterUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用日期：" prop="getDate">
                <el-date-picker v-model="monitorModel.getDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="启用日期：" prop="firstRunDate">
                <el-date-picker v-model="monitorModel.firstRunDate" type="date" value-format="yyyy-MM-dd HH:mm:ss"
                style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂家：" prop="manufacturer">
                <el-input v-model.trim="monitorModel.manufacturer"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="contact">
                <el-input v-model.trim="monitorModel.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="contactPhone">
                <el-input v-model.trim="monitorModel.contactPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运维单位：" prop="operateMaintenanceUnit">
                <el-input v-model.trim="monitorModel.operateMaintenanceUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运维单位联系人：">
                <el-input v-model="monitorModel.operateMaintenanceContact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运维单位联系电话：" prop="operateMaintenanceContactPhone">
                <el-input v-model="monitorModel.operateMaintenanceContactPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-select v-model="monitorModel.status" style="width:100%">
                  <el-option label="停用" :value="0"></el-option>
                  <el-option label="启用" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="通道号：" prop="channelNum">
                <!-- 正整数 -->
                <el-input-number
                  v-model="monitorModel.channelNum"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2 }" v-model.trim="monitorModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </dialog-modal>
    <!-- 企业附件 -->
    <!-- <el-dialog
      title="监测设施"
      width="70%" top="10vh"
      :visible.sync="uploadVisible"
      :close-on-click-modal="false">
      <Upload :id="itemId"/>
    </el-dialog> -->
    <dialog-modal ref="uploaddialog" title="监测设施附件"><upload :id="itemId" /></dialog-modal>
  </el-card>
</template>

<script>
// import PagingQuery from '@/components/widgets/PagingQuery';
import Upload from '@/views/bas/CommonDialog/Upload';

export default {
  name: 'PSInfoDetailMonitor',
  components: {
    Upload,
    // PagingQuery,
  },
  data() {
    return {
      itemId: '',
      loading: false, // 表格数据加载状态
      saveLoading: false,
      outputPortList: [],
      // 表单dialog
      // monitorVisible: false,
      // 是否编辑
      isEdit: false,
      monitorOutputTypeList: [
        { value: 1, label: '废水' },
        { value: 2, label: '废气' },
        { value: 3, label: '固废' },
        { value: 4, label: '噪声' },
      ],
      psId: '', // 弹框中污染源id
      psName: '', // 污染源名称
      // 表单model
      monitorModel: {
        dgiId: '',                          // 数采仪id
        monitorCode: '',                    // 监测仪器编号
        monitorName: '',                    // 监测仪器名称
        monitorModel: '',                   // 监测仪器型号
        montiorTypeId: '',                  // 监测仪器类型（常量id）
        monitorOutputType: 1,               // 排放口类型（1：废水， 2：废气， 3：固废， 4：噪声）
        monitorOutputId: '',                // 所监测排放口id
        monitorPollutantId: '',             // 所监测污染物id
        measureUnit: '',                    // 量程单位
        measureMin: '',                      // 最小量程
        measureMax: '',                      // 最大量程
        getter: '',                         // 领用人
        getterUnit: '',                     // 领用人单位
        getDate: '',                        // 领用日期
        firstRunDate: '',                   // 启用日期
        manufacturer: '',                   // 生产厂家
        contact: '',                        // 联系人
        contactPhone: '',                   // 联系电话
        operateMaintenanceUnit: '',         // 运维单位
        operateMaintenanceContact: '',      // 运维单位联系人
        operateMaintenanceContactPhone: '', // 运维单位联系人电话
        channelNum: '',                      // 通道号
        remark: '',                         // 备注
        isOnline: '',                        // 是否在线（0：在线，1：不在线）
        status: '',                          // 在线
      },
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      rules: {
        monitorCode: [
          { required: true, message: '监测仪器编号不能为空', trigger: 'blur' },
        ],
        monitorOutputId: [
          { required: true, message: '请选择所监测排放口', trigger: 'blur' },
        ],
        dgiId: [
          { required: true, message: '请选择数采仪', trigger: 'blur' },
        ],
      },
      // 监测设施数据列表
      monitorList: [],
      // 多选数组
      monitorSelection: [],
      selectedIds: [],
      // 监测污染物列表
      contaminantList: [],
      // 行id
      rowId: '',
      // 附件dialog
      // uploadVisible: false,
      // 数采仪下拉框数据
      DGIList: [],
      // 监测仪器类型下拉框数据
      instrumentTypeList: [],
    };
  },
  computed: {
    activeInfo() {
      return this.$store.state.psInfo.activeInfo;
    },
  },
  watch: {},
  created() {
    this.getItemList();
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'MonitoringInstrumentType' }).then((val) => {
      this.instrumentTypeList = val;
    });
    this.instrument();
    this.monitoredPollutant();
    this.dischargeOutletMonitored();
  },
  mounted() {},
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    emissionsChange() {
      this.monitoredPollutant();
      this.dischargeOutletMonitored();
      this.monitorModel.monitorPollutantId = '';
      this.monitorModel.monitorOutputId = '';
    },
    // 数采仪
    instrument() {
      this.$http.get('bas/dgiInfo', {
        params: { page: '', rows: '', psId: this.$store.state.psInfo.activeInfo.id },
      }).then((response) => {
        this.DGIList = response.data.data;
      });
    },
    // 所监测污染物下拉数据
    monitoredPollutant() {
      this.$http.get('cfg/factors', {
        params: {
          page: '',
          rows: '',
          factorsType: '1',
          category: this.monitorModel.monitorOutputType,
        },
      }).then((response) => {
        this.contaminantList = response.data.data;
      });
    },
    // 所监测排放口下拉数据
    dischargeOutletMonitored() {
      this.$http.get('bas/portInfo/', {
        params: {
          page: 1,
          rows: 100000,
          portType: this.monitorModel.monitorOutputType,
          psId: this.$store.state.psInfo.activeInfo.id,
        },
      }).then((response) => {
        this.outputPortList = response.data.data;
      });
    },
    // 表格选中
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // 删除
    onDelClick() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择要删除的数据');
        return;
      }
      this.$confirm('是否删除选中的数据？', '请确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/monitorInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$refs.formdialog.closeDialog();
          this.getItemList();
        }
        this.$message({
          showClose: true,
          message: response.data.success ? '删除成功' : response.data.msg,
          type: response.data.success ? 'success' : 'error',
          duration: 1500,
        });
      });
    },
    // 新增
    onClickAdd() {
      this.isEdit = false;
      // this.monitorVisible = true;
      this.$refs.formdialog.openDialog();
      this.psName = this.activeInfo.psName;
    },
    // 编辑
    onEditClick(row) {
      this.isEdit = true;
      // this.monitorVisible = true;
      this.$refs.formdialog.openDialog();
      this.psName = this.activeInfo.psName;
      this.monitorModel = {
        id: row.id,
        psId: row.psId,
        dgiId: row.dgiId,
        monitorCode: row.monitorCode,
        monitorName: row.monitorName,
        monitorModel: row.monitorModel,
        montiorTypeId: row.montiorTypeId,
        monitorOutputType: row.monitorOutputType,
        monitorOutputId: row.monitorOutputId,
        monitorPollutantId: row.monitorPollutantId,
        measureUnit: row.measureUnit,
        measureMin: row.measureMin,
        measureMax: row.measureMax,
        getter: row.getter,
        getterUnit: row.getterUnit,
        getDate: row.getDate,
        firstRunDate: row.firstRunDate,
        manufacturer: row.manufacturer,
        contact: row.contact,
        contactPhone: row.contactPhone,
        operateMaintenanceUnit: row.operateMaintenanceUnit,
        operateMaintenanceContact: row.operateMaintenanceContact,
        operateMaintenanceContactPhone: row.operateMaintenanceContactPhone,
        channelNum: row.channelNum,
        remark: row.remark,
        isOnline: row.isOnline,
        status: row.status,
      };
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/monitorInfo', {
        params: { page: this.pager.page, rows: this.pager.rows, psId: this.activeInfo.id },
      }).then((response) => {
        this.monitorList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存
    onSaveMonitor() {
      this.$refs.monitorForm.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const url = 'bas/monitorInfo/';
        this.$http[this.isEdit ? 'put' : 'post'](url, { psId: this.activeInfo.id, ...this.monitorModel })
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: '操作成功',
                duration: 1500,
                showClose: true,
              });
              this.$refs.formdialog.closeDialog();
              this.getItemList();
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 1500,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 重置表单
    resetMonitorDialog() {
      this.isEdit = false;
      this.monitorModel = {
        dgiId: '',
        monitorCode: '',
        monitorName: '',
        monitorModel: '',
        montiorTypeId: '',
        monitorOutputType: null,
        monitorOutputId: '',
        monitorPollutantId: '',
        measureUnit: '',
        measureMin: '',
        measureMax: '',
        getter: '',
        getterUnit: '',
        getDate: '',
        firstRunDate: '',
        manufacturer: '',
        contact: '',
        contactPhone: '',
        operateMaintenanceUnit: '',
        operateMaintenanceContact: '',
        operateMaintenanceContactPhone: '',
        channelNum: '',
        remark: '',
        isOnline: '',
        status: '',
      };
      this.$refs.monitorForm.resetFields();
    },
    // 单击上传按钮
    onClickUpload(row) {
      this.itemId = row.id;
      // this.uploadVisible = true;
      this.$refs.uploaddialog.openDialog();
    },
  },
};
</script>

<style scoped>
  .box-dialog {
    width: calc(100% - 5px);
    height: 100%;
    padding-right: 5px;
    overflow-y: auto;
  }
  hr {
    margin: 5px 0;
  }
</style>
