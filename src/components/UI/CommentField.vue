<template>
  <div class="comment-editor-wrapper">
    <div class="comment_field" :style="{ alignItems: alignment }">
      <div class="avatar">
        <SimplePicture
          class="avatar__picture"
          :alt="currentUser.FULL_NAME"
          :src="currentUser.USER_PHOTO"
        />

        <UserIcons
          class="avatar__label"
          v-if="currentUser.VACATION"
          :iconName="'vacation-label'"
        />
        <UserIcons
          class="avatar__label"
          v-else-if="currentUser.FIRED"
          :iconName="'fired-label'"
        />
      </div>

      <!-- Упомянуть пользователя -->
      <ul class="people" v-show="searchingMode">
        <div class="people__wrapper">
          <!-- Введите 3 буквы -->
          <div
            class="people__rules people__search"
            v-if="searchText.length < 3"
          >
            <h3>Введите три буквы для поиска</h3>
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
                      class="avatar__label"
                      v-if="item.VACATION"
                      :iconName="'vacation-label'"
                    />
                    <UserIcons
                      class="avatar__label"
                      v-else-if="item.FIRED"
                      :iconName="'fired-label'"
                    />
                  </div>
                  <span class="name" :title="item.FULL_NAME">{{
                    item.FULL_NAME
                  }}</span>
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
                <h3>Никого не найдено</h3>
              </div>
            </div>
          </div>
        </div>
      </ul>

      <div class="editor-wrapper" :id="idForWrapper">
        <vue-editor
          ref="vEditor"
          v-model="comment"
          class="vue-editor"
          :class="{ 'vue-editor--editing': isEditing, bg_white: isWhiteBg }"
          @input="input"
          @focus="caretChange"
          :editorOptions="editorOption"
        >
          <div id="toolbar" slot="toolbar">
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
                @click="tagUser"
                :disabled="
                  this.searchingMode ||
                  (isEditing && editedTextObj.editType === 'edit')
                "
              >
                <UserIcons class="tag-user-icon" :iconName="'tag-user'" />
              </button>
              <button
                type="button"
                @click="attachFile"
                :disabled="isEditing && editedTextObj.editType === 'edit'"
              >
                <UserIcons
                  class="tag-user-icon"
                  :iconName="'attach'"
                  v-if="addFile"
                />
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

        <div
          v-if="isEditing && editedTextObj.editType === 'edit'"
          class="editor-status"
        >
          <UserIcons class="editor-status__icon" :iconName="'pen'" />

          <div class="editor-status__content">
            <span class="editor-status__title">Редактировать сообщение</span>
            <p class="editor-status__text">{{ editedTextObj.plainText }}</p>
          </div>

          <span @click="closeEditing" class="close-editing">
            <UserIcons :iconName="'cross'" />
          </span>
        </div>

        <div
          v-if="isEditing && editedTextObj.editType === 'reply'"
          class="editor-status"
        >
          <UserIcons class="editor-status__icon" :iconName="'comment'" />

          <div class="editor-status__content">
            <span class="editor-status__title">{{
              editedTextObj.authorInfo.userName +
              " " +
              editedTextObj.authorInfo.userLastName
            }}</span>
            <p class="editor-status__text">{{ editedTextObj.plainText }}</p>
          </div>

          <span @click="closeEditing" class="close-editing">
            <UserIcons :iconName="'cross'" />
          </span>
        </div>
      </div>

      <button
        type="button"
        class="send_button"
        @click="sendComment"
        v-show="!isEditing || editedTextObj.editType === 'reply'"
        :class="{ send_button_margin: alignment === 'start' }"
      >
        <user-icons iconName="send"></user-icons>
      </button>
      <button
        type="button"
        @click="sendEditedComment"
        v-show="isEditing && editedTextObj.editType === 'edit'"
        class="send_edited_button"
      >
        <UserIcons :iconName="'check'" />
      </button>
    </div>

    <ul class="input_errors" v-if="commentContentErrors.length">
      <li
        class="input_error"
        v-for="(error, i) in commentContentErrors"
        :key="i"
      >
        {{ error }}
      </li>
    </ul>

    <FileList :files="files" @deleteFile="deleteFile" />

    <ul class="input_errors" v-if="errors.length">
      <li class="input_error" v-for="(error, i) in errors" :key="i">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { createFilesListFrom } from "@utils";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import { VueEditor } from "vue2-editor";
import Delta from "quill-delta";
import InfiniteLoading from "vue-infinite-loading";
import FileList from "@/components/UI/inputs/FileList.vue";

