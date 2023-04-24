<template>
  <li class="comment">
    <div class="comment-wrapper">
      <SimplePicture
        class="avatar"
        @onClick="goToLk"
        :alt="comment.authorInfo.userName"
        :src="comment.authorInfo.userPhoto"
      />

      <UserIcons
        class="label"
        v-if="comment.authorInfo.VACATION"
        :iconName="'vacation-label'"
      />
      <UserIcons
        class="label"
        v-else-if="comment.authorInfo.FIRED"
        :iconName="'fired-label'"
      />

      <div class="name" @click="goToLk">
        {{ comment.authorInfo.userName }}
        {{ comment.authorInfo.userLastName }}
      </div>
      <div class="text" v-html="comment.commentText" ref="commentText"></div>

      <div class="comment__attached">
        <ul class="file_list">
          <li v-for="(file, i) in comment.files" :key="i">
            <span :title="file.name">{{ fileName(file.fileLink) }}</span>
            <a :href="datFileUrl(file.fileLink)" download target="_blank">
              <user-icons :iconName="'download'"></user-icons>
            </a>
          </li>
        </ul>
      </div>

      <div class="date" v-if="comment.commentDate">
        {{ comment.commentDate.day }} {{ comment.commentDate.month }}
        {{ comment.commentDate.year }} {{ comment.commentDate.hour }}:{{
          comment.commentDate.minute
        }}
      </div>
      <div class="comment__actions" v-if="recordType === 'tasks'">
        <div class="comment__actions-left comment__actions-wrapper">
          <div class="comment__like-counter">
            <AppCounter
              :counterIcon="'like'"
              :counterNumber="this.likesCount"
              :isActive="isLikedByCurrentUser"
              @click="likeComment(comment.commentId)"
            />
          </div>
          <div class="comment__reply" @click="commentReply">
            <!-- Нельзя отвечать самому себе -->
            <user-icons
              class="action-icon"
              iconName="comment"
              v-if="!canDelete"
            ></user-icons>
          </div>
        </div>
        <div class="comment__actions-right comment__actions-wrapper">
          <div class="comment__edit" v-if="canEdit" @click="editComment">
            <user-icons class="action-icon" iconName="pen"></user-icons>
          </div>
          <div
            class="comment__delete"
            v-if="canDelete"
            @click="commentDelete(comment.commentId)"
          >
            <user-icons class="action-icon" iconName="X"></user-icons>
          </div>
        </div>
      </div>
    </div>
    <div class="comment__border" v-if="isBordered"></div>
  </li>
</template>

<script>
import axios from "axios";
import AppCounter from "@/components/UI/counter/AppCounter.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";

