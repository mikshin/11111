<template>
  <div class="stop-dropdown">
    <button class="stop-dropdown__button" @click="dropdown" type="button">
      <UserIcons
        class="stop-dropdown__button-icon"
        :class="{ 'stop-dropdown__button-icon--open': isOpen }"
        :iconName="'arrow-down'"
      />
      <span class="stop-dropdown__button-month">{{ title[0] }}</span>
      <span class="stop-dropdown__button-year">{{ title[1] }}</span>
    </button>
    <transition name="dropdown">
      <div
        class="stop-dropdown__table-wrapper"
        :class="{
          loading: isLoading,
        }"
        v-if="isOpen"
      >
        <template
          v-if="(cardWinner.length > 0 || cardData.length > 0) && !isLoading"
        >
          <StopCardsTable
            class="stop-dropdown__table"
            v-if="browserWindowWidth > 767"
            :cardWinner="cardWinner"
            :cardData="cardData"
          />

          <StopCardsMobTable
            class="stop-dropdown__mob-table"
            v-else
            :cardWinner="cardWinner"
            :cardData="cardData"
          />
          <button
            class="stop-dropdown__more-btn primary-btn"
            :class="{ loading: moreBtnIsLoading }"
            @click="loadingStopCardsReestr"
            type="button"
            v-if="!cardEnd"
          >
            Загрузить ещё
          </button>
        </template>
        <template v-else>Элементов не найдено</template>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

import StopCardsTable from "@/components/stop-cards/stop-cards-table/StopCardsTable.vue";
import StopCardsMobTable from "@/components/stop-cards/stop-cards-mob-table/StopCardsMobTable.vue";

export default {
  name: "StopDropdown",

  components: { StopCardsMobTable, StopCardsTable },

  props: {
    index: {
      type: String,
      require: true,
    },

    titleString: {
      type: String,
      require: true,
    },

    filter: Object,
  },

  data() {
    return {
      isOpen: false,
      moreBtnIsLoading: false,
      cardWinner: [],
      cardData: [],
      cardEnd: true,
      isLoading: false,
    };
  },

  methods: {
    dropdown() {
      this.cardData.length === 0 ? this.getStopCardsReestr() : null;

      this.isOpen = !this.isOpen;
      this.$emit("changeCardsList", this.index);
    },

    async fetchStopCardsReestr(count = 10) {
      try {
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/stopCardsReestr/`,
          params: {
            month: this.index,
            startFrom: this.cardData.length,
            count: count,
          },
          data: {
            filter: this.filter,
          },
        });
        return response.data;
      } catch (error) {
        console.log("error");
      } finally {
        this.$emit("fetchEnd");
      }
    },

    async getStopCardsReestr() {
      this.isLoading = true;
      const response = await this.fetchStopCardsReestr();

      this.cardWinner = response.winner;
      this.cardData = response.card.data;
      this.cardEnd = response.card.end;
      this.isLoading = false;
    },

    dropCardData() {
      this.cardWinner = [];
      this.cardData = [];
      this.cardEnd = true;
    },

    async loadingStopCardsReestr() {
      try {
        this.moreBtnIsLoading = true;
        const response = await this.fetchStopCardsReestr();
        this.cardData = [...this.cardData, ...response.card.data];
        this.cardEnd = response.card.end;
      } finally {
        this.moreBtnIsLoading = false;
      }
    },
  },

  computed: {
    title() {
      return this.titleString.split(" ");
    },

    ...mapGetters(["browserWindowWidth"]),
  },

  watch: {
    filter() {
      this.dropCardData();
      if (this.isOpen) {
        this.getStopCardsReestr();
      } else {
        this.$emit("fetchEnd");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.stop-dropdown {
  border-bottom: 2px solid var(--gray300);

  &__button {
    width: 100%;
    padding: var(--v-rhythm-4) 0;

    display: flex;
    gap: var(--v-rhythm-3);

    @extend .h2;

    cursor: pointer;
    @include transition();

    @include hover {
      background-color: var(--gray300);
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__button-icon {
    width: 40px;
    height: 40px;

    fill: var(--gray700);

    @include transition();

    &--open {
      fill: var(--red900);
      transform: scaleY(-1);
    }
  }

  &__button-month {
    color: var(--gray900);
  }

  &__button-year {
    color: var(--gray500);
  }

  &__table-wrapper {
    width: 100%;
    padding-bottom: var(--v-rhythm-4);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__table {
    width: 100%;
  }

  &__mob-table {
    width: 100%;
  }

  &__more-btn {
    margin-top: var(--v-rhythm-4);
  }

  @include phones {
    &__button {
      gap: var(--v-rhythm-2);
    }

    &__button-icon {
      width: 24px;
      height: 24px;
    }

    &__table-wrapper {
      width: auto;
      margin: 0 var(--negativeMainPadding);
    }

    &__more-btn {
      width: 100%;
    }
  }
}
</style>