<template>
  <el-scrollbar :native="false" :noresize="false">
    <draggable
      v-model="itemList"
      :class="{ 'mod-drag-list': 1, 'is-dragging': isDragging }"
      :options="dragOption"
      :move="onMove"
      @start="onStart"
      @end="onEnd">
      <transition-group type="transition" tag="ul" :name="transition">
        <li
          v-for="(item, index) in itemList"
          class="drag-item"
          :key="item[props.value]"
          @click="onClickItem($event, index)">
          <slot :scope="item">{{ item[props.label] }}</slot>
        </li>
      </transition-group>
    </draggable>
  </el-scrollbar>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'DragList',
  components: {
    draggable,
  },
  model: {
    prop: 'data',
    event: 'setData',
  },
  props: {
    // 数据对象
    data: {
      type: Array,
      required: true,
    },
    // 分组用的，同一组的不同list可以相互拖动
    group: {
      type: String,
      default: 'single',
    },
    transition: {
      type: String,
      default: '',  // drag-col
    },
    // 配置项
    props: {
      type: Object,
      required: false,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
  },
  data() {
    return {
      itemList: [],
      isDragging: false,
      shiftIndex: '',
      dragSelected: [],
      dragOption: {
        animation: 150,
        group: this.group,
        forceFallback: true,  // 不使用原生的html5的拖放
        fallbackClass: 'is-chosen',
      },
    };
  },
  watch: {
    data(val) {
      this.itemList = val;
    },
    itemList(val) {
      this.$emit('setData', val);
    },
  },
  created() {
    this.itemList = this.data;
  },
  methods: {
    // 单击时重置拖拽状态
    onClickItem(event, index) {
      const items = [...event.target.parentNode.children];
      // // 按住ctrl多选
      // if (event.ctrlKey) {
      //   event.target.setAttribute('draggable', false);
      //   this.dragSelected.push(event.target);
      // }
      // // 按住shift连选
      // if (event.shiftKey) {
      //   const [min, max] = [Math.min(this.shiftIndex, index), Math.max(this.shiftIndex, index)];
      //   for (let i = min; i <= max; i++) {
      //     items[i].setAttribute('draggable', false);
      //     this.dragSelected.push(items[i]);
      //   }
      // }
      // 单选
      if (!event.shiftKey && !event.ctrlKey) {
        this.shiftIndex = index;
        items.forEach((e) => {
          e.removeAttribute('draggable');
        });
        event.target.setAttribute('draggable', false);
        // this.dragSelected = [event.target];
      }
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
