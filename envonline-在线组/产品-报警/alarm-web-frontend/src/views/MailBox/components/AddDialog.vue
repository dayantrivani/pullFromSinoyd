<template>
  <dialog-modal ref="dialog" title="写信息" :before-close="beforeClose">
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-xs fn-no-wrap">
      <el-form-item>
        <el-input
          clearable
          v-model="queryForm.userName"
          placeholder="请输入姓名">
          <!-- @keyup.enter.native="onAddItem"> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          v-model="queryForm.telephone"
          placeholder="请输入手机号">
          <!-- @keyup.enter.native="onAddItem"> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-plus" @click="onAddItem">添 加</el-button>
        <el-button type="primary" icon="fas fa-plus" @click="onChooseItem">选 择</el-button>
        <el-button type="primary" icon="fas fa-paper-plane" @click="onSend">发 送</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      height="calc(100% - 113px)"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" width="37" label="#">
        <template slot-scope="scope">
          <i class="fas fa-trash-alt" style="color: #f56c6c;cursor: pointer;" @click="onDelItem(scope.$index)"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
      <el-table-column property="userName" label="姓名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="telephone" label="手机号" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-form ref="form" :model="textareaForm" :rules="rules" class="pad-y-sm">
      <el-form-item prop="sendContent" label="短信内容：">
        <el-input
          type="textarea"
          rows="4"
          v-model="textareaForm.sendContent"
          placeholder="请输入短信内容（小于70个字符）"></el-input>
      </el-form-item>
    </el-form>
    <dialog-modal ref="chooseDialog" title="选择" size="mini" appendToBody>
      <el-form inline :model="userForm" class="mar-t-xs mar-l-xs fn-no-wrap">
        <el-form-item label="用户姓名：">
          <el-input
            clearable
            v-model="userForm.userName"
            placeholder="请输入姓名">
            <!-- @keyup.enter.native="onQueryList"> -->
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="onSaveUserItem" icon="fas fa-save">保 存</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        style="max-height: 55vh;overflow: auto;"
        v-loading="treeLoading"
        ref="tree"
        :data="treeData"
        class="pad-b-sm"
        highlight-current
        node-key="id"
        show-checkbox
        :render-after-expand="false"
        :expand-on-click-node="false"
        :default-expand-all="false"
        :render-content="renderContent">
      </el-tree>
    </dialog-modal>
  </dialog-modal>
</template>

<script>
export default {
  name: 'AddDialog',
  data() {
    return {
      loading: false,
      queryForm: {
        userName: '',
        telephone: '',
      },
      addItemList: [], // 添加人员列表
      chooseItemList: [], // 选择人员列表
      textareaForm: {
        sendContent: '', // 发送内容
      },
      selectedIds: [],
      treeLoading: false,
      userForm: {
        userName: '',
      },
      keys: ['orgName', 'userName'],
      treeData: [], // 人员信息树菜单（按组织）
      rules: {
        sendContent: [
          { required: true, message: '请输入短信内容', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    itemList() {
      return this.addItemList.concat(this.chooseItemList);
    },
    // textareaForm() {
    //   return { sendContent: this.sendContent };
    // },
  },
  methods: {
    openDialog() { // 打开弹窗
      this.$refs.dialog.openDialog();
    },
    beforeClose() {
      this.addItemList = [];
      this.chooseItemList = [];
      this.textareaForm.sendContent = '';
      this.$refs.dialog.closeDialog();
    },
    // 页面基本方法
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.telephone) ? className : '';
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.telephone);
    },
    onAddItem() {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      const test = this.addItemList.filter(n => n.telephone === this.queryForm.telephone); // 是否有重复
      if (this.queryForm.telephone === '' || this.queryForm.userName === '') {
        this.$message({
          type: 'warning',
          message: '请将信息输入完整',
          duration: 3000,
          showClose: true,
        });
      } else if (reg.test(this.queryForm.telephone) && test.length === 0) {
        this.addItemList.push({ ...this.queryForm });
        this.queryForm = { userName: '', telephone: '' };
      } else if (test.length !== 0) {
        this.$message({
          type: 'warning',
          message: '输入手机号重复',
          duration: 3000,
          showClose: true,
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请输入合适的手机号',
          duration: 3000,
          showClose: true,
        });
      }
    },
    onChooseItem() {
      this.$refs.chooseDialog.openDialog();
      if (this.treeData.length === 0) {
        this.getUserInfoList();
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.chooseItemList);
      });
    },
    onDelItem(index) {
      this.itemList.splice(index, 1);
    },
    onSend() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const body = this.itemList.map(n => ({
          userName: n.userName,
          telephone: n.telephone,
          sendContent: this.textareaForm.sendContent,
        }));
        this.$http.post('alarm/sendRecord', body).then((response) => {
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
    onQueryList() { // 查询人员数据
      this.getUserInfoList();
    },
    onSaveUserItem() { // 保存选择人员信息
      const selectNodes = this.$refs.tree.getCheckedNodes(true);
      this.chooseItemList = [...selectNodes];
      this.$refs.chooseDialog.closeDialog();
    },
    getUserInfoList() { // 获取人员信息树数据
      this.treeLoading = true;
      this.$http.get('alarm/alarmUserInfo?page=1&rows=1000000', {
        params: {
          ...this.userForm,
        },
      }).then((response) => {
        const map = this.mapTreeList(response.data.data, this.keys);
        this.treeData = this.getTreeList(map);
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.treeLoading = false;
      });
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
              this.$set(n, 'label', n.userName);
              return n;
            }),
          });
        }
      });
      return treeData;
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

<style lang="scss">
</style>
