<template>
  <div class="menu__wrapper" v-bind:class="{ incoming: incoming }">
    <ul
      class="menu"
      v-if="menuShown"
      v-bind:style="css"
      :class="{ active: menuShown }"
    >
      <li class="menu__button" v-for="(item, i) in message.rights" :key="i">
        <button v-if="item === 'edit'" @click="editMessage">
          Редактировать
        </button>
        <button v-else-if="item === 'delete'" @click="deleteMessage">
          Удалить
        </button>
        <button v-else-if="item === 'copy'" @click="copyMessage">
          Копировать
        </button>
        <button v-else-if="item === 'citate'" @click="citateMessage">
          Цитировать
        </button>
        <button v-else-if="item === 'reply'" @click="replyMessage">
          Ответить
        </button>
        <!-- <button v-else-if="item === 'like'" @click="likeMessage">Лайк</button>
        <button v-else-if="item === 'dislike'" @click="dislikeMessage">
          Дизлайк
        </button> -->
      </li>
    </ul>
    <button @click="showMenu" class="message__menu">
      <UserIcons :iconName="'more'" />
    </button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    message: null,
    incoming: null,
    menuShown: null,
    menuPosition: null,
    css: null,
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    showMenu() {
      // console.log(e.clientX, e.clientY);
      // this.menuShown = !this.menuShown;
      this.$emit("onMobileMenuShow", this.message);
    },
    editMessage() {
      this.$emit("onEdit", { data: this.message });
    },
    deleteMessage() {
      this.$emit("onDelete", this.message.id);
      axios
        .post("/mobileapp/api/chat/message/delete", {
          messageId: this.message.id,
        })
        .then(() => {
          // this.$emit("onDelete", this.message.id);
        });
    },
    copyMessage() {
      this.$emit("onCopy");

      navigator.clipboard.writeText(this.cutTegs(this.message.content)).then(
        () => {
          console.log("Скопировано");
        },
        (err) => {
          console.error(err);
        }
      );
    },
    citateMessage() {
      this.$emit("onCitate", { data: this.message });
    },
    replyMessage() {
      this.$emit("onReply", { data: this.message });
    },
    cutTegs(str) {
      let regex = /<\/?[a-zA-Z]+>/gi,
        result = str.replace(regex, "");

      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  position: fixed;
  background-color: #fff;
  max-width: 136px;
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 1000;
  border: 1px solid var(--gray500);
  box-shadow: 8px 8px 16px rgba(9, 0, 109, 0.08);
  transform: translateX(0);
  @include phones {
    position: static;
    max-width: unset;
    width: 200px;
  }

  &__button button {
    padding: 12px;
    width: 100%;
    text-align: left;
    transition: 0.3s background ease;
    z-index: 10;
    &:hover {
      background-color: var(--red100);
    }
  }
  &__wrapper {
    height: 100%;
    transition: 0.3s opacity ease;
    display: flex;
    align-items: center;
    order: 0;
    &.incoming {
      order: 2;
      // transform: translateX(100%);
    }
  }
  .menu__wrapper.incoming & {
    // transform: translateX(100%);
  }
  &__button {
    z-index: 10;
  }
  &.active {
  }
}
.message {
  &__menu {
    background-color: #fff;
    padding: 6px;
    border-radius: 8px;
    margin-right: 8px;
    display: none;
    .incomning & {
      margin-right: 0;
      margin-left: 8px;
    }
    @include phones {
      display: flex;
    }
  }
}
</style>