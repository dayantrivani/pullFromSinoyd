<template>
  <!-- 治理设施 -->
  <el-card class="title-card" type="title">
    <template slot="header">治理设施</template>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelClick">删 除
      </el-button>
    </div>
    <el-table
      border
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onEditClick(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-paperclip" @click="onClickUpload(scope.row)">附件</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="equipName" width="150" show-overflow-tooltip label="污染治理设施名称"></el-table-column>
      <el-table-column prop="pollutantName" width="150" show-overflow-tooltip label="处理污染物名称"></el-table-column>
      <el-table-column prop="actualEfficiency" width="140" show-overflow-tooltip label="实际处理效率"></el-table-column>
      <el-table-column prop="channelNum" show-overflow-tooltip label="通道号"></el-table-column>
      <el-table-column prop="treatmentMode" show-overflow-tooltip label="治理方法"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" title="治理设施信息" @close="resetControlDialog">
      <div>
        <div class="mar-b-sm">
          <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveControl">保 存</el-button>
          <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="controlForm" :model="itemForm" label-width="150px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="污染源：" prop="psName">
                <el-input v-model.trim="psName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理设施编码：" prop="equipCode">
                <el-input v-model.trim="itemForm.equipCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="污染治理设施名称：" prop="equipName">
                <el-input v-model.trim="itemForm.equipName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="污染类别：" prop="pollutantTypeCodeId">
                <el-select v-model="itemForm.pollutantTypeCodeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in dict.PollutionClass" :key="i"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理污染物名称：" prop="pollutantName">
                <el-select v-model="itemForm.pollutantCode" style="width:100%" @change="changePollutant">
                  <el-option v-for="(item, i) in factorList" :key="i"
                  :label="item.factorName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="处理方法：" prop="manageMethodCodeId">
                <el-select v-model="itemForm.manageMethodCodeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in dict.WaterTreatment" :key="i"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计处理能力：" prop="designDealAbility">
                <el-input-number controls-position="right" v-model="itemForm.designDealAbility"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设计月处理能力：" prop="processingPowerMonth">
                <el-input-number controls-position="right" v-model="itemForm.processingPowerMonth"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计处理效率：" prop="designEfficiency">
                <el-input-number controls-position="right" v-model="itemForm.designEfficiency"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际处理效率：" prop="actualEfficiency">
                <el-input-number controls-position="right" v-model="itemForm.actualEfficiency"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="治理设施脱硫能力：" prop="desulphurization">
                <el-input-number controls-position="right" v-model="itemForm.desulphurization"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年运行天数：" prop="yearOfRunDays">
                <el-input-number controls-position="right" v-model="itemForm.yearOfRunDays"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理设施原价：" prop="equipOriginalPrice">
                <el-input-number controls-position="right" v-model="itemForm.equipOriginalPrice"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年运行费用：" prop="yearOfRunCost">
                <el-input-number controls-position="right" v-model="itemForm.yearOfRunCost"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="处理后去向：" prop="managedDestination">
                <el-input v-model.trim="itemForm.managedDestination"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="投入使用日：" prop="runDate">
                <el-date-picker v-model="runDate" type="date" style="width:100%"
                 placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数采仪：" prop="dgiId">
                <el-select v-model="itemForm.dgiId" style="width:100%">
                  <el-option v-for="(item, i) in DGIList" :label="item.dgiMN" :value="item.id"
                  :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排向的排放口编号：" prop="outputCodeId">
                <el-input v-model.trim="itemForm.outputCodeId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设施生产商：" prop="manufacturer">
                <el-input v-model.trim="itemForm.manufacturer"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="炉窑：" prop="stoveId">
                <el-select v-model="itemForm.stoveId" style="width:100%">
                  <el-option v-for="(item, i) in furnaceList" :key="i"
                  :label="item.stoveName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="治理设施类型：" prop="treatmentFacilitiesTypeId">
                <el-select v-model="itemForm.treatmentFacilitiesTypeId" style="width:100%" filterable clearable>
                  <el-option v-for="(item, i) in dict.TreatmentType" :key="i"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理工艺：" prop="treatmentTechniques">
                <el-input v-model.trim="itemForm.treatmentTechniques"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="治理工艺设备型号：" prop="treatmentTechniquesModel">
                <el-input v-model.trim="itemForm.treatmentTechniquesModel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理方法：" prop="treatmentMode">
                <el-input v-model.trim="itemForm.treatmentMode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="SO2浓度判定上限：" prop="so2UpperLimit">
                <el-input-number controls-position="right" v-model="itemForm.so2UpperLimit"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="治理因子信息：" prop="treatmentFactors">
                <el-input v-model.trim="itemForm.treatmentFactors"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="通道号：" prop="channelNum">
                <el-input-number controls-position="right" v-model="itemForm.channelNum"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 2 }" v-model.trim="itemForm.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-modal>
    <dialog-modal ref="uploaddialog" title="治理设施"><upload :id="itemId" /></dialog-modal>
  </el-card>
