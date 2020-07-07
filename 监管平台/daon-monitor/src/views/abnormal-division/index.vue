<template>
  <!-- 异常督办 -->
  <container class="AbnormalDivision">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>
    <search-extend>
      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-select :value="currency" style="width: 120px" @change="handleChange">
              <a-select-option value="list">列表展示</a-select-option>
              <a-select-option value="table">表格展示</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input
              v-model="queryForm.keyword"
              placeholder="请输入关键字"
              :allowClear="true"
              @keyup.enter="onQueryList()"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-date-picker
              v-model="queryForm.beginDate"
              style="width: 150px"
              placeholder="请选择开始日期"
              :disabledDate="disabledFromDate"
              format="YYYY-MM-DD"
            ></a-date-picker>~
            <a-date-picker
              style="width: 150px"
              placeholder="请选择开始日期"
              v-model="queryForm.endDate"
              :disabledDate="disabledEndDate"
              format="YYYY-MM-DD"
            ></a-date-picker>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="plain" @click="onQueryList" title="查询">
              <a-icon type="search"></a-icon>
            </a-button>
          </a-form-item>
        </a-form>
      </template>
    </search-extend>
    <a-card :bordered="false" style="height:calc(100% - 52px)">
      <a-spin v-show="currency=='list'" :spinning="spinning">
        <a-row :gutter="10" class="main_row">
          <a-col :span="8" @mouseenter="enter(0)" @mouseleave="leave(0)">
            <a-card
              title="待处理"
              style="height: 100%"
              :headStyle="{backgroundColor: '#329cff',
    color: 'white'}"
              :bordered="false"
            >
              <!-- <img slot="extra" title="添加" class="img_point" src="@/assets/img/add.png" @click="addItem"/> -->
              <a-tooltip>
                <template slot="title">
                  待处理
                  <span class="noAtten">{{processed.attentionType.total}}</span>条
                  <br />重点
                  <span class="attClass">{{processed.attentionType.attention}}</span>条
                </template>
                <div class="other_class">
                  <div class="import_class" :style="{'width': percentage(processed.attentionType)}"></div>
                </div>
              </a-tooltip>
              <div class="main">
                <draggable
                  v-model="processed.alarms"
                  v-bind="{ group: { name: 'proGroupName', put: false },
                    disabled: false, sort: false, fallbackClass: true }"
                  @start="proBefore"
                  @end="proTogoing"
                  class="processed_class"
                >
                  <transition-group type="transition" tag="div" name>
                    <div
                      @click="detailClick(item, 0)"
                      class="alarm_card"
                      v-for="item in processed.alarms"
                      :key="item.id"
                    >
                      <p class="alarm_name">{{item.stationName}}</p>
                      <div class="alarm_left">
                        <p>{{item.alarmedAt}}</p>
                        <p>
                          <img style="width: 15px;margin-bottom: 2px" src="@/assets/img/time2.png" />
                          <span style="margin-left: 4px">{{switchTime(item.warning)}}</span>
                        </p>
                        <img
                          class="rate"
                          :src="item.attention ? atten : noAtten"
                          @click.stop="changeValue(item)"
                        />
                        <span class="tasksn">{{item.taskSn}}</span>
                      </div>
                      <div class="alarm_right">
                        <div class="tag_bg" v-if="item.typeDesc">
                          <img src="@/assets/img/ico.png" />
                          <span>{{item.typeDesc}}</span>
                        </div>
                        <!-- <img title="删除" class="delete" src="@/assets/img/delete.png" @click.stop="onDelete(item)" /> -->
                        <div class="message">{{item.message}}</div>
                        <span class="indent">
                          <img style="margin: 0 5px 5px 0;" src="@/assets/img/super.png" />
                          <span>{{item.supervisorName}}</span>
                        </span>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8" @mouseenter="enter(1)" @mouseleave="leave(1)">
            <a-card
              title="进行中"
              style="height: 100%"
              :headStyle="{backgroundColor: '#c7cad2',
    color: 'white'}"
              :bordered="false"
            >
              <a-tooltip>
                <template slot="title">
                  待处理
                  <span class="noAtten">{{ongoing.attentionType.total}}</span>条
                  <br />重点
                  <span class="attClass">{{ongoing.attentionType.attention}}</span>条
                </template>
                <div class="other_class">
                  <div class="import_class" :style="{'width': percentage(ongoing.attentionType)}"></div>
                </div>
              </a-tooltip>
              <div class="main">
                <draggable
                  v-model="ongoing.alarms"
                  v-bind="{ group: { name: 'GoingGroupName', put: ['proGroupName'] },
                    disabled: false, sort: false, fallbackClass: true }"
                  @end="goingTocomplete"
                  class="processed_class"
                >
                  <transition-group class="ongoing_div" type="transition" tag="div" name>
                    <div
                      class="alarm_card"
                      @click="detailClick(item, 1)"
                      v-for="item in ongoing.alarms"
                      :key="item.id"
                    >
                      <p class="alarm_name">{{item.stationName}}</p>
                      <div class="alarm_left">
                        <p>{{item.alarmedAt}}</p>
                        <p>
                          <img style="width: 15px;margin-bottom: 2px" src="@/assets/img/time2.png" />
                          <span style="margin-left: 4px">{{switchTime(item.warning)}}</span>
                        </p>
                        <img
                          class="rate"
                          :src="item.attention ? atten : noAtten"
                          @click.stop="changeValue(item)"
                        />
                        <span class="tasksn">{{item.taskSn}}</span>
                      </div>
                      <div class="alarm_right">
                        <div class="tag_bg" v-if="item.typeDesc">
                          <img src="@/assets/img/ico.png" />
                          <span>{{item.typeDesc}}</span>
                        </div>
                        <div class="message">{{item.message}}</div>
                        <span class="indent">
                          <img style="margin: 0 5px 5px 0;" src="@/assets/img/super.png" />
                          <span>{{item.supervisorName}}</span>
                        </span>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
            </a-card>
          </a-col>
          <a-col :span="8" @mouseenter="enter(2)" @mouseleave="leave(2)">
            <a-card
              title="已完成"
              style="height: 100%"
              :headStyle="{backgroundColor: '#5bdb1d',
    color: 'white'}"
              :bordered="false"
            >
              <img
                slot="extra"
                title="查看更多"
                class="img_point"
                src="@/assets/img/more1.png"
                @click="onMore"
              />
              <a-tooltip>
                <template slot="title">
                  待处理
                  <span class="noAtten">{{completed.attentionType.total}}</span>条
                  <br />重点
                  <span class="attClass">{{completed.attentionType.attention}}</span>条
                </template>
                <div class="other_class">
                  <div class="import_class" :style="{'width': percentage(completed.attentionType)}"></div>
                </div>
              </a-tooltip>
              <div class="main">
                <draggable
                  v-model="completed.alarms"
                  v-bind="{ group: { name: 'compleGroupName', put: ['GoingGroupName'] }, disabled: false, sort: false}"
                  class="processed_class"
                >
                  <transition-group class="processed_div" type="transition" tag="div" name>
                    <div
                      @click="detailClick(item, 2)"
                      class="alarm_card"
                      v-for="item in completed.alarms"
                      :key="item.id"
                    >
                      <p class="alarm_name">{{item.stationName}}</p>
                      <div class="alarm_left">
                        <p>{{item.alarmedAt}}</p>
                        <p>
                          <img style="width: 15px;margin-bottom: 2px" src="@/assets/img/time2.png" />
                          <span style="margin-left: 4px">{{switchTime(item.warning)}}</span>
                        </p>
                        <img
                          class="rate"
                          :src="item.attention ? atten : noAtten"
                          @click.stop="changeValue(item)"
                        />
                        <span class="tasksn">{{item.taskSn}}</span>
                      </div>
                      <div class="alarm_right">
                        <div class="tag_bg" v-if="item.typeDesc">
                          <img src="@/assets/img/ico.png" />
                          <span>{{item.typeDesc}}</span>
                        </div>
                        <div class="message">{{item.message}}</div>
                        <span class="indent">
                          <img style="margin: 0 5px 5px 0;" src="@/assets/img/super.png" />
                          <span>{{item.supervisorName}}</span>
                        </span>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <!-- 列表 -->
      <a-table
        v-show="currency=='table'"
        class="mar-t-table"
        rowKey="id"
        size="middle"
        :loading="loading"
        :columns="columns"
        :dataSource="itemList"
        :pagination="pagination"
        @change="_change"
        :customRow="rowClick"
      >
        <template slot="stationName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="name" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="comment" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="disposeStatus" slot-scope="text">
          <status :type="text==0?'primary':text==1? 'info' : 'success'">
            <template>{{text==0?'待处理':text==1? '进行中' : '已完成'}}</template>
          </status>
        </template>
      </a-table>
      <supe-task-dailog ref="supeTask" @onQueryList="onQueryList" />
      <detail-dialog ref="detail" />
      <all-completed ref="comple" />
    </a-card>
  </container>
