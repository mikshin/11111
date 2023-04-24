<template>
  <AppPage
    class="page-self-test"
    :isLoading="pageIsLoading"
    :noTitle="true"
    :breadcrumbsFullPath="pageData ? pageData.breadcrumbs : null"
  >
    <div class="page-self-test__content" v-if="pageData">
      <div class="page-self-test__header">
        <div class="page-self-test__test-name">{{ testName }}</div>
        <div
          class="page-self-test__test-description"
          v-if="pageData.testDescription"
          v-html="pageData.testDescription"
        ></div>
      </div>

      <TestForm
        class="page-self-test__test-form"
        :class="{ loading: formIsLoading }"
        :key="formKey"
        :questions="pageData.data"
        :btnResetText="'Назад к уроку'"
        :btnSubmitText="isComplited ? 'Пройти ещё раз' : 'Завершить'"
        :isComplited="isComplited"
        :errorText="
          pageData.error && pageData.error.text ? pageData.error.text : null
        "
        @reset="goToBack"
        @submit="complete"
      />
    </div>

    <transition name="fade">
      <TestBreakModal
        :isVisible="testBreakModalIsOpen"
        @close="closeTestBreakModal"
        @breakTest="breakTest"
      />
    </transition>

    <transition name="fade">
      <ErrorModal
        v-if="errorModalIsVisible"
        :btnBackText="'Вернуться к тесту'"
        @onClose="errorModalIsVisible = false"
        @repeat="submit"
      >
        <!-- Сюда можно выводить текст ошибки -->
        <template #error></template>
      </ErrorModal>
    </transition>
  </AppPage>
</template>

<script>
import { getLessonId } from "@utils";
import axios from "axios";

import AppPage from "@/components/UI/page/AppPage.vue";
import TestForm from "@/components/tests/TestForm.vue";
import TestBreakModal from "@/components/tests/TestBreakModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";

export default {
  name: "PageSelfTest",

  components: {
    AppPage,
    TestForm,
    TestBreakModal,
    ErrorModal,
  },

  props: {},

  data() {
    return {
      pageData: null,
      answers: [],
      pageIsLoading: true,
      formIsLoading: false,
      testBreakModalIsOpen: false,
      isComplited: false,
      brakeIsConfirmed: false,
      toPath: null,
      errorModalIsVisible: false,
      formKey: Date.now(),
    };
  },

  computed: {
    lessonId() {
      return getLessonId(this.$route.params.lessonId);
    },

    testName() {
      const testName = this.pageData
        ? this.pageData.breadcrumbs[this.pageData.breadcrumbs.length - 1].name
        : "";

      return testName;
    },

    backUrl() {
      return this.pageData.breadcrumbs[this.pageData.breadcrumbs.length - 2]
        .path;
    },
  },

  methods: {
    async getDataPage() {
      try {
        this.answers = [];
        this.isComplited = false;
        const response = await axios({
          method: "get",
          url: "/mobileapp/api/learning/selfcheck",
          params: {
            lessonUrl: this.$route.path,
            chapterId: this.lessonId,
          },
        });

        // Если теста не существует
        if (!response.data) {
          this.$router.replace("/404");
        } else if (
          response.data.error &&
          response.data.error.type === "notAccess"
        ) {
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
          this.pageData = response.data;
          this.formKey = Date.now();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.pageIsLoading = false;
      }
    },

    complete(answers) {
      if (!this.isComplited) {
        this.submit(answers);
      } else {
        this.refresh();
      }
    },

    refresh() {
      this.getDataPage();
    },

    async submit(answers) {
      try {
        if (answers) this.getValue(answers);

        this.formIsLoading = true;
        const response = await axios({
          method: "post",
          url: "/mobileapp/api/learning/selfcheck/accept",
          data: {
            chapterId: this.lessonId,
            answers: this.answers,
          },
        });

        this.isComplited = true;

        this.pageData.data = response.data.data;
      } catch (error) {
        this.errorModalIsVisible = true;
      } finally {
        this.formIsLoading = false;
      }
    },

    getValue(arr) {
      this.answers = [];
      arr.forEach((item) => {
        const answer = { questionId: item.questionId, answer: item.value };
        this.answers.push(answer);
      });
    },

    openTestBreakModal() {
      this.testBreakModalIsOpen = true;
    },

    closeTestBreakModal() {
      this.testBreakModalIsOpen = false;
    },

    goToBack() {
      this.$router.push(this.backUrl);
    },

    breakTest() {
      this.brakeIsConfirmed = true;
      this.$router.push(this.toPath);
    },
  },

  watch: {},

  mounted() {
    this.getDataPage();
  },

  beforeRouteLeave(to, from, next) {
    if (this.pageData && !this.pageData.error) {
      if (this.isComplited || this.brakeIsConfirmed) {
        next();
      } else {
        this.toPath = to;
        this.openTestBreakModal();
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped lang="scss">
.page-self-test {
  &__content {
  }

  &__header {
    margin-bottom: var(--v-rhythm-4);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-8);
  }

  &__test-name {
    @extend .h2;
    color: var(--gray900);
  }

  &__test-description {
    @extend .v-html;
  }

  &__test-form {
    max-width: 1024px;
    padding-top: var(--v-rhythm-4);

    border-top: 2px solid var(--gray300);
  }
}
</style>