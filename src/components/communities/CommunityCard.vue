<template>
  <router-link class="community-card" :to="`/communities/${communityData.ID}`">
    <div class="community-card__picture">
      <SimplePicture
        class="community-card__picture-img"
        v-if="communityData.PREVIEW_PICTURE"
        :alt="communityData.NAME"
        :src="communityData.PREVIEW_PICTURE"
      />

      <SimpleLabel
        class="community-card__picture-label"
        v-if="communityData.STATUS"
        :labelText="communityData.STATUS"
      />
    </div>

    <div class="community-card__info">
      <div class="community-card__info-top">
        <div
          class="community-card__title"
          :class="{ 'community-card__title--archive': communityData.ARCHIVE }"
          v-html="communityData.NAME"
        ></div>
        <div class="community-card__info-top-icons">
          <UserIcons
            class="community-card__info-top-icon"
            v-if="communityData.ARCHIVE"
            :iconName="'archive'"
          />
          <UserIcons
            class="community-card__info-top-icon"
            v-if="communityData.CLOSED"
            :iconName="'lock'"
          />
        </div>
      </div>

      <div class="community-card__owner" v-if="communityData.CREATED_BY">
        <span class="community-card__owner-title">Владелец:</span>
        <router-link
          class="community-card__owner-fio"
          @click.stop
          :to="`/lk?=${communityData.CREATED_BY.ID}`"
          v-html="communityData.CREATED_BY.FULL_NAME"
        ></router-link>
      </div>

      <div class="community-card__members">
        <span class="community-card__members-title">Участники:</span>
        <ParticipantsListV2
          class="community-card__members-list"
          v-if="
            communityData.PARTICIPIENT &&
            communityData.PARTICIPIENT.member.length > 0
          "
          :members="communityData.PARTICIPIENT.member"
          :totalCount="communityData.PARTICIPIENT.totalCount"
          :moreMembers="moreMembers"
          :moreMembersIsEnd="moreMembersIsEnd"
          :moreMembersIsLoading="moreMembersIsLoading"
          @getMoreMembers="getMoreMembers"
        />
        <span v-else class="community-card__members-text-default"
          >Нет участников</span
        >
      </div>
    </div>
  </router-link>
</template>

<script>
import axios from "axios";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import SimpleLabel from "@/components/UI/labels/SimpleLabel.vue";
import ParticipantsListV2 from "@/components/UI/ParticipantsListV2.vue";

export default {
  name: "CommunityCard",

  components: {
    SimplePicture,
    SimpleLabel,
    ParticipantsListV2,
  },

  props: {
    communityData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      moreMembers: [],
      moreMembersIsEnd: false,
      moreMembersIsLoading: false,
    };
  },

  computed: {},

  methods: {
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

    goToCard(id) {
      this.$router.push(`/communities/${id}`);
    },

    async getMoreMembers() {
      if (!this.moreMembersIsEnd) {
        try {
          this.moreMembersIsLoading = true;
          this.moreMembersIsEnd = true;
          const response = await axios({
            method: "get",
            url: `/mobileapp/api/group/members?groupId=${
              this.communityData.ID
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
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.community-card {
  display: flex;
  background-color: var(--white900);

  @include transition(opacity);
  cursor: pointer;

  &:active {
    opacity: var(--active-opacity);
  }

  &__picture {
    position: relative;

    width: calc(200 * 100% / 496);
    min-width: 120px;
    height: auto;

    background-color: var(--gray500);
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

  &__picture-label {
    position: absolute;
    top: var(--v-rhythm-3);
    left: var(--v-rhythm-3);
  }

  &__info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-7);
    justify-content: space-between;

    padding: var(--v-rhythm-4) var(--v-rhythm-4) var(--v-rhythm-6);
  }

  &__info-top {
    display: flex;
    gap: var(--v-rhythm-2);
    justify-content: space-between;
    align-items: flex-start;
  }

  &__title {
    @extend .h4;
    color: var(--gray900);
    word-break: break-word;

    &--archive {
      color: var(--gray500);
    }
  }

  &__info-top-icons {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--v-rhythm-1);
  }

  &__info-top-icon {
    width: 24px;
    height: 24px;

    fill: var(--gray300);
  }

  &__owner {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-1);
  }

  &__owner-title {
    @extend .subtitle-1;
    color: var(--gray900);
  }

  &__owner-fio {
    @extend .body-1;
    color: var(--red900);
    word-break: break-word;

    @include transition(opacity);

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__members {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__members-title {
    @extend .subtitle-1;
    color: var(--gray900);
  }

  &__members-list {
  }

  &__members-text-default {
    @extend .body-2;
  }
}
</style>
