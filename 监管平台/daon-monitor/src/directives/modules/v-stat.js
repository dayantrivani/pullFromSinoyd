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
      // 待发送数据信息
      // eslint-disable-next-line
      console.log({ ty: `${prefix}_${data[props.type]}`, dc: data[props.desc] || '' });
    }, false);
  },
};
