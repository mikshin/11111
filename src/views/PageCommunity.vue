<template>
  <AppPage
    class="page-community"
    :class="{ loading: isLoading }"
    :breadcrumbsAnotherName="breadcrumbsAnotherName"
    :noTitle="true"
  >
    <template v-if="dataPage">
      <div class="page-community__wrapper-content">
        <SimpleLabel
          :class="{ loading: isLoading }"
          class="page-community__status"
          v-if="dataPage.STATUS"
          :labelText="dataPage.STATUS"
        />
        <SimplePicture
          :class="{ loading: isLoading }"
          class="page-community__image"
          :src="dataPage.PREVIEW_PICTURE"
        />
        <div class="page-community__wrapper-info">
          <div class="page-community__header">
            <h2 :class="{ loading: isLoading }" class="page-community__name">
              {{ dataPage.NAME }}
            </h2>

            <div class="page-community__icons-wrapper">
              <UserIcons
                class="page-community__icon page-community__icon_archive"
                iconName="archive"
                v-if="dataPage.ARCHIVE"
              />
              <UserIcons
                class="page-community__icon page-community__icon_lock"
                iconName="lock"
                v-if="dataPage.CLOSED"
              />

              <FunctionBtn
                class="page-community__icon_edit"
                v-if="dataPage.ACCESS_EDIT"
                iconName="pen"
                @clickBtn="openAddModal"
              />
            </div>
          </div>

          <div
            class="page-community__description"
            v-html="translateText(dataPage.PREVIEW_TEXT)"
          ></div>

          <span class="page-community__title-block">Владелец:</span>
          <SimplePersonCard
            :avatar="{
              alt: dataPage.CREATED_BY.FULL_NAME,
              src: dataPage.CREATED_BY.USER_PHOTO,
            }"
            :fullName="dataPage.CREATED_BY.FULL_NAME"
            :profession="dataPage.CREATED_BY.UF_WORK_POSITION"
            :link="true"
            :id="dataPage.CREATED_BY.ID"
            :vacation="dataPage.CREATED_BY.VACATION"
            :fired="dataPage.CREATED_BY.FIRED"
            class="page-community__autor"
          />
          <span class="page-community__title-block">Участники:</span>
          <div
            v-if="
              dataPage.PARTICIPIENT && dataPage.PARTICIPIENT.member.length > 0
            "
          >
            <ParticipantsListV2
              class="page-community__participants"
              :members="dataPage.PARTICIPIENT.member"
              :totalCount="dataPage.PARTICIPIENT.totalCount"
              :moreMembers="moreMembers"
              :moreMembersIsEnd="moreMembersIsEnd"
              :moreMembersIsLoading="moreMembersIsLoading"
              @getMoreMembers="getMoreMembers"
            />
          </div>
          <span class="page-community__info-block-empty" v-else
            >Нет участников</span
          >
          <button
            class="primary-btn"
            v-if="!dataPage.STATUS && !dataPage.CLOSED"
            :disabled="dataPage.ARCHIVE"
            @click="joinLeaveCommunity"
          >
            Присоединиться
          </button>
          <button
            class="secondary-btn"
            @click="joinLeaveCommunity"
            v-if="dataPage.STATUS === 'Участник'"
            :disabled="dataPage.ARCHIVE"
          >
            Покинуть
          </button>
        </div>
      </div>
      <div v-if="dataPage.STATUS" class="page-community__files_news-wrapper">
        <div class="page-community__files">
          <CommunityDocuments
            :groupId="idPage"
            :isArchiveCommunity="dataPage.ARCHIVE"
          />
        </div>
        <div class="page-community__news">
          <CommunityNews
            :groupId="idPage"
            :isArchiveCommunity="dataPage.ARCHIVE"
          />
        </div>
      </div>

      <transition name="fade">
        <CommunityAddEditModal
          :key="addEditModalKey"
          :isVisible="addEditModalIsOpen"
          :id="this.dataPage.ID"
          :isEdit="true"
          @onClose="closeAddEditModal"
          @update="update"
        />
      </transition>

      <transition name="fade">
        <ErrorModal
          v-if="errorModalIsVisible"
          :hasRepeatBtn="true"
          :btnBackText="`Закрыть`"
          @onClose="errorModalIsVisible = false"
          @repeat="joinLeaveCommunity"
        >
          <!-- Сюда можно выводить текст ошибки -->
          <template #error></template>
        </ErrorModal>
      </transition>

      <transition name="fade">
        <SuccessModal
          v-if="successModalIsVisible"
          :successText="
            this.dataPage.STATUS === 'Участник'
              ? `Вы покинули сообщество '${dataPage.NAME}'`
              : `Вы добавлены в сообщество`
          "
          @onClose="closeSuccessModal"
        />
      </transition>
    </template>

    <div class="page-community__no-access" v-else>
      <div class="page-text-default">Нет доступа к сообществу</div>

      <router-link class="text-btn" :to="'/communities'">
        <UserIcons :iconName="'arrow-left'" />
        <span>К списку сообществ</span>
      </router-link>
    </div>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import ParticipantsListV2 from "@/components/UI/ParticipantsListV2.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import SimpleLabel from "@/components/UI/labels/SimpleLabel.vue";
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
import CommunityDocuments from "@/components/pages/Community/CommunityDocuments.vue";
import CommunityNews from "@/components/pages/Community/CommunityNews.vue";
import CommunityAddEditModal from "@/components/communities/CommunityAddEditModal.vue";
import ErrorModal from "@/components/modals/ErrorModal.vue";
import SuccessModal from "@/components/modals/SuccessModal.vue";

