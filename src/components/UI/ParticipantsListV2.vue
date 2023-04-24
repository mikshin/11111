<template>
  <ul class="participants-list">
    <li v-for="item of members" :key="item.ID" class="participants-list__item">
      <router-link
        :to="'/lk?=' + item.ID"
        :title="item.FULL_NAME"
        class="participants-list__item-link"
      >
        <SimplePicture
          class="participants-list__item-pic"
          :src="item.USER_PHOTO"
          :alt="item.FULL_NAME"
        />
      </router-link>
    </li>

    <li class="participants-list__item" v-if="totalCount > 0">
      <tippy
        trigger="click"
        interactive
        animation="fade"
        :animate-fill="false"
        boundary="viewport"
      >
        <template v-slot:trigger>
          <button
            class="participants-list__item-button"
            type="button"
            @click.prevent
          >
            +{{ totalCount }}
          </button>
        </template>

        <PeopleTooltip
          class="participants-list__item-people-tooltip"
          :people="moreMembers"
          :isEnd="moreMembersIsEnd"
          :isLoading="moreMembersIsLoading"
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
  name: "ParticipantsListV2",

  components: {
    SimplePicture,
    PeopleTooltip,
  },

  props: {
    members: {
      type: Array,
      required: true,
    },

    totalCount: {
      type: Number,
      required: true,
    },

    moreMembers: {
      type: Array,
      required: true,
    },

    moreMembersIsEnd: {
      type: Boolean,
      required: true,
    },

    moreMembersIsLoading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      count: 5,
    };
  },

  methods: {
    getMoreMembers() {
      this.$emit("getMoreMembers");
    },
  },

  computed: {},

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