<template>
  <div>
    <a-tree-select
      v-if="!isValidation"
      style="width: 150px"
      ref="tree"
      placeholder="请选择"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      :replaceFields="{title: 'name', key: 'id', children: 'children'}"
      :loadData="LoadData"
      allowClear
      @change="changeArea"
      :treeData="areaData">
    </a-tree-select>
    <a-form :form="form" v-if="isValidation">
      <a-form-item label="区域：" :labelCol="{span: col.labelCol}" :wrapperCol="{span:col.wrapperCol}">
        <a-tree-select
          ref="tree"
          placeholder="请选择区域"
          :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
          :replaceFields="{title: 'name', key: 'id', children: 'children'}"
          :loadData="LoadData"
          @change="changeArea"
          :treeData="areaData"
          v-decorator="['districtId', {
            rules: [
              {required: true, message: '请选择区域！'},
            ],
            initialValue: reginLabel
          }]">
        </a-tree-select>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getArea } from '@/api/modules/enter-management';

export default {
  name: 'Regiona',
  props: {
    // 最大level
    maxLevel: {
      required: false,
      type: [String, Number],
      default: 4,
    },
    // 默认label
    reginLabel: {
      required: false,
      type: String,
      default: '',
    },
    col: {
      required: false,
      type: Object,
      default: () => ({
        labelCol: 6,
        wrapperCol: 18,
      }),
    },
    // 是否验证
    isValidation: {
      required: false,
      type: Boolean,
      default: false,
    },
    // 检索参数
    queryForm: {
      required: false,
      type: Object,
      default: () => ({
        districtId: '',
        cityId: '',
        provinceId: '',
        townId: '',
      }),
    },
    // 表单验证参数
    valiForm: {
      required: false,
      type: Object,
      default: () => ({
        provinceId: '',
        cityId: '',
        districtId: '',
        townId: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        townName: '',
      }),
    },
  },
  created() {
    if (this.isValidation) {
      this.form = this.$form.createForm(this);
    }
    this.GetArea(0).then((res) => {
      this.areaData = res;
    });
  },
  data() {
    return {
      form: {},
      areaData: [],
    };
  },
  methods: {
    // 重置表单
    reset() {
      this.form.resetFields();
    },
    // 获取区域数据
    GetArea(id) {
      return new Promise((resolve) => {
        getArea(id).then((res) => {
          const data = res.data.data.map((val) => {
            const obj = val;
            this.$set(obj, 'title', obj.name);
            this.$set(obj, 'value', obj.code);
            this.$set(obj, 'key', obj.id);
            this.$set(obj, 'children', []);
            this.$set(obj, 'level', 1);
            if (this.isValidation) {
              this.$set(obj, 'disabled', true);
            }
            return obj;
          });
          resolve(data);
        });
      });
    },
    // 异步加载数据
    LoadData(node) {
      return new Promise((resolve) => {
        const data = node.$vnode.data.props.dataRef;
        if (data.children.length) {
          resolve();
          return;
        }
        this.GetArea(data.id).then((res) => {
          const arr = res.map((val) => {
            const obj = val;
            obj.level = node.$vnode.data.props.dataRef.level + 1;
            if (obj.level === this.maxLevel) {
              obj.isLeaf = true;
            }
            if (this.isValidation) {
              obj.disabled = obj.level !== 4;
            }
            return obj;
          });
          data.children = arr;
          resolve();
        });
      });
    },
    changeArea(value, label, extra) {
      // 不需验证表单时
      if (!this.isValidation) {
        // 清空表单
        Object.keys(this.queryForm).forEach((val) => {
          this.queryForm[val] = '';
        });
        if (extra.triggerNode) {
          if (extra.triggerNode.dataRef.level === 1) {
            this.queryForm.provinceId = value;
          } else if (extra.triggerNode.dataRef.level === 2) {
            this.queryForm.cityId = value;
          } else if (extra.triggerNode.dataRef.level === 3) {
            this.queryForm.districtId = value;
          } else if (extra.triggerNode.dataRef.level === 4) {
            this.queryForm.townId = value;
          }
        }
        this.$emit('changeData', this.queryForm);
      } else {
        // 验证表单时
        // 清空表单
        Object.keys(this.valiForm).forEach((val) => {
          this.valiForm[val] = '';
        });
        if (extra.triggerNode) {
          // if (extra.triggerNode.dataRef.level === 4) {
          // this.valiForm.provinceId = extra.triggerNode.$parent.$parent.$parent.dataRef.id;
          // this.valiForm.cityId = extra.triggerNode.$parent.$parent.dataRef.id;
          // this.valiForm.districtId = extra.triggerNode.$parent.dataRef.id;
          this.valiForm.townId = String(extra.triggerNode.dataRef.id);
          // this.valiForm.provinceName = extra.triggerNode.$parent.$parent.$parent.dataRef.name;
          // this.valiForm.cityName = extra.triggerNode.$parent.$parent.dataRef.name;
          // this.valiForm.districtName = extra.triggerNode.$parent.dataRef.name;
          // this.valiForm.townName = extra.triggerNode.dataRef.name;
          // }
        }
        this.$emit('changeData', this.valiForm);
      }
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
