<!-- 标签栏导航 -->
<template>
  <div class="tags-view">
    <!-- 操作按钮 -->
    <div class="btn-scoll">
      <!-- <button :class="{ 'is-active': isActive({name: config.home }) }" @click="$router.replace('/')">
        <i class="fas fa-home" ></i>
      </button> -->
      <button @click="onScollLeft">
        <i class="el-icon-d-arrow-left"></i>
      </button>
      <button @click="onScollRight">
        <i class="el-icon-d-arrow-right"></i>
      </button>
    </div>
    <!-- 标签容器 -->
    <div ref="tagsc" class="container">
      <ul class="m-scoll" :style="{ left: `-${scollOffset}px` }">
        <router-link
          ref="tag"
          tag="li"
          replace
          v-for="tag in visitedViews"
          :key="tag.path"
          :to="{ name: tag.redirect ? tag.redirect.name : tag.name}"
          :class="{ 'is-active': isActive(tag) }"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag, $event)">{{ tag.title }}
          <i v-show="tag.name != config.home" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></i>
        </router-link>
      </ul>
    </div>
    <!-- 右键菜单 -->
    <menu-context ref="contextMenu">
      <template slot-scope="{ rows }">
        <li @click="refreshSelectedTag(selectedTag)">刷新</li>
        <li v-show="rows.name != config.home" @click="closeSelectedTag(selectedTag)">关闭当前</li>
        <li @click="closeOthersTags">关闭其他</li>
        <li v-show="rows.name != config.home" @click="closeAllTags">关闭全部</li>
      </template>
    </menu-context>
  </div>
</template>

<script>
import $config from '@/config';
import { hideRoutesMap } from '@/routes';

export default {
  data() {
    return {
      selectedTag: {},
      scollOffset: 0,
      scollOffsetRight: 0,
      config: $config,
    };
  },
  computed: {
    // 显示的标签对象
    visitedViews() {
      return this.$store.state.tagsView.visitedViews.filter(v => !hideRoutesMap.includes(v.name));
    },
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visitedViews() {
      // 监测实时偏移量
      this.$nextTick(() => {
        this.onChangeScoll();
      });
    },
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    // 初始化偏移量
    onInitOffset() {
      this.scollOffset = 0;
      this.scollOffsetRight = 0;
    },
    // 单击左偏移按钮
    onScollLeft() {
      const scollBox = this.$refs.tagsc.getBoundingClientRect().width;
      const scollItems = this.$refs.tagsc.childNodes[0].getBoundingClientRect().width;
      if (scollItems > (scollBox * 2) && this.scollOffset > scollBox) {
        this.scollOffset -= scollBox;
      } else {
        this.scollOffset = 0;
      }
    },
    // 单击右偏移按钮
    onScollRight() {
      const scollBox = this.$refs.tagsc.getBoundingClientRect().width;
      const scollItems = this.$refs.tagsc.childNodes[0].getBoundingClientRect().width;
      if (scollItems > (scollBox * 2) && this.scollOffset < scollItems - scollBox) {
        this.scollOffset += scollBox;
      } else {
        this.scollOffset = 0;
        this.scollOffset = scollItems - scollBox;
      }
    },
    // 最大偏移量
    onChangeScoll() {
      // 容器宽度
      const scollWidth = this.$refs.tagsc.getBoundingClientRect().width;

      // 每个标签宽度
      const scollNodes = [];
      const childNodes = Array.prototype.slice.call(this.$refs.tagsc.childNodes);

      // 获取每个标签宽度
      childNodes.forEach((el) => {
        scollNodes.push(el.getBoundingClientRect().width);
      });

      // 标签总宽度
      const scollNodesWidth = Math.floor(scollNodes.reduce((oldVal, val) => oldVal + val));

      // 当无标签或标签宽度和小于容器宽度时，初始化偏移量
      if (!scollNodes.length || scollNodesWidth < scollWidth) {
        this.onInitOffset();
        return;
      }

      // 当标签溢出容器时，设置偏移量
      if (scollNodesWidth >= scollWidth) {
        this.scollOffset = scollNodesWidth - scollWidth + 5;
        this.scollOffsetRight = this.scollOffset + scollWidth * 0.4;
      }
    },
    isActive(route) {
      return route.name === this.$route.name || route.name === this.$route.matched[1].name;
    },
    // 添加标签
    addViewTags() {
      const { name } = this.$route.matched[1];
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route.matched[1]);
      }
      return false;
    },
    // 标签偏移
    moveToCurrentTag() {
      this.$nextTick(() => {
        if (!this.$refs.tag) return;
        const me = this.$refs.tag.find(v => v.to.path === this.$route.path);
        if (me) {
          if (me.to.fullPath !== this.$route.fullPath) {
            this.$store.dispatch('tagsView/updateVisitedView', this.$route);
          }
        }
      });
    },
    // 刷新标签页
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/removeCachedView', view).then(() => {
        this.$nextTick(() => {
          this.$router.replace({ name: view.name });
          this.$store.commit('tagsView/ReloadTab');
        });
      });
    },
    // 关闭选择的标签页
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/removeView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.replace(latestView);
          } else {
            this.$router.replace('/');
          }
        }
      });
    },
    // 关闭其他标签页
    closeOthersTags() {
      this.$router.replace(this.selectedTag);
      this.$store.dispatch('tagsView/removeOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag();
        this.onInitOffset();
      });
    },
    // 关闭所有标签页
    closeAllTags() {
      this.$store.dispatch('tagsView/removeAllViews');
      this.onInitOffset();
      this.$router.replace('/');
    },
    // 打开右键菜单
    openMenu(tag, e) {
      this.$refs.contextMenu.openMenu(e, tag);
      this.selectedTag = tag;
    },
  },
};
</script>
