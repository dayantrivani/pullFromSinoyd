<template>
  <dialog-modal
    ref="dialog"
    size="small"
    :title="`${isEidt ? '新增' : '编辑'}安全生产许可信息`"
    @close="closeDialog">
    <el-form
      class="mar-t-sm pad-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="120px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="发证机关：">
            <el-input v-model="itemModel.issuingAuthority" autofocus></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证照类型：" prop="licenseTypeCodeId">
            <el-select v-model="itemModel.licenseTypeCodeId"
              @blur="$refs.form.validateField('licenseTypeCodeId')">
              <el-option
                v-for="(item, index) in dict.SafetyProductLicenseTypes"
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
          <el-form-item label="许可证编号：" prop="licenseNumber">
            <el-input v-model="itemModel.licenseNumber" autofocus></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="许可证起止时间：">
            <el-date-picker
              v-model="toFormDate"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="许可范围：">
            <el-input
            type="textarea"
            v-model="itemModel.licenseScope"
            :autosize="{ minRows: 2, maxRows: 2}"
          ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              v-model="itemModel.remark"
              :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="证件照片：">
            <upload-picture ref="upload" :objectId="objectId"></upload-picture>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(refresh)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import { getType } from '@/global/libs/tools';
import UploadPicture from '@/components/upload-picture';
import { analyzeResp } from '@/global/libs/util';
// import { getType } from '@/global/libs/tools';

export default {
  name: 'SafetyProductLicenseInfo',
  // 使用混合
  mixins: [
    saveItem,
  ],
  components: { UploadPicture },
  props: ['psid'],
  data() {
    return {
      url: 'bas/safetyProductLicenseInfo',                  // 必须, 接口地址
      isEidt: false,
      dialogImageUrl: '',
      dialogVisible: false,
      itemModel: {
        startDate: '',
        endDate: '',
      },
      fileList: [],                                         // 上传图片的相关内容
      objectId: '',
      dataSoec: {},
      // 字典数据
      dict: {
        SafetyProductLicenseTypes: [],                      // 安全生产许可证照类型
      },
      rules: {
        licenseNumber: [
          { required: true, message: '请输入许可证编号', trigger: ['blur', 'change'] },
        ],
        licenseTypeCodeId: [
          { required: true, message: '请选择证照类型', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    toFormDate: {
      get() {
        let date = '';
        if (this.itemModel.startDate === '1900-01-01 00:00:00' && this.itemModel.endDate === '1900-01-01 00:00:00') {
          date = '';
        } else if (!this.itemModel.startDate && !this.itemModel.endDate) {
          date = '';
        } else {
          date = [this.itemModel.startDate, this.itemModel.endDate];
        }
        // 为何为'', 当dateRange值不为 '' 时,时间选项会从 1970年1月1日开始
        return date;
      },
      set(val) {
        const [startDate, endDate] = val || ['1900-01-01 00:00:00', '1900-01-01 00:00:00'];
        this.$set(this.itemModel, 'startDate', startDate);
        this.$set(this.itemModel, 'endDate', endDate);
      },
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        issuingAuthority: '',             // 发证机关
        licenseTypeCodeId: '',            // 证照类型
        licenseNumber: '',                // 许可证编号
        licenseScope: '',                 // 许可范围
        remark: '',                       // 备注
      };
    },
    // 保存回调函数
    refresh(val) {
      this.objectId = val.id;
      this.$refs.upload.onUpload(this.objectId);
      this.$emit('query');
      this.closeDialog();
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 时间选择器改变方法
    // changeTimes(val) {
    //   this.startData = formatDate(val[0], 'Y-m-d 00:00:00');
    //   this.endData = formatDate(val[1], 'Y-m-d 00:00:00');
    //   this.itemModel.startDate = this.startData;
    //   this.itemModel.endDate = this.endData;
    // },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.isEidt = false;
        this.getItemOne(row);
        this.itemModel.psId = this.psid;
        this.objectId = row.id;
        if (this.$refs.upload) this.$refs.upload.getImg(row.id);
      } else {
        this.isEidt = true;
        this.itemModel = this.getEmptyItem();
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
        this.itemModel.psId = this.psid;
      }
      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
      this.objectId = '';
      this.$refs.upload.clearFiles();
    },
    // 获取单条记录
    getItemOne(row) {
      if (!row) return;
      const id = getType(row) === 'object' ? row.id : row;
      this.formLoading = true;
      this.$http.get(`${this.url}/${id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel = Object.assign(this.getEmptyItem(), response.data.data);
          // this.dataSoec = response.data.data;
          // if (this.dataSoec.endDate) {
          //   this.itemModel.times = [this.dataSoec.startDate, this.dataSoec.endDate];
          // } else {
          //   this.itemModel.times = [];
          // }
        } else {
          this.$message.warning({
            message: response.body.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.formLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
