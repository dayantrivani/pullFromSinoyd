<template>
  <dialog-modal
    ref="dialogOpen"
    size="middle"
    title="方案及报告"
    @close="closeDialog"
  >
    <a
      class="down-link"
      href="./doc/排污单位自行监测技术指南 总则(HJ 819-2017).pdf"
      download="排污单位自行监测技术指南 总则(HJ 819-2017).pdf">技术指南</a>
    <!-- 采用分块布局 -->
    <el-row class="pad-b-sm">
      <el-col :span="5">
        <div style="border:1px solid #e4e4e4;height:calc(86vh - 60px)">
          <el-tree
            ref="tree"
            highlight-current
            :data="treeData"
            :expand-on-click-node="false"
            :default-expand-all="true"
            :props="{ label: 'dictName' }"
            :render-content="renderContent"
            @node-click="onNodeClick">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="19">
        <div>
          <el-tabs
            class="mar-l-sm"
            style="height: calc(86vh - 60px)"
            type="border-card"
            v-model="activeName"
            @tab-click="onTabClick">
            <el-tab-pane
              v-for="(item,index) in $enum.reportingPeriod"
              :key="index"
              :label="item"
              lazy
              :name="index"
              :disabled="!bodyItem.itemType"
              class="pad-x-sm">
              <!-- 日的数据展示 -->
              <data-display :ref="`dataDisplay${index}`" :body-item="bodyItem"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </dialog-modal>
</template>

<script>
import DataDisplay from './DataDisplay';

export default {
  // 传入参数项
  props: {
    title: {
      type: String,
    },
  },
  components: {
    DataDisplay,
  },
  data() {
    return {
      activeName: '1',
      isCollapsed: false,
      // treeData: [],
      dict: {
        DataReportingMonitoringType: [],
      },
      bodyItem: {}, // 选择左侧监测类型
    };
  },
  computed: {
    treeData() {
      return [{
        dictName: '方案与报告',
        children: this.cleanChildren(this.buildTree(this.dict.DataReportingMonitoringType, '0')),
      }];
    },
  },
  methods: {
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
    // 切换日月季年tab页
    onTabClick() {
      this.$set(this.bodyItem, 'activeName', this.activeName);
      this.$nextTick(() => {
        this.$refs[`dataDisplay${this.activeName}`][0].onQueryList(this.activeName);
      });
    },
    onNodeClick(item, node) {
      if (node.level !== 1 && node.isLeaf) {
        this.$set(this.bodyItem, 'activeName', this.activeName);
        this.$set(this.bodyItem, 'itemType', { ...item });
        this.$refs[`dataDisplay${this.activeName}`][0].onQueryList(this.activeName);
      }
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.$set(this.bodyItem, 'schemeId', row.id);
        this.$set(this.bodyItem, 'executionYear', row.executionYear);
      }
      this.getDictList();
      [this.activeName] = Object.keys(this.$enum.reportingPeriod);
      // 显示编辑表单
      this.$refs.dialogOpen.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.$set(this, 'bodyItem', {});
      this.$refs.dialogOpen.closeDialog();
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n.parentId === parentId) {
            n.children = fa(n.id);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
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
    // 双击节点收缩/展开
    ondblclick(node) {
      if (node.isLeaf) return;
      if (node.expanded) {
        node.collapse();
      } else {
        node.expand();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.down-link {
  display: inline-block;
  padding: 4px 10px;
  font-size: 14px;
  position: absolute;
  right: 68px;
  top: 10px;
  z-index: 999;
}
</style>
