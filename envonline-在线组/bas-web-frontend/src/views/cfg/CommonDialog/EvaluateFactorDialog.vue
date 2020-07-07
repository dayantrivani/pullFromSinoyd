<!-- 因子配置 - 配置评价标准 -->
<template>
  <dialog-modal title="因子配置" ref="dialog" @close="onCloseDialog">
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fa fa-save" @click="onSendSave()">保 存</el-button>
      <el-button icon="fa fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </div>
    <el-transfer
      style="height: 400px"
      filterable
      filter-placeholder="请输入因子名称"
      v-model="itemModel"
      :data="itemList"
      :titles="['未选因子', '已选因子']"
      :props="{ key: 'id', label: 'factorName' }"
      :filter-method="(query, item) => item.factorName.indexOf(query) > -1">
    </el-transfer>
    <div class="pad-b-xs"></div>
  </dialog-modal>
</template>

<script>
export default {
  name: 'EvaluateFactorDialog',
  data() {
    return {
      parent: '',                   // 父组件传递编辑对象
      url: 'bas/evaluationFactor',  // API接口 URL
      loading: false,               // 表格数据加载状态
      itemList: [],                 // 等级配置列表(待选项 + 已选项) item
      itemModel: [],                // 等级配置表单(已选项，未排除初始项) key
      initSelected: [],             // 初始状态下右侧 key 数组
    };
  },
  computed: {
    // 待新增的因子项(补集)
    waitCreate() {
      const arrKey = this.arrayDifference(this.itemModel, this.initSelected);
      const arrkey2 = arrKey.map(val => (this.itemList.find(v => v.id === val)));
      return arrkey2.map((e) => {
        e.evaluationId = this.parent.id;
        e.factorId = e.id;
        delete e.id;
        return e;
      });
    },
    // 待删除的因子项(差集)
    waitRemove() {
      return this.arrayDifference(this.initSelected, this.itemModel);
    },
  },
  methods: {
    // 显示组件
    openDialog(row) {
      this.parent = row;
      this.$refs.dialog.openDialog();
      this.getItemList();
    },
    onCloseDialog() {
      this.$emit('change');
    },
    // 上传选项
    onSendSave() {
      // 新增因子项
      this.waitCreate.forEach((element) => {
        this.onCreateItem(element);
      });
      // 删除因子项
      if (this.waitRemove.length) {
        this.onDeleteItem();
      }
      this.onCloseDialog();
      this.$refs.dialog.closeDialog();
    },
    // 返回数组差集
    arrayDifference(arr1, arr2) {
      const a = new Set(arr1);
      const b = new Set(arr2);
      return Array.from(new Set([...a].filter(x => !b.has(x))));
    },
    // 获取数据项
    getItemList() {
      // 已选因子
      const pick = this.$http.get(this.url, {
        params: {
          rows: 1000000,
          evaluationId: this.parent.id,
        },
      });
      // 未选因子
      const pickNot = this.$http.get(`${this.url}/notIn`, {
        params: {
          factorType: this.parent.evaluationType,
          evaluationId: this.parent.id,
        },
      });
      this.$http.all([pick, pickNot]).then((response) => {
        if (response[0].data.success && response[1].data.success) {
          this.itemModel = response[0].data.data.map(val => val.id);
          this.initSelected = [...this.itemModel];
          this.itemList = [
            ...response[0].data.data,
            ...response[1].data.data,
          ];
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    // 新增数据
    onCreateItem(row) {
      this.$http.post(this.url, row).then((response) => {
        if (response.data.success) {
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    // 删除数据
    onDeleteItem() {
      this.$http.delete(this.url, { data: this.waitRemove })
        .then((response) => {
          if (response.data.success) {
            this.getItemList();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        });
    },
  },
};
</script>

<style scoped>
  .transferHeight{
    height: 55vh;
  }
</style>
