<template>
  <div class="community__news-wrapper">
    <div class="community__add-news_header">
      <div class="community__add-news_title">Новости сообщества</div>
      <div class="community__add-news">
        <button
          class="community__add-btn"
          v-if="!isArchiveCommunity"
          @click="openAddModal"
        >
          <UserIcons :iconName="'plus-1'" />
        </button>
      </div>
    </div>

    <div class="community__news" :class="{ loading: isLoading }">
      <template v-if="questionsList.length > 0">
        <CommunityNewsItem
          v-for="post in questionsList"
          :key="post.ID"
          :post="post"
          @onEdit="openEditModal"
          @onDelete="openDeleteModal"
        />

        <!-- <div v-if="!isEndLoading" v-intersection="loadMore"></div> -->
      </template>
      <div v-else class="community__add-news_description">
        Будьте первым, кто добавит новость в это сообщество
      </div>
      <div v-if="!isEndLoading" class="community__documents-load_more">
        <button class="text-btn" @click="loadMore">
          <span>Загрузить ещё</span>
          <UserIcons :iconName="'arrow-down'" />
        </button>
      </div>
    </div>

    <transition name="fade">
      <MessageCommunityAddEditModal
        :key="addEditModalKey"
        :isVisible="addEditModalIsOpen"
        :id="addEditModalId"
        :isEdit="isEdit"
        @onClose="closeAddEditModal"
        @update="update"
      />
    </transition>

    <transition name="fade">
      <ConfirmModal
        :isVisible="сonfirmModalIsOpen"
        :confirmText="'Вы уверены, что хотите удалить новость сообщества?'"
        :confirmTextBtn="'Да, удалить'"
        :requestParameters="{
          method: 'post',
          url: `/mobileapp/api/group/news/delete`,
          data: {
            groupNewsId: currentNewsId,
          },
        }"
        @closeConfirmModal="closeConfirmModal"
        @confirmSuccess="confirmSuccess"
        @confirmError="confirmError"
      />
    </transition>

    <transition name="fade">
      <ErrorModal
        v-if="errorModalIsVisible"
        :hasRepeatBtn="false"
        :btnBackText="`Закрыть`"
        @onClose="errorModalIsVisible = false"
      >
        <!-- Сюда можно выводить текст ошибки -->
        <template #error></template>
      </ErrorModal>
    </transition>

    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Новость успешно удалена`"
        @onClose="closeSuccessModal"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import CommunityNewsItem from "./CommunityNewsItem.vue";
import MessageCommunityAddEditModal from "@/components/communities/MessageCommunityAddEditModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";

export default {
  name: "CommunityNews",

  components: {
    CommunityNewsItem,
    MessageCommunityAddEditModal,
    ConfirmModal,
    ErrorModal,
    SuccessModal,
  },

  props: {
    groupId: {
      type: Number,
      required: true,
    },
    isArchiveCommunity: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isEdit: false,
      isLoading: false,
      isEndLoading: true,
      questionsList: [],
      addEditModalIsOpen: false,
      сonfirmModalIsOpen: false,

      addEditModalKey: 0,
      currentNewsId: "",

      errorModalIsVisible: false,
      successModalIsVisible: false,
    };
  },

  computed: {
    addEditModalId() {
      return String(this.isEdit ? this.currentNewsId : this.groupId);
    },
  },

  methods: {
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.getCommunityQuestions();
    },

    closeConfirmModal() {
      this.сonfirmModalIsOpen = false;
    },

    confirmSuccess() {
      this.closeConfirmModal();
      this.successModalIsVisible = true;

      setTimeout(() => {
        if (this.successModalIsVisible) {
          this.closeSuccessModal();
        }
      }, 3000);
    },

    confirmError() {
      this.closeConfirmModal();
      this.errorModalIsVisible = true;
    },

    closeAddEditModal() {
      this.addEditModalIsOpen = false;
      this.addEditModalKey += 1;
    },

    openAddModal() {
      this.isEdit = false;
      this.addEditModalIsOpen = true;
    },

    openEditModal(id) {
      this.isEdit = true;
      this.currentNewsId = id;
      this.addEditModalIsOpen = true;
    },

    openDeleteModal(id) {
      this.currentNewsId = id;
      this.сonfirmModalIsOpen = true;
    },

    update(inputDataList) {
      if (this.isEdit) {
        const changes = inputDataList.find((item) => item.type === "editor");
        const editableObject = this.questionsList.find(
          (item) => item.ID === this.currentNewsId
        );
        editableObject.DETAIL_TEXT = changes.newValue;
      } else {
        this.getCommunityQuestions();
      }
    },

    async fetchCommunityQuestions(startFrom) {
      try {
        this.isEndLoading = true;
        this.isLoading = true;
        const response = await axios.get("/mobileapp/api/group/news/", {
          params: {
            groupId: this.groupId,
            count: 5,
            startFrom: startFrom,
          },
        });

        this.isEndLoading = response.data.end;
        return response.data.data;
      } catch (e) {
        this.isEndLoading = true;
        this.isEndLoading = [];
      } finally {
        this.isLoading = false;
      }
    },

    async getCommunityQuestions() {
      this.questionsList = await this.fetchCommunityQuestions(0);
    },

    async loadMore() {
      this.questionsList = [
        ...this.questionsList,
        ...(await this.fetchCommunityQuestions(this.questionsList.length)),
      ];
    },
  },

  watch: {},

  mounted() {
    this.getCommunityQuestions();
  },
};
</script>

<style scoped lang="scss">
.community {
  &__add-news_header {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-8);
    margin-bottom: var(--v-rhythm-8);
  }
  &__add-news_title {
    @extend .h2;
  }
  &__add-news_description {
    @extend .body-1;
    color: var(--gray500);
  }
  &__add-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--red900);
    border-radius: 16px;
    svg {
      fill: var(--white900);
    }
  }
  &__documents-load_more {
    margin-top: var(--v-rhythm-10);
    height: var(--v-rhythm-11);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--white900);
  }
}
</style>