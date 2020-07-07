<!-- 组件 / 图标选择器 -->

<template>
  <container>

    <doc-code id="select-icon-base" header="基础用法" :code-text="selectIconBaseCode">
      <select-icon-base />
      <div class="row-md pad-y-sm">
        <p>用于快速选择图标, 若未传 data 参数，则默认为项目引入的全部图标"</p>
      </div>
    </doc-code>

    <doc-code id="select-icon-props" header="配置属性" :code-text="selectIconPropsCode">
      <select-icon-props />
      <div class="row-md pad-y-sm">
        <p>若传给<code>data</code>的数据是数组对象，那么需要配置 props 属性指定图标属性</p>
      </div>
    </doc-code>

    <doc-api id="api" title="API" :data="api" />
  </container>
</template>

<script>
import DocApi from '@/components/DocApi';
import DocCode from '@/components/DocCode';

import SelectIconBase from './components/select-icon-base';
import SelectIconProps from './components/select-icon-props';

// code text
import selectIconBaseCode from '!!raw-loader!./components/select-icon-base';
import selectIconPropsCode from '!!raw-loader!./components/select-icon-props';

export default {
  name: 'SelectIcon',
  components: {
    DocApi,
    DocCode,
    SelectIconBase,
    SelectIconProps,
  },
  data() {
    return {
      selectIconBaseCode,
      selectIconPropsCode,
      api: {
        attr: [
          {
            params: 'value / v-model',
            intro: '绑定值',
            type: 'string',
            select: '—',
            default: '—',
          },
          {
            params: 'data',
            intro: '展示数据',
            type: 'array',
            select: '—',
            default: '—',
          },
          {
            params: 'props',
            intro: '配置选项，具体看下表',
            type: 'object',
            select: '—',
            default: '{ value: icon, label: title }',
          },
        ],
        props: [
          {
            params: 'value',
            intro: '指定数据对象的某个属性值为图标值',
            type: 'string',
            select: '—',
            default: 'value',
          },
          {
            params: 'label',
            intro: '指定数据对象的某个属性值为悬浮说明',
            type: 'string',
            select: '—',
            default: 'title',
          },
        ],
      },
    };
  },
};
</script>
