<template>
  <ul class="participants-list">
    <li
      v-for="(item, i) of participantList"
      :key="i"
      class="participants-list__item"
    >
      <router-link
        :to="'/lk?=' + item.ID"
        :title="item.FULL_NAME"
        class="participants-list__item-link"
      >
        <SimplePicture
          class="participants-list__item-pic"
          :src="item.USER_PHOTO"
          :alt="item.name"
        />
      </router-link>
    </li>
    <li class="participants-list__item" v-if="morePeople > 0">
      <tippy trigger="click" interactive animation="fade" :animate-fill="false">
        <template v-slot:trigger>
          <button
            class="participants-list__item-button"
            type="button"
            @click.prevent
          >
            +{{ morePeople }}
          </button>
        </template>

        <PeopleTooltip
          class="participants-list__item-people-tooltip"
          :people="moreMembers"
          :isEnd="moreMembers.length !== 0"
          :isLoading="moreMembers.length === 0"
          @getPeople="getMoreMembers"
        />
      </tippy>
    </li>
  </ul>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";

export default {
  name: "ParticipantsList",

  components: {
    SimplePicture,
    PeopleTooltip,
  },

  props: {
    participants: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      hiddenList: [],
      count: 5,
      moreMembers: [],
    };
  },

  methods: {
    getMoreMembers() {
      this.moreMembers = this.participants.slice(this.count).map((item) => {
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

  computed: {
    morePeople() {
      return this.participants.length - this.count;
    },

    participantList() {
      return this.participants.length > this.count
        ? this.participants.slice(0, this.count)
        : this.participants;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.participants-list {
  --shift: 14px;
  --itemSize: 40px;
  position: relative;

  display: flex;
  flex-wrap: wrap;
  min-height: var(--itemSize);
  padding-left: var(--shift);

  &__item {
    --itemBorderSize: 2px;

    margin-left: calc(-1 * var(--shift));
    height: var(--itemSize);
    width: var(--itemSize);
    display: flex;
    align-items: center;
    justify-content: center;

    border: var(--itemBorderSize) solid var(--white900);
    border-radius: 50%;
    background-color: var(--red300);

    overflow: hidden;

    &-pic {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    &-button {
      @extend .button;

      width: calc(var(--itemSize) - 2px * 2);
      height: calc(var(--itemSize) - (var(--itemBorderSize) * 2));

      color: var(--red900);
    }
    &-link {
      width: 100%;
      height: 100%;
    }
  }
}
</style>