</template>

<script>
import moment from 'moment';
import draggable from 'vuedraggable';
import {
  emptyQuery, getList, getTable, check, deleteMask,
} from '@/api/modules/abnormal-division.js';
import SupeTaskDailog from './components/SupeTaskDailog';
import AllCompleted from './components/AllCompleted';
import DetailDialog from './components/DetailDialog';
import noAtten from '../../assets/img/no.png';
import atten from '../../assets/img/atten.png';

export default {
  name: 'AbnormalDivision',
  provide() {
    return { atten: this };
  },
  components: {
    draggable,
    SupeTaskDailog,
    DetailDialog,
    AllCompleted,
  },
  data() {
    return {
      noAtten,
      atten,
      proGroupName: 'proTogoingName',
      GoingGroupName: 'proTogoingName',
      compleGroupName: 'goingTocompleName',
      disabled: false,
      queryForm: emptyQuery(),
      scrollTop: 0,
      currentType: '', // 当前滚动类型
      processed: {  // 待处理
        attentionType: {},
        alarms: [],
      },
      allProAlarms: [], // 记录拖拽前待处理数据
      ongoing: {  // 进行中
        attentionType: {},
        alarms: [],
      },
      allOngoAlarms: [], // 记录拖拽前进行中数据
      completed: {  // 已完成
        attentionType: {},
        alarms: [],
      },
      arr1: [],   // 储存未处理已经请求过的滚动条位置
      arr2: [],   // 储存进行中已经请求过的滚动条位置
      arr3: [],   // 储存已完成已经请求过的滚动条位置
      spinning: false,
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      currency: 'list',
      // 列表表头数组
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '任务站点',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 100,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '任务说明',
          dataIndex: 'comment',
          key: 'comment',
          width: 100,
          scopedSlots: { customRender: 'comment' },
        },
        {
          title: '报警类型',
          dataIndex: 'type',
          key: 'type',
          width: 100,
        },
        {
          title: '报警时间',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          width: 100,
        }, {
          title: '剩余时间',
          dataIndex: 'warning',  // 许做switchTime时间超时转换
          key: 'warning',
          width: 100,
        }, {
          title: '任务状态',
          dataIndex: 'disposeStatus',
          key: 'disposeStatus',
          width: 100,
          scopedSlots: { customRender: 'disposeStatus' },
        },
      ],
      // 表格数据数组
      itemList: [],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      rowClick: record => ({
        on: {
          click: () => {
            this.detailClick(record, record.disposeStatus);
          },
        },
      }),
    };
  },
  created() {
    this.onQueryList();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    // 开始日期限制
    disabledFromDate(current) {
      if (!current || !this.queryForm.endDate) {
        return current > moment().endOf('day');
      }
      const endValue = this.queryForm.endDate.format('YYYY-MM-DD 00:00:00');
      const currentDate = current.format('YYYY-MM-DD 00:00:00');
      return currentDate.valueOf() > endValue.valueOf() || moment(currentDate).valueOf() > moment().endOf('day').valueOf();
    },
    // 结束日期限制
    disabledEndDate(current) {
      if (!current || !this.queryForm.beginDate) {
        return current > moment().endOf('day');
      }
      const beginValue = this.queryForm.beginDate.format('YYYY-MM-DD 00:00:00');
      const currentDate = current.format('YYYY-MM-DD 00:00:00');
      return currentDate.valueOf() < beginValue.valueOf() || moment(currentDate).valueOf() > moment().endOf('day').valueOf();
    },
    // 转换是否超期的时间格式
    switchTime(time) {
      const absTime = Math.abs(time);
      let atr = '';
      if (time) {
        atr = `${time >= 0 ? '余' : '超'}
          ${absTime >= 24 ? `${Math.floor(absTime / 24)}天` : ''}
          ${absTime % 24} 小时`;
      } else {
        atr = '';
      }
      return atr;
    },
    // 查看所有已完成的任务
    onMore() {
      this.$refs.comple.openDialog(this.queryForm);
    },
    // 鼠标移入事件
    enter(num) {
      this.currentType = num;
      window.addEventListener('scroll', this.handleScroll, true);
    },
    // 鼠标移出事件
    leave() {
      window.removeEventListener('scroll', this.handleScroll, true);
    },
    // 滚轮事件
    handleScroll() {
      const { scrollTop } = document.getElementsByClassName('main')[this.currentType];
      this.scrollTop = scrollTop;
      const params = { ...this.queryForm };
      const scrollFun = (arrName, dataName) => {
        if ((this.scrollTop - 1114) % 1630 === 0 && !this[arrName].includes(this.scrollTop)) {
          this[arrName].push(this.scrollTop);
          params.index = this[dataName].alarms[this[dataName].alarms.length - 1].id;
          params.status = this.currentType;
          params.rows = 10;
          getList(params).then((res) => {
            this[dataName].alarms = [...this[dataName].alarms, ...Object.values(res.data.data)[0]];
          });
        }
      };
      // 当为 未处理 时
      if (!this.currentType) {
        scrollFun('arr1', 'processed');
      } else if (this.currentType === 1) {
        // 当为 进行中 时
        scrollFun('arr2', 'ongoing');
      } else {
        // 当为 已完成 时
        scrollFun('arr3', 'completed');
      }
    },
    // 查询
    onQueryList() {
      this.spinning = true;
      if (this.currency === 'list') {
        getList(this.queryForm).then((res) => {
          if (res.data.code === 200 && res.data.success) {
            // eslint-disable-next-line prefer-destructuring
            this.processed = Object.values(res.data.data)[0];
            // this.allProAlarms = JSON.parse(JSON.stringify(this.processed.alarms));
            // eslint-disable-next-line prefer-destructuring
            this.ongoing = Object.values(res.data.data)[1];
            this.allOngoAlarms = JSON.parse(JSON.stringify(this.ongoing.alarms));
            // eslint-disable-next-line prefer-destructuring
            this.completed = Object.values(res.data.data)[2];
            this.arr1 = [];
            this.arr2 = [];
            this.arr3 = [];
          } else {
            this.$message.warning(res.data.msg);
          }
          this.spinning = false;
        });
      } else {
        this.onQueryTable();
      }
    },
    // 查询表格
    onQueryTable() {
      this.loading.spinning = true;
      getTable(this.queryForm).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.itemList = res.data.data;
          this.itemList.forEach((el) => {
            if (!el.hasOwnProperty('warning')) {
              el.warning = '-';
            } else {
              el.warning = this.switchTime(el.warning);
            }
          });
        } else {
          this.$message.warning(res.data.msg);
        }
        this.loading.spinning = false;
      });
    },
    // 切换关注
    changeValue(val) {
      val.attention = !val.attention;
      check(val.id, { attention: val.attention }).then((res) => {
        this.$message.success(res.data.msg);
      });
    },
    // 计算百分比公共方法
    percentage(obj) {
      return `${obj.attention / obj.total * 100}%`;
    },
    // 添加督办任务
    addItem() {
      this.$refs.supeTask.openDialog();
    },
    proBefore() {
      this.allProAlarms = JSON.parse(JSON.stringify(this.processed.alarms));
    },
    // 未处理-进行中 拖拽结束
    proTogoing(el) {
      const { id } = this.allProAlarms[el.oldIndex];
      if (el.to.className === 'ongoing_div') {
        check(id, { disposeStatus: 1 }).then((res) => {
          this.$message.success(res.data.msg);
        });
      }
    },
    // 进行中-已完成 拖拽结束
    goingTocomplete(el) {
      const { id } = this.allOngoAlarms[el.oldIndex];
      if (el.to.className === 'processed_div') {
        check(id, { disposeStatus: 2 }).then((res) => {
          this.$message.success(res.data.msg);
          this.allOngoAlarms = JSON.parse(JSON.stringify(this.ongoing.alarms));
        });
      }
    },
    // 详情点击事件
    detailClick(item, num) {
      this.$refs.detail.openDialog(item, num);
    },
    onDelete(item) {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前督办任务吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          deleteMask(item.id).then((response) => {
            if (response.data.code === 200 && response.data.success) {
              this.$message.success(response.data.msg, 3);
              this.onQueryList();
            } else {
              this.$message.warning(response.data.msg, 3);
            }
          });
        },
      });
    },
    handleChange(val) {
      this.queryForm.page = 1;
      this.queryForm.rows = 10;
      this.currency = val;
      this.onQueryList();
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.onQueryTable();
    },
  },
};
</script>

