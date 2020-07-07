<template>
  <a-modal
    :visible="isVisible"
    width="50%"
    title="配置角色"
    :maskClosable="false"
    @cancel="closeDialog">
    <a-checkbox-group v-model="checkedList" style="width: 100%">
      <a-row>
        <a-col :span="8" v-for="(item,index) in roleList" :key="index">
          <a-checkbox :value="item.id">{{item.roleName}}</a-checkbox>
        </a-col>
      </a-row>
    </a-checkbox-group>
    <div slot="footer">
      <a-button type="primary" icon="save" @click="onSave">保 存</a-button>
      <a-button icon="close" @click="closeDialog">关 闭</a-button>
    </div>
  </a-modal>
</template>

<script>
import { getRole, saveRole } from '@/api/modules/user-management.js';

export default {
  name: '',
  components: {},
  data() {
    return {
      row: {},
      isVisible: false,
      roleList: [],
      checkedList: [],
    };
  },
  methods: {
    // 弹框显示
    openDialog(row) {
      this.row = row;
      // this.checkedList = row.roleIds;
      this.getRoleList(row.id);
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.checkedList = [];
      this.roleList = [];
    },
    // 保存事件
    onSave() {
      saveRole(this.row, this.checkedList).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 3);
          this.closeDialog();
          // 查询数据
          this.$emit('refreshList');
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
    // 获取角色列表
    getRoleList(id) {
      getRole(id).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.roleList = response.data.data;
          this.roleList.forEach((el) => {
            if (el.hasSetting) {
              this.checkedList.push(el.id);
            }
          });
        } else {
          this.$message.warning(response.data.msg, 3);
        }
      });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
</style>
