<template>
  <div
    class="widget-banners"
    :class="{
      [activeVariant]: activeVariant,
      loading: isLoading,
    }"
    v-if="fetchData.length"
  >
    <Swiper
      class="widget-banners__slider swiper"
      ref="slider"
      :options="swiperOption"
      @slideChange="changeCurrentSlide"
      :auto-update="false"
    >
      <SwiperSlide
        class="widget-banners__slide swiper-slide"
        v-for="banner in fetchData"
        :key="banner.ID"
      >
        <WidgetBanner
          :name="banner.NAME"
          :text="banner.PREVIEW_TEXT"
          :backgroundImage="banner.PREVIEW_PICTURE"
          :variant="variant"
        >
          <template #under-text>
            <button
              v-if="banner.TYPE === 'PAGE'"
              type="button"
              class="widget-banners__slide-button secondary-btn"
              @click="openModal(banner.PAGE)"
            >
              {{ banner.BUTTON_NAME }}
            </button>
            <a
              v-else
              class="widget-banners__slide-button secondary-btn"
              :href="banner.LINK"
              target="_blank"
            >
              {{ banner.BUTTON_NAME }}
            </a>
          </template>
        </WidgetBanner>
      </SwiperSlide>
    </Swiper>
    <div class="widget-banners__controls" v-if="fetchData.length > 1">
      <CarouselBtn
        class="widget-banners__control-button widget-banners__control-button--prev"
        :class="{
          'swiper-button-disabled': isSliderOnBeginning,
        }"
        prevNext="prev"
        :transparent="true"
        @click.native="goSliderToPrevSlide"
      />
      <div class="widget-banners__pagination">
        {{ currentSlideNumber }} / {{ totalSlidesNumber }}
      </div>
      <CarouselBtn
        class="widget-banners__control-button widget-banners__control-button--next"
        :class="{
          'swiper-button-disabled': isSliderOnEnd,
        }"
        prevNext="next"
        :transparent="true"
        @click.native="goSliderToNextSlide"
      />
    </div>
    <transition name="fade">
      <BannerPageModal
        v-if="bannerModalVisible"
        :pageID="selectedID"
        @closeModal="closeModal"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";

import CarouselBtn from "@UI/CarouselBtn.vue";

import BannerPageModal from "@components/banners/BannerPageModal.vue";

import WidgetBanner from "./WidgetBanner.vue";

const possibleVariants = ["narrow"];

export default {
  name: "WidgetBanners",

  components: {
    Swiper,
    SwiperSlide,
    CarouselBtn,
    BannerPageModal,
    WidgetBanner,
  },

  props: {
    variant: {
      type: String,
      required: false,
      validator: (value) => possibleVariants.includes(value),
    },
    dataFetchPath: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      bannerModalVisible: false,
      selectedID: 0,
      fetchData: [],
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        observer: true,
        watchOverflow: true,
        watchSlidesProgress: true,
        resistanceRatio: 0.6,
        disableOnInteraction: true,
      },
      isLoading: true,
      currentSlideNumber: 1,
    };
  },

  computed: {
    activeVariant() {
      if (!this.variant) {
        return null;
      }

      return (
        "widget-banners--" +
        possibleVariants.filter((variant) => variant === this.variant)
      );
    },
    totalSlidesNumber() {
      return this.fetchData?.length || 1;
    },
    isSliderOnBeginning() {
      return this.currentSlideNumber === 1;
    },
    isSliderOnEnd() {
      return this.currentSlideNumber === this.fetchData?.length;
    },
  },

  methods: {
    async getBanners() {
      try {
        this.isLoading = true;
        const response = await axios.get(this.dataFetchPath);
        if (response.data) {
          // ? Бэк по-разному отдает данные из запросов. Может, имеет смысл вообще вынести отсюда фетч
          if (response.data.data) {
            this.fetchData = response.data.data;
          } else {
            this.fetchData = response.data;
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },

    openModal(id) {
      this.selectedID = Number(id);
      this.bannerModalVisible = true;
    },

    closeModal() {
      this.bannerModalVisible = false;
    },

    changeCurrentSlide() {
      this.$nextTick(() => {
        this.currentSlideNumber = this.$refs.slider.$swiper.realIndex + 1;
      });
    },

    goSliderToPrevSlide() {
      this.$refs.slider.$swiper.slidePrev();
    },

    goSliderToNextSlide() {
      this.$refs.slider.$swiper.slideNext();
    },
  },

  watch: {},

  mounted() {
    this.getBanners();
  },
};
</script>

<style scoped lang="scss">
.widget-banners {
  position: relative;

  max-width: 100%;

  &__slider {
    height: 100%;
  }

  &__slide {
    display: flex;
    height: auto;
  }

  &__controls {
    position: absolute;
    bottom: var(--v-rhythm-16);
    right: var(--v-rhythm-20);
    z-index: 1;

    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 32px;
    max-width: 320px;
  }

  &__control-button {
    flex-shrink: 0;
  }

  // Пагинация
  &__pagination {
    @extend .body-1;

    width: 50%;
    display: flex;
    justify-content: center;

    color: var(--white900);
    white-space: nowrap;
  }

  &__slide-button {
    width: 100%;
    max-width: 320px;
  }

  @mixin narrow-version {
    .widget-banners__controls {
      left: 50%;
      right: unset;
      bottom: var(--v-rhythm-12);

      width: 320px;
      max-width: calc(100% - (var(--v-rhythm-8) * 2));

      transform: translateX(-50%);
    }

    .widget-banners__slide-button {
      max-width: 100%;
    }
  }

  &--narrow {
    @include narrow-version;
  }

  @include phones {
    @include narrow-version;
  }
}
</style>
