<template>
  <div
    :class="{'mp-formitem': true, active: item === currentItem, moving: item === movingItem}"
    draggable="true"
    @dragstart.stop="onItemDragstart($event)"
    @dragend.stop="onItemDragend($event)"
    @dragenter.stop="onItemDragenter($event)"
    @dragleave.stop="onItemDragleave($event)"
    @click.stop="onItemClick"
  >
    <i class="formitem-remove" @click.stop.prevent="onRemoveMe">&times;</i>

    <div
      v-if="item.type === 'suit_comparison'"
      :class="['component-view', 'component-' + item.type]"
    >
      <span class="label_height">
        <label class="component-label">比对因子</label>
      </span>
      <span class="component-placeholder" style="color:#2db7f5">
        自动出现仪器因子 <i class="fa fa-eyedropper"></i>
      </span>
    </div>
    <div
      v-if="item.type === 'suit_comparison'"
      :class="['component-view', 'component-' + item.type]"
    >
      <span class="label_height">
        <label class="component-label">比对类型</label>
      </span>
      <span class="component-placeholder">
        <i class="far fa-circle"></i> 标样比对 &nbsp;
        <i class="far fa-circle"></i> 实样比对
      </span>
    </div>
    <div :class="['component-view', 'component-' + item.type]">
      <span class="label_height">
        <label class="component-label">{{ item.label }}</label>
      </span>
      <span v-if="typeof item.placeholder !== 'undefined'" class="component-placeholder">
        {{ item.placeholder }}<span v-if="item.required">(必填)</span>
      </span>
      <!-- 快捷选择 -->
      <span v-if="item.type === 'qselect'" class="component-placeholder pull-right">
        <span v-for="o in item.options" :key="o">
          <i class="far fa-circle"></i> {{ o }} &nbsp;
        </span>
      </span>
      <!-- 计算组件 -->
      <!-- <div v-if="item.type === 'compute'" class="component-placeholder pull-right">
        <span class="el-button el-button-small" style="margin:-8px -8px 0 0">计算</span>
      </div> -->
      <!-- 为开关选择显示一个图标 -->
      <span v-if="item.type === 'switch'" class="component-icon">
        <i :class="{'fa-toggle-on': item.default, 'fa-toggle-off': !item.default}" class="fa"></i>
      </span>
    </div>

    <template v-if="!item.measure_times || item.measure_times === 1">
      <div
        v-if="item.label2 !== undefined && item.placeholder2 !== undefined"
        :class="['component-view', 'component-' + item.type]"
      >
        <span class="label_height">
          <label class="component-label">{{ item.label2 }}</label>
        </span>
        <span class="component-placeholder">
          {{ item.placeholder2 }}<span v-if="item.required">(必填)</span>
        </span>
        <span class="component-icon"></span>
      </div>
      <div
        v-if="item.record_measuring_time"
        :class="['component-view', 'component-' + item.type]"
      >
        <span class="label_height">
          <label class="component-label">测量时间</label>
        </span>
        <span class="component-placeholder">
          请选择测量时间<span v-if="item.required">(必填)</span>
        </span>
        <span class="component-icon"></span>
      </div>
    </template>
    <!-- 多次测量 -->
    <template
      v-for="(idx, index) in item.measure_times"
      v-else
    >
      <div
        v-if="item.label2 !== undefined && item.placeholder2 !== undefined"
        :key="index"
        :class="['component-view', 'component-' + item.type]"
      >
        <span class="label_height">
          <label class="component-label">{{ item.label2 }}({{ idx }})</label>
        </span>
        <span class="component-placeholder">
          {{ item.placeholder2 }}<span v-if="item.required">(必填)</span>
        </span>
        <span class="component-icon"></span>
      </div>
      <!-- 使用一个不那么靠谱的方法避免重复的key -->
      <div
        v-if="item.record_measuring_time"
        :key="index + 1000"
        :class="['component-view', 'component-' + item.type]"
      >
        <span class="label_height">
          <label class="component-label">测量时间({{ idx }})</label>
        </span>
        <span class="component-placeholder">
          请选择测量时间<span v-if="item.required">(必填)</span>
        </span>
        <span class="component-icon"></span>
      </div>
    </template>

    <div
      v-if="item.label3 !== undefined && item.placeholder3 !== undefined"
      :class="['component-view', 'component-' + item.type]"
    >
      <span class="label_height">
        <label class="component-label">{{ item.label3 }}</label>
      </span>
      <span class="component-placeholder">
        {{ item.placeholder3 }}<span v-if="item.required && item.type != 'suit_comparison'">(必填)</span>
      </span>
      <span class="component-icon"></span>
    </div>
    <div
      v-if="item.label4 !== undefined && item.placeholder4 !== undefined"
      :class="['component-view', 'component-' + item.type]"
    >
      <span class="label_height">
        <label class="component-label">{{ item.label4 }}</label>
      </span>
      <span class="component-placeholder">
        {{ item.placeholder4 }}<span v-if="item.required">(必填)</span>
      </span>
      <span class="component-icon"></span>
    </div>
    <div
      v-if="item.label5 !== undefined && item.placeholder5 !== undefined"
      :class="['component-view', 'component-' + item.type]"
    >
      <span class="label_height">
        <label class="component-label">{{ item.label5 }}</label>
      </span>
      <span class="component-placeholder">
        {{ item.placeholder5 }}<span v-if="item.required">(必填)</span>
      </span>
      <span class="component-icon"></span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
