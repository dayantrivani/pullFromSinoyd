<template>
  <header class="g-head">
    <div class="mod-layout-header">
      <div class="title">{{ $route.meta.title || '' }}</div>
      <div v-show="show === 'color'" class="subhead color-blur">{{ $route.meta.subtitle }}</div>
      <div v-show="show === 'click'" class="subhead is-select">
        <div class="psName" @click="openDialog" v-loading="loading">
          <div class="hleft" @click.stop="onClickPrev"></div>
          {{ item.psName }}
          <div class="hright" @click.stop="onClickNext"></div>
        </div>
      </div>
    </div>
    <div v-show="isDialog" class="dialog">
      <div class="dialog-main">
        <div class="dialog-main__header">
          <div class="text">企业选择</div>
          <div class="close" @click="isDialog = false"></div>
          <div class="icon"></div>
        </div>
        <div class="dialog-main__body" @mousewheel.stop="">
          <el-scrollbar style="width: 100%; height: 100%">
            <ul class="list">
              <li v-for="(item,index) in list" :key="index" @click="onClickSelect(item, index)">{{ item.psName }}</li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'LayoutHeader',
  data() {
    return {
      loading: false,
      show: 'click',           // 副标题展示的内容
      isDialog: false,
      index: 0,                // 记录选中的企业索引
      list: [
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
        {
          psName: '企业一',
        },
        {
          psName: '企业二',
        },
        {
          psName: '企业三',
        },
      ],
      item: {                 // 选中的对象
        psName: '企业一',
      },
    };
  },
  watch: {
    $route: {
      handler(val) {
        const type = typeof val.meta.subtitle;
        if (type === 'boolean') {
          this.className = 'subhead is-select';
          this.show = 'click';
        }
        if (type === 'string') {
          this.className = 'subhead color-blur';
          this.show = 'color';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onClickPrev() {
      if (this.index !== 0) {
        this.index -= 1;
      } else {
        this.index = this.list.length - 1;
      }
      this.item = this.list[this.index];
    },
    openDialog() {
      this.isDialog = true;
    },
    onClickSelect(item, index) {
      this.index = index;
      this.item = item;
      this.isDialog = false;
    },
    onClickNext() {
      if (this.index !== (this.list.length - 1)) {
        this.index += 1;
      } else {
        this.index = 0;
      }
      this.item = this.list[this.index];
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'index.scss';
</style>
