<template>
  <div style="padding-right: 5px">
    <div class="question-card__answer_wrapper">
      <p class="question-card__name">
        {{ managerName }}
      </p>
      <p class="question-card__post">
        {{ managerPosition }}
      </p>
      <p class="question-card__text">
        {{ answer.TEXT }}
        <span
          v-if="showReminderIcon"
          class="question-card__inner-text-icon_wrapper"
        >
          <!-- <UserIcons :iconName="'bell'" class="dialog-box__inner-text-icon" /> -->
          <TooltipButton
            :key="bellKey"
            :iconName="'bell'"
            :content="
              answer.WANT_KNOW_ANSWER
                ? 'Вы ожидаете ответ'
                : 'Уведомить об ответе'
            "
            :isRed="answer.WANT_KNOW_ANSWER"
            @clickEvent="toggleAnswerReminder"
          />
        </span>
      </p>
      <p class="question-card__date">{{ answer.DATE }}</p>
      <span class="question-card__tail question-card__tail-right">
        <span class="question-card__tail-inset-right"></span>
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TooltipButton from "@/components/UI/tooltip/TooltipButton.vue";
export default {
  name: "QuestionCardAnswer",

  components: { TooltipButton },

  props: {
    answer: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      managerName: "",
      managerPosition: "",
      type: "remove",
      showReminderIcon: false,
      showAnserNeeded: false,
      bellKey: "bell-id-" + this.answer.ID,
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    async toggleAnswerReminder() {
      if (this.answer.WANT_KNOW_ANSWER) {
        this.type = "remove";
      } else {
        this.type = "add";
      }
      try {
        const response = await axios.post(`/mobileapp/api/question/reminder`, {
          type: this.type,
          questionId: this.answer.ID,
        });
        if (response) {
          this.answer.WANT_KNOW_ANSWER = !this.answer.WANT_KNOW_ANSWER;
          this.bellKey += 1000;
        }
      } catch (e) {
        console.log(e);
      }
    },
    updateAnswerInfo(answer) {
      this.managerName = answer.RECIPIENT_ID.FULL_NAME + ",";
      this.managerPosition = answer.RECIPIENT_ID.UF_WORK_POSITION;
    },
    canShowReminer() {
      if (this.answer.noAnswer) {
        if (
          this.answer.CREATED_BY?.ID === this.currentUser.ID ||
          this.answer.RECIPIENT_ID.ID === this.currentUser.ID
        ) {
          this.showReminderIcon = false;
          if (this.answer.RECIPIENT_ID === this.currentUser.ID) {
            this.showAnserNeeded = true;
          }
        } else {
          this.showReminderIcon = true;
        }
      }
    },
  },

  watch: {},

  mounted() {
    this.updateAnswerInfo(this.answer);
    this.canShowReminer();
  },
};
</script>

<style scoped lang="scss">
.question-card {
  &__answer_wrapper {
    width: 100%;
    background-color: var(--gray200);
    border-radius: var(--v-rhythm-1);
    border-bottom-left-radius: 0;
    padding: 6px 10px 6px 10px;
    margin-top: var(--v-rhythm-3);
    position: relative;
  }
  &__name {
    text-align: right;
    @extend .subtitle-1;
  }
  &__post {
    @extend .caption-1;
    text-align: right;
  }
  &__text {
    @extend .body-1;
    margin-top: var(--v-rhythm-2);
    display: flex;
    align-items: center;
  }
  &__date {
    @extend .caption-1;
    text-align: right;
    color: var(--gray500);
    margin-top: var(--v-rhythm-3);
  }
  &__tail {
    position: absolute;
    width: 8px;
    height: 10px;
    bottom: 0;
    display: block;

    &-right {
      background-color: var(--gray200);
      right: -8px;
    }
  }
  &__tail-inset-right {
    background-color: var(--white900);
    width: 8px;
    height: 10px;
    display: block;
    border-radius: 0% 0% 0% 100%;
  }
  &__inner-text {
    @extend .body-1;
    color: var(--gray900);
    margin-top: var(--v-rhythm-2);
    display: flex;
    align-items: center;
    &-icon_wrapper {
      width: var(--v-rhythm-4);
      height: var(--v-rhythm-4);
      border-radius: var(--v-rhythm-2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: var(--v-rhythm-2);
      cursor: pointer;
      &:hover {
        background-color: var(--gray300);
      }
    }
    &-icon {
      fill: var(--gray500);
      width: 13px;
      height: 15px;
    }
  }
}
</style>