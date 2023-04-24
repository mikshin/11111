<template>
  <div
    class="question-card__question_wrapper"
    @click="showFullQuestion(question.ID)"
  >
    <p class="question-card__name">
      {{ name }}
    </p>
    <p v-if="!question.ANONIME" class="question-card__post">
      {{ workPosition }}
    </p>
    <p class="question-card__text">{{ question.QUESTION }}</p>
    <p class="question-card__date">{{ question.CREATED_DATE }}</p>
    <span class="question-card__tail question-card__tail-left">
      <span class="question-card__tail-inset"></span>
    </span>
  </div>
</template>

<script>
export default {
  name: "QuestionCardQuestion",

  components: {},

  props: {
    question: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      name: "",
      workPosition: "",
    };
  },

  computed: {},

  methods: {
    showFullQuestion(id) {
      this.$router.push(`/questions/${id}`);
    },
    updateQuestionInfo(question) {
      if (this.question.ANONIME) {
        this.name = "Анонимный вопрос";
      } else {
        this.name = question.CREATED_BY.FULL_NAME + ",";
        this.workPosition = question.CREATED_BY.UF_WORK_POSITION;
      }
    },
  },

  watch: {},

  mounted() {
    this.updateQuestionInfo(this.question);
  },
};
</script>

<style scoped lang="scss">
.question-card {
  &__question_wrapper {
    width: 100%;
    background-color: var(--red300);
    border-radius: var(--v-rhythm-1);
    border-bottom-left-radius: 0;
    padding: 6px 10px 1px 10px;
    position: relative;
    margin-left: 5px;
    cursor: pointer;
  }
  &__name {
    @extend .subtitle-1;
  }
  &__post {
    @extend .caption-1;
  }
  &__text {
    @extend .body-1;
    margin-top: var(--v-rhythm-2);
  }
  &__date {
    @extend .caption-1;
    text-align: right;
    color: var(--gray500);
  }
  &__tail {
    position: absolute;
    width: 8px;
    height: 10px;
    bottom: 0;
    display: block;
    background-color: var(--red300);
    left: -8px;
  }
  &__tail-inset {
    background-color: var(--white900);
    border-radius: 0% 0% 100% 0%;
    width: 8px;
    height: 10px;
    display: block;
    &-right {
      border-radius: 0% 0% 0% 100%;
    }
  }
}
</style>