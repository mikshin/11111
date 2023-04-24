<template>
  <AppModal
    class="service_request__modal"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <div class="service_request_modal__wrapper" :class="{ loading: isLoading }">
      <div class="service_request_modal__header">Задать вопрос по отпускам</div>

      <AppForm
        class="service_request_modal__inputs"
        :inputDataList="inputDataList"
        :btnSubmitText="'Отправить'"
        :btnResetText="'Очистить'"
        @submitForm="submitService"
        @resetForm="resetService"
        @cancelForm="resetService"
      >
        <template #inputs>
          <InputGenerator
            v-if="!isLoading"
            :key="inputsKey"
            :inputs="serviceModalData"
            @getInputDataList="getInputDataList"
          />
        </template>
      </AppForm>
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
          <div>Ошибка при отправке вопроса!</div>
        </template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Вопрос успешно отправлен`"
        :successBtnText="'Закрыть'"
        @onClose="closeSuccessModal"
      />
    </transition>
  </AppModal>
</template>

<script>
import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import AppForm from "@/components/forms/AppForm.vue";
import InputGenerator from "../forms/InputGenerator.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";
export default {
  name: "VacationModal",

  components: { AppModal, InputGenerator, AppForm, ErrorModal, SuccessModal },

  props: {},

  data() {
    return {
      serviceModalData: {},
      isLoading: true,
      inputDataList: [],
      errorModalIsVisible: false,
      successModalIsVisible: false,
      inputsKey: 0,
    };
  },

  computed: {},

  methods: {
    async getServiceModalFields() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          `/mobileapp/api/vacation/getVacationAppealField`
        );
        if (response) {
          this.serviceModalData = response.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    // /mobileapp/api/vacation/addVacationAppeal
    async submitService(i) {
      try {
        this.isLoading = true;
        // i.append("serviceId", this.serviceID);
        const response = await axios({
          method: "post",
          url: "/mobileapp/api/vacation/addVacationAppeal",
          data: i,
        });
        if (response.status === 200) {
          this.successModalIsVisible = true;
          this.inputsKey += 1;
          this.isLoading = false;
        }
      } catch (e) {
        console.log(e);
        if (e) {
          this.errorModalIsVisible = true;
        }
      }
    },

    resetService() {
      this.inputsKey++;
    },
    getInputDataList(arr) {
      this.inputDataList = arr;
    },

    closePopup() {
      this.isSended = false;
      this.$emit("closeModal");
    },
    closeErrorModal() {
      this.errorModalIsVisible = false;
      this.inputsKey++;
      this.closePopup();
    },
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.inputsKey++;
      this.closePopup();
    },
  },

  watch: {},

  mounted() {
    this.getServiceModalFields();
  },
};
</script>

<style scoped lang="scss">
.service_request_modal {
  &__header {
    @extend .h3;
    margin-bottom: var(--v-rhythm-4);
  }
  &__inputs {
    margin-top: var(--v-rhythm-8);
    ::v-deep {
      .input-generator {
        &__text,
        &__select,
        &__textarea {
          margin-bottom: var(--v-rhythm-2);
        }

        &__file,
        &__сheckbox,
        &__search-persons {
          margin-bottom: var(--v-rhythm-6);
        }
        // *:last-child {
        //   margin-bottom: var(--v-rhythm-18);
        // }
      }
      .app-form__btns {
        margin-top: var(--v-rhythm-8);
      }
    }
  }
}
</style>