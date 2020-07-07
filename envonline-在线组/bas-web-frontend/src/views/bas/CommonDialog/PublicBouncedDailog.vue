<template>
  <!-- 公共弹框-->
  <dialog-modal
    ref="dialog"
    size="full"
    :title= "`${entiseInfation.id ? '编辑' : '新增'}${dailogData.dialogtitle}`"
    @close="resetMonitorDialog">
    <div class="box-dialog">
      <div class="mar-b-xs">
        <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button icon="fas fa-times" @click="resetMonitorDialog">关 闭</el-button>
      </div>
      <hr>
      <el-form ref="Form" class="mar-t-sm" :model="entiseInfation" label-width="155px" :rules="rules">

        <el-row>
          <el-col :span="8">
            <el-form-item label="企业名称：" prop="psName">
              <el-input v-model.trim="entiseInfation.psName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业简称：" prop="psShortName">
              <el-input v-model.trim="entiseInfation.psShortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一社会信用代码：" prop="socialCreditCode">
              <el-input v-model.trim="entiseInfation.socialCreditCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="注册资金：" prop="registeredCapital">
              <el-input-number
                v-model="entiseInfation.registeredCapital"
                style="width: 100%;"
                controls-position="right"
                :precision="0"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成立日期：" prop="passDate">
              <el-date-picker v-model="entiseInfation.passDate" type="date" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构代码：" prop="organizationCode">
              <el-input v-model.trim="entiseInfation.organizationCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="企业种类：" prop="psTypes">
              <el-checkbox-group v-model="entiseInfation.psTypes">
                <el-checkbox class="ischeck" v-for="(item, i) in psTypeData"
                :key="i" :label="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="行政区域：" prop="regionCodeId" style="width: 100%;">
              <select-tree-lazy
                :label="entiseInfation.regionName"
                v-model="entiseInfation.regionCodeId"
                @setLabel="setLabel"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业地址：" prop="psAddress">
              <el-input v-model.trim="entiseInfation.psAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码：" prop="postalCode">
              <el-input v-model="entiseInfation.postalCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="企业法人：" prop="corporationName">
              <el-input v-model="entiseInfation.corporationName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人代码：" prop="corporationCode">
              <el-input v-model="entiseInfation.corporationCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人联系电话：" prop="corporationTelPhone">
              <el-input v-model="entiseInfation.corporationTelPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="安全负责人：" prop="securityName">
              <el-input v-model.trim="entiseInfation.securityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全负责人电话：" prop="securityTelPhone">
              <el-input v-model.trim="entiseInfation.securityTelPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="环保负责人：" prop="contactMan">
              <el-input v-model.trim="entiseInfation.contactMan"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="环保负责人电话：" prop="contactTelPhone">
              <el-input v-model.trim="entiseInfation.contactTelPhone"></el-input>
            </el-form-item>
          </el-col>
          <!-- 企业经纬度坐标 -->
          <el-col :span="8">
            <el-form-item label="经度：" prop="longitude">
              <el-input v-model="entiseInfation.longitude" clearable>
                <el-button slot="append" icon="fas fa-map-marker-alt"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度：" prop="latitude">
              <el-input v-model="entiseInfation.latitude" clearable>
                <el-button slot="append" icon="fas fa-map-marker-alt"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="注册类型：" prop="registTypeCodeId">
              <el-select v-model="entiseInfation.registTypeCodeId" style="width:100%" filterable clearable>
                <el-option v-for="(item, i) in registTypeData" :label="item.dictName" :value="item.rowGuid"
                  :key="i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业类型：" prop="industryTypeCodeId">
              <el-select v-model="entiseInfation.industryTypeCodeId" style="width:100%" filterable clearable>
                <el-option
                  v-for="(item, i) in industryTypeData"
                  :label="`${item.dictCode}|${item.dictName}`"
                  :value="item.rowGuid"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开业日期：" prop="openDate">
              <el-date-picker v-model="entiseInfation.openDate" type="date" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="传真：" prop="contactFax">
              <el-input v-model.trim="entiseInfation.contactFax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model.trim="entiseInfation.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网址：" prop="psUrl">
              <el-input v-model="entiseInfation.psUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="分包费率：" prop="subRate">
              <el-input-number
                v-model="entiseInfation.dtoPSBaseInfoExtend.subRate"
                style="width: 100%;"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="委托费率：">
              <el-input-number
                v-model="entiseInfation.dtoPSBaseInfoExtend.entrustRate"
                style="width: 100%;"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营范围：" prop="businessScope">
              <el-input v-model="entiseInfation.businessScope"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="占地面积：" prop="acreage">
              <el-input-number
                v-model="entiseInfation.acreage"
                style="width: 100%;"
                controls-position="right"
                :precision="0"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业性质：" prop="nature">
              <el-input v-model="entiseInfation.nature"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="厂房性质：" prop="houseNature">
              <el-input v-model="entiseInfation.houseNature"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="产权所有人：" prop="owner">
              <el-input v-model="entiseInfation.owner"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在园区：" prop="industrialPark">
              <el-input v-model="entiseInfation.industrialPark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工人数：" prop="employeeNumber">
              <el-input-number
                v-model="entiseInfation.employeeNumber"
                style="width: 100%;"
                controls-position="right"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="年生产天数：" prop="runDaysPerYear">
              <el-input-number
                v-model="entiseInfation.runDaysPerYear"
                style="width: 100%;"
                controls-position="right"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年生产值：" prop="productValuePerYear">
              <el-input-number
                v-model="entiseInfation.productValuePerYear"
                style="width: 100%;"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="利税：" prop="tax">
              <el-input-number
                v-model="entiseInfation.tax"
                style="width: 100%;"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="规模：" prop="scope">
              <el-input v-model="entiseInfation.scope"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否合格：" prop="isEligibility">
              <el-radio v-model="entiseInfation.isEligibility" class="isradio" :label="true">是</el-radio>
              <el-radio v-model="entiseInfation.isEligibility" class="isradio" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序值：" prop="orderNum">
              <el-input-number
                v-model="entiseInfation.orderNum"
                style="width: 100%;"
                controls-position="right"
                :min="0"
                :max="2147483647">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 企业环境管理属性 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="企业环保信息等级：" prop="dtoPSBaseInfoExtend.infoLevel">
              <el-select v-model="entiseInfation.dtoPSBaseInfoExtend.infoLevel" style="width:100%" filterable clearable>
                <el-option v-for="(item, i) in HBInfoLevel" :label="item.dictName" :value="item.rowGuid"
                  :key="i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否重点源：" prop="isKeyPollutant">
              <el-radio v-model="entiseInfation.isKeyPollutant" class="isradio" :label="true">是</el-radio>
              <el-radio v-model="entiseInfation.isKeyPollutant" class="isradio" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排放第一类污染物：" prop="firstPollutant">
              <el-input v-model="entiseInfation.dtoPSBaseInfoExtend.firstPollutant"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="重点源类型：" prop="keyPollutantCategoryArray">
              <el-select v-model="entiseInfation.keyPollutantCategoryArray" style="width:100%" multiple collapse-tags>
                <el-option v-for="(item, i) in $enum.keyPollutantCategory" :label="item" :value="+(i)"
                  :key="i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否排放重金属：" prop="isHeavyMetal">
              <el-radio
                v-model="entiseInfation.dtoPSBaseInfoExtend.isHeavyMetal"
                class="isradio"
                :label="true">是</el-radio>
              <el-radio
                v-model="entiseInfation.dtoPSBaseInfoExtend.isHeavyMetal"
                class="isradio"
                :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业风险等级：" prop="dtoPSBaseInfoExtend.riskLevel">
              <el-select v-model="entiseInfation.dtoPSBaseInfoExtend.riskLevel" style="width:100%" filterable clearable>
                <el-option v-for="(item, i) in RiskLevel" :label="item.dictName" :value="item.rowGuid"
                  :key="i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="质量认证：" prop="qualityCertification">
          <el-input type="textarea" v-model.trim="entiseInfation.qualityCertification">
          </el-input>
        </el-form-item>
        <el-form-item label="企业简介：" prop="info">
          <el-input type="textarea" v-model.trim="entiseInfation.info"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </dialog-modal>
