<template>
  <div class="carousel">
    <div class="carousel__nav" v-show="photogallery.length > 1">
      <CarouselBtn
        class="carousel__btn carousel__btn--prev"
        :prevNext="'prev'"
        :id="`photogallery-prev-${count}`"
        ref="btnPrev"
      />
      <CarouselBtn
        class="carousel__btn carousel__btn--next"
        :prevNext="'next'"
        :id="`photogallery-next-${count}`"
        ref="btnNext"
      />
    </div>

    <Swiper
      class="swiper"
      :options="swiperOption"
      ref="swiper"
      @ready="updateSwiper"
      :auto-update="true"
    >
      <SwiperSlide
        class="swiper-slide"
        v-for="slide in photogallery"
        :key="slide.fileId"
      >
        <div class="carousel__title" v-if="slide.description">
          {{ slide.description }}
        </div>

        <SimplePicture
          class=""
          :alt="slide.originalName"
          :src="slide.fileLink"
        />
      </SwiperSlide>
    </Swiper>

    <div
      class="carousel__pagination"
      :id="`photogallery-pagination-${count}`"
      ref="pagination"
      v-show="photogallery.length > 1"
    ></div>
  </div>
</template>

<script>
import CarouselBtn from "@/components/UI/CarouselBtn.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import SimplePicture from "@/components/UI/SimplePicture.vue";

export default {
  name: "PagesContentModalPhotogallery",

  components: {
    CarouselBtn,
    Swiper,
    SwiperSlide,
    SimplePicture,
  },

  props: {
    photogallery: {
      type: Array,
      required: true,
    },

    count: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      hasPagination: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 16,
        preloadImages: true,
        loop: false,
        observer: true,
        autoHeight: true,
        pagination: {
          el: `#photogallery-pagination-${this.count}`,
          clickable: true,
          type: "fraction",
        },
        navigation: {
          nextEl: `#photogallery-next-${this.count}`,
          prevEl: `#photogallery-prev-${this.count}`,
        },
      },
    };
  },

  computed: {
    swiper() {
      return this.$refs.swiper.$swiper;
    },
  },

  methods: {
    // Обновляю слайдер после инициализации, что бы он выстроил корректную высоту
    updateSwiper() {
      setTimeout(() => {
        this.swiper.update();
      }, 100);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.carousel {
  position: relative;

  &__btn {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);

    &--prev {
      left: var(--v-rhythm-2);
    }

    &--next {
      right: var(--v-rhythm-2);
    }
  }

  &__title {
    margin-bottom: var(--v-rhythm-2);

    @extend .body-2;
    color: var(--gray900);
  }

  &__pagination {
    margin-top: var(--v-rhythm-4);

    display: flex;
    justify-content: center;
    gap: var(--v-rhythm-1);

    @extend .body-2;
  }
}
</style>