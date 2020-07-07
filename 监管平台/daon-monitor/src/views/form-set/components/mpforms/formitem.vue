<script>
import MpFormComponent from './form-component';
import MpFormTable from './form-table';

export default {
  components: {
    MpFormComponent,
    MpFormTable,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    currentItem: {
      type: Object,
      default: () => ({}),
    },
    movingItem: {
      type: Object,
      default: () => ({}),
    },
    onRemoveFormitem: {
      type: Function,
      default: null,
    },
    onEnterFormitem: {
      type: Function,
      default: null,
    },
    onStartFormitem: {
      type: Function,
      default: null,
    },
    onAnyDragend: {
      type: Function,
      default: null,
    },
    onActiveFormitem: {
      type: Function,
      default: null,
    },
    onEnterFormarea: {
      type: Function,
      default: null,
    },
    onLeaveFormarea: {
      type: Function,
      default: null,
    },
  },
  render(createElement) {
    if (this.item.type === '_mark') {
      return createElement('div', {
        attrs: {
          class: 'dragging-mark',
        },
      });
    }
    return createElement(this.item.type === 'table' ? 'MpFormTable' : 'MpFormComponent', {
      props: {
        item: this.item,
        currentItem: this.currentItem,
        movingItem: this.movingItem,
      },
      on: this.readonly ? {} : {
        'formitem:remove': this.onRemoveFormitem,
        'formitem:enter': this.onEnterFormitem,
        'formitem:start': this.onStartFormitem,
        'formitem:end': this.onAnyDragend,
        'formitem:click': this.onActiveFormitem,
        'formarea:enter': this.onEnterFormarea,
        'formarea:leave': this.onLeaveFormarea,
      },
    });
  },
};
</script>
