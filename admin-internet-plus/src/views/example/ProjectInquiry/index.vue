<!-- 应用 / 项目进度 -->

<template>
  <container :fill="showList">
    <!-- 项目列表 -->
    <list-project v-show="showList" ref="list" @detail="onDetail" />
    <!-- 项目详情表单 -->
    <form-project v-show="!showList" ref="form" @back="onBack" />
  </container>
</template>

<script>
import ListProject from './components/ListProject';
import FormProject from './components/FormProject';

export default {
  name: 'ProjectInquiry',
  components: {
    ListProject,
    FormProject,
  },
  data() {
    return {
      showList: true,
    };
  },
  methods: {
    onBack() {
      this.onToggle(true);
    },
    onDetail(row) {
      this.$refs.form.init(row);
      this.onToggle(false);
    },
    onToggle(show = !this.showList) {
      this.showList = show;
    },
  },
};
</script>
