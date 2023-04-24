<template>
  <div class="swiper-wrapper">
    <swiper
      :options="swiperOption"
      ref="swiper"
      class="swiper"
      @slideChangeTransitionEnd="onSwipe"
    >
      <swiper-slide
        v-for="(item, index) in carouselItems"
        :key="index"
        class="swiper-slide"
      >
        <div class="swiper-slide__single">
          <img :src="item" alt="" />
        </div>
      </swiper-slide>
    </swiper>
    <div
      class="swiper-pagination"
      slot="pagination"
      v-show="showControls"
    ></div>
    <div class="slider-controls" v-if="showControls">
      <template>
        <div
          @click="$refs.swiper.swiperInstance.slidePrev()"
          class="swiper-button-prev"
          :class="{ hideButton: this.activeIndex === 0 }"
        >
          <UserIcons :iconName="'arrow-left'" />
        </div>
      </template>
      <template>
        <div
          @click="$refs.swiper.swiperInstance.slideNext()"
          class="swiper-button-next"
          :class="{
            hideButton: this.activeIndex === this.carouselItems.length - 1,
          }"
        >
          <UserIcons :iconName="'arrow-right'" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "CarouselSlider",

  props: {
    carouselItems: Array,
  },

  components: {
    Swiper,
    SwiperSlide,
  },

  directives: {
    swiper: directive,
  },

  data() {
    return {
      activeIndex: 0,
      isModalVisible: false,
      notNextTick: true,
      swiperOption: {
        slidesPerView: 1,
        notNextTick: true,
        loop: false,
        initialSlide: 0,
        speed: 800,
        direction: "horizontal",
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "fraction",
        },
      },
    };
  },

  computed: {
    showControls() {
      return this.carouselItems.length > this.swiperOption.slidesPerView;
    },
  },

  methods: {
    onSwipe() {
      this.activeIndex = this.$refs.swiper.$swiper.activeIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-button-prev,
.swiper-button-next {
  cursor: pointer;
  width: 32px;
  height: 32px;
  background-color: var(--red900);
  border-radius: 100%;
  fill: var(--white900);
  transition: 0.3s;

  .user-icons {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.swiper-pagination {
  --swiper-theme-color: var(--red900);
  bottom: -25px;
}

.hideButton {
  opacity: 0;
  pointer-events: none;
}
</style>