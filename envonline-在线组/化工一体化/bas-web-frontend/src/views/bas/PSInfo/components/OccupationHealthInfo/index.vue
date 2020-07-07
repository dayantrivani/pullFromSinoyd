<template>
  <!-- 职业卫生 -->
  <el-card type="title">
    <template slot="header">职业卫生</template>
    <div class="mar-y-sm mar-l-sm fill-auto">
      <el-button v-loading="saveLoading" type="primary"
        icon="fas fa-plus" @click="onSaveItem"
      >保 存</el-button>
    </div>
    <hr class="mar-x-sm">
    <el-form label-width="185px" class="item-space mar-x-sm mar-t-sm"
      :model="itemModel" v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="职业卫生管理机构名称：" prop="institutionName">
            <el-input v-model="itemModel.institutionName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="职业卫生管理人员专职(人)：" prop="fullTimeNumber">
            <el-input-number v-model="itemModel.fullTimeNumber" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业卫生管理人员兼职(人)：" prop="partTimeNumber">
            <el-input-number v-model="itemModel.partTimeNumber" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否存在职业病危害因素：">
            <el-tooltip :content="itemModel.haveOccupationalHazards ? '是' : '否'" placement="top">
              <el-switch v-model="itemModel.haveOccupationalHazards"></el-switch>
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业危害申报回执编号：" prop="receiptNumber">
            <el-input v-model="itemModel.receiptNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="职业健康体检日期：" prop="physicalExaminationDate">
            <el-date-picker
              style="width:100%"
              v-model="physicalExaminationDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="疑是职业病人数（人）：" prop="suspectedNumber">
            <el-input-number v-model="itemModel.suspectedNumber" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="职业危害因素监测日期：" prop="factorTestingDate">
            <el-date-picker
              style="width:100%"
              v-model="factorTestingDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职业病累计日人数（人）：" prop="diseasesAccumulativeNumber">
            <el-input-number v-model="itemModel.diseasesAccumulativeNumber" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="职业卫生许可编号：" prop="licenseNumber">
            <el-input v-model="itemModel.licenseNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效期：" prop="licenseValidDate">
            <template slot="label">
              有效期
              <span>
                <el-tooltip
                  effect="dark"
                  content="职业卫生许可证有效期"
                  placement="top">
                  <i class="el-tooltip el-icon-info"></i>
                </el-tooltip>
              </span>
              <span> ：</span>
            </template>
            <el-date-picker
              style="width:100%"
              v-model="licenseValidDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="职业病危害现状评价报告：">
            <upload-file ref="uploadfile" :col="4" :isUpdate="isUpdate"
              :isRequest="isRequest" :id="objectId" @update-recover="updateRecover"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="备案日期：" prop="putOnRecordDate">
            <el-date-picker
              style="width:100%"
              v-model="putOnRecordDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效期：" prop="putOnRecordValidDate">
            <template slot="label">
              有效期
              <span>
                <el-tooltip
                  effect="dark"
                  content="职业病危害现状评价报告有效期"
                  placement="top">
                  <i class="el-tooltip el-icon-info"></i>
                </el-tooltip>
              </span>
              <span> ：</span>
            </template>
            <el-date-picker
              style="width:100%"
              v-model="putOnRecordValidDate"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              :picker-options="pickStart"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { mapState } from 'vuex';

export default {
  name: 'OccupationHealthInfo',
  data() {
    return {
      url: 'bas/occupationHealthInfo/',
      // 是否自动获取上传的数据
      // isGetUpdate: false,
      saveLoading: false,
      loading: false,
      itemModel: {
        institutionName: '',              // 职业卫生管理机构名称
        receiptNumber: '',                // 职业危害申报回执编号
        fullTimeNumber: 0,                // 职业卫生管理人员专职(人)
        partTimeNumber: 0,                // 职业卫生管理人员兼职(人)
        haveOccupationalHazards: false,   // 是否存在职业病危害因素
        physicalExaminationDate: '',      // 职业健康体检日期
        suspectedNumber: 0,               // 疑是职业病人数（人）
        factorTestingDate: '',            // 职业危害因素监测日期
        diseasesAccumulativeNumber: 0,    // 职业病累计日人数（人）
        licenseNumber: null,              // 职业卫生许可编号
        licenseValidDate: '',             // 有效期
        putOnRecordDate: '',              // 备案日期
        putOnRecordValidDate: '',         // 有效期
      },
      rules: {
      },
      itemList: [],
      pickStart: {},
      // 上传组件属性
      objectId: '',
      isUpdate: false,
      isRequest: false,
    };
  },
  computed: {
    isEdit() { return this.itemModel.id; },
    ...mapState({
      psInfo: state => state.psInfo,
    }),
    physicalExaminationDate: {        // 职业健康体检日期
      get() {
        return this.itemModel.physicalExaminationDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.physicalExaminationDate;
      },
      set(val) {
        this.itemModel.physicalExaminationDate = val || '1900-01-01 00:00:00';
      },
    },
    factorTestingDate: {              // 职业危害因素监测日期
      get() {
        return this.itemModel.factorTestingDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.factorTestingDate;
      },
      set(val) {
        this.itemModel.factorTestingDate = val || '1900-01-01 00:00:00';
      },
    },
    licenseValidDate: {               // 有效期
      get() {
        return this.itemModel.licenseValidDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.licenseValidDate;
      },
      set(val) {
        this.itemModel.licenseValidDate = val || '1900-01-01 00:00:00';
      },
    },
    putOnRecordDate: {                // 备案日期
      get() {
        return this.itemModel.putOnRecordDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.putOnRecordDate;
      },
      set(val) {
        this.itemModel.putOnRecordDate = val || '1900-01-01 00:00:00';
      },
    },
    putOnRecordValidDate: {           // 有效期
      get() {
        return this.itemModel.putOnRecordValidDate === '1900-01-01 00:00:00'
          ? ''
          : this.itemModel.putOnRecordValidDate;
      },
      set(val) {
        this.itemModel.putOnRecordValidDate = val || '1900-01-01 00:00:00';
      },
    },
  },
  mounted() {
    this.getItemModel();
  },
  methods: {
    // 发送保存记录请求
    onSaveItem() {
      this.saveLoading = true;
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, { psId: this.psInfo.id, ...this.itemModel })
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            // 保存之后, 将id传递给子组件
            const { data } = response.data;
            this.assign(this.itemModel, data);
            this.$set(this.itemModel, 'id', data.id);
            this.$set(this, 'objectId', data.id);
            this.$set(this, 'isUpdate', true);
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
          this.saveLoading = false;
        });
    },
    // 跳转该页面时触发请求
    getItemModel() {
      this.loading = true;
      const url = `${this.url}${this.psInfo.id}`;
      this.$http.get(url).then((response) => {
        if (response.status === 200 && (response.data.success
        || response.data.msg.includes('未查询到符合条件的数据'))) {
          if (!response.data.data) return;
          this.assign(this.itemModel, response.data.data);
          const { id } = response.data.data;
          if (id || id === 0) {
            this.$set(this.itemModel, 'id', id);
            this.$set(this, 'objectId', id);
            this.$set(this, 'isRequest', true);
          }
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
    // 上传成功或失败都会调用
    updateRecover() {
      this.$set(this, 'isRequest', false);
      this.$set(this, 'isUpdate', false);
    },
    // 将target对象属性值替换成o对象属性值,但不增删target的属性
    assign(target, o) {
      Object.keys(target).forEach((key) => { this.$set(target, key, o[key]); });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
