// elementUI按需引入
import Vue from 'vue';
import {
  Pagination,
  Dialog,
  DropdownItem,
  Submenu,
  Scrollbar,
  MenuItemGroup,
  InputNumber,
  CheckboxGroup,
  Select,
  OptionGroup,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Card,
  Transfer,
  Loading,
  Message,
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(DropdownItem);
Vue.use(Submenu);
Vue.use(Scrollbar);
Vue.use(MenuItemGroup);
Vue.use(InputNumber);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(OptionGroup);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Card);
Vue.use(Transfer);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 2000 };
