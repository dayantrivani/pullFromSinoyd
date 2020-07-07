<template>
  <container class="Page-Notice">
    <!-- 页头 -->
    <template v-slot:header>
      <page-header breadcrumb />
    </template>
    <a-card :bordered="false" v-show="isShow">
      <search-extend>

        <!-- 操作按钮 -->
        <template v-slot:default>
          <div class="mar-t-xs">
            <a-button type="primary" icon="plus" @click="onAddClick"> 新 增</a-button>
          </div>
        </template>

        <!-- 检索表单 -->
        <template v-slot:right>
          <a-form layout="inline">
            <a-form-item label="关键字：">
              <a-input
                allowClear
                ref="input"
                v-model="queryForm.keyword"
                style="width: 240px" placeholder="公告标题、公告内容、发布人">
              </a-input>
            </a-form-item>
            <a-form-item label="日期：">
              <a-date-picker
                :allowClear="true"
                style="width: 120px"
                format="YYYY-MM-DD"
                @change="ChangeStartDate"
                :disabledDate="disabledStartDate"></a-date-picker> ~
              <a-date-picker
                :allowClear="true"
                style="width: 120px"
                format="YYYY-MM-DD"
                @change="ChangeEndDate"
                :disabledDate="disabledEndDate"></a-date-picker>
            </a-form-item>
            <a-form-item label="公告状态：">
              <select-enum v-model="queryForm.status" type="NOTICE_STATUS" min-width="100px" />
            </a-form-item>
            <a-form-item class="mar-r-0">
              <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
            </a-form-item>
          </a-form>
        </template>
      </search-extend>

      <!-- 公告列表 -->
      <div
        class="demo-infinite-container"
        v-infinite-scroll="handleInfiniteOnLoad"
        :infinite-scroll-disabled="busy"
        :infinite-scroll-distance="0"
      >
        <a-card v-for="(item, index) in data" :key="index"
          hoverable
          style="margin-top:10px;"
          name="notice-card"
          @mouseenter="mouseEnter(item)"
          @mouseleave="mouseLeave(item)"
        >
          <svg class="top" v-if="item.isTop">
            <use xlink:href="#icon-top"></use>
          </svg>
          <div class="notPublish" v-if="item.status!==1">
            <span>未发布</span>
          </div>
          <br/>
          <a-card-meta :title="item.title" :description="item.content" @click="getDetailData(item)">
            <a-avatar slot="avatar" :src="img" :title="item.publisherName" />
          </a-card-meta>
          <div class="supplement">
            <div class="user-info">发布人：{{item.publisherName}}</div>
            <div class="time">
              <a-icon type="clock-circle"></a-icon>
              {{getTimeTitle(item.publishedAt)}}</div>
            <div class="tags" v-if="item.tags">
              <a-tag v-for="(tag,index) in item.tags.split(',')" :key="index" color="blue">{{tag}}</a-tag>
            </div>
          </div>
          <ul class="ant-card-actions" :class="[item.isShowActions ? 'showAction' : 'hideAction']">
            <li @click="onEditClick(item)">
              <span style="color: #1890ff">
                <a-icon type="edit" title="编辑" theme="twoTone" twoToneColor="#1890ff" /> 编辑
              </span>
            </li>
            <li @click="onRemoveClick(item)">
              <span style="color: #f5222d">
                <a-icon type="delete" title="删除" theme="twoTone" twoToneColor="#f5222d" /> 删除
              </span>
            </li>
            <li @click="onTop(item)">
              <span>
                <a-icon :type="item.isTop ? 'arrow-down' : 'to-top'" :title="item.isTop ? '取消置顶' : '置顶'"></a-icon>
                {{item.isTop ? '取消置顶' : '置顶'}}
              </span>
            </li>
            <li v-if="item.status === 0" @click="onPublish(item)">
              <span style="color: #52c41a">
                <a-icon type="book" theme="twoTone" twoToneColor="#52c41a" title="发布"></a-icon> 发布
              </span>
            </li>
          </ul>
        </a-card>
      </div>
      <DialogForm ref="dialog" @refreshList="onQueryList"></DialogForm>
    </a-card>
    <a-card class="detail-class" :bordered="false" v-if="!isShow">
      <span class="detail-back"  @click = back>
        <a-icon type="backward"></a-icon>
        <span>返回</span>
      </span>
      <div class="detail-title">{{detailData.title}}</div>
      <div class="detail-supplement">
        <div class="detail-avatar">
          <img src="@/assets/img/user_avater_man_100x100.jpg">
          {{detailData.publisherName}}
        </div>
        <div class="detail-time">
          <a-icon type="clock-circle"></a-icon>
          {{getTimeTitle(detailData.publishedAt)}}
        </div>
        <div class="detail-tags" v-if="detailData.tags">
          <a-tag v-for="(tag,index) in detailData.tags.split(',')" :key="index" color="blue">{{tag}}</a-tag>
        </div>
      </div>
      <div class="detail-content" v-html="detailData.content"></div>
      <uploadTest
        :btn="fileOperation"
        ref="upload"
        :id="itemModel2.id"
        :doc-type-id="docTypeId[1]"
        :is-update="isUpdate[1]"
        :isRequest="isRequest[1]"
        :size-limilt="20">
      </uploadTest>
    </a-card>
  </container>
