<!-- 记录与评论 -->
<template>
  <div class="mod-comment" :style="{ 'height': height }">
    <div class="comment-content" :style="{ 'min-height': minHeight }">
      <scrollbar v-loading="loading">
        <div class="pad-a-sm">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in itemList"
              :key="index"
              hide-timestamp
              placement="top"
              :timestamp="item.commentTime"
            >
              <p class="flex-x-between pad-b-xs text-info">
                <span>{{ item.commentPersonName }}</span>
                <span>{{ item.commentTime }}</span>
              </p>
              <p v-html="item.comment"></p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </scrollbar>
    </div>
    <el-input
      ref="input"
      class="comment-input"
      v-model="itemModel.comment"
      placeholder="请输入评论内容, 按回车键发送"
      :disabled="sendLoading || !objectId"
      @keyup.enter.native="onClickSend()"
    ></el-input>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import {
  emptyLogForm,
  addComment,
  removeComment,
  getCommentList,
} from '../request';

export default {
  name: 'Comment',
  props: {
    // 项目id
    objectId: {
      required: true,
    },
    // 评论类型 1.留言 2.日志
    type: {
      type: Number,
      default: 1,
    },
    // 评论对象类型 1.项目 2.我的审批 3.工作单 4.报告
    objectType: {
      type: Number,
      default: 1,
    },
    height: {
      type: String,
      default: 'auto',
    },
    minHeight: {
      type: String,
      default: '150px',
    },
  },
  data() {
    return {
      loading: false,
      sendLoading: false,
      itemModel: emptyLogForm(),
      itemList: [],
    };
  },
  computed: mapState('auth', ['userInfo']),
  watch: {
    objectId: {
      handler(val) {
        if (val) {
          this.getItemList();
        } else {
          this.clean();
        }
      },
      immediate: true,
    },
  },
  methods: {
    focus() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    clean() {
      this.itemList = [];
      this.itemModel.comment = '';
    },
    onClickSend() {
      this.sendLoading = true;
      addComment({
        comment: this.itemModel.comment,
        objectId: this.objectId,
        objectType: this.objectType,
        commentType: this.type,
        commentPersonId: this.userInfo.userGuid,
        commentPersonName: this.userInfo.userName,
      })
        .then((response) => {
          const { success } = response.data;
          if (success) {
            this.getItemList();
            this.itemModel.comment = '';
          }
        })
        .finally(() => {
          this.sendLoading = false;
          this.focus();
        });
    },
    onClickRemove(row, index) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        removeComment(row.objectId)
      )).then((response) => {
        if (response.data.success) {
          this.itemList.splice(index, 1);
        }
      });
    },
    getItemList() {
      this.loading = true;
      getCommentList(this.objectId, this.objectType)
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.itemList = data || [];
            this.$emit('count', data.length);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.mod-comment ::v-deep {
  > .comment-content {
    height: calc(100% - 40px);
    border: $--border-base;
    border-bottom: none;
  }
  > .comment-input input {
    border-radius: 0;
  }
}
</style>
