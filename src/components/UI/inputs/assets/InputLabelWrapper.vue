<template>
  <div
    class="input_container"
    :class="{
      valid: isValid,
      invalid: !isValid && isValid != null,
      disabled: input.disabled,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "inputLabelWrapper",
  props: {
    input: Object,
    isValid: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.input_container {
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>