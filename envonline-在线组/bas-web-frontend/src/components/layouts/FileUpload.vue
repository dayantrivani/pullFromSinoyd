<template>
  <!-- 企业管理配置布局 -->
  <el-row :gutter="5" class="fill-h">
    <el-col style="width: 200px;">
      <el-card class="title-card">
        <template slot="header">
          <router-link :to="{ name: 'Enterprise' }" tag="span" class="el-card__title" style="cursor: pointer">
            返回企业管理
          </router-link>
        </template>
        <el-tree
          ref="tree"
          default-expand-all
          highlight-current
          node-key="dictCode"
          :data="menuList"
          class="fill-h"
          @node-click="onClickItem"
          :render-content="renderContent">
        </el-tree>
      </el-card>
    </el-col>
    <el-col v-if="show" style="width: calc(100% - 200px)">
      <router-view></router-view>
    </el-col>
    <div style="background-color: white;" v-else></div>
  </el-row>
</template>

<script>
export default {
  name: 'FileUpload',
  data() {
    return {
      rowItem: {},
      show: false,
      dict: {
        EnterpriseFolderType: [],     // 页面
      },
    };
  },
  computed: {
    menuList() {
      this.dict.EnterpriseFolderType.forEach((item) => {
        this.$set(item, 'label', item.dictName);
      });
      return this.dict.EnterpriseFolderType;
    },
  },
  created() {
    this.getDictItem();
  },
  methods: {
    onClickItem(row) {
      if (row.dictCode && row.dictCode !== this.rowItem.dictCode) {
        this.rowItem = row.dictCode;
        this.$store.commit('psInfo/setUploadPage', row.dictCode);
        this.$router.push({ name: row.dictCode });
        this.$store.commit('psInfo/setUploadPageInfo', row);
      }
    },
    // 获取字典表数据
    getDictItem() {
      this.show = false;
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: key }).then((val) => {
          this.dict[key] = val;
          if (Object.hasOwnProperty.call(sessionStorage, 'UPInfo')) {
            const row = JSON.parse(sessionStorage.getItem('UPInfo'));
            this.$store.commit('psInfo/setUploadInfo', row);
          }
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.$store.state.psInfo.uploadPage);
          });
          this.$store.commit('psInfo/setUploadPageInfo', val[0] || {});
          this.show = true;
        });
      }));
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
