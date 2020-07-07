import { Message } from 'ant-design-vue';
import { copyText } from '@/libs/util';

const vCopy = {
  bind(el, { value }) {
    el.$copyValue = value;
    const handler = () => {
      if (!el.$copyValue) {
        Message.warning('无复制内容');
        return;
      }
      if (copyText(el.$copyValue)) {
        Message.success('复制成功');
      }
    };
    el.addEventListener('click', handler);
    el.$destroyCopy = () => el.removeEventListener('click', handler);
  },

  unbind(el) {
    el.$destroyCopy();
  },

  componentUpdated(el, { value }) {
    el.$copyValue = value;
  },
};

export default vCopy;
