<template>
  <router-link
    class="stop-cards-table-card"
    tag="tr"
    :to="`/stop_cards/${card.ID}`"
  >
    <td
      class="stop-cards-table-card__td"
      v-for="(item, i) in cardItem"
      :key="i"
    >
      <template v-if="i !== 5">{{ item.value }}</template>
      <div
        class="stop-cards-table-card__td-print"
        :class="{
          'stop-cards-table-card__td-print--accent': item.accent,
        }"
        v-else
      >
        {{ item.value }}

        <PrintTooltip
          class="stop-cards-table-card__print-tooltip"
          @eventClick="print"
          :content="'Распечатать'"
        />
      </div>
    </td>
  </router-link>
</template>

<script>
import PrintTooltip from "@/components/UI/tooltip/PrintTooltip.vue";

export default {
  name: "StopCardsTableCard",

  components: { PrintTooltip },

  props: {
    card: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    cardItem() {
      return [
        {
          value: this.card.ID,
        },
        {
          value: this.card.INCIDENT_DATE,
        },
        {
          value: this.card.DEPARTMENT,
        },
        {
          value: this.card.OBJECT,
        },
        {
          value: this.card.REASON,
        },
        {
          value: this.card.FIXED,
          accent: this.card.FIXED === "Нет" ? true : false,
        },
      ];
    },
  },

  methods: {
    print() {
      setTimeout(() => {
        window.print();
      }, 1000);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.stop-cards-table-card {
  border-bottom: 1px solid var(--gray300);

  cursor: pointer;
  @include transition();

  @include hover {
    background-color: var(--gray100);
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__td {
    padding: 18px var(--v-rhythm-4);

    @extend .body-1;
    color: var(--gray900);
  }

  &__td-print {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-8);

    &--accent {
      @extend .subtitle-1;
      color: var(--red900);
    }
  }
}
</style>