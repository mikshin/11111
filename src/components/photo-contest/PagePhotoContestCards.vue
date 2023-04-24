<template>
  <div class="page-photo-contest-cards" :class="{ loading: isLoading }">
    <div class="page-photo-contest-cards__list" v-if="cards.length > 0">
      <PhotoCard
        class="page-photo-contest-cards__card"
        v-for="card in cards"
        :key="card.CARD_ID"
        :id="card.CARD_ID"
        :photoContestId="card.PHOTO_CONTEST_ID"
        :title="card.NAME"
        :userFIO="card.USER_FIO"
        :imageLink="card.IMAGE"
        :likes="{
          count: card.LIKE_COUNT,
          liked: card.LIKE_STATUS.liked,
          disabled: card.LIKE_STATUS.disabled,
        }"
        :place="card.PLACE"
        @photoCardClick="photoCardClick"
        @likeClick="likeClick"
      />
      <div v-if="!cardsIsEnd" v-intersection="upload"></div>
    </div>

    <transition name="fade">
      <PhotoCardModal
        class="page-photo-contest-cards__modal"
        v-if="currentCard"
        :isVisible="photoCardModalIsOpen"
        :id="currentCard.CARD_ID"
        :photoContestId="currentCard.PHOTO_CONTEST_ID"
        :title="currentCard.NAME"
        :userFIO="currentCard.USER_FIO"
        :imageLink="currentCard.IMAGE"
        :likes="{
          count: currentCard.LIKE_COUNT,
          liked: currentCard.LIKE_STATUS.liked,
          disabled: currentCard.LIKE_STATUS.disabled,
        }"
        @onClose="closePopup"
        @likeClick="likeClick"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import PhotoCard from "@/components/photo-contest/PhotoCard.vue";
import PhotoCardModal from "@/components/modals/PhotoCardModal.vue";

export default {
  name: "PagePhotoContestCards",

  components: {
    PhotoCard,
    PhotoCardModal,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,

      cards: [],
      cardsIsEnd: true,

      photoCardModalIsOpen: false,
      currentCardId: null,
    };
  },

  computed: {
    currentCard() {
      return this.currentCardId
        ? this.cards.find((item) => item.CARD_ID === this.currentCardId)
        : null;
    },
  },

  methods: {
    likeClick(obj) {
      const card = this.cards.find((item) => item.CARD_ID === obj.id);
      card.LIKE_STATUS.liked = !obj.oldLikeStatus;
      obj.oldLikeStatus ? (card.LIKE_COUNT -= 1) : (card.LIKE_COUNT += 1);
    },

    closePopup() {
      this.currentCardId = null;
      this.photoCardModalIsOpen = false;
    },

    photoCardClick(cardId) {
      this.photoCardModalIsOpen = true;
      this.currentCardId = cardId;
    },

    async getData() {
      try {
        this.isLoading = true;
        this.cardsIsEnd = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/photoContest/photo/?photoContestId=${
            this.id
          }&startFrom=${
            this.cards.length
          }&count=10&lastLike=${this.getFetchParam(
            "LIKE_COUNT"
          )}&lastPlace=${this.getFetchParam("PLACE")}`,
        });

        this.cards = [...this.cards, ...response.data.data];
        this.cardsIsEnd = response.data.end;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    getFetchParam(param) {
      return this.cards.length > 0
        ? this.cards[this.cards.length - 1][param]
        : null;
    },

    upload() {
      this.getData();
    },
  },

  watch: {},

  mounted() {
    this.getData();
  },
};
</script>

<style scoped lang="scss">
.page-photo-contest-cards {
  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--v-rhythm-8) var(--v-rhythm-4);
  }

  &__card {
  }

  &__modal {
    ::v-deep {
      .app-modal {
        width: auto;
      }
    }
  }

  @media screen and (max-width: 500px) {
    &__list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>