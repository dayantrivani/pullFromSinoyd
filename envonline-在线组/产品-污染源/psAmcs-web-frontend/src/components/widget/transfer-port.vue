<template>
  <dialog-modal ref="dialog" title="站点选择">
    <div class="mar-l-sm mar-y-xs">
      <el-form inline :model="queryForm">
        <el-form-item label="所属区域：">
          <area-select
            placeholder="请选择"
            v-model="queryForm.regionCodeId"
            :label="queryForm.regionName"
            @setLabel="setLabel" />
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" icon="fas fa-check" @click="onClickCheck">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-transfer
      v-loading="loading"
      v-model="queryForm.portIds"
      style="height: 400px"
      filterable
      :titles="['待选', '已选']"
      :data="portList"
      :props="{
        key: 'id',
        label: 'portName'
      }">
    </el-transfer>
    <div class="pad-b-xs"></div>
  </dialog-modal>
</template>

<script>
import { mapState } from 'vuex';
// import { analyzeResp } from '@/libs/util';
import AreaSelect from '@/components/widget/area-select';

export default {
  name: 'TransferPort',
  mixins: [],
  components: { AreaSelect },
  props: ['childPortTypes', 'keyPollutant'],
  data() {
    return {
      loading: false,
      queryForm: {
        regionCodeId: '',
        regionName: '',
        portIds: [],
      },
      portList: [],
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  created() {},
  watch: {
    // eslint-disable-next-line
    'queryForm.regionCodeId': function (v1, v2) {
      this.getPortList();
    },
  },
  methods: {
    getPortList() {
      this.loading = true;
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes: this.childPortTypes || this.$enum.getLabel('CHILD_PORT_TYPES', this.amcsType),
          portType: this.amcsType,
          sort: 'psName+,portName',
          regionCodeId: this.queryForm.regionCodeId,
          keyPollutant: this.keyPollutant || null,
        },
      }).then((response) => {
        if (response.data.success) {
          this.portList = response.data.rows || response.data.data || response.data;
          // 利用filter方法来遍历是否有相同的元素
          this.queryForm.portIds = this.portList.map(n => n.id).filter(n => this.queryForm.portIds.indexOf(n) !== -1);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    openDialog(portIds) {
      this.queryForm.portIds = portIds;
      this.$refs.dialog.openDialog();
      this.getPortList();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onClickCheck() {
      this.$emit('getQueryData', [...this.queryForm.portIds]);
      this.closeDialog();
    },
    setLabel(regionName) {
      this.queryForm.regionName = regionName;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
