<template>
  <AppModal class="upload-photo-popup" @onClose="closePopup" :maxWidth="'600'">
    <Form ref="form" @onValidate="onValidate" :class="{ loading: isLoaded }">
      <span class="upload-photo-popup__title">Принять участие</span>
      <template v-if="!sended">
        <InputTemplate
          v-for="(input, i) in inputs"
          :key="i"
          :input="input"
          @onChange="changeInput"
        />
      </template>
      <template v-else>
        <p class="upload-photo-popup__paragraph">
          Ваше изображение успешно добавлено! <br />Ожидайте подтверждения
          публикации!
        </p>
      </template>
      <p class="upload-photo-popup__error" v-html="errorMessage"></p>
      <div class="upload-photo-popup__button-wrapper">
        <button
          @click="send"
          class="primary-btn"
          :disabled="!isFormNotDisabled"
          v-if="!sended"
        >
          Отправить
        </button>
        <button
          @click="closePopup"
          :class="!sended ? 'secondary-btn' : 'primary-btn'"
        >
          {{ !sended ? "Отменить" : "Закрыть" }}
        </button>
      </div>
    </Form>
  </AppModal>
</template>

<script>
import AppModal from "./AppModal.vue";
import Form from "@/components/UI/formTemplate.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import axios from "axios";
import { number } from "yargs";
export default {
  name: "ModalAddPhoto",

  components: { AppModal, InputTemplate, Form },

  props: {
    photoContestId: { type: number, required: true },
  },

  data() {
    return {
      inputs: [],
      isFormNotDisabled: false,
      isLoaded: true,
      sended: false,
      errorMessage: "",
      formData: {},
    };
  },

  methods: {
    changeInput(data) {
      this.formData[data.data.input.name] = data.data.newValue;
      this.errorMessage = "";
    },
    closePopup() {
      this.$emit("close");
    },
    send() {
      let form = new FormData();
      for (let child in this.$refs.form.$children) {
        let item = this.$refs.form.$children[child];
        if (item.files) {
          if (item.input.type === "file") {
            const filesArr = [];
            item._data.files.forEach((i) => {
              const newName = /\s/g.test(i.name)
                ? i.name.trim().replace(/\s/g, "_")
                : i.name;
              filesArr.push(new File([i], newName, { type: i.type }));
            });
            for (let k = 0; k < filesArr.length; k++) {
              form.append(item.input.name + "[]", filesArr[k]);
            }
          }
        }
        if (item.newValue) {
          if (item.input.type === "select" || item.input.type === "radio") {
            form.append(item.input.name, item.newValue.code);
          } else {
            if (typeof item.newValue === "object") {
              for (let val in item.newValue) {
                form.append(item.input.name + "[]", item.newValue[val]);
              }
            } else {
              form.append(item.input.name, item.newValue);
            }
          }
        }
      }
      form.append("photoContestId", this.photoContestId);
      axios
        .post("/mobileapp/api/photoContest/photo/add", form)
        .then(() => {
          this.sended = true;
          this.error = "";
          setTimeout(() => {
            this.$emit("close");
          }, 3000);
        })
        .catch((error) => {
          this.errorMessage = error.response.data.errorMessage;
          this.isFormNotDisabled = false;
        });
    },
    onValidate(data) {
      this.isFormNotDisabled = data.data;
    },
    loadInputs() {
      axios.get("/mobileapp/api/photoContest/photo/fields").then((response) => {
        this.isLoaded = false;
        this.inputs = response.data;
        this.createInputs();
      });
    },
    createInputs() {
      for (let i in this.inputs) {
        this.$set(this.formData, this.inputs[i].name, undefined);
      }
    },
  },
  mounted() {
    this.loadInputs();
  },
};
</script>

<style scoped lang="scss">
.upload-photo-popup {
  &__button-wrapper {
    display: flex;
    column-gap: var(--v-rhythm-4);
    margin-top: var(--v-rhythm-9);
  }
  &__title {
    @extend .h3;
    display: block;
    margin-bottom: var(--v-rhythm-4);
  }

  &__paragraph {
    @extend .body-2;
    margin-bottom: var(--v-rhythm-8);
  }
  &__error {
    @extend .caption-2;
    color: var(--red900);
    margin-bottom: var(--v-rhythm-8);
  }

  input {
    margin-bottom: var(--v-rhythm-9);
  }
}

.input_container {
  margin-bottom: var(--v-rhythm-2);
}
</style>