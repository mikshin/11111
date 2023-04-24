<template>
  <li class="person-tooltip-container">
    <router-link
      class="person-tooltip"
      :to="'/lk?=' + person.authorInfo.userId"
    >
      <img
        class="person-tooltip__img"
        :src="imgUrl"
        :alt="person.authorInfo.userName"
        width="40px"
        height="40px"
      />

      <UserIcons
        class="person-tooltip__label"
        v-if="person.authorInfo.VACATION"
        :iconName="'vacation-label'"
      />
      <UserIcons
        class="person-tooltip__label"
        v-else-if="person.authorInfo.FIRED"
        :iconName="'fired-label'"
      />

      <div class="person-tooltip__data">
        <span class="person-tooltip__name"
          >{{ person.authorInfo.userLastName }}
          {{ person.authorInfo.userName }}</span
        >
        <span
          class="person-tooltip__work-post"
          v-if="person.authorInfo.workPosition"
          >{{ person.authorInfo.workPosition }}</span
        >
      </div>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "PersonTooltip",

  components: {},

  data() {
    return {};
  },

  props: {
    person: {
      type: Object,
      required: true,
    },
  },

  computed: {
    imgUrl() {
      return this.person.authorInfo.userPhoto
        ? this.person.authorInfo.userPhoto
        : "/img/icons/avatar-plug.svg";
    },
  },
};
</script>

<style scoped lang="scss">
.person-tooltip {
  --size: 40px;

  position: relative;

  padding: var(--v-rhythm-2) 0;
  display: flex;
  align-items: center;

  &:hover .person-tooltip__name {
    color: var(--red900);
  }

  &__img {
    margin-right: var(--v-rhythm-2);
    flex-shrink: 0;
    width: var(--size);
    height: var(--size);

    border-radius: 50%;
    border: 1px solid var(--red300);
    object-fit: cover;
    object-position: center;
    overflow: hidden;

    background-image: url(~@/assets/images/icons/avatar-plug.svg);
    background-size: 100%;
    background-position: center;
  }

  &__label {
    position: absolute;
    top: 4px;
    left: -4px;

    width: 16px;
    height: 16px;
  }

  &__data {
    position: relative;

    height: var(--size);

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--v-rhythm-1);
    flex-grow: 1;

    &::after {
      content: "";

      position: absolute;
      left: 0;
      bottom: calc(-1 * var(--v-rhythm-2));
      transform: translateY(50%);

      width: 100%;
      height: 1px;

      background-color: var(--gray300);
    }
  }

  &__name,
  &__work-post {
    width: 228px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__name {
    @extend .subtitle-1;

    color: var(--gray900);
    transition: 0.3s;
  }

  &__work-post {
    @extend .caption-1;

    color: var(--gray500);
  }

  &:last-child & {
    &__data::after {
      display: none;
    }
  }

  @include phones {
    --size: 36px;

    &__name,
    &__work-post {
      width: 238px;
    }
  }
}
</style>