</template>

<script>
import Upload from '@/components/upload';

export default {
  components: {
    Upload,
  },
  data() {
    return {
      loading: false,
      itemId: '',
      saveLoading: false,
      // 是否编辑
      isEdit: false,
      psName: '', // 企业名称
      psId: '',
      // 表单model
      itemForm: {
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
        count: 0,
        page: 1,
        rows: 15,
      },
      // 下拉数据列表
      dict: {
        PollutionClass: [], // 污染类别
        TreatmentType: [], // 治理设施类型
        WaterTreatment: [], // 处理方法下拉框数据
      },
      // 监测设施数据列表
      itemList: [],
      // 多选数组
      selectedIds: [],
      // 监测污染物列表
      factorList: [],
      // 数采仪下拉框数据
      DGIList: [],
      // 炉窑下拉框数据
      furnaceList: [],
    };
  },
  watch: {},
  created() {
    this.getItemList();
  },
  computed: {
    runDate: {
      get() {
        return this.itemForm.runDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemForm.runDate;
      },
      set(val) {
        this.itemForm.runDate = val || '1900-01-01 00:00:00';
      },
    },
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
  },
  mounted() {},
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    isEmptyObj(obj) { // 判断对象是否为空
      return Object.keys(obj).length === 0;
    },
    getDictList() { // 获取字典表数据
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    changePollutant() {   // 根据改变的处理污染物名称的代码 改变名称
      this.factorList.forEach((element) => {
        if (this.itemForm.pollutantCode === element.id) {
          this.itemForm.pollutantName = element.factorName;
        }
      });
    },
    // 处理污染物名称下拉框数据
    monitoredPollutant() {
      this.$http.get('cfg/factors', {
        params: { page: '1', rows: '1000000', factorsType: this.psInfo.psBaseInfoType },
      }).then((response) => {
        this.factorList = response.data.data;
      });
    },
    // 炉窑下拉框数据
    furnaces() {
      this.$http.get('bas/stove', {
        params: { page: '1', rows: '1000000', psId: this.psInfo.id },
      }).then((response) => {
        this.furnaceList = response.data.data;
      });
    },
    // 数采仪下拉框数据
    instrument() {
      this.$http.get('bas/dgiInfo', {
        params: { page: '1', rows: '10000000', psId: this.psInfo.id },
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
      this.onOpenDialog();
      this.psName = this.psInfo.psName;
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
          this.$refs.dialog.closeDialog();
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
      this.psName = this.psInfo.psName;
      this.isEdit = true;
      this.itemForm = {
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
      this.onOpenDialog();
    },
    onOpenDialog() {
      this.furnaces();
      this.instrument();
      this.getItemList();
      this.monitoredPollutant();
      this.getDictList();
      this.$refs.dialog.openDialog();
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/goverFacilitiesInfo', {
        params: { page: this.pager.page, rows: this.pager.rows, psId: this.psInfo.id },
      }).then((response) => {
        this.itemList = response.data.data;
        this.pager.count = response.data.count;
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
        this.$http[this.isEdit ? 'put' : 'post'](url, { psId: this.psInfo.id, ...this.itemForm })
          .then((response) => {
            if (response.data.success) {
              // this.controlVisible = false;
              this.$refs.dialog.closeDialog();
              this.getItemList();
            }
            this.$message({
              showClose: true,
              message: response.data.success ? '操作成功' : response.data.msg,
              type: response.data.success ? 'success' : 'error',
              duration: 1500,
            });
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 重置表单
    resetControlDialog() {
      this.isEdit = false;
      this.itemForm = {
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
