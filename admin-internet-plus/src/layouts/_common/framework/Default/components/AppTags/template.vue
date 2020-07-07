<!-- 标签栏导航 -->
<template>
  <aside class="app-tags" v-if="app.custom.tagsUse">
    <!-- 操作按钮 -->
    <button class="btn" @click="onClickLeft()">
      <icon name="double-left" y="2px" />
    </button>
    <!-- 标签容器 -->
    <div class="container" ref="viewBox">
      <ul class="m-scoll" :style="{ left: `${-offset.left}px` }">
        <router-link
          replace
          ref="view"
          tag="li"
          v-for="view in visibleViews"
          :key="view.name"
          :to="{ name: view.name }"
          :class="{ 'is-active': view.name === $route.name }"
          @contextmenu.prevent.native="onContextmenu(view, $event)">
          <icon v-if="view.meta.icon && app.custom.tagsIconShow" :name="view.meta.icon" />
          {{ view.meta.title }}
          <icon v-if="view.meta.lock && app.custom.tagsLockShow" name="lock" />
          <span v-else-if="view.name !== $config.app.home" class="btn-close" @click.capture.stop="onRemoveTab(view)">
            <icon name="close" title="关闭页面" />
          </span>
        </router-link>
      </ul>
    </div>
    <button class="btn" @click="onClickRight()">
      <icon name="double-right" y="2px" />
    </button>
    <!-- 关闭标签菜单 -->
    <div class="tags-dropdown__close">
      <button class="btn">
        <icon name="arrow-down" y="2px" />
      </button>
      <ul class="tags-dropdown__overlay m-dropdown">
        <li v-if="unlockViews.includes($route.name)" @click="onClickCloseView(1)">
          <icon name="close" />
          <span>关闭当前</span>
        </li>
        <li  v-if="unlockViews[unlockViews.length - 1] !== $route.name" @click="onClickCloseView(4)">
          <icon name="close" />
          <span>关闭右侧</span>
        </li>
        <li v-if="unlockViews.length" @click="onClickCloseView(2)">
          <icon name="close" />
          <span>关闭其他</span>
        </li>
        <li v-if="unlockViews.length" @click="onClickCloseView(3)">
          <icon name="close" />
          <span>关闭所有</span>
        </li>
      </ul>
    </div>
    <!-- 右键菜单 -->
    <context-menu ref="contextMenu">
      <template v-slot="{ rows }">
        <li @click="onReloadView(rows)">
          <icon name="refresh" />
          <span>刷新</span>
        </li>
        <li v-show="rows.name != $config.app.home && app.custom.tagsLockShow" @click="onSwitchLockView(rows)">
          <icon :name="`${rows.meta && rows.meta.lock ? 'un' : ''}lock`" />
          <span>{{ lockViews.includes(rows.name) ? '解锁' : '锁定' }}</span>
        </li>
        <li v-show="unlockViews.length && unlockViews[unlockViews.length - 1] !== rows.name" @click="onRemoveRightTab(rows)">
          <icon name="arrow-right" />
          <span>关闭右侧</span>
        </li>
        <li v-show="unlockViews.length" @click="onRemoveOtherTab(rows)">
          <icon name="close" />
          <span>关闭其他</span>
        </li>
        <li v-show="unlockViews.length" @click="onRemoveAllTab()">
          <icon name="close" />
          <span>关闭所有</span>
        </li>
      </template>
    </context-menu>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import ContextMenu from './components/ContextMenu';

