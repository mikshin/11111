<template>
  <router-link
    class="stop-cards-mob-table-card"
    tag="li"
    :to="`/stop_cards/${card.ID}`"
  >
    <div class="stop-cards-mob-table-card__header">
      <span class="stop-cards-mob-table-card__header-txt">{{
        `№${card.ID}`
      }}</span>
      <UserIcons
        class="stop-cards-mob-table-card__header-icon"
        :iconName="'document-download'"
        @eventClick="print"
      />
    </div>
    <ul class="stop-cards-mob-table-card__list">
      <li
        class="stop-cards-mob-table-card__item"
        v-for="(item, i) in cardItem"
        :key="i"
      >
        <span class="stop-cards-mob-table-card__item-title">{{
          item.title
        }}</span>
        <span
          class="stop-cards-mob-table-card__item-value"
          :class="{
            'stop-cards-mob-table-card__item-value--accent': item.accent,
          }"
          >{{ item.value }}</span
        >
      </li>
    </ul>
  </router-link>
</template>

<script>
export default {
  name: "StopCardsMobTableCard",

  components: {},

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
          title: "Дата инцидента",
          value: this.card.INCIDENT_DATE,
        },
        {
          title: "Подразделение",
          value: this.card.DEPARTMENT,
        },
        {
          title: "Объект работ",
          value: this.card.OBJECT,
        },
        {
          title: "Причина оформления",
          value: this.card.REASON,
        },
        {
          title: "Статус решения проблемы",
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
.stop-cards-mob-table-card {
  padding: var(--v-rhythm-4) 10px;

  background-color: var(--white900);
  border: 2px solid var(--gray200);

  &:not(:last-child) {
    border-bottom: none;
  }

  @include transition();

  &:active {
    opacity: var(--active-opacity);
  }

  &__header {
    margin-bottom: var(--v-rhythm-4);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--v-rhythm-4);
  }

  &__header-txt {
    @extend .h3;
    color: var(--gray900);
  }

  &__header-icon {
    width: 24px;
    height: 24px;

    fill: var(--gray500);
    @include transition();

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__list {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__item {
    width: 100%;

    display: flex;
    flex-direction: column;
  }

  &__item-title {
    margin-bottom: var(--v-rhythm-1);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__item-value {
    @extend .body-2;
    color: var(--gray900);

    &--accent {
      @include font(14px, 20px, 700);
      color: var(--red900);
    }
  }
}
</style>