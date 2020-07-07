<template>
  <a-modal
    class="dialog-authority"
    :visible="isVisible"
    title="配置角色权限"
    :maskClosable="false"
    @cancel="closeDialog">
    <a-tree
      v-if="treeData.length"
      checkable
      multiple
      v-model="selectedKeys"
      :treeData="treeData"
      :defaultExpandAll="true"
    >
    </a-tree>
    <div slot="footer">
      <a-button icon="save" type="primary" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import { getMenu, saveAuthority } from '@/api/modules/role-management.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      isVisible: false,
      treeData: [],
      selectedKeys: [],
      row: {},
    };
  },
  methods: {
    // 保存事件
    onSave() {
      saveAuthority(this.selectedKeys, this.row).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.closeDialog();
          this.$emit('refreshList');
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 弹框显示
    openDialog(row) {
      this.row = row;
      getMenu(this.row.id).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.authorityList = response.data.data;
          this.treeData = this.generateTree(this.authorityList);
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.selectedKeys = [];
      this.treeData = [];
    },
    // 生成树
    generateTree(data) {
      const tem = [];
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const obj = {
          key: node.id,
          title: node.name,
        };
        if (node.hasSetting) {
          this.selectedKeys.push(node.id);
        }
        if (node.children && node.children.length !== 0) {
          this.generateTree(node.children);
          obj.children = this.generateTree(node.children);
        }
        tem.push(obj);
      }
      return tem;
    },
  },
  created() {},
};
</script>
<style lang="scss">
  .dialog-authority{
    .ant-modal-content{
      .ant-modal-body{
        padding: 0 24px;
        height: 70vh;
        overflow: auto;
      }
    }
  }
</style>
