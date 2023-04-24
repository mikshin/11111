<template>
  <div class="question-card__wrapper">
    <ManagerCard :manager="card.RECIPIENT_ID" />
    <div class="question-card__information_wrapper">
      <div>
        <div class="question-card__action-naming">спрашивает</div>
        <SimplePersonCard
          :fullName="card.ANONIME ? 'Аноним' : card.CREATED_BY.FULL_NAME"
          :avatar="
            card.ANONIME ? { src: null } : { src: card.CREATED_BY.USER_PHOTO }
          "
          :profession="card.ANONIME ? null : card.CREATED_BY.UF_WORK_POSITION"
          :link="card.ANONIME ? false : true"
          :id="card.ANONIME ? '' : card.CREATED_BY.ID"
          :vacation="card.ANONIME ? false : card.CREATED_BY.VACATION"
          :fired="card.ANONIME ? false : card.CREATED_BY.FIRED"
        />
        <div class="question-card__category">
          категория:
          <span class="question-card__category-red">
            {{ card.CATEGORY }}
          </span>
        </div>
        <DialogBox :isRed="true" :dialogBody="createDialogObj" />
        <DialogBox :isRed="false" :dialogBody="updateAnswerData(card)" />
      </div>
      <div class="question-card__show_more">
        <router-link
          :to="`/questions/${card.ID}`"
          class="primary-btn question-card__show_more-btn"
        >
          Узнать подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ManagerCard from "@/components/pages/ManagerQuestions/ManagerCard.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import DialogBox from "./DialogBox.vue";

export default {
  name: "QuestionCard",

  components: {
    ManagerCard,
    SimplePersonCard,
    DialogBox,
  },

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
    createDialogObj() {
      return {
        date: this.card.CREATED_DATE,
        text: this.card.NAME,
      };
    },
  },

  methods: {
    updateAnswerData(cardInfo) {
      const answerBlock = {};
      answerBlock.ID = cardInfo.ID;
      if (cardInfo.ANSWER !== false) {
        answerBlock.date = cardInfo.ANSWER.DATE;
        answerBlock.text = cardInfo.ANSWER.TEXT;
      } else {
        answerBlock.noAnswer = true;
        answerBlock.CREATED_BY = cardInfo.CREATED_BY;
        answerBlock.RECIPIENT_ID = cardInfo.RECIPIENT_ID;
        answerBlock.WANT_KNOW_ANSWER = cardInfo.WANT_KNOW_ANSWER;
        if (cardInfo.ANSWER_REQUIRED && cardInfo.ANSWER === null) {
          answerBlock.text = "Требует ответ";
        }
        answerBlock.text = "Ожидается ответ";
        answerBlock.date = null;
      }
      return answerBlock;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.question-card {
  &__wrapper {
    background-color: var(--white900);
    padding: 24px 32px 30px 32px;
    display: flex;
    gap: 40px;
    border-bottom: 1px solid var(--gray300);
  }
  &__information_wrapper {
    background-color: var(var(--gray100));
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__action-naming {
    @extend .caption-2;
    margin-bottom: var(--v-rhythm-4);
    text-transform: capitalize;
    color: var(--gray500);
  }
  &__category {
    @extend .overline;
    color: var(--gray900);
    margin-top: var(--v-rhythm-8);
    margin-bottom: var(--v-rhythm-6);
    &-red {
      color: var(--red900);
    }
  }
  &__show_more {
    display: flex;
    padding-top: var(--v-rhythm-4);
    &--btn {
      align-self: flex-end;
    }
  }
}
@media (max-width: 768px) {
  .question-card {
    &__wrapper {
      padding: 12px 10px 15px 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}
</style>