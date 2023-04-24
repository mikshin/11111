<template>
  <div class="stop-cards-mob-table">
    <div class="stop-cards-mob-table__group" v-if="cardWinner.length > 0">
      <div class="stop-cards-mob-table__title">
        <UserIcons class="stop-cards-mob-table__title-icon" :iconName="'pin'" />
        Победители рейтинга стоп-карт
      </div>
      <ul class="stop-cards-mob-table__card-list">
        <StopCardsMobTableCard
          class="stop-cards-mob-table__card"
          v-for="card in cardWinner"
          :key="card.ID"
          :card="card"
        />
      </ul>
    </div>
    <div class="stop-cards-mob-table__group">
      <div class="stop-cards-mob-table__title">
        Остальные стоп-карты месяца (без наград)
      </div>
      <ul class="stop-cards-mob-table__card-list">
        <StopCardsMobTableCard
          class="stop-cards-mob-table__card"
          v-for="card in cardData"
          :key="card.ID"
          :card="card"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import StopCardsMobTableCard from "@/components/stop-cards/stop-cards-mob-table/StopCardsMobTableCard.vue";

export default {
  name: "StopCardsMobTable",

  components: { StopCardsMobTableCard },

  props: {
    cardData: {
      type: Array,
      required: true,
    },

    cardWinner: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.stop-cards-mob-table {
  &__group {
  }

  &__title {
    padding: var(--v-rhythm-2) 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--v-rhythm-2);

    @include font(14px, 20px, 700);
    color: var(--white900);
    text-align: center;

    background-color: var(--gray700);
  }

  &__title-icon {
    width: 16px;
    height: 16px;

    fill: var(--white900);
  }

  &__card-list {
  }

  &__card {
  }
}
</style>