<template>
  <div :class="{'mp-formitem': true, active: item === currentItem, moving: item === movingItem}">
    <div :class="{'table-only-group': item.onlyGroup}" class="component-view component-table">
      <div class="component-label-wrapper">
        <i class="formitem-remove" @click.stop.prevent="onRemoveMe">&times;</i>
        <i
          v-if="item.collapsible"
          :class="{'fa-caret-up': item.collapsed, 'fa-caret-down': !item.collapsed}"
          class="fa pull-right"
          style="margin-right:1em;margin-top:3px"
        >
        </i>
        <label
          class="component-label"
          draggable="true"
          @dragstart.stop="onItemDragstart($event)"
          @dragend.stop="onItemDragend($event)"
          @dragenter.stop="onItemDragenter"
          @click.stop="onItemClick"
        >{{ item.label }}</label>
      </div>
      <div
        class="component-area"
        @dragenter.stop.prevent="onAreaDragenter"
        @dragleave.stop.prevent="onAreaDragleave"
      >
        <template v-for="(subitem, index) in item.children">
          <div v-if="subitem.type === '_mark'" :key="index" class="dragging-mark"></div>
          <mp-form-component
            v-else
            :key="subitem.id"
            :item="subitem"
            :current-item="currentItem"
            :moving-item="movingItem"
            @formitem:click="onSubitemClick"
            @formitem:remove="onRemoveSubitem"
            @formitem:enter="onSubitemDragenter"
            @formitem:start="onSubitemDragstart"
            @formitem:end="onSubitemDragend"
          />
        </template>
      </div>
      <div
        v-if="item.onlyGroup === false"
        class="component-action"
        draggable="true"
        @dragstart.stop="onItemDragstart($event)"
        @dragend.stop="onItemDragend($event)"
        @dragenter.stop="onItemDragenter"
        @click.stop="onItemClick"
      >
        <i class="el-icon-plus"></i> {{ item.action_name }}
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import MpFormComponent from './form-component';

export default {
  name: 'MpFormTable',
  components: {
    MpFormComponent,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    currentItem: {
      type: Object,
      default: () => ({}),
    },
    movingItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {
    onItemDragstart(evt) {
      this.$emit('formitem:start', this.item);
      evt.dataTransfer.setData('text/plain', '');
      evt.dataTransfer.effectAllowed = 'move';
    },
    onItemClick() {
      this.$emit('formitem:click', this.item);
    },
    onItemDragend(evt) {
      this.$emit('formitem:end', evt);
    },
    onItemDragenter() {
      this.$emit('formitem:enter', this.item);
    },
    onAreaDragenter() {
      // console.log('enter area');
      this.$emit('formarea:enter', this.item);
    },
    onAreaDragleave() {
      this.$emit('formarea:leave', this.item);
    },
    onRemoveMe() {
      this.$emit('formitem:remove', this.item);
    },

    onSubitemClick(subitem) {
      this.$emit('formitem:click', subitem);
    },
    onRemoveSubitem(subitem) {
      this.$emit('formitem:remove', subitem);
    },
    onSubitemDragenter(subitem) {
      this.$emit('formitem:enter', subitem);
    },
    onSubitemDragstart(subitem) {
      this.$emit('formitem:start', subitem);
    },
    onSubitemDragend(subitem) {
      this.$emit('formitem:end', subitem);
    },
  },
};
</script>

<style lang="scss">
$pcolor: #2db7f5;

.mp-formitem {
  .component-view.component-table {
    padding: 5px 0 0;
    background: transparent;
    cursor: default;
    .component-label-wrapper {
      & > .component-label {
        padding: 5px 15px;
        width: auto;
        display: block;
        color: #888;
        cursor: move;
      }
      &:hover > .formitem-remove {
        display: inline;
      }
    }
    & > .mp-formitem {
      margin: 0;
    }
    & > .component-icon {
      display: none;
    }
    & > .component-area {
      background: #ddeff3;
      min-height: 80px;
      &:empty {
        line-height: 80px;
        text-align: center;
        &:after {
          content: '拖入组件';
          color: #aaa;
        }
      }
      .mp-formitem {
        margin: 0;
        &:not(:first-child) {
          margin-top: -1px;
        }
      }
    }
    & > .component-action {
      text-align: center;
      padding: 10px;
      color: $pcolor;
      font-size: 15px;
    }
  }
  &.moving .component-table .dragging-mark {
    display: none !important;
  }
}
</style>
