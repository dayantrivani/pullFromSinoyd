<template>
  <header>
    <!-- left: Logo -->
    <brand />
    <!-- center: 标签栏 -->
    <tags-view />
    <!-- right: 用户信息 -->
    <user-info />
  </header>
</template>

<script>
import Brand from './components/Brand';
import TagsView from './components/TagsView';
import UserInfo from './components/UserInfo';

export default {
  components: {
    Brand,
    TagsView,
    UserInfo,
  },
};
</script>
