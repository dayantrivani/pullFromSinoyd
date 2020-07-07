<template>
  <component
    v-bind:is="currentTabComponent"
    scrollbar
    type="title"
    ref="dialog"
    size="large"
    content-class=""
    :title="`${itemModel.id ? '编辑' : '新增'}企业信息`"
    @close="closeDialog"
    @change="onChangeDialog">
    <template v-if="currentTabComponent === 'el-card'" slot="header">
      <span>基本信息</span>
    </template>
    <div class="mar-y-xs mar-x-sm">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onClickSave()">保 存
      </el-button>
      <el-button
        v-if="currentTabComponent != 'el-card'"
        icon="fas fa-times"
        @click="closeDialog">关 闭
      </el-button>
      <el-button
        v-if="info"
        class="fn-right"
        type="text"
        icon="fas fa-link"
        @click="onClickDoc()">企业附件
      </el-button>
      <span class="text-info fn-right" style="line-height: 28px">
        <i class="el-icon-warning pad-r-xs"></i>若需编辑请联系管委会处理
      </span>

    </div>
    <hr class="mar-x-sm">
    <el-scrollbar
      class="hide-x"
      :style="{ 'height': currentTabComponent != 'el-card' ? '100%' : 'calc(100% - 39px)' }"
      :native="false"
      :noresize="false">
      <el-form
        :class="{ 'mar-x-sm': 1, 'mar-t-xs': currentTabComponent === 'el-card' }"
        ref="form"
        label-position="right"
        label-width="113px"
        v-loading="formLoading"
        :disabled="userType !== 'gov'"
        :model="itemModel"
        :rules="rules">
        <fieldset-flex title="基本信息">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item prop="psName" hint-down>
                <template slot="label">
                  <span>企业名称 </span>
                  <el-tooltip offset=8 effect="dark" transition placement="top-start">
                    <div slot="content">
                      <p>企业的中文名称，应使用企业的全称，应与工商部门核准的名称相同。</p>
                    </div>
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                  <span> ：</span>
                </template>
                <template v-if="userType === 'ent'">{{ itemModel.psName }}</template>
                <el-input v-else v-model="itemModel.psName" autofocus></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="社会信用代码：" prop="socialCreditCode" hint-down>
                <template v-if="userType === 'ent'">{{ itemModel.socialCreditCode }}</template>
                <el-input v-else v-model="itemModel.socialCreditCode"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="企业简称：">
                <el-input v-model="itemModel.psShortName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="污染源类别：">
                <el-select v-cloak v-model="itemModel.psClassCodeId">
                  <el-option
                    v-for="(item, index) in dict.PSClass"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="行政区域：">
                <select-tree
                  lazy
                  filterable
                  joint
                  root-key="0"
                  v-model="itemModel.regionCodeId"
                  :props="{ label: 'areaName' }"
                  :label="itemModel.regionName"
                  @change="(data, node) => { itemModel.regionName = node.label }"
                  url="sys/area"
                ></select-tree>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="注册类型：">
                <el-select v-cloak v-model="itemModel.registTypeCodeId">
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
              <el-form-item label="企业类型：" prop="dtoPSBaseInfoExtend.psBaseInfoType">
                <el-select clearable v-model="itemModel.dtoPSBaseInfoExtend.psBaseInfoType">
                  <el-option
                    v-for="(item, key) in $enum.psTypeList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="隶属关系：">
                <el-select v-cloak v-model="itemModel.subjectionRelationCodeId">
                  <el-option
                    v-for="(item, index) in dict.SubjectionRelation"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="单位类别：">
                <el-select v-cloak v-model="itemModel.unitTypeCodeId">
                  <el-option
                    v-for="(item, index) in dict.EnterpriseUnitCategory"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经度：">
                <el-input v-model="itemModel.longitude">
                  <el-button slot="append" icon="fas fa-map-marker-alt" @click="selectLngLat"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纬度：">
                <el-input v-model="itemModel.latitude">
                  <el-button slot="append" icon="fas fa-map-marker-alt" @click="selectLngLat"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="行业类别：">
                <el-select filterable clearable v-model="itemModel.industryTypeCodeId">
                  <el-option
                    v-for="(item, index) in dict.IndustryCategory"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="X坐标：">
                <el-input v-model="itemModel.longitudeOther">
                  <el-button slot="append" icon="fas fa-map-marker-alt" @click="selectLngLatXy"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Y坐标：">
                <el-input v-model="itemModel.latitudeOther">
                  <el-button slot="append" icon="fas fa-map-marker-alt" @click="selectLngLatXy"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="企业规模：">
                <el-select filterable v-model="itemModel.psScaleCodeId">
                  <el-option
                    v-for="(item, index) in dict.EnterpriseScale"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <template slot="label">
                  <span>企业分色 </span>
                  <el-tooltip offset=8 effect="dark" transition placement="top-start">
                    <div slot="content">
                      <p>化工企业必填</p>
                    </div>
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                  <span> ：</span>
                </template>
                <el-select v-cloak v-model="extendModel.entColourSeparationCodeId">
                  <el-option
                    v-for="(item, index) in dict.EnterpriseSeparation"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成立时间：">
                <el-date-picker
                  v-model="itemModel.passDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item>
                <template slot="label">
                  <span>规模情况 </span>
                  <el-tooltip offset=8 effect="dark" transition placement="top-start">
                    <div slot="content">
                      <p>年主营业务2000万以上为规模以上</p>
                    </div>
                    <i class="el-icon-info"></i>
                  </el-tooltip>
                  <span> ：</span>
                </template>
                <el-radio-group v-model.number="extendModel.scaleCondition">
                  <el-radio :label="1">规模以上</el-radio>
                  <el-radio :label="0">规模以下</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标准化等级：">
                <el-select v-cloak v-model="extendModel.standardizationLevelCodeId">
                  <el-option
                    v-for="(item, index) in dict.StandardizedGrade"
                    :key="index"
                    :label="item.dictName"
                    :value="item.rowGuid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="监管级别：" prop="attentionDegree">
                <el-select clearable v-model="itemModel.attentionDegree">
                  <el-option
                    v-for="(item, key) in $enum.AttentionDegreeList"
                    :key="key"
                    :label="item"
                    :value="key - 0">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <template slot="label">
              <span>地址 </span>
              <el-tooltip offset=8 effect="dark" transition placement="top-start">
                <div slot="content">
                  <p>企业的中文地址，应与工商营业执照等相关政府部门批准开展生产经营活动的资格文件所记载的注册地址一致</p>
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
              <span> ：</span>
            </template>
            <el-input v-model="itemModel.psAddress"></el-input>
          </el-form-item>
        </fieldset-flex>

        <fieldset-flex title="法定代表人">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="姓名：">
                <el-input v-model="itemModel.corporationName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务：">
                <el-input v-model="extendModel.legalPersonPost"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <el-input v-model="extendModel.legalPersonPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset-flex>

        <fieldset-flex title="主要负责人">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="姓名：">
                <el-input v-model="extendModel.principalPersonName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务：">
                <el-input v-model="extendModel.principalPersonPost"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <el-input v-model="extendModel.principalPersonPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset-flex>

        <fieldset-flex title="安全负责人">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="姓名：">
                <el-input v-model="extendModel.safetyPersonName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务：">
                <el-input v-model="extendModel.safetyPersonPost"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <el-input v-model="extendModel.safetyPersonPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset-flex>

        <fieldset-flex title="环保负责人">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="姓名：">
                <el-input v-model="extendModel.environmentalPersonName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务：">
                <el-input v-model="extendModel.environmentalPersonPost"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话：">
                <el-input v-model="extendModel.environmentalPersonPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset-flex>
      </el-form>
      <el-form
        ref="form2"
        class="pad-x-sm"
        label-position="right"
        label-width="201px"
        :disabled="userType !== 'gov'">
        <fieldset-flex title="企业相关属性">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="有无职业卫生信息：">
                <el-tooltip :content="extendModel.isHealthyInfo ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isHealthyInfo"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否稀缺大型应急物资或设备：">
                <el-tooltip :content="extendModel.isEmergencySupplies ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isEmergencySupplies"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有无特种设备：">
                <el-tooltip :content="extendModel.isSpecialEquipment ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isSpecialEquipment"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="有无特种作业人员：">
                <el-tooltip :content="extendModel.isSpecialOperators ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isSpecialOperators"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否涉及煤气：">
                <el-tooltip :content="extendModel.isGas ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isGas"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否属于消防重点单位：">
                <el-tooltip :content="extendModel.isFire ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isFire"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否防雷防静电：">
                <el-tooltip :content="extendModel.isLightningStaticElectricity ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isLightningStaticElectricity"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否持有放射源：">
                <el-tooltip :content="extendModel.isRadioactiveSource ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isRadioactiveSource"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否涉及危化品管道：">
                <el-tooltip :content="extendModel.isChemicalPipeline ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isChemicalPipeline"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否涉及人员密集场所：">
                <el-tooltip :content="extendModel.isCrowdedPlaces ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isCrowdedPlaces"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否涉及金属冶炼：">
                <el-tooltip :content="extendModel.isMetalSmelting ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isMetalSmelting"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否存在有限空间作业：">
                <el-tooltip :content="extendModel.isConfinedSpace ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isConfinedSpace"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否涉氨：">
                <el-tooltip :content="extendModel.isAmmonia ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isAmmonia"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>

        </fieldset-flex>
        <!-- <div class="title-info mar-b-xs">政府设定属性</div> -->
        <!-- <el-divider content-position="left">政府设定属性</el-divider> -->
        <fieldset-flex title="政府设定属性" class="mar-b-md">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="有无重大危险源：">
                <template v-if="userType === 'ent'">{{ extendModel.isMajorHazard ? '是' : '否' }}</template>
                <el-tooltip v-else :content="extendModel.isMajorHazard ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isMajorHazard"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否存在涉爆粉尘作业：">
                <template v-if="userType === 'ent'">{{ extendModel.isExplosiveDust ? '是' : '否' }}</template>
                <el-tooltip v-else :content="extendModel.isExplosiveDust ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isExplosiveDust"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否涉及危化品：">
                <template v-if="userType === 'ent'">{{ extendModel.isChemicalUsing ? '是' : '否' }}</template>
                <el-tooltip v-else :content="extendModel.isChemicalUsing ? '是' : '否'" placement="top">
                  <el-switch v-model="extendModel.isChemicalUsing"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset-flex>
      </el-form>
    </el-scrollbar>
    <dialog-modal ref="lngLatDialog" append-to-body size="middle" scrollbar>
      <iframe
        ref="iframe"
        src="selectLngLat/selectLngLat.html"
        style="width: 100%; height: calc(86vh - 60px);">
      </iframe>
    </dialog-modal>
    <doc-list ref="docList" />
  </component>
