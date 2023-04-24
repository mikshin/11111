<template>
  <div class="training-images-gallery">
    <Swiper :options="swiperOption" class="training-images-gallery__slider">
      <SwiperSlide
        v-for="image in images"
        :key="image.fileId"
        class="training-images-gallery__slide"
      >
        <div class="training-images-gallery__image-wrapper">
          <img
            :src="image.fileLink"
            class="training-images-gallery__image"
            alt=""
            @click="photoClickHandler(image)"
          />
        </div>
      </SwiperSlide>
      <template #button-prev>
        <CarouselBtn
          class="training-images-gallery__slider-button training-images-gallery__slider-button--prev"
          prevNext="prev"
          :transparent="true"
        />
      </template>
      <template #button-next>
        <CarouselBtn
          class="training-images-gallery__slider-button training-images-gallery__slider-button--next"
          prevNext="next"
          :transparent="true"
        />
      </template>
    </Swiper>
    <transition name="fade">
      <PhotoCardModal
        :isVisible="photoModalIsOpen"
        :imageLink="currentImage"
        @onClose="closePopup"
      ></PhotoCardModal>
    </transition>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import CarouselBtn from "@/components/UI/CarouselBtn.vue";

import PhotoCardModal from "@/components/modals/PhotoCardModal.vue";

export default {
  name: "TrainingImagesGallery",

  components: { Swiper, SwiperSlide, CarouselBtn, PhotoCardModal },

  props: {
    images: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      currentImage: "",
      photoModalIsOpen: false,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        observer: true,
        navigation: {
          nextEl: ".training-images-gallery__slider-button--next",
          prevEl: ".training-images-gallery__slider-button--prev",
        },
      },
    };
  },

  computed: {},

  methods: {
    photoClickHandler(file) {
      this.photoModalIsOpen = true;
      this.currentImage = file.fileLink;
    },

    closePopup() {
      this.currentImage = "";
      this.photoModalIsOpen = false;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.training-images-gallery {
  // .training-images-gallery__slider

  &__slider {
  }

  // .training-images-gallery__slide

  &__slide {
    width: 100%;
    height: 100%;
  }

  // .training-images-gallery__image-wrapper

  &__image-wrapper {
    width: 100%;
    aspect-ratio: 672 / 295;

    cursor: pointer;
  }

  // .training-images-gallery__image

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // .training-images-gallery__slider-button

  &__slider-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;

    &--next {
      right: 13px;
    }

    &--prev {
      left: 13px;
    }
  }
}
</style>