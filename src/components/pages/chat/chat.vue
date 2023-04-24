<template>
  <DarkLayer
    v-if="isChatOpen"
    class="chat__sidebar"
    :style="{ top: `${headerHeight}px` }"
    @onClose="toggleChat"
    v-click-outside="toggleChat"
  >
    <div class="chat" @mousedown.stop>
      <!-- {{ isChatActiveOnOpen }} -->
      <button class="close" type="button" @click="toggleChat"></button>
      <ChatList
        :class="{
          loading: isContactLoading,
          hidden: activeChat || isNewChatCreating,
        }"
        :chatList="chatList"
        :searchMode="searchMode"
        :searchList="searchResult"
        :chatListIsEnded="chatListIsEnded"
        :active="activeChat"
        @onChatSelected="selectChat"
        @onSelectNewChat="onSelectNewChat"
        @onCreateChat="createNewChat"
        @onSearch="onSearch"
        @onLoadMoreContacts="onLoadMoreContacts"
        @onLoadMessages="onLoadMessages"
        @onLoadChats="onLoadChats"
        @onLoadEmployees="onLoadEmployees"
      />
      <div
        class="chat__wrapper"
        v-if="!isNewChatCreating && !isChatEditing"
        v-bind:class="{ loading: isChatLoading, visible: activeChat }"
      >
        <ChatDetail
          :messages="messages"
          :activeChat="activeChat"
          :repliedMessage="repliedMessage"
          :isChatEnded="isChatEnded"
          @onReply="onReply"
          @onCancelReply="onCancelReply"
          @onLoadMore="onLoadMore"
          @onCloseChat="closeChat"
          @onChatCreated="onChatCreated"
          @onSuccessEdit="onSuccessEdit"
          @editChat="editChat"
          @onDelete="onDelete"
          @onLike="onLike"
          @onDislike="onDislike"
          @onCitate="onCitate"
          @onEdit="onEdit"
          :key="Date.now()"
        />
        <ChatInput
          :activeChat="activeChat"
          :repliedMessage="repliedMessage"
          :editValue="editValue"
          :citateValue="citateValue"
          @onSended="updateSendedMessage"
          @onCancelReply="onCancelReply"
          @onSuccessEdit="onSuccessEdit"
          @onChatCreated="onChatCreated"
        />
      </div>

      <NewChat v-else-if="isNewChatCreating" @onClose="closeChat" />
      <EditChat
        v-else-if="isChatEditing"
        :activeChat="activeChat"
        @onClose="isChatEditing = false"
      />
    </div>
  </DarkLayer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DarkLayer from "@/components/modals/DarkLayer.vue";
