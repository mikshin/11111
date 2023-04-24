<template>
  <AppModal class="simple_vacation-modal" @onClose="close" :maxWidth="'600'">
    <div class="simple_vacation__wrapper">
      <div class="simple_vacation__header">Остатки отпусков</div>
      <div class="simple_vacation__text">
        После обработки запроса на вашу электронную почту будет направлен отчет
        «Остатки отпусков»
      </div>
      <div class="simple_vacation__buttons">
        <button class="simple_vacation__submit primary-btn" @click="submit">
          Заказать
        </button>
        <button class="simple_vacation__cancel secondary-btn" @click="cancel">
          Отменить
        </button>
      </div>
    </div>
    <transition name="fade">
      <ErrorModal
        v-if="errorModalIsVisible"
        :btnBackText="'Назад'"
        @onClose="closeErrorModal"
      >
        <!-- Сюда можно выводить текст ошибки -->
        <template #error>
          <div>Внимание!</div>
          <div>Ошибка при отправке запроса возникла ошибка</div>
        </template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Ваш запрос успешно отправлен`"
        :successBtnText="'Закрыть'"
        @onClose="closeSuccessModal"
      />
    </transition>
  </AppModal>
</template>

<script>
import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";
export default {
  name: "SimpleVacationModal",

  components: { AppModal, ErrorModal, SuccessModal },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      errorModalIsVisible: false,
      successModalIsVisible: false,
    };
  },

  computed: {},

  methods: {
    async submit() {
      try {
        const response = await axios.post(`/mobileapp/api/vacation/addRequest`);
        if (response.status === 200) {
          this.successModalIsVisible = true;
        }
      } catch (e) {
        if (e) {
          this.errorModalIsVisible = true;
        }
      }
    },
    cancel() {
      this.close();
    },
    close() {
      this.$emit("onClose");
    },
    closeErrorModal() {
      this.errorModalIsVisible = false;
      this.close();
    },
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.close();
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.simple_vacation {
  &__header {
    @extend .h3;
    margin-bottom: var(--v-rhythm-4);
  }
  &__text {
    @extend .body-1;
    margin-bottom: var(--v-rhythm-8);
  }
  &__buttons {
    display: flex;
    justify-content: space-between;
  }
}
</style>