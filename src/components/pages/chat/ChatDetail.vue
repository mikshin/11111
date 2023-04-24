<template>
  <div class="chat__detail" v-if="activeChat">
    <div class="chat__info" v-if="activeChat.users.length > 2">
      <button @click="closeChat" class="chat__back">
        <UserIcons :iconName="'arrow-left'" class="chat__search-icon" />
      </button>

      <SimplePersonCard
        :avatar="{
          alt: activeChat.roomName,
          src: activeChat.avatar ? activeChat.avatar : '/img/test-img/111.jpg',
        }"
        :fullName="activeChat.roomName"
        :vacation="vacation(activeChat)"
        :fired="fired(activeChat)"
        class="chat__contact chat__card"
      />
      <button
        @click="editChat"
        class="chat__options"
        v-if="activeChat.users.length > 2"
      >
        <UserIcons :iconName="'pen'" @click="editChat" />
      </button>
    </div>
    <div class="chat__info" v-else>
      <button @click="closeChat" class="chat__back">
        <UserIcons :iconName="'arrow-left'" class="chat__search-icon" />
      </button>

      <router-link :to="'/lk?=' + routerLink" @click.native="toggleChat">
        <SimplePersonCard
          :avatar="{
            alt: activeChat.roomName,
            src: activeChat.avatar,
          }"
          :fullName="activeChat.roomName"
          :profession="activeChat.profession"
          :vacation="vacation(activeChat)"
          :fired="fired(activeChat)"
          class="chat__contact chat__card"
        />
        <button
          @click="editChat"
          class="chat__options"
          v-if="activeChat.users.length > 2"
        >
          <UserIcons :iconName="'pen'" @click="editChat" />
        </button>
      </router-link>
    </div>
    <div class="chat__messages" v-bind:class="{ loading: isChatLoading }">
      <template v-if="newChat">
        <ChatMessage
          v-for="(message, i) in messages"
          :key="i"
          :message="message"
          :nextMessageId="messages[i + 1]"
          :minimal="activeChat.users.length <= 2"
          @onUpdate="update"
          @onReply="onReply"
          @onEdit="onEdit"
          @onCitate="onCitate"
          @onDelete="onDelete"
          @onDislike="onDislike"
          @onLike="onLike"
          @onMobileMenuShow="onMobileMenuShow"
        />
        <div v-intersection="loadMessages" v-if="!isChatEnded"></div>
      </template>
      <template v-else> Чат не создан </template>
    </div>
    <!-- <ChatInput
      :activeChat="activeChat"
      :repliedMessage="repliedMessage"
      :editValue="editValue"
      :citateValue="citateValue"
      @onSended="update"
      @onCancelReply="onCancelReply"
      @onSuccessEdit="onSuccessEdit"
      @onChatCreated="onChatCreated"
    /> -->
    <div class="chat__mobile_menu" v-if="mobileMenuShown">
      <div class="close" @click="mobileMenuHidden"></div>
      <div class="content">
        <MessageMenu
          :message="currentMessage"
          :menuShown="true"
          :incoming="currentMessage.senderId != currentUser().ID"
          @onDelete="onDelete"
          @onReply="onReply"
          @onCitate="onCitate"
          @onEdit="onEdit"
          @onCopy="mobileMenuHidden"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import ChatMessage from "@/components/pages/chat/ChatMessage.vue";
// import ChatInput from "@/components/pages/chat/ChatInput.vue";
import MessageMenu from "@/components/pages/chat/MessageMenu.vue";
import { mapActions } from "vuex";
// import axios from "axios";

export default {
  props: {
    messages: null,
    activeChat: null,
    repliedMessage: null,
    isChatEnded: null,
  },
  data() {
    return {
      isChatLoading: false,
      mobileMenuShown: false,
      currentMessage: undefined,
    };
  },
  components: {
    SimplePersonCard,
    ChatMessage,
    // ChatInput,
    MessageMenu,
  },
  computed: {
    newChat() {
      if (this.messages) return true;
      return false;
    },
    routerLink() {
      for (let i in this.activeChat.users) {
        if (
          this.activeChat.users[i].id != JSON.parse(localStorage.currentUser).ID
        )
          return this.activeChat.users[i].id;
      }
      return "";
    },
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },
  methods: {
    ...mapActions(["toggleChat"]),

    update() {
      this.$emit("onSended");
      this.citateValue = "";
    },
    onDelete(data) {
      this.$emit("onDelete", data);
      this.mobileMenuHidden = false;
    },
    onReply(data) {
      this.$emit("onReply", { data: data.data });
      this.mobileMenuHidden();
    },
    onCancelReply() {
      this.$emit("onCancelReply");
      this.mobileMenuHidden();
    },
    onEdit(data) {
      this.$emit("onEdit", { data: data.data });
      this.mobileMenuHidden();
    },
    onSuccessEdit(data) {
      this.editValue = "";
      this.$emit("onSuccessEdit", { data: data.data });
    },
    onCitate(data) {
      this.$emit("onCitate", { data: data.data });
      this.mobileMenuHidden();
    },
    closeChat() {
      this.$emit("onCloseChat");
    },
    loadMessages() {
      this.$emit("onLoadMore");
    },
    onChatCreated(data) {
      this.$emit("onChatCreated", { data: data.data });
    },
    editChat() {
      this.$emit("editChat");
      this.mobileMenuHidden();
    },
    onLike(data) {
      this.$emit("onLike", data);
    },
    onDislike(data) {
      this.$emit("onDislike", data);
    },
    onMobileMenuShow(data) {
      console.log(data);
      this.currentMessage = data;
      this.mobileMenuShown = true;
    },
    mobileMenuHidden() {
      this.mobileMenuShown = false;
    },
    vacation(user) {
      if (user.users.length <= 2) {
        for (let tmp of user.users) {
          if (this.currentUser.ID != tmp.id) {
            return tmp.VACATION;
          }
        }
      }
      return false;
    },
    fired(user) {
      if (user.users.length <= 2) {
        for (let tmp of user.users) {
          if (this.currentUser.ID != tmp.id) {
            return tmp.FIRED;
          }
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.chat {
  &__detail {
    height: 200px;
  }
  &__messages {
    flex: 1;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    background-color: var(--gray300);
    // max-height: 800px;
    overflow-y: auto;
  }
  &__info {
    display: flex;
    padding: 16px;
  }
  &__back {
    margin-right: 8px;
  }
  &__card {
    flex: 1;
  }
  &__options {
    margin-left: 8px;
  }
  &__mobile_menu {
    display: none;
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
    align-items: flex-end;
    justify-content: center;
    @include phones {
      display: flex;
    }
    .close {
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: 0;

      background-color: rgba(0, 0, 0, 0.25);
    }
    .content {
      z-index: 1;
      // height: 230px;
      max-width: 200px;

      background-color: #fff;
    }

    ::v-deep {
      .message__menu {
        display: none;
      }
    }
  }
}
</style>