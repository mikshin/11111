<template>
  <Form
    class="manager-answer-form"
    :class="{ loading: isLoading }"
    ref="form"
    @onValidate="onValid"
  >
    <InputTemplate
      class="manager-answer-form__input-template"
      v-for="(input, i) in inputs"
      :key="i"
      :input="input"
    />

    <!-- Этот блок с файлами появляется при редактировании задачи, если в ней есть файлы -->
    <template v-if="defaultFiles">
      <AppDocument
        class="manager-answer-form__files"
        v-for="file in defaultFilesData"
        :key="file.ID"
        :fileTitle="file.originalName"
        :fileSize="file.fileSize"
        :fileExtension="file.extension"
        :fileLink="file.fileLink"
        :fileId="file.fileId"
        :hasButtonCross="true"
        @clickCross="deleteFile"
      />
    </template>

    <div class="manager-answer-form__btns">
      <button
        class="manager-answer-form__btn primary-btn"
        type="submit"
        @click.prevent="sendForm"
        :disabled="!isFormValid"
      >
        Опубликовать
      </button>

      <button
        class="manager-answer-form__btn secondary-btn"
        type="reset"
        @click.prevent="reset"
      >
        Отменить
      </button>
    </div>
  </Form>
</template>

<script>
import axios from "axios";
import Form from "@/components/UI/formTemplate.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "ManagerAnswerForm",

  components: {
    Form,
    InputTemplate,
    AppDocument,
  },

  props: {
    answerId: {
      type: String,
      required: true,
    },

    questionId: {
      type: String,
      required: true,
    },

    defaultText: {
      type: String,
      required: true,
    },

    defaultFiles: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      isFormValid: false,
      inputs: [],
      errorModalIsVisible: false,
      defaultFilesData: this.defaultFiles,
      idDeleteFiles: [],
    };
  },

  computed: {
    isEditMode() {
      return this.defaultText || this.defaultFiles.length > 0 ? true : false;
    },
  },

  methods: {
    // Получаем данные для инпутов с сервера
    async getInputs() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: "/mobileapp/api/question/answer/fields",
        });

        // добавляем дефолтное значение в текст
        if (this.defaultText) {
          response.data.find((item) => item.type === "textarea").defaultValue =
            this.defaultText;
        }

        this.inputs = response.data;
      } catch {
        this.inputs = [];
      } finally {
        this.isLoading = false;
      }
    },

    reset() {
      this.$emit("answerReset");
    },

    onValid(data) {
      this.isFormValid = data.data;
    },

    async sendForm() {
      try {
        this.isLoading = true;
        await axios({
          method: "post",
          url: `/mobileapp/api/question/answer/${
            this.isEditMode ? "update" : "add"
          }`,
          data: this.getDataForm(),
        });

        this.$emit("answerUpdate");
      } catch (error) {
        alert(
          "Произошла ошибка! Попробуйте повторить через некоторое время или обратитесь к администратору потала"
        );
      } finally {
        this.isLoading = false;
      }
    },

    getDataForm() {
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
              // если режим редактирования то файлы добавляются в FILES_ADD, если нет то подставляется имя из инпута
              form.append(
                `${this.isEditMode ? "FILES_ADD" : item.input.name}[]`,
                filesArr[k]
              );
            }
          }
        }

        if (item.newValue) {
          form.append(item.input.name, item.newValue);
        }
      }

      // если режим редактирования
      if (this.isEditMode) {
        // если есть удаленные файлы, то добавляем их в FILES_DELETE[]
        if (this.idDeleteFiles.length > 0) {
          this.idDeleteFiles.forEach((item) => {
            form.append("FILES_DELETE[]", item);
          });
        }

        // добавляем id ответа
        form.append("answerId", this.answerId);
      } else {
        // добавляем id вопроса
        form.append("questionId", this.questionId);
      }

      return form;
    },

    deleteFile(fileID) {
      this.idDeleteFiles.push(fileID);

      this.defaultFilesData = this.defaultFilesData.filter(
        (item) => item.fileId !== fileID
      );
    },
  },

  watch: {},

  mounted() {
    this.getInputs();
  },
};
</script>

<style scoped lang="scss">
.manager-answer-form {
  &__input-template {
  }

  &__files {
    margin-top: var(--v-rhythm-4);
  }

  &__btns {
    margin-top: var(--v-rhythm-7);

    display: flex;
    gap: var(--v-rhythm-4);
  }

  &__btn {
  }
}
</style>