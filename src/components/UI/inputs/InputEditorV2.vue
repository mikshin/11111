<template>
  <div class="input-editor">
    <div
      class="input-editor__placeholder placeholder"
      :class="{
        'placeholder--required': input.required,
      }"
      v-if="input.placeholder"
    >
      {{ input.placeholder }}
    </div>

    <div class="input-editor__wrapper">
      <!-- Упомянуть пользователя -->
      <div
        class="input-editor__people people"
        :class="{
          loading: searchLoading,
          'input-editor__people--under': input.listIsUnder,
        }"
        v-show="searchingMode"
        v-click-outside="closePeople"
      >
        <div class="people__text-default" v-if="searchText.length < 3">
          Введите три буквы для поиска
        </div>

        <!-- Результаты поиска -->
        <template v-else>
          <template v-if="peoples.length > 0">
            <SimplePersonCard
              class="people__person"
              v-for="(item, i) in peoples"
              :key="i"
              :avatar="{
                alt: item.FULL_NAME,
                src: item.USER_PHOTO,
              }"
              :fullName="item.FULL_NAME"
              :profession="item.UF_WORK_POSITION"
              :vacation="item.VACATION"
              :fired="item.FIRED"
              @onClock="selectUser(item)"
            />

            <div v-if="!isEndLoading" v-intersection="updateUser"></div>
          </template>

          <div class="people__text-default" v-else>Никого не найдено</div>
        </template>
      </div>

      <!-- Редактор -->
      <vue-editor
        class="input-editor__editor"
        :class="{
          'input-editor__editor--error': errors.length > 0,
        }"
        ref="vEditor"
        v-model="newValue"
        @input="inputText"
        @focus="caretChange"
        @blur="getMentionedUsers"
        @text-change="textChange"
        :editorOptions="editorOption"
      >
        <div :id="input.uniqId" slot="toolbar">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
          <button class="ql-clean"></button>

          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>

          <select class="ql-align ql-picker ql-icon-picker">
            <option></option>
            <option value="right"></option>
            <option value="center"></option>
          </select>

          <button class="ql-link"></button>
          <button
            type="button"
            @click.stop="tagUser"
            :disabled="this.searchingMode"
            v-if="!this.input.noMention"
          >
            <UserIcons class="tag-user-icon" :iconName="'tag-user'" />
          </button>

          <button type="button" @click="attachFile" v-if="input.canAttachFile">
            <UserIcons class="tag-user-icon" :iconName="'attach'" />
            <input
              class="visually-hidden"
              ref="inputFileRef"
              type="file"
              multiple
              :accept="acceptExt"
              @change="handleFileChange"
            />
          </button>
        </div>
      </vue-editor>
    </div>

    <div class="input-editor__bottom">
      <div class="input-editor__bottom-left">
        <FileListV2
          class="input-editor__file-list"
          v-if="files.length > 0"
          :files="files"
          @deleteFile="deleteFile"
        />

        <InputErrors class="input-editor__errors" :errors="this.errors" />
      </div>

      <InputCounter
        class="input-editor__counter"
        :maxLength="input.maxLength"
        :newValue="sanitizedLength"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VueEditor } from "vue2-editor";
import Delta from "quill-delta";
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";
import FileListV2 from "@/components/UI/inputs/FileListV2.vue";
import InputCounter from "./assets/InputCounter.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";

