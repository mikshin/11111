<template>
  <div class="photo-contest-card">
    <router-link
      :to="`/photo_contests/` + dataContest.ID"
      class="photo-contest-card__link"
    >
      <div class="photo-contest-card__photo-wrapper">
        <img
          class="photo-contest-card__photo"
          :alt="''"
          :src="dataContest.IMAGE"
        />

        <PhotoContestStatus
          :active="dataContest.ACTIVE"
          class="photo-contest-card__label"
        />
      </div>

      <div class="photo-contest-card__wrapper-content">
        <span class="photo-contest-card__date">
          Заявки:
          <span class="photo-contest-card__date_until">
            до {{ dataContest.UF_ACTIVE_TO }}</span
          >
        </span>
        <span
          class="photo-contest-card__title"
          v-html="dataContest.NAME"
        ></span>

        <div
          class="photo-contest-card__description"
          v-html="dataContest.DESCRIPTION"
        ></div>

        <div class="photo-contest-card__info-wrapper">
          <div class="photo-contest-card__info-block">
            <span class="photo-contest-card__info-block-title">
              Приняли участие:
            </span>

            <ParticipantsListV2
              class="community-card__members-list"
              v-if="
                dataContest.PARTICIPIENT &&
                dataContest.PARTICIPIENT.member.length > 0
              "
              :members="dataContest.PARTICIPIENT.member"
              :totalCount="dataContest.PARTICIPIENT.totalCount"
              :moreMembers="moreMembers"
              :moreMembersIsEnd="moreMembersIsEnd"
              :moreMembersIsLoading="moreMembersIsLoading"
              @getMoreMembers="getMoreMembers"
            />
            <span v-else class="photo-contest-card__info-block-empty"
              >Нет участников</span
            >
          </div>
          <div class="photo-contest-card__info-block">
            <span class="photo-contest-card__info-block-title">
              Фотографий:
            </span>
            <CounterElem
              class="photo-contest-card__counter"
              iconName="image"
              :count="dataContest.TOTAL_IMAGE_COUNT"
            />
          </div>
        </div>
        <button class="photo-contest-card__button primary-btn" @click="onClick">
          {{ dataContest.ACTIVE ? "Принять участие" : "Посмотреть результаты" }}
        </button>
      </div>
    </router-link>

    <ModalAddPhoto
      v-if="isVisiblePopup"
      @close="closePopup"
      :photoContestId="dataContest.ID"
    />
  </div>
</template>

<script>
import ParticipantsListV2 from "@/components/UI/ParticipantsListV2.vue";
import PhotoContestStatus from "@/components/UI/labels/PhotoContestStatus.vue";
import CounterElem from "@/components/UI/CounterElem.vue";
import ModalAddPhoto from "@/components/modals/ModalAddPhoto.vue";
import axios from "axios";

export default {
  name: "ContestCard",

  components: {
    PhotoContestStatus,
    ParticipantsListV2,
    CounterElem,
    ModalAddPhoto,
  },

  props: {
    dataContest: Object,
  },

  data() {
    return {
      isVisiblePopup: false,

      moreMembers: [],
      moreMembersIsEnd: false,
      moreMembersIsLoading: false,
    };
  },

  methods: {
    onClick(e) {
      if (this.dataContest.ACTIVE) {
        e.preventDefault();
        this.isVisiblePopup = true;
      }
    },
    closePopup() {
      this.isVisiblePopup = false;
    },

    async getMoreMembers() {
      if (!this.moreMembersIsEnd) {
        try {
          this.moreMembersIsLoading = true;
          this.moreMembersIsEnd = true;
          const response = await axios({
            method: "get",
            url: `mobileapp/api/photoContest/members?photoContestId=${
              this.dataContest.ID
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
  },
};
</script>

<style scoped lang="scss">
.photo-contest-card {
  display: flex;
  column-gap: var(--v-rhythm-10);

  position: relative;

  background: var(--white900);

  transition: all 0.3s ease 0s;

  @include hover {
    background: var(--gray100);
  }

  &__link {
    display: flex;
    gap: var(--v-rhythm-10);

    width: 100%;

    padding-top: var(--v-rhythm-6);
    padding-right: var(--v-rhythm-8);
    padding-left: var(--v-rhythm-8);
    padding-bottom: var(--v-rhythm-8);

    @include phones {
      flex-direction: column;
      gap: unset;

      padding: unset;
    }
  }

  &__photo-wrapper {
    position: relative;

    width: calc(531 * 100% / 1312);
    flex-shrink: 0;
    height: 100%;
    min-height: 340px;

    @include phones {
      width: 100%;
      min-height: unset;
      height: 224px;
    }
  }

  &__label {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  &__photo {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__wrapper-content {
    width: 100%;

    display: flex;
    flex-direction: column;

    @include phones {
      padding: var(--v-rhythm-6) var(--v-rhythm-3);
    }
  }

  &__date {
    @extend .h4;
    font-size: 10px;
    line-height: 12px;

    color: var(--gray900);

    margin-bottom: var(--v-rhythm-6);
    &_until {
      color: var(--red900);
    }
  }

  &__title {
    @extend .h4;

    word-break: break-all;

    margin-bottom: var(--v-rhythm-4);
  }

  &__description {
    width: 100%;

    @extend .body-1;
    @extend .v-html;

    display: -webkit-box;

    height: 100px;

    margin-bottom: var(--v-rhythm-8);

    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    word-break: break-word;

    @include desktop {
      height: 80px;
    }
    @include laptop {
      height: 70px;
    }
    @include phones {
      height: fit-content;

      margin-bottom: var(--v-rhythm-5);
    }
  }

  &__info-wrapper {
    display: flex;
    column-gap: var(--v-rhythm-16);
    margin-bottom: var(--v-rhythm-6);
  }

  &__info-block {
    display: flex;
    flex-direction: column;
    row-gap: var(--v-rhythm-4);

    height: 100%;

    @include phones {
      row-gap: var(--v-rhythm-2);
    }
  }

  &__info-block-title {
    @extend .h4;

    font-size: 14px;
    line-height: 20px;
  }

  &__info-block-empty {
    @extend .body-2;
  }

  &__counter {
    margin-top: var(--v-rhythm-1);
  }

  &__button {
    width: fit-content;

    margin-top: auto;
  }
}
</style>