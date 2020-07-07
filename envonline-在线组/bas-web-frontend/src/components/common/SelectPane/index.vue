<!-- 窗格选择器
<select-pane
  v-model="绑定值"
  url="接口地址"
  title="标题"
  :label="显示值 || ''"
  :col-width="200"
  :col-titles="['列标题1', '列标题2']" />
-->

<template>
  <div>
    <dialog-modal
      custom-class="mod-select-pane"
      ref="dialog"
      size="large"
      :title="`选择${title}`"
      :width="`${colWidth * len}px`"
      :append-to-body="true"
      @close="onCloseDialog">
      <!-- 列标题 -->
      <div class="col-title">
        <span v-for="(item, key) in colTitles" :key="key">{{ item }}：</span>
      </div>
      <div class="col-body">
        <!-- 列容器 -->
        <div v-for="(item, depth) in colTitles" :key="depth" class="col-item">
          <ul v-loading="loadings[depth]">
            <li
              v-for="(row, k) in itemLists[depth]"
              :key="k"
              :class="{ 'is-active': row[props.label] === selecteds[depth] }"
              @click="onClickQuery(depth, row)"> {{ row[props.label] }}</li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span>{{`当前选择：${nowSelect}`}}</span>
        <el-button type="primary" icon="fas fa-save" @click="onSelected()">保 存</el-button>
        <el-button icon="fas fa-times" @click="onCloseDialog()">关 闭</el-button>
      </div>
    </dialog-modal>
    <el-tooltip effect="dark" placement="top-start" :disabled="labelModel.length < 9" :content="labelModel">
      <el-input
        ref="input"
        v-model="labelModel"
        :clearable="clearable"
        class="z-pointer"
        :size="size"
        @clear="onClearItem">
        <el-button slot="append" :size="size" @click="openDialog()">
          <i :class="'fas fa-th-list'"></i>
        </el-button>
      </el-input>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'SelectPane',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  props: {
    // v-model 传参
    value: String,
    // label
    label: String,
    // API 接口
    url: {
      type: String,
      required: true,
    },
    // 组件大小, 可选 large、small、mini
    size: {
      type: String,
      required: false,
      default: 'mini',
    },
    // 子项列宽
    colWidth: {
      type: Number,
      required: false,
      default: 170,
    },
    // 标题
    title: {
      type: String,
      required: false,
      default: '',
    },
    // 标题
    clearable: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 子项列标题
    colTitles: {
      type: Array,
      required: true,
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'dictName',
        children: 'children',
      }),
    },
  },
  computed: {
    len() {
      return this.colTitles.length;
    },
    nowSelect() {
      return this.selecteds[this.selecteds.length - 1] || '';
    },
  },
  watch: {
    value() {
      this.labelModel = this.label;
    },
  },
  data() {
    return {
      valueModel: '',        // 实际值
      labelModel: '',        // 显示值
      itemLists: [],         // 选项列表
      selecteds: [],         // 已选项
      loadings: [],          // 列加载状态
      row: {},
      selectLabel: '',       // label
    };
  },
  created() {
    this.labelModel = this.label || '';
  },
  mounted() {
    this.$refs.input.$refs.input.readOnly = true;
  },
  methods: {
    // 打开弹框
    openDialog() {
      this.$refs.dialog.openDialog();
      this.labelModel = this.label;
      this.valueModel = this.value;
      this.getItemList(0);
    },
    // 关闭弹框
    onCloseDialog() {
      this.$refs.dialog.closeDialog();
      this.itemLists = [];
      this.selecteds = [];
      this.loadings = [];
      this.selectLabel = '';
    },
    // 提交选择
    onSelected() {
      this.$emit('selected', this.valueModel);
      this.$emit('change', this.selectLabel);
      this.onCloseDialog();
    },
    // 单击查询子项
    onClickQuery(depth, row) {
      this.row = row;
      this.valueModel = this.row[this.props.value];
      this.selectLabel = this.row[this.props.label];
      if (depth > this.selecteds.length || !this.selecteds.length) {
        this.selecteds.push(row[this.props.label]);
      } else {
        this.$set(this.selecteds, depth, row[this.props.label]);
        this.selecteds = this.selecteds.slice(0, depth + 1);
      }
      this.itemLists = this.itemLists.slice(0, depth + 1);
      if (depth !== this.len - 1) {
        this.getItemList(depth + 1, row[this.props.value]);
      }
    },
    // 点击清空按钮
    onClearItem() {
      this.labelModel = '';
      this.valueModel = '';
      this.$emit('selected', this.valueModel);
      this.$emit('change', this.selectLabel);
    },
    // 获取选项数据
    getItemList(depth, rowGuid) {
      this.$set(this.loadings, depth, true);
      this.$http.get(`${this.url}/${rowGuid || '0'}`)
        .then((response) => {
          if (response.status === 200) {
            this.$set(this.itemLists, depth, response.data);
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
              showClose: true,
            });
          }
          this.$set(this.loadings, depth, false);
        });
    },
  },
};
</script>
