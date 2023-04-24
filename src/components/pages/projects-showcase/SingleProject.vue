<template>
  <!-- <div class="project-wrapper"> -->
  <router-link
    :to="'/projects/' + projectObj.ID"
    tag="div"
    class="project-wrapper"
    :class="{ 'lk-widget': type === 'lkWidget' }"
  >
    <div class="project">
      <div class="project__top-layout">
        <div
          v-if="projectObj.PREVIEW_PICTURE"
          class="project__image"
          :style="`background-image:url(${projectObj.PREVIEW_PICTURE[0].fileLink})`"
        ></div>
        <div class="project__top-layout-right">
          <h4 class="project__title" v-html="projectObj.NAME"></h4>
          <div class="project__date">
            <div class="project__date-item">
              <strong>Начало: </strong><span>{{ projectObj.ACTIVE_FROM }}</span>
            </div>
            <div class="project__date-item">
              <strong>Окончание: </strong
              ><span>{{ projectObj.ACTIVE_TO }}</span>
            </div>
          </div>
          <div class="project__info">
            <div class="project__stage">
              <span v-if="projectObj.STAGE">{{ projectObj.STAGE }}</span>
            </div>
            <div class="project__status">
              <UserIcons :iconName="'lock'" v-if="projectObj.CLOSED" />
              <UserIcons
                :iconName="'archive'"
                v-if="projectObj.ARCHIVE_PROJECT"
              />
              <UserIcons
                :iconName="'progress'"
                fill="#009890"
                v-if="projectObj.ACTIVE_PROJECT"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="project__manager">
        <div class="project__manager-name">
          <strong>Руководитель проекта: </strong
          ><span v-if="projectObj.UF_HEAD"
            ><router-link :to="`/lk?=${projectObj.UF_HEAD.ID}`">{{
              projectObj.UF_HEAD.FULL_NAME
            }}</router-link></span
          >
        </div>
        <div
          class="project__manager-company"
          v-if="type != 'lkWidget'"
          v-html="projectObj.COMPANY"
        ></div>

        <div class="project__manager-devision" v-if="type != 'lkWidget'">
          {{ projectObj.DEPARTMENT }}
        </div>
      </div>
    </div>
  </router-link>
  <!-- </div> -->
</template>

<script>
export default {
  name: "SingleProjectShowcase",

  props: {
    projectObj: {
      type: Object,
      required: true,
    },
    type: String,
  },
};
</script>

<style lang="scss" scoped>
.project-wrapper {
  flex-basis: 50%;
  padding: 16px;
  margin: 0;
  cursor: pointer;

  @include phones {
    flex-basis: 100%;
    flex-grow: 1;
    padding: 0;
  }
}

.project {
  background-color: var(--white900);
  height: 100%;

  display: flex;
  flex-direction: column;

  &__top-layout {
    display: flex;
    flex-basis: 100%;
  }

  &__top-layout-right {
    padding: var(--v-rhythm-4);
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__image {
    width: calc(200 * 100% / 496);
    min-width: 150px;
    min-height: 200px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  &__title {
    @extend .h4;
    margin-bottom: var(--v-rhythm-2);
  }

  &__date {
    margin-bottom: var(--v-rhythm-2);

    strong {
      @extend .subtitle-1;
    }

    span {
      @extend .body-1;
    }
  }

  &__info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: auto;
  }

  &__stage {
    color: var(--gray700);
  }

  &__status {
    display: flex;
    gap: 8px;
    fill: var(--gray500);
  }

  &__manager {
    padding: var(--v-rhythm-4);

    a {
      color: var(--red900);
    }
  }
}

// Другие стили для виджетов в лк
.lk-widget {
  .project__top-layout {
    flex-direction: column;
    flex-grow: 2;

    @include desktop {
      flex-direction: row;
    }

    @include phones {
      flex-direction: column;
    }
  }
  .project__image {
    width: 100%;
    height: 200px;
    flex-shrink: 0;

    @include desktop {
      width: 200px;
    }

    @include phones {
      width: 100%;
    }
  }

  .project__manager {
    margin-top: auto;
    margin: var(--v-rhythm-4);
    border-top: 1px solid var(--gray200);
    padding: 0;
    padding-top: var(--v-rhythm-2);
  }
}
</style>