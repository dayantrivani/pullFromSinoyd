<template>
  <!-- 治理设施 -->
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
    <!-- <el-table :data="controlList" border stripe @selection-change="onSaveSelected"> -->
    <el-table
      v-loading="loading"
      height="calc(100% - 36px)"
      :data="controlList"
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
      <el-table-column prop="equipName" width="150" show-overflow-tooltip label="污染治理设施名称"></el-table-column>
      <el-table-column prop="pollutantName" width="150" show-overflow-tooltip label="处理污染物名称"></el-table-column>
      <el-table-column prop="actualEfficiency" width="140" show-overflow-tooltip label="实际处理效率"></el-table-column>
      <el-table-column prop="channelNum" show-overflow-tooltip label="通道号"></el-table-column>
      <el-table-column prop="treatmentMode" show-overflow-tooltip label="治理方法"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="formdialog" :title="`${isEdit ? '编辑' : '新增'}治理设施信息`" @close="resetControlDialog">
      <div class="box-dialog">
        <div class="mar-b-sm">
          <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveControl">保 存</el-button>
          <el-button icon="fas fa-times" @click="$refs.formdialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="controlForm" :model="controlModel" label-width="150px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="污染源：" prop="psName">
                <el-input v-model.trim="psName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理设施编码：" prop="equipCode">
                <el-input v-model.trim="controlModel.equipCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="污染治理设施名称：" prop="equipName">
                <el-input v-model.trim="controlModel.equipName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="污染类别：" prop="pollutantTypeCodeId">
                <el-select v-model="controlModel.pollutantTypeCodeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in pollutionTypeList" :key="i"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理污染物名称：" prop="pollutantName">
                <el-select v-model="controlModel.pollutantCode" style="width:100%" @change="changePollutant">
                  <el-option v-for="(item, i) in factorList" :key="i"
                  :label="item.factorName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理方法：" prop="manageMethodCodeId">
                <el-select v-model="controlModel.manageMethodCodeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in dealMethodList" :key="i"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计处理能力：" prop="designDealAbility">
                <el-input-number
                  v-model="controlModel.designDealAbility"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设计月处理能力：" prop="processingPowerMonth">
                <el-input-number
                  v-model="controlModel.processingPowerMonth"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计处理效率：" prop="designEfficiency">
                <el-input-number
                  v-model="controlModel.designEfficiency"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际处理效率：" prop="actualEfficiency">
                <el-input-number
                  v-model="controlModel.actualEfficiency"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="治理设施脱硫能力：" prop="desulphurization">
                <el-input-number
                  v-model="controlModel.desulphurization"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年运行天数：" prop="yearOfRunDays">
                <!-- 正整数 -->
                <el-input-number
                  v-model="controlModel.yearOfRunDays"
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理设施原价：" prop="equipOriginalPrice">
                <el-input-number
                  v-model="controlModel.equipOriginalPrice"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年运行费用：" prop="yearOfRunCost">
                <el-input-number
                  v-model="controlModel.yearOfRunCost"
                  controls-position="right"
                  :precision="3"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理后去向：" prop="managedDestination">
                <el-input v-model.trim="controlModel.managedDestination"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投入使用日：" prop="runDate">
                <el-date-picker v-model="controlModel.runDate" type="date" style="width:100%"
                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数采仪：" prop="dgiId">
                <el-select v-model="controlModel.dgiId" style="width:100%">
                  <el-option v-for="(item, i) in DGIList" :label="item.dgiMN" :value="item.id"
                  :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排向的排放口编号：" prop="outputCodeId">
                <el-input v-model.trim="controlModel.outputCodeId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设施生产商：" prop="manufacturer">
                <el-input v-model.trim="controlModel.manufacturer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="炉窑：" prop="stoveId">
                <el-select v-model="controlModel.stoveId" style="width:100%">
                  <el-option v-for="(item, i) in furnaceList" :key="i"
                  :label="item.stoveName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="治理设施类型：" prop="treatmentFacilitiesTypeId">
                <el-select v-model="controlModel.treatmentFacilitiesTypeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in facilityTypeList" :key="i"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理工艺：" prop="treatmentTechniques">
                <el-input v-model.trim="controlModel.treatmentTechniques"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="治理工艺设备型号：" prop="treatmentTechniquesModel">
                <el-input v-model.trim="controlModel.treatmentTechniquesModel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理方法：" prop="treatmentMode">
                <el-input v-model.trim="controlModel.treatmentMode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="SO2浓度判定上限：" prop="so2UpperLimit">
                <el-input-number
                  v-model="controlModel.so2UpperLimit"
                  controls-position="right"
                  :precision="2"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理因子信息：" prop="treatmentFactors">
                <el-input v-model.trim="controlModel.treatmentFactors"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="通道号：" prop="channelNum">
                <!-- 正整数 -->
                <el-input-number
                  v-model="controlModel.channelNum"
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
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 2 }" v-model.trim="controlModel.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-modal>
    <dialog-modal ref="uploaddialog" title="治理设施附件"><upload :id="itemId" /></dialog-modal>
  </el-card>
