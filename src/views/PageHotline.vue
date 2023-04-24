<template>
  <AppPage class="page-hotline">
    <div class="hotline__wrapper">
      <div class="hotline__left_side" :class="{ loading: isLoading }">
        <h2 v-if="showForm" class="hotline__left_side-header">
          Обращение на горячую линию
        </h2>
        <AppForm
          v-if="showForm"
          ref="hotlineForm"
          class="hotline__form"
          :class="{
            loading: isFromSending,
          }"
          :inputDataList="inputDataList"
          :btnSubmitText="'Отправить'"
          :isDisableSubmit="isFromSending"
          :btnResetText="'Очистить'"
          @submitForm="submitForm"
          @resetForm="resetForm"
          :key="hotlineKey"
        >
          <template #inputs>
            <InputGenerator
              :key="inputsKey"
              :inputs="fetchedFormData"
              @getInputDataList="getInputDataList"
            />
          </template>
        </AppForm>
        <div class="hotline__disclaimer" v-else>
          <div class="hotline__disclaimer-icon_wrapper">
            <svg class="hotline__disclaimer-icon">
              <use
                :xlink:href="'/img/icons/sprites/user-icons.svg?1#cross'"
              ></use>
            </svg>
          </div>

          <div class="hotline__disclaimer-text">
            Функционал временно недоступен. Попробуйте позже или обратитесь в
            Техническую поддержку.
          </div>
          <div class="hotline__disclaimer-link">
            <span
              class="hotline__disclaimer-text hotline__disclaimer-text-width"
              >Телефон:
            </span>
            <a :href="`tel:${infoData.PHONE}`">{{ infoData.PHONE }}</a>
          </div>
          <div class="hotline__disclaimer-link">
            <span
              class="hotline__disclaimer-text hotline__disclaimer-text-width"
              >Email:
            </span>
            <a :href="`mailto:${infoData.EMAIL}`">{{ infoData.EMAIL }}</a>
          </div>
        </div>
      </div>
      <div
        class="hotline__right_side"
        :class="{ loading: isDescriptionLoading }"
      >
        <div
          v-if="!isDescriptionLoading"
          v-html="fetchedDescription.information"
        ></div>
      </div>
    </div>
    <transition name="fade">
      <ErrorModal
        v-if="errorModalIsVisible"
        :btnBackText="'Назад'"
        @onClose="errorModalIsVisible = false"
      >
        <!-- Сюда можно выводить текст ошибки -->
        <template #error></template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Ваше обращение принято!`"
        :successBtnText="'Закрыть'"
        @onClose="closeSuccessModal"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import AppForm from "@/components/forms/AppForm.vue";
import InputGenerator from "@/components/forms/InputGenerator.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";
export default {
  name: "PageHotline",

  components: {
    AppPage,
    InputGenerator,
    AppForm,
    ErrorModal,
    SuccessModal,
  },

  props: {
    // some: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },
  },

  data() {
    return {
      fetchedFormData: [],
      fetchedDescription: "",
      inputsKey: 0,
      inputDataList: [],
      isLoading: true,
      isDescriptionLoading: true,
      errorModalIsVisible: false,
      successModalIsVisible: false,
      hotlineKey: 0,
      showForm: false,
      infoData: [],
      isFromSending: false,
    };
  },

  computed: {},

  methods: {
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.inputsKey++;
    },
    getInputDataList(arr) {
      this.inputDataList = arr;
    },
    resetForm() {
      this.inputsKey++;
    },
    // companyId
    async submitForm(i) {
      this.isFromSending = true;
      try {
        const response = await axios({
          method: "post",
          url: "/mobileapp/api/banners/hotLine/add",
          data: i,
        });
        if (response.status === 200) {
          this.successModalIsVisible = true;
          this.inputsKey += 1;
        }
      } catch (e) {
        console.log(e);
        if (e) {
          this.errorModalIsVisible = true;
        }
      } finally {
        this.isFromSending = false;
      }
    },
    async getFormData() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "/mobileapp/api/banners/hotLine/field"
        );
        if (response) {
          this.fetchedFormData = response.data.fields;
          if (response.data.ACCESS_SEND) {
            this.showForm = true;
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async getDescriptionData() {
      try {
        this.isDescriptionLoading = true;
        const description = await axios.get(
          "/mobileapp/api/banners/hotLine/info"
        );
        if (description) {
          this.fetchedDescription = description.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isDescriptionLoading = false;
      }
    },
    async getInfoData() {
      try {
        const response = await axios.get(
          "/mobileapp/api/footerheader/footerInfo"
        );
        if (response) {
          this.infoData = response.data.STP_CONTACT[0];
        }
      } catch (e) {
        console.log(e);
      }
    },
  },

  watch: {},

  mounted() {
    this.getDescriptionData();
    this.getFormData();
    this.getInfoData();
  },
};
</script>

<style scoped lang="scss">
.hotline {
  &__wrapper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__disclaimer {
    @extend .v-html;

    padding: var(--v-rhythm-8);

    background-color: var(--white900);

    &-icon_wrapper {
      margin-bottom: var(--v-rhythm-4);

      text-align: center;
    }

    &-icon {
      fill: var(--red500);
    }

    &-text {
      @extend .subtitle-2;

      &-width {
        width: 100px;
        display: inline-block;
      }
    }

    &-link {
      margin-top: var(--v-rhythm-2);
    }
  }

  &__left_side {
    &-header {
      @extend .h2;

      margin-bottom: var(--v-rhythm-8);
    }

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
        margin-top: var(--v-rhythm-18);
      }
    }
  }
  &__right_side {
    @extend .v-html;

    padding: var(--v-rhythm-8);

    background-color: var(--white900);

    &-header {
      @extend .h2;

      margin-bottom: var(--v-rhythm-8);
    }
  }

  &__form {
    margin-bottom: var(--v-rhythm-8);
  }

  @include phones {
    &__wrapper {
      grid-template-columns: 1fr;
    }
  }
}
</style>