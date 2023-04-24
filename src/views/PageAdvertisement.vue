<template>
  <AppPage :breadcrumbsAnotherName="advertisement.NAME" :noTitle="true">
    <div class="advertisement_page-wrapper" :class="{ loading: isAdvLoading }">
      <div class="advertisement_page-left_side">
        <div class="advertisement_page-top_line"></div>
        <div
          class="advertisement_page-category"
          :class="{ advertisement_card__archive: advertisement.ARCHIVE }"
        >
          <span v-if="advertisement.THEMA">
            {{ advertisement.THEMA }}
          </span>
          <span v-else>Категория не указана</span>
          <span
            class="advertisement_page__category_is_mine"
            v-if="advertisement.MY"
            :class="{ advertisement_card__archive: advertisement.ARCHIVE }"
            >MОЁ</span
          >
        </div>
        <div class="advertisement_page-header_wrapper" id="appendID">
          <div
            class="advertisement_page-header"
            :class="{ advertisement_card__archive: advertisement.ARCHIVE }"
          >
            {{ advertisement.NAME }}
          </div>
          <div v-if="advertisement.RIGHT && advertisement.RIGHT.length > 0">
            <ComponentStateManagement
              :actions="advertisement.RIGHT"
              appendToId="appendID"
              @actions="executeAction"
            >
              <FunctionBtn
                :iconName="'more'"
                class="advertisement_page-function_btn"
              />
            </ComponentStateManagement>
            <div
              v-if="isFunctionMenuVisible"
              v-click-outside="toggleFunctionMenu"
              class="advertisement_page-function_btn-menu"
            ></div>
          </div>
        </div>

        <div class="advertisement_page-author_block" v-if="!isAdvLoading">
          <p
            class="advertisement_page__author_text"
            :class="{ advertisement_card__archive: advertisement.ARCHIVE }"
          >
            Автор:
          </p>
          <SimplePersonCard
            :avatar="{ src: advertisement.CREATED_BY.USER_PHOTO }"
            :fullName="advertisement.CREATED_BY.FULL_NAME"
            :link="true"
            :id="advertisement.CREATED_BY.ID"
            :profession="advertisement.CREATED_BY.UF_WORK_POSITION"
            :vacation="advertisement.CREATED_BY.VACATION"
            :fired="advertisement.CREATED_BY.FIRED"
            :class="{ loading: isAdvLoading }"
            class="advertisement_page__simple_preson_card"
          />
          <p
            class="advertisement_page__author_text"
            :class="{ advertisement_card__archive: advertisement.ARCHIVE }"
          >
            <!-- Опубликовано: -->
            <span class="advertisement_page__author_text_inner">{{
              advertisement.ACTIVE_FROM
            }}</span>
          </p>
          <p
            class="advertisement_page__author_text"
            v-if="advertisement.ARCHIVE"
          >
            Снято с публикации:
            <span class="advertisement_page__author_text_inner">{{
              advertisement.ACTIVE_TO
            }}</span>
          </p>
        </div>
        <div class="advertisement_page-description">
          <div class="advertisement_page-top_line"></div>
          <p class="advertisement_page__author_text">Описание</p>
          <div
            class="advertisement_page__text"
            v-html="advertisement.PREVIEW_TEXT"
          ></div>
        </div>
        <div class="advertisement_page__image_section">
          <div
            class="advertisement_page__image_wrapper"
            v-for="image in advertisement.IMAGES"
            :key="image.fileId"
            @click="toggleModal(image)"
          >
            <img
              :src="image.fileLink"
              :alt="image.originalName"
              class="advertisement_page__image"
            />
          </div>
        </div>
        <!-- {{ advertisement }} -->
      </div>
      <div class="advertisement_page-right_side" v-if="!isAdvLoading">
        <SectionCommentsHeader
          :quantity="Number(advertisement.COMMENT_COUNT)"
        />

        <Comments
          :entryId="advertisement.ID"
          recordType="advertisements"
          :requestGetComments="requestGetComments"
          @onComments="addComments"
          :isWhiteBg="true"
          :alignment="'start'"
          :isBordered="true"
        />
      </div>
    </div>
    <transition name="fade">
      <SimpleImageModal
        @closePreview="closeModal"
        :image="propForModal"
        v-if="isModalVisible"
      />
    </transition>
    <transition name="fade">
      <ConfirmModal
        :isVisible="isConfirmModalVisible"
        :confirmText="confirmText"
        :confirmTextBtn="confirmTextBtn"
        :requestParameters="requestParameters"
        @closeConfirmModal="closeConfirmModal"
        @confirmSuccess="confirmSuccess"
        @confirmError="confirmError"
      />
    </transition>
    <transition name="fade">
      <SuccessModal
        v-if="successModalIsVisible"
        :successText="`Выполнено успешно`"
        @onClose="closeSuccessModal"
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
      <AdvertisementAddEditModal
        :key="addEditModalKey"
        :isVisible="addEditModalIsOpen"
        :isEdit="true"
        :id="advertisement.ID"
        @onClose="closeAddEditModal"
        @update="getAdvertisement"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import AppPage from "@/components/UI/page/AppPage.vue";
