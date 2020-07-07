<template>
  <!-- 废气点位信息 -->
  <el-card fill>
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="排口名称：" class="mar-b-sm">
          <el-input v-model="queryForm.portName" placeholder="排口名称" clearable></el-input>
        </el-form-item>
        <el-form-item class="mar-b-sm">
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <el-table
      border
      height="calc(100% - 76px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="90">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary">更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="warning" icon="fas fa-cog" @click="onClickSetting(scope.row)">污染物设置</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-paperclip" @click="onClickUpload(scope.row)">附 件</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-file-invoice">评价标准</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="primary" size="small" title="评价标准">
            <i class="fa fa-file-powerpoint-o" aria-hidden="true"></i>
          </el-button> -->
        </template>
      </el-table-column>
      <el-table-column prop="dtoPortInfo.portName" label="排口名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dtoPortInfo.portCode" label="排口编号" show-overflow-tooltip></el-table-column>
      <el-table-column label="关注程度">
        <template slot-scope="scope">
          {{ $hp.AttentionDegreeList[scope.row.dtoPortInfo.attentionDegree] }}
        </template>
      </el-table-column>
      <el-table-column label="是否折算">
        <template slot-scope="scope">
          {{ scope.row.isConversion ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="是否超标统计" min-width="105">
        <template slot-scope="scope">
          {{ scope.row.isOverProofCount ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="dtoPortInfo.dgiMn" label="数采仪MN" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否联网">
        <template slot-scope="scope">
          {{ scope.row.dtoPortInfo.isNetWorking ? '不联网' : '联网' }}
        </template>
      </el-table-column>
      <el-table-column label="进出口">
        <template slot-scope="scope">
          {{ scope.row.dtoPortInfo.isOutput ? '进口' : '出口' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.dtoPortInfo.status ? '启用' : '停用' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" :title="`${isEdit ? '修改' : '新增'}废气排口信息`" size="large">
      <div class="box-dialog">
        <div class="mar-y-xs">
          <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
          <el-button icon="fa fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="form" label-position="right" label-width="150px" :model="portModel" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="污染源：">
                <el-input v-model="activeInfo.psName" disabled></el-input>
              </el-form-item>
              <el-form-item label="排口类型：">
                <el-select v-model="itemModel.gasPortType">
                  <el-option
                    v-for="(item, key) in options.GasPortTypeList"
                    :key="key"
                    :label="item.dictName"
                    :value="item.dictValue - 0">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排口位置：">
                <el-input v-model="portModel.portPosition"></el-input>
              </el-form-item>
              <el-form-item label="数采仪：" prop="dgiMn">
                <el-select
                  v-model="portModel.dgiMn"
                  filterable
                  placeholder="数采仪"
                  style="width:100%"
                  @change="onChangeDgiMn">
                  <el-option v-for="(item, i) in DGIList" :label="item.dgiMN" :value="item.dgiMN" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关注程度：" prop="attentionDegree">
                <el-select v-model="portModel.attentionDegree" style='width:100%'>
                  <el-option
                    v-for="(item, key) in $hp.AttentionDegreeList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传标识：">
                <el-select v-model="portModel.upLoadFlag" style='width:100%'>
                  <el-option
                    v-for="(item, key) in $hp.UpLoadFlagList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="炉窑：">
                <el-select
                  v-model="itemModel.stoveId"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width:100%">
                  <el-option
                    v-for="(item, i) in StoveList"
                    :label="item.stoveName"
                    :value="item.id"
                    :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="治理设施：">
                <el-select
                  v-model="itemModel.pteId"
                  filterable
                  clearable
                  placeholder="请选择"
                  style="width:100%">
                  <el-option
                    v-for="(item, i) in GovernList"
                    :label="item.equipName"
                    :value="item.id"
                    :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="大气压：">
                <el-input-number
                  v-model="itemModel.pressure"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
              <el-form-item label="空气过量系数：">
                <el-input-number
                  v-model="itemModel.airCoefficient"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
              <el-form-item label="净化设备名称：">
                <el-input v-model="itemModel.facilityName"></el-input>
              </el-form-item>
              <el-form-item label="联系人：">
                <el-input v-model.trim="portModel.contactMan"></el-input>
              </el-form-item>
              <el-form-item label="联系方式：">
                <el-input v-model.trim="portModel.contactPhoneNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排口简称：" prop="portShortName">
                <el-input v-model.trim="portModel.portShortName"></el-input>
              </el-form-item>
              <el-form-item label="进出口：">
                <el-select v-model="portModel.isOutput" style="width:100%">
                  <el-option label="出口" :value="0"></el-option>
                  <el-option label="进口" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：">
                <el-select v-model="portModel.status" placeholder="状态" style="width:100%">
                  <el-option label="停用" :value="0"></el-option>
                  <el-option label="启用" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="评价标准：">
                <el-select
                  v-model="portModel.evaluationId"
                  clearable
                  filterable
                  style='width:100%'
                  @change="onChangeEvaluate">
                  <el-option v-for="(item, i) in EvaluateList" :label="item.name" :value="item.id" :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="经度：">
                <el-input v-model.trim="portModel.longitude"></el-input>
              </el-form-item>
              <el-form-item label="X坐标：">
                <el-input v-model.trim="portModel.longitudeOther"></el-input>
              </el-form-item>
              <el-form-item label="烟囱：">
                <el-select
                  v-model="itemModel.chimneyId"
                  filterable
                  clearable
                  style="width:100%">
                  <el-option
                    v-for="(item, i) in ChimneyList"
                    :label="item.chimneyName"
                    :value="item.id"
                    :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运营商：">
                <el-select
                  v-model="portModel.maintainProviderId"
                  filterable
                  clearable
                  style="width:100%">
                  <el-option
                    v-for="(item ,key) in MaintainProviderList"
                    :key="key"
                    :label="item.psName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="速率：">
                <el-input-number
                  v-model="itemModel.rate"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
              <el-form-item label="净化设备制造单位：">
                <el-input v-model.trim="itemModel.facilityUnit"></el-input>
              </el-form-item>
              <el-form-item label="工艺设备名称：">
                <el-input v-model.trim="itemModel.processFacilityName"></el-input>
              </el-form-item>
              <el-form-item label="额定功率：">
                <el-input v-model.trim="itemModel.checkPower"></el-input>
              </el-form-item>
              <el-form-item label="烟道截面积：">
                <el-input-number
                  v-model="itemModel.chimneyArea"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排口名称：" prop="portName">
                <el-input v-model.trim="portModel.portName"></el-input>
              </el-form-item>
              <el-form-item label="排口编号：">
                <el-input v-model.trim="portModel.portCode"></el-input>
              </el-form-item>
              <el-form-item label="是否联网：">
                <el-select v-model="portModel.isNetWorking" style="width:100%">
                  <el-option label="联网" :value="0"></el-option>
                  <el-option label="不联网" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="评价等级：">
                <el-select v-model="portModel.evaluationLevelId" filterable style='width:100%' clearable>
                  <el-option v-for="(item, i) in EvaluateLevelList" :label="item.name" :value="item.id" :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="纬度：">
                <el-input v-model.trim="portModel.latitude"></el-input>
              </el-form-item>
              <el-form-item label="Y坐标：">
                <el-input v-model.trim="portModel.latitudeOther"></el-input>
              </el-form-item>
              <el-form-item label="是否折算：">
                <el-select v-model="itemModel.isConversion" style='width:100%'>
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否超标统计：">
                <el-select v-model="itemModel.isOverProofCount" style='width:100%'>
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="炉窑吨位：">
                <el-input-number
                  v-model="itemModel.boilerTonnage"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
              <el-form-item label="净化设备型号：">
                <el-input v-model.trim="itemModel.facilityUnitType"></el-input>
              </el-form-item>
              <el-form-item label="净化设备投运日期：">
                <el-date-picker
                  v-model="itemModel.facilityUsedate"
                  clearable
                  type="datetime"
                  style="width:100%"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="含湿量：">
                <el-input-number
                  v-model="itemModel.moistureContent"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-modal>
  <!-- 废水点位附件 -->
    <dialog-modal ref="uploadDialog" title="废气点位附件">
      <Upload :id="portId"/>
    </dialog-modal>
    <PollutantsSet ref="pollDialog" :id="portId" :listType="2"/>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import Upload from '@/views/bas/CommonDialog/Upload';
import PollutantsSet from '@/views/bas/CommonDialog/PollutantsSet';
import { queryList } from '@/plugins/mixins';

export default {
  components: {
    Upload,
    PollutantsSet,
  },
  mixins: [queryList],
  name: 'PSInfoDetailGas',
  data() {
    return {
      loading: false,           // 表格数据加载状态
      saveLoading: false,
      queryForm: {              // 查询表单绑定变量
        portName: '',
      },
      itemModel: {              // 编辑表单绑定变量
        dtoPortInfo: {
          portType: 2,
        },
      },
      portModel: {},            // 表单绑定变量排口信息
      portId: '',
      selectedIds: [],          // 已选择的数据 id 数组
      pager: {                  // 分页
        total: 0,
        page: 1,
        rows: 15,
      },
      itemList: [],             // 数据项列表
      optionList: [
        {
          text: '编码1',
          value: 'CODE1',
        },
      ],                        // 模拟选项列表，待删除
      rules: {                  // 编辑表单验证规则
        portName: [
          { required: true, trigger: 'blur', message: '请输入排口名称' },
        ],
        portShortName: [
          { required: true, trigger: 'blur', message: '请输入排口简称' },
        ],
        dgiMn: [
          { required: true, trigger: 'change', message: '请选择数采仪' },
        ],
        attentionDegree: [
          { required: true, trigger: 'change', message: '请选择关注程度' },
        ],
      },
      // 废气
      options: {
        GasPortTypeList: [],
      },
      DGIList: [],               // 数采仪列表
      StoveList: [],             // 炉窑列表
      ChimneyList: [],           // 烟囱列表
      GovernList: [],            // 治理设施列表
      MaintainProviderList: [],  // 运营商列表
      EvaluateList: [],          // 评价标准列表
      EvaluateLevelList: [],     // 评价等级列表
    };
  },
  computed: {
    // 含有id, 视为编辑状态，否则为新增状态，
    isEdit() {
      return this.itemModel && this.itemModel.id;
    },
    ...mapState({
      activeInfo: state => state.psInfo.activeInfo,
    }),
  },
  created() {
    this.getItemList();
  },
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
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.dtoPortInfo.id);
    },
    // 获取空项表单
    getEmptyItem() {
      // portInfo
      this.portModel = {
        psId: this.activeInfo.id,          // 污染源
        portName: '',                           // 排口名称
        portShortName: '',                      // 排口简称
        portType: 2,                            // 排口类型
        isOutput: 0,                            // 进出口
        isStatistics: true,                    // 是否统计
        portCode: '',                           // 排口编号
        portPosition: '',                       // 排放口位置
        status: 1,                              // 状态
        isNetWorking: 0,                        // 是否联网
        maintainProviderId: '',                 // 运营商
        dgiId: '',                              // 数采仪ID
        dgiMn: '',                              // 数采仪编码
        evaluationId: '',                       // 评价标准
        evaluationLevelId: '',                  // 评价等级
        attentionDegree: 1,                     // 关注程度
        longitude: '',                          // 经度
        latitude: '',                           // 纬度
        upLoadFlag: 0,                          // 上传标识
        longitudeOther: '',                     // X坐标
        latitudeOther: '',                      // Y坐标
      };
      return {
        stoveId: '',                            // 炉窑
        chimneyId: '',                          // 烟囱
        isConversion: false,                    // 是否折算
        pteId: '',                              // 治理设施
        isOverProofCount: false,                // 是否超标统计
        pressure: 0.00,                         // 大气压
        rate: 0.00,                             // 速率
        boilerTonnage: 0.00,                    // 炉窑吨位
        airCoefficient: 0.00,                   // 空气过量系数
        facilityUnit: '',                       // 净化设备制造单位
        facilityUnitType: '',                   // 净化设备型号
        facilityName: '',                       // 净化设备名称
        processFacilityName: '',                // 工艺设备名称
        facilityUsedate: '',                    // 净化设备投运日期
        checkPower: '',                         // 核对功率
        moistureContent: 0.00,                  // 含湿量
        contactMan: '',                         // 联系人
        contactPhoneNumber: '',                 // 联系电话
        gasPortType: 1,                         // 1：烟气，2：焚烧，3：VOC
        dtoPortInfo: this.portModel,               // 排口信息
      };
    },
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 单击新增按钮
    onClickAdd() {
      this.getDictItem();
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.openDialog();
    },
    // 单击编辑按钮
    onClickEdit(row) {
      this.getDictItem();
      this.onChangeEvaluate(row.dtoPortInfo.evaluationId);
      this.itemModel = { ...row };
      this.portModel = { ...row.dtoPortInfo };
      this.$refs.dialog.openDialog();
    },
    // 单击附件按钮
    onClickUpload(row) {
      this.portId = row.dtoPortInfo.id;
      this.$refs.uploadDialog.openDialog();
    },
    // 单击设置(污染物)按钮
    onClickSetting(row) {
      this.portId = row.dtoPortInfo.id;
      this.$refs.pollDialog.openDialog();
    },
    onChangeDgiMn(val) {
      this.portModel.dgiId = this.DGIList.find(v => v.dgiMN === val).id;
    },
    onChangeEvaluate(val) {
      this.EvaluateLevelList = [];
      this.$set(this.portModel, 'evaluationLevelId', '');
      this.$http.get('bas/evaluationLevel', {
        params: {
          page: 1,
          rows: 1000000,
          evaluationId: val,
        },
      }).then((response) => {
        this.EvaluateLevelList = response.data.data;
      });
    },
    // 获取关联数据
    getDictItem() {
      this.$store.dispatch('psInfo/GET_DGI_LIST').then((val) => {
        this.DGIList = val.data;
      });
      this.$store.dispatch('psInfo/GET_STOVE_LIST').then((val) => {
        this.StoveList = val.data;
      });
      this.$store.dispatch('psInfo/GET_CHIMNEY_LIST').then((val) => {
        this.ChimneyList = val.data;
      });
      this.$store.dispatch('psInfo/GET_GOVERN_LIST').then((val) => {
        this.GovernList = val.data;
      });
      this.$store.dispatch('psInfo/GET_DGI_LIST').then((val) => {
        this.DGIList = val.data;
      });
      this.$store.dispatch('psInfo/GET_EVALUATE_LIST').then((val) => {
        this.EvaluateList = val.data;
      });
      this.$store.dispatch('psInfo/GET_MAINTAINPROVIDER_LIST').then((val) => {
        this.MaintainProviderList = val.data;
      });
      // 废气排口类型
      this.$store.dispatch('psInfo/GET_CHILd_PORTTYPE', {
        codeValue: 'GasPortTypeList',
        type: 'Air',
      }).then((val) => {
        this.options.GasPortTypeList = val;
      });
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/gasPortInfo/', {
        params: {
          page,
          rows,
          psId: this.activeInfo.id,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.total = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        const { id } = this.itemModel;
        const url = 'bas/gasPortInfo/';
        this.itemModel.dtoPortInfo = this.portModel;
        this.$http[id ? 'put' : 'post'](url, this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '修改' : '新增'}成功`,
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              this.$refs.dialog.closeDialog();
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
    // 删除数据项
    onDeleteItem() {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/gasPortInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    onDialogClose() {
      this.$refs.form.resetFields();
    },
    labelDGI(value) {
      if (!this.DGIList.length) return value;
      return this.DGIList.find(v => v.id === value).dgiMN;
    },
    evaluationChange() {},
  },
};
</script>

<style scoped>

</style>
