<template>
  <tippy
    class="events-timeline-event"
    animation="fade"
    arrow
    boundary="viewport"
    theme="light"
    :touch="false"
    :flipOnUpdate="true"
    :followCursor="'horizontal'"
  >
    <template v-slot:trigger>
      <div class="events-timeline-event__btn" @click="clickEvent">
        <span class="events-timeline-event__btn-title">{{ title }}</span>
        <div class="events-timeline-event__btn-info">
          <span class="events-timeline-event__btn-info-block"
            ><span class="events-timeline-event__btn-info-block-title"
              >Начало</span
            >{{ start }}</span
          >
          <span class="events-timeline-event__btn-info-block"
            ><span class="events-timeline-event__btn-info-block-title"
              >Конец</span
            >{{ end }}</span
          >
        </div>
      </div>
    </template>

    <div class="events-timeline-event__content">
      <span class="events-timeline-event__content-title">{{ title }}</span>
      <div class="events-timeline-event__content-info">
        <div class="events-timeline-event__content-info-time">
          <span class="events-timeline-event__content-info-block"
            ><span class="events-timeline-event__content-info-block-title"
              >Начало:</span
            >{{ start }}</span
          >
          <span class="events-timeline-event__content-info-block"
            ><span class="events-timeline-event__content-info-block-title"
              >Конец:</span
            >{{ end }}</span
          >
        </div>
        <div class="events-timeline-event__content-info-place">
          <span class="events-timeline-event__content-info-block" v-if="office"
            ><span class="events-timeline-event__content-info-block-title"
              >Офис:</span
            >{{ office }}</span
          >
          <span class="events-timeline-event__content-info-block" v-if="room"
            ><span class="events-timeline-event__content-info-block-title"
              >Переговорная:</span
            >{{ room }}</span
          >
          <span
            class="events-timeline-event__content-info-block"
            v-if="otherPlace"
            ><span class="events-timeline-event__content-info-block-title"
              >Место события:</span
            >{{ otherPlace }}</span
          >
        </div>
      </div>
    </div>
  </tippy>
</template>

<script>
export default {
  name: "EventsTimelineEvent",

  components: {},

  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    office: {
      type: String,
      required: false,
    },
    otherPlace: {
      type: String,
      required: false,
    },
    room: {
      type: String,
      required: false,
    },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickEvent() {
      this.$emit("clickEvent", { id: this.id, name: this.title });
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.events-timeline-event {
  &__btn {
    padding: 2px;

    background-color: var(--gray100);
    border-top: 2px solid var(--red500);

    cursor: pointer;
    @include transition(opacity);

    @include hover {
      .events-timeline-event__btn-title {
        color: var(--red900);
      }
    }

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__btn-title {
    display: block;

    width: 100%;
    margin-bottom: var(--v-rhythm-1);

    @extend .caption-1;
    color: var(--gray900);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    @include transition(color);
  }

  &__btn-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--v-rhythm-2);
  }

  &__btn-info-block {
    display: flex;
    gap: 0 var(--v-rhythm-1);
    flex-wrap: wrap;

    @extend .caption-1;
  }

  &__btn-info-block-title {
    color: var(--gray500);
  }

  &__content {
    padding: var(--v-rhythm-2);
  }

  &__content-title {
    display: block;

    margin-bottom: var(--v-rhythm-1);

    color: var(--gray900);
  }

  &__content-info {
    display: flex;
    flex-direction: column;
  }

  &__content-info-time,
  &__content-info-place {
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--v-rhythm-2);
  }

  &__content-info-block {
    display: flex;
    gap: 0 var(--v-rhythm-1);
    flex-wrap: wrap;

    @extend .caption-1;
  }

  &__content-info-block-title {
    color: var(--gray500);
  }
}
</style>