</template>

<script>
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';

export default {
  name: 'PublicBouncedDailog',
  components: {
    SelectTreeLazy,
  },
  props: ['dailogData'],
  data() {
    return {
      saveLoading: false,
      indexData: {},
      width: '100%', // 传递给下拉组件
      rules: {
        psName: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' },
        ],
        psShortName: [
          { required: true, message: '企业简称不能为空', trigger: 'blur' },
        ],
        socialCreditCode: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
        ],
        industryTypeCodeId: [
          { required: true, message: '行业类型不能为空', trigger: 'blur' },
        ],
        psAddress: [
          { required: true, message: '地址不能为空', trigger: 'blur' },
        ],
        regionCodeId: [
          { required: true, message: '请选择行政区域', trigger: ['change', 'blur'] },
        ],
        longitude: [
          { required: true, message: '请选择经度', trigger: ['change'] },
        ],
        latitude: [
          { required: true, message: '请选择纬度', trigger: ['change'] },
        ],
        corporationName: [
          { required: true, message: '企业法人不能为空', trigger: ['blur'] },
        ],
        securityName: [
          { required: true, message: '安全负责人不能为空', trigger: ['blur'] },
        ],
        contactMan: [
          { required: true, message: '环保负责人不能为空', trigger: ['blur'] },
        ],
        'dtoPSBaseInfoExtend.infoLevel': [
          { required: true, message: '请选择企业环保信息等级', trigger: ['change'] },
        ],
        'dtoPSBaseInfoExtend.riskLevel': [
          { required: true, message: '请选择企业风险等级', trigger: ['change'] },
        ],
        keyPollutantCategoryArray: [
          { required: true, message: '请选择重点源类型', trigger: ['change'] },
        ],
        psTypes: [
          {
            type: 'array',
            required: true,
            message: '请选择企业种类',
            trigger: 'change',
          },
        ],
      },
      entiseInfation: {           // 弹框的from表单数据
        psName: '',                // 企业名称
        psShortName: '',           // 企业简称
        psAddress: '',             // 地址
        regionCodeId: '',          // 行政区域编码
        regionName: '',            // 行政区域名称
        socialCreditCode: '',      // 社会信用代码
        organizationCode: '',      // 组织机构代码
        psType: 0,                 // 企业种类
        psTypes: [],
        corporationCode: '',       // 法人代码
        corporationName: '',       // 企业法人

        corporationTelPhone: '',   // 法人联系电话
        securityName: '',          // 安全负责人
        securityTelPhone: '',      // 安全负责人电话

        registeredCapital: '0',    // 注册资金
        postalCode: '',            // 邮政编码
        registTypeCodeId: '',      // 注册类型
        industryTypeCodeId: '',    // 行业类型
        passDate: this.$hp.dateFormat(new Date(), 'Y-m-d'), // 成立日期
        openDate: this.$hp.dateFormat(new Date(), 'Y-m-d'), // 开业日期
        contactMan: '',            // 环保负责人
        contactTelPhone: '',       // 环保负责人电话
        contactFax: '',            // 传真
        email: '',                 // 邮箱
        businessScope: '',         // 经营范围
        acreage: '0',              // 占地面积
        nature: '',                // 企业性质
        houseNature: '',           // 厂房性质
        owner: '',                 // 产权所有人
        industrialPark: '',        // 所在园区
        employeeNumber: '0',       // 员工人数
        runDaysPerYear: '0',       // 年生产天数
        productValuePerYear: '0',  // 年生产值
        tax: '0',                  // 利税
        scope: '',                 // 规模
        // isEligibility: '1',        // 是否合格
        isEligibility: true,       // 是否合格
        orderNum: '0',             // 排序值
        psUrl: '',                 // 网址

        longitude: '',             // 经度
        latitude: '',              // 纬度
        isKeyPollutant: false,     // 是否重点源
        firstPollutant: '',        // 排放第一类污染物
        keyPollutantCategory: 0,   // 重点源类型
        keyPollutantCategoryArray: [],
        isHeavyMetal: false,       // 是否排放重金属

        qualityCertification: '',  // 质量认证
        info: '',                  // 企业简介
        dtoPSBaseInfoExtend: {
          subRate: '0',              // 分包费率
          entrustRate: '0',          // 委托费率
          riskLevel: '',             // 企业风险等级
          infoLevel: '',             // 企业环保信息等级
        },
      },
      psTypeData: [
        { label: '污染源', value: 1 },
        { label: '客户', value: 2 },
        { label: '供应商', value: 4 },
        { label: '考核单位', value: 8 },
        { label: '分包商', value: 16 },
        { label: '生产厂商', value: 32 },
        { label: '检定机构', value: 64 },
        { label: '运营商', value: 128 },
      ],
      registTypeData: [],   // 注册类型
      industryTypeData: [], // 行业类型
      RiskLevel: [],        // 风险等级
      HBInfoLevel: [],      // 环保等级
    };
  },
  created() {
    this.entiseInfation.psTypes = [];
    if (this.dailogData.type) {
      this.entiseInfation.psTypes.push(this.dailogData.type);
    }
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'RegistType' }).then((val) => {
      this.registTypeData = val;
    });
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'IndustryCategory' }).then((val) => {
      this.industryTypeData = val;
    });
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'RiskLevel' }).then((val) => {
      this.RiskLevel = val;
    });
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'HBInfoLevel' }).then((val) => {
      this.HBInfoLevel = val;
    });
  },
  methods: {
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    setLabel(val) {
      this.entiseInfation.regionName = val;
    },
    // 保存数据项
    onSaveItem() {
      this.$refs.Form.validate((valid) => {
        if (!valid) return;
        this.entiseInfation.psType = 0;
        this.entiseInfation.keyPollutantCategory = 0;
        this.entiseInfation.psTypes.forEach((element) => {
          this.entiseInfation.psType += element;
        });
        this.entiseInfation.keyPollutantCategoryArray.forEach((element) => {
          this.entiseInfation.keyPollutantCategory += element;
        });
        this.entiseInfation.passDate = `${this.$hp.dateFormat(this.entiseInfation.passDate, 'Y-m-d')} 00:00:00`;
        this.entiseInfation.openDate = `${this.$hp.dateFormat(this.entiseInfation.openDate, 'Y-m-d')} 00:00:00`;
        const { id } = this.entiseInfation;
        // if (this.entiseInfation.isEligibility === '1') {
        //   this.entiseInfation.isEligibility = true;
        // } else {
        //   this.entiseInfation.isEligibility = false;
        // }
        const url = 'bas/psBaseInfo/';
        this.saveLoading = true;
        this.$http[id ? 'put' : 'post'](url, this.entiseInfation)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '修改' : '新增'}成功`,
                duration: 3000,
                showClose: true,
              });
              this.$emit('getData');  // 子组件调用父组件的方法
              this.$refs.dialog.closeDialog();   // 修改项
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // // 子组件获取编辑数据方法
    getEditData() {
      const data = this.dailogData.editData;
      this.$http.get(`bas/psBaseInfo/${data.id}`)
        .then((response) => {
          this.indexData = response.data.data;
          this.entiseInfation = {
            id: this.indexData.id,
            psName: this.indexData.psName,                              // 企业名称
            psShortName: this.indexData.psShortName,                    // 企业简称
            psAddress: this.indexData.psAddress,                        // 地址
            regionCodeId: this.indexData.regionCodeId,                  // 行政区域编码
            regionName: this.dailogData.regionName,                     // 行政区域名称
            socialCreditCode: this.indexData.socialCreditCode,          // 社会信用代码
            organizationCode: this.indexData.organizationCode,          // 组织机构代码
            psTypes: this.indexData.psTypes,                            // 企业种类
            psType: this.indexData.psType,
            corporationCode: this.indexData.corporationCode,            // 法人代码
            corporationName: this.indexData.corporationName,            // 企业法人


            corporationTelPhone: this.indexData.corporationTelPhone,    // 法人联系电话
            securityName: this.indexData.securityName,                  // 安全负责人
            securityTelPhone: this.indexData.securityTelPhone,          // 安全负责人电话

            registeredCapital: this.indexData.registeredCapital,        // 注册资金
            postalCode: this.indexData.postalCode,                      // 邮政编码
            registTypeCodeId: this.indexData.registTypeCodeId,          // 注册类型
            industryTypeCodeId: this.indexData.industryTypeCodeId,      // 行业类型
            passDate: this.indexData.passDate,                          // 成立日期
            openDate: this.indexData.openDate,                          // 开业日期
            contactMan: this.indexData.contactMan,                      // 环保负责人
            contactTelPhone: this.indexData.contactTelPhone,            // 环保负责人电话
            contactFax: this.indexData.contactFax,                      // 传真
            email: this.indexData.email,                                // 邮箱
            businessScope: this.indexData.businessScope,                // 经营范围
            acreage: this.indexData.acreage,                            // 占地面积
            nature: this.indexData.nature,                              // 企业性质
            houseNature: this.indexData.houseNature,                    // 厂房性质
            owner: this.indexData.owner,                                // 产权所有人
            industrialPark: this.indexData.industrialPark,              // 所在园区
            employeeNumber: this.indexData.employeeNumber,              // 员工人数
            runDaysPerYear: this.indexData.runDaysPerYear,              // 年生产天数
            productValuePerYear: this.indexData.productValuePerYear,    // 年生产值
            tax: this.indexData.tax,                                    // 利税
            scope: this.indexData.scope,                                // 规模
            // isEligibility: this.indexData.isEligibility === true ? '1' : '2', // 是否合格
            isEligibility: this.indexData.isEligibility,                // 是否合格
            orderNum: this.indexData.orderNum,                          // 排序值
            psUrl: this.indexData.psUrl,                                // 网址

            longitude: this.indexData.longitude || '',                  // 经度
            latitude: this.indexData.latitude || '',                    // 纬度
            isKeyPollutant: this.indexData.isKeyPollutant,              // 是否重点源
            keyPollutantCategory: this.indexData.keyPollutantCategory,  // 重点源类型
            keyPollutantCategoryArray: this.indexData.keyPollutantCategoryArray || [],

            qualityCertification: this.indexData.qualityCertification,  // 质量认证
            info: this.indexData.info,                                  // 企业简介
            dtoPSBaseInfoExtend: {
              id: this.indexData.dtoPSBaseInfoExtend.id,
              subRate: this.indexData.dtoPSBaseInfoExtend.subRate,         // 分包费率
              entrustRate: this.indexData.dtoPSBaseInfoExtend.entrustRate, // 委托费率
              riskLevel: this.indexData.dtoPSBaseInfoExtend.riskLevel,                        // 企业风险等级
              infoLevel: this.indexData.dtoPSBaseInfoExtend.infoLevel,                        // 企业环保信息等级
              firstPollutant: this.indexData.dtoPSBaseInfoExtend.firstPollutant,              // 排放第一类污染物
              isHeavyMetal: this.indexData.dtoPSBaseInfoExtend.isHeavyMetal,                  // 是否排放重金属
            },
          };
        });
    },
    // 重置表单
    resetMonitorDialog() {
      this.$refs.dialog.closeDialog();   // 修改项
      this.dailogData.regionName = '';
      this.entiseInfation = {
        psName: '',                // 企业名称
        psShortName: '',           // 企业简称
        psAddress: '',             // 地址
        regionCodeId: '',          // 行政区域编码
        regionName: '',            // 行政区域名称
        socialCreditCode: '',      // 社会信用代码
        organizationCode: '',      // 组织机构代码
        psType: 0,                 // 企业种类
        psTypes: [],
        corporationCode: '',       // 法人代码
        corporationName: '',       // 企业法人

        corporationTelPhone: '',   // 法人联系电话
        securityName: '',          // 安全负责人
        securityTelPhone: '',      // 安全负责人电话

        registeredCapital: '0',    // 注册资金
        postalCode: '',            // 邮政编码
        registTypeCodeId: '',      // 注册类型
        industryTypeCodeId: '',    // 行业类型
        passDate: this.$hp.dateFormat(new Date(), 'Y-m-d'), // 成立日期
        openDate: this.$hp.dateFormat(new Date(), 'Y-m-d'), // 开业日期
        contactMan: '',            // 环保负责人
        contactTelPhone: '',       // 环保负责人电话
        contactFax: '',            // 传真
        email: '',                 // 邮箱
        businessScope: '',         // 经营范围
        acreage: '0',              // 占地面积
        nature: '',                // 企业性质
        houseNature: '',           // 厂房性质
        owner: '',                 // 产权所有人
        industrialPark: '',        // 所在园区
        employeeNumber: '0',       // 员工人数
        runDaysPerYear: '0',       // 年生产天数
        productValuePerYear: '0',  // 年生产值
        tax: '0',                  // 利税
        scope: '',                 // 规模
        // isEligibility: '1',        // 是否合格
        isEligibility: true,       // 是否合格
        orderNum: '0',             // 排序值
        psUrl: '',                 // 网址

        longitude: '',             // 经度
        latitude: '',              // 纬度
        isKeyPollutant: false,     // 是否重点源
        firstPollutant: '',        // 排放第一类污染物
        keyPollutantCategory: 0,   // 重点源类型
        keyPollutantCategoryArray: [],
        isHeavyMetal: false,       // 是否排放重金属

        qualityCertification: '',  // 质量认证
        info: '',                  // 企业简介
        dtoPSBaseInfoExtend: {
          subRate: '0',              // 分包费率
          entrustRate: '0',          // 委托费率
          riskLevel: '',             // 企业风险等级
          infoLevel: '',             // 企业环保信息等级
        },
      };
      this.$refs.Form.resetFields();
      this.entiseInfation.psTypes.push(this.dailogData.type);
    },
  },
};
</script>

<style scoped>
  .ischeck{
    margin-left: 20px;
  }
  .ischeck:first-child{
    margin-left: 10px;
  }
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
