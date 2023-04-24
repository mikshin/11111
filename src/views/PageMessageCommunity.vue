<template>
  <AppPage
    class="page-message-community"
    :class="{ loading: isLoading }"
    v-if="dataPage"
    :noTitle="true"
    :breadcrumbsFullPath="breadcrumbsFullPath()"
  >
    <div class="page-message-community__content">
      <div class="page-message-community__left">
        <div class="page-message-community__left-content">
          <div class="page-message-community__left-header">
            <div class="page-message-community__left-title">Сообщение</div>
            <div
              class="page-message-community__left-btns"
              v-if="dataPage.ACCESS && dataPage.ACCESS.length > 0"
            >
              <template v-for="(item, i) in dataPage.ACCESS">
                <FunctionBtn
                  class="page-message-community__left-btn"
                  v-if="item === 'edit'"
                  :key="i"
                  :iconName="'pen'"
                  @clickBtn="openEditModal"
                />
                <FunctionBtn
                  class="page-message-community__left-btn"
                  v-if="item === 'delete'"
                  :key="i"
                  :iconName="'trash'"
                  @clickBtn="openDeleteModal"
                />
              </template>
            </div>
          </div>

          <SimplePersonCard
            class="page-message-community__left-header-person"
            :avatar="{
              alt: dataPage.CREATED_BY.FULL_NAME,
              src: dataPage.CREATED_BY.USER_PHOTO,
            }"
            :fullName="dataPage.CREATED_BY.FULL_NAME"
            :link="true"
            :id="dataPage.CREATED_BY.ID"
            :postDate="dataPage.DATE_CREATE"
            :vacation="dataPage.CREATED_BY.VACATION"
            :fired="dataPage.CREATED_BY.FIRED"
          />
        </div>
      </div>

      <div class="page-message-community__right">
        <div
          class="page-message-community__description"
          v-html="dataPage.DETAIL_TEXT"
        ></div>

        <div
          class="page-message-community__documents"
          v-if="dataPage.FILES && dataPage.FILES.length > 0"
        >
          <AppDocument
            class="divisions-docs__document"
            v-for="file in dataPage.FILES"
            :key="file.fileId"
            :fileId="file.fileId"
            :fileTitle="file.originalName"
            :fileSize="file.fileSize"
            :fileExtension="file.extension"
            :fileLink="file.fileLink"
          />
        </div>

        <SectionComments
          class="page-message-community__comments"
          :recordType="'messageCommunity'"
          :requestGetComments="requestGetComments"
          :commentsCount="dataPage.COMMENT_COUNT"
          :entryId="idPage"
          :instance="dataPage"
          :isWhiteBg="true"
          :alignment="'start'"
          :viewsEndPoints="viewsEndPoints"
          :likesEndPoints="likesEndPoints"
          @addComments="dataPage.COMMENT_COUNT++"
          :appCounters="{
            id: idPage,
            like: {
              counter: dataPage.LIKE_COUNT,
            },
            view: {
              counter: dataPage.VIEW_COUNT,
            },
          }"
        />
      </div>
    </div>

    <transition name="fade">
      <MessageCommunityAddEditModal
        :key="addEditModalKey"
        :isVisible="addEditModalIsOpen"
        :id="idPage"
        :isEdit="true"
        @onClose="closeAddEditModal"
        @update="getDataPage"
      />
    </transition>

    <transition name="fade">
      <ConfirmModal
        :isVisible="сonfirmModalIsOpen"
        :confirmText="'Вы уверены, что хотите удалить сообщение?'"
        :confirmTextBtn="'Да, удалить'"
        :requestParameters="{
          method: 'post',
          url: `/mobileapp/api/group/news/delete`,
          data: {
            groupNewsId: idPage,
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
        :successText="`Сообщение удалено`"
        @onClose="closeSuccessModal"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AppPage from "@/components/UI/page/AppPage.vue";
import AppDocument from "@/components/UI/document/AppDocument.vue";
import SectionComments from "@/components/comments/section-comments/SectionComments.vue";
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
import MessageCommunityAddEditModal from "@/components/communities/MessageCommunityAddEditModal.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";

export default {
  name: "PageMessageCommunity",

  components: {
    SimplePersonCard,
    AppPage,
    AppDocument,
    SectionComments,
    FunctionBtn,
    MessageCommunityAddEditModal,
    ConfirmModal,
    ErrorModal,
    SuccessModal,
  },

  props: {},

  data() {
    return {
      dataPage: null,
      isLoading: false,

      addEditModalIsOpen: false,
      сonfirmModalIsOpen: false,
      addEditModalKey: 0,
      errorModalIsVisible: false,
      successModalIsVisible: false,
    };
  },

  computed: {
    requestGetComments() {
      return {
        url: "/mobileapp/api/group/news/comments",
        params: { groupNewsId: this.idPage },
      };
    },

    idPage() {
      return this.$route.params.idMessage;
    },
    //?groupNewsId=" + this.post.ID,
    viewsEndPoints() {
      return {
        isActive: true,
        getListURL: "/mobileapp/api/group/news/view",
        actions: null,
      };
    },

    likesEndPoints() {
      return {
        isActive: true,
        getListURL: "/mobileapp/api/group/news/like/",
        currentState: this.dataPage.IS_LIKE ? this.dataPage.IS_LIKE : false,
        actions: {
          set: {
            url: "/mobileapp/api/group/news/like/add",
            params: {
              groupNewsId: this.idPage,
            },
          },
          remove: {
            url: "/mobileapp/api/group/news/like/delete",
            params: {
              groupNewsId: this.idPage,
            },
          },
        },
      };
    },
  },

  methods: {
    closeSuccessModal() {
      this.$router.push(`/communities/${this.$route.params.id}`);
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

    openEditModal() {
      this.addEditModalIsOpen = true;
    },

    openDeleteModal() {
      this.сonfirmModalIsOpen = true;
    },

    async getDataPage() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/group/news/info?groupNewsId=${this.idPage}`,
        });

        this.dataPage = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    addView() {
      try {
        const form = new FormData();
        form.append("groupNewsId", this.idPage);
        axios({
          method: "post",
          url: `/mobileapp/api/group/news/view/add`,
          data: form,
        });
      } catch (error) {
        console.log(error);
      }
    },
    breadcrumbsFullPath() {
      let breadcrumbs = [
        {
          name: "Сообщества",
          path: "/communities",
        },
        {
          name: "Сообщество «" + this.dataPage.GROUP_NAME + "»",
          path: "/communities/" + this.dataPage.GROUP_ID,
        },
        {
          name: "Сообщение",
          path: "/",
        },
      ];
      return breadcrumbs;
    },
  },

  watch: {
    dataPage() {
      if (this.dataPage && !this.dataPage.IS_VIEW) this.addView();
    },
  },

  mounted() {
    this.getDataPage();
  },
};
</script>

<style scoped lang="scss">
.page-message-community {
  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__left {
    position: relative;
  }

  &__left-content {
    position: sticky;
    top: 100px;
    left: 0;

    padding: var(--v-rhythm-8) 0;

    border-top: 2px solid var(--gray300);
    border-bottom: 2px solid var(--gray300);
  }

  &__left-header {
    margin-bottom: var(--v-rhythm-8);

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  &__left-title {
    @extend .h2;
    color: var(--gray900);
  }

  &__left-btns {
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-4);
  }

  &__left-btn {
  }

  &__left-header-person {
  }

  &__right {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-10);
  }

  &__description {
    @extend .v-html;
  }

  &__documents {
  }

  &__document {
  }

  &__comments {
  }

  @include laptop {
    &__content {
      grid-template-columns: repeat(1, 1fr);
    }

    &__left-content {
      padding-top: unset;
      border-top: unset;
    }
  }

  @include phones {
    &__content {
      gap: var(--v-rhythm-6);
    }

    &__left-content {
      padding-bottom: var(--v-rhythm-6);
    }

    &__left-header {
      margin-bottom: var(--v-rhythm-6);
    }

    &__right {
      gap: var(--v-rhythm-6);
    }
  }
}
</style>