import NewChat from "@/components/pages/chat/NewChat.vue";
import EditChat from "@/components/pages/chat/EditChat.vue";
import ChatList from "@/components/pages/chat/ChatList.vue";
import ChatDetail from "@/components/pages/chat/ChatDetail.vue";
import ChatInput from "@/components/pages/chat/ChatInput.vue";
import axios from "axios";
export default {
  data() {
    return {
      isChatLoading: false,
      isContactLoading: false,
      isNewChatCreating: false,
      isChatEditing: false,
      activeChat: 0,
      chatList: [],
      chatListIsEnded: false,
      isChatEnded: true,
      messages: [],
      repliedMessage: undefined,
      dialogPosition: 0,
      searchValue: "",
      searchMode: false,
      searchResult: {
        employees: [],
        messages: [],
        chats: [],
      },
      selectedChat: null,
      contactsFrom: 0,
      editValue: "",
      citateValue: "",
    };
  },
  components: {
    NewChat,
    ChatList,
    ChatDetail,
    DarkLayer,
    EditChat,
    ChatInput,
  },
  methods: {
    ...mapActions(["toggleChat", "updateUnreadMessages"]),
    selectChat(data) {
      this.isChatLoading = true;
      this.activeChat = data;
      this.messages = [];
      this.contactsFrom = 0;
      this.dialogPosition = 0;
      this.updateDialog();
      this.updateChats();
      this.onCancelReply();
      this.isChatEditing = false;
      this.searchValue = "";
      this.searchMode = false;
      this.searchResult = {
        employees: [],
        messages: [],
        chats: [],
      };
    },
    onSelectNewChat(data) {
      this.searchValue = "";
      this.searchMode = false;
      this.searchResult = {
        employees: [],
        messages: [],
        chats: [],
      };
      axios
        .get("/mobileapp/api/chat/getIdByUserId?userID=" + data.data.ID)
        .then((response) => {
          this.messages = [];
          this.updateDialog();
          this.dialogPosition = 0;
          this.selectedChat = response.data.roomId;
          // this.selectOldChat();
        });
    },
    updateChats() {
      if (!this.chatListIsEnded) {
        if (this.contactsFrom === 0) {
          axios
            .get(
              "/mobileapp/api/chat/?count=20&startFrom=" +
                this.contactsFrom +
                "&"
            )
            .then((response) => {
              if (response.data.data) {
                if (this.contactsFrom === 0) {
                  this.chatList = response.data.data;
                }
                this.chatListIsEnded = response.data.end;
              }
              if (this.selectedChat) {
                this.findChatInChatList();
              }
            });
        } else {
          axios
            .get(
              "/mobileapp/api/chat/?count=20&startFrom=" +
                this.contactsFrom +
                "&"
            )
            .then((response) => {
              if (response.data.data) {
                this.chatList = [...this.chatList, ...response.data.data];
                this.chatListIsEnded = response.data.end;
              }
              if (this.selectedChat) {
                this.findChatInChatList();
              }
            });
        }
      }
    },
    updateChatAfterMessage() {
      axios
        .get(
          "/mobileapp/api/chat/?count=20&startFrom=" + this.contactsFrom + "&"
        )
        .then((response) => {
          if (response.data.data) {
            if (this.contactsFrom === 0) {
              this.chatList = response.data.data;
            }
            this.chatListIsEnded = response.data.end;
          }
          if (this.selectedChat) {
            this.findChatInChatList();
          }
        })
        .finally(() => {
          this.$el
            .querySelector(".chat__contacts .contact__wrapper:first-child")
            .scrollIntoView({ behavior: "smooth", block: "center" });
        });
    },
    updateDialog(count = 20) {
      if (this.activeChat) {
        axios
          .get(
            "/mobileapp/api/chat/message/?chatId=" +
              this.activeChat.roomId +
              "&count=" +
              count +
              "&startFrom=" +
              this.dialogPosition
          )
          .then((response) => {
            if (this.messages.length < 21) {
              this.messages = response.data.data;
            } else {
              this.messages = [...this.messages, ...response.data.data];
            }

            this.isChatEnded = response.data.end;
            this.isChatLoading = false;

            this.updateUnreadMessages();
          });
      }
    },
    updateLastMessage() {
      axios
        .get(
          "/mobileapp/api/chat/message/?chatId=" +
            this.activeChat.roomId +
            "&count=1&startFrom=0"
        )
        .then((response) => {
          this.messages = [...response.data.data, ...this.messages];
        });
    },
    createNewChat() {
      this.isNewChatCreating = true;
    },
    updateAll() {
      this.updateUnreadMessages();
      this.updateDialog();
      this.updateChats(); // -сделать более оптимальную загрузку всех диалогов
    },
    updateSendedMessage() {
      this.dialogPosition = 0;
      this.updateLastMessage();
      this.updateChatAfterMessage();
    },
    addnewChat() {
      // for (let i in this.chatList) {
      //   let chat = this.chatList[i];
      //   console.log(chat.roomId === data.chatInfo.id);
      //   if (chat.roomId === data.chatInfo.id) return;
      // }
      this.updateChats();
    },
    initSocset() {
      // TODO: Переделать логику сокетов
      let socket = new WebSocket(
        "wss://" +
          (window.location.hostname === window.location.hostname) +
          "/wss/?user=" +
          JSON.parse(localStorage.currentUser).ID
      );

      socket.onopen = function () {
        console.log("[open] Соединение установлено");
      };
      socket.onmessage = (e) => {
        console.log(e);
        this.addnewChat(JSON.parse(e.data));
        this.updateUnreadMessages();
        this.updateChats();
        if (this.activeChat) {
          axios
            .get(
              "/mobileapp/api/chat/message/?chatId=" +
                this.activeChat.roomId +
                "&count=1&startFrom=0"
            )
            .then((response) => {
              this.messages.unshift(response.data.data[0]);
            });
        }
      };

      socket.onclose = () => {
        console.log("Соединение прервано");
        this.initSocset();
      };

      socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
      };
    },
    onReply(data) {
      this.repliedMessage = data.data;
    },
    onCancelReply() {
      this.repliedMessage = undefined;
    },
    onEdit(data) {
      this.editValue = data.data;
    },
    onLoadMore() {
      this.dialogPosition += 10;
      this.updateDialog();
    },
    onSearch(data) {
      this.searchValue = data.data;
      if (data.data.length >= 3) {
        this.searchMode = true;
      } else {
        this.searchMode = false;
      }

      axios
        .get(
          "/mobileapp/api/chat/?count=10&startFrom=0&filter[name]=" +
            this.searchValue
        )
        .then((response) => {
          this.searchResult.chats = response.data;
        });

      axios
        .get(
          "/mobileapp/api/chat/?count=10&startFrom=0&filter[message]=" +
            this.searchValue
        )
        .then((response) => {
          this.searchResult.messages = response.data;
        });
      axios
        .get(
          "/mobileapp/api/user/findByFIO/?count=10&startFrom=0&query=" +
            this.searchValue
        )
        .then((response) => {
          this.searchResult.employees = response.data;
        });
    },
    closeChat(data) {
      this.isChatLoading = true;
      this.isNewChatCreating = false;
      this.selectedChat = data;
      this.activeChat = "";
      if (data) {
        this.selectOldChat(data);
        this.updateDialog();
      }
    },
    selectOldChat(data) {
      axios
        .get("/mobileapp/api/chat/info?chatId=" + data)
        .then((response) => {
          let chat = response.data;
          this.selectChat({
            roomName: chat.name,
            roomId: chat.id,
            avatar: chat.avatar,
            type: "P",
            users: chat.users,
          });
        })
        .finally(() => {
          this.findChatInChatList(data);
        });
    },
    findChatInChatList(data) {
      if (data) {
        this.selectedChat = data;
      }
      // если чат не подсвечен, то ещё подскроливаем, если подсвечен, то бреак
      for (let i = this.contactsFrom; i < this.chatList.length; i++) {
        if (this.chatList[i].roomId === this.selectedChat) {
          this.isContactLoading = false;
          this.scrollToChat();
          this.selectedChat = "";
          break;
        }
      }
      this.onLoadMoreContacts();
    },
    scrollToChat() {
      this.$el
        .querySelector("#chat_" + this.selectedChat)
        .scrollIntoView({ behavior: "smooth", block: "center" });
    },
    onChatCreated(data) {
      this.searchMode = false;
      this.searchResult = [];

      axios.get("/mobileapp/api/chat/?count=1&startFrom=0").then((response) => {
        if (data.data == response.data.data[0].roomId) {
          this.activeChat = response.data.data[0];
        }

        this.dialogPosition = 0;
        this.updateDialog();
      });
      this.updateChats();
    },
    onLoadMessages(data) {
      axios
        .get(
          "/mobileapp/api/chat/?count=10&startFrom=" +
            data.data +
            "&filter[message]=" +
            this.searchValue
        )
        .then((response) => {
          this.searchResult.messages.data = [
            ...this.searchResult.messages.data,
            ...response.data.data,
          ];
          this.searchResult.messages.end = response.data.end;
        });
    },
    onLoadChats(data) {
      axios
        .get(
          "/mobileapp/api/chat/?count=10&startFrom=" +
            data.data +
            "&filter[name]=" +
            this.searchValue
        )
        .then((response) => {
          this.searchResult.chats.data = [
            ...this.searchResult.chats.data,
            ...response.data.data,
          ];
          this.searchResult.chats.end = response.data.end;
        });
    },
    onLoadEmployees(data) {
      axios
        .get(
          "/mobileapp/api/user/findByFIO/?count=10&startFrom=" +
            data.data +
            "&query=" +
            this.searchValue
        )
        .then((response) => {
          this.searchResult.employees.employee = [
            ...this.searchResult.employees.employee,
            ...response.data.employee,
          ];
          this.searchResult.employees.end = response.data.end;
        });
    },
    onLoadMoreContacts() {
      this.contactsFrom += 20;
      this.updateChats();
    },
    onSuccessEdit(data) {
      for (let message in this.messages) {
        if (this.messages[message].id === data.data.messageId) {
          this.messages[message].content = data.data.text;
        }
      }
    },
    onLike(data) {
      for (let message in this.messages) {
        if (this.messages[message].id === data.id) {
          let newRights = this.messages[message].rights.map((el) => {
            return el === "like" ? "dislike" : el;
          });
          this.messages[message].rights = newRights;
        }
      }
    },
    onDislike(data) {
      for (let message in this.messages) {
        if (this.messages[message].id === data.id) {
          let newRights = this.messages[message].rights.map((el) => {
            return el === "dislike" ? "like" : el;
          });
          this.messages[message].rights = newRights;
        }
      }
    },
    editChat() {
      this.isChatEditing = true;
    },
    onDelete(data) {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].id === data) {
          this.messages.splice(i, 1);
        }
      }
    },

    update() {
      this.$emit("onSended");
      this.citateValue = "";
    },
    onCitate(data) {
      this.citateValue = data.data;
    },
  },
  mounted() {
    this.initSocset();
    this.updateChats();
  },
  watch: {
    isChatOpen() {
      if (this.isChatOpen) {
        this.searchMode = false;
        this.activeChat = undefined;
      }
    },
    isChatActiveOnOpen() {
      if (this.isChatActiveOnOpen) {
        axios
          .get(
            "/mobileapp/api/chat/getIdByUserId?userID=" +
              this.isChatActiveOnOpen
          )
          .then((response) => {
            this.activeChat = response.data;
            this.updateDialog();
          });
      }
    },
  },
  computed: mapGetters(["isChatOpen", "isChatActiveOnOpen", "headerHeight"]),
  destroyed() {
    // добавить отключение сокета
    // socket.onclose = () => {
    //   console.log("Соединение прервано");
    //   // this.initSocset();
    // };
  },
};
</script>

