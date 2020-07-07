<template>
  <dialog-modal ref="dialog" title="站点选择" @close="closeDialog" appendToBody>
    <el-form inline :model="queryForm" class="mar-t-xs">
      <!-- <el-form-item label="监管级别：">
        <el-select v-model="queryForm.level">
          <el-option :value="" label="所有"></el-option>
          <el-option
            v-for="item in "
            :key="item.id"
            :value="item.rowGuid"
            :label="item.">
          </el-option>
        </el-select>
      </!-->
      <el-form-item label="行政区域：">
        <select-tree
          style="width: 130px"
          v-model="queryForm.regionCodeId"
          lazy
          joint
          rootKey="0"
          url="sys/area"
          :props="{ label: 'areaName' }"
        ></select-tree>
      </el-form-item>
      <!-- <el-form-item label="行业：">
        <select-tree
          style="width: 130px"
          v-model="queryForm.regionCodeId"
          :options="industryList"
          :props="{ label: 'dictName', value: 'rowGuid' }"
        ></select-tree>
      </el-form-item> -->
      <el-form-item style="float: right;">
        <el-button type="success" icon="fas fa-check" @click="onClickSure">确 认</el-button>
      </el-form-item>
    </el-form>
    <el-transfer
      v-loading="loading"
      v-model="queryForm.portIds"
      :titles="['待选', '已选']"
      style="height: 400px;margin-bottom:10px"
      :data="stationList"
      :props="{
        key: 'id',
        label: 'portName'
      }">
    </el-transfer>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'SelectStation',
  mixins: [],
  props: ['isAll'],
  components: {},
  data() {
    return {
      loading: false,
      queryForm: {
        regionCodeId: '',
        portIds: [],
      },
      industryList: [],
      stationList: [],
    };
  },
  created() {
    // this.getIndustry();
    this.getStation();
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.regionCodeId': function (val) {
      if (val) {
        this.getStation();
      }
    },
  },
  methods: {
    // 获取行业
    // getIndustry() {
    //   this.$http.get('sys/enumCode?codeValue=IndustryCategory')
    //     .then((response) => {
    //       this.industryList = response.data;
    //     }, ({ response }) => {
    //       analyzeResp(response);
    //     });
    // },
    getStation() {
      this.loading = true;
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          page: 1,
          rows: 100000,
          portType: this.$attrs.portType,
          childPortType: 1,
          regionCodeId: this.queryForm.regionCodeId,
        },
      }).then((response) => {
        if (response.data.success) {
          this.stationList = response.data.data;
          this.closeDialog();
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    openDialog() {
      this.queryForm.portIds = this.isAll ? this.stationList.map(e => e.id) : [];
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onClickSure() {
      const isAll = this.queryForm.portIds.length === this.stationList.length;
      this.$emit('query', null, { portIds: this.queryForm.portIds, isAll });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
