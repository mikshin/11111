<template>
  <!-- !TODO доделать структуру по БЭМ -->
  <TwoColumnsLayout
    class="page-single-news"
    :breadcrumbsAnotherName="`Новость «${data.NAME}»`"
    :noTitle="true"
  >
    <template #left>
      <div class="news-template__header">
        <div class="news-template__header-inner">
          <div class="news-template__header-top">
            <div
              class="news-template__header-suptitle"
              v-if="data.PROPERTY_THEME"
            >
              {{ data.PROPERTY_THEME }}
            </div>
            <div class="news-template__header-title">{{ data.NAME }}</div>

            <!-- Предоставлено пользователем -->
            <suggested-by-user :data="data" />
          </div>
          <div class="data_container">
            <span class="day">{{ data.PUBLICATION_DATE.day }}</span>
            <div class="data_wrapper">
              <span class="month">{{ data.PUBLICATION_DATE.month }}</span>
              <span class="year">{{ data.PUBLICATION_DATE.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <div class="main_image">
        <div v-if="data.PROPERTY_IMPORTANT" class="important-label">
          <span>важное</span>
        </div>
        <template v-for="item in data.PREVIEW_PICTURE">
          <img
            :key="item.fileId"
            :src="item.fileLink"
            :alt="data.PREVIEW_PICTURE"
          />
        </template>
      </div>
      <div class="text" v-if="data.DETAIL_TEXT" v-html="data.DETAIL_TEXT"></div>

      <!-- фотогалерея -->
      <ul class="media_container" v-if="data.PROPERTY_MEDIALIBRARY">
        <template v-for="item in data.PROPERTY_MEDIALIBRARY">
          <li class="image" :key="j" v-for="(file, j) in item.libraryFiles">
            <img
              @click="photoClickHandler(file)"
              :src="file.fileLink"
              @load="loadImage()"
            />
          </li>
        </template>
      </ul>
      <transition name="fade">
        <PhotoCardModal
          :isVisible="photoModalIsOpen"
          :imageLink="currentImage"
          @onClose="closePopup"
        ></PhotoCardModal>
      </transition>

      <!-- видео -->
      <ul class="media_container" v-if="data.PROPERTY_VIDEOFILE">
        <template v-for="(item, i) in data.PROPERTY_VIDEOFILE">
          <li class="file" :key="i" v-if="item.fileType === 'video/avi'">
            <div class="file_icon avi"></div>
            <div class="file_data">
              <div class="file_name" :title="item.originalName">
                {{ item.originalName }}
              </div>
              <div class="file_size">{{ item.fileSize }}</div>
            </div>
            <div class="file_actions">
              <a :href="item.fileLink" download class="file_download"></a>
            </div>
          </li>
          <li class="video" :key="i" v-else>
            <video controls v-if="item.fileLink">
              <!-- #t=0.1 в src нужно что бы в сафари подгружался первый кадр на видео, как превью -->
              <source :src="`${item.fileLink}#t=0.1`" />
            </video>
          </li>
        </template>
      </ul>

      <!-- аудио -->
      <ul class="media_container" v-if="data.PROPERTY_AUDIOFILE">
        <li class="audio" v-for="(item, i) in data.PROPERTY_AUDIOFILE" :key="i">
          <audio controls v-if="item.fileLink">
            <source :src="item.fileLink" type="audio/mpeg" />
          </audio>
        </li>
      </ul>

      <!-- файлы -->
      <ul class="media_container" v-if="data.PROPERTY_FILE">
        <li class="file" v-for="(file, i) in data.PROPERTY_FILE" :key="i">
          <FileIcon :format="file.fileType" />
          <div class="file_data">
            <div class="file_name" :title="file.originalName">
              {{ file.originalName }}
            </div>
            <div class="file_size">{{ file.fileSize }}</div>
          </div>
          <div class="file_actions">
            <a
              :href="datFileUrl(file.fileLink)"
              target="_blank"
              class="file_watch"
              v-if="file.fileType === 'application/pdf'"
            ></a>
            <a
              :href="datFileUrl(file.fileLink)"
              download
              class="file_download"
            ></a>
          </div>
        </li>
      </ul>
      <!-- !TODO user-activity вынести в отдельный компонент -->
      <div class="news-template__activity user-activity">
        <div class="user-activity__header">
          <div class="user-activity__header-inner">
            <span class="user-activity__title"
              >{{ data.commentCount }}
              <!-- !TODO дописать варианты склонения -->
              <span v-if="data.commentCount === 1">комментарий</span>
              <span v-else-if="data.commentCount === 2">комментария</span>
              <span v-else>комментариев</span>
            </span>

            <AppCounters
              class="user-activity__counters"
              :urlId="data.ID"
              :isReverse="true"
              :counterViews="{
                counter: data.viewCount,
              }"
              :counterLikes="{
                counter: data.likeCount,
                isActive: data.liked,
              }"
            />
          </div>
        </div>

        <!-- !TODO переделать компонент Comments с использованием этой структуры -->
        <!-- <ul class="user-activity__comments-list">
              <li class="user-activity__comment"></li>
            </ul>
            <div class="user-activity__comment-field"></div> -->

        <!-- Потом надо исправить это -->
        <Comments
          :entryId="data.ID"
          @onComments="data.commentCount++"
          recordType="news"
          :isWhiteBg="true"
          :alignment="'start'"
          :requestGetComments="requestGetComments"
        />
        <span ref="comments"></span>
      </div>
    </template>
  </TwoColumnsLayout>