export default {
  name: "SingleComment",

  props: {
    comment: null,
    entryId: null,
    recordType: String,
    isBordered: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    AppCounter,
    SimplePicture,
  },

  data() {
    return {
      likesCount: 0,
      isLikedByCurrentUser: null,
    };
  },

  methods: {
    goToLk() {
      this.$router.push(`/lk?=${this.comment.authorInfo.userId}`);
    },

    fileName(fileLink) {
      return fileLink.substring(fileLink.lastIndexOf("/") + 1);
    },
    likeComment(commentId) {
      let data = new FormData();
      data.append("TASK_ID", this.entryId);
      data.append("COMMENT_ID", commentId);

      if (this.isLikedByCurrentUser) {
        axios
          .post("/mobileapp/api/task/comment/like/delete", data)
          .then((response) => {
            if (response.data.status === "success") {
              this.getLikes();
            }
          });
      } else {
        axios
          .post("/mobileapp/api/task/comment/like/add", data)
          .then((response) => {
            if (response.data.status === "success") {
              this.getLikes();
            }
          });
      }
    },
    getLikes() {
      axios
        .get(
          `/mobileapp/api/task/comment/like/count/?taskId=${this.entryId}&commentId=${this.comment.commentId}`
        )
        .then((response) => {
          this.likesCount = response.data.total;
          this.isLikedByCurrentUser = response.data.isLikedByCurrentUser;
        });
    },
    editComment() {
      this.$emit("editComment", {
        editType: "edit",
        htmlText: this.comment.commentText,
        plainText: this.$refs.commentText.innerText,
        commentId: this.comment.commentId,
      });
    },
    commentReply() {
      this.$emit("commentReply", {
        editType: "reply",
        htmlText: this.comment.commentText,
        plainText: this.$refs.commentText.innerText,
        commentId: this.comment.commentId,
        authorInfo: this.comment.authorInfo,
      });
    },
    commentDelete(commentId) {
      this.$emit("commentDelete", commentId);
    },
  },

  computed: {
    datFileUrl() {
      // корректировк адреса для локалхоста
      const getHostame = window.location.hostname === window.location.hostname;
      const getProtocol = window.location.protocol;
      return (link) => {
        const linkParts = link.split("/");
        const ind = linkParts.indexOf("upload");
        linkParts.splice(0, ind);
        const nl = new URL(
          `/${linkParts.join("/")}`,
          `${getProtocol}//${getHostame}`
        );
        return nl.href;
      };
    },
    canDelete() {
      if (this.comment.usersRights) {
        return this.comment.usersRights.includes("delete");
      } else {
        return false;
      }
    },
    canEdit() {
      if (this.comment.usersRights) {
        return this.comment.usersRights.includes("edit");
      } else {
        return false;
      }
    },
    canReply() {
      if (this.comment.usersRights) {
        return this.comment.usersRights.includes("reply");
      } else {
        return false;
      }
    },
  },

  mounted() {
    // !TODO переписать
    if (this.recordType === "tasks") this.getLikes();
  },
};
</script>

<style lang="scss" scoped>
.comment-wrapper {
  position: relative;

  padding: 16px;
  padding-left: 48px;

  .label {
    position: absolute;
    top: 16px;
    left: -4px;

    width: 16px;
    height: 16px;
  }
}

.avatar {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 0;
  top: 40px;
  transform: translateY(-50%);
  border-radius: 40px;
  overflow: hidden;

  cursor: pointer;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.name {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--gray900);
  padding-bottom: 2px;

  cursor: pointer;
  @include transition(color);

  @include hover {
    color: var(--red900);
  }
}

.text {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--gray900);
  padding-bottom: 2px;

  // Подключаем дефолтные стили
  @extend .v-html;
}

.date {
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: var(--gray500);
}

// Файлы прикрепленные к комментарию
.file_list {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: var(--v-rhythm-2);
  flex-wrap: wrap;

  li {
    background-color: var(--red100);
    margin-bottom: var(--v-rhythm-1);
    border-radius: var(--v-rhythm-6);
    border: 1px solid var(--red300);
    margin-right: var(--v-rhythm-1);
    white-space: nowrap;
    max-width: 270px;
    min-width: 80px;
    text-overflow: ellipsis;
    overflow: hidden;
    // padding: 8px;
    // padding-right: 33px;
    padding: 5px 32px 5px 8px;
    display: inline-block;
    position: relative;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    img {
      width: 100%;
      max-width: 100%;
      // height: 100%;
      object-fit: cover;

      & + span {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    a {
      fill: var(--red500);
      position: absolute;
      right: 3px;
      left: auto;
      top: 55%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: fill 0.3s;

      &:hover {
        fill: var(--red900);
      }

      .user-icons {
        --icon-size: 20px;
      }
    }

    span {
      display: block;
      word-wrap: break-word;
    }
  }
}

.app-counter {
  display: inline-flex;
  cursor: pointer;
}

.action-icon {
  width: 20px;
  height: 20px;

  @include phones {
    width: 16px;
    height: 16px;
  }
}

.comment {
  &__actions {
    display: flex;
    justify-content: space-between;
    margin-top: var(--v-rhythm-1);
  }

  &__actions-wrapper {
    display: flex;
  }

  &__attached {
    margin-bottom: var(--v-rhythm-2);
  }

  &__reply,
  &__edit,
  &__delete {
    padding: 4px 8px;
    fill: var(--gray500);
    transition: fill 0.3s;
    cursor: pointer;

    &:hover {
      fill: var(--red700);
    }
  }
}
</style>
