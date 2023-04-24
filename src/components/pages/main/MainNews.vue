<template>
  <!-- !TODO переделать структуру под БЭМ -->
  <div class="widget-newsblog widget_container">
    <div class="widget-newsblog__title main-title">{{ name }}</div>
    <template v-if="data">
      <ul class="widget-newsblog__main news_list">
        <!-- !TODO вынести новость в отдельный компонент -->
        <template v-for="(item, i) in data">
          <li
            class="widget-newsblog__news widget-news news"
            :key="i"
            v-if="item && !item.PROPERTY_IMPORTANT"
          >
            <router-link :to="'news/' + item.CODE" tag="div" class="news_image">
              <img
                :src="image.fileLink"
                alt=""
                v-for="(image, j) in item.PREVIEW_PICTURE"
                :key="j"
              />
            </router-link>
            <div class="news_content">
              <router-link
                :to="'news/' + item.CODE"
                tag="span"
                class="news_theme"
              >
                {{ item.PROPERTY_THEME }}</router-link
              >
              <router-link :to="'news/' + item.CODE" tag="h3" class="news_name"
                >{{ item.NAME }}
              </router-link>
              <router-link
                :to="'news/' + item.CODE"
                tag="p"
                class="news_text"
                v-html="item.PREVIEW_TEXT"
              ></router-link>
              <div class="activity_content">
                <div class="news_data">
                  <span>{{ item.PUBLICATION_DATE.day }}</span>
                  <span>{{ item.PUBLICATION_DATE.month }}</span>
                </div>

                <app-counters
                  class="widget-news__counters"
                  :urlId="item.ID"
                  :counterViews="{
                    counter: item.viewCount,
                  }"
                  :counterLikes="{
                    counter: item.likeCount,
                    isActive: item.liked,
                  }"
                  :counterComments="{
                    counter: item.commentCount,
                    url: '/news/' + item.CODE,
                  }"
                ></app-counters>
              </div>
            </div>
          </li>
        </template>
      </ul>

      <div class="important_list">
        <template v-for="(item, i) in data">
          <li
            class="widget-newsblog__news widget-news news"
            :key="i"
            v-if="item && item.PROPERTY_IMPORTANT"
          >
            <router-link :to="'news/' + item.CODE" tag="div" class="news_image"
              ><span>ВАЖНОЕ</span>
              <img
                :src="image.fileLink"
                alt=""
                v-for="(image, j) in item.PREVIEW_PICTURE"
                :key="j"
              />
            </router-link>
            <div class="news_content">
              <router-link
                :to="'news/' + item.CODE"
                tag="span"
                class="news_theme"
              >
                {{ item.PROPERTY_THEME }}</router-link
              >
              <router-link :to="'news/' + item.CODE" tag="h3" class="news_name"
                >{{ item.NAME }}
              </router-link>
              <router-link
                :to="'news/' + item.CODE"
                tag="p"
                class="news_text"
                v-html="item.PREVIEW_TEXT"
              ></router-link>
              <div class="activity_content">
                <div class="news_data">
                  <span>{{ item.PUBLICATION_DATE.day }}</span>
                  <span>{{ item.PUBLICATION_DATE.month }}</span>
                </div>

                <app-counters
                  class="widget-news__counters"
                  :urlId="item.ID"
                  :counterViews="{
                    counter: item.viewCount,
                  }"
                  :counterLikes="{
                    counter: item.likeCount,
                    isActive: item.liked,
                  }"
                  :counterComments="{
                    counter: item.commentCount,
                    url: '/news/' + item.CODE,
                  }"
                ></app-counters>
              </div>
            </div>
          </li>
        </template>
      </div>
    </template>

    <div class="widget-newsblog__text-default page-text-default" v-else>
      Новостей не найдено
    </div>

    <div class="actions">
      <router-link to="/news">Все новости</router-link>

      <SuggestNews />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AppCounters from "@/components/UI/counter/AppCounters.vue";
import SuggestNews from "@/components/pages/news/SuggestNews.vue";

export default {
  name: "MainNews",

  components: {
    AppCounters,
    SuggestNews,
  },

  props: {
    name: null,
  },

  data() {
    return {
      data: undefined,
      isLoaded: false,
    };
  },

  mounted() {
    axios.get("/mobileapp/api/news/widget/").then((response) => {
      this.data = response.data;
      this.isLoaded = true;
    });
  },
};
</script>

<style lang="scss" scoped>
$newsWidth: 284px;

.widget-newsblog {
  &__title {
    width: 100%;
  }
  &__main {
  }
}

.widget-news {
  &__counters {
  }
}

.widget_container {
  display: flex;
  flex-wrap: wrap;
  padding-right: 0 !important;
}

.news_list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 16px;

  @include desktop {
    order: 3;
    margin-right: 0;
  }
}

.important_list {
  order: 2;

  @include desktop {
    width: 100%;
    margin-bottom: 8px;
  }

  .news {
    display: flex;
    flex-direction: column;
    width: 320px;
    height: 100%;

    @include desktop {
      flex-direction: row;
      width: 100%;
      height: unset;
    }

    @media screen and (max-width: 500px) {
      flex-direction: column;
    }

    .news_image {
      width: 100%;
      height: 214px;

      @include desktop {
        margin-bottom: 0;
        width: calc(320 * 100% / 688);
        height: 100%;
        min-height: 214px;
      }

      @include phones {
        width: 214px;
        height: 214px;
      }

      @media screen and (max-width: 500px) {
        width: 100%;
        min-height: 214px;
      }
    }

    .news_text {
      margin-bottom: 14px;
    }
  }
}

.news {
  display: flex;
  gap: var(--v-rhythm-5);
  width: calc(100% + 8px);
  cursor: pointer;
  transition: 0.3s background ease, 0.3s box-shadow ease, 0.3s border ease;
  border: 1px solid transparent;
  padding: 8px;
  margin-left: -8px;
  margin-right: 0;
  margin-bottom: 8px;
  box-sizing: border-box;

  &:hover {
    background-color: #fff;
    border: 1px solid var(--gray300);
    box-shadow: 4px 4px 20px rgba(9, 0, 109, 0.1);
  }

  &.important {
    flex-direction: column;
    order: 3;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @include laptop {
    width: 100%;
    margin-left: 0;
  }

  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
}

.news_image {
  width: calc(320 * 100% / 688);
  height: 100%;
  min-height: 214px;
  overflow: hidden;
  position: relative;
  background-color: var(--gray300);

  span {
    position: absolute;
    z-index: 1;
    display: block;
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    background-color: #fff;
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    color: var(--red900);
    border-radius: 50px;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @include phones {
    width: 214px;
    height: 214px;
  }

  @media screen and (max-width: 500px) {
    width: 100%;
  }
}

.news_content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.news_theme {
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  color: var(--red900);
  margin-bottom: 12px;
}

.news_name {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--gray900);
  margin: 0;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.news_text {
  flex: 1;
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 54px;

  ::v-deep {
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: var(--gray700);

    a {
      color: var(--red900);
      text-decoration: none;
    }
  }
}

.activity_content {
  display: flex;
  align-items: center;
}

.news_data {
  flex: 1;

  span {
    font-weight: 700;
    font-size: 10px;
    line-height: 12px;
    color: var(--gray500);
    text-transform: uppercase;
    padding-right: 4px;
  }
}

.actions {
  width: 100%;
  order: 5;
  height: 40px;
  margin-top: 32px;
  display: flex;
  align-items: center;
  a {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: var(--red900);
    text-decoration: none;
    padding-left: 8px;
  }
}
</style>
