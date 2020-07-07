import { addListener, removeListener } from 'resize-detector';
import { getElemAttrVal } from '@/libs/tools';

const vDrap = {
  bind(el) {
    const [cardHead, cardBody] = el.children;
    cardHead.style.height = 'auto';
    cardHead.style.overflow = 'visible';
    cardHead.style.whiteSpace = 'normal';
    const resize = () => {
      cardBody.style.height = `calc(100% - ${getElemAttrVal(cardHead, 'height', false)})`;
    };
    addListener(cardHead, resize);
  },
  unbind(el) {
    const [cardHead, cardBody] = el.children;
    const resize = () => {
      cardBody.style.height = `calc(100% - ${getElemAttrVal(cardHead, 'height', false)})`;
    };
    removeListener(cardHead, resize);
  },
};

export default vDrap;
