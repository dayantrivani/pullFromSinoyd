<template>
  <a-card :title="title" :bordered="false" class="mod-doc-code">
    <slot></slot>
    <a-collapse v-model="activeKey" :bordered="false">
      <a-collapse-panel :header="`${activeKey.includes('code') ? 'hide' : 'show'} code`" key="code">
        <pre v-highlightjs="codeText"><code :class="codeType"></code></pre>
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>

<script>
export default {
  name: 'DocCode',
  props: {
    // 展开代码块
    opened: Boolean,
    // 标题
    title: {
      type: String,
      default: 'code',
    },
    // 代码文本
    codeText: {
      type: String,
      default: '',
    },
    // 代码类型
    codeType: {
      type: String,
      default: 'html',
    },
  },
  created() {
    this.activeKey[0] = this.opened ? 'code' : '';
  },
  data() {
    return {
      activeKey: [],
    };
  },
};
</script>
