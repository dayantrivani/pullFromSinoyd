// import tinymce from 'tinymce/tinymce.min.js';

// import 'tinymce/themes/modern/theme';
// import 'tinymce/plugins/image';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/lists';
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/contextmenu';
// import 'tinymce/plugins/wordcount';
// import 'tinymce/plugins/colorpicker';
// import 'tinymce/plugins/textcolor';
// import 'tinymce/plugins/fullscreen';
// import 'tinymce/plugins/emoticons';
// import 'tinymce/plugins/hr';
// import 'tinymce/plugins/preview';

import { plugins, toolbar, language } from './config';

import './style.scss';

export default {
  name: 'TinyEditor',
  props: {
    value: String,
  },
  data() {
    return {
      // tinymce for Id
      tinymceId: 'tinymce-editor',
    };
  },
  mounted() {
    // 动态载入插件
    // 本地引入 `${window.location.pathname}lib/tinymce/tinymce.min.js`
    this.$tools.asyncLoadPlugin('tinymce', { src: 'https://unpkg.com/tinymce@4.9.5/tinymce.min.js' })
      .then(() => {
        // 初始化插件
        this.initEditor();
      });
    // this.initEditor();
  },
  // 组件激活时调用
  activated() {
    this.initEditor();
  },
  // 组件停用时调用
  deactivated() {
    this.removeEditer();
  },
  methods: {
    // 初始化插件
    initEditor() {
      if (window.tinymce) {
        // 加载指定加载项的语言包
        window.tinymce.PluginManager.requireLangPack('lang', 'zh_CN');
        // 添加语言包
        window.tinymce.addI18n('zh_CN', language);
        // 初始化插件
        window.tinymce.init({
          selector: `#${this.tinymceId}`,  // 替换的文本域元素ID
          auto_focus: this.tinymceId,      // 自动聚焦（id）
          plugins,
          toolbar,
          min_height: 350,
          skin_url: false,
          setup: (editor) => {
            // 触发事件改变父组件绑定的 v-model 值
            editor.on('input', () => {
              this.$emit('input', editor.getContent());
            });
          },
          // 初始化数据传递
          init_instance_callback: (editor) => {
            // 在插入位置插入内容,顺便吧光标会被移至右侧
            editor.setContent('');
            editor.insertContent(this.value);
          },
        });
      }
    },
    // 销毁插件
    removeEditer() {
      if (window.tinymce) {
        window.tinymce.remove();
      }
    },
  },
  render() {
    return (
      <textarea class="mod-editor" id={this.tinymceId}></textarea>
    );
  },
};
