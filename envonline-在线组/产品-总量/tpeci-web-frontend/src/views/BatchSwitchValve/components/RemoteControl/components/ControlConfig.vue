<template>
  <el-row :gutter="$config.space" class="fill-h" v-loading="loading">
    <el-col :span="24" :h="6">
      <el-card type="title">
        <!-- 头部标题 -->
        <template slot="header">控制命令</template>
        <el-radio-group v-model="queryForm.cn" class="mar-l-sm mar-t-sm">
          <el-row>
            <el-col
              :span="24"
              class="mar-b-sm"
              v-for="(item, index) in $enum.get('REMOTE_PROYOCOL', active).common"
              :key="index"
            >
              <el-radio :label="index">{{item}}</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-card>
    </el-col>
    <el-col :span="24" :h="6" class="mar-t-xs">
      <el-card type="title">
        <!-- 头部标题 -->
        <template slot="header">命令设置</template>
        <div class="mar-t-xs mar-l-sm">
          <el-button type="success" icon="fas fa-clipboard-check" @click="onSendOder">发送命令</el-button>
        </div>
        <div v-show="queryForm.cn === '3810'" class="mar-t-sm mar-l-sm">
          <div>远程开阀</div>
          <div class="mar-t-xs">远程开阀命令</div>
        </div>
        <div v-show="queryForm.cn === '3811'" class="mar-t-sm mar-l-sm">
          <div>远程关阀</div>
          <div class="mar-t-xs">远程关阀命令</div>
        </div>
        <div v-show="queryForm.cn === '3812'" class="mar-t-sm mar-l-sm">
          <div>解除阀门控制</div>
          <div class="mar-t-xs">解除阀门控制命令</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'ControlConfig',
  props: ['portId'],
  data() {
    return {
      loading: false,
      queryForm: {
        portIds: [],
        cn: '3810',
      },
      active: 'valve', // 命令类型
    };
  },
  created() {
    this.queryForm.portIds = [this.portId];
  },
  methods: {
    /* 请求接口 */
    onSendOder() {             // 发送命令
      this.queryForm.portIds = [this.portId];
      this.$http.post('tpeci/batchSwitchValve/execute', { ...this.queryForm }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$emit('onQuerylist', response);
          this.$message.success({
            message: '发送成功',
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
