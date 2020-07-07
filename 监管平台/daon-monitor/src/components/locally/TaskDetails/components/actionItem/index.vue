<template>
  <!-- 任务项 -->
  <div class="actionItem-class" v-if="taskData.items && taskData.items.length > 0">
    <a-tabs type="card" v-model="activeKey">
      <a-tab-pane
        v-for="item in taskData.items"
        :tab="item.name"
        :key="item.id">
        <div class="actionItem">
          <table class="basicInform-class" border="1">
            <tbody>
              <tr>
                <th>任务项名称</th>
                <td>
                  <span>{{item.name}}</span>
                </td>
                <th>任务项类型</th>
                <td>
                  <span>{{item.type_name}}</span>
                </td>
              </tr>
              <tr>
                <th>来源</th>
                <td>
                  <a-tag :color="toConvert(item.type)[1]">{{toConvert(item.type)[0]}}</a-tag>
                </td>
                <th>运维仪器</th>
                <td>
                </td>
              </tr>
              <tr>
                <th>要求工作时间</th>
                <td>
                  {{item.begin_at}} ~ {{item.end_at}}
                </td>
                <th>实际填写时间</th>
                <td>
                  {{item.worked_at}}<span v-if="item.finished_at"> ~ {{item.finished_at}}</span>
                </td>
              </tr>
              <tr>
                <th>任务项说明</th>
                <td colspan="3">
                  {{item.brief ? item.brief : '-'}}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center mar-btm-10" style="margin-top: 20px;">
            &laquo;{{item.bucket.form ? item.bucket.form.name : ''}}&raquo;
          </div>
          <show-task-bucket-table v-if="item.bucket" :form="item.bucket.form.fields" :bucket="item.bucket.data" />
          <div v-else class="text-center text-dark-light" style="height: 50px; line-height: 50px">尚未填写任务项表单</div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ShowTaskBucketTable from './components/show-task--bucket-table';

export default {
  name: 'actionItem',
  components: {
    ShowTaskBucketTable,
  },
  data() {
    return {
      taskData: {},
      activeKey: '',
    };
  },
  methods: {
    // 来源转换
    toConvert(val) {
      switch (val) {
        case 'normal':
          return ['普通任务', '#1fbfdb'];
        case 'linked':
          return ['维修任务', '#ffbf00'];
        case 'urgent':
          return ['突发任务', '#E46651'];
        default:
          return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .basicInform-class{
    border: 1px solid #E9E9E9;
    width: 100%;
    tr, th, td{
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
    }
  }
  .actionItem-class{
    .el-tabs{
      .el-tabs__header{
        .el-tabs__nav-wrap{
          .el-tabs__nav-prev, .el-tabs__nav-next{
            color: gray!important;
            background-color: #F5F7FA!important;
            z-index: 1000!important;
          }
        }
      }
      .el-tabs__content{
        padding: 10px;
      }
    }
  }
</style>