<style lang="scss">
.progress_class {
  span {
    display: none;
  }
  .ant-progress-outer {
    padding: 0;
    .ant-progress-inner {
      background: #bfbfbf;
    }
  }
}
</style>

<style lang="scss" scoped>
.main_row {
  // height:calc(100% - 40px);
  background-color: #ececec;
  // padding: 10px 3px;
  > div {
    height: 100%;
  }
}
.main {
  // height: 495px;
  height: 540px;
  overflow-y: auto;
  padding: 10px;
  padding-bottom: 35px;
  &::-webkit-scrollbar {
    width: 5px;
    height: 20px;
  }
  &::-webkit-scrollbar-track {
    background-color: #dedede;
    -webkit-border-radius: 1em;
    -moz-border-radius: 1em;
    border-radius: 1em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    -webkit-border-radius: 1em;
    -moz-border-radius: 1em;
    border-radius: 1em;
  }
}
.alarm_card:nth-of-type(1) {
  margin-top: 0;
}
.alarm_name {
  font-weight: 600;
  width: 70%;
  font-size: 18px;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.alarm_card {
  &:hover {
    box-shadow: -3px 3px 3px #888888;
  }
  background: #f4f7f9;
  cursor: pointer;
  padding: 15px;
  height: 158px;
  margin-top: 5px;
  // background: #F2F2F2;
  border: 1px solid #ebedf0;
  > .alarm_left {
    position: relative;
    float: left;
    width: 40%;
    height: calc(100% - 27px);
    display: inline-block;
    .rate {
      width: 20px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .tasksn {
      position: absolute;
      left: 25px;
      bottom: -5px;
    }
    > p {
      // &:nth-of-type(1) {
      //   font-weight: 600;
      //   margin-top: 0px;
      //   font-size: 18px;
      //   color: #000000;
      // }
      margin-top: 15px;
    }
  }
  > .alarm_right {
    width: 60%;
    height: calc(100% - 27px);
    display: inline-block;
    position: relative;
    > .delete {
      width: 20px;
      position: absolute;
      right: -5px;
      top: -35px;
      color: #51a8f8;
    }
    > .tag_bg {
      position: absolute;
      background-image: url("../../assets/img/tag_bg.png");
      background-size: 100% 100%;
      width: 120px;
      height: 45px;
      top: -50px;
      right: 0px;
      color: #fff;
      padding: 0 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > img {
        width: 12px;
        margin: 0 5px;
      }
      > span {
        flex: 1;
      }
    }
    > .message {
      height: 40px;
      width: 100%;
      position: absolute;
      font-size: 13px;
      top: 15px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    > .indent {
      position: absolute;
      bottom: 0;
      right: 5px;
      // >span{
      //   position: absolute;
      //   top: 5px;
      //   right: 0;
      // }
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  display: inline-block;
  margin-right: 20px;
  width: 50px;
  height: 50px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item.sortable-chosen {
  background: #4ab7bd;
}

.list-complete-item.sortable-ghost {
  background: #30b08f;
}
.undraggable {
  background-color: red;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
.other_class {
  height: 12px;
  margin-top: 10px;
  background: #b4b4b4;
  > .import_class {
    height: 100%;
    background: #ffcc33;
    width: 0;
  }
}
.img_point {
  cursor: pointer;
}
.processed_class {
  height: 100%;
  > div {
    height: 100%;
  }
}
.noAtten {
  color: #b4b4b4;
  margin: 0 5px;
}
.attClass {
  color: #ffcc33;
  margin: 0 5px;
}
</style>
