<template>
  <div class="suggest__wrapper">
    <button class="primary-btn" @click="showNews">Предложить новость</button>
    <transition name="fade">
      <AppModal
        v-if="isVisible"
        @onClose="isVisible = !isVisible"
        :maxWidth="'600'"
      >
        <div class="modal__wrapper">
          <span class="suggest__headline" v-if="!isSended"
            >Предложение новости</span
          >
          <span class="suggest__headline" v-if="isSended"
            >Вы отправили предложенную новость</span
          >
          <div class="suggest__description" v-if="!isSended">
            Напишите новость, прикрепите файлы и в течение 3х дней будет принято
            решение о публикации. Мы напишем Вам на почту.
          </div>
          <Form
            ref="form"
            v-if="!isSended"
            @onValidate="onValid"
            :key="componentKey"
          >
            <Input v-for="(input, i) in inputs" :key="i" :input="input" />
            <div class="form__actions">
              <button
                class="primary-btn"
                v-bind:class="{ 'primary-btn--disabled': !isFormValid }"
                :disabled="!isFormValid"
                @click="sendForm"
              >
                Отправить
              </button>
              <button class="secondary-btn" type="reset" @click="reset">
                Очистить
              </button>
            </div>
          </Form>
        </div>
      </AppModal>
    </transition>
  </div>
</template>

<script>
import AppModal from "@/components/modals/AppModal.vue";
import Form from "../../UI/formTemplate.vue";
import Input from "../../UI/inputTemplate.vue";
import axios from "axios";
export default {
  components: {
    AppModal,
    Form,
    Input,
  },
  data() {
    return {
      componentKey: 0,
      isVisible: false,
      isSended: false,
      isFormValid: false,
      inputs: [
        {
          type: "file",
          name: "PREVIEW_PICTURE",
          placeholder: "Изображение анонса",
          maxSize: 52428800,
          accept: ".png, .gif, .jpeg, .jpg",
          required: true,
        },
        {
          type: "text",
          name: "NAME",
          placeholder: "Заголовок новости",
          required: true,
          maxLength: 100,
        },
        {
          type: "textarea",
          name: "DETAIL_TEXT",
          placeholder: "Полный текст новости",
          required: true,
        },
        {
          type: "file",
          name: "FILE",
          maxSize: 52428800,
          multiple: true,
        },
      ],
    };
  },
  methods: {
    onSended() {
      this.isSended = true;
      setTimeout(() => {
        this.isVisible = false;
        this.isSended = false;
      }, 1000);
    },
    showNews() {
      this.isVisible = true;
      axios.post("mobileapp/api/statistic/add", {
        ACTION_CODE: "news.offer",
        MODULE: "news",
        EXTRA_PARAMS: {
          TITLE: "Предложение новости",
          URL: "/offerNews",
        },
      });
    },
    onValid(data) {
      this.isFormValid = data.data;
    },
    sendForm() {
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

      axios.post("mobileapp/api/news/offerNew/", form).then((response) => {
        if (response.data.status === "success") {
          this.isSended = true;
          setTimeout(() => {
            this.isVisible = false;
            this.isSended = false;
          }, 1000);
        }
      });
    },
    reset() {
      this.isFormValid = false;
      this.componentKey += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.suggest {
  &__headline {
    @extend .h3;
    margin-bottom: var(--v-rhythm-4);
    display: block;
  }
  &__description {
    @extend .body-2;
    margin-bottom: var(--v-rhythm-4);
    display: block;
  }
  &__wrapper {
    margin-left: 40px;
  }
}

.form__actions {
  display: flex;
  padding-top: 12px;
  button {
    margin-right: 12px;
  }
}
</style>
