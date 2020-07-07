<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="(item, key) in systemType"
      :lazy="key !== 0"
      :key="key"
      :label="item.dictName"
      :name="item.dictCode"
    >
      <water-or-air :portType="item.dictValue" ref="tab"></water-or-air>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import WaterOrAir from './WaterOrAir';

export default {
  name: 'ExcessiveRules',
  mixins: [],
  components: {
    WaterOrAir,
  },
  data() {
    return {
      systemType: [],
      activeName: 'Water',
    };
  },
  created() {
    this.getPortType();
  },
  watch: {},
  methods: {
    getPortType() {
      this.$store.dispatch('dict/GET_SYSTEM_TYPE').then((val) => {
        this.systemType = val;
      });
    },
    handleClick(tab) {
      if (tab.$children && tab.$children.length !== 0) {
        tab.$children[0].getItemList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
