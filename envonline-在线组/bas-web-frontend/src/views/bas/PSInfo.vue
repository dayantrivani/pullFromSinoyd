<template>
  <!-- 企业基础信息 -->
  <el-card>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="关注程度：">
          <el-select v-model="queryForm.attentionDegree">
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="(item, key) in $hp.AttentionDegreeList"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业类型：">
          <el-select v-model="queryForm.psBaseInfoType">
            <el-option label="全部" :value="-1"></el-option>
            <el-option
              v-for="(item, key) in $hp.PsBaseInfoTypeList"
              :key="key"
              :label="item"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.psName" placeholder="污染源名称" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item>
          <select-tree
            width="150"
            v-model="queryForm.industryTypeCodeId"
            placeholder="请选择行业类别"
            :options="dict.IndustryCategory"
            :props="{ parent: 'parentId', value: 'rowGuid', label: 'dictName', children: 'children' }" />
        </el-form-item>
        <el-form-item>
          <select-tree-lazy v-model="queryForm.regionCodeId" width="150" placeholder="请选择行政区域" />
        </el-form-item>
        <el-form-item>
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
    <!-- 企业信息列表 -->
    <el-table
      v-loading="loading"
      height="calc(100% - 76px)"
      border
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="onSaveSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="78">
        <template slot-scope="scope">
          <el-dropdown split-button type="primary">更多
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-paperclip" @click="onClickUpload(scope.row)">附件</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="warning" icon="fas fa-cog" @click="onClickConfig(scope.row)">配置</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" icon="fas fa-pencil-alt" @click="viewEditRecord(scope.row)">修改记录</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column property="psName" label="污染源名称" min-width='100' show-overflow-tooltip></el-table-column>
      <el-table-column property="psShortName" label="污染源简称" min-width='100' show-overflow-tooltip></el-table-column>
      <el-table-column label="关注程度">
        <template slot-scope="scope">
          {{ $hp.AttentionDegreeList[scope.row.attentionDegree] }}
        </template>
      </el-table-column>
      <el-table-column property="regionName" label="行政区域" show-overflow-tooltip></el-table-column>
      <el-table-column
        property="industryTypeName"
        label="行业类别"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="psBaseInfoType" label="企业类型">
        <template slot-scope="scope">
          {{ $hp.PsBaseInfoTypeList[scope.row.psBaseInfoType] }}
        </template>
      </el-table-column>
        <el-table-column label="密钥" width="125">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.appSecret" effect="dark" :content="scope.row.appSecret" placement="top">
              <el-button type="text"  v-copy="scope.row.appSecret">复制密钥</el-button>
            </el-tooltip>
            <el-button type="text" @click="onCreateKey(scope.row)">
              {{ scope.row.appSecret ? '重新生成' : '生成密钥' }}
            </el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <!-- 编辑表单 -->
    <dialog-modal ref="formdialog" size="large" :title="`${isEdit ? '编辑' : '新增'}企业信息`">
      <div class="box-dialog">
        <div class="mar-b-xs">
          <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
          <el-button icon="fas fa-times" @click="$refs.formdialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="form" label-width="170px" class="mar-t-sm" :model="itemModel" :rules="rules">
          <el-row>
            <el-col :span="16">
              <el-form-item label="污染源名称：" prop="psName">
                <el-input v-model="itemModel.psName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序号：" prop="orderNum">
                <el-input-number
                  style="width: 100%;"
                  v-model="itemModel.orderNum"
                  :min="0"
                  clearable
                  controls-position="right">
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="污染源简称：" prop="psShortName">
                <el-input v-model="itemModel.psShortName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="污染源编码：" prop="psCode">
                <el-input v-model="itemModel.psCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="污染源类别：">
                <el-select
                  v-model="itemModel.psClassCodeId"
                  filterable
                  clearable
                  placeholder="污染源类别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.PSClass"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="行政区域：" prop="regionCodeId">
                <select-tree-lazy v-model="itemModel.regionCodeId" @setLabel="setLabel" :label="rowRegionName"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册类型：">
                <el-select
                  v-model="itemModel.registTypeCodeId"
                  filterable
                  clearable
                  placeholder="注册类型"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.RegistType"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业类型：">
                <el-select v-model="extendModel.psBaseInfoType" style="width:100%">
                  <el-option
                    v-for="(item, key) in $hp.PsBaseInfoTypeList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="污染源规模：">
                <el-select
                  v-model="itemModel.psScaleCodeId"
                  filterable
                  clearable
                  placeholder="污染源规模"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.PollutionSourceScale"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="隶属关系：">
                <el-select
                  v-model="itemModel.subjectionRelationCodeId"
                  filterable
                  clearable
                  placeholder="隶属关系"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.SubjectionRelation"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位类别：">
                <el-select
                  v-model="itemModel.unitTypeCodeId"
                  filterable
                  clearable
                  placeholder="单位类别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.EnterpriseUnitCategory"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="建设状态：">
                <el-select v-model="itemModel.buildStatus" style="width:100%">
                  <el-option label="建设中" :value="0"></el-option>
                  <el-option label="已完成" :value="1"></el-option>
                  <el-option label="拟建" :value="2"></el-option>
                  <el-option label="关停" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投产日期：">
                <el-date-picker
                  v-model="itemModel.runDate"
                  type="date"
                  style="width:100%"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="社会信用代码：">
                <el-input :maxlength="18" v-model="itemModel.socialCreditCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="经度：">
                <el-input v-model="itemModel.longitude"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纬度：">
                <el-input v-model="itemModel.latitude"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="行业类别：">
                <select-pane
                  v-model="itemModel.industryTypeCodeId"
                  url="sys/enumCode/IndustryCategory"
                  title="行业类别"
                  size="mini"
                  :label="itemModel.industryTypeName || ''"
                  :col-width="200"
                  :col-titles="['大行业', '中行业', '小行业']"
                  @change="v => itemModel.industryTypeName = v" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="X坐标：">
                <el-input v-model="itemModel.longitudeOther"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Y坐标：">
                <el-input v-model="itemModel.latitudeOther"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成立时间：">
                <el-date-picker
                  v-model="itemModel.passDate"
                  type="date" style="width:100%"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否30万千瓦电力企业：">
                <el-select v-model="extendModel.isThirtyTenthousandkilowat" style="width:100%">
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水域功能区类别：">
                <el-select
                  v-model="extendModel.waterFunctionAreaTypeId"
                  filterable
                  clearable
                  placeholder="水域功能区类别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.WaterFunctionalArea"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关注程度：">
                <el-select
                  v-model.number="itemModel.attentionDegree"
                  clearable
                  placeholder="请选择"
                  style="width:100%">
                  <el-option
                    v-for="(item, key) in $hp.AttentionDegreeList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="气域功能区类别：">
                <el-select
                  v-model="extendModel.gasFunctionAreaTypeId"
                  filterable
                  clearable
                  placeholder="气域功能区类别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.AirFunctionArea"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否酸雨控制区：">
                <el-select v-model="extendModel.isAcidRainControlArea" style="width:100%">
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排水去向：">
                <el-input v-model="extendModel.drainageDirection"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否二氧化硫控制区：">
                <el-select v-model="extendModel.isSulfurDioxideControlArea" style="width:100%">
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="海域功能区类别：">
                <el-select
                  v-model="extendModel.seaFunctionAreaTypeId"
                  filterable
                  clearable
                  placeholder="海域功能类别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.CoastalSeaAreaEnvironmentFunctionArea"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="噪声功能区：">
                <el-select
                  v-model="extendModel.noiseFunctionAreaId"
                  filterable
                  clearable
                  placeholder="噪声功能区"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.NoiseFunctionArea"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="污水处理级别：">
                <el-select
                  v-model="extendModel.dealLevelId"
                  filterable
                  clearable
                  placeholder="污水处理级别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.SewageTreatmentLevel"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纳污区域面积：">
                <el-input v-model.number="extendModel.pollutantArea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否水源区：">
                <el-select v-model="extendModel.isWaterSourceArea" style="width:100%">
                  <el-option label="否" :value="false"></el-option>
                  <el-option label="是" :value="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="直排入海量：">
                <el-input v-model.number="extendModel.pourIntoSea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="直排入江河湖库量：">
                <el-input v-model.number="extendModel.pourIntoRiverAndLake"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="水源保护区类别：">
                <el-select
                  v-model="extendModel.wsConservationAreasTypeId"
                  filterable
                  clearable
                  placeholder="水源保护区类别"
                  style="width:100%">
                  <el-option
                    v-for="(item, index) in dict.DrinkingWaterSourceFunctionalArea"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="新鲜用水量：">
                <el-input v-model.number="extendModel.useOfFreshWater"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="重复用水量：">
                <el-input v-model.number="extendModel.reuseOfWater"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="污水排放量：">
                <el-input v-model.number="extendModel.waterEmission"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系人：">
                <el-input v-model="itemModel.contactMan"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <el-input v-model.number="itemModel.contactPhoneNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用水总量：">
                <el-input v-model.number="extendModel.totalAmountOfWater"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="达标排放量：">
                <el-input v-model.number="extendModel.standardEmission"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="地址：">
                <el-input v-model="itemModel.psAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </dialog-modal>

    <!-- 企业附件 -->
    <dialog-modal ref="uploaddialog" title="企业附件"><upload :id="itemId" /></dialog-modal>

    <!-- 修改记录 -->
    <edit-record ref="dialogItem" />
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import Upload from '@/views/bas/CommonDialog/Upload';
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';
import EditRecord from '@/components/widgets/EditRecord';
import { copyText } from '@/libs/tools';

