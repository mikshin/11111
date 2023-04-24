<template>
  <div class="input_container">
    <span class="placeholder">{{ input.placeholder }}</span>
    <Input
      v-for="(item, i) in input.checkboxValue"
      :key="i"
      :input="{
        type: 'checkbox',
        name: item.name,
        placeholder: item.placeholder,
      }"
      @onChange="change"
    />
  </div>
</template>
<script>
import Input from "../../UI/inputTemplate.vue";
export default {
  props: {
    input: Object,
  },
  components: {
    Input,
  },
  data() {
    return {
      newValue: [],
      isValid: true,
    };
  },
  methods: {
    change() {
      this.newValue = [];
      for (let child in this.$children) {
        if (this.$children[child].newValue) {
          this.newValue.push(this.$children[child].input.name);
        }
      }
      this.$emit("onChange", { data: this.newValue });
    },
  },
};
</script>

<style lang="scss" scoped>
.placeholder {
  margin-bottom: 15px;
  margin-top: 24px;
  display: block;
  @extend .caption-2;
}
</style>
