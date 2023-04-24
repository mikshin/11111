<template>
  <div class="card-contest-widget">
    <span class="card-contest-widget__title">{{ contest.NAME }}</span>
    <template v-if="photoCards.length === 1">
      <PhotoCard
        v-for="card in photoCards"
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
        class="card-contest-widget__card"
      />
    </template>
    <template v-else>
      <div class="card-contest-widget__simple-carousel-buttons">
        <CarouselBtn
          :prevNext="'prev'"
          :id="'simple-carousel-prev'"
          class="card-contest-widget__carousel-button"
          :customStyle="'fill: var(--red900)'"
        />
        <CarouselBtn
          :prevNext="'next'"
          :id="'simple-carousel-next'"
          class="card-contest-widget__carousel-button"
          :customStyle="'fill: var(--red900)'"
        />
      </div>
      <Swiper
        :options="SimpleCarousel.swiperOption"
        class="simple-carousel swiper"
      >
        <SwiperSlide
          v-for="card in photoCards"
          :key="card.CARD_ID"
          class="card-contest-widget__card"
        >
          <PhotoCard
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
          />
          <!-- @photoCardClick="photoCardClick"
            @likeClick="likeClick" -->
        </SwiperSlide>
      </Swiper>
    </template>
    <router-link :to="contest.ACTIVE ? '' : `/photo_contests/${contest.ID}`">
      <button
        class="card-contest-widget__button primary-btn"
        @click="onClick"
        @close="closePopup"
        :photoContestId="contest ? contest.ID : ''"
      >
        {{
          contest && contest.ACTIVE ? "Принять участие" : "Смотреть результат"
        }}
      </button>
    </router-link>
    <router-link to="/photo_contests" class="card-contest-widget__link"
      >Все конкурсы</router-link
    >
    <ModalAddPhoto v-if="isVisiblePopup" />
  </div>
</template>

<script>
import PhotoCard from "@/components/photo-contest/PhotoCard.vue";
import ModalAddPhoto from "@/components/modals/ModalAddPhoto.vue";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
  name: "CardContestWidget",

  components: {
    PhotoCard,
    ModalAddPhoto,
    Swiper,
    SwiperSlide,
    CarouselBtn,
  },

  props: { contest: Object, photoCards: Array },

  data() {
    return {
      isLoading: false,
      isVisiblePopup: false,
      SimpleCarousel: {
        swiperOption: {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: false,
          observer: true,
          navigation: {
            nextEl: "#simple-carousel-next",
            prevEl: "#simple-carousel-prev",
          },
        },
      },
    };
  },

  computed: {},

  methods: {
    onClick(e) {
      if (this.contest.ACTIVE) {
        e.preventDefault();
        this.isVisiblePopup = true;
      }
    },
    closePopup() {
      this.isVisiblePopup = false;
    },
  },

  // async mounted() {
  //   try {
  //     const resPhotos = await axios({
  //       method: "get",
  //       url: `/mobileapp/api/photoContest?startFrom=${0}&count=${1}`,
  //     });
  //     this.cards = [...resPhotos.data.data];
  //     const resContest = await axios({
  //       method: "get",
  //       url: `/mobileapp/api/photoContest/photo/?photoContestId=${this.contest.ID}&startFrom=0`,
  //     });
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // },
};
</script>

<style scoped lang="scss">
.card-contest-widget {
  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  &__title {
    @extend .h4;
    margin-top: var(--v-rhythm-6);
    margin-bottom: var(--v-rhythm-6);

    color: var(--red900);
  }

  &__card {
    width: 100% !important;
  }

  &__image {
    margin-bottom: var(--v-rhythm-6);
  }

  &__autor-name {
    @extend .subtitle-1;
    margin-bottom: var(--v-rhythm-2);
  }

  &__photo-name {
    @extend .subtitle-2;
    margin-bottom: var(--v-rhythm-2);

    color: var(--gray500);
  }

  &__button {
    margin-bottom: var(--v-rhythm-6);
  }

  &__link {
    @extend .button;
    width: 100%;

    border-top: 1px solid var(--gray300);

    padding-top: var(--v-rhythm-4);
    padding-bottom: var(--v-rhythm-4);

    color: var(--red900);
    text-align: center;
  }

  &__simple-carousel-buttons {
    display: flex;
    justify-content: space-between;

    width: 100%;

    position: absolute;
    z-index: 2;
    bottom: 25%;

    padding: 0 var(--v-rhythm-5);
  }

  &__carousel-button {
    background: var(--white900);
    border: 1px solid var(--red900);
  }
}

.swiper-container {
  width: 100%;
  padding: var(--v-rhythm-5);
}
</style>