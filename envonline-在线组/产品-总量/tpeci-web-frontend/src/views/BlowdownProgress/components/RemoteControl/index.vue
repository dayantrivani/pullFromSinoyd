<!-- 远程控制 -->
<template>
  <el-row :gutter="$config.space" v-resize class="fill-h">
    <el-col :span="16" class="pad-r-0">
      <remote-record ref="remoteRecord" :portId="portInfo.portId"/>
    </el-col>
    <el-col :span="8" style="height:calc(100% + 5px)">
      <control-config :portId="portInfo.portId" @onQuerylist="onQuerylist()"></control-config>
    </el-col>
  </el-row>
</template>

<script>
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
    return {};
  },
  methods: {
    onQuerylist() {
      this.$refs.remoteRecord.onQueryList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
