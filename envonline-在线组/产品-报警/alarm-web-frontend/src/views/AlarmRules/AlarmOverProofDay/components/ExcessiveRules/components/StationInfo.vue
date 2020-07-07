<template>
  <dialog-modal ref="dialog" title="站点选择" @close="closeDialog" appendToBody>
    <el-form inline :model="queryForm" class="mar-t-xs">
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
      <el-form-item label="排口类型：">
        <el-select
          style="width:150px"
          v-model="_childPortTypes"
          collapse-tags
          multiple
          clearable
        >
          <el-option
            v-for="(item, index) in $enum.portType[portType].children"
            :key="index"
            :value="index"
            :label="item.dictName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="success" icon="fas fa-check" @click="onClickSure">确 认</el-button>
      </el-form-item>
    </el-form>
    <el-transfer
      v-model="queryForm.portIds"
      :titles="['待选', '已选']"
      style="height: 400px;margin-bottom:10px"
      :data="portInfo"
      :props="{
        key: 'id',
        label: 'portName'
      }">
    </el-transfer>
  </dialog-modal>
</template>

<script>
export default {
  name: 'StationInfo',
  mixins: [],
  props: ['portType', 'portInfo', 'childPortTypes'],
  components: {},
  data() {
    return {
      queryForm: {
        regionCodeId: '',
        regionName: '',
        portIds: [],
      },
    };
  },
  watch: {
    // eslint-disable-next-line
    'queryForm.regionCodeId': function (val) {
      this.$emit('getPortInfo', { regionCodeId: val });
    },
  },
  computed: {
    _childPortTypes: {
      get() { return this.childPortTypes; },
      set(val) {
        this.queryForm.portIds = [];
        this.$emit('change', val);
      },
    },
  },
  methods: {
    openDialog(select = [], regionCodeId = '') {
      this.queryForm.portIds = select;
      this.queryForm.regionCodeId = regionCodeId;
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onClickSure() {
      this.closeDialog();
      this.$emit('query', this.queryForm.portIds, this.childPortTypes);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
