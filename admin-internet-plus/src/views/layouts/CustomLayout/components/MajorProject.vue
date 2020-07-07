<!-- 重点项目 -->
<template>
  <el-card fill shadow="hover" :body-style="{ padding: 0 }">
    <template slot="header">
      <div class="el-card__title">
        <icon name="icon-xiangmujindu" color="#FFB822" scale="1.3" />
        <span class="pad-l-sm">重点项目</span>
      </div>
      <div class="el-card__more">
        <button @click="$emit('to', 'ProjectInquiry')">
          <icon name="more" />
        </button>
      </div>
    </template>
    <scrollbar v-loading="loading">
      <div class="wrap-project">
        <section
          v-for="row in itemList"
          :key="row.id"
          :class="`item-project border-${$enum.get('GRADE:value', row.grade).tag}`"
        >
          <div class="col">
            <p>
              <span class="pad-r-xs">{{ row.projectCode }}</span>
              <icon v-if="$enum.getLabel('GRADE', row.grade) === '特急'" name="danger" color="#FD3C7C" />
            </p>
            <p class="text-info">{{ row.projectTypeName }}</p>
          </div>
          <div class="col">
            <p :title="row.projectName">{{ row.projectName }}</p>
            <p class="text-info">{{ row.customerName }}</p>
          </div>
          <div class="col">
            <p>
              <status :type="$enum.get('PROJECT_STATUS:value', row.status).tag">
                {{ row.status }}
              </status>
            </p>
            <p class="pad-y-sm">
              <el-tooltip :disabled="!row.collectionDetail.length">
                <template slot="content">
                  <p>已收款: {{row.collectionDetail[0] || 0}}</p>
                  <p class="pad-t-xs">坏账: {{row.collectionDetail[1] || 0}}</p>
                  <p class="pad-t-xs">总金额: {{row.collectionDetail[2] || 0}}</p>
                </template>
                <Progress
                  :color="['#67c23a', '#000']"
                  :data="[row.collectionDetail[0], row.collectionDetail[1]]"
                  :count="row.collectionDetail[2]"
                />
              </el-tooltip>
            </p>
          </div>
          <div class="col">
            <p>{{ row.leaderName }}</p>
            <!-- 已收款 / 坏账 / 总金额 -->
            <p class="text-center text-danger">
              <span>{{ row.collectionDetail[0] || '--' }}</span>
              <span class="pad-x-xs">/</span>
              <span>{{ row.collectionDetail[2] || '--' }}</span>
            </p>
          </div>
        </section>
      </div>
    </scrollbar>
  </el-card>
</template>

<script>
import Progress from '@/components/Progress';

import { getKeyProject } from '../request';

export default {
  components: {
    Progress,
  },
  inheritAttrs: false,
  data() {
    return {
      loading: false,
      itemList: [],
    };
  },
  created() {
    this.getItemList();
  },
  activated() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.loading = true;
      getKeyProject()
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            this.itemList = data;
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
.wrap-project {
  padding: 5px 10px;
  > .item-project:not(:first-child) {
    margin-top: 5px;
  }
  > .item-project {
    display: flex;
    justify-content: space-around;
    padding: 7px 0;
    height: 42px;
    border-left: 4px solid;
    background-color: lighten($-color-base-bg, 2%);
    transition: height 0.35s;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      height: 70px;
    }
    > .col {
      padding: 0 15px;
      &:nth-child(1) { width: 130px }
      &:nth-child(2) { flex: 1; overflow: hidden; }
      &:nth-child(3) { width: 120px }
      &:nth-child(4) { width: 100px }
      > p {
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
