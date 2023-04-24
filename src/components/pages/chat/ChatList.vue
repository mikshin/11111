<template>
  <div class="chat__contacts">
    <div class="chat__search">
      <label class="chat__search-input">
        <input
          type="search"
          placeholder="Поиск"
          v-model="searchValue"
          @input="searchContact"
        />
        <!-- <button
          class="chat__search-delete"
          @click="
            searchValue = '';
            searchContact;
          "
        >
          <UserIcons :iconName="'X'" />
        </button> -->
        <UserIcons :iconName="'search'" class="chat__search-icon" />
      </label>
      <button class="chat__add" type="submit" @click="createNewChat">
        <user-icons :iconName="'plus-1'" />
      </button>
    </div>
    <div class="contacts__wrapper">
      <template v-if="!searchMode">
        <ChatItem
          v-for="(contact, i) in chatList"
          :key="i"
          :contact="contact"
          :activeChat="active"
          @onSelectChat="selectChat"
          @onSelectNewChat="onSelectNewChat"
        />
        <div v-intersection="loadMore" v-if="!chatListIsEnded"></div>
      </template>
      <template v-else>
        <template v-if="searchList.employees.employee.length">
          <span class="contact__search-label">Сотрудники</span>
          <ChatItem
            v-for="(contact, i) in searchList.employees.employee"
            :key="'e' + i"
            :contact="contact"
            :activeChat="active"
            @onSelectChat="selectChat"
            @onSelectNewChat="onSelectNewChat"
          />
          <button
            class="contact__search-button"
            v-show="!searchList.employees.end"
            @click="loadEmployees()"
          >
            Загрузить ещё
          </button>
        </template>
        <template v-if="searchList.messages.data">
          <span class="contact__search-label">Сообщения</span>
          <ChatItem
            v-for="(contact, i) in searchList.messages.data"
            :key="'m' + i"
            :contact="contact"
            :activeChat="active"
            @onSelectChat="selectChat"
            @onSelectNewChat="onSelectNewChat"
          />
          <button
            class="contact__search-button"
            v-show="!searchList.messages.end"
            @click="loadMessages()"
          >
            Загрузить ещё
          </button>
        </template>
        <template v-if="searchList.chats.data">
          <span class="contact__search-label">Групповые чаты</span>
          <ChatItem
            v-for="(contact, i) in searchList.chats.data"
            :key="'c' + i"
            :contact="contact"
            :activeChat="activeChat"
            @onSelectChat="selectChat"
            @onSelectNewChat="onSelectNewChat"
          />
          <button
            class="contact__search-button"
            v-show="!searchList.chats.end"
            @click="loadChats()"
          >
            Загрузить ещё
          </button>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
// import Input from "@/components/UI/inputTemplate.vue";
// import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import ChatItem from "@/components/pages/chat/ChatItem.vue";
// import axios from "axios";

export default {
  props: {
    chatList: null,
    searchMode: null,
    searchList: null,
    chatListIsEnded: null,
    active: {
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      activeChat: this.active,
      searchValue: "",
      wait: true,
      contactsFrom: 0,
      employeesFrom: 0,
      messagesFrom: 0,
      chatsFrom: 0,
    };
  },
  components: {
    // Input,
    // SimplePersonCard,
    ChatItem,
  },
  computed: {},
  methods: {
    includesUser(ID) {
      if (localStorage.getItem("ID") === ID) return false;
      return true;
    },

    searchContact() {
      this.$emit("onSearch", { data: this.searchValue });
    },
    loadMore() {
      this.$emit("onLoadMoreContacts");
    },
    loadChats() {
      this.chatsFrom += 10;
      this.$emit("onLoadChats", { data: this.chatsFrom });
    },
    loadMessages() {
      this.messagesFrom += 10;
      this.$emit("onLoadMessages", { data: this.messagesFrom });
    },
    loadEmployees() {
      this.employeesFrom += 10;
      this.$emit("onLoadEmployees", { data: this.employeesFrom });
    },
    selectChat(data) {
      this.activeChat = data.data;
      this.isChatLoading = true;
      this.searchValue = "";
      this.$emit("onChatSelected", this.activeChat);
    },

    createNewChat() {
      this.$emit("onCreateChat");
    },

    onSelectNewChat(data) {
      this.searchValue = "";
      this.$emit("onSelectNewChat", { data: data.data });
    },
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__contact {
    max-width: 100%;
  }
  &__search {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    &-input {
      position: relative;
      width: 100%;
      input {
        width: 100%;
        padding: 16px 24px;
        border: 1px solid var(--gray500);
        @extend .body-2;
        color: var(--gray500);
        transition: 0.3s width ease;
        color: var(--gray700);
        font-size: 16px;
        &:focus {
          width: calc(100% + 52px);
          & ~ .chat__search-icon {
            right: -32px;
          }
          & ~ .chat__search-delete {
            opacity: 1;
          }
        }
      }
    }
    &-icon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      fill: var(--gray500);
      transition: 0.3s right ease;
    }
    &-delete {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      fill: var(--gray500);
      opacity: 0;
      transition: 0.3s opacity ease;
    }
  }
  &__add {
    margin-left: 12px;
    width: 44px;
    height: 44px;
    background-color: var(--red900);
    fill: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.contact {
  &__wrapper {
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    position: relative;
    border-bottom: 2px solid var(--gray200);
    transition: 0.3s background-color ease;
    cursor: pointer;

    &:last-child {
      border-color: #0000;
    }
    &.active {
      background-color: var(--red300);
    }
  }
  &__time {
    @extend .caption-1;
  }
  &__unread {
    position: absolute;
    bottom: 12px;
    right: 16px;
    width: 20px;
    height: 20px;
    background-color: var(--red700);
    color: #fff;
    box-shadow: 0 0 0 3px var(--gray100);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @extend .overline;
  }
  &__search {
    &-label {
      display: block;
      padding: 10px 16px;
      @extend .subtitle-1;
    }
    &-button {
      padding: 18px;
      width: 100%;
      text-align: center;
      color: var(--red900);
      @extend .button;
      border-bottom: 2px solid var(--gray200);
      &:last-child {
        border: none;
      }
    }
  }
}
.contacts__wrapper {
  flex: 1;
  max-height: calc(100% - 74px);
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
</style>