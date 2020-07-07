<template>
  <el-collapse v-model="isCollapse" fit accordion @change="(activeName) => $emit('update:extend', !!activeName)">
    <el-collapse-item name="info">
      <template slot="title">
        <slot name="title">
          <div class="fn-flex pad-x-md fill-w z-default">
            <div class="flex-1 text-info i-overflow" @click.stop>
              <slot name="intro"></slot>
            </div>
            <div class="inline-block z-pointer">
              <span>{{ title || showInfo }}</span>
            </div>
          </div>
        </slot>
      </template>
      <div :class="`text-${align}`">
        <slot>
          <info v-if="showInfo" :name="showInfo" />
        </slot>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: 'Collapse',
  inheritAttrs: false,
  components: {
    Info: () => import('@/components/Info'),
  },
  props: {
    // 是否展开 .sync
    extend: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    // 显示信息文本
    showInfo: {
      type: String,
      default: '',
    },
    // 对齐方式
    align: {
      type: String,
      default: 'left',
    },
  },
  computed: {
    isCollapse: {
      get() {
        return this.extend ? 'info' : '';
      },
      set(activeName) {
        this.$emit('update:extend', !!activeName);
      },
    },
  },
};
</script>
