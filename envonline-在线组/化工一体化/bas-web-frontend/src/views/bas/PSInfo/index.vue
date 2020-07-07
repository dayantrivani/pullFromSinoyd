<template>
  <el-row :gutter="$config.space" v-resize>
    <el-col :span="5">
      <el-card type="title">
        <div v-if="userType !== 'ent'" slot="header" class="z-pointer" @click="onClickBack">
          <i class="fas fa-arrow-left"></i>
          <span> 返回企业列表</span>
        </div>
        <div v-else slot="header">
          <span>企业信息</span>
        </div>
        <menu-tree
          url=""
          :title="`${psInfo.psName}` || '企业信息'"
          :option="psNavMenu"
          :append-node="appendNode"
          :highlightNode="tabComponent"
          :props="{ value: 'code' }"
          @node-click="onClickNode" />
      </el-card>
    </el-col>
    <el-col :span="19">
      <component
        v-if="tabReset"
        v-bind:is="tabComponent"
        :info="tabComponent === 'PsBaseInfo'">
      </component>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import ProductOperationInfo from './components/ProductOperationInfo';
import SafetyProductLicenseInfo from './components/SafetyProductLicenseInfo';
import SafetyManageOrgInfo from './components/SafetyManageOrgInfo';
import SafetyProductInputInfo from './components/SafetyProductInputInfo';
import PSPictureInfo from './components/PSPictureInfo';
import VehicleInfo from './components/VehicleInfo';
import ChemicalScraftManage from './components/ChemicalScraftManage';
import EasyMakePoisonExplosion from './components/EasyMakePoisonExplosion';
import AuxProductEquipInfo from './components/AuxProductEquipInfo';
import TankField from './components/TankField';
import TanksInfo from './components/TanksInfo';
import EnergyConsumption from './components/EnergyConsumption';
import PSInfoDetailProduce from './components/PSInfoDetailProduce';
import PSInfoDetailMonitor from './components/PSInfoDetailMonitor';
import PSInfoDetailStove from './components/PSInfoDetailStove';
import PSInfoDetailChimney from './components/PSInfoDetailChimney';
import PSInfoDetaiInstrument from './components/PSInfoDetaiInstrument';
import PSInfoDetailGovern from './components/PSInfoDetailGovern';
import PSInfoDetailDGI from './components/PSInfoDetailDGI';
import SpecOperationPerson from './components/SpecOperationPerson';
import SpecEquipInfo from './components/SpecEquipInfo';
import OccupationHealthInfo from './components/OccupationHealthInfo';
import EmissionPermitInfor from './components/EmissionPermitInfor';
import PSInfoDetailWater from './components/PSInfoDetailWater';
import PSInfoDetailGas from './components/PSInfoDetailGas';
import PsBaseInfo from '@/views/bas/PSList/components/DialogForm';

export default {
  name: 'PSInfo',
  components: {
    ProductOperationInfo,
    SafetyProductLicenseInfo,
    SafetyManageOrgInfo,
    SafetyProductInputInfo,
    PSPictureInfo,
    VehicleInfo,
    ChemicalScraftManage,
    EasyMakePoisonExplosion,
    AuxProductEquipInfo,
    TankField,
    TanksInfo,
    EnergyConsumption,
    PSInfoDetailProduce,
    PSInfoDetailMonitor,
    PSInfoDetailStove,
    PSInfoDetailChimney,
    PSInfoDetaiInstrument,
    PSInfoDetailGovern,
    PSInfoDetailDGI,
    SpecOperationPerson,
    SpecEquipInfo,
    OccupationHealthInfo,
    EmissionPermitInfor,
    PSInfoDetailWater,
    PSInfoDetailGas,
    PsBaseInfo,
  },
  computed: {
    ...mapState('auth', ['userRoles']),
    ...mapGetters('auth', ['userType', 'psNavMenu']),
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
    appendNode() {
      return this.userType === 'ent' ? [{
        rowGuid: 'A001',
        label: '基本信息',
        code: 'PsBaseInfo',
      }] : [];
    },
  },
  data() {
    return {
      tabReset: true,
      tabComponent: 'ProductOperationInfo',
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.tabReset = false;
      vm.$nextTick(() => {
        vm.tabReset = true;
      });
    });
  },
  mounted() {
    this.tabComponent = this.userType === 'gov'
      ? 'ProductOperationInfo'
      : 'PsBaseInfo';
  },
  methods: {
    onClickBack() {
      this.$router.push({ name: 'PSList' });
    },
    onClickNode(data, node) {
      if (node.isLeaf) {
        this.tabComponent = data.code;
      }
    },
  },
};
</script>
