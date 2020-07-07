<template>
  <a-modal
    style="top: 20px;"
    class="TaskDetails"
    width="1250px"
    title="任务详细信息"
    :visible="isVisible"
    :maskClosable="false"
    :footer="false"
    :centered="true"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning">
      <a-tabs v-model="activeKey" @change="callback" class="TaskDetails-tabs">
        <a-tab-pane tab="基本信息" key="1">
          <information ref="information"/>
        </a-tab-pane>
        <a-tab-pane tab="任务项" key="2">
          <actionItem ref="actionItem"/>
        </a-tab-pane>
        <a-tab-pane tab="任务报告" key="3">
          <debriefing ref="debriefing"/>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import information from './components/information';
import actionItem from './components/actionItem';
import debriefing from './components/debriefing';
import { getTaskImformation } from '@/api/modules/operat-records.js';

export default {
  name: 'TaskDetails',
  components: {
    information,
    actionItem,
    debriefing,
  },
  data() {
    return {
      isVisible: false,
      taskData: {
        // item: [],
      },
      activeKey: '1',
      spinning: false,
    };
  },
  methods: {
    // 标签切换事件
    callback(key) {
      if (key === '2') {
        this.$nextTick(() => {
          this.$refs.actionItem.taskData = this.taskData;
          this.$refs.actionItem.activeKey = this.taskData.items[0].id;
        });
      } else if (key === '3') {
        this.$nextTick(() => {
          this.$refs.debriefing.taskData = this.taskData;
          // this.$refs.debriefing.getAttachmentList();
        });
      }
    },
    openDialog(row) {
      this.spinning = true;
      this.isVisible = true;
      getTaskImformation(row.id).then((res) => {
        // console.log(res);
        this.$refs.information.taskData = res.data.data;
        this.taskData = res.data.data;
        this.spinning = false;
      });
    },
    closeDialog() {
      this.isVisible = false;
      this.activeKey = '1';
    },
  },
};
</script>

<style lang="scss">
  .TaskDetails{
    >.ant-modal-content{
      >.ant-modal-body{
        min-height: 80vh;
      }
    }
  }
</style>
