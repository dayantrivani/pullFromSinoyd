<template>
  <dialog-modal
    ref="dialog"
    size="small"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}罐体基本信息`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="160px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="企业名称：" prop="psId" hint-down>
              <select-table v-model="itemModel.psId" :label="psName" @selected="selected" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="储罐名称：" prop="tankStorageName" hint-down>
              <el-input v-model="itemModel.tankStorageName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="CAS编号：" prop="casCode">
              <el-input v-model="itemModel.casCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="储罐类型：" prop="tankType">
              <el-select v-model="itemModel.tankType">
                <el-option
                  v-for="(item, index) in dictParent.TankType"
                  :key="index"
                  :label="item.dictName"
                  :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="所在罐区：" prop="tankFarmId">
              <el-select v-model="itemModel.tankFarmId">
                <el-option
                  v-for="(item, index) in tankFarmList"
                  :key="index"
                  :label="item.tankFarmName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大存储量（t）：" prop="tankMaxStorage" hint-down>
              <el-input v-model="itemModel.tankMaxStorage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="tankSingleVolume">
              <template slot="label">单个储罐容积（m<sup>2</sup>）：</template>
              <el-input v-model="itemModel.tankSingleVolume"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大温度（℃）：" prop="tankMaxTemp">
              <el-input v-model="itemModel.tankMaxTemp"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最大压力（Kpa）：" prop="tankMaxPress">
              <el-input v-model="itemModel.tankMaxPress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="存储数量：" prop="tankNum">
              <el-input-number
                v-model="itemModel.tankNum"
                controls-position="right"
                :min="0">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import SelectTable from '@/components/select-table';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [saveItem],
  components: {
    SelectTable,
  },
  props: {
    dictParent: {     // 常量
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'bas/psTankInfo',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      psName: '',                   // 企业名称
      formRules: {                  // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        tankStorageName: [
          { required: true, message: '请输入储罐名称', trigger: ['blur', 'change'] },
        ],
        // casCode: [
        //   { required: true, message: '请输入CAS编号', trigger: ['blur', 'change'] },
        // ],
        tankType: [
          { required: true, message: '请选择储罐类型', trigger: ['blur', 'change'] },
        ],
        // tankFarmId: [
        //   { required: true, message: '请选择所在罐区', trigger: ['blur', 'change'] },
        // ],
        tankMaxStorage: [
          // { required: true, message: '请输入最大存储量', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        tankSingleVolume: [
          // { required: true, message: '请输入单个储罐容积', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        tankMaxTemp: [
          // { required: true, message: '请输入最大温度', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        tankMaxPress: [
          // { required: true, message: '请输入最大压力', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        // tankNum: [
        //   { required: true, message: '请输入存储数量', trigger: ['blur', 'change'] },
        // ],
      },
      tankFarmList: [],             // 所在罐区
      itemModel: {                  // 表单对象
        psId: '',                   // 企业
        tankStorageName: '',        // 储罐名称
        casCode: '',                // cas号
        tankType: '',               // 储罐类型
        tankFarmId: '',             // 所在罐区
        tankMaxStorage: '',         // 最大存储量
        tankSingleVolume: '',       // 单个储罐容积
        tankMaxTemp: '',            // 最大温度
        tankMaxPress: '',           // 最大压力
        tankNum: 0,                 // 储罐数量
        remark: '',                 // 备注
      },
    };
  },
  computed: {
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  watch: {
    'itemModel.psId': {   // 企业id改变触发所在罐区接口查询
      handler() {
        this.getTankFarmList();
      },
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.psName = row ? row.psName : '';
      this.$refs.dialog.openDialog();
    },
    closeDialog() {       // 关闭对话框
      this.tankFarmList = [];
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },
    selected() { // 选择企业同时清空所在罐区
      this.itemModel.tankFarmId = '';
    },

    /** 请求接口 */
    getTankFarmList() {            // 获取所在罐区列表
      if (!this.itemModel.psId) return;
      this.tankFarmList = [];
      this.loading = true;
      this.$http.get('bas/psTankFarm', {
        params: {
          page: 1,
          rows: 100000,
          psId: this.itemModel.psId,  // 企业id
          psName: '',                 // 企业名称取 ''
          tankFarmName: '',           // 储罐区名称取 ''
          sort: 'regionName-,psName-,tankFarmName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.tankFarmList = response.data.data || [];
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },

    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        psId: '',                   // 企业
        tankStorageName: '',        // 储罐名称
        casCode: '',                // cas号
        tankType: '',               // 储罐类型
        tankFarmId: '',             // 所在罐区
        tankMaxStorage: '',         // 最大存储量
        tankSingleVolume: '',       // 单个储罐容积
        tankMaxTemp: '',            // 最大温度
        tankMaxPress: '',           // 最大压力
        tankNum: 0,                 // 储罐数量
        remark: '',                 // 备注
      };
    },
  },
};
</script>