export default {
  components: {
    Upload,
    SelectTreeLazy,
    EditRecord,
  },
  name: 'PSInfo',
  data() {
    return {
      loading: false,         // 表格数据加载状态
      saveLoading: false,     // 保存按钮点击加载状态
      itemModel: {},          // 编辑表单绑定变量
      extendModel: {},        // 表单实体绑定变量
      itemList: [],           // 数据项列表
      selectedIds: [],        // 已选择的数据 id 数组
      itemId: '',
      rowRegionName: '',
      queryForm: {            // 查询表单绑定变量
        psType: 1,
        psName: '',             // 污染源名称
        industryTypeCodeId: null, // 行业类别
        regionCodeId: '',       // 行政区域
        attentionDegree: -1,    // 关注程度
        psBaseInfoType: -1,     // 企业类型
      },
      rules: {                // 编辑表单验证规则
        psName: [
          { required: true, trigger: 'blur', message: '请填写污染源名称' },
        ],
        psCode: [
          { required: true, trigger: 'blur', message: '请填写污染源编码' },
        ],
        psShortName: [
          { required: true, trigger: 'blur', message: '请填写污染源简称' },
        ],
        regionCodeId: [
          { required: true, trigger: 'change', message: '请选择行政区域' },
        ],
      },
      pager: {},                                  // 分页
      dict: {                                     // 字典表
        PSClass: [],                                // 污染源类别
        RegistType: [],                             // 注册类型
        EnterpriseUnitCategory: [],                 // 单位类别编码
        PollutionSourceScale: [],                   // 污染源规模
        SubjectionRelation: [],                     // 隶属关系编码
        IndustryCategory: [],                       // 行业类别
        WaterFunctionalArea: [],                    // 水域功能区类别ID
        NoiseFunctionArea: [],                      // 噪声功能区ID
        AirFunctionArea: [],                        // 气域功能区类别ID
        CoastalSeaAreaEnvironmentFunctionArea: [],  // 海域功能区类别ID
        DrinkingWaterSourceFunctionalArea: [],      // 水源保护区类别ID
        SewageTreatmentLevel: [],                   // 污水处理级别ID
      },
      industryTypeCodeLabel: '',
    };
  },
  computed: {
    // 含有id, 视为编辑状态，否则为新增状态，
    isEdit() {
      return this.itemModel && this.itemModel.id;
    },
    ...mapState({
      PSHistory: state => state.psInfo.PSHistory,
    }),
  },
  created() {
    // 记录当前列表分页状态
    this.pager = this.PSHistory || { total: 0, page: 1, rows: 15 };
    this.getItemList();
    // 获取字典表数据
    this.getDictItem('IndustryCategory');
  },
  methods: {
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    setLabel(val) {
      this.itemModel.regionName = val;
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // 单击查询数据项
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取字典表数据
    getDictItem() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: key }).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 获取空项表单
    getEmptyItem() {
      this.extendModel = {
        psBaseInfoType: 1,                  // 污染源企业类型
        isThirtyTenthousandkilowat: false,  // 是否30万千瓦电力企业
        waterFunctionAreaTypeId: '',        // 水域功能区类别
        noiseFunctionAreaId: '',            // 噪声功能区
        gasFunctionAreaTypeId: '',          // 气域功能区类别
        isAcidRainControlArea: false,       // 是否酸雨控制区
        isWaterSourceArea: false,           // 是否水源区
        isSulfurDioxideControlArea: false,  // 是否二氧化硫控制区
        seaFunctionAreaTypeId: '',          // 海域功能类别
        wsConservationAreasTypeId: '',      // 水源保护区类别
        dealLevelId: '',                    // 污水处理级别
        pollutantArea: '',                  // 纳污区域面积
        drainageDirection: '',              // 排水去向
        waterEmission: '',                  // 污水排放量（万吨）
        pourIntoSea: '',                    // 直排入海量（万吨）
        pourIntoRiverAndLake: '',           // 直排入江河湖库量（万吨）
        totalAmountOfWater: '',             // 用水总量（万吨）
        useOfFreshWater: '',                // 新鲜用水量（万吨）
        euseOfWater: '',                    // 重复用水量（万吨）
        standardEmission: '',               // 达标排放量（万吨）
      };
      return {
        psName: '',                         // 污染源名称
        psType: 1,                          // 企业种类
        psShortName: '',                    // 污染源简称
        psCode: '',                         // 污染源编号
        socialCreditCode: '',               // 社会信用代码
        organizationCode: '',               // 组织机构代码
        psClassCodeId: '',                  // 污染源类别
        regionCodeId: '',                   // 行政区域
        regionName: '',                     // 行政区域名称
        registTypeCodeId: '',               // 注册类型
        unitTypeCodeId: '',                 // 单位类别
        psScaleCodeId: '',                  // 污染源规模
        subjectionRelationCodeId: '',       // 隶属关系
        industryTypeCodeId: '',             // 行业类别
        attentionDegree: '',                // 关注程度
        buildStatus: 1,                     // 建设状态
        runDate: '',                        // 投产日期
        passDate: '',                       // 成立时间
        longitude: '',                      // 经度
        latitude: '',                       // 纬度
        longitudeOther: '',                 // X坐标
        latitudeOther: '',                  // Y坐标
        contactMan: '',                     // 联系人
        contactPhoneNumber: '',             // 联系电话
        psAddress: '',                      // 地址
        dtoPSBaseInfoExtend: this.extendModel,
      };
    },
    // 单击新增按钮
    onClickAdd() {
      this.getDictItem();
      this.itemModel = this.getEmptyItem();
      this.rowRegionName = '';
      // this.formVisible = true;
      this.$refs.formdialog.openDialog();
    },
    // 单击编辑按钮
    onClickEdit(row) {
      this.getDictItem();
      this.rowRegionName = row.regionName;
      this.getItemOne(row.id, (data) => {
        this.itemModel = { ...data };
        this.itemModel.industryTypeName = row.industryTypeName;
        this.extendModel = { ...data.dtoPSBaseInfoExtend };
        // this.formVisible = true;
        this.$refs.formdialog.openDialog();
      });
    },
    // 单击上传按钮
    onClickUpload(row) {
      this.itemId = row.id;
      // this.uploadVisible = true;
      this.$refs.uploaddialog.openDialog();
    },
    // 单击配置按钮
    onClickConfig(row) {
      this.itemModel = { ...row };
      sessionStorage.setItem('psInfo', JSON.stringify(row));
      this.$store.commit('psInfo/setPSHistory', this.pager);
      this.$router.push({ name: 'PSInfoDetailProduce' });
    },
    // 生成新的密钥
    onCreateKey(row) {
      if (row.appSecret) {
        this.$confirm('将重新生成密钥?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => (
          this.$http.post('bas/psBaseInfo/ldar', {}, { params: { psId: row.psId } })
        )).then((response) => {
          const key = response.data.data.dtoPSBaseInfoExtend.appSecret;
          if (key && copyText(key)) {
            this.$message.success('重新生成成功，已复制至剪切板');
          } else {
            this.$message.success('重新生成成功！');
          }
          this.getItemList();
        });
      } else {
        this.$http.post('bas/psBaseInfo/ldar', {}, {
          params: { psId: row.psId },
        }).then((response) => {
          const key = response.data.data.dtoPSBaseInfoExtend.appSecret;
          if (key && copyText(key)) {
            this.$message.success('生成成功，已复制至剪切板');
          } else {
            this.$message.success('生成成功！');
          }
          this.getItemList();
        });
      }
    },
    // 获取单条数据
    getItemOne(id, callback) {
      this.$http.get(`bas/psBaseInfo/${id}`)
        .then((response) => {
          if (response.data.success) {
            callback(response.data.data);
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        });
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('bas/psBaseInfo/', {
        params: {
          page,
          rows,
          ...this.queryForm,
          sort: 'orderNum-,psName',
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
        const url = 'bas/psBaseInfo/';
        this.itemModel.dtoPSBaseInfoExtend = this.extendModel;
        this.$http[id ? 'put' : 'post'](url, this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '修改' : '新增'}成功`,
                duration: 1500,
                showClose: true,
              });
              this.getItemList();
              this.$refs.formdialog.closeDialog();
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
        this.$http.delete('bas/psBaseInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          if (this.pager.total <= this.pager.rows * this.pager.page) {
            this.pager.page -= 1;
          }
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    // 修改记录
    viewEditRecord(row) {
      this.$refs.dialogItem.openDialog(row);
    },
    onDialogClose() {
      this.industryTypeCodeLabel = '';
      this.rowRegionName = '';
      this.$refs.form.resetFields();
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
