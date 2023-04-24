<template>
  <AppPage
    class="page-manager-question"
    :breadcrumbsAnotherName="breadcrumbsAnotherName"
    :noTitle="true"
  >
    <div class="page-manager-question__content" :class="{ loading: isLoading }">
      <template v-if="questionData">
        <div class="page-manager-question__content-header">
          <div class="page-manager-question__category">
            Категория:
            <span class="page-manager-question__category-title">{{
              questionData.CATEGORY.label
            }}</span>
          </div>
          <div class="page-manager-question__title">
            {{ questionData.NAME }}
          </div>
        </div>

        <div class="page-manager-question__content-main">
          <ManagerQuestion
            class="page-manager-question__question"
            v-if="questionData && answernData"
            :questionData="questionData"
            :recipient="answernData.RECEPIENT_ID"
            @questionUpdate="questionUpdate"
          />

          <ManagerAnswer
            class="page-manager-question__answer"
            v-if="answernData"
            :answernData="answernData"
            :specialID="getAuthorID()"
            :isLoading="answerIsLoading"
            @answerUpdate="getAnswer"
          />
        </div>
      </template>

      <div class="page-manager-question__text-default" v-else>
        Вопрос не найден
      </div>
    </div>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import ManagerQuestion from "@/components/manager-question/manager-question/ManagerQuestion.vue";
import ManagerAnswer from "@/components/manager-question/manager-answer/ManagerAnswer.vue";

export default {
  name: "PageManagerQuestion",

  components: {
    AppPage,
    ManagerQuestion,
    ManagerAnswer,
  },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      isLoading: false,
      answerIsLoading: false,

      questionData: null,
      answernData: null,
    };
  },

  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },

    breadcrumbsAnotherName() {
      return `Вопрос ${
        this.questionData && this.questionData.NAME
          ? this.questionData.NAME
          : null
      }`;
    },
  },

  methods: {
    getAuthorID() {
      if (!this.isLoading) {
        if (this.questionData.CREATED_BY?.ID) {
          return this.questionData.CREATED_BY.ID;
        }
      }
    },
    async getData() {
      try {
        this.isLoading = true;
        await this.getQuestion();
        await this.getAnswer();
      } finally {
        this.isLoading = false;
      }
    },

    async getQuestion() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/question/info?questionId=${this.id}`,
        });
        this.questionData = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getAnswer() {
      try {
        this.answerIsLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/question/answer/info?questionId=${this.id}`,
        });
        this.answernData = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.answerIsLoading = false;
      }
    },

    async questionUpdate() {
      try {
        this.isLoading = true;
        await this.getQuestion();
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {},

  mounted() {
    this.getData();
  },
};
</script>

<style scoped lang="scss">
.page-manager-question {
  &__content {
  }

  &__content-header {
    width: calc(672 * 100% / 1376);
    margin-bottom: var(--v-rhythm-8);
  }

  &__category {
    margin-bottom: var(--v-rhythm-4);

    @extend .overline;
    color: var(--gray900);
  }

  &__category-title {
    color: var(--red900);
  }

  &__title {
    @extend .h2;
    color: var(--gray900);
    word-break: break-word;
  }

  &__content-main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__question {
    width: 100%;
  }

  &__answer {
    width: 100%;
  }

  &__text-default {
    @extend .h2;
    color: var(--gray500);
  }

  @include phones {
    &__content-main {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>