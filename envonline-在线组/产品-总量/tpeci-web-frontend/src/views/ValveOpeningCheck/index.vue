<!-- 阀门开启审核/申报 -->
<template>
  <component :is="userType"></component>
  <!-- <component :is="`Ent`"></component> -->
</template>

<script>
import { mapGetters } from 'vuex';
import Ent from './components/Ent';
import Gov from './components/Gov';

export default {
  name: 'ValveOpeningCheck',
  components: {
    Ent,
    Gov,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
