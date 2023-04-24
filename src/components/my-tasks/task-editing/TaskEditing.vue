<template>
  <div class="task-editing__conent">
    <div class="task-editing__title">{{ modalTitle }}</div>
    <Form class="task-editing__form" ref="form" @onValidate="onValid">
      <Input
        class="task-editing__form-input"
        v-for="input in inputList"
        :key="input.name"
        :input="input"
      />

      <!-- Этот блок с файлами появляется при редактировании задачи, если в ней есть файлы -->
      <template v-if="defaultFiles">
        <AppDocument
          class="task-editing__files"
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

      <Input :input="inputSearchPerson" />

      <div class="task-editing__creator">
        <div class="task-editing__creator-title">Постановщик</div>
        <SimplePersonCard
          class="task-editing__creator-person"
          :avatar="{
            alt: currentUser.FULL_NAME,
            src: currentUser.USER_PHOTO,
          }"
          :fullName="currentUser.FULL_NAME"
          :isMiniSize="true"
          :link="true"
          :id="currentUser.ID"
          :vacation="currentUser.VACATION"
          :fired="currentUser.FIRED"
        />
      </div>

      <Input
        class="task-editing__form-input-date"
        :lazyValidation="true"
        :input="inputDate"
      />

      <div class="task-editing__form-btns">
        <button class="primary-btn" @click="sendForm" :disabled="!isFormValid">
          Сохранить
        </button>
        <button class="secondary-btn" type="reset" @click="$emit('cancel')">
          Отменить
        </button>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/UI/formTemplate.vue";
import Input from "@/components/UI/inputTemplate.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import { dateConverter } from "@/assets/scripts/scripts.js";
import AppDocument from "@/components/UI/document/AppDocument.vue";

export default {
  name: "TaskEditing",

  components: {
    Form,
    Input,
    SimplePersonCard,
    AppDocument,
  },

  props: {
    modalTitle: {
      type: String,
      required: false,
      default: "Добавить задачу",
    },

    defaultTitle: {
      type: String,
      required: false,
    },

    defaultDescription: {
      type: String,
      required: false,
    },

    defaultAccomplices: {
      type: Array,
      required: false,
    },

    defaultFiles: {
      type: Array,
      required: false,
    },

    defaultDate: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      isFormValid: false,
      inputList: [
        {
          type: "text",
          placeholder: "Название задачи",
          required: true,
          name: "TITLE",
          maxLength: 100,
          defaultValue: this.defaultTitle,
        },
        {
          type: "editor",
          name: "DESCRIPTION",
          maxLength: 1700,
          editorType: "text",
          uniqId: `vue-editor-${Math.round(
            (Date.now() * Math.random()) / Math.random()
          )}`,
          canAttachFile: false,
          defaultValue: this.defaultDescription,
          placeholder: "Описание задачи",
          listIsUnder: true,
        },
        {
          type: "file",
          name: "FILES",
          multiple: true,
          maxSize: 20971520,
          accept:
            ".pdf, .rar, .7z, .zip, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .jpeg, .jpg, .png, .gif",
        },
      ],

      inputSearchPerson: {
        type: "search-persons",
        name: "ACCOMPLICES",
        placeholder: "Ответственный",
        required: true,
        autocomplete: "off",
        defaultValue: this.defaultAccomplices,
      },

      defaultFilesData: this.defaultFiles,
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
    inputDate() {
      let fromDate = new Date();

      if (this.defaultDate) {
        const dateWithoutTime = this.defaultDate.split(" ")[0];
        const unixDate = dateWithoutTime.split(".").reverse().join("-");
        fromDate = new Date(`${unixDate}T00:00:00`);
      }

      return {
        type: "date",
        placeholder: "Срок выполнения",
        required: false,
        name: "DEADLINE",
        defaultValue: this.defaultDate,
        autocomplete: "off",
        fromDate,
      };
    },
  },

  methods: {
    deleteFile(fileID) {
      this.defaultFilesData = this.defaultFilesData.filter(
        (item) => item.fileId !== fileID
      );
    },

    onValid(data) {
      this.isFormValid = data.data;
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
              form.append(`${item.input.name}[]`, filesArr[k]);
            }
          }
        }
        if (item.newValue) {
          if (item.input.type === "date") {
            form.append(item.input.name, dateConverter(item.newValue, true));
          } else if (item.input.type === "search-persons") {
            for (let val in item.newValue) {
              form.append(`${item.input.name}[]`, item.newValue[val].ID);
            }
          } else {
            if (
              typeof item.newValue === "object" ||
              Array.isArray(item.newValue)
            ) {
              for (let val in item.newValue) {
                form.append(`${item.input.name}[]`, item.newValue[val]);
              }
            } else {
              form.append(item.input.name, item.newValue);
            }
          }
        }
      }

      // Добавляем ID файлов, которые уже были прикреплены к задаче
      if (this.defaultFilesData && this.defaultFilesData.length > 0) {
        for (let val in this.defaultFilesData) {
          form.append(`FILES_OLD[]`, this.defaultFilesData[val].ID);
        }
      }

      return form;
    },

    sendForm() {
      this.$emit("sendForm", this.getDataForm());
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.task-editing {
  &__title {
    margin-bottom: var(--v-rhythm-8);

    @extend .h3;
    color: var(--gray900);
  }

  &__form {
  }

  &__form-input {
    // Правим стили плагина, что бы тултип не вылезал за пределы попапа. !TODO посмотреть плагин, возможно есть настройки.
    ::v-deep {
      .ql-snow .ql-tooltip {
        position: unset;
        transform: unset;
        white-space: unset;
      }
    }
  }

  &__form-input-date {
    width: 273px;
  }

  &__files {
    margin: var(--v-rhythm-6) 0;
  }

  &__creator {
    margin: var(--v-rhythm-6) 0;
    display: flex;
    flex-direction: column;
  }

  &__creator-title {
    padding: var(--v-rhythm-1) 0;
    margin-bottom: var(--v-rhythm-2);

    @extend .caption-2;
    color: var(--gray500);
  }

  &__creator-person {
    align-self: flex-start;
  }

  &__form-btns {
    margin-top: var(--v-rhythm-8);

    display: flex;
    gap: var(--v-rhythm-4);
  }

  @include phones {
    &__form-input-date {
      width: 100%;
    }
  }

  @media screen and (max-width: 500px) {
    &__form-input {
      // Правим стили плагина, что бы тултип не вылезал за пределы попапа. !TODO посмотреть плагин, возможно есть настройки.
      ::v-deep {
        .ql-snow .ql-tooltip[data-mode="link"]::before {
          display: block;
        }
      }
    }
  }
}
</style>