</template>

<script>
import axios from "axios";

import TwoColumnsLayout from "@pagesLayouts/TwoColumnsLayout.vue";

import Comments from "@components/pages/news/comments.vue";
import suggestedByUser from "@components/pages/news/suggestedByUser.vue";
import FileIcon from "@UI/FileIcon.vue";
import AppCounters from "@UI/counter/AppCounters.vue";
import PhotoCardModal from "@/components/modals/PhotoCardModal.vue";

export default {
  name: "PageSingleNews",

  components: {
    Comments,
    AppCounters,
    suggestedByUser,
    FileIcon,
    TwoColumnsLayout,
    PhotoCardModal,
  },

  data() {
    return {
      data: null,
      currentImage: "",
      photoModalIsOpen: false,
      loadImageCount: 0,
    };
  },

  methods: {
    addComentCount() {
      // this.data.commentCount++;
    },

    photoClickHandler(file) {
      this.photoModalIsOpen = true;
      this.currentImage = file.fileLink;
    },

    closePopup() {
      this.currentImage = "";
      this.photoModalIsOpen = false;
    },
    loadImage() {
      if (this.$route.hash) {
        this.loadImageCount++;
        // заранее извиняюсь, если кто-то это увидит, но эта строчка считает длину изображений в новости
        let imageLength = Object.keys(
          this.data.PROPERTY_MEDIALIBRARY[
            Object.keys(this.data.PROPERTY_MEDIALIBRARY)[0]
          ].libraryFiles
        ).length;
        if (imageLength === this.loadImageCount) {
          this.scrollToComments();
        }
      }
    },
    scrollToComments() {
      setTimeout(() => {
        let position = this.$refs.comments.getBoundingClientRect().top;
        window.scrollTo({
          top: position,
          behavior: "smooth",
        });
      }, 1);
    },
  },

  computed: {
    requestGetComments() {
      return {
        url: "/mobileapp/api/news/comments",
        params: { newsId: this.data.ID },
      };
    },

    datFileUrl() {
      // корректировк адреса для локалхоста
      const getHostame = window.location.hostname === window.location.hostname;

      const getProtocol = window.location.protocol;

      return (link) => {
        const linkParts = link.split("/");

        const ind = linkParts.indexOf("upload");

        ind !== -1 ? linkParts.splice(0, ind) : linkParts.splice(0, 1);
        const nl = new URL(
          `/${linkParts.join("/")}`,
          `${getProtocol}//${getHostame}`
        );

        return nl.href;
      };
    },
  },

  mounted() {
    axios
      .get("/mobileapp/api/news/?newsId=" + this.$route.path.split("/")[2])
      .then((response) => {
        this.data = response.data;
        // проверяем нужно ли скролить до комментариев
        if (this.$route.hash && !response.data.PROPERTY_MEDIALIBRARY.length) {
          this.scrollToComments();
        }
        axios
          .post("/mobileapp/api/news/views/", {
            newsId: this.data.ID,
          })
          .catch(() => {
            console.log("Просмотр не засчитан");
          });
      })
      .then
      // Тут отправляем запрос на увеличение счетчика просмотров
      ()
      .catch((error) => {
        console.log(error);
        // this.$router.push('/404')
      });
  },
};
</script>

<style lang="scss" scoped>
@mixin pad {
  @media screen and (max-width: 900px) {
    @content;
  }
}

