<template>
  <div class="chat__form">
    <label class="chat__file">
      <input type="file" @change="fileInput" multiple="true" />
      <user-icons iconName="attach"></user-icons>
    </label>
    <div class="chat__input">
      <div class="chat__input-content">
        <div class="chat__replied-message" v-if="this.repliedMessage">
          <span v-html="this.repliedMessage.content"></span>
          <button @click="onCancelReply">
            <UserIcons :iconName="'X'" />
          </button>
        </div>
        <ul class="chat__filelist" v-if="files">
          <li class="error" v-for="(error, j) in inputErrors" :key="'_' + j">
            {{ error }}
          </li>
          <template v-for="(file, i) in files">
            <!-- если объект -->
            <li class="file" :key="i" v-if="!file.name">
              <FileIcon :format="file.extension" />
              <div class="file_data">
                <div class="file_name" :title="file.originalName">
                  {{ file.originalName }}
                </div>
                <div class="file_size">{{ file.fileSize }}</div>
              </div>
              <div class="file_actions">
                <button @click="deletefile(i)">
                  <UserIcons :iconName="'X'" />
                </button>
              </div>
            </li>
            <!--если файл -->
            <li class="file" :key="i" v-else>
              <FileIcon :format="file.type" />
              <div class="file_data">
                <div class="file_name" :title="file.name">
                  {{ file.name }}
                </div>
                <div class="file_size">{{ getfilesize(file.size) }}</div>
              </div>
              <div class="file_actions">
                <button @click="deletefile(i)">
                  <UserIcons :iconName="'X'" />
                </button>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <vue-editor
        ref="vEditor"
        v-model="text"
        :editorOptions="editorOption"
        class="chat"
      ></vue-editor>
    </div>
    <button
      @click="sendComment"
      class="chat__send-button"
      :disabled="isButtonDisabled"
    >
      <user-icons iconName="send"></user-icons>
    </button>
  </div>
