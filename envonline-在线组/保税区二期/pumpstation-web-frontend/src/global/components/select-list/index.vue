<!-- 选择列表 -->
<template>
  <div class="mod-select-list">
    <ul v-if="sampleTypes && sampleTypes.length > 1">
      <li
        v-for="(item, key) in sampleTypes"
        :key="key"
        :class="{ 'sample-type': 1, 'active-type': key === activeType }"
        :value="item.rowGuid"
        @click="onCheckSampleTyp($event, key)">{{ item.typeName }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SelectList',
  props: {
    // 是否显示边框
    border: Boolean,
    // 绑定值
    value: String,
    // 配置项
    props: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>

</style>
