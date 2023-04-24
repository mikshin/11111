<template>
  <div class="community-card-mini">
    <div class="community-card-mini__header">
      <span class="community-card-mini__title">{{ title }}</span>
      <UserIcons
        class="community-card-mini__icon"
        v-if="isLock"
        :iconName="'lock'"
      />
    </div>
    <div
      class="community-card-mini__description"
      v-if="description"
      v-html="translateText(description)"
    ></div>

    <ParticipantsListV2
      class="community-card-mini__members-list"
      v-if="participient.member && participient.member.length > 0"
      :members="participient.member"
      :totalCount="participient.totalCount"
      :moreMembers="moreMembers"
      :moreMembersIsEnd="moreMembersIsEnd"
      :moreMembersIsLoading="moreMembersIsLoading"
      @getMoreMembers="getMoreMembers"
    />

    <span v-else class="community-card-mini__members-text-default"
      >Нет участников</span
    >

    <button class="community-card-mini__btn text-btn" @click="goToCommunity">
      Перейти
    </button>
  </div>
</template>

<script>
import axios from "axios";
import ParticipantsListV2 from "@/components/UI/ParticipantsListV2.vue";

export default {
  name: "CommunityCardMini",

  components: {
    ParticipantsListV2,
  },

  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    isLock: {
      type: Boolean,
      required: false,
      default: false,
    },
    participient: {
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
    translateText(str) {
      let result = str.split("\r\n");

      return result.join("<br>");
    },
    goToCommunity() {
      this.$router.push(`/communities/${this.id}`);
    },

    async getMoreMembers() {
      if (!this.moreMembersIsEnd) {
        try {
          this.moreMembersIsLoading = true;
          this.moreMembersIsEnd = true;
          const response = await axios({
            method: "get",
            url: `/mobileapp/api/group/members?groupId=${this.id}&startFrom=${
              this.moreMembers.length + 5
            }&count=10`,
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

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.community-card-mini {
  padding: {
    top: var(--v-rhythm-2);
    right: 10px;
    bottom: var(--v-rhythm-4);
    left: var(--v-rhythm-4);
  }

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-2);

  background-color: var(--white900);
  border-radius: 8px;

  &__header {
    display: flex;
    gap: var(--v-rhythm-1);
    align-items: flex-start;
  }

  &__title {
    width: 100%;

    @extend .subtitle-1;
    color: var(--gray900);
  }

  &__icon {
    width: 25px;
    height: 24px;
    flex-shrink: 0;

    fill: var(--gray300);
  }

  &__description {
    @extend .caption-1;
    color: var(--gray500);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__members-list {
  }

  &__members-text-default {
    @extend .body-2;
  }

  &__btn {
    align-self: flex-start;

    padding: var(--v-rhythm-2);
  }
}
</style>