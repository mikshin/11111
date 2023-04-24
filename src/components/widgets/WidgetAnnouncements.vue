<template>
  <div class="widget-announcements">
    <div class="widget-announcements__header">
      <div class="widget-announcements__title main-title">{{ name }}</div>
      <div
        class="widget-announcements__header-slider-controls"
        v-if="!breakpoints.phones && isShowSliderControls"
      >
        <CarouselBtn
          class="widget-announcements__control-button widget-announcements__control-button--prev"
          prevNext="prev"
          ref="sliderButtonPrev"
        />
        <CarouselBtn
          class="widget-announcements__control-button widget-announcements__control-button--next"
          prevNext="next"
          ref="sliderButtonNext"
        />
      </div>
    </div>
    <Swiper
      class="widget-announcements__slider"
      :class="{
        loading: isLoading,
      }"
      :options="swiperOptions"
      ref="swiperRef"
    >
      <SwiperSlide
        class="widget-announcements__slide"
        v-for="card in advertisementsCards"
        :key="card.ID"
      >
        <AdvertisementCard
          class="widget-announcements__card"
          :cardInfo="card"
        />
      </SwiperSlide>
      <template #pagination>
        <div class="widget-announcements__slider-controls">
          <CarouselBtn
            v-if="breakpoints.phones && isShowSliderControls"
            class="widget-announcements__control-button widget-announcements__control-button--prev"
            prevNext="prev"
            ref="sliderButtonPrev"
          />
          <div
            class="widget-announcements__pagination"
            ref="sliderPagination"
            v-if="isShowSliderControls"
          ></div>
          <CarouselBtn
            v-if="breakpoints.phones && isShowSliderControls"
            class="widget-announcements__control-button widget-announcements__control-button--next"
            prevNext="next"
            ref="sliderButtonNext"
          />
        </div>
      </template>
    </Swiper>
    <router-link
      to="/advertisements"
      class="widget-announcements__all-link primary-btn"
      >Все объявления</router-link
    >
  </div>
</template>

<script>
import axios from "axios";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";

import AdvertisementCard from "@components/pages/Advertisements/AdvertisementCard.vue";

import CarouselBtn from "@UI/CarouselBtn.vue";

export default {
  name: "WidgetAnnouncements",

  components: {
    AdvertisementCard,
    CarouselBtn,
    Swiper,
    SwiperSlide,
  },

  props: {
    name: {
      type: String,
      required: false,
      default: "Объявления",
    },
  },

  data() {
    return {
      advertisementsCards: [],
      isLoading: true,
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: false,
        observer: true,
        observeParents: true,
        watchOverflow: true,
        watchSlidesProgress: true,
        resistanceRatio: 0.6,
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
        },
      },
    };
  },

  computed: {
    breakpoints() {
      return this.$store.getters.breakpoints;
    },
    swiperInstance() {
      return this.$refs.swiperRef.swiperInstance;
    },
    isShowSliderControls() {
      return this.advertisementsCards.length > 1;
    },
  },

  methods: {
    async getAdvertisements() {
      try {
        this.isLoading = true;
        const response = await axios.get("/mobileapp/api/advertising/widget");

        if (response.data) {
          this.advertisementsCards = response.data.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    updateSwiperNavigations() {
      this.$nextTick(() => {
        if (this.isShowSliderControls) {
          // ! Vue-awesome-swiper не реагирует на изменения swiperOptions в data, поэтому здесь изменяются параметры напрямую в инстансе
          const SWIPER = this.swiperInstance;

          if (this.$refs.sliderButtonNext && this.$refs.sliderButtonPrev) {
            SWIPER.params.navigation.prevEl = this.$refs.sliderButtonPrev.$el;
            SWIPER.params.navigation.nextEl = this.$refs.sliderButtonNext.$el;

            SWIPER.navigation.init();
            SWIPER.navigation.update();
          }

          // ? При резком изменении размеров экрана может иногда не обновлять элемент пагинации. Не знаю, с чем это связано, но баг редкий
          if (
            this.$refs.sliderPagination &&
            this.$refs.sliderPagination !== SWIPER.params.pagination.el
          ) {
            SWIPER.params.pagination.el = this.$refs.sliderPagination;

            SWIPER.pagination.init();
            SWIPER.pagination.render();
            SWIPER.pagination.update();
          }
        }
      });
    },
  },

  watch: {
    // Обновляет параметры кнопок и пагинации только тогда, когда изменяются вложенные эелементы или брейпоинты
    "breakpoints.phones"() {
      this.updateSwiperNavigations();
    },
    advertisementsCards() {
      this.updateSwiperNavigations();
    },
  },

  mounted() {
    this.getAdvertisements();
  },
};
</script>

<style scoped lang="scss">
.widget-announcements {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    margin-bottom: var(--v-rhythm-8);
  }

  &__header-slider-controls {
    display: flex;
    gap: 8px;
  }

  &__title {
    margin-bottom: unset;

    word-break: break-all;
  }

  &__slider {
    margin-bottom: var(--v-rhythm-4);
  }

  &__slide {
  }

  &__card {
  }

  &__slider-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    margin-top: var(--v-rhythm-6);
  }

  &__pagination {
    margin-inline: auto;
  }

  &__all-link {
    max-width: 100%;
    width: max-content;
  }
}
</style>