</template>

<script>
import moment from 'moment';
import infiniteScroll from 'vue-infinite-scroll';
import img from '@/assets/img/user_avater_man_100x100.jpg';
import {
  emptyQuery, getList, publish, top, remove, getOne,
} from '@/api/modules/notice.js';
import { message } from '@/libs/util';
import DialogForm from './components/DialogForm';
import uploadTest from '@/components/locally/upload-test';

export default {
  name: 'Notice',
  components: {
    DialogForm,
    uploadTest,
  },
  directives: { infiniteScroll },
  data() {
    return {
      img,
      itemModel2: { id: 1 },
      isUpdate: [false, false],  // 是否调用上传附件的接口
      isRequest: [false, false], // 是否调用获取附件列表的接口
      docTypeId: ['', ''],       // 上传文档类型
      fileOperation: 'down',     // 只允许下载操作
      queryForm: emptyQuery(),
      itemList: [],
      data: [],
      busy: true,
      deletedId: [],
      isShow: true,
      detailData: {},
    };
  },
  mounted() {
  },
  methods: {
    mouseEnter(item) {
      item.isShowActions = true;
    },
    mouseLeave(item) {
      item.isShowActions = false;
    },
    // 公告发布时间 转换方法
    getTimeTitle(time) { // 根据传入时间返回对应显示值 // 传入时间格式为字符串/时间/时间戳类型
      const date = new Date(time).getTime(); // 传入时间格式化为时间戳
      const now = new Date().getTime(); // 格式化当前时间为时间戳
      const start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(); // 将当天0点时间格式化为时间戳
      let val; // 定义返回值变量
      const t = 1 * 1000 * 60 * 60; // 定义一小时的时间戳
      if (date >= (now - t)) { // 当传入时间离当前时间小于1小时
        val = '刚刚';
      } else if (date >= start) { // 当传入时间与当前时间属于同一天
        val = `${new Date(time).getHours() > 12 ? '下午 ' : '上午'}${time.split(' ')[1]}`;
      } else {
        // eslint-disable-next-line
        val = time.split(' ')[0];
      }
      return val;
    },
    // 列表无限滚动
    handleInfiniteOnLoad() {
      if (!this.busy) {
        this.queryForm.page += 1;
        this.getItemList();
      }
    },
    // 去除所有html标签
    removeHtml(val) {
      const obj = {
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'amp': '&',
        'quot': '"',
      };
      val.forEach((el) => {
        el.content = el.content.replace(/<[^>]+>/g, '');
        el.content = el.content.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => obj[t]);
      });
    },
    // 时间选择器
    ChangeStartDate(val) {
      this.queryForm.fromDate = val;
    },
    ChangeEndDate(val) {
      this.queryForm.toDate = val;
    },
    disabledStartDate(current) {
      const endValue = this.queryForm.toDate;
      if (!current || !endValue) {
        return current > moment().endOf('day');
      }
      return current.valueOf() > endValue.valueOf() || current > moment().endOf('day');
    },
    disabledEndDate(current) {
      const startValue = this.queryForm.fromDate;
      if (!current || !startValue) {
        return current > moment().endOf('day');
      }
      return current.valueOf() <= startValue.valueOf() || current > moment().endOf('day');
    },
    // 查询事件
    onQueryList() {
      this.data = [];
      this.queryForm.page = 1;
      this.getItemList();
    },
    // 新增事件
    onAddClick() {
      this.$refs.dialog.openDialog();
    },
    // 编辑事件
    onEditClick(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 发布事件
    onPublish(item) {
      publish(item).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 3);
          this.onQueryList();
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
    // 置顶事件
    onTop(item) {
      top(item).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 3);
          this.onQueryList();
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
    // 删除事件
    onRemoveClick(item) {
      this.deletedId.push(item.id);
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的公告吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          remove(this.deletedId).then((response) => {
            if (response.data.code === 200 && response.data.success) {
              this.$message.success(response.data.msg, 3);
              this.onQueryList();
            } else {
              this.$message.warning(response.data.msg, 3);
            }
            this.deletedId = [];
          });
        },
      });
    },
    // 清空输入框
    onClearClick() {
      this.$refs.input.focus();
      this.queryForm.keyword = '';
    },
    // 获取列表数据
    getItemList() {
      this.loading = true;
      const temData = [...this.data];
      if (this.queryForm.page === 1) {
        document.documentElement.scrollTop = 0;
      }
      getList(this.queryForm).then((response) => {
        if (response.data.success && response.data.code === 200) {
          if (response.data.data && response.data.data.length !== 0) {
            this.itemList = response.data.data;
            this.itemList.forEach((el) => {
              this.$set(el, 'isShowActions', false);
            });
            this.removeHtml(this.itemList);
            this.data = temData.concat(this.itemList);
            this.busy = false;
            if (response.data.data.length < 10) {
              this.loading = false;
              this.busy = true;
            }
          }
        } else {
          message('warning', response);
        }
      });
      this.loading = false;
    },
    // 点击标题获取公告详细信息
    getDetailData(item) {
      getOne(item.id).then((response) => {
        this.isShow = false;
        this.detailData = response.data.data;
      }).then(() => {
        this.$refs.upload.attachIds = this.detailData.attachIds ? this.detailData.attachIds : [];
        this.$refs.upload.fileList = this.detailData.attaches;
      });
    },
    // 返回公告列表
    back() {
      this.isShow = true;
      this.detailData = {};
    },
  },
  created() {
    this.getItemList();
  },
};
</script>
<style lang="scss">
.Page-Notice{
  .demo-infinite-container{
    overflow: auto;
    height: 567px;
    .ant-card{
      position: relative;
      padding: 0 0 10px 0 !important;
      .ant-card-body{
        .top{
          position: absolute;
          left: 0;
          width: 40px;
          height: 40px;
        }
        .notPublish{
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 40px;
          background-color: rgba(240,40,40,0.6);
          color: #fff;
          border: 1px solid rgba(240,40,40,0.6);
          border-left: none;
          border-bottom: none;
          border-radius: 0 40px 0 0;
          span{
            font-size: 12px;
            display: inline-block;
            position: absolute;
            bottom: 7px;
            transform: rotate(45deg);
          }
        }
        .ant-card-meta{
          margin: 0;
          .ant-card-meta-detail{
            .ant-card-meta-title{
              display: inline-block;
            }
            .ant-card-meta-title:hover{
              color: #409eff;
            }
            .ant-card-meta-description{
              color: rgba(0, 0, 0, 0.6);
              width: 90%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        .ant-card-actions{
          z-index: 1000;
          position: absolute;
          right: 0;
          top: 5px;
          border-top: none;
          background-color: #fafafa;
          li{
            float: none;
            padding: 0 5px;
            margin: 3px 0 0 0;
            border-right: none;
            width: 100% !important;
            span{
              float: left;
            }
          }
          li:hover{
            background-color: #dadada;
          }
        }
      }
      .ant-card-actions.showAction{
        position: absolute;
        right: 5px;
        top: 5px;
        transition-property: right;
        transition-duration:1s;
      }
      .ant-card-actions.hideAction{
        position: absolute;
        right: -90px;
        top: 5px;
        transition-property: right;
        transition-duration:1s;
      }
      .supplement{
        margin: 15px 0 0 0;
        height: 23px;
        line-height: 23px;
        .user-info{
          float: left;
          color: #909399;
          font-size: 13px;
          margin-left: 50px;
        }
        .time{
          width: 120px;
          float: left;
          margin-left: 50px;
          color: #909399;
        }
        .tags{
          float: left;
          margin-left: 50px;
        }
      }
    }
  }
  .detail-content{
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #D7DBE0;
    min-height: 300px;
    img {
      max-width: 100%;
    }
  }
}

</style>
<style lang="scss" scoped>
.Page-Notice {
  .detail-class{
    width: 70%;
    min-height: 90%;
    margin: 0 auto;
    padding: 30px 60px 40px 60px;
    box-sizing: border-box;
    position: relative;
    .detail-title{
      height: 45px;
      font-weight: 600;
      text-align: center;
      line-height: 45px;
      font-size: 20px;
    }
    .detail-supplement{
      height: 23px;
      color: #909399;
      line-height: 23px;
      div{
        height: 100%;
        float: left;
      }
      .detail-avatar{
        img{
          width: 23px;
          height: 23px;
          border-radius: 50%;
          margin-right: 5px;
          float: left;
        }
      }
      .detail-time{
        line-height: 23px;
        margin-left: 50px;
      }
      .detail-tags{
        margin-left: 50px;
      }
    }
  }
  .detail-back{
    cursor: pointer;
    user-select: none;
    color: #409EFF;
    span{
      margin-left: 5px;
    }
  }
}
</style>
