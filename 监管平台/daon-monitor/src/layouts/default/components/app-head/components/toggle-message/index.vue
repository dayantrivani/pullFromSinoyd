<template>
  <a-popover
    v-if="$config.layout.messageUse"
    placement="bottom"
    trigger="click"
    :overlayStyle="{ 'z-index': 2000 }"
    overlayClassName="popper-message">
    <template v-slot:content>
      <a-card
        :style="{ 'width': '350px' }"
        :tabList="tabList"
        :activeTabKey="key"
        :loading="loading"
        @tabChange="key => onTabChange(key, 'key')"
      >
        <span slot="notification" slot-scope="item">
          <a-icon theme="twoTone" type="notification" />{{item.key }}
          <span :class="{ 'transparency': notificationNum === 0 }">({{notificationNum}})</span>
        </span>
        <span slot="message" slot-scope="item">
          <a-icon theme="twoTone" type="message" />{{item.key}}
          <span :class="{ 'transparency': commentNum === 0 }">({{commentNum}})</span>
        </span>
        <span slot="schedule" slot-scope="item">
          <a-icon theme="twoTone" type="schedule" />{{item.key}}
          <span :class="{ 'transparency': todolistNum === 0 }">({{todolistNum}})</span>
        </span>
        <a-list v-show="key === '通知'" itemLayout="horizontal" :dataSource="dataSource">
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            :class="{ 'mark-read': item.markRead }"
            @click="handleClick(item)"
          >
            <a-list-item-meta :description="item.operatedAt">
              <span slot="title" href="#">{{item.title}}</span>
              <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-list
          v-show="key === '消息'"
          class="comment-list"
          itemLayout="horizontal"
          :dataSource="commentData"
        >
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            :class="{ 'mark-read': item.markRead }"
            @click="handleClick(item)"
          >
            <a-comment
              :author="item.author"
              :avatar="item.avatar"
            >
              <template v-slot:actions tag="span">
                <span>{{item.datetime}}</span>
              </template>
              <p slot="content">{{item.content}}</p>
            </a-comment>
          </a-list-item>
        </a-list>
        <a-list
          v-show="key === '待办'"
          itemLayout="horizontal"
          :dataSource="todolist"
        >
          <a-list-item
            slot="renderItem"
            slot-scope="item"
            :class="{ 'mark-read': item.markRead }"
            @click="handleClick(item)"
          >
            <a-list-item-meta :description="item.content">
              <span slot="title" href="https://vue.ant.design/">{{item.title}}</span>
              <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </a-list-item-meta>
            <a-tag :color="item.color">{{item.tag}}</a-tag>
          </a-list-item>
        </a-list>
        <template v-if="!loading" class="ant-card-actions" slot="actions">
          <!-- <a-icon theme="twoTone" type="setting" /> -->
          <div href="#" @click="getEmpty">清空通知</div>
          <!-- <a-icon type="edit" /> -->
          <div href="#">查看更多</div>
        </template>
      </a-card>
    </template>
    <span class="btn" title="消息">
      <a-badge :dot="notificationNum + commentNum + todolistNum !== 0">
        <icon name="icon-bell" size="1.2em" :offset="{ top: '2px' }" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { getApply } from '@/api/modules/user-management.js';

