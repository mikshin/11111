<template>
  <form class="test-form">
    <template v-if="questions.length">
      <div class="test-form__questions-list">
        <TestQuestion
          class="test-form__question"
          v-for="(question, i) in questions"
          :key="question.id"
          :question="question"
          :questionNumber="++i"
          :isComplited="isComplited"
          @emitData="getData"
        />
      </div>

      <div class="test-form__info" v-if="attempts">
        <span>Попыток:</span
        ><span class="test-form__info-value">{{ attempts }}</span>
      </div>

      <div class="test-form__info" v-if="testResult">
        <span>Результат:</span
        ><span class="test-form__info-value">{{ testResult }}</span>
      </div>
    </template>

    <div class="test-form__error-text" v-if="errorText">{{ errorText }}</div>

    <div class="test-form__btns">
      <button
        class="test-form__btn secondary-btn"
        type="reset"
        @click.prevent="reset"
      >
        {{ btnResetText }}
      </button>
      <button
        class="test-form__btn primary-btn"
        v-if="questions.length"
        type="submit"
        :disabled="!isValid"
        @click.prevent="submit"
      >
        {{ btnSubmitText }}
      </button>
    </div>
  </form>
</template>

<script>
import TestQuestion from "@/components/tests/TestQuestion.vue";

export default {
  name: "TestForm",

  components: {
    TestQuestion,
  },

  props: {
    questions: {
      type: Array,
      required: true,
    },

    attempts: {
      type: [String, Number],
      required: false,
      default: "",
    },

    testResult: {
      type: String,
      required: false,
      default: "",
    },

    btnResetText: {
      type: String,
      required: true,
    },

    btnSubmitText: {
      type: String,
      required: true,
    },

    isComplited: {
      type: Boolean,
      required: true,
    },

    errorText: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {
      answers: [],
      isValid: false,
    };
  },

  computed: {},

  methods: {
    getData(data) {
      // Проверка первичной инициализации или переключения пользователем
      const index = this.answers.findIndex(
        (item) => item.questionId === data.questionId
      );

      if (index >= 0) {
        // При переключении чекбоксов
        this.answers[index] = data;
      } else {
        // При первичной инициализации
        this.answers.push(data);
      }

      // Проверяем, что все вопросы проинициализировались
      if (this.answers.length === this.questions.length) {
        this.validate();
      }
    },

    validate() {
      for (const item of this.answers) {
        if (!item.isValid) {
          this.isValid = false;
          break;
        } else {
          this.isValid = true;
        }
      }
    },

    submit() {
      this.$emit("submit", this.answers);
    },

    reset() {
      this.$emit("reset");
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.test-form {
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__questions-list {
    max-width: 554px;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
  }

  &__question {
  }

  &__info {
    display: flex;
    gap: var(--v-rhythm-4);
    align-items: baseline;

    @extend .subtitle-1;
    color: var(--gray500);
  }

  &__info-value {
    @extend .subtitle-2;
    color: var(--gray900);
  }

  &__error-text {
    @extend .h3;
    color: var(--gray700);
  }

  &__btns {
    display: flex;
    gap: var(--v-rhythm-8);
  }

  &__btn {
  }

  @include phones {
    &__questions-list {
      max-width: unset;
      gap: var(--v-rhythm-2);
    }
  }
}
</style>