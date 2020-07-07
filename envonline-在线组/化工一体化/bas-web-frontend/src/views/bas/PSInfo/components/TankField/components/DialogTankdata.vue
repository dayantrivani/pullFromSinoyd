<template>
  <dialog-modal
    ref="dialog"
    size="small"
    min-width="600px"
    :title="`${isEdit ? '编辑' : '新增'}储罐信息`"
    append-to-body
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="159px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules">
      <el-row :gutter="10">
        <!-- <el-col :span="12">
          <el-form-item label="企业名称：" prop="psId" hint-down>
            <el-select
              filterable
              v-model="itemModel.psId"
              :disabled="orgGuid"
              @change="changePsId">
              <el-option
                v-for="(item, index) in psInfoList"
                :key="index"
                :label="item.psName"
                :value="item.psId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="储罐名称：" prop="stName">
            <el-input v-model="itemModel.stName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="储罐编号：" prop="stCode">
            <el-input v-model="itemModel.stCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="10"> -->
        <!-- <el-col :span="12">
          <el-form-item label="所属罐区：" prop="tankFarmId">
            <el-select
              v-model="itemModel.tankFarmId">
              <el-option
                v-for="item in tankFarmData"
                :key="item.id"
                :label="item.tfName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="罐体编号：" prop="stCode">
            <el-input v-model="itemModel.stCode"></el-input>
          </el-form-item>
        </el-col> -->
      <!-- </el-row> -->
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="储罐内容：" prop="stContent">
            <el-input v-model="itemModel.stContent"></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row :gutter="10">
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
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="罐径(m)：">
            <el-input-number v-model="itemModel.storageTankDiameter" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐高(m)：">
            <el-input-number v-model="itemModel.storageTankheight" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
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
        <el-col :span="12">
          <el-form-item label="最大存储量（立方米）：">
            <el-input-number
              v-model="itemModel.maximumStorage"
              controls-position="right"
              :precision="2">
            </el-input-number>
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
          <el-form-item label="是否为重大危险源：">
            <el-tooltip :content="itemModel.isMajorHazards ? '是' : '否'" placement="top">
              <el-switch v-model="itemModel.isMajorHazards"></el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="储罐所在位置（地址）：">
        <el-input v-model="itemModel.stAddress" type="textarea"  :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
    </el-form>
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
import { mapGetters } from 'vuex';
// import rules from './rules';
// import { mapGetters } from 'vuex';

// 引入混合 - 保存记录方法
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  // 传入参数项
  props: {
    title: String,
    ketid: {
      default: '',
    },
    psids: {
      default: '',
    },
  },
  data() {
    return {
      url: 'keyPoints/storageTankInfo',  // 必须, 接口地址
      itemModel: {},          // 表单对象
      // 字典表
      dict: {
        // Base_DimensionType: [],               // 常量类型
        dangeChemicalsCategoryCodeId: [],     // 危险化学品类别
        materialQualityCodeId: [],            // 材质
      },
      psInfoList: [],
      // DgiList: [],
      tankFarmData: [],
      watchType: '',
      rules: {
        stName: [
          { required: true, message: '请输入储罐名称', trigger: ['blur', 'change'] },
        ],
        stCode: [
          { required: true, message: '请输入储罐编号', trigger: ['blur', 'change'] },
        ],
        stContent: [
          { required: true, message: '请输入储罐内容', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  watch: {
    'itemModel.tankFarmId': {
      handler(newData, oldData) {
        this.watchType = oldData;
      },
    },
  },
  computed: {
    ...mapGetters('auth', ['orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
    // 根据企业过滤数采仪
    // psDgiList() {
    //   if (this.itemModel.psId) {
    //     return this.DgiList.filter(v => v.psId === this.itemModel.psId);
    //   }
    //   return [];
    // },
  },
  created() {
    // this.getPsInfoList();
    // this.getDgiList();
    // this.getTankFarmId();
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
        psId: this.psids,         // 企业名称
        tankFarmId: this.ketid,   // 所属罐区
        stName: '',               // 罐体名称
        stCode: '',               // 罐体编号
        stContent: '',            // 罐体内容
        stAddress: '',            // 罐体所在位置（地址）
        safeDistance: 0,          // 安全距离（米）
        maximumStorage: 0,        // 最大存储量（立方米）
        isMajorHazards: false,    // 是否为重大危险源
        // dgiId: '',             // 数采仪ID
        // dgiMn: '',             // 数采仪代码
        longitude: '',            // 经度
        latitude: '',             // 纬度
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
      if (row) {
        // this.changePsId(row.psId);
        this.itemModel.psId = this.psids;
        this.itemModel.portId = this.ketid;
      } else {
        // this.tankFarmData = [];
        this.itemModel.psId = this.psids;
        this.itemModel.portId = this.ketid;
      }
      // 是否获取单条记录
      this.getItemOne(row);

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    // 获取经度
    getLongitude() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.itemModel.longitude = position.coords.longitude;
        });
      }
    },
    // 获取纬度
    getLatitude() {
      this.$refs.map.openDialog();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.itemModel.longitude = position.coords.latitude;
        });
      }
    },
    // 获取企业列表
    // getPsInfoList() {
    //   this.$http.get('bas/psBaseInfo', {
    //     params: {
    //       psType: -1,
    //       psName: '',
    //       industryTypeCodeId: '',
    //       regionCodeId: '',
    //       attentionDegree: '',
    //       psBaseInfoType: '',
    //       page: 1,
    //       rows: 100000,
    //     },
    //   }).then((response) => {
    //     this.psInfoList = response.data.data;
    //     console.log(this.psInfoList);
    //   });
    // },
    // getDgiList() {
    //   this.$http.get('bas/dgiInfo', { // 获取数采仪列表
    //     params: { page: 1, rows: 1000000 },
    //   }).then((response) => {
    //     if (response.status === 200 && response.data.success) {
    //       this.DgiList = response.data.data;
    //     }
    //   });
    // },
    // 企业名称改变
    // changePsId(val) {
    //   if (this.watchType !== val && this.watchType !== undefined) {
    //     this.itemModel.tankFarmId = '';
    //   }
    //   this.getTankFarmId(val);
    // },
    // 调用所属罐区接口
    // getTankFarmId(val) {
    //   const nav = {};
    //   nav.psId = val;
    //   nav.tfName = '';
    //   this.$http.post('keypoints/tankFarmInfo/find', nav, {
    //     params: {
    //       page: 1,
    //       rows: 10000,
    //       sort: 'tfCode-',
    //     },
    //   }).then((response) => {
    //     if (response.data.success) {
    //       this.tankFarmData = response.data.data;
    //       console.log(this.tankFarmData);
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
