<template>
  <AppModal
    class="pages-content-modal"
    v-if="isVisible"
    @onClose="$emit('onClose')"
    :maxWidth="'600'"
  >
    <div class="pages-content-modal__content" v-if="!isLoading">
      <div class="pages-content-modal__title" v-if="pageData.NAME">
        {{ pageData.NAME }}
      </div>

      <div
        class="pages-content-modal__description"
        v-if="pageData.DETAIL_TEXT"
        v-html="pageData.DETAIL_TEXT"
      ></div>

      <SimplePicture
        class="pages-content-modal__preview"
        v-if="pageData.PREVIEW_PICTURE"
        :alt="pageData.PREVIEW_PICTURE.originalName"
        :src="pageData.PREVIEW_PICTURE.fileLink"
      />

      <PagesContentModalPhotogallery
        class="pages-content-modal__photogallery"
        v-for="(photogallery, i) in pageData.PHOTOGALLERY"
        :key="photogallery.libraryId"
        :photogallery="photogallery.libraryFiles"
        :count="i"
      />

      <div class="pages-content-modal__files" v-if="pageData.FILE.length > 0">
        <AppDocument
          class="pages-content-modal__files-file"
          v-for="item in pageData.FILE"
          :key="item.fileId"
          :fileTitle="item.originalName"
          :fileSize="item.fileSize"
          :fileExtension="item.extension"
          :fileLink="item.fileLink"
        />
      </div>

      <ul class="pages-content-modal__audios" v-if="pageData.AUDIO.length > 0">
        <li
          class="pages-content-modal__audios-item"
          v-for="item in pageData.AUDIO"
          :key="item.fileId"
        >
          <div class="pages-content-modal__audios-item-title">
            {{ item.originalName }}
          </div>
          <audio
            class="pages-content-modal__audios-item-audio"
            controls="controls"
          >
            <source :src="item.fileLink" :type="item.fileType" />
          </audio>
        </li>
      </ul>

      <div
        class="pages-content-modal__videos carousel"
        v-if="pageData.VIDEO.length > 0"
      >
        <!-- <CarouselBtn
          class="carousel__btn carousel__btn--prev"
          :prevNext="'prev'"
          :id="'videos-prev'"
          v-if="pageData.VIDEO.length > 1"
        />
        <CarouselBtn
          class="carousel__btn carousel__btn--next"
          :prevNext="'next'"
          :id="'videos-next'"
          v-if="pageData.VIDEO.length > 1"
        /> -->

        <!-- <Swiper
          class="pages-content-modal__videos-swiper swiper"
          :options="videos.swiperOption"
          ref="videosSwiper"
        > -->
        <div class="pages-content-modal__videos-swiper swiper">
          <div
            class="pages-content-modal__videos-item swiper-slide"
            v-for="slide in pageData.VIDEO"
            :key="slide.fileId"
          >
            <div class="pages-content-modal__videos-item-title">
              {{ slide.originalName }}
            </div>
            <video class="pages-content-modal__videos-item-video" controls>
              <!-- #t=0.1 в src нужно что бы в сафари подгружался первый кадр на видео, как превью -->
              <source :src="`${slide.fileLink}#t=0.1`" :type="slide.fileType" />
            </video>
          </div>
        </div>
        <!-- </Swiper> -->

        <div
          class="carousel__pagination"
          id="videos-pagination"
          v-if="pageData.VIDEO.length > 1"
        ></div>
      </div>
    </div>
  </AppModal>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
// import { Swiper } from "vue-awesome-swiper";
// import CarouselBtn from "@/components/UI/CarouselBtn.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import PagesContentModalPhotogallery from "@/components/modals/pages-content-modal/PagesContentModalPhotogallery.vue";
import axios from "axios";

export default {
  name: "PagesСontentModal",

  components: {
    AppModal,
    SimplePicture,
    // Swiper,
    // CarouselBtn,
    AppDocument,
    PagesContentModalPhotogallery,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    pageId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      pageData: null,
      videos: {
        swiperOption: {
          slidesPerView: 1,
          spaceBetween: 16,
          loop: true,
          observer: true,
          autoHeight: false,
          pagination: {
            el: "#videos-pagination",
            clickable: true,
            type: "bullets",
          },
          navigation: {
            nextEl: "#videos-next",
            prevEl: "#videos-prev",
          },
        },
      },
    };
  },

  methods: {
    async getData() {
      try {
        this.isLoading = true;
        this.pageData = null;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/contentPage/detail?pageId=${this.pageId}`,
        });
        this.pageData = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    update() {},
  },

  computed: {},

  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.getData();
      }
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.pages-content-modal {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-10);
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }

  &__description {
    @extend .v-html;
  }

  &__preview {
  }

  &__photogallery {
  }

  &__files {
    display: flex;
    flex-direction: column;
  }

  &__audios {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__audios-item {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__audios-item-title {
    @extend .body-2;
    color: var(--gray900);
  }

  &__audios-item-audio {
    width: 100%;
  }

  &__videos {
  }

  &__videos-item {
    width: 100% !important;
  }

  &__videos-item-title {
    margin-bottom: var(--v-rhythm-2);

    @extend .body-2;
    color: var(--gray900);
  }

  &__videos-item-video {
    width: 100%;
  }

  @include phones {
    &__content {
      gap: var(--v-rhythm-4);
    }
  }
}

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

  &__pagination {
    margin-top: var(--v-rhythm-4);
  }
}
</style>