// eslint-disable-next-line
import 'mavon-editor/dist/css/index.css';
import './style.scss';

const mavonEditor = require('mavon-editor');

export default {
  name: 'Markdown',
  components: {
    'MavonEditor': mavonEditor.mavonEditor,
  },
  props: {
    value: String,
    // true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏)
    subfield: {
      type: Boolean,
      default: true,
    },
    // 工具栏是否显示
    toolbarsFlag: {
      type: Boolean,
      default: false,
    },
    // edit： 默认展示编辑区域 ， preview： 默认展示预览区域 , 其他 = edit
    defaultOpen: {
      type: String,
      default: 'preview',
    },
  },
  watch: {
    value() {
      // 触发事件改变父组件绑定的 v-model 值
      this.$emit('input', this.value);
    },
  },
  render() {
    return (
      <mavon-editor
        class="mod-markdown"
        v-model={this.value}
        subfield={this.subfield}
        toolbarsFlag={this.toolbarsFlag}
        defaultOpen={this.defaultOpen}
        boxShadow={false}
      ></mavon-editor>
    );
  },
};