import SimpleImageModal from "@/components/pages/Advertisements/SimpleImageModal.vue";
import SectionCommentsHeader from "../components/comments/section-comments/SectionCommentsHeader.vue";
import Comments from "@/components/pages/news/comments.vue";
import FunctionBtn from "../components/UI/FunctionBtn.vue";
import ComponentStateManagement from "../components/pages/Advertisements/ComponentStateManagement.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import AdvertisementAddEditModal from "@/components/pages/Advertisements/AdvertisementAddEditModal.vue";
export default {
  name: "PageAdvertisement",

  components: {
    AppPage,
    SimplePersonCard,
    SimpleImageModal,
    SectionCommentsHeader,
    Comments,
    FunctionBtn,
    ComponentStateManagement,
    ConfirmModal,
    SuccessModal,
    ErrorModal,
    AdvertisementAddEditModal,
  },

  // props: {
  //   advertisement: {
  //     type: Object,
  //     required: true,
  //   },
  // },

  data() {
    return {
      pageID: this.isAdvLoading
        ? this.advertisement.NAME
        : this.$route.params.id,
      isAdvLoading: true,
      advertisement: {},
      isCommentsLoading: true,
      comments: [],
      isModalVisible: false,
      propForModal: {},
      isFunctionMenuVisible: false,
      successModalIsVisible: false,
      errorModalIsVisible: false,
      isConfirmModalVisible: false,
      requestParameters: {},
      confirmText: "",
      confirmTextBtn: "",
      confirmModalParams: "",
      addEditModalKey: 0,
      addEditModalIsOpen: false,
    };
  },

  computed: {
    requestGetComments() {
      return {
        url: "/mobileapp/api/advertising/comments",
        params: { addvertisingId: this.pageID },
      };
    },
  },

  methods: {
    closeAddEditModal() {
      this.addEditModalIsOpen = false;
      this.addEditModalKey += 1;
    },
    async getAdvertisement() {
      try {
        const response = await axios.get("/mobileapp/api/advertising/info", {
          params: {
            advtId: this.$route.params.id,
          },
        });
        if (response) {
          this.advertisement = response.data;
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isAdvLoading = false;
      }
    },
    toggleModal(image) {
      this.propForModal = image;
      this.isModalVisible = !this.isModalVisible;
    },
    closeModal() {
      this.propForModal = {};
      this.isModalVisible = !this.isModalVisible;
    },
    addComments() {
      this.getAdvertisement();
    },
    toggleFunctionMenu() {
      this.isFunctionMenuVisible = !this.isFunctionMenuVisible;
    },
    // :requestParameters="{
    //       method: 'post',
    //       url: `/mobileapp/api/group/documents/delete`,
    //       data: {
    //         documentId: currentDocumentId,
    //       },
    //     }"
    closeConfirmModal() {
      this.isConfirmModalVisible = false;
    },
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.$router.push("/advertisements");
    },
    confirmError() {
      this.closeConfirmModal();
      this.errorModalIsVisible = true;
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
    executeAction(e) {
      if (e === "delete") {
        this.confirmText = "Вы уверены, что хотите удалить объявление?";
        this.confirmTextBtn = "Да, удалить";

        this.requestParameters = {
          method: "post",
          url: `/mobileapp/api/advertising/delete?advtId=${this.$route.params.id}`,
        };
        this.isConfirmModalVisible = true;
      }
      if (e === "prolongate") {
        // this.prolongateAdd(this.$route.params.id);
        this.confirmText = "Вы уверены, что хотите продлить срок объявления?";
        this.confirmTextBtn = "Да, продлить";

        this.requestParameters = {
          method: "post",
          url: `/mobileapp/api/advertising/prolongate?advtId=${this.$route.params.id}`,
        };
        this.isConfirmModalVisible = true;
      }
      if (e === "close") {
        this.confirmText = "Вы уверены, что хотите закрыть объявления?";
        this.confirmTextBtn = "Да, закрыть";

        this.requestParameters = {
          method: "post",
          url: `/mobileapp/api/advertising/unpublish?advtId=${this.$route.params.id}`,
        };
        this.isConfirmModalVisible = true;
      }
      if (e === "edit") {
        console.log("edit");
        this.addEditModalIsOpen = true;
      }
    },
    async deleteAdd(id) {
      try {
        const response = await axios.post(
          `/mobileapp/api/advertising/delete?advtId=${id}`
        );
        if (response) {
          this.$router.push("/advertisements");
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.toggleFunctionMenu();
      }
    },
    async prolongateAdd(id) {
      try {
        const response = await axios.post(
          `/mobileapp/api/advertising/prolongate?advtId=${id}`
        );
        if (response) {
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.toggleFunctionMenu();
      }
    },
    async unpublishAdd(id) {
      try {
        const response = await axios.post(
          `/mobileapp/api/advertising/unpublish?advtId=${id}`
        );
        if (response) {
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.toggleFunctionMenu();
      }
    },
  },

  watch: {},

  mounted() {
    this.getAdvertisement();
  },
};
</script>

<style scoped lang="scss">
.advertisement_page {
  &-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }
  &-top_line {
    width: 100%;
    border-top: 2px solid var(--gray300);
    margin-bottom: var(--v-rhythm-8);
  }
  &-category {
    @extend .overline;
    color: var(--red900);
    display: flex;
    justify-content: space-between;
    &.advertisement_card__archive {
      color: var(--gray500);
    }
  }
  &-header_wrapper {
    margin-top: var(--v-rhythm-10);
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  &-header {
    @extend .h2;
    width: calc(100% - 50px);
    &.advertisement_card__archive {
      color: var(--gray500);
    }
  }
  &-function_btn {
    position: relative;
  }
  &-function_btn-menu {
    position: absolute;
    background-color: var(--white900);
    width: 180px;
    height: auto;
    padding: var(--v-rhythm-2) 0;
    z-index: 1;
    border: 1px solid var(--gray500);
  }
  &-actions_menu {
  }
  &-actions_menu_item {
    @extend .body-1;
    cursor: pointer;
    //padding: var(--v-rhythm-3);
    span {
      padding: var(--v-rhythm-3);
      display: block;
    }
    &:hover {
      background-color: var(--gray100);
    }
  }
  &-author_block {
    margin-top: var(--v-rhythm-10);
  }
  &__author_text {
    @extend .subtitle-1;
    margin-bottom: var(--v-rhythm-4);
    &.advertisement_card__archive {
      color: var(--gray500);
    }
  }
  &__simple_preson_card {
    margin-bottom: var(--v-rhythm-4);
  }
  &__author_text_inner {
    @extend .body-1;
  }
  &-description {
    margin-top: var(--v-rhythm-10);
  }
  &__text {
    @extend .v-html;
  }
  &-image_section {
    margin-top: var(--v-rhythm-8);
  }
  &__image_wrapper {
    width: 100%;
    height: 360px;
    overflow: hidden;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: var(--v-rhythm-4);
  }
  &__image {
    width: 100%;
  }
  &__category_is_mine {
    @extend .overline;
    background-color: #05ab83;
    color: var(--white900);
    padding: var(--v-rhythm-3) var(--v-rhythm-4);
    border-radius: var(--v-rhythm-8);
    &.advertisement_card__archive {
      background-color: var(--gray500);
      color: var(--white900);
    }
  }
}
@media (max-width: 768px) {
  .advertisement_page {
    &-wrapper {
      grid-template-columns: 1fr;
      gap: var(--v-rhythm-4);
    }
    &-top_line {
      margin-bottom: var(--v-rhythm-4);
    }

    &-author_block {
      margin-top: var(--v-rhythm-5);
    }
    &-description {
      margin-top: var(--v-rhythm-5);
    }
    &-image_section {
      margin-top: var(--v-rhythm-4);
    }
    &__image_wrapper {
      height: auto;
    }
  }
}
</style>