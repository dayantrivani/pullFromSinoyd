<template>
  <!-- 配置弹框 -->
  <dialog-modal ref="dialog" title="排口配置" class="defealt-dialog">
    <el-form inline :model="queryForm">
      <el-form-item label="行政区域：">
        <select-tree-lazy placeholder="行政区域" v-model="queryForm.regionCodeId"/>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model="queryForm.key" clearable placeholder="企业名称，排口名称，MN号" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getItemList">查 询</el-button>
      </el-form-item>
    </el-form>
    <el-tabs style="height: calc(100% - 45px);"  v-model="tabPortType">
      <el-tab-pane
        v-for="(item, index) in treeData"
        :key="index"
        :label="item.label"
        :name="item.portType.toString()">
        <el-tree
          v-loading="treeLoading[item.portType]"
          ref='typeTree'
          :data="item.children"
          highlight-current
          show-checkbox
          :render-after-expand="false"
          :expand-on-click-node="false"
          :default-expand-all="false"
          :render-content="renderContent"
          @check="handleCheckChange">
        </el-tree>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        :disabled="!selectedIds.length"
        @click="onSaveSelected(selectedIds)">保 存</el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';

export default {
  name: 'TabPanDialog',
  components: {
    SelectTreeLazy,
  },
  data() {
    return {
      treeData: [
        { label: '废水', portType: 1 },
        { label: '烟气', portType: 2 },
        { label: '固废', portType: 3 },
        { label: '噪声', portType: 4 },
        { label: '雨水', portType: 5 },
      ],
      saveLoading: false,
      treeLoading: [false, false, false, false],
      roleId: '',
      selectedIds: [], // 选中项 id
      // psKeys: ['regionName', 'psName', 'portTypeName', 'portName'],
      queryForm: {
        regionCodeId: '',
        key: '',
      },
      typeKeys: ['portTypeName', ''], // , 'regionName', 'psName', 'portName'
      tabPortType: '1', // 选择面板的排口类型
    };
  },
  computed: {},
  created() {},
  methods: {
    handleCheckChange() { // 树 改变选择效果
      let selectedIds = [];
      if (this.$refs.typeTree && this.$refs.typeTree.forEach) {
        this.$refs.typeTree.forEach((element) => {
          selectedIds = selectedIds.concat(element.getCheckedNodes(true).map(val => val.id));
        });
      }
      this.selectedIds = selectedIds;
    },
    // 保存选中项 id
    onSaveSelected(ids) {
      this.ROLE_PORT_CREATED(ids).then(() => {
        this.$emit('query');
      });
      this.$refs.dialog.closeDialog();
    },
    ROLE_PORT_CREATED(body) {
      return new Promise((resolve) => {
        this.saveLoading = true;
        this.$http.post(`cfg/rolePort/${this.roleId}`, body).then((response) => {
          if (response.data.success) {
            resolve(response);
            this.$message.success({
              message: response.data.msg,
              duration: 1500,
            });
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        }).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    openDialog(roleId) {
      this.queryForm = {
        regionCodeId: '',
        key: '',
      };
      this.roleId = roleId;
      this.treeLoading = [true, true, true, true];
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    getItemList() {
      this.treeData.forEach((element) => {
        this.getPortTypeList(element.portType).then((response) => {
          this.$set(element, 'children', [...this.buildTree(this.getPortChildren(response))]);
          this.mixRegionAndPort(element.children);
        });
      });
      // this.$http.get('bas/portInfo/queryTree', {
      //   params: {
      //     page: 1,
      //     rows: 100000,
      //     sort: 'psName+,portType+,portName',
      //   },
      // }).then((response) => {
      //   this.treeData = [...this.getPortTypeTree(response.data.data)].map(n => ({
      //     label: n.label,
      //     portType: n.portType,
      //   }));
      //   this.treeData.forEach((element) => {
      //     this.getPortTypeList(element.portType).then((response) => {
      //       this.$set(element, 'children', [...this.buildTree(this.getPortChildren(response))]);
      //       this.mixRegionAndPort(element.children);
      //     });
      //   });
      // });
    },
    getPortTypeList(portType) { // 根据排口类别获取相应排口列表
      return new Promise((resolve) => {
        this.$http.get('bas/portInfo/queryTree', {
          params: {
            page: 1,
            rows: 100000,
            portType,
            ...this.queryForm,
            sort: 'psName+,portType+,portName',
          },
        }).then((response) => {
          resolve(response.data.data);
        }).finally(() => {
          this.treeLoading[portType] = false;
        });
      });
    },
    getPortTypeTree(treeArr) { // 将行政区域排口数据组成树结构label children
      const portTypeMap = new Map();
      treeArr.forEach((element) => {
        if (element.psInfo) {
          this.$set(element, 'label', element.areaName);
          this.$set(element, 'children', element.psInfo);
          element.psInfo.forEach((ele) => {
            if (ele.portInfo) {
              this.$set(ele, 'label', ele.psName);
              this.$set(ele, 'children', ele.portInfo);
              ele.portInfo.forEach((e) => {
                this.$set(e, 'label', `${e.portName}(MN：${e.dgiMn})`);
                portTypeMap.set(e.portTypeName, e.portType);
              });
            }
          });
        }
      });
      const treeData = [];
      portTypeMap.forEach((element, index) => {
        treeData.push({
          label: index,
          portType: element,
          children: this.buildTree(treeArr),
        });
      });
      return treeData;
    },
    getPortChildren(portArr) {
      const arr = [...portArr];
      arr.forEach((element) => {
        if (element.psInfo) {
          this.$set(element, 'label', element.areaName);
          this.$set(element, 'children', element.psInfo);
          element.psInfo.forEach((ele) => {
            if (ele.portInfo) {
              this.$set(ele, 'label', ele.psName);
              this.$set(ele, 'children', ele.portInfo);
              // ele.label = ele.psName;
              // ele.children = ele.portInfo;
              ele.portInfo.forEach((e) => {
                e.label = `${e.portName}(MN：${e.dgiMn})`;
              });
            }
          });
        }
      });
      return arr;
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n.parentId === parentId) {
            temp.push(n);
            n.regions = fa(n.rowGuid);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 将排口与行政区域合在一起
    mixRegionAndPort(data) {
      const fa = (list) => {
        list.forEach((element) => {
          if (element.regions.length !== 0) {
            element.children.push(...element.regions);
            fa(element.regions);
          }
        });
        return list;
      };
      return fa(data);
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      // const treeIcon = {
      //   1: 'icon icon-hangyeleixing1 text-warning',
      //   2: 'fas fa-tags text-success',
      //   3: 'fas fa-tag text-primary',
      //   4: 'fas fa-hashtag text-info',
      // }
      return (
        // <i v-show={node.areaName} class="icon icon-hangyeleixing1" />
        // <i v-show={!node.isLeaf} class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
        <div class="node-item" ondblclick={event => this.ondblclick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.level === 1} class="icon icon-hangyeleixing1 text-warning"/>
            <i v-show={node.data.portInfo} class="fas fa-building text-success" />
            <i v-show={!node.data.children} class="fas fa-tint text-primary"/>
            <i v-show={node.level !== 1 && node.data.areaName} class="fas fa-tag" style="color: #5df;"/>
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

<style lang="scss">
.defealt-dialog {
  >.el-dialog {
    >.el-dialog__body {
      height: calc(70vh - 40px);
    }
  }
}
</style>
