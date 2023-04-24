<template>
  <section class="ui-kit-section">
    <div class="ui-kit-section__title"><b>Название:</b> {{ title }}</div>
    <div class="ui-kit-section__description">
      <b>Описание:</b> {{ description }}
    </div>
    <div class="ui-kit-section__content" :class="classMidif">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: "UiKitSection",
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    contentModif: {
      type: String,
      required: false,
    },
  },
  computed: {
    classMidif() {
      return this.contentModif
        ? `ui-kit-section__content--${this.contentModif}`
        : null;
    },
  },
};
</script>

<style scoped lang="scss">
.ui-kit-section {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-2);

  &:not(:last-child) {
    padding-bottom: var(--v-rhythm-2);
    border-bottom: 1px solid var(--gray900);
  }

  &__title {
  }

  &__description {
  }

  &__content {
    padding: var(--v-rhythm-4) 0;

    &--col {
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: var(--v-rhythm-4);
    }
  }
}
</style>
