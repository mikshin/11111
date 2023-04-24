<template>
  <div class="vue-editor-wrapper" :class="{ chat: input.chat }">
    <div class="placeholder">{{ input.placeholder }}</div>

    <div class="wrap">
      <!-- Упомянуть пользователя -->
      <ul
        class="people"
        :class="{ 'people--under': input.listIsUnder }"
        v-show="searchingMode"
        v-click-outside="closePeople"
      >
        <div class="people__wrapper">
          <!-- Введите 3 буквы -->
          <div
            class="people__rules people__search"
            v-if="searchText.length < 3"
          >
            Введите три буквы для поиска
          </div>
          <!-- Результаты поиска -->
          <div class="people__result" v-else>
            <!-- Идет загрузка -->
            <div class="people__searching people__search" v-if="searchLoading">
              <h3>Поиск...</h3>
            </div>
            <!-- Загрузка завершена -->
            <div class="people__downloaded" v-else>
              <!-- Есть результаты -->
              <div class="people__result-true" v-if="peoples.length > 0">
                <li
                  v-for="(item, i) in peoples"
                  :key="i"
                  @click="selectUser(item)"
                >
                  <div class="avatar">
                    <SimplePicture
                      class="avatar__picture"
                      :src="item.USER_PHOTO"
                      :alt="item.FULL_NAME"
                    />

                    <UserIcons
                      class="avatar__vacation-label"
                      v-if="item.VACATION"
                      :iconName="'vacation-label'"
                    />
                  </div>
                  <span class="name">{{ item.FULL_NAME }}</span>
                  <span class="post" :title="item.UF_WORK_POSITION">{{
                    item.UF_WORK_POSITION
                  }}</span>
                </li>
                <infinite-loading
                  @infinite="infiniteHandler"
                  ref="infiniteLoader"
                >
                  <div slot="spinner" class="loading">Загрузка...</div>
                  <div slot="no-more" class="loading__no-more">
                    Конец списка
                  </div>
                  <div slot="no-results"></div>
                </infinite-loading>
              </div>
              <!-- Никого не найдено -->
              <div class="people__result-false people__search" v-else>
                Никого не найдено
              </div>
            </div>
          </div>
        </div>
      </ul>

      <!-- Редактор -->
      <vue-editor
        ref="vEditor"
        v-model="newValue"
        class="vue-editor"
        :class="{
          'vue-editor--editing': isEditing,
          'vue-editor--text': isTextType,
        }"
        @input="inputText"
        @focus="caretChange"
        @blur="getMentionedUsers"
        @text-change="textChange"
        :editorOptions="editorOption"
      >
        <div :id="input.uniqId" slot="toolbar" v-show="!input.chat">
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
            <button class="ql-clean"></button>
          </span>

          <span class="ql-formats">
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>

            <select class="ql-align ql-picker ql-icon-picker">
              <option></option>
              <option value="right"></option>
              <option value="center"></option>
            </select>
          </span>

          <span class="ql-formats">
            <button class="ql-link"></button>
            <button
              type="button"
              @click.stop="tagUser"
              :disabled="this.searchingMode"
              v-if="!this.input.noMention"
            >
              <UserIcons class="tag-user-icon" :iconName="'tag-user'" />
            </button>
            <button type="button" @click="attachFile" v-if="canAttachFile">
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
          </span>
        </div>
      </vue-editor>
    </div>

    <InputCounter :maxLength="input.maxLength" :newValue="sanitizedLength" />
    <InputErrors :errors="this.errors" />
    <FileList :files="files" @deleteFile="deleteFile" />
  </div>
</template>

<script>
import axios from "axios";
import { VueEditor } from "vue2-editor";
import Delta from "quill-delta";
import InfiniteLoading from "vue-infinite-loading";
import InputErrors from "@/components/UI/inputs/assets/InputErrors.vue";
import { inputMixin } from "@/components/UI/inputs/assets/inputMixin";
import FileList from "@/components/UI/inputs/FileList.vue";
import InputCounter from "./assets/InputCounter.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";

