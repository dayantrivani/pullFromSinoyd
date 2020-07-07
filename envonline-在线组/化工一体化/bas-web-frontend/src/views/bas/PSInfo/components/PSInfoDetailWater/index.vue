<template>
  <!-- 废水点位信息 -->
  <el-card class="title-card" type="title">
    <template slot="header">废水点位信息</template>
    <div class="mar-l-sm mar-y-xs" v-if="userType === 'gov'">
      <el-form inline :model="queryForm">
        <el-form-item label="站点名称：">
          <el-input v-model="queryForm.portName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="mar-l-sm mar-y-xs" v-if="userType === 'gov'">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <el-table
      v-if="userType === 'gov'"
      border
      height="calc(100% - 110px)"
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
              <!-- <el-dropdown-item>
                <el-button type="primary" icon="fas fa-file-invoice">评价标准</el-button>
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="primary" size="small" title="评价标准">
            <i class="fa fa-file-powerpoint-o" aria-hidden="true"></i>
          </el-button> -->
        </template>
      </el-table-column>
      <el-table-column prop="dtoPortInfo.portName" label="站点名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dtoPortInfo.portCode" label="站点编号" show-overflow-tooltip></el-table-column>
      <el-table-column label="关注程度">
        <template slot-scope="scope">
          {{ $enum.AttentionDegreeList[scope.row.dtoPortInfo.attentionDegree] }}
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
    <el-table
      v-if="userType !== 'gov'"
      border
      height="calc(100% - 32px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <!-- <el-table-column align="center" type="selection"></el-table-column> -->
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <!-- <el-table-column align="center" label="操作" width="90">
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
          <el-button type="primary" size="small" title="评价标准">
            <i class="fa fa-file-powerpoint-o" aria-hidden="true"></i>
          </el-button>
        </template>
      </el-table-column> -->
      <el-table-column prop="dtoPortInfo.portName" label="站点名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dtoPortInfo.portCode" label="站点编号" show-overflow-tooltip></el-table-column>
      <el-table-column label="关注程度">
        <template slot-scope="scope">
          {{ $enum.AttentionDegreeList[scope.row.dtoPortInfo.attentionDegree] }}
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
    <dialog-modal
      ref="dialog"
      :title="`${isEdit ? '编辑' : '新增'}废水站点信息`"
      @closed="onDialogClose"
      size="middle">
      <div class="box-dialog">
        <div class="mar-y-xs">
          <el-button type="primary" icon="fa fa-save" :loading="saveLoading" @click="onSaveItem()">保 存</el-button>
          <el-button icon="fa fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="form" label-position="right" label-width="150px" :model="portModel" :rules="rules"
           class="item-space" style="overflow-y: auto; overflow-x: hidden; height: 70vh;">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="污染源：">
                <el-input v-model="psInfo.psName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="站点简称：" prop="portShortName">
                <el-input v-model.trim="portModel.portShortName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="站点名称：" prop="portName">
                <el-input v-model.trim="portModel.portName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="站点类型：">
                <el-select v-model="itemModel.waterPortType">
                  <el-option
                    v-for="(item, key) in options.WaterPortTypeList"
                    :key="key"
                    :label="item.dictName"
                    :value="item.dictValue - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人：">
                <el-input v-model.trim="portModel.contactMan"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系方式：">
                <el-input v-model.trim="portModel.contactPhoneNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="数采仪：" prop="dgiMn">
                <el-select
                  v-model="portModel.dgiMn"
                  placeholder="数采仪"
                  filterable
                  style="width:100%"
                  @change="onChangeDgiMn">
                  <el-option v-for="(item, i) in DGIList" :label="item.dgiMN" :value="item.dgiMN" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="站点编号：">
                <el-input v-model.trim="portModel.portCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="站点位置：">
                <el-input v-model.trim="portModel.portPosition"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="进出口：">
                <el-select v-model="portModel.isOutput" style="width:100%">
                  <el-option label="出口" :value="0"></el-option>
                  <el-option label="进口" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经度：">
                <el-input v-model.trim="portModel.longitude">
                  <el-button slot="append" icon="fas fa-map-marker-alt" @click="selectLngLat"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纬度：">
                <el-input v-model.trim="portModel.latitude">
                  <el-button slot="append" icon="fas fa-map-marker-alt" @click="selectLngLat"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="状态：">
                <el-select v-model="portModel.status" placeholder="状态" style="width:100%">
                  <el-option label="停用" :value="0"></el-option>
                  <el-option label="启用" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="X坐标：">
                <el-input v-model.trim="portModel.latitudeOther"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Y坐标：">
                <el-input v-model.trim="portModel.longitudeOther"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否联网：">
                <el-select v-model="portModel.isNetWorking" placeholder="是否联网" style="width:100%">
                  <el-option label="联网" :value="0"></el-option>
                  <el-option label="不联网" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评价标准：">
                <el-select
                  v-model="portModel.evaluationId"
                  clearable
                  filterable
                  @change="onChangeEvaluate">
                  <el-option v-for="(item, i) in EvaluateList" :label="item.name" :value="item.id" :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="评价等级：">
                <el-select v-model="portModel.evaluationLevelId" filterable clearable>
                  <el-option v-for="(item, i) in EvaluateLevelList" :key="i" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="关注程度：" prop="attentionDegree">
                <el-select v-model="portModel.attentionDegree">
                  <el-option
                    v-for="(item, key) in $enum.AttentionDegreeList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水域功能区类别：">
                <el-select v-model="itemModel.functionAreaCodeId" filterable>
                  <el-option
                    v-for="(item,index) in dict.WaterFunctionalArea"
                    :key="index"
                    :label="item.dictName" :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="断面：">
                <el-select v-model="itemModel.sectionId" filterable>
                  <el-option
                    v-for="(item, i) in dict.SectionCode"
                    :key="i"
                    :label="item.dictName"
                    :value="item.id.toString()">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="标志牌安装形式：">
                <el-select v-model="itemModel.flagInstallFormCodeId" filterable>
                  <el-option
                    v-for="(item,index) in dict.FlagInstallForm"
                    :key="index"
                    :label="item.dictName" :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排放规律：">
                <el-select v-model="itemModel.letRuleCodeId" filterable>
                  <el-option
                    v-for="(item,index) in dict.OutputRule"
                    :key="index"
                    :label="item.dictName" :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="自动监控仪器名称：">
                <el-input v-model.trim="itemModel.autoMonitorInstrument"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否有流量计：">
                <el-select v-model="itemModel.haveFlowMeter">
                  <el-option label="有" :value="1"></el-option>
                  <el-option label="无" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="流域名称：">
                <select-pane
                  v-model="itemModel.valleyId"
                  url="sys/enumCode/Watershed"
                  title="受纳水体"
                  size="mini"
                  contentHeight="calc(86vh - 134px)"
                  :label="itemModel.valleyName || ''"
                  :col-width="200"
                  :col-titles="['流域', '干流', '一级支流', '二级支流', '其他河流']"
                  @change="v => itemModel.valleyName = v" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水系：">
                <el-select v-model="itemModel.waterSystemId" filterable>
                  <el-option v-for="(item, i) in optionList" :key="i" :label="item.text" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="直排/支流：">
                <el-select v-model="itemModel.flowPatternId" filterable>
                  <el-option
                    v-for="(item,index) in dict.EmissionsType"
                    :key="index"
                    :label="item.dictName" :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上传标识：">
                <el-select v-model="portModel.upLoadFlag">
                  <el-option
                    v-for="(item, key) in $enum.UpLoadFlagList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排放去向：">
                <el-select v-model="itemModel.outPutWhitherCodeId" filterable>
                  <el-option
                    v-for="(item,index) in dict.WaterDirection"
                    :key="index"
                    :label="item.dictName" :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否统计：">
                <el-select v-model="portModel.isStatistics">
                  <el-option label="不统计" :value="false"></el-option>
                  <el-option label="统计" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-modal>
    <dialog-modal ref="lngLatDialog" append-to-body size="middle" scrollbar>
      <iframe
        ref="iframe"
        src="selectLngLat/selectLngLat.html"
        style="width: 100%; height: calc(86vh - 60px);">
      </iframe>
    </dialog-modal>
  <!-- 废水点位附件 -->
    <dialog-modal ref="uploadDialog" title="废水点位附件">
      <Upload :id="portId"/>
    </dialog-modal>
    <PollutantsSet ref="pollDialog" :id="portId" :listType="1"/>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import Upload from '@/components/upload';
