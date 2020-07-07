<template>
  <a-modal
    class="enter-dialog"
    width="940px"
    title="警报相关信息"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning">
      <a-card class="card-class" style="width: 25%;">
        <a-card-grid>警报信息</a-card-grid>
        <a-card-grid>警报状态</a-card-grid>
        <a-card-grid>发生站点</a-card-grid>
        <a-card-grid>报警企业</a-card-grid>
        <a-card-grid>警报类型</a-card-grid>
        <a-card-grid>相关仪器</a-card-grid>
        <a-card-grid>首次报警时间</a-card-grid>
        <a-card-grid>首次接收时间</a-card-grid>
        <a-card-grid>报警接收次数</a-card-grid>
        <a-card-grid v-if="model.comment">处理依据</a-card-grid>
        <a-card-grid v-if="model.corpName">运维企业</a-card-grid>
        <a-card-grid v-if="model.task">任务名称</a-card-grid>
        <a-card-grid v-if="model.task && model.task.worked_at">任务开始时间</a-card-grid>
        <a-card-grid v-if="model.task && model.task.finished_at">任务结束时间</a-card-grid>
      </a-card>
      <a-card class="card-class" style="width: 75%;">
        <a-card-grid style="width:100%;textAlign:'center'">{{model.message}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{swtichStatus(model.status)}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{model.stationName}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{model.partnerName}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{model.type}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{model.instrumentName}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{model.alarmedAt}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'">{{model.createdAt}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center';position: relative">
          <span>{{model.times}}次</span>
          <a-popover placement="rightTop">
            <template slot="content">
              <table class="basicInform-class" border="1">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>因子</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in model.alarmDetails" :key="item.id">
                    <td>{{item.alarmAt}}</td>
                    <td>{{item.factorName}}</td>
                    <td>{{item.message}}</td>
                  </tr>
                </tbody>
              </table>
            </template>
            <svg class="icon svg-class" aria-hidden="true">
              <use xlink:href="#icon-gantanhao"></use>
            </svg>
          </a-popover>
        </a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'" v-if="model.comment">
          {{model.comment}}
          <img class="comment-class" src="@/assets/img/renyuan.png"/>
        </a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'" v-if="model.corpName">{{model.corpName}}</a-card-grid>
        <a-card-grid style="width:100%;textAlign:'center'" v-if="model.task">
          <a class="click-class" @click="onDetilClick(model.task)">{{model.task ? model.task.name : ''}}</a>
        </a-card-grid>
        <a-card-grid
          style="width:100%;textAlign:'center'"
          v-if="model.task && model.task.worked_at">
          {{model.task ? model.task.worked_at : ''}}
        </a-card-grid>
        <a-card-grid
          style="width:100%;textAlign:'center'"
          v-if="model.task && model.task.finished_at">
          {{model.task ? model.task.finished_at : ''}}
        </a-card-grid>
      </a-card>
    </a-spin>
    <task-details ref="TaskDetails"/>
  </a-modal>
</template>

<script>
import TaskDetails from '@/components/locally/TaskDetails';
import { getOne } from '@/api/modules/fault-alarm-query.js';

export default {
  name: 'detailDailog',
  components: {
    TaskDetails,
  },
  data() {
    return {
      isVisible: false,           // 弹框显示隐藏
      model: {
        task: {},
        alarmDetails: [],
      },
      spinning: false,
    };
  },
  methods: {
    // 详情跳转事件
    onDetilClick(row) {
      this.$refs.TaskDetails.openDialog(row);
    },
    // 转换状态
    swtichStatus(val) {
      switch (val) {
        case 0:
          return '待处理';
        case 1:
          return '处理中';
        case 2:
          return '已处理';
        case -1:
          return '不处理';
        default:
          return '';
      }
    },
    openDialog(row) {
      if (row) {
        this.spinning = true;
        getOne(row.id).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            this.model = res.data.data;
            this.spinning = false;
          }
        });
      }
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      // this.itemModel = emptyForm();
    },
  },
};
</script>

<style lang="scss" scoped>
  .comment-class{
    width: 20px;
    height: 20px;
  }
  .card-class{
    display: inline-block;
    >.ant-card-body{
      .ant-card-grid{
        padding: 12px!important;
        width:100%;
        height: 45px;
      }
    }
  }
  .click-class{
    text-decoration: underline;
  }
  .svg-class{
    height: 38px;
    width: 25px;
    position: absolute;
    bottom: 5px;
    cursor: pointer;
  }
  .basicInform-class{
    border: 1px solid #E9E9E9;
    margin-top: 10px;
    width: 100%;
    tr,th,td{
      height: 35px;
    }
    th{
      width: 160px;
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
