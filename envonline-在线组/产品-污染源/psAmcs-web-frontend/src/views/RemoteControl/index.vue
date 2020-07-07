<!-- 远程控制 -->
<template>
  <el-row :gutter="$config.space" v-resize class="fill-h">
    <el-col :span="16" class="pad-r-0">
      <remote-record
        ref="remoteRecord"
        :portList="portList"
        :portInfo="portInfo"
        @changeChildPortTypes="onChangeChildPortTypes"/>
    </el-col>
    <el-col :span="8" style="height:calc(100% + 5px)">
      <control-config :portList="portList" :portInfo="portInfo" @onQuerylist="onQuerylist()"></control-config>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import RemoteRecord from './components/RemoteRecord';
import ControlConfig from './components/ControlConfig';

export default {
  name: 'RemoteControl',
  components: { RemoteRecord, ControlConfig },
  props: {
    portInfo: {
      type: Object,
      default: () => ({
        portId: '',
        protocol: '',
      }),
    },
  },
  data() {
    return {
      portList: [],
    };
  },
  computed: {
    ...mapState({
      amcsType: state => state.auth.amcsType,         // 1 废水 2 废气
    }),
  },
  created() {
    this.getPortList();
  },
  methods: {
    /** 请求层 */
    getPortList(childPortTypes = this.$enum.get('CHILD_PORT_TYPES', this.amcsType)) {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          isEnabled: true,
          page: 1,
          rows: 100000,
          childPortTypes,
          portType: this.amcsType,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    onChangeChildPortTypes(val) {
      this.getPortList(val);
    },
    onQuerylist() {
      this.$refs.remoteRecord.onQueryList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
