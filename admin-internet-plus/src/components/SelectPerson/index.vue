<!-- 选择人员 -->
<template>
  <el-select
    v-bind="$attrs"
    popper-class="more"
    :value="value"
    :loading="loading"
    v-on="$listeners"
    @change="onChange"
    @visible-change="visible => visible && getPersonList()"
  >
    <!-- 多选操作 -->
    <el-option v-if="typeof $attrs.multiple === 'string'" disabled value="" class="more">
      <el-button type="text" :disabled="value.length === renderList.length" @click="onSelectAll(true)">全选</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button type="text" :disabled="!value.length" @click="onSelectFlip()">反选</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button type="text" :disabled="!value.length" @click="onSelectAll(false)">取消选择</el-button>
    </el-option>
    <!-- 补充项 -->
    <slot></slot>
    <!-- 选项 -->
    <el-option
      v-for="item in renderList"
      :key="item[props.value]"
      :label="item[props.label]"
      :value="item[props.value]"
    >
      <span v-show="showAvatar" class="pad-r-md">
        <icon name="avatar" scale="1.5" />
      </span>
      <span>{{ item[props.label] }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { getUserPerson } from './request';

const props = { value: 'id', label: 'userName' };

export default {
  name: 'SelectPerson',
  inheritAttrs: false,
  model: {
    value: 'value',
    event: 'input',
  },
  props: {
    value: {
      required: true,
    },
    // 是否用户
    isUser: {
      type: Boolean,
      default: true,
    },
    // 显示人员头像
    showAvatar: {
      type: Boolean,
      default: true,
    },
    // 角色权限编码
    roles: {
      type: [String, Array],
      default: () => ([]),
    },
  },
  data() {
    return {
      props,
      loading: false,
      checked: false,
      personList: [],
    };
  },
  computed: {
    ...mapState('auth', ['userList']),
    renderList() {
      const persons = this.personList;
      return persons;
    },
  },
  mounted() {
    this.GetUserList();
  },
  methods: {
    ...mapActions('auth', ['GetUserList']),
    // change 事件
    onChange(val) {
      this.$emit('input', val);
      if (typeof val === 'object') {
        const items = this.personList.filter(v => val.includes(v[props.value])) || [];
        this.$emit('update:label', items.map(v => v[props.label]));
        this.$emit('change', items);
      } else {
        const item = this.personList.find(v => v[props.value] === val) || {};
        this.$emit('update:label', item[props.label]);
        this.$emit('change', item);
      }
    },
    // 全选
    onSelectAll(val) {
      this.onChange(val ? this.renderList.map(v => v[props.value]) : []);
    },
    // 反选
    onSelectFlip() {
      const ids = this.renderList.map(v => v[props.value]).filter(v => !this.value.includes(v));
      this.onChange(ids);
    },
    // 获取人员列表
    getPersonList() {
      if (this.personList.length) return Promise.resolve(this.personList);
      if (!this.roles || !this.roles.length) {
        this.personList = this.userList || [];
        return Promise.resolve(this.personList);
      }
      return new Promise((resolve) => {
        this.loading = true;
        const permission = typeof this.roles === 'string' ? [this.roles] : this.roles;
        getUserPerson({ permission, isUser: this.isUser })
          .then((response) => {
            const { success, data, msg } = response.data;
            if (success) {
              this.personList = data || [];
              resolve(data);
            } else {
              this.$message.warning({ message: msg });
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>