import PollutantsSet from '@/components/PollutantsSet';
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'PSInfoDetailWater',
  components: {
    Upload,
    PollutantsSet,
  },
  mixins: [queryList],
  data() {
    return {
      transferData: {
        width: {
          width: '18%',
        },
        title: '选择收纳水体',
        path: 'Watershed',
        text: '选中的当前流域：',
      },
      loading: false,           // 表格数据加载状态
      saveLoading: false,
      queryForm: {              // 查询表单绑定变量
        portName: '',
      },
      itemModel: {              // 编辑表单绑定变量
        dtoPortInfo: {
          portType: 1,
        },
      },
      portModel: {},            // 表单绑定变量排口信息
      portId: '',
      selectedIds: [],          // 已选择的数据 id 数组
      pager: {                  // 分页
        count: 0,
        page: 1,
        rows: 15,
      },
      optionList: [
        {
          text: '编码1',
          value: 'CODE1',
        },
        {
          text: '编码2',
          value: 'CODE2',
        },
      ],                        // 模拟选项列表，待删除
      itemList: [],             // 数据项列表
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
        // evaluationId: [
        //   { required: true, trigger: 'change', message: '请选择评价标准' },
        // ],
        // evaluationLevelId: [
        //   { required: true, trigger: 'change', message: '请选择评价等级' },
        // ],
        attentionDegree: [
          { required: true, trigger: 'change', message: '请选择关注程度' },
        ],
      },
      dict: {                   // 字典表
        WaterFunctionalArea: [],  // 水域功能区类别编码
        FlagInstallForm: [],      // 标志牌安装形式编码
        OutputRule: [],           // 排放规律编码
        // Watershed: [],            // 流域名称Id 多层级选择
        EmissionsType: [],        // 直排/支流
        WaterDirection: [],       // 排放去向编码
        SectionCode: [],          // 断面
      },
      // 同为字典表
      options: {
        WaterPortTypeList: [],    // 废水排口类型列表
      },
      DGIList: [],              // 数采仪列表
      EvaluateList: [],         // 评价标准列表
      EvaluateLevelList: [],    // 评价等级列表
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 含有id, 视为编辑状态，否则为新增状态，
    isEdit() {
      return this.itemModel && this.itemModel.id;
    },
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
  },
  created() {},
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
      this.portModel = {
        psId: this.psInfo.id,  // 污染源
        portName: '',                 // 排口名称
        portShortName: '',            // 排口简称
        portType: 1,                  // 排口类型
        isOutput: 0,                  // 进出口
        portCode: '',                 // 排口编号
        status: 1,                    // 状态
        contactMan: '',               // 联系人
        contactPhoneNumber: '',       // 联系方式
        portPosition: '',             // 排放口位置
        longitude: '',                // 经度
        latitude: '',                 // 纬度
        dgiId: '',                    // 数采仪ID
        dgiMn: '',                    // 数采仪编码
        longitudeOther: '',           // X坐标
        latitudeOther: '',            // Y坐标
        isNetWorking: 0,              // 是否联网
        evaluationId: '',             // 评价标准
        evaluationLevelId: '',        // 评价等级
        attentionDegree: 1,           // 关注程度
        upLoadFlag: 1,                // 上传标识
        isStatistics: true,           // 是否统计
      };
      return {
        functionAreaCodeId: '',       // 水域功能区类别
        sectionId: '',                // 断面
        flagInstallFormCodeId: '',    // 标志牌安装形式
        letRuleCodeId: '',            // 排放规律
        autoMonitorInstrument: '',    // 自动监控仪器名称
        haveFlowMeter: 1,             // 是否有流量计
        valleyId: '',                 // 流域名称
        waterSystemId: '',            // 水系
        flowPatternId: '',            // 直排/支流
        outPutWhitherCodeId: '',      // 排放去向
        waterPortType: 1,             // 1：废水常规，2：污水厂，3：重金属 4：留样排口
        dtoPortInfo: this.portModel,     // 排口信息
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
      this.itemModel = { ...row };
      this.portModel = { ...row.dtoPortInfo };
      this.$http.get('bas/evaluationLevel', {
        params: {
          page: 1,
          rows: 1000000,
          evaluationId: row.dtoPortInfo.evaluationId,
        },
      }).then((response) => {
        this.EvaluateLevelList = response.data.data;
      });
      this.$refs.dialog.openDialog();
    },
    onClickUpload(row) {
      this.portId = row.dtoPortInfo.id;
      this.$refs.uploadDialog.openDialog();
    },
    onClickSetting(row) {
      this.portId = row.dtoPortInfo.id;
      this.$refs.pollDialog.openDialog(this.portId);
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
    getDGIList() {},
    // 获取字典表数据
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
    getDictItem() {
      this.$http.get('bas/evaluationCriteria', {
        params: {
          page: 1,
          rows: 1000000,
        },
      }).then((response) => { // 获取评价标准下拉项
        this.EvaluateList = response.data.data;
      }, (response) => {
        analyzeResp(response);
      });
      this.$http.get('bas/dgiInfo', {
        params: {
          page: 1,
          rows: 1000000,
          psId: this.psInfo.id,
        },
      }).then((response) => { // 获取数采仪列表下拉项
        this.DGIList = response.data.data;
      }, (response) => {
        analyzeResp(response);
      });
      // 废水排口类型
      this.$http.get('sys/enumCode/child/PortType/Water').then((response) => {
        this.options.WaterPortTypeList = response.data;
      }, (response) => {
        analyzeResp(response);
      });
      this.getDictList(); // 获取后台维护常量
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/waterPortInfo/', {
        params: {
          page,
          rows,
          psId: this.psInfo.id,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
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
        const url = 'bas/waterPortInfo/';
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
        this.$http.delete('bas/waterPortInfo/', { data: this.selectedIds })
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
      this.valleyLabel = '';
      this.$refs.form.resetFields();
    },
    onClickBasin() {
      this.$refs.river.OpenBounced();
      this.$refs.river.firstGet();
    },
    labelDGI(value) {
      if (!this.DGIList.length) return value;
      return this.DGIList.find(v => v.id === value).dgiMN;
    },
    selectLngLat() {
      this.$refs.lngLatDialog.openDialog();
      this.$nextTick(() => {
        this.iframeWindow = this.$refs.iframe.contentWindow;
        this.iframeWindow.addEventListener('message', this.receiveMessage, false);
      });
    },
    receiveMessage(event) {
      this.portModel.longitude = event.data.longitude;
      this.portModel.latitude = event.data.latitude;
      this.$refs.lngLatDialog.closeDialog();
    },
  },
};
</script>

<style scoped>
hr {
    margin: 5px 0;
  }
</style>
