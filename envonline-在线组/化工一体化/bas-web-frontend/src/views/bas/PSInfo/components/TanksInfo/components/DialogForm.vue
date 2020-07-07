<template>
  <dialog-modal
    ref="dialog"
    size="small"
    :title="`${isEdit ? '编辑' : '新增'}罐体信息`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="159px"
        v-loading="formLoading"
        :model="itemModel"
        :rules="rules">
        <!-- <div class="title-info mar-b-xs">基本信息</div> -->
        <!-- <hr> -->
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="装置名称：" prop="stName" hint-down>
              <el-input v-model.trim="itemModel.stName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="装置编号：" hint-down prop="stCode">
              <el-input v-model.trim="itemModel.stCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="所属罐区：" prop="tankFarmId">
              <el-select v-model="itemModel.tankFarmId">
                <el-option
                  v-for="item in tankFarmData"
                  :key="item.id"
                  :label="item.tfName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="装置内容：">
              <el-input v-model="itemModel.stContent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 2019/09/27新增字段 -->
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="危化品类别：">
              <el-select v-model="itemModel.dangeChemicalsCategoryCodeId">
                <el-option
                  v-for="item in dict.dangeChemicalsCategoryCodeId"
                  :key="item.rowGuid"
                  :label="item.dictName"
                  :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="储罐类型：">
              <el-select v-model="itemModel.storageTankType  ">
                <el-option
                  v-for="item in $enum.storageTankType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="材质：">
              <el-select v-model="itemModel.materialQualityCodeId    ">
                <el-option
                  v-for="item in dict.materialQualityCodeId"
                  :key="item.rowGuid"
                  :label="item.dictName"
                  :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="罐径(m)：">
              <el-input-number v-model="itemModel.storageTankDiameter" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="罐高(m)：">
              <el-input-number v-model="itemModel.storageTankheight" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全距离(m)：">
              <el-input-number
                v-model="itemModel.safeDistance"
                controls-position="right"
                :precision="0"
              >
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最大存储量（立方米）：">
              <el-input-number
                v-model="itemModel.maximumStorage"
                controls-position="right"
                :precision="2">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度：">
              <el-input v-model="itemModel.latitude">
                <template slot="append">
                  <el-button @click="selectLngLat()" icon="fas fa-map-marker-alt"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="经度：">
              <el-input v-model="itemModel.longitude">
                <template slot="append">
                  <el-button @click="selectLngLat()" icon="fas fa-map-marker-alt"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为重大危险源：">
              <el-tooltip :content="itemModel.isMajorHazards ? '是' : '否'" placement="top">
                <el-switch v-model="itemModel.isMajorHazards"></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="装置所在位置（地址）：">
              <el-input v-model="itemModel.stAddress" type="textarea"  :autosize="{ minRows: 2 }"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
    <dialog-modal ref="lngLatDialog" append-to-body size="middle" scrollbar>
      <iframe
        ref="iframe"
        src="selectLngLat/selectLngLat.html"
        style="width: 100%; height: calc(86vh - 60px);">
      </iframe>
    </dialog-modal>
  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  // 传入参数项
  props: {
    title: String,
  },
  data() {
    return {
      url: 'keyPoints/storageTankInfo',  // 必须, 接口地址
      itemModel: {},          // 表单对象
      // 表单验证
      rules: {
        stName: [
          { required: true, message: '请输入装置名称', trigger: ['blur', 'change'] },
        ],
        tankFarmId: [
          { required: true, message: '请选择所属罐区', trigger: ['blur', 'change'] },
        ],
        stCode: [
          { required: true, message: '请输入装置编号', trigger: ['blur', 'change'] },
        ],
      },
      // 字典表
      dict: {
        // Base_DimensionType: [],               // 常量类型
        dangeChemicalsCategoryCodeId: [],     // 危险化学品类别
        materialQualityCodeId: [],            // 材质
      },
      DgiList: [],
      tankFarmData: [],                   // 罐区数据源
    };
  },
  computed: {
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
    // 根据企业过滤数采仪
    psDgiList() {
      if (this.itemModel.psId) {
        return this.DgiList.filter(v => v.psId === this.psInfo.psId);
      }
      return [];
    },
  },
  created() {
    // this.getDgiList();
    this.getTankFarmData();
  },
  methods: {
    selectLngLat() {
      this.$refs.lngLatDialog.openDialog();
      this.$nextTick(() => {
        this.iframeWindow = this.$refs.iframe.contentWindow;
        this.iframeWindow.addEventListener('message', this.receiveMessage, false);
      });
    },
    receiveMessage(event) {
      this.itemModel.longitude = event.data.longitude;
      this.itemModel.latitude = event.data.latitude;
      this.$refs.lngLatDialog.closeDialog();
    },
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.psInfo.id,               // 企业ID
        tankFarmId: '',                     // 所属罐区
        stName: '',                         // 装置名称
        stCode: '',                         // 装置编号
        stContent: '',                      // 装置内容
        stAddress: '',                      // 装置所在位置（地址）
        safeDistance: 0,                    // 安全距离（米）
        maximumStorage: 0,                  // 最大存储量（立方米）
        isMajorHazards: false,              // 是否为重大危险源
        // dgiId: '',                       // 数采仪ID
        // dgiMn: '',                       // 数采仪代码
        longitude: '',                      // 经度
        latitude: '',                       // 纬度
        dangeChemicalsCategoryCodeId: '',   // 危化品类别
        storageTankType: '',                // 储罐类型
        materialQualityCodeId: '',          // 材质
        storageTankDiameter: '',            // 罐径
        storageTankheight: '',              // 罐高
      };
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
      this.getItemOne(row);

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.dialog.openDialog();

      // 聚焦输入框
      // this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.$refs.dialog.closeDialog();
    },
    changeDgiId(val) {
      if (!val || !this.DgiList.length) return;
      const item = this.DgiList.find(v => v.dgiId === val);
      if (item) {
        this.itemModel.dgiMn = item.dgiMN;
      }
    },
    // 获取所属罐区数据源
    getTankFarmData() {
      const nav = {};
      nav.psId = `${this.userType !== 'gov' ? this.orgGuid : this.psInfo.id}`;
      nav.tfName = '';
      this.$http.post('keypoints/tankFarmInfo/find', nav, {
        params: {
          page: 1,
          rows: 10000,
          sort: 'tfCode-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.tankFarmData = response.data.data;
        }
      });
    },
    // getDgiList() {
    //   this.$http.get('bas/dgiInfo', { // 获取数采仪列表
    //     params: { page: 1, rows: 1000000, psId: this.psInfo.id },
    //   }).then((response) => {
    //     if (response.status === 200 && response.data.success) {
    //       this.DgiList = response.data.data;
    //     }
    //   });
    // },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.el-box{
  padding: 0 10px;
  margin: -10px -10px 5px;
  max-height: calc(70vh - 94px);
  overflow: auto;
}
</style>
