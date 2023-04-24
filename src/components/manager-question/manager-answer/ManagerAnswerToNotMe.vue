<template>
  <div class="manager-answer-to-not-me">
    <QuestionAnswerMain
      class="manager-answer-to-not-me__main"
      v-if="text"
      :questionId="questionId"
      :text="text"
      :files="files"
      :hasSubscription="hasSubscription"
    />

    <QuestionAnswerFooter
      class="manager-answer-to-not-me__footer"
      v-if="date"
      :date="date"
    />

    <div class="manager-answer-to-not-me__text-default" v-if="!text">
      <span>Ожидается ответ </span>
      <TooltipButton
        v-if="authorID !== currentUser.ID"
        class="manager-answer-to-not-me__text-default-icon"
        :iconName="'bell'"
        :content="subscription ? 'Вы ожидаете ответ' : 'Уведомить об ответе'"
        :isRed="subscription"
        @clickEvent="toggleAnswerReminder"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QuestionAnswerMain from "@/components/manager-question/question-answer/QuestionAnswerMain.vue";
import QuestionAnswerFooter from "@/components/manager-question/question-answer/QuestionAnswerFooter.vue";
import TooltipButton from "@/components/UI/tooltip/TooltipButton.vue";

export default {
  name: "ManagerAnswerToNotMe",

  components: {
    QuestionAnswerMain,
    QuestionAnswerFooter,
    TooltipButton,
  },

  props: {
    questionId: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    files: {
      type: Array,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    hasSubscription: {
      type: Boolean,
      required: true,
    },

    authorID: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      subscription: this.hasSubscription,
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
    type() {
      return this.subscription ? "remove" : "add";
    },
  },

  methods: {
    async toggleAnswerReminder() {
      try {
        const response = await axios.post(`/mobileapp/api/question/reminder`, {
          type: this.type,
          questionId: this.questionId,
        });
        if (response) {
          this.subscription = !this.subscription;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.manager-answer-to-not-me {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__text-default {
    display: flex;
    gap: var(--v-rhythm-2);
    align-items: center;

    @extend .body-2;
    color: var(--gray900);
  }

  &__text-default-icon {
  }
}
</style>