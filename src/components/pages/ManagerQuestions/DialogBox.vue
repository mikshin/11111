<template>
  <div class="dialog-box__left" :class="{ 'dialog-box__right': isRed }">
    <div
      class="dialog-box__wrapper"
      :class="{ 'dialog-box__wrapper-red': isRed }"
    >
      <div class="dialog-box__type" :class="{ 'dialog-box__type-red': isRed }">
        <span v-if="isRed">Вопрос:</span>
        <span v-else>Ответ:</span>
      </div>
      <div class="dialog-box__inner-text">
        <span v-if="!isQuestionForMe()">{{
          stringLength(dialogBody.text)
        }}</span>
        <span v-else>Требует ответа</span>
        <span
          v-if="showIcon() && !isQuestionForMe()"
          class="dialog-box__inner-text-icon_wrapper"
        >
          <!-- <UserIcons :iconName="'bell'" class="dialog-box__inner-text-icon" /> -->
          <TooltipButton
            :key="bellKey"
            :iconName="'bell'"
            :content="
              dialogBody.WANT_KNOW_ANSWER
                ? 'Вы ожидаете ответ'
                : 'Уведомить об ответе'
            "
            :isRed="dialogBody.WANT_KNOW_ANSWER"
            @clickEvent="toggleAnswerReminder"
          />
        </span>
        <span
          v-if="isQuestionForMe()"
          class="dialog-box__inner-text-icon_wrapper"
        >
          <TooltipButton
            style="transform: rotate(180deg)"
            :key="bellKey"
            :iconName="'info'"
            :content="'Требует ответ'"
            :isRed="true"
          />
        </span>
      </div>
      <div class="dialog-box__date">
        {{ dialogBody.date }}
      </div>
      <span
        class="dialog-box__tail dialog-box__tail-left"
        :class="{ 'dialog-box__tail-right': isRed }"
      >
        <span
          class="dialog-box__tail-inset"
          :class="{ 'dialog-box__tail-inset-right': isRed }"
        ></span>
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TooltipButton from "@/components/UI/tooltip/TooltipButton.vue";
export default {
  name: "dialogBox",

  components: { TooltipButton },

  props: {
    isRed: {
      type: Boolean,
    },
    dialogBody: {
      type: Object,
    },
  },

  data() {
    return {
      type: "remove",
      showReminderIcon: false,
      showAnserNeeded: false,
      bellKey: this.dialogBody.ID ? "bell-id-" + this.dialogBody.ID : "",
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    stringLength(str) {
      let updatedString = str;
      if (str.length > 40) {
        updatedString = str.slice(0, 40) + "...";
      }
      return updatedString;
    },
    async toggleAnswerReminder() {
      if (this.dialogBody.WANT_KNOW_ANSWER) {
        this.type = "remove";
      } else {
        this.type = "add";
      }
      try {
        const response = await axios.post(`/mobileapp/api/question/reminder`, {
          type: this.type,
          questionId: this.dialogBody.ID,
        });
        if (response) {
          this.dialogBody.WANT_KNOW_ANSWER = !this.dialogBody.WANT_KNOW_ANSWER;
          this.bellKey += 1000;
        }
      } catch (e) {
        console.log(e);
      }
    },
    canShowReminer() {
      if (this.dialogBody.noAnswer) {
        if (this.dialogBody.CREATED_BY.ID == this.currentUser.ID) {
          this.showReminderIcon = false;
          return;
        }
        if (this.dialogBody.RECIPIENT_ID.ID == this.dialogBody.CREATED_BY.ID) {
          this.showReminderIcon = false;
          return;
        } else this.showReminderIcon = true;
      }
    },
    showIcon() {
      if (this.dialogBody.noAnswer) {
        if (this.dialogBody.CREATED_BY.ID == this.currentUser.ID) {
          return false;
        }
        if (this.dialogBody.RECIPIENT_ID.ID == this.dialogBody.CREATED_BY.ID) {
          if (this.dialogBody.CREATED_BY.ID !== this.currentUser.ID) {
            return true;
          } else return false;
        } else return true;
      }
    },
    isQuestionForMe() {
      if (this.dialogBody.noAnswer) {
        if (this.dialogBody.RECIPIENT_ID.ID == this.currentUser.ID) {
          return true;
        } else {
          return false;
        }
      }
    },
  },

  watch: {},

  mounted() {
    // this.canShowReminer();
  },
};
</script>

<style scoped lang="scss">
.dialog-box {
  &__left {
    display: flex;
    justify-content: flex-start;
  }
  &__right {
    display: flex;
    justify-content: flex-end;
  }
  &__wrapper {
    width: 80%;
    background-color: var(--gray200);
    border-radius: var(--v-rhythm-1);
    border-bottom-left-radius: 0;
    padding: 6px 10px 1px 10px;
    margin-top: var(--v-rhythm-3);
    position: relative;
    &-red {
      background-color: var(--red300);
      border-bottom-right-radius: 0;
    }
  }
  &__tail {
    position: absolute;
    width: 8px;
    height: 10px;
    bottom: 0;
    display: block;
    &-left {
      background-color: var(--gray200);
      left: -8px;
    }
    &-right {
      background-color: var(--red300);
      left: auto;
      right: -8px;
    }
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
  &__type {
    @extend .subtitle-1;
    color: var(--gray900);
    &-red {
      color: var(--red900);
    }
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
  &__date {
    @extend .caption-1;
    color: var(--gray900);
    text-align: right;
    width: 100%;
    margin-top: var(--v-rhythm-3);
  }
}
</style>