<template>
  <a-card id="api" title="API" class="mar-t-md" :bordered="false">
    <a-table v-if="data.attr" id="attr" :pagination="false" :columns="columns.attr" :dataSource="data.attr">
      <template v-slot:title>属性 Attributes</template>
    </a-table>
    <a-table v-if="data.props" id="attr" :pagination="false" :columns="columns.attr" :dataSource="data.props">
      <template v-slot:title>Props</template>
    </a-table>
    <a-table v-if="data.slot" id="slot" :pagination="false" :columns="columns.slot" :dataSource="data.slot">
      <template v-slot:title>属性 Attributes</template>
    </a-table>
    <a-table v-if="data.event" id="event" :pagination="false" :columns="columns.event" :dataSource="data.event">
      <template v-slot:title>事件 Event</template>
    </a-table>
    <a-table v-if="data.methods" id="methods" :pagination="false" :columns="columns.methods" :dataSource="data.methods">
      <template v-slot:title>方法 Methods</template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  name: 'DocApi',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      columns: {
        attr: [
          { key: 'params', dataIndex: 'params', title: '参数' },
          { key: 'intro', dataIndex: 'intro', title: '说明' },
          { key: 'type', dataIndex: 'type', title: '类型' },
          { key: 'select', dataIndex: 'select', title: '可选值' },
          { key: 'default', dataIndex: 'default', title: '默认值' },
        ],
        slot: [
          { key: 'name', dataIndex: 'name', title: 'name' },
          { key: 'intro', dataIndex: 'intro', title: '说明' },
        ],
        event: [
          { key: 'eventName', dataIndex: 'eventName', title: '事件名称' },
          { key: 'intro', dataIndex: 'intro', title: '说明' },
          { key: 'cbParams', dataIndex: 'cbParams', title: '回调参数' },
        ],
        methods: [
          {
            key: 'methodsName', width: 165, dataIndex: 'methodsName', title: '方法名',
          },
          { key: 'intro', dataIndex: 'intro', title: '说明' },
          { key: 'params', dataIndex: 'params', title: '参数' },
        ],
      },
    };
  },
};
</script>