export default {
  name: 'AppTags',
  components: {
    ContextMenu,
  },
  inject: ['app'],
  data() {
    return {
      offsetList: [], // 各标签置顶偏移量
      offset: {
        left: 0,
        right: 0,
      },
    };
  },
  computed: {
    ...mapState('auth', ['homeRoute']),
    ...mapGetters('tagsView', [
      'visibleViews', // 可见的标签
      'lockViews',    // 已锁定的标签
      'unlockViews',  // 已解锁的标签
    ]),
    // 侧栏侧栏的变量
    sideCollapse() {
      return this.app.custom.sideCollapse;
    },
  },
  watch: {
    $route: {
      handler(view) {
        this.SetView({ type: 'ADD_VIEW', view });
        const viewIndex = this.visibleViews.findIndex(v => v.name === view.name);
        this.moveToCurrentTag(viewIndex);
      },
      immediate: true,
    },
    visibleViews() {
      // 监测实时偏移量
      this.$nextTick(() => {
        this.changeScoll();
      });
    },
  },
  created() {
    if (!this.visibleViews.map(v => v.name).includes(this.$config.app.home)) {
      this.SetView({ type: 'ADD_VIEW', view: this.homeRoute });
    }
  },
  methods: {
    ...mapActions('tagsView', ['SetView']),
    isHome(view) {
      return (view.name && view) === this.$config.app.home;
    },
    // 右键标签菜单
    onContextmenu(view, e) {
      this.$refs.contextMenu.openMenu(e, view);
    },
    // 刷新标签页
    onReloadView() {
      this.SetView({ type: 'RELOAD_VIEW' });
    },
    // 切换标签锁定与解锁
    onSwitchLockView(view) {
      const type = `${this.lockViews.includes(view.name) ? 'UN' : ''}LOCK_VIEW`;
      this.SetView({ type, view });
    },
    // 关闭标签页
    onRemoveTab(view) {
      this.SetView({ type: 'REMOVE_VIEW', view }).then((visibleViews) => {
        // 关闭当前页时跳转到前一个标签
        if (view.name === this.$route.name) {
          this.$router.replace({ name: visibleViews.slice(-1)[0].name });
        }
      });
    },
    // 关闭其他标签页
    onRemoveOtherTab(view) {
      this.SetView({ type: 'REMOVE_OTHER_VIEWS', view }).then((visibleViews) => {
        // 关闭非当前页时跳转到重新排列后的最后一个标签
        if (view.name !== this.$route.name) {
          this.$router.replace({ name: visibleViews.slice(-1)[0].name });
        }
      });
    },
    // 关闭右侧标签页
    onRemoveRightTab(view) {
      this.SetView({ type: 'REMOVE_RIGHT_VIEWS', view }).then((visibleViews) => {
        // 关闭非当前页时跳转到重新排列后的最后一个标签
        if (view.name !== this.$route.name) {
          this.$router.replace({ name: visibleViews.slice(-1)[0].name });
        }
      });
    },
    // 关闭全部标签页
    onRemoveAllTab() {
      this.SetView({ type: 'REMOVE_ALL_VIEWS', view: this.$route }).then((visibleViews) => {
        // 关闭非当前页时跳转到重新排列后的最后一个标签
        this.$router.replace({ name: visibleViews.slice(-1)[0].name });
      });
    },
    // 单击关闭下拉菜单
    onClickCloseView(command) {
      if (command === 1) { this.onRemoveTab(this.$route); }
      if (command === 2) { this.onRemoveOtherTab(this.$route); }
      if (command === 3) { this.onRemoveAllTab(); }
      if (command === 4) { this.onRemoveRightTab(this.$route); }
    },
    // 初始化偏移量
    onInitOffset() {
      this.offset.left = 0;
      this.offset.right = 0;
    },
    SetOffset(callback) {
      // 容器宽度
      const boxWidth = this.$refs.viewBox.getBoundingClientRect().width;
      // 子标签宽度
      const itemsWidth = this.$refs.viewBox.childNodes[0].getBoundingClientRect().width;
      // console.log(`
      //   boxWidth: ${boxWidth}
      //   itemsWidth: ${itemsWidth}
      //   left: ${this.offset.left}
      //   right: ${this.offset.right}
      // `);
      return callback && callback(boxWidth, itemsWidth);
    },
    // 单击左偏移按钮
    onClickLeft() {
      this.SetOffset((boxWidth, itemsWidth) => {
        const spacing = itemsWidth > (boxWidth * 2) && this.offset.left > boxWidth;
        if (spacing) {
          this.offset.left -= boxWidth;
        } else {
          this.offset.left = 0;
        }
      });
    },
    // 单击右偏移按钮
    onClickRight() {
      this.SetOffset((boxWidth, itemsWidth) => {
        if (itemsWidth <= boxWidth) return;
        // 标签溢出容器宽度且偏移量小于最大偏移量
        const spacing = itemsWidth > boxWidth && this.offset.left < itemsWidth - boxWidth;
        if (spacing) {
          const index = this.offsetList.length > 5 ? this.offsetList.length - 4 : this.offsetList.length - 2;
          this.offset.left = this.offsetList[index];
        } else {
          this.offset.left = 0;
          this.offset.left = itemsWidth - boxWidth;
        }
      });
    },
    // 最大偏移量
    changeScoll() {
      // 容器宽度
      const boxWidth = this.$refs.viewBox.getBoundingClientRect().width;

      // 每个标签宽度
      const itemsWidth = [];
      const offsetList = [];
      const itemsNode = Array.prototype.slice.call(this.$refs.viewBox.childNodes[0].childNodes);

      // 获取每个标签宽度
      itemsNode.forEach((el) => {
        itemsWidth.push(el.getBoundingClientRect().width + 5);
      });

      // 标签总宽度
      const itemsMaxWidth = Math.floor(itemsWidth.reduce((oldVal, val, index, data) => {
        offsetList.push(oldVal);
        if (index === data.length - 1) {
          offsetList.push(oldVal + val);
        }
        return oldVal + val;
      }));

      // 标签偏移量列表
      this.offsetList = offsetList;

      // 当无标签或标签宽度和小于容器宽度时，初始化偏移量
      if (!itemsWidth.length || itemsMaxWidth < boxWidth) {
        this.onInitOffset();
        return;
      }

      // 当标签溢出容器时，设置偏移量
      if (itemsMaxWidth >= boxWidth) {
        this.offset.left = itemsMaxWidth - boxWidth + 5;
        this.offset.right = this.offset.left + boxWidth * 0.4;
      }
    },
    // 标签偏移
    moveToCurrentTag(index) {
      this.$nextTick(() => {
        if (!this.$refs.view) return;
        const me = this.$refs.view.find(v => v.to.name === this.$route.name);
        if (me && me.to.name !== this.$route.name) {
          this.View('UPDATE_VIEW', this.$route);
        }
        if (typeof index === 'number' && index >= 0) {
          this.SetOffset((boxWidth) => {
            this.offset.left = this.offsetList[index] >= boxWidth
              ? this.offsetList[index - 1] - (boxWidth / 2)
              : 0;
          });
        }
      });
    },
  },
};
</script>
