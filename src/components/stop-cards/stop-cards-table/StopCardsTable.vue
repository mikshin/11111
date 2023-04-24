<template>
  <table class="stop-cards-table">
    <thead class="stop-cards-table__thead">
      <tr class="stop-cards-table__thead-tr">
        <th class="stop-cards-table__th" v-for="(th, i) in tableHead" :key="i">
          {{ th }}
        </th>
      </tr>
    </thead>
    <tbody class="stop-cards-table__tbody" v-if="cardWinner.length">
      <tr class="stop-cards-table__title">
        <td class="stop-cards-table__title-td" colspan="6">
          <div class="stop-cards-table__title-wrapper">
            <UserIcons class="stop-cards-table__title-icon" :iconName="'pin'" />
            Победители рейтинга стоп-карт
          </div>
        </td>
      </tr>
      <StopCardsTableCard
        class="stop-cards-table__tr"
        v-for="card in cardWinner"
        :key="card.ID"
        :card="card"
      />
    </tbody>
    <tbody class="stop-cards-table__tbody" v-if="cardData.length">
      <tr class="stop-cards-table__title">
        <td class="stop-cards-table__title-td" colspan="6">
          <div class="stop-cards-table__title-wrapper">
            Остальные Стоп-карты месяца (без наград)
          </div>
        </td>
      </tr>
      <StopCardsTableCard
        class="stop-cards-table__tr"
        v-for="card in cardData"
        :key="card.ID"
        :card="card"
      />
    </tbody>
  </table>
</template>

<script>
import StopCardsTableCard from "@/components/stop-cards/stop-cards-table/StopCardsTableCard.vue";

export default {
  name: "StopCardsTable",

  components: { StopCardsTableCard },

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
    return {
      tableHead: [
        "№",
        "Дата инцидента",
        "Подразделение",
        "Объект работ",
        "Причина оформления",
        "Статус решения проблемы",
      ],
    };
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.stop-cards-table {
  border: 1px solid var(--gray300);

  border-collapse: collapse;

  &__thead {
  }

  &__thead-tr {
  }

  &__th {
    padding: var(--v-rhythm-4);

    @extend .subtitle-1;
    color: var(--gray700);
    text-align: left;

    border-right: 1px solid var(--gray300);

    &:last-child {
      border-right: none;
    }
  }

  &__tbody {
    background-color: var(--white900);
  }

  &__title {
  }

  &__title-td {
  }

  &__title-wrapper {
    padding: var(--v-rhythm-2);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--v-rhythm-2);

    @extend .subtitle-1;
    color: var(--white900);

    background-color: var(--gray700);
  }

  &__title-icon {
    width: 16px;
    height: 16px;

    fill: var(--white900);
  }

  &__tr {
  }

  @include desktop {
    &__th {
      padding: var(--v-rhythm-3) var(--v-rhythm-2);
    }
  }
}
</style>