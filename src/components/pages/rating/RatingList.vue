<template>
  <div class="rating__list">
    <span class="rating__name">
      {{ data.NAME }}
    </span>
    <ul class="rating__list-item">
      <template v-for="(item, i) in data.cards">
        <BrigadeRating :data="item" :key="i" />
      </template>
    </ul>
  </div>
</template>
<script>
import BrigadeRating from "./BrigadeRating.vue";
export default {
  components: { BrigadeRating },
  props: {
    data: null,
  },
};
</script>

<style lang="scss" scoped>
.rating {
  &__list-item {
    display: flex;
    gap: var(--v-rhythm-3);
    background-color: var(--white900);
    padding: var(--v-rhythm-5);

    &__item {
      background-color: var(--gray100);
    }
  }
  &__name {
    @extend .h4;
    padding-top: var(--v-rhythm-6);
    padding-left: var(--v-rhythm-5);
    background-color: var(--white900);
    display: block;
  }

  @include phones {
    &__list-item {
      flex-direction: column;
    }
  }
}
</style>
