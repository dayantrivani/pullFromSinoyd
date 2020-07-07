// 埋点系统，统计指令

const props = {
  type: 'type', // 类型
  desc: 'desc', // 描述
};

export default {
  bind(el, binding) {
    el.addEventListener('click', () => {
      const data = binding.value;
      const prefix = 'store';
      const info = {
        type: `${prefix}_${data[props.type]}`,
        desc: data[props.desc] || '',
        time: new Date().getTime(),
      };
      // 待发送数据信息
      // eslint-disable-next-line
      console.log(info);
    }, false);
  },
};