<style lang="scss" scoped>
.close {
  position: absolute;
  left: 0;
  top: 32px;
  width: 48px;
  height: 40px;
  transform: translateX(-100%);
  background-color: var(--gray300);
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.3 5.71C17.91 5.32 17.28 5.32 16.89 5.71L12 10.59L7.10997 5.7C6.71997 5.31 6.08997 5.31 5.69997 5.7C5.30997 6.09 5.30997 6.72 5.69997 7.11L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.11C18.68 6.73 18.68 6.09 18.3 5.71Z' fill='%23445562'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  border: none;
  border-radius: 20px 0px 0px 20px;
  opacity: 0.7;
  transition: 0.3s opacity ease;
  &:hover {
    opacity: 1;
  }
}
.chat {
  display: flex;
  width: 70%;
  height: 100%;
  margin-left: auto;
  margin-right: 0;
  position: relative;
  background-color: #fff;
  @include laptop {
    width: 95%;
  }
  &__contacts {
    max-width: 320px;
    min-width: 200px;
    flex-shrink: 0;
    transition: 0.3s transform ease;
    @include phones {
      width: 100%;
      max-width: unset;
      &.hidden {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: #fff;
        z-index: 1;
        transform: translateX(-100%);
      }
    }
  }

  &__sidebar {
    z-index: calc(var(--header) - 1);
  }
  &__detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  @include phones {
    width: 100%;

    &__sidebar {
      // высота мобильного меню
      bottom: 63px;
    }
  }
  &__wrapper {
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    visibility: hidden;
    &.visible {
      visibility: unset;
    }
  }
}
</style>
