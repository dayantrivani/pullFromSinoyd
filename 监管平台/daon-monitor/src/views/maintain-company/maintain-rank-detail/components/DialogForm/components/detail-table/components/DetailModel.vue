<template>
  <a-modal
    class="DetailTable"
    width="1050px"
    :title="title"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
    <a-table
      v-if="type === 2"
      class="mar-t-table"
      rowKey="id"
      size="middle"
      :loading='loading'
      :columns='policeColumns'
      :pagination="false"
      :dataSource='itemList'
    >
      <template slot="name" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
      <template slot="brief" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
      <template slot="portName" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
    </a-table>
    <a-table
      v-if="type === 1"
      class="mar-t-table"
      rowKey="id"
      size="middle"
      :loading='loading'
      :columns='taskColumns'
      :pagination="false"
      :dataSource='itemList'
    >
      <template slot="name" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
      <template slot="brief" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
      <template slot="portName" slot-scope="text">
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
import { getStationDetail } from '@/api/modules/maintain-company/maintain-rank-detail.js';

export default {
  name: 'DetailTable',
  data() {
    return {
      title: '',
      isVisible: false,
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      policeColumns: [
        {
          title: '报警编号',
          dataIndex: 'taskId',
          key: 'taskId',
        },
        {
          title: '消息',
          dataIndex: 'brief',
          key: 'brief',
          scopedSlots: { customRender: 'brief' },
        },
        {
          title: '报警时间',
          dataIndex: 'workedAt',
          key: 'workedAt',
          scopedSlots: { customRender: 'workedAt' },
        },
        {
          title: '完成时间',
          dataIndex: 'finishedAt',
          key: 'finishedAt',
          scopedSlots: { customRender: 'finishedAt' },
        },
        {
          title: '站点名称',
          dataIndex: 'portName',
          key: 'portName',
          scopedSlots: { customRender: 'portName' },
        },
        {
          title: '站点mn号',
          dataIndex: 'portMn',
          key: 'portMn',
          scopedSlots: { customRender: 'portMn' },
        },
      ],
      taskColumns: [
        {
          title: '任务编号',
          dataIndex: 'taskId',
          key: 'taskId',
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '要求完成时间',
          dataIndex: 'requireAt',
          key: 'requireAt',
          scopedSlots: { customRender: 'requireAt' },
        },
        {
          title: '实际完成时间',
          dataIndex: 'finishedAt',
          key: 'finishedAt',
          scopedSlots: { customRender: 'finishedAt' },
        },
        {
          title: '站点mn号',
          dataIndex: 'portMn',
          key: 'portMn',
          scopedSlots: { customRender: 'portMn' },
        },
      ],
      itemList: [],
      type: 1,  // 1任务 2报警
    };
  },
  methods: {
    openDialog(params) {
      this.isVisible = true;
      this.loading.spinning = true;
      getStationDetail(params.autoPointId[0]).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.loading.spinning = false;
          // console.log(res.data.data);
          this.itemList = res.data.data;
          this.type = this.itemList[0].type;
        }
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