export default {
  name: "InputEditorV2",

  components: {
    VueEditor,
    InputErrors,
    FileListV2,
    InputCounter,
    SimplePersonCard,
  },

  props: {
    input: {
      type: Object,
      required: true,
    },

    entryId: null,
    recordType: null,
    editedTextObj: Object,
  },

  data() {
    return {
      type: "editor",
      name: this.input.name,
      isValid: this.input.required && !this.input.defaultValue ? false : true,
      errors: [],
      isEndLoading: true,

      files: [],
      fileList: [],
      maxSize: 52428800,
      acceptExt: ".mp3, .mp4, .avi, .wav, .png, .gif, .jpg, .jpeg",
      newValue: this.input.defaultValue ? this.input.defaultValue : "",
      tempComment: "",
      rawText: "",
      noRawText: "",
      isDirty: false,
      finalComment: "",
      searchingMode: false,
      searchPosition: 0,
      searchText: "",
      searchLoading: false,
      peoples: [],
      mentionedUsers: [],
      length: 0,
      caretPosition: 0,
      lastSymbol: "",
      editorOption: {
        bounds: "#" + this.input.uniqId,
        modules: {
          toolbar: {
            container: "#" + this.input.uniqId,
          },
          keyboard: {
            bindings: {
              // Ctrl + enter
              custom: {
                key: 13,
                shortKey: true,
                handler: () => {
                  this.sendComment();
                },
              },
            },
          },
        },
      },
    };
  },

  computed: {
    vEditor() {
      return this.$refs.vEditor.quill;
    },
    sanitizedLength() {
      return this.isDirty ? this.length - 1 : this.length;
    },
  },

  methods: {
    closePeople() {
      if (this.searchingMode) {
        this.searchingMode = false;
      }
    },

    validate() {
      this.errors = [];
      if (this.input.required && !this.newValue) {
        this.isValid = false;
        this.errors.push("Данное поле обязательно для заполнения");
        return;
      }

      this.isValid = true;
    },

    emitThisData() {
      this.$emit("getThisData", this.$data);
    },

    textChange(delta, oldContents) {
      if (this.sanitizedLength > this.input.maxLength) {
        const savedCaretPosition = this.caretPosition;

        this.vEditor.setContents(oldContents);

        this.$nextTick(() => {
          let newCaretPosition;
          const isHasSecondInsert = delta.ops?.[1];
          let insertIndex = 0;

          if (isHasSecondInsert) {
            insertIndex = 1;
          }

          if (delta.ops[insertIndex].insert === `\n`) {
            newCaretPosition = savedCaretPosition;
          } else if (delta.ops[insertIndex].insert.length > 1) {
            newCaretPosition = Math.max(this.input.maxLength, 0);
          } else {
            newCaretPosition = Math.max(savedCaretPosition - 1, 0);
          }

          this.vEditor.setSelection(newCaretPosition, 0);
        });
      }
      this.noRawText = this.vEditor.getText();
    },
    inputText() {
      this.rawText = this.vEditor.getText().replace(/\n/g, "");

      this.caretChange();

      this.length = this.vEditor.getLength();
      this.validate();
    },

    caretChange() {
      const range = this.vEditor.getSelection();
      if (range) {
        this.caretPosition = range.index;
        this.lastSymbol = this.rawText.slice(
          this.caretPosition - 1,
          this.caretPosition
        );

        this.checkSearch();

        // Необходимо для переопределения клавиш
        return true;
      }
    },

    async checkSearch() {
      this.searchingMode = false;
      this.searchText = "";

      let word = null;
      let caretPos = this.caretPosition;
      let text = this.rawText;
      let preText = text.substring(0, caretPos);
      let postText = text.substring(caretPos, text.length);

      if (preText.indexOf(" ") >= 0) {
        let words = preText.split(" ");
        word = words[words.length - 1];
      } else {
        word = preText;
      }

      if (postText.indexOf(" ") >= 0) {
        let words = postText.split(" ");
        word += words[0];
      } else {
        word += postText;
      }
      if (!this.input.noMention) {
        if (word != null && word[0] == "@") {
          this.searchingMode = true;
          word = word.replace(/(\r\n|\n|\r)/gm, "");
          this.searchText = word.substring(1);

          if (
            this.searchingMode &&
            this.searchText.length > 2 &&
            !this.searchLoading
          ) {
            this.peoples = await this.getUser(0);
          }
        } else {
          this.searchingMode = false;
          this.searchText = "";
        }
      }
    },

    async getUser(startFrom) {
      try {
        this.searchLoading = true;
        this.isEndLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/user/findByFIO/?count=10&startFrom=${startFrom}&query=${this.searchText}`,
        });

        this.isEndLoading = response.data.end;
        return response.data.employee;
      } catch (error) {
        return [];
      } finally {
        this.searchLoading = false;
      }
    },

    async updateUser() {
      this.peoples = [
        ...this.peoples,
        ...(await this.getUser(this.peoples.length)),
      ];
    },

    selectUser(item) {
      // Поиск позиции символа @
      let startIndex = 0;
      let currentChar = null;
      let i = this.caretPosition;

      while (currentChar !== "@") {
        currentChar = this.rawText[i];
        startIndex = i;
        i--;
      }

      let name = item.NAME + " " + item.LAST_NAME;

      let delta = new Delta();
      delta.retain(startIndex);
      delta.delete(this.searchText.length + 1);
      delta.insert(name, { link: "/lk?=" + item.ID });
      this.vEditor.updateContents(delta);

      this.searchingMode = false;
      this.vEditor.setSelection(this.newValue.length);
    },

    getMentionedUsers() {
      let str = this.newValue;
      let regex = /\/lk\?=/gi,
        result,
        indices = [];

      while ((result = regex.exec(str))) {
        indices.push(result.index);
      }

      for (let i = 0; i < indices.length; i++) {
        const index = indices[i]; // index of '/lk/'
        let stopIndex = index;
        // index of the last " in href
        while (this.newValue[stopIndex] != '"') {
          stopIndex++;
        }
        this.mentionedUsers.push(
          parseInt(this.newValue.slice(index + 5, stopIndex))
        );
      }

      this.validate();
    },

    tagUser() {
      let delta = new Delta();
      let selectionIndex = this.caretPosition;
      delta.retain(this.caretPosition);
      delta.delete(0);

      // Последний символ буква
      if (this.lastSymbol != " ") {
        // Если мы внутри слова
        if (this.rawText[this.caretPosition] != " ") {
          delta.insert(" @ ");
        } else {
          delta.insert(" @");
        }
      }
      // Последний символ пробел
      else {
        delta.insert("@ ");
        selectionIndex--;
      }

      this.$refs.vEditor.quill.updateContents(delta);
      this.$refs.vEditor.quill.setSelection(selectionIndex + 2);
      this.caretChange();
    },

    attachFile() {
      this.$refs.inputFileRef.click();
    },

    handleFileChange() {
      let data = new FormData();
      let item = this.$refs.inputFileRef;
      this.errors = [];

      for (let i = 0; i < item.files.length; i++) {
        const fileItem = item.files[i];
        if (fileItem.size > this.maxSize) {
          this.errors.push(
            "Размер файла слишком большой, допустимый размер " +
              this.maxSize / 1048576 +
              "Мб"
          );
          return;
        }
        const fileExt = fileItem.name.substring(fileItem.name.lastIndexOf("."));
        const isAcceptableExt = this.acceptExt.indexOf(fileExt);
        if (isAcceptableExt != -1) {
          //this.files.push(file);
          const newName = /\s/g.test(fileItem.name)
            ? fileItem.name.trim().replace(/\s/g, "_")
            : fileItem.name;
          this.files.push(
            new File([fileItem], newName, { type: fileItem.type })
          );
        } else {
          this.errors.push(
            "Невозможно добавить файл формата " +
              fileExt +
              ". Допустимые форматы: " +
              this.acceptExt
          );
        }
      }
      for (let k = 0; k < this.files.length; k++) {
        data.append("FILES[]", this.files[k]);
      }
      this.fileList = data;
      this.$emit("onChange", {
        data: this,
      });
    },

    deleteFile(e) {
      this.files.splice(e, 1);
    },

    closeEditing() {
      this.$emit("closeEditing");
    },
  },

  watch: {
    searchText() {
      if (this.searchText.length < 3) {
        this.isEndLoading = true;
        this.peoples = [];
      }
    },
    rawText() {
      if (!this.isDirty) {
        this.isDirty = true;
      }
    },
  },

  mounted() {
    this.emitThisData();

    // click event
    this.vEditor.root.addEventListener("click", () => {
      this.caretChange();
    });

    this.vEditor.root.addEventListener("keyup", (e) => {
      if (
        e.code == "ArrowLeft" ||
        e.code == "ArrowRight" ||
        e.code == "ArrowUp" ||
        e.code == "ArrowDown"
      ) {
        this.caretChange();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
// Упомянуть пользователя
.people {
  padding: var(--v-rhythm-2) var(--v-rhythm-6);

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-2);

  overflow: auto;
  background-color: var(--white900);
  border: 1px solid var(--gray300);
  box-shadow: var(--boxShadowList);

  &::-webkit-scrollbar {
    width: 14px; /* width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: var(--gray100); /* color of the tracking area */
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray300); /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
    border: 4px solid var(--gray100); /* creates padding around scroll thumb */
  }

  &__text-default {
    @extend .h4;
    color: var(--gray500);
  }
}

.input-editor {
  &__wrapper {
    position: relative;
  }

  &__people {
    position: absolute;
    bottom: 100%;
    left: 0;
    z-index: 2;

    width: 100%;
    min-height: 44px;
    max-height: 150px;

    &--under {
      bottom: unset;
      top: 100%;
    }
  }

  &__placeholder {
    margin-bottom: var(--v-rhythm-1);
  }

  &__editor {
    display: flex;
    flex-direction: column;

    background-color: var(--white900);
    border: 1px solid var(--gray500);
    // box-shadow: 0 0 0 1px var(--gray500);

    @include transition(box-shadow);

    &--error {
      border: 1px solid var(--red900);
      // box-shadow: 0 0 0 1px var(--red900);
    }

    @include hover {
      &:not(.input-editor__editor--error) {
        border: 1px solid var(--red500);
        // box-shadow: 0 0 0 1px var(--red500);
      }
    }
  }

  ::v-deep {
    .quillWrapper.quillWrapper .ql-snow.ql-toolbar {
      padding-top: var(--v-rhythm-2);
      padding-bottom: var(--v-rhythm-2);
      border: none !important;
      border-bottom: 1px solid var(--gray500) !important;
    }

    .ql-container.ql-snow {
      border: none !important;
    }

    .ql-editor {
      padding: 7px 23px;

      @extend .body-2;
      color: var(--gray900);
    }
  }

  &__file-list {
    margin-top: var(--v-rhythm-2);
  }

  &__bottom {
    width: 100%;
    display: flex;
    gap: var(--v-rhythm-2);
  }

  &__bottom-left {
    display: flex;
    flex-direction: column;
  }

  &__file-list {
  }

  &__errors {
  }

  &__counter {
    margin-top: var(--v-rhythm-1);
    margin-left: auto;
  }

  @include phones {
    ::v-deep {
      .ql-editor {
        padding: 7px 11px;
      }
    }
  }
}
</style>