<template>
  <div>
    <el-tooltip content="仅开发环境显示" placement="top">
      <span class="text-success">Dev</span>
    </el-tooltip>
    <el-select
      v-model="value"
      class="inline-block simple"
      style="width: 150px"
      @change="change"
    >
      <el-option
        v-for="item in userList"
        :key="item.uid"
        :label="item.name"
        :value="item.uid"
      >
        <span>{{ item.name }}</span>
        <span class="text-info pad-l-sm">{{ item.intro }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>

const userList = [
  {
    name: '超级管理员',
    role: '管理人员',
    intro: '',
    uid: '13345678901',
    pid: '111111',
  },
];

export default {
  data() {
    return {
      value: '',
      userList,
    };
  },
  mounted() {
    if (!this.$config.isPro) {
      this.change(userList[0]);
    }
  },
  methods: {
    change(val) {
      const item = userList.find(v => v.uid === val) || userList[0];
      this.$emit('change', { uid: item.uid, pid: item.pid });
    },
  },
};
</script>
