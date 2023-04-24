<template>
  <TwoColumnsLayout
    class="page-training-lesson"
    :class="{
      loading: isLoading,
    }"
    :breadcrumbsFullPath="data.breadcrumbs"
  >
    <template #left>
      <div class="page-training-lesson__left-column-inner">
        <TrainingLessonHeadline
          v-if="breakpoints.laptop"
          key="headline-mobile"
          :headline="data.name"
          :isBookmarkActive="bookmarkStatus"
          :isShowBookmarkTooltip="isShowBookmarkTooltip"
          @bookmark-clicked="bookmarkClickHandler"
        ></TrainingLessonHeadline>
        <TrainingImage
          class="page-training-lesson__image"
          :status="data.status"
          :isDraft="data.draft"
          :isNewEmployee="data.new_employee"
          :src="data.image"
        ></TrainingImage>
        <TrainingContentsLessons
          v-if="contents"
          :contents="contents"
        ></TrainingContentsLessons>
      </div>
    </template>
    <template #right>
      <TrainingLessonHeadline
        v-if="!breakpoints.laptop"
        key="headline-desktop"
        :headline="data.name"
        :isBookmarkActive="bookmarkStatus"
        :isShowBookmarkTooltip="isShowBookmarkTooltip"
        @bookmark-clicked="bookmarkClickHandler"
      ></TrainingLessonHeadline>
      <div class="page-training-lesson__description" v-if="data.text">
        <div
          class="page-training-lesson__description-content v-html"
          v-html="data.text"
        ></div>
      </div>
      <div class="page-training-lesson__materials" v-if="isShowMaterials">
        <div class="page-training-lesson__materials-headline">
          Материалы курса
        </div>
        <div class="page-training-lesson__materials-content">
          <TrainingMaterialsBlock
            headline="Изображения"
            v-if="data.medialibrary && data.medialibrary.length"
          >
            <TrainingImagesGallery
              :images="data.medialibrary"
            ></TrainingImagesGallery>
          </TrainingMaterialsBlock>
          <TrainingMaterialsBlock
            v-if="data.video && data.video.length"
            headline="Видео"
          >
            <TrainingVideos :videos="data.video"></TrainingVideos>
          </TrainingMaterialsBlock>
          <TrainingMaterialsBlock
            headline="Аудио"
            v-if="data.audio && data.audio.length"
          >
            <TrainingAudios :audios="data.audio"></TrainingAudios>
          </TrainingMaterialsBlock>
          <TrainingMaterialsBlock
            headline="Документы"
            v-if="data.files && data.files.length"
          >
            <TrainingDocuments
              v-if="data.files && data.files.length"
              :files="data.files"
            ></TrainingDocuments>
          </TrainingMaterialsBlock>
        </div>
      </div>
      <router-link
        v-if="data.selfCheckTest"
        class="page-training-lesson__self-test-link primary-btn"
        to="self_test"
        :append="true"
        >Пройти тест для самопроверки</router-link
      >
      <div class="page-training-lesson__other-lessons-links">
        <router-link
          class="page-training-lesson__self-test-link primary-btn"
          :class="{
            'primary-btn--disabled': !previousElementLink,
          }"
          :to="previousElementLink"
        >
          <UserIcons iconName="arrow-left"></UserIcons>
          Предыдущий
        </router-link>
        <!-- Поменять местами предыдущий и следующий -->
        <router-link
          class="page-training-lesson__self-test-link primary-btn"
          :class="{
            'primary-btn--disabled': !nextElementLink,
          }"
          :to="nextElementLink"
        >
          Следующий
          <UserIcons iconName="arrow-right"></UserIcons>
        </router-link>
      </div>
    </template>
  </TwoColumnsLayout>
</template>

<script>
import axios from "axios";
import { getLessonId } from "@utils";

import TwoColumnsLayout from "@pagesLayouts/TwoColumnsLayout.vue";

