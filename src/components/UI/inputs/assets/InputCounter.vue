<template>
  <span class="counter" v-if="maxLength"
    >{{ inputLength }}/{{ maxLength }}</span
  >
</template>

<script>
export default {
  props: {
    maxLength: Number,
    newValue: [String, Number],
  },
  computed: {
    inputLength() {
      if (typeof this.newValue == "number") {
        return this.newValue;
      } else if (this.newValue) {
        return this.newValue.length;
      }

      return 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.counter {
  @extend .caption-2;
  color: var(--gray500);
  order: 10;
  text-align: right;
  display: block;
}
</style>