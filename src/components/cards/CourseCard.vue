<template>
  <div class="course-card">
    <router-link class="course-card__link" :to="link">
      <div class="course-card__image-wrapper">
        <SimplePicture
          alt="тест"
          :src="imageWithDefaultValue"
          class="course-card__image"
        ></SimplePicture>
        <div class="course-card__image-labels" v-if="labels">
          <AppLabel
            v-for="(label, index) in labels"
            :key="index"
            :collorClass="label.collorClass"
            >{{ label.text }}</AppLabel
          >
        </div>
      </div>
      <div class="course-card__description">
        <div
          class="course-card__headline"
          :class="{
            'course-card__headline--gray': isDraft,
          }"
          v-html="name"
        ></div>
        <div
          class="course-card__text v-html"
          :class="{
            'course-card__text--light': isDraft,
          }"
          v-if="text"
          v-html="text"
        ></div>
        <div class="course-card__info">
          <div
            class="course-card__info-row"
            v-for="(row, index) in infoRows"
            :key="index"
          >
            <div
              class="course-card__info-cell"
              :class="{
                'course-card__info-cell--secondary': isDraft,
              }"
              v-for="(cell, index) in row"
              :key="index"
            >
              {{ cell }}
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import AppLabel from "@UI/labels/AppLabel.vue";

import { generateLablesForCourse, getLinkForCourse } from "@utils";

export default {
  name: "",

  components: { SimplePicture, AppLabel },

  props: {
    dateExpired: {
      type: String,
      default: null,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: null,
    },
    isNewEmployee: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    totalLesson: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {};
  },

  computed: {
    infoRows() {
      const rows = [];

      if (this.totalLesson) {
        rows.push(["Уроков:", this.totalLesson]);
      }
      if (this.dateExpired) {
        rows.push(["Доступен до:", this.dateExpired]);
      }

      return rows.length ? rows : null;
    },
    labels() {
      return generateLablesForCourse(
        this.isDraft,
        this.isNewEmployee,
        this.status
      );
    },
    link() {
      return getLinkForCourse(this.id);
    },
    imageWithDefaultValue() {
      return this.image || "/img/training/plug-image-course-card.jpg";
    },
  },

  methods: {},

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.course-card {
  display: flex;

  &__link {
    display: flex;
    flex-grow: 1;
  }

  &__image-wrapper {
    position: relative;

    flex-shrink: 0;
    flex-basis: 180px;
    aspect-ratio: 180 / 280;

    overflow: hidden;
  }

  &__image {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &__image-labels {
    position: relative;
    z-index: 2;

    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-2);
    padding: {
      top: var(--v-rhythm-4);
      bottom: var(--v-rhythm-6);
      inline: 14px;
    }
  }

  &__description {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-4);
    flex-shrink: 10;
    flex-grow: 1;
    padding: {
      top: var(--v-rhythm-4);
      bottom: var(--v-rhythm-6);
      left: var(--v-rhythm-6);
      right: var(--v-rhythm-7);
    }

    background-color: var(--white900);
  }

  &__headline {
    @include line-clamp(2);

    @extend .h4;

    &--gray {
      color: var(--gray500);
    }
  }

  &__text {
    @include line-clamp(5);

    @extend .body-1;

    &--light {
      color: var(--gray700);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
    margin-top: auto;

    @extend .subtitle-2;
  }

  &__info-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v-rhythm-4);
  }

  &__info-cell {
    &:first-child {
      flex-shrink: 0;
    }
    &:last-child {
      color: var(--gray700);
    }

    &--secondary {
      &:last-child {
        color: var(--gray500);
      }
    }
  }

  @include phones {
    &__link {
      flex-direction: column;
    }

    &__description {
      padding: {
        left: var(--v-rhythm-3);
        right: var(--v-rhythm-3);
      }
    }
  }
}
</style>