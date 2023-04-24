<template>
  <div class="widget_container">
    <div class="widget_headline widget_headline--dark">
      <h3>{{ name }}</h3>
    </div>
    <div class="widget_content">
      <div class="payroll">
        <div class="payroll__description">
          Выберите год и месяц расчетного периода, нажмите кнопку заказать и
          расчетный лист будет направлен на вашу эл. почту
        </div>
        <div class="payroll__year">
          <div class="payroll__year-description">Год расчетного периода</div>
          <div class="payroll__year-wrapper">
            <button
              class="payroll__year-button"
              @click="currentYear--"
              :disabled="currentYear === thisYear - 2"
            >
              <UserIcons :iconName="'arrow-left'" />
            </button>

            <span>{{ currentYear }}</span>

            <button
              class="payroll__year-button"
              @click="currentYear++"
              :disabled="currentYear === thisYear"
            >
              <UserIcons :iconName="'arrow-right'" />
            </button>
          </div>
        </div>
        <div class="payroll__month">
          <Input :input="input" @onChange="selectMonth" :key="currentYear" />
        </div>
        <div class="payroll__actions">
          <button
            class="primary-btn"
            @click="sendForm"
            :class="{ 'primary-btn--disabled': month === '' }"
            :disabled="month === ''"
          >
            Заказать
          </button>
          <a class="text-btn text-btn--disabled" disabled
            >Частые вопросы по начислениям</a
          >
          <a class="text-btn" @click="showModalAskQuestion = true"
            >Задать вопрос по начислениям</a
          >
        </div>
      </div>
    </div>

    <transition name="fade">
      <AskQuestionAccruals
        v-if="showModalAskQuestion"
        :photoContestId="1"
        @close="showModalAskQuestion = !showModalAskQuestion"
      />
    </transition>
    <transition name="fade">
      <AppModal
        v-if="showModal"
        @onClose="showModal = !showModal"
        :maxWidth="'600'"
      >
        <div class="modal__wrapper">
          <div class="modal__headline">Ваш запрос успешно отправлен</div>
        </div>
      </AppModal>
    </transition>
  </div>
</template>

<script>
import Input from "../UI/inputTemplate.vue";
import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import AskQuestionAccruals from "@/components/modals/AskQuestionAccruals.vue";

export default {
  name: "lkPayroll",

  components: {
    Input,
    AppModal,
    AskQuestionAccruals,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      month: "",
      thisYear: new Date().getFullYear(),
      currentYear: new Date().getFullYear(),
      showModal: false,
      showModalAskQuestion: false,
      months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ].map((item, i) => {
        return {
          label: item,
          code: `${i + 1}`,
        };
      }),
      todayDay: new Date().getDate(),
      todayMonth: new Date().getMonth(),
      input: {
        type: "select",
        placeholder: "Месяц",
        selectValue: [],
      },
    };
  },

  computed: {},

  methods: {
    getSelectValue() {
      let selectValue = [...this.months];

      if (
        this.currentYear === this.thisYear - 1 &&
        this.todayMonth === 0 &&
        this.todayDay < 15
      ) {
        selectValue.pop();
      } else if (this.thisYear === this.currentYear) {
        const cutIndex =
          this.todayDay > 14 ? this.todayMonth : this.todayMonth - 1;
        selectValue = selectValue.splice(0, cutIndex);
      }

      this.input.selectValue = selectValue;
    },

    getMonths() {
      return [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ].map((item, i) => {
        return {
          label: item,
          code: `${i + 1}`,
        };
      });
    },

    selectMonth(data) {
      if (data.data.newValue) this.month = data.data.newValue.code;
    },

    sendForm() {
      axios
        .post(
          `/mobileapp/api/user_payroll/addPayrollRequest?MONTH=${this.month}&YEAR=${this.currentYear}`
        )
        .then(() => {
          this.showModal = true;
          setTimeout(() => {
            this.showModal = false;
          }, 2000);
        });
    },
  },

  watch: {
    currentYear() {
      this.getSelectValue();
    },
  },

  mounted() {
    this.getSelectValue();
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/lkWidgets";

.modal__headline {
  @extend .h3;
  color: var(--gray900);
}

.payroll {
  &__description {
    @extend .body-2;
    color: var(--gray500);
    padding-bottom: var(--v-rhythm-10);
  }
  &__year {
    padding-bottom: var(--v-rhythm-8);
  }
  &__year-description {
    @extend .subtitle-1;
    padding-bottom: var(--v-rhythm-5);
  }
  &__year-wrapper {
    display: flex;
    align-items: center;
    span {
      @extend .subtitle-2;
      color: var(--red900);
      padding: 0 12px;
    }
  }
  &__year-button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: var(--red300);
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--red900);
    &:disabled {
      cursor: not-allowed;
      background-color: var(--gray200);
      fill: var(--gray500);
    }
  }
  &__month {
    padding-bottom: var(--v-rhythm-12);
  }
  &__actions {
    border-top: 2px solid var(--gray200);
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-right: -16px;
    padding: var(--v-rhythm-8) 16px 0;
    display: flex;
    flex-direction: column;
    * {
      margin-bottom: var(--v-rhythm-4);
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
