<template>
  <el-card :header="header" shadow="never" class="mod-doc-code">
    <template slot="header">
      <div>
        <icon name="tags" />
        <span class="pad-l-xs">{{ header }}</span>
      </div>
    </template>
    <div class="row-sm">
      <slot></slot>
    </div>
    <el-collapse v-model="activeKey" :bordered="false">
      <el-collapse-item name="code">
        <template #title>
          <icon name="code" size="1.5em" />
          <span class="pad-l-xs">{{ activeKey.includes('code') ? '隐藏' : '查看' }}代码</span>
        </template>
        <div class="code-wrap">
          <pre v-highlightjs="codeText"><code :class="codeType"></code></pre>
          <span class="copy-icon" v-copy="codeText" title="Copy">
            <icon name="el-icon-copy-document" size="1.2em" />
            <span class="pad-l-xs">复制代码</span>
          </span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
export default {
  name: 'DocCode',
  props: {
    // 展开代码块
    opened: Boolean,
    // 标题
    header: {
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
<style lang="scss" scoped>
.mod-doc-code {
  .i-md {
    line-height: 2.5em;
  }
  + .mod-doc-code {
    margin-top: $-scope;
  }
  .code-wrap {
    position: relative;
    font-family: 'Consolas';
    font-size: 1.4rem;
    span.copy-icon {
      display: block;
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
      border: 5px solid transparent;
      transition: all .25s;
    }
    span.copy-icon:hover {
      color: $--color-success;
    }
    pre * {
      font-family: 'Consolas';
    }
    p code {
      font-family: 'Consolas';
      margin: 0 3px;
      background: #f2f4f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
      border: 1px solid #eee;
    }
  }
}
</style>
