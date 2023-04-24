<template>
  <AppModal
    class="banner__modal"
    @onClose="closePopup"
    :maxWidth="'600'"
    :class="{ loading: isDataLoading }"
  >
    <h3 class="banner__header">
      {{ fetchData.NAME }}
    </h3>
    <!-- implement SWIPER for image gallery here -->
    <!-- v-html here -->
    <div class="banner__text" v-html="fetchData.DETAIL_TEXT"></div>
    <!-- implement files here -->
    <div
      class="banner__files"
      v-if="fetchData.FILE && fetchData.FILE.length > 0"
    >
      <p class="banner__annotation">Приложенные файлы:</p>
      <AppDocument
        class="pages-content-modal__files-file"
        v-for="item in fetchData.FILE"
        :key="item.fileId"
        :fileTitle="item.originalName"
        :fileSize="item.fileSize"
        :fileExtension="item.extension"
        :fileLink="item.fileLink"
      />
    </div>

    <!-- implement audio files here -->
    <div
      class="banner__audio"
      v-if="fetchData.AUDIOFILE && fetchData.AUDIOFILE.length > 0"
    >
      <p class="banner__annotation">Приложенные аудио-файлы:</p>
      <ul
        class="pages-content-modal__audios"
        v-if="fetchData.AUDIOFILE.length > 0"
      >
        <li
          class="pages-content-modal__audios-item"
          v-for="item in fetchData.AUDIOFILE"
          :key="item.fileId"
        >
          <audio class="banner__audio-file" controls="controls">
            <source :src="item.fileLink" :type="item.fileType" />
          </audio>
        </li>
      </ul>
    </div>
    <!-- implement photogallery here! -->
    <div
      class="banner__gallery"
      v-if="fetchData.IMAGES && fetchData.IMAGES.length > 0"
    >
      <p class="banner__annotation">Фотогалерея:</p>
      <BannerImageGallery :images="fetchData.IMAGES" />
    </div>
    <!-- implement video playback here -->
    <div
      class="banner__video"
      v-if="fetchData.VIDEOFILE && fetchData.VIDEOFILE.length > 0"
    >
      <p class="banner__annotation">Приложенные видео-файлы:</p>
      <div
        class="pages-content-modal__video-item"
        v-for="slide in fetchData.VIDEOFILE"
        :key="slide.fileId"
      >
        <video class="banner__video-file" controls>
          <!-- #t=0.1 в src нужно что бы в сафари подгружался первый кадр на видео, как превью -->
          <source :src="`${slide.fileLink}#t=0.1`" :type="slide.fileType" />
        </video>
      </div>
    </div>
  </AppModal>
</template>

<script>
import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import BannerImageGallery from "./BannerImageGallery.vue";
export default {
  name: "BannerPageModal",

  components: {
    AppModal,
    AppDocument,
    BannerImageGallery,
  },

  props: {
    pageID: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isDataLoading: true,
      fetchData: [],
    };
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("closeModal");
    },
    async getContentPageData() {
      try {
        this.isDataLoading = true;
        const response = await axios.get(
          `/mobileapp/api/banners/page?pageId=${this.pageID}`
        );
        if (response) {
          this.fetchData = response.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isDataLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.getContentPageData();
  },
};
</script>

<style scoped lang="scss">
.banner {
  &__header {
    @extend .h3;
    color: var(--gray900);
  }
  &__text {
    @extend .body-2;
    margin-top: var(--v-rhythm-2);
  }
  &__files {
    margin-top: var(--v-rhythm-6);
  }
  &__gallery {
    margin-top: var(--v-rhythm-6);
  }
  &__audio {
    margin-top: var(--v-rhythm-6);
    &-file {
      width: 100%;
    }
  }
  &__video {
    margin-top: var(--v-rhythm-6);
    &-file {
      width: 100%;
    }
  }
  &__annotation {
    @extend .body-1;
    margin-bottom: var(--v-rhythm-2);
  }
}
</style>