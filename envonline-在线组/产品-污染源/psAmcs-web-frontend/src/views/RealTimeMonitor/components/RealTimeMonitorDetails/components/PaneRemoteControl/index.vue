<template>
  <remote-control :portInfo="portInfo"></remote-control>
</template>

<script>
import { mapState } from 'vuex';
import RemoteControl from '@/views/RemoteControl';

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
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
