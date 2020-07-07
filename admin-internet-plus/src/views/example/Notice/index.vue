<!-- 应用 / 公告管理 -->

<template>
  <container :fill="!showList">
    <list-notice v-if="showList" @detail="onDetail" />
    <form-notice v-else :row="row" :edit="isEdit" @back="onBack()" />
  </container>
</template>

<script>
import ListNotice from './components/ListNotice';
import FormNotice from './components/FormNotice';

export default {
  name: 'Notice',
  components: {
    ListNotice,
    FormNotice,
  },
  data() {
    return {
      row: {},
      isEdit: false,
      showList: true,
    };
  },
  methods: {
    onBack() {
      this.onToggle(true);
    },
    onDetail({ row, isEdit }) {
      this.row = row;
      this.isEdit = isEdit;
      this.onToggle(false);
    },
    onToggle(show = !this.showList) {
      this.showList = show;
    },
  },
};
</script>