/* eslint-disable no-param-reassign */
export default {
  name: 'MpFormComponent',
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
    return {

    };
  },
  computed: {
    componentIcon() {
      if (_.includes(['text', 'textarea', 'number'], this.item.type)) {
        return 'i-cursor';
      }
      if (this.item.type === 'switch') {
        return 'toggle-on';
      }
      if (_.includes(['select', 'multiselect'], this.item.type)) {
        return 'caret-down';
      }
      if (_.includes(['date', 'daterange'], this.item.type)) {
        return 'calendar-o';
      }
      if (this.item.type === 'attachment') {
        return 'paperclip';
      }
      if (this.item.type === 'photo') {
        return 'file-photo-o';
      }
      if (this.item.type === 'money') {
        return 'yen';
      }
      return false;
    },
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
    onItemDragenter(evt) {
      if (evt.target === this.$el || evt.target.classList.contains('component-view')) {
        this.$emit('formitem:enter', this.item);
      }
    },
    onItemDragleave(evt) {
      if (evt.target === this.$el) {
        this.$emit('formitem:leave', this.item);
      }
    },
    onAreaDragenter(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      this.$emit('formarea:enter', this.item);
    },
    onAreaDragleave(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      this.$emit('formarea:leave', this.item);
    },
    onRemoveMe() {
      this.$emit('formitem:remove', this.item);
    },
  },
};
</script>

<style lang="scss">
.mp-formitem {
  border: 1px solid #ccc;
  border-left-color: #fff;
  border-right-color: #fff;
  margin: 12px 0;
  position: relative;
  cursor: move;
  &:hover {
    border: 1px dashed #aaf;
  }
  &.active {
    border: 1px solid #38adff;
    z-index: 1;
  }
  &.moving {
    -webkit-filter: blur(1px);
    filter: blur(1px);
    background: #eee;
    border: 1px solid #ccc;
  }
  .formitem-remove {
    position: absolute;
    right: 0;
    top: 0;
    display: none;
    font-size: 12px;
    line-height: 12px;
    color: #fff;
    cursor: pointer;
    z-index: 10;
    background: red;
    padding: 3px 2px 2px 3px;
    font-style: normal;
    font-family: Verdana, Arial;
  }
  &:hover > .formitem-remove {
    display: inline;
  }
  .component-view {
    padding: 15px;
    line-height: 16px;
    background: white;
    .label_height{
      width: 6.5em;
      display: inline-block;
      padding: 0 8px 0 0;
      color: #222;
    }
    .component-label {
      white-space: normal;
      word-break: break-word;
      vertical-align: top;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .component-placeholder {
      color: #ccc;
      vertical-align: top;
      display: inline-block;
    }
    .component-icon {
      position: absolute;
      font-size: 24px;
      right: 15px;
      top: 12px;
      color: #e0e0e0;
      i.fa {
        font-size: 24px;
      }
    }
    &.component-textarea {
      .component-placeholder {
        display: inline-block;
        width: 14.5em;
        height: 3em;
      }
    }
    &.component-note {
      .component-label {
        display: none;
      }
    }
    &.component-daterange, &.component-suit_comparison {
      border-bottom: 1px solid #ccc;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
.readonly .mp-formitem {
  border: 1px solid #ccc;
  border-left-color: #fff;
  border-right-color: #fff;
  cursor: default;
  .formitem-remove {
    display: none;
  }
}
</style>
