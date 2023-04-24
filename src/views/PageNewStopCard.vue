<template>
  <AppPage class="stop">
    <section class="stop__information" v-if="!isSended">
      <div class="stop__wrapper">
        <div class="stop__description">
          <h2>Для чего используется:</h2>
          <div
            class="information"
            v-html="usage"
            :class="{ loading: isLoading }"
          ></div>
          <button class="primary-btn" type="button" @click="showCard">
            Заполнить Стоп-карту
          </button>
        </div>
        <StopForm v-if="isContinued" @error="newStopCardFormErrorHandler" />
      </div>
      <div class="stop__wrapper stop__wrapper--static">
        <div class="stop__description">
          <h2>Последовательность действий:</h2>
          <div
            class="information"
            v-html="sequencing"
            :class="{ loading: isLoading }"
          ></div>
        </div>
      </div>
    </section>
    <section class="final_information" v-if="isSended">
      <div class="information_wrapper">
        <h2>{{ stopMessage }}</h2>
        <button class="primary-btn" type="button" @click="showCard">
          Заполнить новую Стоп-карту
        </button>
      </div>
    </section>
    <AppModal v-if="isError" @onClose="closePopup" :maxWidth="'600'">
      {{ modalMessage }}
    </AppModal>
  </AppPage>
</template>

<script>
import AppPage from "@/components/UI/page/AppPage.vue";
import StopForm from "@/components/stop-cards/StopForm.vue";
import AppModal from "@/components/modals/AppModal.vue";
import axios from "axios";

export default {
  name: "PageNewStopCard",

  components: {
    AppPage,
    StopForm,
    AppModal,
  },

  data() {
    return {
      isContinued: false,
      isSended: false,
      isFormValid: true,
      stopMessage: "",
      usage: "",
      sequencing: "",
      isLoading: true,
      isError: false,
      modalMessage: "",
      errorCode: "",
    };
  },

  methods: {
    newStopCardFormErrorHandler() {
      this.isContinued = false;
      this.isError = true;

      if (window.navigator.onLine) {
        this.modalMessage =
          "Произошла неизвестная ошибка. Обратитесь в поддержку.";
      } else {
        this.modalMessage =
          "В данный момент отсутствует подключение к интернету. Приложение автоматически отправит данные при повторном подключении к сети. Вы можете заполнить ещё одну Стоп-карту.";
      }
    },
    closePopup() {
      this.isError = false;
      this.errorCode = null;
    },
    showCard() {
      this.isContinued = true;
      this.isSended = false;
      // this.$nextTick(() => {
      //   let position = this.$refs.form.$el.getBoundingClientRect().top;
      //   window.scrollTo({
      //     top: position,
      //     behavior: "smooth",
      //   });
      // });
    },
    setStorage() {
      if (localStorage.getItem("stopCardUsage")) {
        this.usage = localStorage.getItem("stopCardUsage");
        this.sequencing = localStorage.getItem("stopCardSequencing");
        this.isLoading = false;
      } else {
        this.usage = "Подключение к интернету отсутствует";
        this.sequencing = "Подключение к интернету отсутствует";
        this.isLoading = false;
      }
    },
  },

  mounted() {
    axios.get("/mobileapp/api/stopCardsDetail/description").then(
      (response) => {
        this.usage = response.data.USAGE;
        this.sequencing = response.data.SEQUENCING;
        this.isLoading = false;

        localStorage.setItem("stopCardUsage", response.data.USAGE);
        localStorage.setItem("stopCardSequencing", response.data.SEQUENCING);
      },
      (error) => {
        this.setStorage();
        console.log(error);
      }
    );
  },
};
</script>

<style lang="scss" scoped>
.stop {
  &__container {
  }
  &__breadcrumbs {
  }

  @include laptop {
    &__container {
      padding-right: 0;
      padding-left: 0;
    }

    &__breadcrumbs {
      padding-left: var(--mainPadding);
    }
  }
  &__information {
    display: flex;
    align-items: flex-start;

    @include laptop {
      flex-direction: column-reverse;
    }
  }
  &__wrapper {
    width: 50%;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;

    &:last-child {
      margin-right: 0;
    }

    &:only-child {
      width: 100%;
    }

    h2 {
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      margin: 0;
      margin-bottom: 16px;
      color: var(--gray500);
    }

    @include laptop {
      width: 100%;
      padding: var(--mainPadding);
    }
    &--static {
      position: sticky;
      top: calc(var(--headerHeight) + var(--v-rhythm-10));
      @include laptop {
        position: static;
      }
      // max-height: 200px;
    }
  }
  &__description {
    background-color: #fff;
    word-break: break-word;
    border: 2px solid var(--gray200);
    padding: 40px;
  }
  &__form {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0;
    margin-top: var(--v-rhythm-20);
    @include laptop {
      flex-direction: column;
    }
  }
  &__headline {
    @extend .h2;
    margin-bottom: var(--v-rhythm-8);
  }
  &__actions {
    display: flex;
    button {
      margin-right: 16px;
    }
  }
  .input_container {
    margin-top: var(--v-rhythm-6);
  }
}

.information {
  margin: 0;
  padding: 0;
  list-style-type: none;
  flex: 1;
  @extend .v-html;
}
.stop_card {
  width: 100%;
  box-sizing: border-box;

  @include desktop {
    padding: var(--mainPadding);
  }
}

.form_wrapper {
  width: 50%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  h3 {
    width: 100%;
  }

  &.left {
    padding-right: 40px;
    border-right: 1px solid var(--gray300);

    @include desktop {
      padding-right: var(--mainPadding);
    }
  }

  &.right {
    padding-left: 40px;
    flex-direction: row;
    flex-wrap: wrap;

    @include desktop {
      padding-left: var(--mainPadding);
    }

    @include phones {
      flex-direction: column;
    }
  }

  @include laptop {
    width: 100%;
    border: none !important;
    padding: 0 !important;
  }
}

fieldset {
  padding: 0;
  margin: 0;
  margin-bottom: var(--v-rhythm-8);
  border: none;
}

.left_block,
.right_block {
  width: 50%;

  @include phones {
    width: 100%;
    padding-bottom: var(--mainPadding);
  }
}

.final_information {
  width: 100%;
}
.print {
  &__headline {
    font-weight: 700;
    font-size: 30px;
    line-height: 30px;
    width: 100%;
  }
}
</style>
