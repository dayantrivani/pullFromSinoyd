<template>
  <el-card header="公告管理" shadow="never" class="card-notice">
    <template slot="header">
      <span class="flex-1 i-overflow">
        <span class="absolute" style="top: 0; left: 0;">
          <icon v-if="data.isTop" name="top" size="2.2em" />
        </span>
        <span v-if="!data.isRelease" class="bg-info">未发布</span>
        <span class="card-notice__title" @click="onDetail(false)">{{ data.title }}</span>
      </span>
      <div class="more">
        <el-button type="text" @click="onDetail(true)">编辑</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button
          type="text"
          :class="`text-${ data.isTop ? 'info' : 'warning'}`"
          :loading="loading"
          @click="onTop()"
        >
          {{ data.isTop ? '取消' : ''}}置顶
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" class="text-danger" @click="$emit('remove', data)">删除</el-button>
      </div>
    </template>
    <div class="card-notice__body">
      <p class="intro">{{ intro }}</p>
      <p class="pad-t-sm">
        <span class="text-primary"><icon name="user" y="-1px" /></span>
        {{ data.releaseMan }}
        <span class="text-warning pad-l-sm"><icon name="el-icon-date" y="-2px" /></span>
        {{ data.releaseTime }}
        <span class="text-success pad-l-sm"><icon name="tags"/></span>
        <span v-for="item in data.tags" :key="item"> {{ item }}</span>
      </p>
    </div>
  </el-card>
</template>

<script>
import { cloneDeep } from 'lodash';
import { saveNotice } from '../request';

const escape2Html = (str) => {
  const arrEntities = {
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'amp': '&',
    'quot': '"',
  };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => arrEntities[t]);
};

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    intro() {
      return escape2Html(this.data.content.replace(/<[^>]+>/g, ''));
    },
  },
  methods: {
    onDetail(isEdit) {
      this.$emit('detail', { row: this.data, isEdit });
    },
    onTop() {
      const data = cloneDeep(this.data);
      data.isTop = !data.isTop;
      this.loading = true;
      saveNotice(data)
        .then((response) => {
          const { success, msg } = response.data;
          if (success) {
            this.$emit('query');
          } else {
            this.$message.warning(msg);
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
.card-notice {
  &:hover > .el-card__header .more {
    display: inline-block;
  }
  ::v-deep > .el-card__header {
    height: 40px;
    .more {
      display: none;
    }
    .tag {
      margin-right: 5px;
      padding: 2px 5px;
      border-radius: 2px;
    }
  }
  .more .el-button.el-button--text {
    padding-top: 3px;
    padding-bottom: 0;
  }
  .intro {
    height: 40px;
    @include lines-omit(2);
  }
  .card-notice__title {
    font-size: 1.5rem;
    font-weight: bold;
    &:hover {
      color: $--color-primary;
      cursor: pointer;
    }
  }
  .card-notice__body {
    height: 70px;
    overflow: hidden;
  }
}
</style>
