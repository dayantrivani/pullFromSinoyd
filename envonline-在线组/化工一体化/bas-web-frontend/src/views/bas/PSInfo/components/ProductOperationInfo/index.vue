<template>
  <el-card type="title">
    <!-- 标题内容 -->
    <template slot="header">生产经营信息</template>
    <!-- 按钮栏内容 -->
    <div class="mar-l-sm">
      <el-button
        type="primary"
        icon="fa fa-save"
        :loading="saveLoading"
        class="mar-t-xs"
        @click="onSave"
      >保 存</el-button>
    </div>
    <hr class="mar-t-xs mar-x-sm">
    <!-- 表单项的相关内容 -->
    <el-form
      class="mar-t-xs pad-x-sm"
      ref="form"
      label-position="top"
      label-width="160px"
      v-loading="formLoading"
      :model="itemModel"
    >
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="主要经营范围：">
            <el-input type="textarea" v-model="itemModel.mainBusinessScope" :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="主要产品：">
            <el-input type="textarea" v-model="itemModel.mainProducts" :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="主要原料：">
            <el-input type="textarea" v-model="itemModel.mainRawMaterials" :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="主要生产工艺：">
            <el-input type="textarea" v-model="itemModel.mainProductionTechniques" :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="主要生产设备：">
            <el-input type="textarea" v-model="itemModel.mainProductionEquipment" :autosize="{ minRows: 2, maxRows: 2}"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="生产经营单位面积(m²)：">
            <el-input-number
              style="width:100%"
              :min="0"
              controls-position="right"
              v-model="itemModel.officeArea"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'ProductOperationInfo',
  // 说明：1页面中没有必填验证字段。2新增还是修改使用id值来判断。3psId为企业唯一ID
  data() {
    return {
      saveLoading: false,                     // 按钮加载状态
      formLoading: false,                     // 表单加载状态
      itemModel: {},                          // 表单数据源
      keyId: '',                              // psId
      companyId: '',                          // 企业Id
      // isOver: false,
    };
  },
  created() {
    this.getItemOne();
  },
  computed: {
    ...mapState({
      psInfo: state => state.psInfo,
    }),
  },
  methods: {
    getEmptyItem() {
      return {
        mainBusinessScope: '',                // 主要经营范围
        mainProducts: '',                     // 主要产品
        mainRawMaterials: '',                 // 主要原料
        mainProductionTechniques: '',         // 主要生产工艺
        mainProductionEquipment: '',          // 主要生产设备
        officeArea: '',                       // 生产经营单位面积
      };
    },
    // 获取数据
    getItemOne() {
      this.formLoading = true;
      this.$http.get(`bas/productOperationInfo/${this.psInfo.id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel = Object.assign(this.getEmptyItem(), response.data.data);
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
        this.formLoading = false;
      });
    },
    // 保存按钮方法
    onSave() {
      this.saveLoading = true;
      if (this.itemModel.officeArea > 100000000.00) {
        this.$message.warning({
          message: '生产经营单位面积过大，请如实填写。',
          duration: 3000,
          showClose: true,
        });
        this.saveLoading = false;
      } else {
        const { id } = this.itemModel;
        this.itemModel.psId = this.psInfo.id;
        this.$http[id ? 'put' : 'post']('bas/productOperationInfo', this.itemModel)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.$message.success({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
              this.itemModel = response.data.data;
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
      }
    },
  },
};
</script>

<style scoped>

</style>