</template>

<script>
import Upload from '@/views/bas/CommonDialog/Upload';

export default {
  components: {
    Upload,
  },
  data() {
    return {
      loading: false,
      itemId: '',
      saveLoading: false,
      // 表单dialog
      // controlVisible: false,
      // 是否编辑
      isEdit: false,
      controlOutputTypeList: [
        { value: 0, label: '废水' },
        { value: 1, label: '烟气' },
      ],
      psName: '', // 企业名称
      psId: '',
      // 表单model
      controlModel: {
        equipCode: '',                 // 治理设施编号
        equipName: '',                 // 污染治理设施名称
        pollutantTypeCodeId: '',       // 污染类别ID(常量)
        pollutantCode: '',             // 处理污染物代码
        pollutantName: '',             // 处理污染物名称
        manageMethodCodeId: '',        // 处理方法ID(常量)
        designDealAbility: '',          // 设计处理能力
        processingPowerMonth: '',       // 设计月处理能力
        designEfficiency: '',           // 设计处效率
        actualEfficiency: '',           // 实测处理效率
        desulphurization: '',           // 治理设施脱硫能力
        yearOfRunDays: '',              // 年运行天数
        equipOriginalPrice: '',         // 处理设施原价
        yearOfRunCost: '',              // 年运行费用
        managedDestination: '',        // 处理后去向
        runDate: '',                   // 投入使用日
        dgiId: '',                     // 数采仪编码
        channelNum: '',                 // 通道号
        outputCodeId: '',                // 排向的排放口编号
        manufacturer: '',              // 设备生产商
        stoveId: '',                   // 炉窑ID
        treatmentFacilitiesTypeId: '', // 治理设施类型（脱硫、除尘）常量
        treatmentTechniques: '',       // 治理工艺
        treatmentTechniquesModel: '',  // 治理工艺设备型号
        treatmentMode: '',             // 治理方法
        so2UpperLimit: '',              // SO2浓度判断上限
        treatmentFactors: '',          // 治理因子信息（多因子名称）
        remark: '',                    // 备注
      },
      rules: {
        equipName: [
          { required: true, message: '污染治理设施名称不能为空', trigger: 'blur' },
        ],
        equipCode: [
          { required: true, message: '治理设施编码不能为空', trigger: 'blur' },
        ],
        dgiId: [
          { required: true, message: '请选择数采仪', trigger: 'blur' },
        ],
        stoveId: [
          { required: true, message: '请选择炉窑', trigger: 'blur' },
        ],
      },
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      // 污染类别数据
      pollutionTypeList: [],
      // 监测设施数据列表
      controlList: [],
      // 多选数组
      selectedIds: [],
      // 监测污染物列表
      factorList: [],
      // 附件dialog
      // uploadVisible: false,
      // 处理方法下拉框数据
      dealMethodList: [],
      // 数采仪下拉框数据
      DGIList: [],
      // 炉窑下拉框数据
      furnaceList: [],
      // 治理设施类型下拉框数据
      facilityTypeList: [],
    };
  },
  // props: {
  //   PSId: String,
  //   psId: String,
  // },
  watch: {},
  created() {
    this.furnaces();
    this.instrument();
    this.getItemList();
    this.monitoredPollutant();
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'PollutionClass' }).then((val) => { // 污染类别
      this.pollutionTypeList = val;
    });
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'TreatmentType' }).then((val) => { // 治理设施类型
      this.facilityTypeList = val;
    });
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'WaterTreatment' }).then((val) => {
      this.dealMethodList = val;
    });
  },
  computed: {
    activeInfo() {
      return this.$store.state.psInfo.activeInfo;
    },
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
    changePollutant() {   // 根据改变的处理污染物名称的代码 改变名称
      this.factorList.forEach((element) => {
        if (this.controlModel.pollutantCode === element.id) {
          this.controlModel.pollutantName = element.factorName;
        }
      });
    },
    // 处理污染物名称下拉框数据
    monitoredPollutant() {
      this.$http.get('cfg/factors', {
        params: { page: '', rows: '', factorsType: this.$store.state.psInfo.activeInfo.psBaseInfoType },
      }).then((response) => {
        this.factorList = response.data.data;
      });
    },
    // 炉窑下拉框数据
    furnaces() {
      this.$http.get('bas/stove', {
        params: { page: '', rows: '', psId: this.$store.state.psInfo.activeInfo.id },
      }).then((response) => {
        this.furnaceList = response.data.data;
      });
    },
    // 数采仪下拉框数据
    instrument() {
      this.$http.get('bas/dgiInfo', {
        params: { page: '', rows: '', psId: this.$store.state.psInfo.activeInfo.id },
      }).then((response) => {
        this.DGIList = response.data.data;
      });
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview() {},
    // 文件列表移除文件时的钩子
    handleRemove() {},
    // 删除文件之前的钩子
    beforeRemove() {},
    // 文件超出个数限制时的钩子
    handleExceed() {},
    // 表格选中
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // 新增
    onClickAdd() {
      this.isEdit = false;
      // this.controlVisible = true;
      this.$refs.formdialog.openDialog();
      this.psName = this.activeInfo.psName;
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
        this.$http.delete('bas/goverFacilitiesInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          // this.controlVisible = false;
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
    // 编辑
    onEditClick(row) {
      this.psName = this.activeInfo.psName;
      this.isEdit = true;
      this.controlModel = {
        id: row.id,
        psId: row.psId,
        equipCode: row.equipCode,
        equipName: row.equipName,
        pollutantTypeCodeId: row.pollutantTypeCodeId,
        pollutantCode: row.pollutantCode,
        pollutantName: row.pollutantName,
        manageMethodCodeId: row.manageMethodCodeId,
        designDealAbility: row.designDealAbility,
        processingPowerMonth: row.processingPowerMonth,
        designEfficiency: row.designEfficiency,
        actualEfficiency: row.actualEfficiency,
        desulphurization: row.desulphurization,
        yearOfRunDays: row.yearOfRunDays,
        equipOriginalPrice: row.equipOriginalPrice,
        yearOfRunCost: row.yearOfRunCost,
        managedDestination: row.managedDestination,
        runDate: row.runDate,
        dgiId: row.dgiId,
        channelNum: row.channelNum,
        outputCodeId: row.outputCodeId,
        manufacturer: row.manufacturer,
        stoveId: row.stoveId,
        treatmentFacilitiesTypeId: row.treatmentFacilitiesTypeId,
        treatmentTechniques: row.treatmentTechniques,
        treatmentTechniquesModel: row.treatmentTechniquesModel,
        treatmentMode: row.treatmentMode,
        so2UpperLimit: row.so2UpperLimit,
        treatmentFactors: row.treatmentFactors,
        remark: row.remark,
      };
      // this.controlVisible = true;
      this.$refs.formdialog.openDialog();
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/goverFacilitiesInfo', {
        params: { page: this.pager.page, rows: this.pager.rows, psId: this.activeInfo.id },
      }).then((response) => {
        this.controlList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存
    onSaveControl() {
      this.$refs.controlForm.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const url = 'bas/goverFacilitiesInfo';
        this.$http[this.isEdit ? 'put' : 'post'](url, { psId: this.activeInfo.id, ...this.controlModel })
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
    resetControlDialog() {
      this.isEdit = false;
      this.controlModel = {
        equipCode: '',
        equipName: '',
        pollutantTypeCodeId: '',
        pollutantCode: '',
        pollutantName: '',
        manageMethodCodeId: '',
        designDealAbility: '',
        processingPowerMonth: '',
        designEfficiency: '',
        actualEfficiency: '',
        desulphurization: '',
        yearOfRunDays: '',
        equipOriginalPrice: '',
        yearOfRunCost: '',
        managedDestination: '',
        runDate: '',
        dgiId: '',
        channelNum: '',
        outputCodeId: '',
        manufacturer: '',
        stoveId: '',
        treatmentFacilitiesTypeId: '',
        treatmentTechniques: '',
        treatmentTechniquesModel: '',
        treatmentMode: '',
        so2UpperLimit: '',
        treatmentFactors: '',
        remark: '',
      };
      this.$refs.controlForm.resetFields();
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
