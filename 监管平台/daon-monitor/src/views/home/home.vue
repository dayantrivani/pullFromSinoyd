<template>
  <container layout="empty" style="padding: 15px;">
    <opera-type ref="opera"/>
    <operations ref="operations"/>
    <a-row class="bottom" style="height: 500px;" :gutter="15" v-if="type === 1 && this.homeParams.corpUscc">
      <a-col :span="8">
        <exce-tasks ref="exce"/>
      </a-col>
      <a-col :span="16">
        <task-type-list ref="task"/>
      </a-col>
    </a-row>
  </container>
</template>

<script>
import { mapState } from 'vuex';
import OperaType from './components/OperaType';
import operations from './components/operations';
import TaskTypeList from './components/TaskTypeList';
import ExceTasks from './components/ExceTasks';

export default {
  name: 'home',
  components: {
    OperaType,
    operations,
    TaskTypeList,
    ExceTasks,
  },
  computed: {
    ...mapState('home', ['homeParams', 'type']),
  },
  watch: {
    homeParams: {
      handler() {
        this.$nextTick(() => {
          // console.log(document.getElementsByClassName('mod-container'));
          // console.log(document.getElementsByClassName('mod-container')[0].scrollHeight)
          document.getElementsByClassName('mod-container')[0].scrollTop = document.getElementsByClassName('mod-container')[0].scrollHeight;
          // console.log(document.body.scrollTop);
        });
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
