<template>
  <div
    @click="selectChat(contact)"
    class="contact__wrapper"
    v-bind:class="{
      active: contact.roomId === activeChat.roomId && contact.roomId,
    }"
    :id="'chat_' + contact.roomId"
  >
    <template v-if="contact.roomName">
      <SimpleTooltip
        v-show="contact.roomName.length > 20"
        class="contact__tooltip"
        :iconName="''"
        :content="contact.roomName ? contact.roomName : contact.FULL_NAME"
      />
    </template>
    <SimplePersonCard
      :avatar="{
        alt: contact.roomName,
        src: returnAvatar(contact),
      }"
      :fullName="contact.roomName"
      :profession="
        contact.lastMessage.content ? contact.lastMessage.content : 'Вложение'
      "
      :vacation="vacation(contact)"
      :fired="fired(contact)"
      class="chat__contact"
      v-show="includesUser(contact.ID)"
      v-if="contact.roomName"
    />
    <SimplePersonCard
      :avatar="{
        alt: contact.FULL_NAME,
        src: contact.USER_PHOTO,
      }"
      :fullName="contact.FULL_NAME"
      :profession="contact.UF_WORK_POSITION"
      :vacation="vacation(contact)"
      :fired="fired(contact)"
      class="chat__contact"
      v-show="includesUser(contact.ID)"
      v-else
    />
    <span class="contact__time" v-if="contact.lastMessage">
      {{ contact.lastMessage.timestamp }}
    </span>
    <span class="contact__unread" v-show="contact.unreadCount > 0">
      {{ contact.unreadCount }}</span
    >
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import SimpleTooltip from "@/components/UI/tooltip/SimpleTooltip.vue";

export default {
  name: "",

  components: { SimplePersonCard, SimpleTooltip },

  props: {
    contact: null,
    activeChat: null,
  },

  data() {
    return {};
  },

  computed: {
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    includesUser(ID) {
      if (localStorage.getItem("ID") === ID) return false;
      return true;
    },
    selectChat() {
      if (this.contact.roomId) {
        this.$emit("onSelectChat", { data: this.contact });
      } else {
        this.$emit("onSelectNewChat", { data: this.contact });
      }
    },
    returnAvatar(contact) {
      if (contact.avatar) {
        return contact.avatar;
      }
      if (contact.users.length < 3) {
        return contact.avatar;
      }
      return `/img/test-img/111.jpg`;
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

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.contact {
  &__tooltip {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &__unread {
    position: absolute;
    right: 16px;
    bottom: 10px;
    width: 20px;
    height: 20px;
    background-color: var(--red700);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    @extend .overline;
    @include phones {
      width: 18px;
      height: 18px;
    }
  }
}
</style>