import TrainingImage from "@components/training/TrainingImage.vue";
import TrainingContentsLessons from "@components/training/TrainingContentsLessons.vue";
import TrainingMaterialsBlock from "@components/training/TrainingMaterialsBlock.vue";
import TrainingAudios from "@components/training/TrainingAudios.vue";
import TrainingVideos from "@components/training/TrainingVideos.vue";
import TrainingDocuments from "@components/training/TrainingDocuments.vue";
import TrainingImagesGallery from "@components/training/TrainingImagesGallery.vue";
import TrainingLessonHeadline from "@components/training/TrainingLessonHeadline.vue";

export default {
  name: "PageTrainingLesson",

  components: {
    TwoColumnsLayout,
    TrainingAudios,
    TrainingVideos,
    TrainingDocuments,
    TrainingImage,
    TrainingContentsLessons,
    TrainingMaterialsBlock,
    TrainingImagesGallery,
    TrainingLessonHeadline,
  },

  data() {
    return {
      data: {},
      isLoading: false,
      contents: null,
      bookmarkStatus: false,
    };
  },

  methods: {
    async getDataPage() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/learning/chapters/info`,
          params: {
            lessonId: this.lessonId,
            lessonUrl: this.lessonUrl,
          },
        });

        if (!response.data) {
          this.$router.replace("/404");
        } else if (response.data.error) {
          this.$router.push({
            name: "Нет доступа",
            replace: true,
            params: {
              breadcrumbs: response.data.breadcrumbs,
              urlBtn: "/training",
              TextBtn: "К обучению",
              description: response.data.error.text,
            },
          });
        } else {
          this.data = response.data;
        }
        this.bookmarkStatus = Boolean(response.data.bookmark);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getChapters() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/learning/chapters`,
          params: {
            parentId: this.lessonId,
          },
        });

        this.contents = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchSettingBookmark() {
      try {
        await axios({
          method: "post",
          url: `/mobileapp/api/learning/bookmark`,
          data: {
            courseId: this.courseId,
            elementId: this.lessonId,
            status: this.bookmarkStatus,
            lessonUrl: this.lessonUrl,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    async bookmarkClickHandler() {
      this.bookmarkStatus = !this.bookmarkStatus;

      await this.fetchSettingBookmark();
    },
  },

  computed: {
    courseId() {
      return this.$route.params.coursId;
    },
    lessonId() {
      return Number(getLessonId(this.$route.params.lessonId));
    },
    lessonUrl() {
      return this.$route.path;
    },
    isShowMaterials() {
      return (
        this.data.medialibrary?.length ||
        this.data.video?.length ||
        this.data.audio?.length ||
        this.data.files?.length
      );
    },
    isShowBookmarkTooltip() {
      return this.data.bookmarkSetAnother && !this.bookmarkStatus;
    },
    breakpoints() {
      return this.$store.getters.breakpoints;
    },
    nextElementLink() {
      return this.data?.nextElementID || "";
    },
    previousElementLink() {
      return this.data?.previousElementId || "";
    },
  },

  mounted() {
    this.getChapters();
    this.getDataPage();
  },

  watch: {
    async $route() {
      this.contents = null;
      this.data = {};
      await this.getDataPage();
      await this.getChapters();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-training-lesson {
  &__left-column-inner {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__image {
  }

  &__description {
    margin-bottom: var(--v-rhythm-16);
  }

  &__description-headline {
    margin-bottom: var(--v-rhythm-4);

    color: var(--gray500);
    @extend .caption-2;
  }

  &__description-text {
    @extend .body-2;
  }

  &__materials {
    margin-bottom: var(--v-rhythm-8);
  }

  &__materials-headline {
    margin-bottom: var(--v-rhythm-8);

    @extend .h3;
  }

  &__materials-content {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-6);
  }

  &__self-test-link {
    width: max-content;
    max-width: 100%;
    margin-bottom: var(--v-rhythm-12);
  }

  &__other-lessons-links {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }
}
</style>
