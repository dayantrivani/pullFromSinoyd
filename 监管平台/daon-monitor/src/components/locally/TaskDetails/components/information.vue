<template>
  <!-- 基本信息 -->
  <table class="basicInform-class" border="1">
    <tbody>
      <tr>
        <th>任务名称</th>
        <td>
          <span>{{taskData.name}}</span>
          <span>(#{{taskData.sn}})</span>
        </td>
        <th>任务状态</th>
        <td><a-tag :color="taskStateTransition(taskData.status)">{{taskData.status_text}}</a-tag></td>
      </tr>
      <tr>
        <th>任务站点</th>
        <td>
          <span v-if="taskData.station">{{taskData.station.name}}</span>
        </td>
        <th>客户企业</th>
        <td>
          <span v-if="taskData.partner">{{taskData.partner.name}}</span>
        </td>
      </tr>
      <tr>
        <th>运维小组</th>
        <td>
          <span v-if="taskData.team">{{taskData.team.name}}</span>
        </td>
        <th>预定时间</th>
        <td><span>{{taskData.planned_date}}</span></td>
      </tr>
      <tr>
        <th>开始时间</th>
        <td>
          <span>{{taskData.worked_at}}</span>
        </td>
        <!-- eslint-disable-next-line -->
        <th>{{taskData.finished_state < 4 ? '完成' : '关闭'}}时间</th>
        <td>{{taskData.finished_at}}</td>
      </tr>
      <tr>
        <th>任务说明</th>
        <td colspan="3">{{taskData.comment}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'information',
  data() {
    return {
      taskData: {},
    };
  },
  methods: {
    // 任务状态转换
    taskStateTransition(val) {
      switch (val) {
        case 0:
          return 'pink';
        case 10:
          return 'blue';
        case 20:
          return 'green';
        case 21:
          return 'red';
        case 30:
          return 'cyan';
        case 31:
          return 'red';
        case 32:
          return 'orange';
        default:
          return 'green';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .basicInform-class{
    border: 1px solid #E9E9E9;
    margin-top: 10px;
    width: 100%;
    tr,th,td{
      height: 35px;
    }
    th{
      width: 100px!important;
      color: #2B425B;
      font-weight: bold;
      text-align: center;
    }
    td{
      padding: 10px;
      width: calc(100% - 100px);
    }
  }
</style>
