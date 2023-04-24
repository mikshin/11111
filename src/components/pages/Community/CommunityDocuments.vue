<template>
  <div class="community__documents-wrapper">
    <div class="community__add-document_header">
      <div class="community__add-document_title">Документы сообщества</div>
      <div class="community__add-document">
        <button
          class="community__add-btn"
          v-if="!isArchiveCommunity"
          @click="openAddModal"
        >
          <UserIcons :iconName="'plus-1'" />
        </button>
      </div>
    </div>

    <div class="community__documents" :class="{ loading: isLoading }">
      <template v-if="documentsList.length > 0">
        <CommunityDocument
          v-for="document in documentsList"
          :key="document.id"
          :document="document"
          :user="document.CREATED_BY"
          :rights="document.ACCESS"
          @onEdit="openEditModal"
          @onDelete="openDeleteModal"
        />

        <div v-if="!isEndLoading" class="community__documents-load_more">
          <button class="text-btn" @click="loadMore">
            <span>Загрузить ещё</span>
            <UserIcons :iconName="'arrow-down'" />
          </button>
        </div>
      </template>

      <div class="community__add-document_description" v-else>
        Документов нет
      </div>
    </div>

    <transition name="fade">
      <DocumentCommunityAddEditModal
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
        :confirmText="'Вы уверены, что хотите удалить документ сообщества?'"
        :confirmTextBtn="'Да, удалить'"
        :requestParameters="{
          method: 'post',
          url: `/mobileapp/api/group/documents/delete`,
          data: {
            documentId: currentDocumentId,
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
        :successText="`Документ успешно удален`"
        @onClose="closeSuccessModal"
      />
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import CommunityDocument from "@/components/pages/Community/CommunityDocument.vue";
import DocumentCommunityAddEditModal from "@/components/communities/DocumentCommunityAddEditModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";

export default {
  name: "CommunityDocuments",

  components: {
    CommunityDocument,
    DocumentCommunityAddEditModal,
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
      documentsList: [],
      addEditModalIsOpen: false,
      сonfirmModalIsOpen: false,

      addEditModalKey: 0,
      currentDocumentId: "",

      errorModalIsVisible: false,
      successModalIsVisible: false,
    };
  },

  computed: {
    addEditModalId() {
      return String(this.isEdit ? this.currentDocumentId : this.groupId);
    },
  },

  methods: {
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.getDocumentList();
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
      this.currentDocumentId = id;
      this.addEditModalIsOpen = true;
    },

    openDeleteModal(id) {
      this.currentDocumentId = id;
      this.сonfirmModalIsOpen = true;
    },

    update() {
      this.getDocumentList();
    },

    async fetchDocumentList(startFrom) {
      try {
        this.isEndLoading = true;
        this.isLoading = true;
        const response = await axios.get(
          `/mobileapp/api/group/documents/?groupId=${this.groupId}`,
          {
            params: {
              count: 5,
              startFrom: startFrom,
            },
          }
        );

        this.isEndLoading = response.data.end;
        return response.data.data;
      } catch (e) {
        this.isEndLoading = true;
        this.isEndLoading = [];
      } finally {
        this.isLoading = false;
      }
    },

    async getDocumentList() {
      this.documentsList = await this.fetchDocumentList(0);
    },

    async loadMore() {
      this.documentsList = [
        ...this.documentsList,
        ...(await this.fetchDocumentList(this.documentsList.length)),
      ];
    },
  },

  watch: {},

  mounted() {
    this.getDocumentList();
  },
};
</script>

<style scoped lang="scss">
.community {
  &__add-document_header {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-8);
    margin-bottom: var(--v-rhythm-8);
  }
  &__add-document_title {
    @extend .h2;
  }
  &__add-document_description {
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