export default {
  props: {
    entryId: null,
    recordType: null,
    editedTextObj: Object,
    isEditing: Boolean,
    input: Object,
  },

  mixins: [inputMixin],

  components: {
    VueEditor,
    InfiniteLoading,
    InputErrors,
    FileList,
    InputCounter,
    SimplePicture,
  },

  data() {
    return {
      errors: [],
      files: [],
      fileList: null,
      maxSize: 52428800,
      acceptExt: ".mp3, .mp4, .avi, .wav, .png, .gif, .jpg, .jpeg",
      newValue: this.input.defaultValue,
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

  mounted() {
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

  methods: {
    closePeople() {
      if (this.searchingMode) {
        this.searchingMode = false;
      }
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

    checkSearch() {
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
          this.getSearchUser();
        } else {
          this.searchingMode = false;
          this.searchText = "";
        }
      }
    },

    getSearchUser() {
      if (this.searchingMode && this.searchText.length > 2) {
        axios
          .get(
            "/mobileapp/api/user/findByFIO/?count=10&startFrom=0&query=" +
              this.searchText
          )
          .then((response) => {
            this.searchLoading = false;
            this.peoples = response.data.employee;
            if (this.$refs.infiniteLoader) {
              this.$refs.infiniteLoader.stateChanger.reset();
            }
          });
      }
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

    clearEditor() {
      this.newValue = "";
      this.vEditor.setContents([{ insert: "\n" }]);
      this.mentionedUsers = [];
      this.files = [];
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
        const fileExt = fileItem.name
          .substring(fileItem.name.lastIndexOf("."))
          .toLowerCase();
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
      if (this.required) {
        if (this.files.length) this.isValid = true;
        else {
          this.isValid = false;
          this.errors.push("Данное поле обязательно для заполнения");
        }
      }
    },

    closeEditing() {
      this.$emit("closeEditing");
    },

    infiniteHandler($state) {
      if (this.peoples.length > 9) {
        axios
          .get(
            `/mobileapp/api/user/findByFIO/?count=10&startFrom=${this.peoples.length}&query=` +
              this.searchText
          )
          .then((response) => {
            if (response.data.end != true) {
              this.peoples.push(...response.data.employee);
              $state.loaded();
            } else {
              $state.complete();
            }
          });
      } else {
        $state.complete();
      }
    },
  },

  computed: {
    isTextType() {
      if (this.input) {
        return this.input.editorType === "text";
      } else {
        return false;
      }
    },

    canAttachFile() {
      return "canAttachFile" in this.input ? this.input.canAttachFile : true;
    },

    vEditor() {
      return this.$refs.vEditor.quill;
    },
    sanitizedLength() {
      return this.isDirty ? this.length - 1 : this.length;
    },
  },

  watch: {
    rawText() {
      if (!this.isDirty) {
        this.isDirty = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.placeholder {
  margin-bottom: var(--v-rhythm-1);
  color: var(--gray500);
  @extend .body-2;
}
.wrap {
  position: relative;
}
// Упомянуть пользователя
.people {
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 2;

  width: 100%;
  max-height: 200px;

  background-color: var(--white900);
  border: 1px solid var(--gray300);
  box-shadow: 8px 8px 16px rgba(9, 0, 109, 0.08);
  overflow: auto;

  &--under {
    bottom: unset;
    top: 100%;
  }

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

  &__result-true {
    padding: 20px 0;
  }

  li {
    position: relative;
    padding-left: 68px;
    padding-bottom: 8px;
    padding-top: 8px;
    padding-right: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 56px;
    box-sizing: border-box;

    &:last-child {
      padding-bottom: 32px;

      .avatar {
        transform: translateY(calc(-50% - 16px));
      }

      &:after {
        content: none;
      }
    }

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      width: calc(100% - 80px);
      height: 1px;
      background-color: var(--gray300);
    }
  }

  &__search {
    padding: 20px;
    display: flex;
    min-height: 65px;
    align-items: center;

    @extend .h4;
    color: var(--gray500);
  }

  .avatar {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);

    &__picture {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }

    &__vacation-label {
      position: absolute;
      top: -2px;
      left: -2px;

      width: 14px;
      height: 14px;
    }
  }

  .name {
    font-weight: 700;
    font-size: 14px;
    line-height: 115%;
    color: var(--black);
    padding-bottom: 4px;
  }

  .post {
    font-weight: 400;
    font-size: 12px;
    line-height: 115%;
    color: var(--black);
    opacity: 0.4;
  }
}

// Висивиг
.vue-editor-wrapper {
  position: relative;
}

.vue-editor {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>