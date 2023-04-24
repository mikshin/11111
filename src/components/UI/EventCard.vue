<template>
  <div class="event-card" @click="eventClick">
    <DateTime
      class="event-card__date-time"
      v-if="dateTime"
      :day="dateTime.day"
      :month="dateTime.month"
      :year="dateTime.year"
      :timeList="dateTime.timeList"
    />

    <div class="event-card__info">
      <span class="event-card__title" v-html="title"></span>
      <ul
        class="event-card__info-room-list"
        v-if="officeNumber || meetingRoomNumber || otherPlace"
      >
        <li class="event-card__info-room-item" v-if="officeNumber">
          <span class="event-card__info-room-accent">Офис:</span>
          <span
            class="event-card__info-room-value"
            v-html="officeNumber"
          ></span>
        </li>
        <li class="event-card__info-room-item" v-if="meetingRoomNumber">
          <span class="event-card__info-room-accent">Переговорная:</span>
          <span
            class="event-card__info-room-value"
            v-html="meetingRoomNumber"
          ></span>
        </li>
        <li class="event-card__info-room-item" v-if="otherPlace">
          <span class="event-card__info-room-accent">Место события:</span>
          <tippy
            class="event-card__tooltip"
            animation="fade"
            arrow
            theme="light"
            :touch="false"
            :flipOnUpdate="true"
          >
            <template v-slot:trigger
              ><span
                class="event-card__info-room-value"
                v-html="trimmedOtherPlace"
              ></span
            ></template>

            <div class="event-card__tooltip-content">{{ otherPlace }}</div>
          </tippy>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import DateTime from "@/components/UI/DateTime.vue";
import { trimmedString } from "@/assets/scripts/scripts.js";

export default {
  name: "EventCard",

  components: {
    DateTime,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Object,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    officeNumber: {
      type: String,
      required: false,
    },
    meetingRoomNumber: {
      type: String,
      required: false,
    },
    otherPlace: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {
    trimmedOtherPlace() {
      return this.otherPlace ? trimmedString(this.otherPlace, 70) : null;
    },
  },

  methods: {
    eventClick() {
      this.$emit("eventClick", { id: this.id });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.event-card {
  height: 100%;
  padding: var(--v-rhythm-4);

  display: flex;
  gap: var(--v-rhythm-3);

  background-color: var(--white900);

  cursor: pointer;
  @include transition(opacity);

  @include hover {
    .event-card {
      &__title {
        color: var(--red900);
      }
    }
  }

  &:active {
    opacity: var(--active-opacity);
  }

  &__date-time {
    flex-shrink: 0;
  }

  &__info {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-1);
  }

  &__title {
    flex-basis: 100%;

    @extend .subtitle-1;
    color: var(--gray900);
    word-break: break-word;

    @include transition(color);
  }

  &__info-room-list {
    padding-top: var(--v-rhythm-2);

    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-1);

    border-top: 1px solid var(--gray200);
  }

  &__info-room-item {
    display: flex;
    align-items: flex-end;
    gap: 0 var(--v-rhythm-1);
    flex-wrap: wrap;

    color: var(--gray900);
    word-break: break-word;
  }

  &__info-room-accent {
    @extend .caption-2;
  }

  &__info-room-value {
    @include font(14px, 16px);
  }

  &__tooltip {
    line-height: 16px;
  }

  &__tooltip-content {
    padding: {
      top: var(--v-rhythm-3);
      right: var(--v-rhythm-2);
      bottom: var(--v-rhythm-3);
      left: var(--v-rhythm-4);
    }

    @extend .caption-1;
    color: var(--gray900);
  }

  @include phones {
    &__info-room-value {
      @include font(12px, 14px);
    }

    &__tooltip {
      line-height: 14px;
    }
  }
}
</style>