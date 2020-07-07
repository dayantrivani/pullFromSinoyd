<template>
  <!-- 车辆信息 -->
  <el-card class="title-card" type="title">
    <template slot="header">车辆信息</template>
    <div class="mar-l-sm mar-y-xs">
      <el-button
        :loading="saveLoading"
        type="primary"
        icon="fas fa-save"
        @click="onSaveItem">保 存</el-button>
      <!-- <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button> -->
    </div>
    <hr>
    <el-form
      :model="itemForm"
      ref="form"
      :rules="rules"
      label-width="200px"
      class="mar-t-xs pad-x-sm item-space">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="货车(辆)：" prop="freightCar">
            <el-input-number
              :min="0"
              v-model="itemForm.freightCar"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货船(艘)：" prop="freightShip">
            <el-input-number
              :min="0"
              v-model="itemForm.freightShip"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="客车(辆)：" prop="passengerCar">
            <el-input-number
              :min="0"
              v-model="itemForm.passengerCar"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客船(艘)：" prop="passengerShip">
            <el-input-number
              :min="0"
              v-model="itemForm.passengerShip"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="工程车(辆)：" prop="engineeringVehicle">
            <el-input-number
              :min="0"
              v-model="itemForm.engineeringVehicle"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程船(艘)：" prop="engineeringShip">
            <el-input-number
              :min="0"
              v-model="itemForm.engineeringShip"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="其他类型车(辆)：" prop="otherVehicle">
            <el-input-number
              :min="0"
              v-model="itemForm.otherVehicle"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他类型船(艘)：" prop="otherShip">
            <el-input-number
              :min="0"
              v-model="itemForm.otherShip"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="危险化学品运输车(辆)：" prop="dangerousChemicalsVehicle">
            <el-input-number
              :min="0"
              v-model="itemForm.dangerousChemicalsVehicle"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危险化学品运输船(艘)：" prop="dangerousChemicalsShip">
            <el-input-number
              :min="0"
              v-model="itemForm.dangerousChemicalsShip"
              controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'VehicleInfo',
  data() {
    return {
      loading: false,
      itemForm: {},
      saveLoading: false,
      rules: {
        num: [
          { required: true, message: '请输入货车/船', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请输入客车/船', trigger: 'blur' },
        ],
        vehivle: [
          { required: true, message: '请输入危险化学品运输车/船', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getItemList();
  },
  computed: {
    psId() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo.id || JSON.parse(window.sessionStorage.getItem('psInfo')).id;
    },
  },
  methods: {
    getItemList() { // 获取数据列表
      this.$http.get(`bas/vehicleInfo/${this.psId}`).then((response) => {
        if (response.data.success) {
          this.itemForm = response.data.data || {};
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onSaveItem() {
      this.saveLoading = true;
      this.$http[this.itemForm.id ? 'put' : 'post']('bas/vehicleInfo/', {
        ...this.itemForm,
        psId: this.psId,
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          // 查询数据
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        analyzeResp(response);
      }).finally(() => {
        this.saveLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
