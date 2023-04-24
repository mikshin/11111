<template>
  <!-- !TODO переделать структуру под БЭМ -->
  <section
    class="news"
    v-bind:class="{ important: data.PROPERTY_IMPORTANT }"
    v-if="data"
  >
    <router-link :to="'/news/' + data.CODE" tag="div" class="image_wrapper">
      <template v-for="item in data.PREVIEW_PICTURE">
        <img
          :key="item.fileId"
          :src="item.fileLink"
          :alt="data.PREVIEW_PICTURE"
        />
      </template>
    </router-link>
    <router-link :to="'/news/' + data.CODE" tag="div" class="data_wrapper">
      <span class="day" v-html="data.PUBLICATION_DATE.day"></span>
      <span class="month" v-html="data.PUBLICATION_DATE.month"></span>
      <span class="year" v-html="data.PUBLICATION_DATE.year"></span>
    </router-link>
    <div class="content_wrapper">
      <router-link
        :to="'/news/' + data.CODE"
        tag="span"
        v-html="data.PROPERTY_THEME"
      ></router-link>
      <router-link
        :to="'/news/' + data.CODE"
        tag="h3"
        v-html="data.NAME"
      ></router-link>
      <router-link
        :to="'/news/' + data.CODE"
        tag="p"
        v-html="data.PREVIEW_TEXT"
      ></router-link>

      <suggested-by-user :data="data" />

      <app-counters
        class="news__counters"
        :urlId="data.ID"
        :counterViews="{
          counter: data.viewCount,
        }"
        :counterLikes="{
          counter: data.likeCount,
          isActive: data.liked,
        }"
        :counterComments="{
          counter: data.commentCount,
          url: '/news/' + data.CODE,
        }"
      ></app-counters>
    </div>
  </section>
</template>

<script>
import AppCounters from "@/components/UI/counter/AppCounters.vue";
import suggestedByUser from "@/components/pages/news/suggestedByUser.vue";

export default {
  props: {
    data: null,
  },
  components: {
    AppCounters,
    suggestedByUser,
  },
};
</script>

<style lang="scss" scoped>
.news {
  &__counters {
  }
}
.news {
  display: flex;
  gap: var(--v-rhythm-6);
  cursor: pointer;
  background-color: var(--white900);
  padding: 24px 32px;
  position: relative;
  transition: 0.3s background ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 32px;
    height: 1px;
    width: calc(100% - 64px);
    background-color: #7e849329;
  }

  &:hover {
    background-color: var(--gray100);
  }

  &.important {
    margin-bottom: 12px;

    .image_wrapper:before {
      content: "ВАЖНОЕ";
    }
  }

  @include phones {
    flex-direction: column;
    gap: var(--v-rhythm-3);

    padding: 0;
  }
}

.user-info {
  margin-top: var(--v-rhythm-4);
  margin-bottom: var(--v-rhythm-4);
}

.image_wrapper {
  max-width: 437px;
  min-width: 200px;
  flex: 1;
  min-height: 292px;
  height: 100%;
  object-fit: cover;
  position: relative;

  background-color: var(--gray300);

  img {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::before {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px;
    padding-left: 24px;
    padding-right: 8px;
    border-radius: 20px;
    background-color: #fff;
    color: var(--red900);
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.05em;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M8 4.5V2H8.5C8.775 2 9 1.775 9 1.5C9 1.225 8.775 1 8.5 1H3.5C3.225 1 3 1.225 3 1.5C3 1.775 3.225 2 3.5 2H4V4.5C4 5.33 3.33 6 2.5 6V7H5.485V10.5L5.985 11L6.485 10.5V7H9.5V6C8.67 6 8 5.33 8 4.5Z' fill='%23AB052D'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: 8px 4px;
    z-index: 1;
  }

  @include laptop {
    width: 200px;
  }

  @include phones {
    width: 100%;
    max-width: unset;

    min-height: 214px;
  }
}

.data_wrapper {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .day {
    color: var(--red900);
    font-weight: 700;
    font-size: 50px;
    line-height: 60px;

    @include phones {
      font-size: 30px;
      line-height: 40px;
    }
  }

  .month,
  .year {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    color: var(--gray500);
  }

  @include phones {
    flex-direction: row;
    align-items: center;
    width: max-content;
    gap: var(--v-rhythm-2);
    padding: 0 var(--mainPadding);
  }
}

.content_wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;

  span {
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    color: var(--red900);
    text-transform: uppercase;
  }

  h3 {
    padding-top: calc(var(--mainPadding) + 8px);
    margin: 0;
  }

  p {
    flex: 1;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray900);
    padding-top: calc(var(--mainPadding) - 8px);
    margin: 0;
  }
  .button_container {
    padding-top: calc(var(--mainPadding) + 8px);
  }

  @include phones {
    padding: 0 var(--mainPadding) var(--v-rhythm-4);
  }
}
</style>
