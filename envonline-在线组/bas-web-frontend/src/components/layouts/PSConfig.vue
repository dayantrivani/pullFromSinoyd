<template>
  <!-- 企业信息配置布局 -->
  <el-row :gutter="5" class="fill-h">
    <el-col style="width: 200px;">
      <el-card class="title-card">
        <template slot="header">
          <router-link :to="{ name: 'PSInfo' }" tag="span" class="el-card__title" style="cursor: pointer">
            返回企业列表
          </router-link>
        </template>
        <el-tree
          ref="tree"
          default-expand-all
          highlight-current
          node-key="link"
          :data="menuList"
          class="fill-h"
          @node-click="onClickItem"
          :render-content="renderContent">
        </el-tree>
      </el-card>
    </el-col>
    <el-col style="width: calc(100% - 200px)">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'PSConfig',
  data() {
    return {
      menuList: [{
        label: '企业信息',
        children: [
          {
            label: '设备信息',
            children: [
              { label: '生产设施', link: 'PSInfoDetailProduce' },
              { label: '炉窑设施', link: 'PSInfoDetailStove' },
              { label: '烟囱设施', link: 'PSInfoDetailChimney' },
              { label: '监测设施', link: 'PSInfoDetailMonitor' },
              { label: '治理设施', link: 'PSInfoDetailGovern' },
              { label: '数采仪', link: 'PSInfoDetailDGI' },
              { label: '仪器管理', link: 'PSInfoDetaiInstrument' },
            ],
          },
          {
            label: '排放口',
            children: [
              { label: '废水', link: 'PSInfoDetailWater' },
              { label: '废气', link: 'PSInfoDetailGas' },
              { label: '雨水', link: 'PSInfoDetailRain' },
            ],
          },
        ],
      }],
      rowItem: {},
    };
  },
  created() {
    if (Object.hasOwnProperty.call(sessionStorage, 'psInfo')) {
      const row = JSON.parse(sessionStorage.getItem('psInfo'));
      this.$store.commit('psInfo/setActiveInfo', row);
    }
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.$store.state.psInfo.activePage);
    });
  },
  methods: {
    onClickItem(row) {
      if (row.link && row.link !== this.rowItem.link) {
        this.rowItem = row.link;
        this.$store.commit('psInfo/setActivePage', row.link);
        this.$router.push({ name: row.link });
      }
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      return (
        <div class="node-item" ondblclick={event => this.ondblclick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.isLeaf} class="fas fa-file" />
            <i v-show={!node.isLeaf} class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
            <span>{node.label}</span>
          </span>
        </div>
      );
    },
  },
};
</script>

<style scoped>
</style>
