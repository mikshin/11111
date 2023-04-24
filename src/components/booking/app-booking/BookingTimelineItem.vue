<template>
  <tippy
    class="booking-timeline-line-item"
    animation="fade"
    arrow
    theme="light"
    :touch="true"
    :flipOnUpdate="true"
    :followCursor="'horizontal'"
    interactive
  >
    <template v-slot:trigger>
      <div
        class="booking-timeline-line-item__wrapper"
        :class="{ 'booking-timeline-line-item__wrapper--mine': info.creator }"
      >
        <div
          class="booking-timeline-line-item__btns"
          v-if="info.creator && info.rights"
        >
          <template v-for="(item, i) in info.rights">
            <button
              class="booking-timeline-line-item__btn"
              v-if="item === 'edit'"
              :key="i"
              type="button"
              @click="onEdit"
            >
              <UserIcons
                class="booking-timeline-line-item__btn-icon"
                :iconName="'pen'"
              />
            </button>
            <button
              class="booking-timeline-line-item__btn"
              v-if="item === 'delete'"
              :key="i"
              type="button"
              @click="onDelete"
            >
              <UserIcons
                class="booking-timeline-line-item__btn-icon"
                :iconName="'trash'"
              />
            </button>
          </template>
        </div>
      </div>
    </template>

    <div class="booking-timeline-line-item__tooltip">
      <router-link
        class="booking-timeline-line-item__tooltip-organizator"
        :to="`/lk?=${info.organizatorID}`"
        >{{ info.organizatorName }}</router-link
      >
      <span class="booking-timeline-line-item__tooltip-time">
        {{ `${info.timeStart} - ${info.timeEnd}` }}
      </span>
    </div>
  </tippy>
</template>

<script>
export default {
  name: "BookingTimelineItem",

  components: {},

  props: {
    info: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    onDelete() {
      this.$emit("onDelete", this.info.id);
    },

    onEdit() {
      this.$emit("onEdit", this.info.id);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.booking-timeline-line-item {
  &:hover {
    z-index: 1;
  }

  &__wrapper {
    padding: var(--v-rhythm-2) var(--v-rhythm-1);
    height: 40px;

    display: flex;

    border-radius: 6px;
    background-color: var(--red500);

    @include transition(background-color);

    &--mine {
      background-color: var(--chatPrimary);
    }

    &:hover {
      z-index: 1;

      &:not(.booking-timeline-line-item__wrapper--mine) {
        background-color: var(--red700);
      }
    }

    @include hover {
      .booking-timeline-line-item__btns {
        opacity: 1;
      }
    }
  }

  &__btns {
    margin-left: auto;

    display: flex;
    gap: var(--v-rhythm-1);

    opacity: 0;

    @include no-hover {
      opacity: 1;
    }
  }

  &__btn {
    @include transition(opacity);

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__btn-icon {
    width: 24px;
    height: 24px;

    fill: var(--white900);
  }

  &__tooltip {
    padding: var(--v-rhythm-2) var(--v-rhythm-3);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);

    @extend .caption-1;
    color: var(--gray700);
  }

  &__tooltip-organizator {
    cursor: pointer;
    @include transition();

    @include hover {
      color: var(--red900);
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__tooltip-time {
  }
}
</style>