<!-- 图标选择器
<select-icon v-model=[绑定变量] :options=[选项数据] />
-->

<template>
  <a-popover
    trigger="click"
    placement="bottomLeft"
    overlayClassName="pupop-select-icon"
    :visible="popoverVisible"
    :disabled="disabledSelected"
    @visibleChange="visibleChange">
    <!-- 弹出框内容区 -->
    <template v-slot:content>
      <scrollbar
        v-if="popoverVisible"
        class="hide-x"
        :native="false"
        :noresize="false">
        <!-- 图标项 -->
        <div class="icon-group">
          <div
            v-for="item in options"
            :key="item[prop.value]"
            :title="item[prop.label]"
            :class="{ 'icon-item': 1, 'is-active': isActive(item[prop.value]) }"
            @click="onClickSelected(item[prop.value])">
            <icon :name="item[prop.value]"/>
          </div>
        </div>
      </scrollbar>
    </template>
    <!-- 页面显示内容区 -->
    <div
      :title="selectedTitle"
      :class="{
        'mod-select-icon': 1,
        'is-opened': popoverVisible,
        'is-active': value,
        'is-disabled': disabledSelected
      }">
      <!-- 显示图标 -->
      <div class="icon-item">
        <icon v-if="value" :name="value"/>
        <icon v-else name="plus" />
      </div>
      <!-- 清空按钮 -->
      <div v-show="value" class="btn-clear" @click.stop="onClickClear()">
        <icon name="close" />
      </div>
    </div>
  </a-popover>
</template>

<script>

export default {
  name: 'SelectIcon',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    disabled: Boolean,
    // 接收绑定参数 - 图标类名
    value: {
      type: String,
      required: true,
    },
    // 选项数据
    data: {
      type: Array,
      default: () => ([]),
    },
    // 配置项
    props: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    // 合并配置参数
    prop() {
      return Object.assign({
        value: 'icon',  // 图标名
        label: 'title', // 图标说明
      }, this.props);
    },
    // 数据容错判断
    options() {
      if (this.data.length && typeof this.data[0] === 'string') {
        return this.data.map(v => ({
          [this.prop.value]: v,
          [this.prop.label]: v,
        }));
      }
      return this.data;
    },
    disabledSelected() {
      if (this.disabled) return true;
      return this.$parent.form ? this.$parent.form.disabled : false;
    },
    selectedTitle() {
      const item = this.options.find(v => v[this.prop.value] === this.value);
      return item ? item[this.prop.label] : '';
    },
  },
  data() {
    return {
      // 弹出框显示状态
      popoverVisible: false,
    };
  },
  methods: {
    // 是否为当前已选项
    isActive(item) {
      return this.value === item;
    },
    // 选中图标
    onClickSelected(item) {
      this.$emit('selected', item);
      this.popoverVisible = false;
    },
    // 清空选项
    onClickClear() {
      this.$emit('selected', '');
    },
    // 气泡框显示
    visibleChange(visible) {
      this.popoverVisible = visible;
    },
  },
};
</script>
