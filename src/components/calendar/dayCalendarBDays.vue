<template>
  <div class="calendar__day__bdays">
    <div
      class="calendar__day__items"
      v-for="(item, index) in bdays"
      :key="`person${index}`"
    >
      <SimplePersonCard
        class=""
        :avatar="{
          src: item.USER_PHOTO,
          alt: item.FULL_NAME,
        }"
        :fullName="item.FULL_NAME"
        :profession="item.UF_WORK_POSITION"
        :link="true"
        :id="item.ID"
        :vacation="item.VACATION"
        :fired="item.FIRED"
      />
      <button
        v-if="item.accessCongratulate"
        class="birthday__button"
        @click="congratulate(item.ID)"
      >
        <SimpleTooltip :iconName="'cake'" :content="'Поздравить'" />
      </button>

      <button
        class="birthday__button"
        v-else-if="item.accessReminderAdd"
        @click="remind(item)"
      >
        <SimpleTooltip :iconName="'bell'" :content="'Напомнить'" />
      </button>
    </div>

    <AppModal
      v-if="isModalShwon"
      @onClose="isModalShwon = !isModalShwon"
      :maxWidth="'600'"
    >
      <div class="modal__wrapper">
        <div class="modal__headline" v-if="isRemind">
          {{ text }}
        </div>
        <template v-else
          ><div class="modal__headline">Введите текст поздравления</div>
          <Input
            :input="{
              type: 'textarea',
              name: 'text',
              placeholder: 'Текст поздравления',
              required: true,
              maxLength: 500,
            }"
            @onChange="change"
          />
          <button
            class="primary-btn"
            :disabled="!congratMessage.length"
            @click="onSended"
          >
            Отправить
          </button>
        </template>
      </div>
    </AppModal>
  </div>
</template>

<script>
import Input from "@/components/UI/inputTemplate.vue";
import AppModal from "@/components/modals/AppModal.vue";
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";
import axios from "axios";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";

export default {
  name: "DayCalendarBDays",

  components: {
    SimpleTooltip,
    AppModal,
    Input,
    SimplePersonCard,
  },

  data() {
    return {
      isModalShwon: false,
      isRemind: false,
      text: "Напоминание добавлено",
      congratMessage: "",
      congratID: 0,
    };
  },

  props: {
    bdays: Array,
  },

  computed: {
    setupBDayStatus() {
      return (e) => {
        e.accessCongratulate ?? e.accessReminderAdd;
      };
    },
  },

  methods: {
    congratulate(el) {
      this.isRemind = false;
      this.isModalShwon = true;
      this.congratID = el;
    },
    remind(item) {
      axios
        .post("/mobileapp/api/birthday/addReminder/", {
          birthdayUserId: item.ID,
        })
        .then(() => {
          this.isRemind = true;
          this.text = "Напоминание добавлено";
          this.isModalShwon = true;
          setTimeout(() => {
            this.isModalShwon = false;
          }, 1000);
          item.accessReminderAdd = false;
        });
    },
    onSended() {
      axios
        .post("/mobileapp/api/birthday/add", {
          recipientId: this.congratID,
          text: this.congratMessage,
        })
        .then(() => {
          this.isRemind = true;
          this.text = "Ваше поздравление успешно отправлено";
          setTimeout(() => {
            this.isModalShwon = false;
          }, 1000);
        });
    },
    change(data) {
      this.congratMessage = data.data.newValue;
    },
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
.calendar__day__bdays {
  width: 100%;
  height: max-content;
}
.calendar__day__items {
  padding: 8px 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--v-rhythm-2);
  background-color: var(--white900);
}
</style>