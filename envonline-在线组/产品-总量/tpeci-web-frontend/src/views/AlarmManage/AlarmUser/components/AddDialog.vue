<template>
  <dialog-modal
    ref="dialog"
    title="人员发送配置"
    :before-close="beforeClose"
    maxScrollbar
  >
    <div class="title-info mar-b-xs">基本信息</div>
    <el-form :rules="rules" :model="formItem" ref="form" label-width="100px" class="item-space">
      <el-form-item label="系统用户：" prop="isSystemUser">
        <el-switch v-model="formItem.isSystemUser" @change="onChangeSys"></el-switch>
      </el-form-item>
      <el-form-item label="组织架构：" prop="orgId">
        <el-select
          v-model="formItem.orgId"
          @change="onChangeOrg"
          style="width: 100%">
          <el-option
            v-for="(item, index) in orgTypeList" :key="index"
            :label="item.orgName"
            :value="item.rowGuid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：" prop="userId" v-if="formItem.isSystemUser">
        <el-select
          v-model="formItem.userId"
          @change="onChangeUser"
          style="width: 100%">
          <el-option
            v-for="(item, index) in userList" :key="index"
            :label="item.userName"
            :value="item.rowGuid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名：" prop="userName" v-else>
        <el-input v-model="formItem.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="telephone">
        <el-input v-model="formItem.telephone"></el-input>
      </el-form-item>
      <el-form-item label="发送方案：" prop="alarmSendConfigs">
        <el-select
          multiple
          v-model="alarmSendConfigs"
          style="width: 100%"
          @blur="$refs.form.validateField('alarmSendConfigs')">
          <el-option
            v-for="(item, index) in alarmSendConfigList" :key="index"
            :label="item.configName"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="formItem.email"></el-input>
      </el-form-item>
      <el-form-item label="职位：" prop="headShip">
        <el-input v-model="formItem.headShip"></el-input>
      </el-form-item>
    </el-form>
    <div class="title-info mar-b-xs">相关站点</div>
    <el-form inline :model="queryPortForm" class="mar-t-xs mar-l-xs fn-no-wrap">
      <el-form-item label="站点类型：">
        <select-tree-mod ref="selectTreeMod" @getTreeData="getTreeData" :options="options"></select-tree-mod>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model="queryPortForm.key" placeholder="请输入站点名称、MN号" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="getPortInfo">查 询</el-button>
      </el-form-item>
    </el-form>
    <el-tree
      v-loading="treeLoading"
      ref="tree"
      :data="treeData"
      highlight-current
      show-checkbox
      :render-after-expand="false"
      :expand-on-click-node="false"
      :default-expand-all="false"
      :render-content="renderContent">
    </el-tree>
    <div slot="footer">
      <el-button type="primary" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
      <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapState } from 'vuex';
import SelectTreeMod from '@/components/select-tree-mod';

