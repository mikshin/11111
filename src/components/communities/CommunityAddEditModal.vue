<template>
  <AppModal
    class="community-add-edit-modal"
    v-if="isVisible"
    @onClose="closePopup"
    :maxWidth="'600'"
  >
    <div class="community-add-edit-modal__conent">
      <div class="community-add-edit-modal__header">
        <div class="community-add-edit-modal__title">
          {{ isEdit ? "Редактировать сообщество" : "Новое сообщество" }}
        </div>
      </div>

      <AppForm
        class="community-add-edit-modal__form"
        :inputDataList="inputDataList"
        :btnSubmitText="isEdit ? 'Сохранить' : 'Создать'"
        :btnResetText="isEdit ? null : 'Очистить'"
        @submitForm="submitForm"
        @resetForm="resetForm"
        @cancelForm="cancelForm"
      >
        <template #inputs>
          <InputGenerator
            class="community-add-edit-modal__input-generator"
            :class="{ loading: isLoading }"
            :key="inputsKey"
            :inputs="inputs"
            @getInputDataList="getInputDataList"
          />
        </template>
      </AppForm>
    </div>

    <transition name="fade">
      <ErrorModal
        v-if="errorModalIsVisible"
        :btnBackText="
          isEdit ? 'Вернуться к редактированию' : 'Вернуться к созданию'
        "
        @onClose="errorModalIsVisible = false"
        @repeat="submitForm"
      >
        <!-- Сюда можно выводить текст ошибки -->
        <template #error></template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Сообщество успешно ${
          isEdit ? 'обновлено' : 'добавлено'
        }!`"
        :successBtnText="'Закрыть'"
        @onClose="closeSuccessModal"
      />
    </transition>
  </AppModal>
</template>

<script>
import axios from "axios";
import AppModal from "@/components/modals/AppModal.vue";
import InputGenerator from "@/components/forms/InputGenerator.vue";
import AppForm from "@/components/forms/AppForm.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";

export default {
  name: "CommunityAddEditModal",

  components: {
    AppModal,
    InputGenerator,
    AppForm,
    ErrorModal,
    SuccessModal,
  },

  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },

    id: {
      type: String,
      required: false,
    },

    isEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      isLoading: false,
      inputsKey: 0,
      inputs: [],
      inputDataList: [],
      errorModalIsVisible: false,
      successModalIsVisible: false,

      communityAddId: null,
    };
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit("onClose");
    },

    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.$emit("update", this.communityAddId);
      this.closePopup();
    },

    cancelForm() {
      this.closePopup();
    },

    resetForm() {
      this.inputsKey++;
    },

    async submitForm(inputsData) {
      try {
        this.isLoading = true;

        if (this.isEdit) inputsData.append("GROUP_ID", this.id);

        const response = await axios({
          method: "post",
          url: this.isEdit
            ? "/mobileapp/api/group/update"
            : "/mobileapp/api/group/add",
          data: inputsData,
        });

        if (!this.isEdit) {
          this.communityAddId = response.data.id;
        }

        this.successModalIsVisible = true;
        setTimeout(() => {
          if (this.successModalIsVisible) {
            this.closeSuccessModal();
          }
        }, 3000);
      } catch (error) {
        this.errorModalIsVisible = true;
      } finally {
        this.isLoading = false;
      }
    },

    getInputDataList(arr) {
      this.inputDataList = arr;
    },

    async getInputs() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: this.isEdit
            ? `/mobileapp/api/group/fieldEdit?groupId=${this.id}`
            : `/mobileapp/api/group/getField`,
        });

        this.inputs = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  watch: {
    isVisible() {
      if (this.isVisible) {
        this.getInputs();
      }
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.community-add-edit-modal {
  &__conent {
  }

  &__header {
    margin-bottom: var(--v-rhythm-8);
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }

  &__form {
  }

  &__input-generator {
    margin-bottom: var(--v-rhythm-8);
  }

  ::v-deep {
    .input-generator {
      &__text,
      &__textarea {
        margin-bottom: var(--v-rhythm-2);
      }

      &__file,
      &__сheckbox,
      &__search-persons {
        margin-bottom: var(--v-rhythm-6);
      }

      *:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>