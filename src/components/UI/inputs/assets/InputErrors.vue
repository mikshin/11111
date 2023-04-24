<template>
  <ul class="input-errors" v-if="errors.length">
    <li class="input-errors__item" v-for="(error, i) in errors" :key="i">
      {{ error }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "inputErrors",
  props: {
    errors: Array,
  },
};
</script>

<style lang="scss" scoped>
.input-errors {
  display: flex;
  flex-direction: column;
  order: 10;

  &__item {
    margin-top: var(--v-rhythm-1);

    color: var(--red900);
    @extend .caption-2;
  }
}
</style>