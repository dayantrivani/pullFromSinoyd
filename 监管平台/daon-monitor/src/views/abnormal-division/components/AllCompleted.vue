<template>
  <a-modal
    class="AllCompleted"
    width="1200px"
    title="已完成任务"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
  <a-table
    class="mar-t-table AllCompleted_table"
    rowKey="id"
    size="middle"
    :loading='loading'
    :columns='columns'
    :dataSource='itemList'
    :pagination="false"
  >
  <template slot="stationName" slot-scope="text">
    <a-tooltip placement="top">
      <template slot="title">
        <span>{{ text }}</span>
      </template>
      <span>{{ text }}</span>
    </a-tooltip>
  </template>
  <template slot="message" slot-scope="text">
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
import { getList } from '@/api/modules/abnormal-division.js';

export default {
  name: 'AllCompleted',
  data() {
    return {
      isVisible: false,
      itemList: [],
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '站点名称',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 240,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          width: 120,
        },
        {
          title: '日期',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          width: 180,
        },
        {
          title: '监理人名称',
          dataIndex: 'supervisorName',
          key: 'supervisorName',
          width: 180,
        },
        {
          title: '内容',
          dataIndex: 'message',
          key: 'message',
          scopedSlots: { customRender: 'message' },
        },
      ],
    };
  },
  methods: {
    openDialog(queryForm) {
      this.isVisible = true;
      const params = { ...queryForm };
      params.rows = 2147483647;
      params.status = 2;
      getList(params).then((res) => {
        this.itemList = Object.values(res.data.data)[2].alarms;
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss">
// .AllCompleted_table{
//   .ant-table-content{
//     overflow-y: auto;
//   }
// }
</style>