</template>
<script>
import axios from "axios";
// import Input from "@/components/UI/inputTemplate.vue";
import { VueEditor } from "vue2-editor";
import FileIcon from "@/components/UI/FileIcon.vue";
export default {
  props: {
    activeChat: null,
    repliedMessage: null,
    editValue: null,
    citateValue: null,
  },
  components: {
    VueEditor,
    FileIcon,
  },
  data() {
    return {
      isChatLoading: false,
      text: "",
      files: [],
      inputErrors: [],
      fileChanged: "N",
      isButtonDisabled: false,
      maxFiles: 10,
      editorOption: {
        modules: {
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
    filesList() {
      if (this.editValue) {
        return [...this.editValue.files, ...this.files];
      }
      return this.files;
    },
  },
  methods: {
    sendComment(chat) {
      if (this.text.length > 0 || this.files.length > 0) {
        this.isButtonDisabled = true;
      }
      if (this.activeChat.roomId === -1 && !chat) {
        this.createChat();
      } else {
        if (chat == undefined) {
          chat = this.activeChat;
        } else if (chat.type === "click") {
          chat = this.activeChat;
        }
        if (this.editValue) {
          // Отправка при редактировании
          let formData = new FormData();
          formData.append("messageId", this.editValue.id);
          formData.append("text", this.text);
          formData.append("fileChanged", this.fileChanged);

          if (this.files) {
            for (let k = 0; k < this.files.length; k++) {
              if (this.files[k].originalName) {
                formData.append("oldFiles[]", JSON.stringify(this.files[k]));
              } else {
                formData.append("files[]", this.files[k]);
              }
            }
          }
          axios
            .post("/mobileapp/api/chat/message/update", formData)
            .then(() => {
              // this.$emit("onSended");
              this.$emit("onSuccessEdit", {
                data: {
                  messageId: this.editValue.id,
                  text: this.text,
                },
              });
              this.clearMessage();
            })
            .finally(() => {
              this.isButtonDisabled = true;
            });
          return;
        }

        // дефолтная отправка
        let formData = new FormData();
        formData.append("chatId", chat.roomId);
        formData.append("text", this.text);
        if (this.repliedMessage) {
          // добавление опции для ответа на сообщение
          formData.append("repliedId", this.repliedMessage.id);
        }
        if (this.files) {
          // добавление файлов
          const filesArr = [];
          this.files.forEach((i) => {
            filesArr.push(new File([i], i.name, { type: i.type }));
          });
          for (let k = 0; k < filesArr.length; k++) {
            formData.append("files[]", filesArr[k]);
          }
        }
        if (this.files.length || this.text.length) {
          axios
            .post("/mobileapp/api/chat/message/add", formData)
            .then(() => {
              this.$emit("onSended");
              this.$emit("onCancelReply");
              this.clearMessage();
            })
            .finally(() => {
              this.isButtonDisabled = true;
            });
        }
      }
    },
    createChat() {
      let formData = new FormData();

      formData.append("type", "P");
      formData.append("members[]", this.activeChat.groupIds);
      formData.append("name", this.activeChat.roomName);

      axios.post("/mobileapp/api/chat/add", formData).then((response) => {
        this.$emit("onChatCreated", { data: response.data.chatId });
        this.sendComment(response.data);
      });
    },
    fileInput(e) {
      if (this.files.length < this.maxFiles) {
        let fileList = e.target.files;
        this.inputErrors = [];
        this.fileChanged = "Y";
        for (let file of fileList) {
          if (file.size > 52428800) {
            this.inputErrors.push("Превышен допустимый размер файла в 50Мб");
            return;
          }

          if (this.files.length < this.maxFiles) {
            let name = file.name
              .substr(0, file.name.lastIndexOf("."))
              .slice(0, 125);
            let format = file.name.substr(
              file.name.lastIndexOf("."),
              file.name.length - file.name.lastIndexOf(".")
            );

            let newFile = new File([file], name + format, {});

            this.files.push(newFile);
          } else {
            this.inputErrors.push(
              "Превышено максимально количество файлов в одном сообщении: " +
                this.maxFiles
            );
            return;
          }
        }
      } else {
        this.inputErrors.push(
          "Превышено максимально количество файлов в одном сообщении: " +
            this.maxFiles
        );
      }
    },
    getfilesize(size) {
      if (!size) return "";

      let num = 1024.0; //byte

      if (size < num) return size + "B";
      if (size < Math.pow(num, 2)) return (size / num).toFixed(2) + "KB"; //kb
      if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
      if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "GB"; //G
      return (size / Math.pow(num, 4)).toFixed(2) + "TB"; //T
    },
    deletefile(file) {
      this.files.splice(file, 1);
      this.fileChanged = "Y";
      this.inputErrors = [];
    },
    onCancelReply() {
      this.$emit("onCancelReply");
    },
    clearMessage() {
      this.text = "";
      this.$refs.vEditor.quill.setContents([{ insert: "\n" }]);
      this.files = [];
      this.fileChanged = "N";
    },
  },
  watch: {
    editValue() {
      this.text = this.editValue.content;
      if (this.editValue) {
        this.files = [...this.editValue.files, ...this.files];
      }
    },
    citateValue() {
      let tmp = this.citateValue.content;
      tmp = tmp.slice(3);
      tmp = tmp.slice(0, -4);
      this.text = "<em>" + tmp + "</em>";
    },
    text() {
      if (this.text.length > 0) {
        this.isButtonDisabled = false;
      }
    },
    files() {
      if (this.files.length > 0) {
        this.isButtonDisabled = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.chat {
  &__form {
    display: flex;
    align-items: flex-end;
    width: 100%;
    background-color: var(--gray300);
    padding: 26px var(--v-rhythm-5);
  }
  &__input {
    flex: 1;
    // width: calc(100% - 422px);
    display: flex;
    flex-direction: column;
    padding-top: 8px;
    position: relative;
    overflow: hidden;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background-color: #fff;
      border-radius: 8px 8px 0px 0px;
    }
    .input_container {
      background-color: #fff;
      width: 100%;
      min-height: 56px;
      border: none;
      resize: none;
      // box-shadow: 0px 1px 2px rgba(16, 35, 47, 0.15);
      border-radius: 0px 0px 8px 8px;
    }
    ::v-deep {
      .ql-editor {
        max-height: 400px;
        max-width: calc(100%);
        overflow-y: auto;
        & * {
          word-break: break-word;
        }
      }
    }
  }
  &__input-content {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  &__replied-message {
    margin-left: 8px;
    padding-left: 8px;
    border-left: 2px solid var(--red900);
    display: flex;
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1 2 auto;
    }
  }
  &__file {
    width: 29px;
    height: 100%;
    margin-right: 13px;
    display: flex;
    align-items: flex-end;
    position: relative;
    cursor: pointer;
    [type="file"] {
      opacity: 0;
      position: absolute;
      width: 0;
      height: 0;
    }
  }
  &__send-button {
    fill: #fff;
    width: 56px;
    height: 56px;
    background-color: var(--red900);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 13px;
    @include transition(filter);

    &:disabled {
      filter: grayscale(100%);
    }
  }
}
.file {
  padding: var(--v-rhythm-2);
  display: flex;
  &_data {
    flex: 1;
    padding-left: 22px;
    padding-right: 22px;
  }
  &_name {
    @extend .subtitle-1;
    color: var(--gray900);
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    @include desktop {
      max-width: 180px;
    }
  }
  &_size {
    @extend .caption-1;
    color: var(--gray500);
  }
}
.error {
  color: var(--red900);
  padding-left: 10px;
  padding-right: 10px;
}
</style>
<style lang="scss">
.quillWrapper.chat {
  .ql-toolbar {
    display: none !important;
  }
  .ql-container {
    border: none !important;
    background: #fff;
  }
}
</style>