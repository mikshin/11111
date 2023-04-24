<template>
  <div class="input-file">
    <label
      class="input-file__label"
      v-if="input.multiple || defaultFiles.length === 0"
    >
      <input
        class="input-file__hidden-input visually-hidden"
        :name="input.name"
        :required="input.required"
        type="file"
        @change="fileInput"
        :multiple="input.multiple"
        :disabled="input.disabled"
        @input="validate"
        :accept="fileFormats"
      />

      <div
        class="input-file__info"
        :class="{
          'input-file__info--disabled': input.disabled,
          'input-file__info--error': errors.length > 0,
        }"
      >
        <span
          class="input-file__info-title"
          :class="{ required: input.required }"
          >Выберите файл
          <template v-if="input.placeholder"
            >«{{ input.placeholder }}»</template
          ></span
        >
        <!-- <span class="input-file__info-subtitle">или перетащите его сюда</span> -->

        <ul class="input-file__info-parametrs">
          <li class="input-file__info-parametr" v-if="input.maxSize">
            Максимальный размер:
            <span class="input-file__info-parametr-bold"
              >{{ input.maxSize / 1048576 }} Мб</span
            >
          </li>
          <li class="input-file__info-parametr">Формат: {{ fileFormats }}</li>
        </ul>
      </div>
    </label>

    <FileListV2
      class="input-file__file-list"
      v-if="addFiles.length > 0"
      :files="addFiles"
      @deleteFile="deleteFile"
    />

    <InputErrors class="input-file__errors" :errors="errors" />

    <div class="input-file__default-files" v-if="defaultFiles.length > 0">
      <AppDocument
        class="input-file__default-file"
        v-for="file in defaultFiles"
        :key="file.ID"
        :fileTitle="file.originalName"
        :fileSize="file.fileSize"
        :fileExtension="file.extension"
        :fileLink="file.fileLink"
        :fileId="file.fileId"
        :hasButtonCross="true"
        :disabled="input.disabled"
        @clickCross="deleteDefaultFile(file.fileId)"
      />
    </div>
  </div>
</template>

<script>
import InputErrors from "./assets/InputErrors.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import FileListV2 from "@/components/UI/inputs/FileListV2.vue";

export default {
  name: "InputFileV2",

  components: {
    InputErrors,
    AppDocument,
    FileListV2,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      type: "file",
      name: this.input.name,
      deleteName: this.input.deleteName,
      addFiles: [],
      defaultFiles:
        this.input.defaultValue && this.input.defaultValue.length > 0
          ? this.input.defaultValue
          : [],
      deleteFiles: [],

      fileFormats: this.input.accept
        ? this.input.accept
        : ".pdf, .rar, .7z, .zip, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .png, .gif, .jpg, .jpeg, .mp4, .avi, .mp3, .wav",

      isValid: this.checkValid(),

      errors: [],
    };
  },

  methods: {
    checkValid() {
      if (this.input.required) {
        if (this.input.defaultValue) {
          return this.input.defaultValue.length > 0 ? true : false;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },

    deleteDefaultFile(fileId) {
      this.defaultFiles = this.defaultFiles.filter(
        (item) => item.fileId !== fileId
      );

      this.deleteFiles.push(fileId);

      this.validate();

      this.emitThisData();
    },

    fileInput(e) {
      // Чистим ошибки
      this.errors = [];

      let fileList = e.target.files;

      // Проверка на количество файлов
      if (!this.input.multiple && fileList.length > 1) {
        this.errors.push("Можно выбрать только один файл");
        return;
      }

      for (let file of fileList) {
        // Проверка на размер файла
        if (file.size > this.input.maxSize) {
          this.errors.push(
            `Размер файла "${file.name}" слишком большой, допустимый размер ${
              this.input.maxSize / 1048576
            } Мб`
          );
          return;
        }

        // Проверка на формат файла
        const fileExt = file.name
          .substring(file.name.lastIndexOf("."))
          .toLowerCase();
        if (!this.fileFormats.includes(fileExt)) {
          this.errors.push(
            `Невозможно добавить файл "${file.name}". Недопустимый формат "${fileExt}"`
          );
          return;
        }

        if (!this.input.multiple) this.addFiles = [];

        this.addFiles.push(file);
      }

      this.validate();
      this.$el.querySelector("input").value = "";
      this.emitThisData();
    },

    deleteFile(e) {
      this.addFiles.splice(e, 1);
      this.validate();
    },

    validate() {
      if (this.input.required) {
        if (this.addFiles.length === 0 && this.defaultFiles.length === 0) {
          this.isValid = false;
          this.errors.push("Данное поле обязательно для заполнения");
          return;
        }
      }

      this.isValid = true;
    },

    emitThisData() {
      this.$emit("getThisData", this.$data);
    },
  },

  watch: {},

  mounted() {
    this.emitThisData();
  },
};
</script>

<style lang="scss" scoped>
.input-file {
  &__label {
    display: block;
    line-height: 0;
  }

  &__hidden-input {
  }

  &__info {
    padding: var(--v-rhythm-6) var(--v-rhythm-8);

    display: flex;
    flex-direction: column;
    align-items: center;

    border: 2px dashed var(--red500);
    background-color: var(--red100);

    @include transition();

    &:not(.input-file__info--disabled) {
      @include hover {
        border-color: var(--red900);
        cursor: pointer;
      }
    }

    &--disabled {
      border-color: var(--gray500);
      background-color: var(--gray200);
      cursor: not-allowed;

      .input-file__info {
        &-title,
        &-subtitle,
        &-parametr {
          color: var(--gray500);
        }
      }
    }

    &--error {
      border-color: var(--red900);
    }
  }

  &__info-title {
    @extend .button;
    color: var(--red900);
  }

  &__info-subtitle {
    @extend .body-1;
    color: var(--gray900);
  }

  &__info-parametrs {
    margin-top: var(--v-rhythm-3);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--v-rhythm-2);
  }

  &__info-parametr {
    @extend .caption-1;
    color: var(--gray700);
  }

  &__info-parametr-bold {
    @extend .caption-2;
  }

  &__errors {
  }

  &__file-list {
    margin-top: var(--v-rhythm-2);
  }

  &__default-files {
    margin-top: var(--v-rhythm-2);

    display: flex;
    flex-direction: column;
  }

  &__default-file {
  }

  @include phones {
    &__info {
      padding: var(--v-rhythm-4);
    }

    &__info-parametrs {
      margin-top: 6px;
      gap: 0;
    }
  }
}
</style>
