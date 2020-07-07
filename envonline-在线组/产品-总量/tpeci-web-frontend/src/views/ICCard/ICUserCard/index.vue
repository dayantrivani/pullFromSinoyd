<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="onTabClick">
    <el-tab-pane label="用户卡" lazy name="userCard">
      <user-card ref="userCard" />
    </el-tab-pane>
    <el-tab-pane label="管理卡" lazy name="manageCard">
      <manage-card ref="manageCard" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import UserCard from './components/UserCard';
import ManageCard from './components/ManageCard';

export default {
  name: 'ICUserCard',
  components: {
    UserCard,
    ManageCard,
  },
  data() {
    return {
      activeName: '',
    };
  },
  created() {
    /** 1. 默认选中超标报警
     *  2. 在内容渲染完毕后调取子组件方法
     *     该方法用于完成在 子组件渲染时 需要进行的操作: 请求接口...
     */
    this.activeName = 'userCard';
    this.$nextTick(() => {
      this.$refs.userCard.onTabClick();
    });
  },
  methods: {
    onTabClick(tab) {          // 标签页切换时触发
      this.$nextTick(() => {
        this.$refs[tab.name].onTabClick();
      });
    },
  },
};
</script>
