<template>
<!-- 新增或编辑按钮弹框 -->
  <dialog-modal
    ref="dialogform"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}罐区信息`"
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="127px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <!-- <el-form-item v-if="userType === 'gov'" label="企业名称：" prop="psId">
        <el-select v-model="itemModel.psId">
          <el-option
            v-for="item in psInfoList"
            :key="item.psId"
            :label="item.psName"
            :value="item.psId">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="企业名称：">
        <!-- <el-select v-model="itemModel.psId">
          <el-option
            v-for="item in psInfoList"
            :key="item.psId"
            :label="item.psName"
            :value="item.psId">
          </el-option>
        </el-select> -->
        <el-input v-model="psNames" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="罐区名称：" prop="tfName">
        <el-input v-model="itemModel.tfName"></el-input>
      </el-form-item>
      <el-form-item label="罐区编码：" prop="tfCode">
        <el-input v-model="itemModel.tfCode"></el-input>
      </el-form-item>
      <el-form-item label="是否重大危险源：" prop="isMajorHazards">
        <el-tooltip :content="itemModel.isMajorHazards ? '是' : '否'" placement="top">
          <el-switch v-model="itemModel.isMajorHazards"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="罐区经度：" prop="longitude">
        <el-input v-model="itemModel.longitude">
          <template slot="append">
            <el-button @click="selectLngLat()" icon="fas fa-map-marker-alt"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="罐区纬度：" prop="latitude">
        <el-input v-model="itemModel.latitude">
          <template slot="append">
            <el-button @click="selectLngLat()" icon="fas fa-map-marker-alt"></el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="罐区地址：">
        <el-input v-model="itemModel.tfAddress"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input  type="textarea" v-model="itemModel.remark"
          :autosize="{ minRows: 2, maxRows: 2}"></el-input>
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
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  data() {
    return {
      url: 'keypoints/tankFarmInfo', // 接口地
      itemModel: this.getEmptyItem(),
      psNames: '',
      rules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        tfName: [
          { required: true, message: '请输入罐区名称', trigger: ['blur', 'change'] },
        ],
        tfCode: [
          { required: true, message: '请输入罐区编码', trigger: ['blur', 'change'] },
        ],
        isMajorHazards: [
          { required: true, message: '请选择是否重大污染源', trigger: ['blur', 'change'] },
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: ['blur', 'change'] },
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: ['blur', 'change'] },
        ],
      },
      psInfoList: [],
      tankFarmData: [],
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
  },
  created() {
    this.getPsInfoList();
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
        psId: `${this.userType === 'gov' ? this.psInfo.id : this.orgGuid} `,               // 企业ID
        tfName: '',             // 罐区名称
        tfCode: '',             // 罐区编码
        isMajorHazards: false,     // 是否重点危险源
        longitude: '',          // 经度
        latitude: '',           // 纬度
        tfAddress: '',          // 地址
        remark: '',             // 备注
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
      // this.getItemOne(row);

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.dialogform.openDialog();

      // 聚焦输入框
      // this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 关闭对话框
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.$refs.dialogform.closeDialog();
    },
    // 获取企业列表
    getPsInfoList() {
      this.$http.get('bas/psBaseInfo', {
        params: {
          psType: -1,
          psName: '',
          industryTypeCodeId: '',
          regionCodeId: '',
          attentionDegree: '',
          psBaseInfoType: '',
          page: 1,
          rows: 100000,
        },
      }).then((response) => {
        this.psInfoList = response.data.data;
        if (this.userType !== 'gov') {
          this.psInfoList.forEach((res) => {
            if (res.psId === this.orgGuid) {
              this.psNames = res.psName;
            }
          });
        } else {
          this.psInfoList.forEach((res) => {
            if (res.psId === this.psInfo.id) {
              this.psNames = res.psName;
            }
          });
        }
      });
    },
    // 企业名称改变
    // changePsId(val) {
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
    //     }
    //   });
    // },
  },
};
</script>
