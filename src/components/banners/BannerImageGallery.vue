<template>
  <div class="banner_image_gallery__wrapper">
    <Swiper :options="swiperOption" class="swiper">
      <SwiperSlide
        v-for="image in images"
        :key="image.fileId"
        class="swiper-slide swiper_fix"
      >
        <div class="banner_image_gallery__image_wrapper">
          <img
            :src="image.fileLink"
            class="banner_image_gallery__image"
            alt=""
          />
        </div>
      </SwiperSlide>
    </Swiper>
    <div class="banner_image_gallery__buttons">
      <CarouselBtn
        :prevNext="'prev'"
        :id="'banner_image_gallery-prev'"
        :transparent="true"
      />
      <CarouselBtn
        :prevNext="'next'"
        :id="'banner_image_gallery-next'"
        :transparent="true"
      />
    </div>
    <div>
      <div
        class="banner_image_gallery__counter"
        id="banner_image_gallery__pagination"
        ref="pagination"
      ></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";
export default {
  name: "BannerImageGallery",

  components: { Swiper, SwiperSlide, CarouselBtn },

  props: {
    images: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        observer: true,
        pagination: {
          el: "#banner_image_gallery__pagination",
          type: "fraction",
        },
        navigation: {
          nextEl: "#banner_image_gallery-next",
          prevEl: "#banner_image_gallery-prev",
        },
      },
    };
  },

  computed: {},

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.banner_image_gallery {
  &__wrapper {
    position: relative;
  }
  &__image_wrapper {
    height: 297px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__image {
    max-height: 296px;
  }
  &__counter {
    @extend .body-2;
    margin-top: var(--v-rhythm-2);
    text-align: center;
  }
  &__buttons {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    top: 42%;
    z-index: 2;
  }
}
</style>