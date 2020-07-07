<template>
  <div class="mod-search-extend">
    <div :class="{ 'body': 1, 'is-extend': extend }">
      <div class="default">
        <div class="left">
          <slot></slot>
        </div>
        <div class="right">
          <slot name="right"></slot>
          <!-- <button type="text" class="btn-toggle" @click="toggle(true)">
            <span>高级检索</span>
            <icon name="caret-down" />
          </button> -->
        </div>
      </div>
      <div class="extend">
        <div class="left">
          <slot name="extend"></slot>
        </div>
        <!-- <button type="text" class="btn-toggle" @click="toggle(false)">
          <span>收起</span>
          <icon name="caret-up" />
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchExtend',
  data() {
    return {
      // 是否展开扩展栏
      extend: false,
    };
  },
  methods: {
    // 切换状态
    toggle(status) {
      this.extend = typeof status === 'boolean' ? status : !this.extend;
    },
  },
};
</script>
