<!-- 收缩控件组 -->

<template>
  <fieldset class="mod-fieldset-flex">
    <legend @click="isCollapse = !isCollapse">
      <i :class="{ 'el-icon-arrow-right': 1, 'fa-rotate-90': isCollapse }"></i>
      <slot name="prepend"></slot>
      <span>{{ title }}</span>
      <slot name="append"></slot>
    </legend>
    <!-- 内容区域 -->
    <transition name="fade-move">
      <div v-show="isCollapse">
        <slot></slot>
      </div>
    </transition>
  </fieldset>
</template>

<script>
export default {
  name: 'FieldsetFlex',
  props: {
    // 接收绑定参数
    title: String,
    // 是否折叠
    fold: Boolean,
  },
  data() {
    return {
      isCollapse: true,
      radioVal: true,
      checkedVal: true,
    };
  },
  created() {
    this.isCollapse = !this.fold;
  },
};
</script>
