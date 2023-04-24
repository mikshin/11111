<template>
  <div class="profile-name" :class="{ 'profile-name--small': isSmall }">
    <div class="profile-name__status-label" v-if="label">{{ label }}</div>
    <div class="profile-name__info">
      <template v-if="name">
        <router-link
          class="profile-name__name"
          v-if="this.$route.path != '/lk'"
          v-html="name"
          :to="`/lk?=${id}`"
        ></router-link>
        <span class="profile-name__name" v-else v-html="name"></span>
      </template>
      <ul
        class="profile-name__description"
        v-if="company || division || profession"
      >
        <li
          class="profile-name__description-item"
          v-if="company"
          v-html="company"
        ></li>
        <li
          class="profile-name__description-item"
          v-if="division"
          v-html="division"
        ></li>
        <li
          class="profile-name__description-item"
          v-if="profession"
          v-html="profession"
        ></li>
      </ul>
    </div>
    <!-- Пока функционал не реализовываем. -->
    <div class="profile-name__birthday" v-if="birthday">
      <UserIcons class="profile-name__birthday-icon" :iconName="'cake'" />
      {{ birthday }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileName",

  props: {
    isSmall: {
      type: Boolean,
      required: false,
      default: false,
    },
    id: {
      type: String,
      required: false,
      default: "",
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
    company: {
      type: String,
      required: false,
      default: "",
    },
    division: {
      type: String,
      required: false,
      default: "",
    },
    profession: {
      type: String,
      required: false,
      default: "",
    },
    birthday: {
      type: String,
      required: false,
      default: "",
    },
  },

  computed: {},
};
</script>

<style scoped lang="scss">
.profile-name {
  &__status-label {
    padding: 6px var(--v-rhythm-3);
    margin-bottom: var(--v-rhythm-5);
    width: max-content;

    @extend .overline;
    color: var(--white900);

    background-color: var(--gray700);
    border-radius: 40px;
  }

  &__info {
  }

  &__name {
    display: block;

    @extend .h3;
    color: var(--gray900);
  }

  &__description {
    margin-top: var(--v-rhythm-2);

    display: flex;
    flex-direction: column;
    gap: calc(var(--v-rhythm-1) / 2);
  }

  &__description-item {
    @extend .body-2;
    color: var(--gray900);
  }

  &__birthday {
    display: flex;
    align-items: flex-end;
    gap: var(--v-rhythm-2);
    margin-top: var(--v-rhythm-3);

    @extend .body-1;
    color: var(--gray900);
  }

  &__birthday-icon {
    width: 20px;
    height: 20px;

    fill: var(--red900);
  }

  &--small {
    .profile-name {
      &__status-label {
        padding: 4px var(--v-rhythm-2);
        margin-bottom: var(--v-rhythm-4);
      }

      &__info {
      }

      &__name {
        @extend .h4;
      }

      &__description {
        margin-top: var(--v-rhythm-1);

        gap: 0;
      }

      &__description-item {
        @extend .body-1;
      }

      &__birthday {
        margin-top: var(--v-rhythm-1);

        @extend .caption-1;
      }
    }
  }

  @include phones {
    &__status-label {
      padding: var(--v-rhythm-1) var(--v-rhythm-2);
      margin-bottom: var(--v-rhythm-4);
    }

    &__info {
    }

    &__name {
    }

    &__description {
      margin-top: var(--v-rhythm-1);

      gap: 0;
    }

    &__description-item {
    }

    &__birthday {
      margin-top: var(--v-rhythm-2);
    }

    &--small {
      .profile-name {
        &__status-label {
          margin-bottom: var(--v-rhythm-3);
        }

        &__info {
        }

        &__name {
          @include font(14px, 20px, 700);
        }

        &__description {
        }

        &__description-item {
        }

        &__birthday {
          margin-top: var(--v-rhythm-1);
        }

        &__birthday-icon {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
