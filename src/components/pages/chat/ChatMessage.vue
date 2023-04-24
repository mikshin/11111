<template>
  <div
    class="chat__message"
    v-bind:class="{ incoming: message.senderId != currentUser().ID }"
    @contextmenu.prevent="rightClick"
    @click="menuShown = false"
    v-click-outside="hideMenu"
  >
    <router-link
      :to="'lk?=' + message.senderId"
      class="message__sender"
      v-if="message.senderId != currentUser().ID"
      v-show="!minimal"
    >
      <SimplePicture
        :src="message.avatar"
        alt=""
        v-if="calcPosition(message, nextMessageId)"
        @click="toggleChat"
        class="message__picture"
      />
      <span class="message__icon" v-if="calcPosition(message, nextMessageId)">
        <UserIcons :iconName="'fired-label'" v-if="message.FIRED" />
        <UserIcons :iconName="'vacation-label'" v-else-if="message.VACATION" />
      </span>
    </router-link>

    <div class="message__content" @contextmenu.prevent="hideMenuRightCLick">
      <router-link :to="'lk?=' + message.senderId">
        <b
          v-if="message.senderId != currentUser().ID"
          v-show="calcPosition(message, nextMessageId)"
          @click="toggleChat"
        >
          {{ message.userName }}</b
        >
      </router-link>
      <div class="message__replied" v-if="message.repliedMessInfo">
        <div class="message__replied-name">
          {{ message.repliedMessInfo.senderName }}
        </div>
        <div
          class="message__replied-text"
          v-html="message.repliedMessInfo.content"
        ></div>
      </div>
      <!-- <a
        class="message__file"
        :href="file"
        v-for="(file, i) in message.files"
        :key="i"
        ><FileIcon :format="'image / png'" />
        <div class="filename">{{ file }}</div></a
      > -->
      <template v-if="message.files">
        <template v-for="file in message.files">
          <!-- {{ file }} -->
          <AppDocument
            class="message__file"
            v-if="file"
            :key="file.fileId"
            :fileTitle="file.originalName"
            :fileSize="file.fileSize"
            :fileExtension="file.extension"
            :fileLink="file.fileLink"
            :fileId="file.fileId"
          />
        </template>
      </template>
      <div class="message__text">
        <span v-html="message.content"></span>

        <div class="message__actions">
          <button @click="like" class="message__like">
            <UserIcons
              class="chat__liked"
              :iconName="'like'"
              v-bind:class="{
                active: message.rights.includes('dislike'),
              }"
            /><span
              class="message__like-count"
              v-bind:class="{
                active: message.rights.includes('dislike'),
              }"
              >{{ this.likeCount ? this.likeCount : "" }}</span
            >
          </button>
          <div class="message__time">
            {{ message.date }} {{ message.timestamp }}
          </div>
          <div class="message__seen" v-bind:class="{ active: message.seen }">
            <UserIcons :iconName="'double_check'" />
          </div>
        </div>
      </div>
    </div>

    <div class="message__menu" v-click-outside="hideMenu">
      <MessageMenu
        :message="message"
        :menuShown="menuShown"
        :css="css"
        @onShown="onShown"
        @onDelete="onDelete"
        @onReply="onReply"
        @onCitate="onCitate"
        @onEdit="onEdit"
        @onMobileMenuShow="onMobileMenuShow"
        :incoming="message.senderId != currentUser().ID"
        :class="{ menuShown: menuShown }"
      />
    </div>
  </div>
</template>

