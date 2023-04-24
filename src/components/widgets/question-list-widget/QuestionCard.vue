<template>
  <div class="">
    <QuestionCardQuestion :question="getQuestion" />
    <QuestionCardAnswer :answer="getAnswer(card)" />
  </div>
</template>

<script>
import QuestionCardQuestion from "./QuestionCardQuestion.vue";
import QuestionCardAnswer from "./QuestionCardAnswer.vue";
export default {
  name: "QuestionCard",

  components: { QuestionCardQuestion, QuestionCardAnswer },

  props: {
    card: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    getQuestion() {
      return {
        CREATED_DATE: this.card.CREATED_DATE,
        QUESTION: this.card.NAME,
        ANONIME: this.card.ANONIME,
        CREATED_BY: this.card.ANONIME ? null : this.card.CREATED_BY,
        ID: this.card.ID,
      };
    },
  },

  methods: {
    getAnswer(cardInfo) {
      const answerBlock = {};
      answerBlock.ID = cardInfo.ID;
      answerBlock.RECIPIENT_ID = cardInfo.RECIPIENT_ID;
      if (cardInfo.ANSWER !== false) {
        answerBlock.DATE = cardInfo.ANSWER.DATE;
        answerBlock.TEXT = cardInfo.ANSWER.TEXT;
      } else {
        answerBlock.noAnswer = true;
        answerBlock.CREATED_BY = cardInfo.CREATED_BY;
        answerBlock.WANT_KNOW_ANSWER = cardInfo.WANT_KNOW_ANSWER;
        if (cardInfo.ANSWER_REQUIRED && cardInfo.ANSWER === null) {
          answerBlock.TEXT = "Требует ответа";
        }
        answerBlock.TEXT = "Ожидается ответ";
        answerBlock.DATE = null;
      }
      return answerBlock;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>