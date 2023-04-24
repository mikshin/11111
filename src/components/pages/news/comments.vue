<template>
  <div class="comments">
    <button
      class="comments__more-btn text-btn"
      v-if="!isEnd"
      @click="moreGetComments"
    >
      <span>Загрузить ещё</span>
      <user-icons :iconName="'arrow-down'" />
    </button>

    <ul
      class="comments__list"
      :class="{ loading: isLoading }"
      v-if="comments.length"
    >
      <SingleComment
        class="comments__comment"
        v-for="(comment, i) in comments"
        :key="i"
        :comment="comment"
        :entryId="entryId"
        :recordType="recordType"
        :isBordered="isBordered"
        @editComment="editComment"
        @commentReply="commentReply"
        @commentDelete="commentDelete"
      />
    </ul>

    <CommentField
      class="comments__field"
      :entryId="entryId"
      :recordType="recordType"
      :editedTextObj="this.editedTextObj"
      :isEditing="this.isEditing"
      :addFile="addFile"
      :isWhiteBg="isWhiteBg"
      :alignment="alignment"
      @onComments="addComments"
      @closeEditing="closeEditing"
      :isRequiredText="isRequiredCommentText"
      id="comments"
    />

    <transition name="fade">
      <DeleteModal
        class="comments__delete-modal delete-modal"
        :maxWidth="'450'"
        @onClose="isDeleting = false"
        v-if="isDeleting"
      >
        <h3>Удалить комментарий?</h3>
        <div class="delete-modal__button-container">
          <a class="primary-btn" @click="confirmDelete">Подтвердить</a>
          <a class="secondary-btn" @click="isDeleting = false">Отменить</a>
        </div>
      </DeleteModal>
    </transition>
  </div>
</template>

<script>
import CommentField from "@/components/UI/CommentField.vue";
import SingleComment from "@/components/pages/news/SingleComment.vue";
import DeleteModal from "@/components/modals/AppModal.vue";
import axios from "axios";

import { eventBus } from "@utils";

export default {
  name: "Comments",

  components: {
    CommentField,
    SingleComment,
    DeleteModal,
  },

  props: {
    entryId: null,
    recordType: null,
    addFile: { type: Boolean, default: false },
    isWhiteBg: {
      type: Boolean,
      default: false,
    },
    alignment: {
      type: String,
      default: "center",
    },
    isBordered: {
      type: Boolean,
      default: false,
    },

    requestGetComments: {
      type: Object,
      required: true,
    },

    isRequiredCommentText: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      comments: [],
      showAll: false,
      editedTextObj: {},
      isEditing: false,
      isDeleting: false,
      deleteCommentId: null,
      isLoading: false,
      isEnd: true,
    };
  },

  computed: {},

  methods: {
    async moreGetComments() {
      this.comments = [
        ...(await this.requestComments(this.comments.length)),
        ...this.comments,
      ];
    },

    async getComments() {
      this.comments = await this.requestComments();
    },

    async requestComments(startFrom = 0) {
      try {
        this.isLoading = true;

        const response = await axios({
          method: "get",
          url: this.requestGetComments.url,
          params: Object.assign(this.requestGetComments.params, {
            count: 10,
            startFrom: startFrom,
          }),
        });

        this.isEnd = response.data.end;

        //Удалить, когда в апи объект поменяют на массив
        if (response.data.data.length === undefined) {
          return Object.values(response.data.data);
        } else if (response.data.data.length >= 0) {
          return response.data.data;
        }
      } catch (error) {
        this.isEnd = true;
        return [];
      } finally {
        this.$nextTick(() => {
          eventBus.$emit("#comments-mounted");
        });
        this.isLoading = false;
      }
    },

    addComments() {
      this.getComments();
      this.closeEditing();
      this.$emit("onComments");
    },

    fileName(fileLink) {
      return fileLink.substring(fileLink.lastIndexOf("/") + 1);
    },

    editComment(data) {
      this.editedTextObj = data;
      this.isEditing = true;
    },

    commentReply(data) {
      this.editedTextObj = data;
      this.isEditing = true;
    },

    closeEditing() {
      this.isEditing = false;
      this.editedTextObj = {};
    },

    commentDelete(commentId) {
      this.isDeleting = true;
      this.deleteCommentId = commentId;
    },
    confirmDelete() {
      let data = new FormData();
      data.append("TASK_ID", this.entryId);
      data.append("ID", this.deleteCommentId);
      axios
        .post("/mobileapp/api/task/comment/delete", data)
        .then((response) => {
          if (response.data === "Success") {
            this.isDeleting = false;
            this.deleteCommentId = null;
            this.getComments();
          }
        });
    },
  },

  mounted() {
    this.getComments();
  },
};
</script>

<style lang="scss" scoped>
.comments {
  display: flex;
  flex-direction: column;

  &__more-btn {
    align-self: center;
  }

  &__list {
    position: relative;

    width: 100%;
    padding-bottom: var(--mainPadding);

    display: flex;
    flex-direction: column;

    border-bottom: 2px solid var(--gray300);
  }

  &__comment {
    width: 100%;

    border-bottom: 1px solid var(--gray300);
    &:last-child() {
      border-bottom: none;
    }
  }

  &__field {
    width: 100%;
  }

  &__delete-modal {
  }
}

.delete-modal {
  &__button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}
</style>
