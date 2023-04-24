<template>
  <AppModal class="request_ppe-modal" @onClose="close" :maxWidth="'600'">
    <div class="request_ppe__wrapper">
      <div class="request_ppe__header">Заявка на карточку всех СИЗ</div>
      <div class="request_ppe__text">
        При отправке запроса, на вашу электронную почту будет направлена Личная
        карточка учёта выдачи средств индивидуальной защиты
      </div>
      <div class="request_ppe__buttons">
        <button class="request_ppe__submit primary-btn" @click="submit">
          Заказать
        </button>
        <button class="request_ppe__cancel secondary-btn" @click="cancel">
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
          <div>Ошибка при отправке заявки на СИЗ</div>
        </template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Заявка на СИЗ успешно отправлена`"
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
  name: "PPEModal",

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

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    async submit() {
      try {
        const response = await axios.post(`/mobileapp/api/siz/addAppeal`);
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
.request_ppe {
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
    gap: var(--v-rhythm-4);
  }
}
</style>