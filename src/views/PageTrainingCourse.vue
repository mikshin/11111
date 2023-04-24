<template>
  <TwoColumnsLayout
    class="page-trainig-course"
    :class="{
      loading: isLoading,
    }"
    :breadcrumbsAnotherName="breadcrumbsCurrentPageName"
  >
    <template #left>
      <div class="page-trainig-course__left-column-inner">
        <TrainingCourseHeadline
          v-if="breakpoints.laptop"
          :headline="data.name"
          :isGrayHeadlineText="data.draft"
          :isShowLessonButton="isShowLessonButton"
          :hasBookmark="hasBookmark"
          :lessonBookmarkLink="lessonBookmarkLink"
          :isLoading="isFirstCourseFetching"
          @navigate-button-clicked="navigateToFirstLesson"
        ></TrainingCourseHeadline>
        <TrainingImage
          class="page-trainig-course__image"
          :status="data.status"
          :isDraft="data.draft"
          :isNewEmployee="data.new_employee"
          :src="data.image"
        ></TrainingImage>
        <div class="page-trainig-course__availablity" v-if="data.dateExpired">
          <div class="page-trainig-course__availablity-title">Доступен до:</div>
          <div class="page-trainig-course__availablity-date">
            {{ data.dateExpired }}
          </div>
        </div>
        <TrainingContentsLessons
          v-if="contents"
          :contents="contents"
        ></TrainingContentsLessons>
        <div class="page-trainig-course__lessons-count" v-if="data.totalLesson">
          <div class="page-trainig-course__lessons-headline">Всего уроков:</div>
          <div class="page-trainig-course__lessons-counter">
            {{ data.totalLesson }}
          </div>
        </div>
        <TrainingContentsTests
          v-if="tests"
          :courseId="courseId"
          :tests="tests"
        ></TrainingContentsTests>
      </div>
    </template>
    <template #right>
      <TrainingCourseHeadline
        v-if="!breakpoints.laptop"
        :headline="data.name"
        :isGrayHeadlineText="data.draft"
        :isShowLessonButton="isShowLessonButton"
        :hasBookmark="hasBookmark"
        :lessonBookmarkLink="lessonBookmarkLink"
        :isLoading="isFirstCourseFetching"
        @navigate-button-clicked="navigateToFirstLesson"
      ></TrainingCourseHeadline>
      <div class="page-trainig-course__description" v-if="data.text">
        <div class="page-trainig-course__description-headline">
          Описание курса
        </div>
        <div
          class="page-trainig-course__description-content v-html"
          v-html="data.text"
        ></div>
      </div>
    </template>
  </TwoColumnsLayout>
</template>

<script>
import axios from "axios";

import TwoColumnsLayout from "@pagesLayouts/TwoColumnsLayout.vue";

import TrainingImage from "@components/training/TrainingImage.vue";
import TrainingContentsTests from "@components/training/TrainingContentsTests.vue";
import TrainingContentsLessons from "@components/training/TrainingContentsLessons.vue";
import TrainingCourseHeadline from "@components/training/TrainingCourseHeadline.vue";

export default {
  name: "PageTrainingСourse",

  components: {
    TwoColumnsLayout,
    TrainingImage,
    TrainingContentsTests,
    TrainingContentsLessons,
    TrainingCourseHeadline,
  },

  data() {
    return {
      data: {},
      isLoading: false,
      isFirstCourseFetching: false,
      contents: null,
      tests: null,
    };
  },

  methods: {
    async getDataPage() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/learning/info`,
          params: {
            courseId: this.courseId,
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
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCourseStart() {
      try {
        this.isFirstCourseFetching = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/learning/courseStart`,
          data: {
            courseId: this.courseId,
          },
        });

        if (response.data.firstId) {
          this.$router.push({
            path: `/training/${this.courseId}/e_${response.data.firstId}`,
          });
        } else if (response.data.status && !this.isLoading) {
          await this.getDataPage();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isFirstCourseFetching = false;
      }
    },
    async getChapters() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/learning/chapters`,
          params: {
            parentId: this.courseId,
          },
        });

        this.contents = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getTests() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/learning/test/list`,
          params: {
            courseId: this.courseId,
          },
        });

        this.tests = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    navigateToFirstLesson() {
      if (!this.hasBookmark && !this.isFirstCourseFetching) {
        this.fetchCourseStart();
      }
    },
  },

  computed: {
    courseId() {
      return this.$route.params.coursId;
    },
    lessonBookmarkLink() {
      return this.data.bookmark;
    },
    hasBookmark() {
      return Boolean(this.data.bookmark && this.data.status);
    },
    isShowLessonButton() {
      return this.hasBookmark || !this.data.status;
    },
    breadcrumbsCurrentPageName() {
      return this.data.name;
    },
    breakpoints() {
      return this.$store.getters.breakpoints;
    },
  },

  mounted() {},

  created() {
    this.getDataPage();
    this.getChapters();
    this.getTests();
  },
};
</script>

<style lang="scss" scoped>
.page-trainig-course {
  &__left-column-inner {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__image {
  }

  &__availablity {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-2);

    @extend .subtitle-1;
  }

  &__lessons-count {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-4);
  }

  &__lessons-headline {
    color: var(--gray500);
    font-weight: 700;
    @extend .caption-1;
  }

  &__lessons-counter {
    color: var(--gray900);
    @extend .subtitle-1;
  }

  &__description-headline {
    margin-bottom: var(--v-rhythm-4);

    color: var(--gray500);
    @extend .caption-2;
  }

  &__description-text {
    @extend .body-2;
  }
}
</style>