export default {
  name: 'ToggleMessage',
  inject: ['app'],
  data() {
    return {
      loading: false,
      dataSource: [
        // {
        //   title: '你收到了 14 份新周报',
        //   description: '2年前',
        //   markRead: false,
        // },
        // {
        //   title: '你推荐的 曲妮妮 已通过第三轮面试',
        //   description: '2年前',
        //   markRead: false,
        // },
        // {
        //   title: '这种模板可以区分多种通知类型',
        //   description: '2年前',
        //   markRead: false,
        // },
        // {
        //   title: '左侧图标用于区分不同的类型',
        //   description: '2年前',
        //   markRead: false,
        // },
        // {
        //   title: '内容不要超过两行字，超出时自动截断',
        //   description: '2年前',
        //   markRead: false,
        // },
      ],
      commentData: [
        // {
        //   actions: ['Reply to'],
        //   author: '曲丽丽评论了你',
        //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //   content: '描述信息描述信息描述信息描述信息描述信息。',
        //   datetime: '2年前',
        //   markRead: false,
        // },
        // {
        //   actions: ['Reply to'],
        //   author: '朱偏右回复了你',
        //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //   content: '这种模板用于提醒谁与你发生了互动，左侧放[谁]的头像.',
        //   datetime: '2年前',
        //   markRead: false,
        // },
        // {
        //   actions: ['Reply to'],
        //   author: '标题',
        //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //   content: '这种模板用于提醒谁与你发生了互动，左侧放[谁]的头像.',
        //   datetime: '2年前',
        //   markRead: false,
        // },
      ],
      todolist: [
        // {
        //   title: '任务名称',
        //   tag: '未开始',
        //   color: '',
        //   content: '任务需要在 2019-01-01 12:20 前启动',
        //   markRead: false,
        // },
        // {
        //   title: '第三方紧急代码变更',
        //   tag: '马上到期',
        //   color: 'red',
        //   content: '你需要在 2019-01-01 12:20 前完成代码变更任务',
        //   markRead: false,
        // },
        // {
        //   title: '信息安全考试',
        //   tag: '已耗时 8 天',
        //   color: 'orange',
        //   content: '任务需要在 2019-01-01 12:20 前启动',
        //   markRead: false,
        // },
        // {
        //   title: '版本发布',
        //   tag: '进行中',
        //   color: 'blue',
        //   content: '任务需要在 2019-01-01 12:20 前启动',
        //   markRead: false,
        // },
      ],
      tabList: [{
        key: '通知',
        // tab: 'tab1',
        scopedSlots: { tab: 'notification' },
      }, {
        key: '消息',
        // tab: 'tab2',
        scopedSlots: { tab: 'message' },
      },  {
        key: '待办',
        // tab: 'tab3',
        scopedSlots: { tab: 'schedule' },
      }],
      key: '通知',
    };
  },
  computed: {
    notificationNum() {
      return this.dataSource.filter(notice => !notice.markRead).length;
    },
    commentNum() {
      return this.commentData.filter(notice => !notice.markRead).length;
    },
    todolistNum() {
      return this.todolist.filter(notice => !notice.markRead).length;
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 获取申请加入机构列表
    getItemList() {
      getApply().then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.dataSource = response.data.data;
          this.dataSource.forEach((el) => {
            this.$set(el, 'title', `${el.userName}申请加入${el.relatedName}`);
          });
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
    handleToggle() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
    callback(/* key */) {
      // console.log(key);
    },
    onTabChange(key, type) {
      this[type] = key;
    },
    handleClick(item) {
      if (item) {
        item.markRead = true;
      }
    },
    getEmpty() {
      if (this.key === '通知') {
        this.dataSource = this.dataSource.map((data) => {
          data.markRead = true;
          return data;
        });
      } else if (this.key === '消息') {
        this.dataSource = this.dataSource.map((data) => {
          data.markRead = true;
          return data;
        });
      } else if (this.key === '待办') {
        this.dataSource = this.dataSource.map((data) => {
          data.markRead = true;
          return data;
        });
      }
    },
  },
};
</script>

<style lang="scss">
  .popper-message .ant-popover-inner-content {
    padding: 0;
    > .ant-card.ant-card-bordered {
      border: none;
    }
  }
  .ant-popover.popper-message {
    .ant-list-item:hover {
      background: #e6f7ff;
      cursor: pointer;
    }
    .ant-tabs-nav .ant-tabs-tab {
      margin-right: 0;
    }
    .mark-read {
      opacity: .5;
    }
    .transparency {
      opacity: 0;
    }
  }
</style>
