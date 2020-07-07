<template>
  <dialog-modal ref="dialog"
                size="small"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}职业病记录`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="120px"
             :rules="rules"
             :model="itemModel">
       <el-row>
        <el-col :span="12">
          <el-form-item label="职业病名称："
                        prop="diseaseName">
            <el-input v-model="itemModel.diseaseName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接触时间：">
            <el-date-picker v-model="itemModel.contactTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="24">
          <el-form-item label="危害程度：">
            <el-input v-model="itemModel.harmExtent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="体检类型：">
            <el-select v-model="itemModel.healthCheckType"
                       style="width:250px;"
                       clearable>
              <el-option v-for="(item,index) in $enum.HEALTHCHECKTYPE"
                      :key="index"
                      :label="item.label"
                      :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体检医院：">
           <el-input v-model="itemModel.healthCheckHospital"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="接触危害因素：">
            <el-select v-model="occupationalFactors"
                       value-key="id"
                       autofocus
                       multiple
                       clearable>
              <el-option v-for="item in dict.OccupationalFactor"
                         :key="item.rowGuid"
                         :label="item.dictName"
                         :value="item.rowGuid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="体检日期：" prop="healthCheckDate">
            <el-date-picker v-model="itemModel.healthCheckDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickStart"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次体检日期：" prop="healthCheckDateNext">
            <el-date-picker v-model="itemModel.healthCheckDateNext"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickEnd"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="体检结果：">
            <el-input type="textarea" v-model="itemModel.healthCheckResult"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="体检结论：">
            <el-input type="textarea" v-model="itemModel.healthCheckConclusion"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否存在职业病：">
            <el-radio-group v-model="itemModel.isOccupationalDisease">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="体检附件：">
            <upload-file :id="objectId"
                         :is-update="isUpdate"
                         :isRequest="isRequest"
                         :size-limilt="0"
                         :btn="readOnly? 'down remove' : 'add down remove'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(callback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';

export default {
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/occupationalDiseaseCheckRecord',
      itemModel: this.getEmptyItem(),
      occupationalFactors: [],    // 危害因素
      // 附件相关
      objectId: '',
      isUpdate: false,
      isRequest: false,
      readOnly: false,
      dict: {
        OccupationalFactor: [], // 危害因素
      },
      rules: {},
    };
  },
  props: {
    healthCheckId: {
      type: String,
      default: '',
    },
  },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    pickStart() {
      return {
        disabledDate: (time) => {
          if (this.itemModel.healthCheckDateNext) {
            return time.getTime() > new Date(this.itemModel.healthCheckDateNext).getTime();
          }
          return false;
        },
      };
    },
    pickEnd() {
      return {
        disabledDate: (time) => {
          if (this.itemModel.healthCheckDate) {
            return time.getTime() < new Date(this.itemModel.healthCheckDate).getTime();
          }
          return false;
        },
      };
    },
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : this.$store.state.auth.user.orgGuid,
        healthCheckId: '',
        diseaseName: '',
        contactTime: '',
        harmExtent: '',
        healthCheckType: 1,
        healthCheckHospital: '',
        healthCheckDate: '',
        healthCheckDateNext: '',
        healthCheckResult: '',
        healthCheckConclusion: '',
        isOccupationalDisease: true,
        dtoOccupationalDiseaseHarmFactors: [],
      };
    },
    // 保存记录
    onSaveCheck(saveCallback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const arr = [];
        this.occupationalFactors.forEach((id) => {
          const obj = {
            factorCodeId: id,
            factorName: this.dict.OccupationalFactor.find(e => e.rowGuid === id)
              && this.dict.OccupationalFactor.find(e => e.rowGuid === id).dictName,
          };
          arr.push(obj);
        });
        this.itemModel.dtoOccupationalDiseaseHarmFactors = arr;
        this.onSaveItem(saveCallback);
      });
    },
    // 保存数据后回调
    callback() {
      this.objectId = this.itemModel.id;
      this.isUpdate = true;
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      this.occupationalFactors = [];
      this.getDictList();
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = true;
        // 危害因素
        if (this.itemModel.dtoOccupationalDiseaseHarmFactors) {
          this.itemModel.dtoOccupationalDiseaseHarmFactors.forEach((item) => {
            this.occupationalFactors.push(item.factorCodeId);
          });
        }
      } else {
        this.itemModel = this.getEmptyItem();
        this.itemModel.healthCheckId = this.healthCheckId;
      }
      this.isUpdate = false;
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isRequest = false;
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 获取数据字典
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
