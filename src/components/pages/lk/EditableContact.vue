<template>
  <div
    class="editable-contact"
    :class="{ loading: isLoading }"
    v-click-outside="closeEdit"
  >
    <EditableInput
      class="editable-contact__editable-input"
      :type="type"
      :placeholder="placeholder"
      :editingIsOpen="editing"
      @changeEditing="(e) => (editing = e)"
      @saveChange="saveChange"
    >
      <span class="editable-contact__value">{{
        contactData ? contactData : "Не указан"
      }}</span>
    </EditableInput>
    <span class="editable-contact__error-message" v-if="!isValid && editing">{{
      errorMessage
    }}</span>
  </div>
</template>

<script>
import EditableInput from "@/components/UI/inputs/EditableInput.vue";
import axios from "axios";

export default {
  name: "EditableContact",

  components: { EditableInput },

  props: {
    contact: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      editing: false,
      isLoading: false,
      value: "",
      contactData: "",
      isValid: true,
    };
  },

  computed: {
    requestData() {
      let data;
      if (this.type === "tel") {
        data = {
          WORK_PHONE: this.value,
        };
      } else if (this.type === "email") {
        data = {
          PERSONAL_MAILBOX: this.value,
        };
      }
      return data;
    },

    errorMessage() {
      let data;
      if (this.type === "tel") {
        data = "Некорректный номер телефона";
      } else if (this.type === "email") {
        data = data = "Некорректный email";
      }
      return data;
    },
  },

  methods: {
    closeEdit() {
      this.editing = false;
      this.isValid = true;
    },

    saveChange(e) {
      console.log("sadasd");

      this.value = e;
      this.validate();
      if (this.isValid) {
        this.saveData();
        this.closeEdit();
      }
    },

    async saveData() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "post",
          url: `mobileapp/api/user/update`,
          data: this.requestData,
        });
        if (response.request.status === 202) {
          alert(response.data.message);
        } else {
          this.contactData = this.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    validate() {
      if (this.type === "tel") {
        return this.value.length === 16
          ? (this.isValid = true)
          : (this.isValid = false);
      } else if (this.type === "email") {
        const re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        return re.test(this.value)
          ? (this.isValid = true)
          : (this.isValid = false);
      } else {
        this.isValid = true;
      }
    },
  },

  watch: {
    contact() {
      this.contactData = this.contact;
    },
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
.editable-contact {
  &__editable-input {
  }

  &__value {
  }

  &__error-message {
    display: block;
    margin-top: var(--v-rhythm-1);

    color: var(--red900);
    @extend .caption-2;
  }

  @include phones {
    &__error-message {
      margin-top: 2px;
    }
  }
}
</style>
