<template>
  <a-modal
    class="modal-alarm"
    title="报警信息"
    :visible="isVisible"
    width="720px"
    style="height: 500px; top: 12vh;"
    :maskClosable="false"
    @cancel="closeDialog"
    :footer="false"
  >
    <a-table
      rowKey="id"
      size="small"
      :loading='loading'
      :columns='columns'
      :dataSource='itemList'
      style="height: 417px"
      :scroll="itemList.length > 10 ? {y: 380} : {}"
      :pagination="false"
    >
      <template slot="companyName" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { getAlarm } from '@/api/modules/supervision-tasks.js';

export default {
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      isVisible: false,
      itemList: [],
      columns: [
        {
          title: '因子名称',
          dataIndex: 'factorName',
          key: 'factorName',
          width: 100,
          scopedSlots: { customRender: 'taskSlot' },
        },
        {
          title: '报警时间',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          width: 150,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '报警信息',
          dataIndex: 'message',
          key: 'message',
          width: 280,
          scopedSlots: { customRender: 'companyName' },
        },
      ],
    };
  },
  methods: {
    openDialog(id) {
      this.loading.spinning = true;
      getAlarm(id).then((response) => {
        this.itemList = response.data.data;
        this.loading.spinning = false;
      });
      this.isVisible = true;
    },
    closeDialog() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss">

</style>
