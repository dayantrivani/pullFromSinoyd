<template>
  <a-modal
    class="dialog-users"
    width="780px"
    :visible="isVisible"
    title="用户信息"
    :footer="null"
    :maskClosable="false"
    @cancel="closeDialog"
  >
    <a-spin :spinning="spinning" tip="数据加载中">
      <a-transfer
        :dataSource="transferData"
        :listStyle="{
          width: '45%',
          height: '60vh',
        }"
        showSearch
        :titles="['用户列表', '已配置用户']"
        :targetKeys="targetKeys"
        :selectedKeys="selectedKeys"
        @change="handleChange"
        @selectChange="handleSelectChange"
        :render="item=>item.title"
      />
    </a-spin>
  </a-modal>
</template>

<script>
import {
  userQuery, getCurrentUsers, getAllUsers, removeUser, saveUser, getConfigUsers,
} from '@/api/modules/role-management.js';
import { analyzeResp, message } from '@/libs/util';

export default {
  name: '',
  data() {
    return {
      spinning: false,
      isVisible: false,
      transferData: [],
      targetKeys: [],
      selectedKeys: [],
      row: {},
      queryForm: userQuery(),
      count: 0,   // 控制加载状态
    };
  },
  methods: {
    // 弹框显示
    openDialog(row) {
      this.spinning = true;
      this.row = row;
      // this.queryForm.roleId = row.id;
      // this.getConfigedList(this.queryForm);
      // this.getUnconfigedList(this.queryForm);
      this.getData(this.row.id);
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.row = {};
      this.isVisible = false;
      this.transferData = [];
      this.targetKeys = [];
      this.selectedKeys = [];
      this.count = 0;
      this.queryForm = userQuery();
    },
    // 获取已配置的用户列表
    getConfigedList(queryForm) {
      getCurrentUsers(queryForm).then((response) => {
        if (response.data.success && response.data.code === 200) {
          const targetKeys = response.data.data;
          const tem = targetKeys.map((el) => {
            const obj = el;
            return {
              key: obj.id.toString(),
              title: obj.name,
            };
          });
          this.transferData = this.transferData.concat(tem);
          this.targetKeys = tem.map(el => el.key);
          this.count += 1;
          if (this.count === 2) {
            this.spinning = false;
          }
        } else {
          message('warning', response);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.spinning = false;
      });
    },
    // 获取未配置的用户列表
    getUnconfigedList(queryForm) {
      getAllUsers(queryForm).then((response) => {
        if (response.data.success && response.data.code === 200) {
          const allUsers = response.data.data;
          allUsers.forEach((el) => {
            this.transferData.push({
              key: el.id.toString(),
              title: el.name,
            });
          });
          this.count += 1;
          if (this.count === 2) {
            this.spinning = false;
          }
        } else {
          message('warning', response);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.spinning = false;
      });
    },
    getData(id) {
      getConfigUsers(id).then((response) => {
        if (response.data.success && response.data.code === 200) {
          const targetKeys = response.data.data.true;
          const tem = targetKeys.map((el) => {
            const obj = el;
            return {
              key: obj.id.toString(),
              title: obj.name,
            };
          });
          this.transferData = this.transferData.concat(tem);
          this.targetKeys = tem.map(el => el.key);
          const allUsers = response.data.data.false;
          allUsers.forEach((el) => {
            this.transferData.push({
              key: el.id.toString(),
              title: el.name,
            });
          });
        } else {
          message('warning', response);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.spinning = false;
      });
    },
    // 穿梭触发事件
    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys;
      const keys = moveKeys.map(el => Number(el));
      // 向右穿梭 => 新增
      if (direction === 'right') {
        saveUser(keys, this.row).then((response) => {
          if (response.data.code === 200 && response.data.success) {
            this.$message.success(response.data.msg, 1.5);
          } else {
            this.$message.warning(response.data.msg, 1.5);
          }
        });
        // 向左穿梭 => 删除
      } else if (direction === 'left') {
        removeUser(keys, this.row).then((response) => {
          if (response.data.code === 200) {
            this.$message.success('删除成功', 3);
          } else {
            this.$message.warning(response.data.message || response.data.msg, 3);
          }
        });
      }
    },
    // 选中触发事件
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    },
  },
};
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
</style>