export default {
  name: "PageCommunity",

  components: {
    AppPage,
    SimplePersonCard,
    ParticipantsListV2,
    SimplePicture,
    SimpleLabel,
    FunctionBtn,
    CommunityDocuments,
    CommunityNews,
    CommunityAddEditModal,
    ErrorModal,
    SuccessModal,
  },

  data() {
    return {
      dataPage: null,
      isLoading: false,
      moreMembersIsLoading: false,
      moreMembersIsEnd: false,
      moreMembers: [],

      addEditModalKey: 0,
      addEditModalIsOpen: false,

      errorModalIsVisible: false,
      successModalIsVisible: false,
    };
  },

  computed: {
    idPage() {
      return Number(this.$route.params.id);
    },

    breadcrumbsAnotherName() {
      return this.dataPage?.NAME
        ? `Сообщество «${this.dataPage.NAME}»`
        : "Нет доступа к сообществу";
    },

    currentUser() {
      return JSON.parse(localStorage.currentUser);
    },
  },

  methods: {
    translateText(str) {
      if (str) {
        let result = str.split("\r\n");

        return result.join("<br>");
      }
    },
    closeSuccessModal() {
      this.successModalIsVisible = false;
      this.getDataPage();
    },

    async joinLeaveCommunity() {
      try {
        this.isLoading = true;
        const form = new FormData();
        form.append("userId", this.currentUser.ID);
        form.append("groupId", this.idPage);
        await axios({
          method: "post",
          url:
            this.dataPage.STATUS === "Участник"
              ? `/mobileapp/api/group/member/delete`
              : `/mobileapp/api/group/member/add`,
          data: form,
        });
        this.successModalIsVisible = true;
        setTimeout(() => {
          if (this.successModalIsVisible) this.closeSuccessModal();
        }, 3000);
      } catch (error) {
        this.errorModalIsVisible = true;
      } finally {
        this.isLoading = false;
      }
    },

    update() {
      this.getDataPage();
    },

    openAddModal() {
      this.addEditModalIsOpen = true;
    },

    closeAddEditModal() {
      this.addEditModalIsOpen = false;
      this.addEditModalKey += 1;
    },

    async getMoreMembers() {
      if (!this.moreMembersIsEnd) {
        try {
          this.moreMembersIsLoading = true;
          this.moreMembersIsEnd = true;
          const response = await axios({
            method: "get",
            url: `/mobileapp/api/group/members?groupId=${
              this.idPage
            }&startFrom=${this.moreMembers.length + 5}&count=10`,
          });
          this.moreMembers = [
            ...this.moreMembers,
            ...this.convertArray(response.data.member),
          ];
          this.moreMembersIsEnd = response.data.end;
        } catch (error) {
          console.log(error);
        } finally {
          this.moreMembersIsLoading = false;
        }
      }
    },

    convertArray(arr) {
      return arr.map((item) => {
        return {
          authorInfo: {
            userLastName: item.FULL_NAME,
            userPhoto: item.USER_PHOTO,
            userId: item.ID,
          },
        };
      });
    },

    async getDataPage() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/group/info?groupId=${this.idPage}`,
        });

        this.dataPage = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.getDataPage();
  },
};
</script>

<style scoped lang="scss">
.page-community {
  &__wrapper-content {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__wrapper-info {
  }

  &__header {
    display: flex;
    justify-content: space-between;
    column-gap: var(--v-rhythm-6);
    margin-bottom: var(--v-rhythm-8);
  }

  &__icons-wrapper {
    display: flex;
  }

  &__icon {
    &_lock {
      fill: var(--gray300);
    }

    &_edit {
      margin-left: var(--v-rhythm-7);
    }
  }

  &__tooltip-list {
    padding-top: var(--v-rhythm-2);
    padding-bottom: var(--v-rhythm-2);
  }

  &__tooltip-item {
    @extend .body-1;
    padding: var(--v-rhythm-3);
    cursor: pointer;
    transition: all 0.25s ease;
    @include hover {
      background: var(--gray100);
    }
  }

  &__status {
    position: absolute;
    top: var(--v-rhythm-4);
    left: var(--v-rhythm-4);
    color: var(--gray900);
  }

  &__name {
    @extend .h2;
  }

  &__image {
    height: 540px;
  }

  &__description {
    @extend .v-html;
    display: block;
    width: 100%;
    margin-bottom: var(--v-rhythm-10);

    &::before {
      @extend .caption-2;
      content: "Описание";
      display: block;
      width: 70%;
      margin-bottom: var(--v-rhythm-2);
      padding-top: var(--v-rhythm-1);
      border-top: 1px solid var(--gray300);
      color: var(--gray500);
    }
  }

  &__title-block {
    display: block;
    margin-bottom: var(--v-rhythm-1);

    @extend .subtitle-1;
  }

  &__autor {
    margin-bottom: var(--v-rhythm-10);
  }

  &__info-block-empty {
    @extend .body-2;
    display: block;
    margin-bottom: var(--v-rhythm-8);
  }

  &__participants {
    margin-bottom: var(--v-rhythm-8);
  }
  &__files_news-wrapper {
    margin-top: var(--v-rhythm-9);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__no-access {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--v-rhythm-8);
  }

  @include phones {
    &__wrapper-content {
      grid-template-columns: 1fr;
    }
    &__image {
      height: auto;
    }
    &__files_news-wrapper {
      grid-template-columns: 1fr;
    }
  }
}
</style>