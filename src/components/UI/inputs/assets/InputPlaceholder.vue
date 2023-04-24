<template>
  <span class="placeholder" v-bind:class="{ required: input.required }">{{
    input.placeholder
  }}</span>
</template>

<script>
export default {
  name: "inputPlaceholder",
  props: {
    input: Object,
  },
};
</script>

<style lang="scss" scoped>
.placeholder {
  transition: 0.3s top ease, 0.3s font-size ease;
  pointer-events: none;
  color: var(--gray500);
  padding-left: 24px;
  padding-right: 10px;
  position: absolute;
  white-space: nowrap;
  max-width: calc(100% - 30px);
  overflow: hidden;
  text-overflow: ellipsis;
  top: 16px;
  @extend .body-2;

  &.required {
    &:after {
      content: "*";
      color: var(--red900);
    }
  }
}
</style>