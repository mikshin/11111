

<template>
  <WidgetWrapper class="widget-thanks" :iconName="'thank'" :title="name">
    <div
      class="widget-thanks__content"
      :class="{
        loading: isLoading,
      }"
    >
      <div class="widget-thanks__list" v-if="cardsWithCorrectProps.length">
        <ThankCard
          v-for="(card, i) in cardsWithCorrectProps"
          :key="i"
          v-bind="card"
        ></ThankCard>
        <div
          v-if="isCanFetchMore"
          class="loading"
          v-intersection="fetchCards"
        ></div>
      </div>
      <div v-else class="widget-thanks__no-data-text widget-text-default">
        Благодарностей нет
      </div>
    </div>
  </WidgetWrapper>
</template>

<script>
/* eslint-disable  */
import axios from "axios";

import WidgetWrapper from "@widgets/WidgetWrapper.vue";
import ThankCard from "@components/cards/ThankCard.vue";

export default {
  props: {
    name: String,
  },

  components: { WidgetWrapper, ThankCard },

  data() {
    return {
      isLoading: true,
      isCanFetchMore: false,
      cards: [],
    };
  },

  methods: {
    async fetchCards() {
      await axios
        .get(`/mobileapp/api/gratitude/`, {
          params: {
            count: 5,
            startFrom: this.cards.length,
          },
        })
        .then((response) => {
          this.cards.push(...response.data.data);
          this.isCanFetchMore = !response.data.end;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.cards = [];
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },

  computed: {
    cardsWithCorrectProps() {
      return this.cards.map((thankfulnessData) => ({
        congratulation: thankfulnessData.UF_TEXT,
        date: thankfulnessData.UF_DATE_ADD,
        // На самом деле, в поле useFrom помещается информация, кому адресована благодарность,
        // а в поле userTo помещается информация, от кого отправлена благодарность.
        // Так были объявлены пропсы в компоненте. Я не стал трогать
        userFrom: {
          id: thankfulnessData.UF_RECIPIENT.ID,
          src: thankfulnessData.UF_RECIPIENT.USER_PHOTO,
          fullName: thankfulnessData.UF_RECIPIENT.FIO,
          workPosition: thankfulnessData.UF_RECIPIENT.WORK_POSITION,
          vacation: thankfulnessData.UF_RECIPIENT.VACATION,
          fired: thankfulnessData.UF_RECIPIENT.FIRED,
        },
        userTo: {
          id: thankfulnessData.UF_AUTHOR.ID,
          src: thankfulnessData.UF_AUTHOR.USER_PHOTO,
          fullName: thankfulnessData.UF_AUTHOR.FIO,
          workPosition: thankfulnessData.UF_AUTHOR.WORK_POSITION,
          vacation: thankfulnessData.UF_AUTHOR.VACATION,
          fired: thankfulnessData.UF_AUTHOR.FIRED,
        },
      }));
    },
  },

  mounted() {
    this.fetchCards();
  },
};
</script>

<style lang="scss" scoped>
.widget-thanks {
  &__list {
    height: 576px;

    overflow-y: auto;
  }

  &__no-data-text {
    padding: var(--v-rhythm-3) var(--v-rhythm-4);
  }
}
</style>