<script>
// import FileIcon from "@/components/UI/FileIcon.vue";
import MessageMenu from "@/components/pages/chat/MessageMenu.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import axios from "axios";
import { mapActions } from "vuex";
export default {
  props: {
    message: Object,
    nextMessageId: null,
    minimal: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  components: {
    MessageMenu,
    AppDocument,
    SimplePicture,
    // FileIcon
  },
  data() {
    return {
      menuShown: false,
      likeCount: this.message.countLikes,
      css: { left: 0, top: 0 },
    };
  },
  methods: {
    ...mapActions(["toggleChat"]),
    hideMenuRightCLick() {
      this.$el.click();
    },
    hideMenu() {
      // console.log(123);
      this.menuShown = false;
    },
    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
    showMenu() {
      this.$emit("closeAllMenus");
      this.menuShown = !this.menuShown;
    },
    closeMenu() {
      this.menuShown = false;
    },
    calcPosition(message, nextMessage) {
      if (nextMessage) {
        return message.senderId != nextMessage.senderId;
      }
      return true;
    },
    update() {
      this.$emit("onUpdate");
    },
    onDelete(data) {
      this.$emit("onDelete", data);
    },
    onReply(data) {
      this.$emit("onReply", { data: data.data });
    },
    onEdit(data) {
      this.$emit("onEdit", { data: data.data });
    },
    onCitate(data) {
      this.$emit("onCitate", { data: data.data });
    },
    like() {
      if (this.message.rights.includes("dislike")) {
        // дизайк
        axios
          .post("./mobileapp/api/chat/message/like/delete", {
            messageId: this.message.id,
          })
          .then((response) => {
            this.likeCount = response.data.countLike;
            this.$emit("onDislike", this.message);
            // this.isLiked = false;
          });
      } else {
        // лайк
        axios
          .post("./mobileapp/api/chat/message/like/add", {
            messageId: this.message.id,
          })
          .then((response) => {
            this.likeCount = response.data.countLike;
            this.$emit("onLike", this.message);
            // this.isLiked = true;
          });
      }
    },
    onShown(e) {
      console.log(e);

      this.menuShown = true;
      // this.css.left = e.clientX + "px";
      // this.css.top = e.clientY + "px";
    },
    rightClick(e) {
      console.log("123");
      this.menuShown = true;
      let difX = 160,
        difY = 300;
      this.css.left = e.clientX + "px";
      this.css.top = e.clientY + "px";
      if (
        window.innerWidth - e.clientX < difX &&
        window.innerHeight - e.clientY < difY
      ) {
        this.css.transform = "translate(-100%,-100%)";
      } else if (window.innerHeight - e.clientY < difY) {
        this.css.transform = "translateY(-100%)";
      } else if (window.innerWidth - e.clientX < difX) {
        this.css.transform = "translateX(-100%)";
      } else {
        this.css.transform = "";
      }
    },
    onMobileMenuShow(data) {
      this.$emit("onMobileMenuShow", data);
    },
  },
  mounted() {
    this.isLiked = this.message.rights.includes("dislike");
  },
};
</script>
<style lang="scss" scoped>
.chat {
  &__message {
    margin: 10px 0;
    margin-left: auto;
    margin-right: 0;
    // border: 1px solid var(--red900);
    padding: 8px;
    max-width: 70%;
    max-width: calc(70%);
    position: relative;
    display: flex;

    &.incoming {
      margin-left: 0;
      margin-right: auto;
    }
    &:first-child,
    &:nth-child(2) {
      ::v-deep {
        .menu {
          transform: translateY(-100%);
        }
      }
    }
  }

  &__liked {
    fill: var(--gray500);
    &.active {
      fill: var(--red900);
    }
  }
}
.message {
  &__menu {
    position: absolute;
    left: 0;
    top: 50%;

    @include phones {
      transform: translate(-100%, -50%);
    }
    .incoming & {
      left: unset;
      right: 0;
      top: 50%;
      @include phones {
        transform: translate(100%, -50%);
      }
    }
  }
  &__sender {
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    overflow: hidden;
    margin-right: 8px;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
    @include phones {
      display: none;
    }
  }
  &__content {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    box-shadow: 0px 1px 2px rgba(16, 35, 47, 0.15);
    border-radius: 4px;
    padding: 8px 10px;
    order: 1;
    min-height: 68px;
    span {
      flex: 1;
      max-width: 100%;
      word-break: break-word;
    }
  }
  &__text {
    flex: 1;
    min-width: 100px;
    max-width: calc(100%);
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    ::v-deep {
      p {
        @extend .body-2;
        word-wrap: break-word;
      }
    }
    @include phones {
      flex-direction: column;
    }
    .incoming & {
      align-items: flex-start;
    }
  }
  &__replied {
    padding-left: 10px;
    border-left: 2px solid var(--red900);
    &-name {
      @extend .subtitle-1;
    }
    &-text {
      @extend .body-1;
      ::v-deep {
        p {
          white-space: nowrap;
          max-width: calc(100%);
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-top: 8px;

    @include phones {
      width: 100%;
      margin: 0;
      justify-content: space-between;
    }
  }
  &__time {
    @extend .caption-1;
    padding-right: 28px;
    .incoming & {
      padding-right: 0;
    }
    @include phones {
      display: flex;
    }
  }
  &__file {
    height: 56px;
    max-width: 340px;
    overflow: hidden;
  }
  &__seen {
    position: absolute;
    right: 18px;
    bottom: 12px;
    width: 20px;
    height: 20px;
    fill: var(--red900);
    &.active {
      fill: #05ab83;
    }
    .incoming & {
      display: none;
    }
  }
  &__picture {
    height: 100%;
  }
  &__like {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-2);
    padding-right: var(--v-rhythm-3);
    &-count {
      @extend .button;
      color: var(--gray500);
      &.active {
        color: var(--red900);
      }
    }
  }

  &__icon {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 16px;
    height: 16px;
    .user-icons {
      --icon-size: 16px;
    }
  }
}
</style>