<template>
  <WidgetWrapper
    v-if="contest"
    class="photo-contest-widget"
    :class="{ loading: isLoading }"
    :iconName="'photo-camera'"
    :title="name"
    :textBtn="'Все конкурсы'"
    @clickWidgetBtn="goToAll"
  >
    <div class="card-contest-widget">
      <div class="card-contest-widget__title">
        {{ contest.NAME }}
      </div>

      <template
        v-if="
          this.contest.TOTAL_IMAGE_COUNT === 0 ||
          this.contest.TOTAL_IMAGE_COUNT === 1
        "
      >
        <template v-if="this.contest.TOTAL_IMAGE_COUNT === 1">
          <PhotoCard
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
            class="card-contest-widget__card card-contest-widget__card_single"
            :commentsCount="contest.COMMENT_COUNT"
            @photoCardClick="photoCardClick"
            @likeClick="likeClick"
          />
        </template>
        <img :src="contest.IMAGE" class="card-contest-widget__image" v-else />
      </template>

      <div class="card-contest-widget__wrapper_for_buttons" v-else>
        <Swiper
          :options="swiperOption"
          class="simple-carousel swiper"
          @slideChange="onSwiper"
          ref="swiper"
        >
          <SwiperSlide
            v-for="(card, key) in cards"
            :key="key"
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
              :commentsCount="contest.COMMENT_COUNT"
              @photoCardClick="photoCardClick"
              @likeClick="likeClick"
            />
          </SwiperSlide>
        </Swiper>
        <CarouselBtn
          :prevNext="'prev'"
          :id="'simple-carousel-prev'"
          class="card-contest-widget__carousel-button card-contest-widget__carousel-button--prev"
          :customStyle="'fill: var(--red900)'"
        />
        <CarouselBtn
          :prevNext="'next'"
          :id="'simple-carousel-next'"
          class="card-contest-widget__carousel-button card-contest-widget__carousel-button--next"
          :class="{ loading: isLoadingSwiper }"
          :customStyle="'fill: var(--red900)'"
        />
      </div>

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
    </div>

    <transition name="fade">
      <ModalAddPhoto
        v-if="isVisiblePopup"
        @close="closePopup"
        :photoContestId="contest.ID"
      />
    </transition>

    <transition name="fade">
      <PhotoCardModal
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
  </WidgetWrapper>
</template>

<script>
import axios from "axios";
import PhotoCard from "@/components/photo-contest/PhotoCard.vue";
import ModalAddPhoto from "@/components/modals/ModalAddPhoto.vue";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";
import PhotoCardModal from "@/components/modals/PhotoCardModal.vue";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import WidgetWrapper from "@/components/widgets/WidgetWrapper.vue";

export default {
  name: "PhotoContestWidget",

  components: {
    WidgetWrapper,
    PhotoCard,
    ModalAddPhoto,
    Swiper,
    SwiperSlide,
    CarouselBtn,
    PhotoCardModal,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Конкурсы",
    },
  },

  data() {
    return {
      contest: {},
      cards: [],
      isLoading: false,
      isVisiblePopup: false,
      isLoadingSwiper: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 20,
        allowTouchMove: false,
        loop: false,
        observer: true,
        navigation: {
          nextEl: "#simple-carousel-next",
          prevEl: "#simple-carousel-prev",
        },
      },
      startFrom: 0,
      end: false,
      photoCardModalIsOpen: false,
      currentCardId: null,
    };
  },

  computed: {
    swiper() {
      return this.$refs.swiper.$swiper;
    },

    currentCard() {
      return this.currentCardId
        ? this.cards.find((item) => item.CARD_ID === this.currentCardId)
        : null;
    },

    lastPlace() {
      return this.cards.at(-1)?.PLACE;
    },

    lastLike() {
      return this.cards.at(-1)?.LIKE_COUNT;
    },
  },

  methods: {
    goToAll() {
      this.$router.push("/photo_contests");
    },

    onClick(e) {
      if (this.contest.ACTIVE) {
        e.preventDefault();
        this.isVisiblePopup = true;
      }
    },

    closePopup() {
      this.isVisiblePopup = false;
      this.photoCardModalIsOpen = false;
      this.currentCardId = null;
    },

    async onSwiper() {
      if (
        !this.end &&
        this.swiper.activeIndex >= this.swiper.slides.length - 2
      ) {
        try {
          this.isLoadingSwiper = true;
          this.end = true;
          const data = await this.getPhotos(2);
          this.cards = [...this.cards, ...data.data];
          this.end = data.end;
        } catch (err) {
          console.log(err);
        } finally {
          this.isLoadingSwiper = false;
        }
      }
    },

    async getPhotos(count) {
      try {
        const resPhotos = await axios({
          method: "get",
          url: `/mobileapp/api/photoContest/widget/image`,
          params: {
            photoContestId: this.contest.ID,
            startFrom: this.startFrom,
            count: count,
            lastPlace: this.lastPlace,
            lastLike: this.lastLike,
          },
        });

        this.startFrom += count;

        return resPhotos.data;
      } catch (err) {
        console.log(err);
      }
    },

    async getContest() {
      const res = await axios({
        method: "get",
        url: `mobileapp/api/photoContest/widget/`,
      });

      return res.data;
    },

    likeClick(obj) {
      const card = this.cards.find((item) => item.CARD_ID === obj.id);
      card.LIKE_STATUS.liked = !obj.oldLikeStatus;
      obj.oldLikeStatus ? (card.LIKE_COUNT -= 1) : (card.LIKE_COUNT += 1);
    },

    photoCardClick(cardId) {
      this.photoCardModalIsOpen = true;
      this.currentCardId = cardId;
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      const resContest = await this.getContest();
      this.contest = resContest;
      if (this.contest.TOTAL_IMAGE_COUNT > 0) {
        const resPhotos = await this.getPhotos(3);
        this.cards = resPhotos.data;
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped lang="scss">
.card-contest-widget {
  padding: 0 var(--v-rhythm-5);

  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    @extend .h4;
    padding: var(--v-rhythm-6) 0;

    color: var(--red900);

    position: relative;
    width: 100%;
    text-align: center;
  }

  &__card {
    width: 100%;

    &_single {
      width: calc(100% - var(--v-rhythm-5) * 2);
    }
  }

  &__image {
    width: calc(100% - var(--v-rhythm-5) * 2);
    height: 248px;

    margin-bottom: var(--v-rhythm-6);
    margin-right: var(--v-rhythm-5);
    margin-left: var(--v-rhythm-5);

    object-fit: cover;
    object-position: center;
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

  &__wrapper_for_buttons {
    position: relative;
    width: 100%;
  }

  &__carousel-button {
    position: absolute;
    z-index: 2;
    bottom: 50px;

    background: var(--white900);
    border: 1px solid var(--red900);

    &--prev {
      left: 0;
    }

    &--next {
      right: 0;
    }

    &.swiper-button-disabled {
      background: var(--white900);
      opacity: 0.3;
    }
  }
}
#simple-carousel-next.loading {
  --loadingSize: 32px;
  &:before {
    border-radius: 100px;
  }
}
</style>
