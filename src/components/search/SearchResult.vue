<template>
  <div class="search-result">
    <div class="search-result__title">
      {{ title }}
      <span class="search-result__title-quantity">({{ quantity }})</span>
    </div>

    <ul class="search-result__list">
      <slot></slot>
    </ul>

    <!-- !TODO сделать, что бы во время подгрузки на кнопке появлялся лодер -->
    <div class="search-result__more" v-if="isMore">
      <button
        class="search-result__more-btn text-btn"
        @click="$emit('showMore', type)"
      >
        <span>Загрузить ещё результаты</span>
        <user-icons :iconName="'arrow-down'" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchResult",

  components: {},

  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isMore: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.search-result {
  &__title {
    margin-bottom: var(--v-rhythm-10);

    @extend .h2;
    color: var(--gray900);

    &-quantity {
      color: var(--gray500);
    }

    &:first-letter {
      text-transform: uppercase;
    }
  }

  &__list {
  }

  &__item {
    &:not(:last-child):not(.search-result__item--new) {
      margin-bottom: var(--v-rhythm-2);
    }

    &--new {
      margin-left: var(--negativeMainPadding);
    }
  }

  &__more {
    margin-top: var(--v-rhythm-2);
    padding: 6px var(--v-rhythm-2);
    width: 100%;
    display: flex;
    justify-content: center;

    background-color: var(--white900);
    border: 2px solid var(--gray200);

    &-btn {
    }
  }
}
</style>