.news-template {
  &__header {
    position: relative;

    &-inner {
      position: sticky;
      top: var(--headerHeight);
      left: 0;
    }

    &-top {
      padding: var(--v-rhythm-12) 0;

      border-top: 2px solid var(--gray300);
      border-bottom: 2px solid var(--gray300);
    }

    &-title {
      @extend .h2;
    }

    &-suptitle {
      @extend .subtitle-1;

      margin-bottom: var(--v-rhythm-10);

      text-transform: uppercase;
      color: var(--red900);
    }
  }
}

.user-info {
  margin-top: var(--v-rhythm-12);
}

.user-activity {
  &__header {
    --height-shadow: var(--v-rhythm-4);

    padding-bottom: var(--height-shadow);

    overflow: hidden;

    &-inner {
      position: relative;

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--v-rhythm-2);

      padding: var(--v-rhythm-6) 0;

      box-shadow: 0px 4px 8px rgba(9, 0, 109, 0.08);

      // Линия сделана псевдоэлементом, что бы можно было сделать одинаковые паддинги сверху и снизу
      &::before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 2px;

        background-color: var(--gray300);
      }
    }
  }

  &__title {
    @extend .h3;
  }

  &__counters {
  }
}

.image_container {
  width: 100%;
  top: calc(var(--headerHeight) + var(--mainPadding));
  padding-right: var(--mainPadding);
  display: flex;
  flex-direction: column;

  img,
  video {
    width: 100%;
    object-fit: cover;
  }

  * {
    padding-bottom: 40px;
    padding-top: 40px;
    border-bottom: 1px solid #7e849329;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border: none;
    }

    @include pad {
      padding: 0;
      margin-bottom: var(--mainPadding);
      padding-right: var(--mainPadding);

      &:last-child {
        padding-right: 0;
      }
    }
  }

  @include desktop {
    width: 350px;
  }

  @include pad {
    position: static;
    width: 100%;
    padding-right: 0;
    flex-direction: row;
    overflow: auto;
    order: 2;
  }
}

.text {
  @extend .v-html;
  padding-bottom: 20px;
  word-break: break-word;

  ::v-deep {
    h1 {
      font-weight: bold;
      font-size: 36px;
      line-height: 43px;
      color: var(--gray900);
    }

    audio {
      width: 100%;
      margin-top: var(--mainPadding);
      margin-bottom: var(--mainPadding);
    }
  }
}

.main_image {
  position: relative;

  object-fit: cover;

  img {
    min-width: 100%;
  }
}

.data_container {
  padding-top: 40px;
  display: flex;
  flex-wrap: wrap;
}

.data_wrapper {
  display: flex;
  flex-direction: column;
}

.day {
  color: var(--red900);
  font-weight: 700;
  font-size: 100px;
  line-height: 100px;
  padding-right: 16px;

  @include laptop {
    font-size: 80px;
    line-height: 100px;
  }

  @include phones {
    font-size: 30px;
    line-height: 40px;
  }
}

.month,
.year {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--gray500);
}

.media_container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style-type: none;
  margin-bottom: 40px;

  img {
    width: 100%;
    margin-bottom: 8px;
    // min-height: 500px;

    cursor: pointer;
  }

  video {
    width: 100%;
    margin-bottom: 8px;
  }

  audio {
    width: 100%;
  }
}

.file {
  padding: 12px;
  display: flex;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    .file_actions {
      opacity: 1;
    }
  }
}

.file_data {
  padding: 0 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.file_name {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--gray900);
  max-width: calc(100%);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.file_size {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--gray500);
}

.file_actions {
  display: flex;
  transition: 0.3s opacity ease;
  opacity: 0;
}

.file_watch,
.file_download {
  width: 34px;
  margin-left: 6px;
  height: 100%;
  display: block;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg width='22' height='16' viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z' fill='%23A5B2BA'/%3E%3C/svg%3E%0A");
}

.file_download {
  background-image: url("data:image/svg+xml,%3Csvg width='14' height='17' viewBox='0 0 14 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 17H14V15H0V17ZM14 6H10V0H4V6H0L7 13L14 6Z' fill='%23A5B2BA'/%3E%3C/svg%3E%0A");
}

.important-label {
  position: absolute;
  top: 10px;
  left: 10px;

  padding: {
    top: 4px;
    right: 8px;
    bottom: 2px;
    left: 8px;
  }

  @extend .overline;
  color: var(--red900);

  border-radius: 40px;
  background-color: var(--white900);

  & span {
    opacity: 0.9;
  }
}
</style>
