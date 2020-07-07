<template>
  <dialog-modal ref="dialog" size="small" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}受限空间`" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="150px" :rules="rules" :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="受限空间名称：" prop="name">
            <el-input :maxlength="30" v-model="itemModel.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量：" prop="quantity">
            <el-input :maxlength="10" v-model="itemModel.quantity"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="主要危险有害物质：" prop="mainHazardous">
            <el-input :maxlength="100" v-model="itemModel.mainHazardous"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="易导致事故类型：">
            <el-checkbox-group v-model="accidentTypes" @change="changeAccidentTypes">
              <el-checkbox v-for="item in accidentProneOccurType" :key="item.rowGuid" :label="item.rowGuid">
                {{item.dictName}}</el-checkbox>
            </el-checkbox-group>
            <el-input placeholder="其他伤害" :maxlength="30" v-if="otherHarm" v-model="otherHarmInput"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="位置：" prop="location">
            <el-input :maxlength="100" v-model="itemModel.location"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="安全设施：" prop="safetyFacility">
            <el-input :maxlength="100" v-model="itemModel.safetyFacility"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input :maxlength="500" type="textarea" v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck()">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { validateNum } from '@/libs/tools';

export default {
  data() {
    return {
      url: 'wholeprocess/confinedSpace',
      itemModel: this.getEmptyItem(),
      otherHarmInput: '', // 其他事故输入框
      accidentTypes: [], // 易发生的事故类型
      otherHarm: false,
      rules: {
        name: [
          { required: true, message: '请输入受限空间名称', trigger: ['blur', 'change'] },
        ],
        mainHazardous: [
          { required: true, message: '请输入主要危险有害物质', trigger: ['blur', 'change'] },
        ],
        location: [
          { required: true, message: '请输入位置', trigger: ['blur', 'change'] },
        ],
        safetyFacility: [
          { required: true, message: '请输入安全设施（预防/应急）', trigger: ['blur', 'change'] },
        ],
        quantity: [{ validator: validateNum, trigger: ['blur', 'change'] }],
      },
    };
  },
  props: {
    accidentProneOccurType: {
      type: Array,
    },
  },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        name: '', // 受限空间名称
        mainHazardous: '', // 主要危险有害物质
        quantity: '', // 数量
        location: '', // 位置
        safetyFacility: '', // 安全设施（预防/应急）
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck() {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem();
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.accidentTypesDispose();
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.otherHarmInput = '';
      this.accidentTypes = [];
      this.otherHarm = false;
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 发送保存记录请求
    onSaveItem() {
      this.saveLoading = true;
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            this.beforeSaveAccidentTypes();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        });
    },
    // 风险类型数据处理
    accidentTypesDispose() {
      this.accidentTypes = [];
      const haveChoseAccidentTypeIds = this.itemModel.dtoConfinedSpaceAccidentType.map(val => val.typeCodeId);
      haveChoseAccidentTypeIds.forEach((val) => {
        const [first] = this.accidentProneOccurType.filter(item => item.rowGuid === val);
        this.accidentTypes.push(first.rowGuid);
      });
      if (this.accidentTypes.length > 0) {
        this.changeAccidentTypes();
      }
    },
    // 显示其他伤害弹窗
    changeAccidentTypes() {
      const accidentTypeCodeId = this.accidentProneOccurType.find(item => item.dictName === '其他伤害').rowGuid;
      const val = this.accidentTypes.find(item => item === accidentTypeCodeId);
      if (val) {
        this.otherHarm = true;
      } else {
        this.otherHarm = false;
      }
      if (this.itemModel.dtoConfinedSpaceAccidentType) {
        const [first] = this.itemModel.dtoConfinedSpaceAccidentType.filter(val => val.typeCodeId === accidentTypeCodeId);
        if (first) {
          this.otherHarmInput = first.otherHarm;
        }
      }
    },
    // 保存风险类型
    beforeSaveAccidentTypes() {
      const dataAccidentTypes = [];
      this.accidentTypes.forEach((val) => {
        const obj = {};
        this.$set(obj, 'dataId', this.itemModel.id);
        const [first] = this.accidentProneOccurType.filter(item => item.rowGuid === val);
        this.$set(obj, 'typeName', first.dictName);
        this.$set(obj, 'typeCodeId', first.rowGuid);
        if (first.dictName === '其他伤害') {
          this.$set(obj, 'otherHarm', this.otherHarmInput);
        }
        dataAccidentTypes.push(obj);
      });
      this.saveAccident(dataAccidentTypes);
    },
    // 保存风险类型
    saveAccident(dataAccidentTypes) {
      this.$http.post('wholeprocess/confinedSpaceAccidentType', dataAccidentTypes)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$emit('query');
            this.$refs.dialog.closeDialog();
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
  },
};
</script>