export default {
  components: {
    SimplePicture,
    VueEditor,
    InfiniteLoading,
    FileList,
    //InputVueEditor,
  },

  props: {
    entryId: null,
    recordType: null,
    editedTextObj: Object,
    isEditing: Boolean,
    addFile: { type: Boolean, default: false },
    isWhiteBg: {
      type: Boolean,
      default: false,
    },
    alignment: {
      type: String,
      default: "center",
    },
    isRequiredText: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      errors: [],
      files: [],
      maxSize: 20971520,
      acceptExt: ".pdf, .rar, .7z, .zip, .doc, .docx, .xls, .xlsx, .ppt, .pptx",
      comment: "",
      isCommentValid: true,
      commentContentErrors: [],
      tempComment: "",
      rawText: "",
      finalComment: "",
      searchingMode: false,
      searchPosition: 0,
      searchText: "",
      searchLoading: false,
      peoples: [],
      mentionedUsers: [],
      length: 0,
      caretPosition: 0,
    };
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },

    idForWrapper() {
      return `vue-editor-wrapper-${this.entryId}`;
    },

    editorOption() {
      return {
        bounds: `#${this.idForWrapper}`,
        modules: {
          toolbar: {
            container: "#toolbar",
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
      };
    },

    lastSymbol() {
      return this.rawText?.at(this.caretPosition - 1);
    },
  },

  methods: {
    input() {
      this.rawText = this.$refs.vEditor.quill.getText();

      this.caretChange();

      this.length = this.rawText.length - 1;
    },

    caretChange() {
      this.$refs.vEditor.quill.focus();

      // nextTick нужен для корректного подсчета индекса каретки
      this.$nextTick(() => {
        this.caretPosition = this.$refs.vEditor.quill.getSelection().index;
        this.checkSearch();
      });

      // Необходимо для переопределения клавиш
      return true;
    },

    checkSearch() {
      this.searchingMode = false;
      this.searchText = "";

      let word = null;
      let caretPos = this.caretPosition;
      let text = this.rawText;
      let preText = text.substring(0, caretPos);
      let postText = text.substring(caretPos, text.length);

      // Добавил учет \n, чтобы окно поиска человека отображалось, если строка начинается с переноса
      if (preText.indexOf(" ") >= 0 || preText.indexOf("\n") >= 0) {
        let words = preText.split(/\n|\s/);
        word = words.at(-1);
      } else {
        word = preText;
      }

      if (postText.indexOf(" ") >= 0 || postText.indexOf("\n") >= 0) {
        let words = postText.split(/\n|\s/);
        word += words[0];
      } else {
        word += postText;
      }

      if (word != null && word[0] == "@") {
        this.searchingMode = true;
        word = word.replace(/(\r\n|\n|\r)/gm, "");
        this.searchText = word.substring(1);
        this.getSearchUser();
      } else {
        this.searchingMode = false;
        this.searchText = "";
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

    validateCommentContent() {
      this.isCommentValid = true;

      if (this.isRequiredText && !this.comment) {
        this.isCommentValid = false;
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
      this.$refs.vEditor.quill.updateContents(delta);

      this.searchingMode = false;
      this.$refs.vEditor.quill.setSelection(this.comment.length);
    },

    sendComment() {
      this.validateCommentContent();

      if (!this.isCommentValid) {
        return;
      }

      this.getMentionedUsers();

      let url = "";
      let data = null;
      if (this.recordType == "tasks") {
        url = "/mobileapp/api/task/comment/add";
        data = new FormData();
        data.append("TASK_ID", this.entryId);
        data.append("COMMENT_TEXT", this.comment);
        data.append("MENTIONED_USERS[]", this.mentionedUsers);

        for (let k = 0; k < this.files.length; k++) {
          data.append("FILES[]", this.files[k]);
        }

        if (this.editedTextObj.editType === "reply") {
          data.append("REPLIED_TO_COMMENT_ID", this.editedTextObj.commentId);
        }
      } else if (this.recordType == "news") {
        url = "/mobileapp/api/news/comments/";
        data = {
          newsId: this.entryId,
          commentText: this.comment,
          mentionedUsers: this.mentionedUsers,
        };
      } else if (this.recordType == "photoContest") {
        url = "/mobileapp/api/photoContest/comments/";
        data = {
          photoContestId: this.entryId,
          commentText: this.comment,
          mentionedUsers: this.mentionedUsers,
        };
      } else if (this.recordType === "advertisements") {
        url = "/mobileapp/api/advertising/comments/add";
        data = {
          addvertisingId: this.entryId,
          commentText: this.comment,
          mentionedUsers: this.mentionedUsers,
        };
      } else if (this.recordType === "messageCommunity") {
        url = "/mobileapp/api/group/news/comments/add";
        data = {
          groupNewsId: this.entryId,
          commentText: this.comment,
          mentionedUsers: this.mentionedUsers,
        };
      }

      axios
        .post(url, data)
        .then(() => {
          this.$emit("onComments");
        })
        .catch((error) => {
          if (error.response) {
            this.$emit("onComments");
          }
        });

      this.clearEditor();
    },

    sendEditedComment() {
      this.validateCommentContent();

      if (!this.isCommentValid) {
        return;
      }

      let data = new FormData();
      data.append("TASK_ID", this.entryId);
      data.append("ID", this.editedTextObj.commentId);
      data.append("NEW_MESSAGE", this.comment);
      axios
        .post("/mobileapp/api/task/comment/update", data)
        .then(() => {
          this.$emit("onComments");
        })
        .catch((error) => {
          if (error.response) {
            this.$emit("onComments");
          }
        });
    },

    clearEditor() {
      this.comment = "";
      this.$refs.vEditor.quill.setContents([{ insert: "\n" }]);
      this.mentionedUsers = [];
      this.files = [];
    },

    getMentionedUsers() {
      let str = this.comment;
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
        while (this.comment[stopIndex] != '"') {
          stopIndex++;
        }
        this.mentionedUsers.push(
          parseInt(this.comment.slice(index + 5, stopIndex))
        );
      }
    },

    tagUser() {
      let delta = new Delta();
      let newCaretPosition = this.caretPosition;

      // Запоминаем контент, который был до позиции каретки перед вставкой
      delta.retain(this.caretPosition);

      // Не знаю, зачем тут эта штука, которая ничего не удаляет, но она тут была.
      // Оставлю на всякий случай 🤡
      delta.delete(0);

      // Последний символ перед кареткой - любой символ, кроме пробела или переноса
      if (this.lastSymbol && !this.lastSymbol.match(/\n|\s/)) {
        // Если символ перед кареткой является пробельным, предполагается, что она стоит после последовательности не специальных символов
        if (this.rawText.at(this.caretPosition)?.match(/\s/)) {
          delta.insert(" @");

          // Сдвигает каретку на символ @ + пробел
          newCaretPosition += 2;
        }
        // Предполагаеся вставка внутри последовательности не специальных символов (например, слова или последовательности цифр)
        else {
          delta.insert(" @ ");

          // Сдвигает каретку на символ @ + пробел
          // Почему не на 3 символа, ведь добавляется два пробела?
          // Потому что в рамках последовательности картеку надо поставить после пробела и символа, а не всей конструкции
          // Пример: последо_@|_вательность
          // -----------------| - каретка
          newCaretPosition += 2;
        }
      }
      // Любой другой символ
      else {
        delta.insert("@");

        // Сдвигает каретку на символ @
        newCaretPosition++;
      }

      // Добавляет дельту с контентом, запомненным в начале кода + символом @
      this.$refs.vEditor.quill.updateContents(delta);
      // Ставит каретку в новое положение по условиям выше
      this.$refs.vEditor.quill.setSelection(newCaretPosition);
      this.caretChange();
    },

    attachFile() {
      this.$refs.inputFileRef.click();
    },

    handleFileChange(e) {
      this.errors = [];
      let fileList = e.target.files;
      for (let file of fileList) {
        if (file.size > this.maxSize) {
          this.errors.push(
            "Размер файла слишком большой, допустимый размер " +
              this.maxSize / 1048576 +
              "Мб"
          );
          return;
        }
        const fileExt = file.name
          .substring(file.name.lastIndexOf("."))
          .toLowerCase();
        const isAcceptableExt = this.acceptExt.indexOf(fileExt);
        if (isAcceptableExt != -1) {
          this.files.push(file);
          //this.image = URL.createObjectURL(file);
        } else {
          this.errors.push(
            "Невозможно добавить файл формата " +
              fileExt +
              ". Допустимые форматы: " +
              this.acceptExt
          );
        }
      }
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
      //e.preventDefault();
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

  watch: {
    isEditing(newVal) {
      if (newVal) {
        this.tempComment = this.comment;
      } else {
        // Восстановление старого текста при отмене
        this.comment = this.tempComment;
        this.$refs.vEditor.quill.clipboard.dangerouslyPasteHTML(this.comment);
        this.tempComment = "";
      }
    },
    editedTextObj(newVal) {
      if (newVal) {
        if (this.editedTextObj.editType === "edit") {
          this.$refs.vEditor.quill.clipboard.dangerouslyPasteHTML(
            this.editedTextObj.htmlText
          );
          this.$refs.vEditor.quill.setSelection(1000);
        }
        if (this.editedTextObj.editType === "reply") {
          let author = this.editedTextObj.authorInfo;
          this.$refs.vEditor.quill.clipboard.dangerouslyPasteHTML(
            `<p><a href="/lk?=${
              author.userId
            }" rel="noopener noreferrer" target="_blank">${
              author.userName + " " + author.userLastName + ","
            }</a>${this.tempComment}</p>`
          );
          this.$refs.vEditor.quill.setSelection(100);
        }
      } else {
        // Восстановление старого текста при отмене
        this.comment = this.tempComment;
        this.$refs.vEditor.quill.clipboard.dangerouslyPasteHTML(this.comment);
        this.tempComment = "";
      }
    },
    comment(newVal) {
      if (newVal.length && !this.isCommentValid) {
        this.isCommentValid = true;
      }
    },
    commentContentErrors(newVal) {
      if (!newVal.length && !this.isCommentValid) {
        this.isCommentValid = true;
      }
    },
    isCommentValid(newVal) {
      const errorText = "Не указан текст комментария";
      if (newVal) {
        this.commentContentErrors = this.commentContentErrors.filter(
          (element) => element !== errorText
        );
      } else {
        if (!this.commentContentErrors.includes(errorText)) {
          this.commentContentErrors.push(errorText);
        }
      }
    },
    files(newVal) {
      this.$refs.inputFileRef.files = createFilesListFrom(newVal);
    },
  },

  mounted() {
    // click event
    this.$refs.vEditor.quill.root.addEventListener("click", () => {
      this.caretChange();
    });

    this.$refs.vEditor.quill.root.addEventListener("keyup", (e) => {
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
// Ошибки при инпуте файлов
.input_errors {
  padding-left: 50px;
  padding-top: 10px;
  color: var(--red900);
}

.comment-editor-wrapper {
  padding: 24px 0;
}

// Файл лист
.file_list {
  padding-left: 50px;
}

.comment_field {
  position: relative;
  display: flex;
  align-items: center;

  & > .avatar {
    position: static;
    transform: none;
    flex-shrink: 0;
    margin-right: 10px;
  }
}

.comment {
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray900);
  font-family: "HeliosC";
  font-style: normal;
  padding: 10px 16px;
  margin: 0 16px;
  border-radius: 50px;
  border: 1px solid var(--gray300);
  height: 40px;
  overflow: hidden;
  box-sizing: border-box;
  resize: none;

  &::placeholder {
    color: var(--gray500);
  }

  // &:focus {
  //     height: unset;
  //     min-height: 80px;
  //     overflow: auto;
  // }
}
.editor-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: calc(100% - 84px);
}

.vue-editor {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  ::v-deep {
    .quill-container {
      border-top: 2px;
    }

    .ql-snow .ql-tooltip {
      white-space: unset;
      max-width: 100%;

      input {
        max-width: 100%;
      }
    }
  }
}

.people {
  position: absolute;
  top: calc(100% + 5px);
  left: 50px;

  margin: 0;
  padding: 0;
  max-height: 100%;
  width: 100%;
  box-sizing: border-box;
  width: 328px;
  max-height: 329px;

  background-color: #fff;
  border: 1px solid var(--gray300);
  box-shadow: 8px 8px 16px rgba(9, 0, 109, 0.08);
  z-index: 2;
  list-style-type: none;
  overflow: auto;

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

    // &:first-child {
    //   padding-top: 32px;

    //   .avatar {
    //     transform: translateY(calc(-50% + 16px));
    //   }
    // }

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

  @include phones {
    top: unset;
    bottom: calc(100% + 5px);

    width: 300px;
  }
}

.people__search {
  padding: 20px;
  display: flex;
  min-height: 65px;
  align-items: center;

  h3 {
    color: var(--gray700);
  }
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

  &__label {
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

.send_button {
  cursor: pointer;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-left: 10px;
  border: none;
  fill: var(--red900);
}

.send_edited_button {
  margin-left: 10px;
  fill: var(--red900);
  flex-shrink: 0;
}

.loading__no-more {
  margin: 10px;
  color: var(--gray700);
  font-size: 12px;
}

// Изменяемый текст
.editor-status {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray300);
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px 12px;

  &__title {
    display: block;
    color: var(--red700);
  }

  &__content {
    max-width: calc(100% - 50px);
  }

  &__text {
    overflow: hidden;
    white-space: nowrap;
    //max-width: calc(100% - 20px);
    text-overflow: ellipsis;
  }
}

.editor-status__icon {
  flex-shrink: 0;
  fill: var(--red700);
  margin-right: 10px;
}

.close-editing {
  flex-shrink: 0;
  margin-left: auto;
  cursor: pointer;
  fill: var(--gray500);
  transition: fill 0.3s;

  &:hover {
    fill: var(--red700);
  }
}
.bg_white {
  background-color: var(--white900);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.send_button_margin {
  margin-top: 10px;
}
</style>
