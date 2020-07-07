<template functional>
  <a-sub-menu
    :key="props.menuInfo.moduleUrl"
  >
    <span slot="title">
      <icon :name="props.menuInfo.icon" custom-class="anticon anticon-ant-design" />
      <span>{{ props.menuInfo.label }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.moduleUrl">
        <icon :name="item.icon" custom-class="anticon anticon-ant-design" />
        <span>{{ item.label }}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.moduleUrl"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo'],
};
</script>
