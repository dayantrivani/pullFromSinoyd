<template>
  <el-card id="api" header="API" shadow="never" class="mar-t-scope">
    <template v-if="data.attr">
      <div id="attr" class="doc-title">属性 Attributes</div>
      <el-table border class="mar-b-lg" :data="data.attr">
        <el-table-column
          v-for="item in columns.attr"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </template>
    <template v-if="data.props">
      <div id="attr" class="doc-title">Props</div>
      <el-table border class="mar-b-lg" :data="data.props">
        <el-table-column
          v-for="item in columns.attr"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </template>
    <template v-if="data.slot">
      <div id="slot" class="doc-title">分发 Slot</div>
      <el-table border class="mar-b-lg" :data="data.slot">
        <el-table-column
          v-for="item in columns.slot"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </template>
    <template v-if="data.event">
      <div id="event" class="doc-title">事件 Event</div>
      <el-table border class="mar-b-lg" :data="data.event">
        <el-table-column
          v-for="item in columns.event"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </template>
    <template v-if="data.methods">
      <div id="methods" class="doc-title">方法 Methods</div>
      <el-table border class="mar-b-lg" :data="data.methods">
        <el-table-column
          v-for="item in columns.methods"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>
    </template>
  </el-card>
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
          { prop: 'params', label: '参数' },
          { prop: 'intro', label: '说明' },
          { prop: 'type', label: '类型' },
          { prop: 'select', label: '可选值' },
          { prop: 'default', label: '默认值' },
        ],
        slot: [
          { prop: 'name', label: 'name' },
          { prop: 'intro', label: '说明' },
        ],
        event: [
          { prop: 'eventName', label: '事件名称' },
          { prop: 'intro', label: '说明' },
          { prop: 'cbParams', label: '回调参数' },
        ],
        methods: [
          { prop: 'methodsName', label: '方法名' },
          { prop: 'intro', label: '说明' },
          { prop: 'params', label: '参数' },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.doc-title {
  position: relative;
  padding: 15px;
  font-size: 1.2em;
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 0;
    width: 3px;
    height: 60%;
    background-color: $--color-info;
  }
}
</style>