</template>

<script>
// 引入混合 - 保存记录方法
import { mapState, mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
// import { merge, cloneDeep } from 'lodash';
import formRules from './rules';
import DocList from '@/components/DocList';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  components: {
    DocList,
  },
  // 传入参数项
  props: {
    info: {
      type: Boolean,
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      url: 'bas/psBaseInfo',  // 必须, 接口地址
      itemModel: {
        dtoPSBaseInfoExtend: {
          psBaseInfoType: '',
        },
      },          // 表单对象
      extendModel: {},        // 表单实体绑定变量
      dialogHeight: '86vh',
      formEdit: false,
      // 表单验证
      rules: formRules,
      // 字典表 http://192.168.11.65:8099/frame/#/pro/dict
      dict: {
        PSClass: [],                // 污染源类别
        RegistType: [],             // 注册类型
        IndustryCategory: [],       // 行业类别
        SubjectionRelation: [],     // 隶属关系
        EnterpriseUnitCategory: [], // 单位类别
        EnterpriseScale: [],        // 企业规模
        EnterpriseSeparation: [],   // 企业分色
        StandardizedGrade: [],      // 标准化等级
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.rowGuid;
    },
    currentTabComponent() {
      return this.info ? 'el-card' : 'dialog-modal';
    },
    ...mapState(['psInfo']),
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  created() {
    if (this.userType === 'ent') {
      this.$store.dispatch('GetPsInfo', this.orgGuid).then(() => {
        this.openDialog(this.psInfo);
      });
    }
  },
  methods: {
    selectLngLat() {
      this.$refs.lngLatDialog.openDialog();
      this.$nextTick(() => {
        this.iframeWindow = this.$refs.iframe.contentWindow;
        this.iframeWindow.addEventListener('message', (event) => {
          this.itemModel.longitude = event.data.longitude;
          this.itemModel.latitude = event.data.latitude;
          this.$refs.lngLatDialog.closeDialog();
        }, false);
      });
    },
    selectLngLatXy() {
      this.$refs.lngLatDialog.openDialog();
      this.$nextTick(() => {
        this.iframeWindow = this.$refs.iframe.contentWindow;
        this.iframeWindow.addEventListener('message', (event) => {
          this.itemModel.longitudeOther = event.data.longitude;
          this.itemModel.latitudeOther = event.data.latitude;
          this.$refs.lngLatDialog.closeDialog();
        }, false);
      });
    },
    onChangeDialog(isFull) {
      this.dialogHeight = isFull ? '100vh' : '86vh';
    },
    // 获取空对象
    getEmptyItem() {
      this.extendModel = {
        psBaseInfoType: '',                   // 企业类型
        legalPersonPost: '',                  // 法定代表人姓名
        legalPersonPhone: '',                 // 法定代表人联系电话
        principalPersonName: '',              // 主要负责人姓名
        principalPersonPost: '',              // 主要负责人职务
        principalPersonPhone: '',             // 主要负责人联系电话
        safetyPersonName: '',                 // 安监负责人姓名
        safetyPersonPost: '',                 // 安监负责人职务
        safetyPersonPhone: '',                // 安监负责人联系电话
        environmentalPersonName: '',          // 环保负责人姓名
        environmentalPersonPost: '',          // 环保负责人职务
        environmentalPersonPhone: '',         // 环保负责人联系电话
        isHealthyInfo: false,                 // 有无职业卫生信息
        isEmergencySupplies: false,           // 是否稀缺大型应急物资或设备
        isSpecialEquipment: false,            // 有无特种设备
        isSpecialOperators: false,            // 有无特种作业人员
        isGas: false,                         // 是否涉及煤气
        isFire: false,                        // 是否属于消防重点单位
        isLightningStaticElectricity: false,  // 是否防雷防静电
        isRadioactiveSource: false,           // 是否持有放射源
        isChemicalPipeline: false,            // 是否涉及危化品管道
        isSecondaryEnterprise: false,         // 是否有二级企业 ?
        isMetalSmelting: false,               // 是否涉及金属冶炼
        isCrowdedPlaces: false,               // 是否涉及人员密集场所
        isConfinedSpace: false,               // 是否存在有限空间作业
        isAmmonia: false,                     // 是否涉氧
        isMajorHazard: false,                 // 有无重大危险源（政府设定属性，企业不能修改）
        isChemicalUsing: false,               // 是否涉及危化品（政府设定属性，企业不能修改）
        isExplosiveDust: false,               // 是否存在涉爆粉尘作业（政府设定属性，企业不能修改）
        entColourSeparationCodeId: '',        // 企业分色（字典表）
        standardizationLevelCodeId: '',       // 标准化等级（字典表）
        standardizedGradeName: '',            // 标准化等级名称
        scaleCondition: 0,                    // 规模情况（1规模以上、0规模以下）
      };
      return {
        psName: '',                   // 企业名称
        psType: 1,                   // 企业类型
        psShortName: '',              // 企业简称
        socialCreditCode: '',         // 社会信用代码
        psClassCodeId: '',            // 污染源类别（字典表）
        regionCodeId: '',             // 行政区域（字典表）
        regionName: '',               // 行政区域名称（字典表）
        registTypeCodeId: '',         // 注册类型（字典表）
        unitTypeCodeId: '',           // 单位类别（字典表）
        psScaleCodeId: '',            // 企业规模（字典表）
        subjectionRelationCodeId: '', // 隶属关系（字典表）
        industryTypeCodeId: '',       // 行业类别（字典表）
        passDate: '',                 // 成立时间
        longitude: '',                // 经度
        latitude: '',                 // 纬度
        longitudeOther: '',           // X坐标
        latitudeOther: '',            // Y坐标
        psAddress: '',                // 企业地址
        attentionDegree: '',          // 监管级别
        dtoPSBaseInfoExtend: this.extendModel,
      };
    },
    onClickSave() {
      this.itemModel.dtoPSBaseInfoExtend = this.extendModel;
      this.onSaveCheck(this.saveCallback);
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();

      // 是否获取单条记录
      this.getItemOne(row, (data) => {
        this.extendModel = data.dtoPSBaseInfoExtend;
      });

      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      if (this.userType === 'gov') {
        this.$refs.dialog.openDialog();
      }

      // 聚焦输入框
      this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      if (this.userType === 'gov') {
        this.$refs.dialog.closeDialog();
      }
    },
    onClickDoc() {
      this.$refs.docList.openDialog(this.psInfo.id);
    },
  },
};
</script>
