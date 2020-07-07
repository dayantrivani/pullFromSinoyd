<template>
  <dialog-modal ref="dialog" :title="`${isCheck ? '' : isEdit ? '编辑' : '新增'}许可信息`" @close="closeDialog">
    <el-form ref="form" :model="itemModel" :rules="rules" label-width="173px" class="item-space pad-x-sm">
      <div class="title-info">基本信息</div>
      <!-- <fieldset-flex title="基本信息"> -->
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="企业名称：">
              <el-input v-model="itemModel.psName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排污许可证编号：" prop="permitCode">
              <el-input v-model="itemModel.permitCode" :readonly="isCheck"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="有效日期开始：" prop="validStartDate">
              <el-date-picker
                v-model="itemModel.validStartDate"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
                placeholder="选择日期"
                :readonly="isCheck"
                :picker-options="pickStart">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效日期截止：" prop="validEndDate">
              <el-date-picker
                v-model="itemModel.validEndDate"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
                placeholder="选择日期"
                :readonly="isCheck"
                :picker-options="pickEnd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="主要污染物类别：" prop="pollutantTypeList">
              <el-checkbox-group v-model="itemModel.pollutantTypeList" :readonly="isCheck">
                <el-checkbox :label="1">废水</el-checkbox>
                <el-checkbox :label="2">废气</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="排污许可证：">
              <file-uploader
                ref="uploader"
                url="res/document"
                :params="{ objectId }"
                :props="{ name: 'docName', size: 'docSize', link: 'path' }"
              ></file-uploader>
            </el-form-item>
          </el-col>
        </el-row>
      <!-- </fieldset-flex> -->
      <!-- <fieldset-flex title="污染物信息"> -->
        <template v-if="itemModel.pollutantTypeList && itemModel.pollutantTypeList.length">
          <hr class="block">
          <div class="title-info">污染物信息</div>
          <template v-if="itemModel.pollutantTypeList.includes(1)">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="废水主要污染物种类：">
                  <el-input v-model="itemModel.waterPollutants" :readonly="isCheck"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="废水污染物排放执行标准：">
                  <el-input v-model="itemModel.waterStandards" :readonly="isCheck"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="itemModel.pollutantTypeList.includes(2)">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="废气主要污染物种类：">
                  <el-input v-model="itemModel.airPollutants" :readonly="isCheck"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="废气污染物排放执行标准：">
                  <el-input v-model="itemModel.airStandards" :readonly="isCheck"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
      <!-- </fieldset-flex> -->
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(refreshData)"
      >保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import { analyzeResp } from '@/libs/util';
import { mapState } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import FileUploader from '@/components/file-uploader';

export default {
  name: 'DialogForm',
  mixins: [saveItem],
  components: { FileUploader },
  data() {
    return {
      url: 'bas/pollutantDischargePermit',
      objectId: '',
      pickStart: {
        disabledDate: (time) => {
          if (!this.itemModel.validEndDate) {
            return false;
          }
          return time.getTime() > new Date(this.itemModel.validEndDate).getTime();
        },
      },
      pickEnd: {
        disabledDate: (time) => {
          if (!this.itemModel.validStartDate) {
            return false;
          }
          return time.getTime() < new Date(this.itemModel.validStartDate).getTime();
        },
      },
      isCheck: false,
      itemModel: {
        psId: '',
        psName: '',
        permitCode: '',
        validStartDate: '',
        validEndDate: '',
        pollutantType: '',
        pollutantTypeList: [],
        waterPollutants: '',
        waterStandards: '',
        airPollutants: '',
        airStandards: '',
      },
      rules: {
        permitCode: [{ required: true, message: '请输入排污许可证编号', trigger: 'blur' }],
        validStartDate: [{ required: true, message: '请选择有效日期开始', trigger: ['blur', 'change'] }],
        validEndDate: [{ required: true, message: '请选择有效日期截止', trigger: ['blur', 'change'] }],
        pollutantTypeList: [{ required: true, message: '请选择主要污染物类别', trigger: ['blur', 'change'] }],
      },
    };
  },
  computed: {
    isEdit() {
      return !!this.itemModel.id;
    },
    // 企业信息
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  watch: {
    'itemModel.pollutantTypeList': {
      handler(val) {
        if (val && val.length) {
          this.itemModel.pollutantType = val.reduce((acc, cur) => acc + cur, 0);
        } else {
          this.itemModel.pollutantType = '';
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    openDialog(item) {
      this.objectId = item ? item.id : Date.now().toString();
      this.itemModel = Object.assign(this.getItemEmpty(), item);
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    refreshData(item) {
      this.objectId = item.id || '';
      this.$nextTick(() => {
        this.$refs.uploader.onSendUpload();
      });
      this.$emit('query');
      this.closeDialog();
    },
    getItemEmpty() {
      return {
        psId: this.psInfo.id,
        psName: this.psInfo.psName,
        permitCode: '',
        validStartDate: '',
        validEndDate: '',
        pollutantType: '',
        pollutantTypeList: [],
        waterPollutants: '',
        waterStandards: '',
        airPollutants: '',
        airStandards: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
// .pic-upload {
//   width: 100%;
//   height: 28px;
// }
// .pic-upload /deep/.el-upload.el-upload--picture-card, {
//   width: 100%;
//   height: 28px;
//   line-height: 28px;
// }
</style>
