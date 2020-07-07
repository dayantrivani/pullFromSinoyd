<template>
  <div
    class="app-nav-menu"
    v-show="app.navMenu"
    @mouseover="app.setNavMenu(true)">
    <div :class="{ 'nav-menu': 1, 'is-opened': app.navMenu }">
      <div class="nav-search">
        <a-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="search">
        </a-input>
      </div>
      <scrollbar class="hide-x" view-class="nav-menu-wrap" :noresize="false">
        <ul class="nav-menu-group" v-for="(item, key) in userMenu" :key="key">
          <span>{{ item.label }}</span>
          <li
            v-for="(i, k) in item.children"
            :key="k"
            :class="{ 'is-active': isActive(i) }"
            @click="onClick(i)">
            <span>{{ i.label }}</span>
            <i :class="`el-icon-star-${isActive(i) ? 'on' : 'off'}`"></i>
          </li>
        </ul>
      </scrollbar>
    </div>
    <div
      :class="{ 'nav-shade': 1, 'is-fold': app.isFold }"
      @click="onClose()"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import config from '@/config';

export default {
  inject: ['app'],
  data() {
    return {
      search: '',
      props: {
        type: Object,
        default: () => (config.navbar),
      },
    };
  },
  computed: {
    ...mapState('auth', ['userMenu']),
  },
  methods: {
    onClick(item) {
      this.app.setMenuItem(item);
      this.app.setIsFold(false);
    },
    onClose() {
      this.app.setNavMenu(false);
    },
    isActive(item) {
      return this.app.menuItemSed.find(v => v[this.props.path] === item[this.props.path]);
    },
  },
};
</script>

<style lang="scss">
  .app-nav-menu {
    > .nav-menu {
      position: fixed;
      top: 40px;
      left: 220px;
      margin-left: 10px;
      // width: 65%;
      padding-bottom: 20px;
      height: auto;
      min-width: 800px;
      height: 100%;
      // max-height: calc(100vh - 40px);
      z-index: $-z-index + 2;
      background-color: $-color-white;
      box-shadow: 2px 0 2px rgba(0,0,0,.05), 1px 0 0 rgba(0,0,0,.05);
      opacity: 0;
      transition: all .3s ease 0s;
      &.is-opened {
        margin-left: 0;
        opacity: 1;
      }
      > .nav-search {
        padding: 10px 10px 0;
        input {
          border-width: 0 0 1px 0;
          border-radius: 0;
          height: 41px;
          line-height: 41px;
        }
      }
    }
    > .nav-shade {
      position: absolute;
      right: 0;
      left: 220px;
      top: 40px;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: $-z-index + 1;
      transition: left .3s cubic-bezier(.645,.045,.355,1);
      &.is-fold { left: 50px; }
    }
    .nav-menu-wrap {
      padding: 0 10px;
      width: 100%;
      column-count: 3;
      column-gap: 2em;
    }
    ul.nav-menu-group {
      padding: 10px 0;
      break-inside: avoid;
      > span {
        display: inline-block;
        padding: 5px 10px;
        font-weight: bold;
        color: #000;
      }
      > li {
        padding: 5px 10px;
        cursor: pointer;
        &:hover {
          background-color: #ececec;
          > i { opacity: 1; }
        }
        &.is-active {
          > i { opacity: 1; }
        }
        > i {
          float: right;
          padding: 2.5px 0;
          opacity: 0;
          color: #ff7b00;
        }
      }
    }
  }
</style>
