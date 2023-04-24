<template>
  <AppPage
    v-if="photoContestInfo"
    class="page-photo-contest"
    :breadcrumbsAnotherName="breadcrumbsAnotherName"
    :noTitle="true"
  >
    <div class="page-photo-contest__content" :class="{ loading: isLoading }">
      <div class="page-photo-contest__left">
        <div class="sticky" ref="sticky" :style="`top: ${this.topStiky}px`">
          <div class="page-photo-contest__header">
            <ul class="page-photo-contest__header-dates">
              <li class="page-photo-contest__header-dates-item">
                Начало:
                <span class="page-photo-contest__header-dates-date">{{
                  photoContestInfo.UF_ACTIVE_FROM
                }}</span>
              </li>
              <li class="page-photo-contest__header-dates-item">
                Окончание:
                <span class="page-photo-contest__header-dates-date">{{
                  photoContestInfo.UF_ACTIVE_TO
                }}</span>
              </li>
            </ul>
            <span class="page-photo-contest__header-title">{{
              photoContestInfo.NAME
            }}</span>
            <div class="page-photo-contest__triggers">
              <SimpleTrigger
                class="page-photo-contest__trigger"
                :count="photoContestInfo.PARTICIPIENT_COUNT"
                :title="'Участников'"
                :iconName="'group'"
              />
              <SimpleTrigger
                class="page-photo-contest__trigger"
                :count="photoContestInfo.TOTAL_IMAGE_COUNT"
                :title="'Работ'"
                :iconName="'image'"
              />
            </div>
            <button
              class="page-photo-contest__header-btn primary-btn"
              v-if="photoContestInfo.ACTIVE"
              @click="modalAddPhotoIsOpen = true"
            >
              Принять участие
            </button>
          </div>
          <SectionComments
            class="
              page-photo-contest__comments page-photo-contest__comments--sticky
            "
            :commentsCount="commentsCount"
            :entryId="id"
            :recordType="'photoContest'"
            :requestGetComments="requestGetComments"
            @addComments="commentsCount++"
            :isWhiteBg="true"
            :alignment="'start'"
          />
        </div>
      </div>
      <div class="page-photo-contest__right">
        <div class="page-photo-contest__right-content">
          <div class="page-photo-contest__picture">
            <PhotoContestStatus
              class="page-photo-contest__picture-label"
              :active="photoContestInfo.ACTIVE"
            />

            <SimplePicture
              class="page-photo-contest__picture-img"
              :alt="photoContestInfo.NAME"
              :src="photoContestInfo.IMAGE"
            />
          </div>

          <div
            class="page-photo-contest__description"
            v-html="photoContestInfo.DESCRIPTION"
          ></div>

          <PagePhotoContestCards class="page-photo-contest__cards" :id="id" />
        </div>
      </div>
    </div>

    <transition name="fade">
      <ModalAddPhoto
        v-if="modalAddPhotoIsOpen"
        :photoContestId="id"
        @close="modalAddPhotoIsOpen = false"
      />
    </transition>
  </AppPage>
</template>

<script>
import axios from "axios";
import AppPage from "@/components/UI/page/AppPage.vue";
import PagePhotoContestCards from "@/components/photo-contest/PagePhotoContestCards.vue";
import SimpleTrigger from "@/components/UI/triggers/SimpleTrigger.vue";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import PhotoContestStatus from "@/components/UI/labels/PhotoContestStatus.vue";
import ModalAddPhoto from "@/components/modals/ModalAddPhoto.vue";
import SectionComments from "@/components/comments/section-comments/SectionComments.vue";

export default {
  name: "PagePhotoContest",

  components: {
    AppPage,
    SimpleTrigger,
    SimplePicture,
    PagePhotoContestCards,
    PhotoContestStatus,
    ModalAddPhoto,
    SectionComments,
  },

  data() {
    return {
      isLoading: false,

      id: null,
      photoContestInfo: null,

      modalAddPhotoIsOpen: false,

      commentsCount: 0,
      ro: null,
      topStiky: 75,
    };
  },

  computed: {
    requestGetComments() {
      return {
        url: "/mobileapp/api/photoContest/comments",
        params: { photoContestId: this.id },
      };
    },

    breadcrumbsAnotherName() {
      return `Конкурс «${
        this.photoContestInfo.NAME ? this.photoContestInfo.NAME : null
      }»`;
    },
  },

  methods: {
    async getData() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/photoContest/info?photoContestId=${this.id}`,
        });
        this.photoContestInfo = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async getComments() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/photoContest/comments/?do_count=Y&photoContestId=${this.id}`,
        });
        this.commentsCount = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    onResize() {
      this.topStiky =
        window.innerHeight - this.$refs.sticky.clientHeight > 75
          ? 75
          : window.innerHeight - this.$refs.sticky.clientHeight;
    },
  },

  async mounted() {
    this.id = this.$route.params.id;
    this.ro = new ResizeObserver(this.onResize);
    await this.getData();
    await this.getComments();
    this.$nextTick(() => {
      this.ro.observe(this.$refs.sticky);
    });
  },
};
</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  top: -300px;
}
.page-photo-contest {
  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--v-rhythm-8);
  }

  &__header {
    padding: var(--v-rhythm-8) 0;

    display: flex;
    flex-direction: column;

    border-top: 1px solid var(--gray300);
    border-bottom: 1px solid var(--gray300);

    &--sticky {
      position: sticky;
      top: 100px;
      left: 0;
    }
  }

  &__header-dates {
    margin-bottom: var(--v-rhythm-10);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__header-dates-item {
    @extend .subtitle-2;
    color: var(--gray900);
  }

  &__header-dates-date {
    color: var(--red900);
  }

  &__header-title {
    margin-bottom: var(--v-rhythm-14);

    @extend .h2;
    color: var(--gray900);
  }

  &__triggers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-6) calc(114 * 100% / 672);

    &:not(:last-child) {
      margin-bottom: var(--v-rhythm-8);
    }
  }

  &__trigger {
  }

  &__header-btn {
    align-self: flex-start;
  }

  &__right {
  }

  &__right-content {
    margin-bottom: var(--v-rhythm-8);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-10);
  }

  &__picture {
    position: relative;

    width: 100%;
    padding-top: calc(450 * 100% / 672);

    background-color: var(--gray500);
  }

  &__picture-label {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }

  &__picture-img {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;
  }

  &__description {
    @extend .v-html;
  }

  &__cards {
    width: 100%;
  }

  &__comments {
  }

  @include laptop {
    &__header {
      &--sticky {
        top: 80px;
      }
    }
  }

  @include phones {
    &__content {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>