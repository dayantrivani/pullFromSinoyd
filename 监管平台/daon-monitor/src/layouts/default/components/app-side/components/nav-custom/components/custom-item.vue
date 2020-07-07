<template>
  <draggable
    v-model="itemList"
    class="menu-list"
    tag="ul"
    v-bind="dragOption"
    :move="onMove"
    @start="onStart"
    @end="onEnd">
    <li
      v-for="(item, index) in itemList"
      :class="{ 'menu-item': 1, 'is-active': item[props.code] === $route.name }"
      :key="index"
      @click="onClickItem($event, index, item)">
      <i :class="item[props.icon]"></i>
      <span>{{ item[props.label] }}</span>
    </li>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import config from '@/config';

export default {
  name: 'MenuItem',
  components: {
    draggable,
  },
  inject: ['app'],
  watch: {
    itemList(val) {
      this.app.setItemList(val);
    },
  },
  created() {
    this.itemList = this.app.menuItemSed;
  },
  data() {
    return {
      props: config.navbar,
      itemList: [],
      dragOption: {
        animation: 150,
        group: this.group,
        forceFallback: true,  // 不使用原生的html5的拖放
        fallbackClass: 'is-chosen',
      },
    };
  },
  methods: {
    // 单击时重置拖拽状态
    onClickItem(event, index, item) {
      if (config.app.iframe) {
        this.app.setIframeSrc(item[this.props.path]);
      }
      this.$router.replace({ name: item[this.props.code] });
    },
    // 拖拽开始
    onStart(el) {
      this.isDragging = true;
      [...el.from.children].forEach((e) => {
        e.removeAttribute('draggable');
      });
    },
    // 拖拽结束
    onEnd(el) {
      this.isDragging = false;
      [...el.to.children].forEach((e) => {
        e.removeAttribute('draggable');
      });
      el.to.children[el.newIndex].setAttribute('draggable', false);
      // this.shiftIndex = el.newIndex;
    },
    // 拖拽中
    onMove({ relatedContext, draggedContext } /* , { dataTransfer } */) {
      // dataTransfer.dropEffect = 'move';
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
  },
};
</script>

<style lang="scss">
  ul.menu-list {
    padding-top: 5px;
  }
  li.menu-item {
    position: relative;
    padding: 10px 20px 10px 0;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    > i {
      display: inline-block;
      width: 50px;
      font-size: 14px;
      text-align: center;
    }
    &:hover {
      color: $-color-white;
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
    }
    &.is-active {
      color: $-color-white;
      background-color: #203544;
      &::before {
        background-color: #23B7E5;
      }
    }
  }
</style>
