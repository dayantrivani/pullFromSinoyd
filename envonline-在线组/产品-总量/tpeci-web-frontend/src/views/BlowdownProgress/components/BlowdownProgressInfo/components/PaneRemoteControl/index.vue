<template>
  <remote-control ref="remoteControl" :portInfo="portInfo"></remote-control>
</template>

<script>
import { mapState } from 'vuex';
import RemoteControl from '../../../RemoteControl';

export default {
  name: 'PaneRemoteControl',
  components: { RemoteControl },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      portInfo: state => state.portInfo,
    }),
  },
  methods: {
    onTabClick() {
      this.$refs.remoteControl.onQuerylist();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
