<template>
  <div class="input-file">
    <InputLabelWrapper
      class="input-file__wrapper"
      :input="input"
      :isValid="isValid"
      v-if="files.length === 0 || !input.isJustOne"
    >
      <label
        class="input-file__label"
        :class="{ 'input-file__label--disabled': input.disabled }"
      >
        <input
          class="visually-hidden"
          placeholder=" "
          :name="input.name"
          :disabled="input.disabled"
          red="file"
          :required="input.required"
          type="file"
          @change="fileInput"
          :multiple="input.multiple"
          @input="validate"
          :accept="input.accept"
        />
        <div
          class="input-file__content"
          :class="{ 'input-file__content--disabled': input.disabled }"
        >
          <b :class="{ required: input.required }"
            >Выберите файл
            <template v-if="input.placeholder"
              >«{{ input.placeholder }}»</template
            ></b
          >
          <!-- <span>или перетащите его сюда</span> -->
          <i v-if="input.maxSize"
            >Максимальный размер:
            <span>{{ input.maxSize / 1048576 }} Мб</span></i
          >
          <div class="input-file__content-accept" v-if="input.accept">
            Формат: {{ input.accept }}
          </div>
        </div>
      </label>
      <InputErrors :errors="this.errors" />
    </InputLabelWrapper>

    <ul class="input-file__list file_list" v-if="this.files.length > 0">
      <li v-for="(file, i) in this.files" :key="i" class="file-info">
        <!-- <img
            v-if="file.type === 'image/jpeg' || file.type === 'image/png'"
            :src="convertImage(file)"
          /> -->
        <!-- <img :src="image" alt="фото для конкурса" class="file-info__image" /> -->
        <span :title="file.name" class="file-info__name"> {{ file.name }}</span>
        <button @click="deleteFile(i)" type="button">
          <user-icons :iconName="'cross'"></user-icons>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import InputLabelWrapper from "./assets/InputLabelWrapper.vue";
import InputErrors from "./assets/InputErrors.vue";
import { inputMixin } from "./assets/inputMixin";
export default {
  name: "inputFile",

  mixins: [inputMixin],

  props: {
    input: Object,
  },

  components: {
    InputLabelWrapper,
    InputErrors,
  },

  data() {
    return {
      files: [],
      image: null,
    };
  },

  methods: {
    fileInput(e) {
      !this.input.multiple && this.clean();
      this.errors = [];
      let fileList = e.target.files;
      for (let file of fileList) {
        if (file.size > this.input.maxSize) {
          this.errors.push(
            "Размер файла слишком большой, допустимый размер " +
              this.input.maxSize / 1048576 +
              "Мб"
          );
          return;
        }
        // TODO не  понятно, нужно это будет или нет/ проверка файлов на наличие пробелов в имени
        // if (/\s/g.test(file.name)) {
        //   this.errors.push(
        //     `Файл "${file.name}" содержит недопустимый символ (ПРОБЕЛ) в имени файла.`
        //   );
        //   return;
        // }

        if (this.input.accept) {
          const fileExt = file.name
            .substring(file.name.lastIndexOf("."))
            .toLowerCase();
          const isAcceptableExt = this.input.accept.indexOf(fileExt);

          if (isAcceptableExt != -1) {
            if (this.input.singleFile) {
              this.files[0] = file;
            } else {
              this.files.push(file);
            }
            //this.files.push(file);
            this.image = URL.createObjectURL(file);
          } else {
            this.errors.push(
              "Невозможно добавить файл формата " +
                fileExt +
                ". Допустимые форматы: " +
                this.input.accept
            );
          }
        } else {
          if (this.input.singleFile) {
            this.files[0] = file;
          } else {
            this.files.push(file);
          }
          // this.files.push(file);
          this.image = URL.createObjectURL(file);
        }
      }

      if (this.input.required) {
        if (this.files.length) this.isValid = true;
        else {
          this.isValid = false;
          this.errors.push("Данное поле обязательно для заполнения");
        }
      }
      this.$el.querySelector("input").value = "";
    },
    deleteFile(e) {
      this.files.splice(e, 1);
      if (this.input.required) {
        if (this.files.length) {
          this.isValid = true;
        } else {
          this.isValid = false;
          this.errors.push("Данное поле обязательно для заполнения");
        }
      }
      this.validate();
      //event.preventDefault();
    },
    clean() {
      this.files = [];
    },
    convertImage(e) {
      return URL.createObjectURL(e);
    },
  },

  mounted() {
    this.input.accept = this.input.accept
      ? this.input.accept
      : ".pdf, .rar, .7z, .zip, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .png, .gif, .jpg, .jpeg, .mp4, .avi, .mp3, .wav";
  },
};
</script>

<style lang="scss" scoped>
.input-file {
  &__label {
    &--disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 24px;
    width: 100%;
    border: 2px dashed var(--red500);

    cursor: pointer;
    background-color: var(--red100);

    transition: 0.3s;

    &--disabled {
      cursor: not-allowed;
    }

    &:hover:not(.input-file__content--disabled) {
      border: 2px dashed var(--red900);
    }

    b {
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      color: var(--red900);
    }

    span {
      @extend .body-1;
      color: var(--gray900);
    }

    i {
      margin-top: var(--v-rhythm-4);

      font-style: normal;
      @extend .caption-1;
      color: var(--gray700);

      span {
        font-weight: 700;
        color: inherit;
      }
    }

    &-accept {
      font-style: normal;
      @extend .caption-1;
      color: var(--gray700);
      text-align: center;
    }
  }

  &__list {
  }
}

.file_list {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: var(--v-rhythm-2);
  flex-wrap: wrap;

  li {
    span {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    img {
      & + span {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    button {
      fill: var(--red500);
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: fill 0.3s;

      &:hover {
        fill: var(--red900);
      }

      .user-icons {
        --icon-size: 20px;
      }
    }

    span {
      display: block;
      word-wrap: break-word;
    }
  }
}

.file-info {
  display: inline-flex;
  align-items: center;
  column-gap: 8px;

  position: relative;

  max-width: 270px;
  min-width: 80px;

  background-color: var(--red100);

  margin-bottom: var(--v-rhythm-1);
  margin-right: var(--v-rhythm-1);
  padding: var(--v-rhythm-1);
  padding-right: var(--v-rhythm-8);

  border: 1px solid var(--red300);
  border-radius: var(--v-rhythm-6);

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &__name {
    display: flex;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__image {
    width: 48px;
    // max-width: 44px;
    height: 48px;
    object-fit: cover;
    border: 2px solid var(--red500);

    border-radius: 100%;

    object-fit: cover;
  }
}
</style>