export default {
  name: 'AddDialog',
  components: { SelectTreeMod },
  data() {
    const validateTel = (rule, value, callback) => {
      if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      formItem: {
        isSystemUser: true,
        orgId: '',
        telephone: '',
        userId: '',
        userName: '',
        alarmSendConfigs: [],
      },
      alarmSendConfigs: [], // 发送方案rowGuid数组集合
      // 相关站点
      treeLoading: false, // 树加载动画
      queryPortForm: {
        currentUserId: '', // 父级userId
        key: '',
        portTypes: [],
      },
      keys: ['regionName', 'psName', 'portTypeName', 'portName'],
      treeMap: [], // 排口树菜单（按类型，组成Map的格式）
      rules: {
        isSystemUser: [
          { required: true, message: '请选择系统用户', trigger: 'blur' },
        ],
        orgId: [
          { required: true, message: '请选择组织架构', trigger: 'change' },
        ],
        userId: [
          { required: true, message: '请选择用户姓名', trigger: 'change' },
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
        ],
        telephone: [
          { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] },
        ],
        alarmSendConfigs: [
          { required: true, message: '请选择发送方案', trigger: 'change' },
        ],
      },
    };
  },
  watch: {
    alarmSendConfigs(value) {
      this.formItem.alarmSendConfigs = this.alarmSendConfigList.filter(n => value.includes(n.id));
    },
  },
  computed: {
    ...mapState({
      alarmSendConfigList: state => state.sample.alarmSendConfigList, // 发送方案下拉菜单
      orgTypeList: state => state.sample.orgTypeList, // 组织架构下拉菜单
      userList: state => state.sample.userList, // 人员数据下拉菜单
      options: state => state.sample.portTypeList, // 样品类型多选树菜单
    }),
    treeData() {
      let treeData = [];
      if (this.options.length !== 0 && this.treeMap.length !== 0) {
        treeData = this.getTreeList(this.treeMap);
      } else {
        treeData = [];
      }
      return treeData;
    },
  },
  methods: {
    openDialog() { // 打开弹窗
      if (this.orgTypeList.length === 0) {
        this.getOrgTypeList(); // 获取组织架构列表
      }
      this.getAlarmSendConfigList(); // 获取发送方案列表数据
      if (this.options.length === 0) { // 样品类型是否获取成功
        this.getPortTypeList();
      } else {
        this.$refs.dialog.openDialog();
        this.$nextTick(() => {
          this.$refs.selectTreeMod.generateTreeData(this.options);
        });
      }
      if (!this.formItem.isSystemUser) {
        this.getPortInfo(); // 获取点位树列表
      }
      this.$store.commit('sample/setUserList', []); // 清空人员列表下拉框
      this.$refs.dialog.openDialog();
    },
    beforeClose() { // 关闭弹窗
      this.formItem.alarmSendConfigs = [];
      this.alarmSendConfigs = [];
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 基础信息交互方法
    onChangeSys(isSys) { // 改变是否系统用户
      if (!isSys) {
        this.queryPortForm.currentUserId = ''; // 根据角色查询排口树条件
        this.formItem.orgId = '';
        this.formItem.userId = '';
        this.formItem.userName = '';
        this.formItem.telephone = '';
        this.formItem.email = '';
        this.$refs.form.resetFields();
        this.formItem.isSystemUser = false;
        this.getPortInfo();
      } else if (!this.formItem.userId) {
        this.treeMap = [];
      }
    },
    onChangeOrg(rowGuid) { // 改变组织架构的值
      const orgType = this.orgTypeList.filter(n => n.rowGuid === rowGuid);
      this.formItem.userId = '';
      this.formItem.orgName = orgType[0].orgName;
      this.formItem.orgId = orgType[0].rowGuid;
      this.getUserList(rowGuid);
    },
    onChangeUser(rowGuid) { // 改变用户的值
      const user = this.userList.filter(n => n.rowGuid === rowGuid);
      this.formItem.userName = user[0].userName;
      this.formItem.telephone = user[0].telephone;
      this.formItem.email = user[0].email;
      this.queryPortForm.currentUserId = user[0].rowGuid;
      this.getPortInfo();
    },
    getOrgTypeList() { // 获取组织架构数据
      this.$http.get('sys/org?orgTypeCodes=hb').then((response) => {
        if (response.data.success) {
          const data = response.data.rows || response.data.data || response.data;
          this.$store.commit('sample/setOrgTypeList', data);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getUserList(id) { // 获取人员列表数据
      this.$http.get(`sys/user/guid/${id}`).then((response) => {
        const data = response.data.rows || response.data.data || response.data;
        this.$store.commit('sample/setUserList', data);
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getAlarmSendConfigList() { // 获取发送方案列表数据
      this.$http.get('alarm/alarmSendConfig?page=1&rows=1000000').then((response) => {
        if (response.data.success) {
          const data = response.data.rows || response.data.data || response.data;
          this.$store.commit('sample/setAlarmSendConfigList', data);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    onSaveItem() { // 点击保存
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const selectNodes = this.$refs.tree.getCheckedNodes(true);
        const body = selectNodes.map(n => ({
          psId: n.psId,
          psName: n.psName,
          dgiMn: n.dgiMn,
          regionName: n.regionName,
          regionCodeId: n.regionCodeId,
          portName: n.portName,
          portId: n.id,
        }));
        this.formItem.alarmUserPorts = body;
        this.$http.post('alarm/alarmUserInfo', {
          ...this.formItem,
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
            this.beforeClose();
            this.$emit('onQueryList');
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          this.$hp.resp(response);
        });
      });
    },
    // 相关站点基础方法
    getPortTypeList() {
      this.$http.post('sys/enumCode/?codeValue=PortType', {
        portTypes: [[1, [1, 2]], [2, [2, 3]]],
        status: 1,
        key: '',
      }).then((response) => {
        const data = response.data.rows || response.data.data || response.data;
        this.$store.commit('sample/setPortTypeList', data);
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getPortInfo() {
      this.treeLoading = true;
      this.$http.post('bas/portInfo/queryAuthority/', this.queryPortForm, {
        params: {
          page: 1,
          rows: 100000,
          sort: 'regionCodeId+,psName+,portType+,portName',
        },
      }).then((response) => {
        this.treeMap = this.mapTreeList(response.data.data, this.keys); // 按企业
        // this.treeData = this.getTreeList(map);
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.treeLoading = false;
      });
    },
    getTreeData(val) { // 类型下拉框选择事件
      this.queryPortForm.portTypes = val || [];
    },
    mapTreeList(arr, keys) { // 将接口数据按keys汇总成map对象
      // arr--传入数组 keys--根据哪个key汇总的key数组
      const map = new Map();
      const key = keys[0];
      arr.forEach((element) => {
        map.set(element[key], []);
      });
      arr.forEach((element) => {
        map.get(element[key]).push(element);
      });
      map.forEach((element, index) => {
        if (keys[1] !== keys[keys.length - 1]) {
          // console.log(element, index, keys.slice(1), key);
          map.set(index, this.mapTreeList(element, keys.slice(1)));
        }
      });
      return map;
    },
    getTreeList(map) { // 将map对象按层级组成{ label, children }格式
      const treeData = [];
      map.forEach((element, index) => {
        if (element.size) {
          treeData.push({
            label: index,
            children: this.getTreeList(element),
          });
        } else {
          treeData.push({
            label: index,
            children: element.map((n) => {
              // this.$set(n, 'label', `${n.portName}(MN：${n.dgiMn})(${this.getDictName(n.portType, n.childPortType)})`);
              this.$set(n, 'label', `${n.portName}(MN：${n.dgiMn})`);
              return n;
            }),
          });
        }
      });
      return treeData;
    },
    getDictName(parentId, childId) {
      let dictName = '';
      // eslint-disable-next-line
      const parent = this.options.filter(n => (n.dictValue == parentId) && (n.parentId == 0));
      if (childId && childId !== '') {
        const children = this.options.filter(n => n.parentId === parent[0].rowGuid);
        // eslint-disable-next-line
        const child = children.filter(n => n.dictValue == childId);
        dictName = child[0].dictName || '';
      } else {
        dictName = parent[0].dictName || '';
      }
      return dictName;
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
  .dialog-scoller {
    >.el-dialog {
      >.el-dialog__body {
        overflow: auto;
      }
    }
  }
</style>
