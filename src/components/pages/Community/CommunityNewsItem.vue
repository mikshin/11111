<template>
  <div class="community_news_item__wrapper" @click.self="seeMsg">
    <div class="community_news_item__middle_wrapper">
      <SimplePersonCard
        :avatar="{ src: post.CREATED_BY.USER_PHOTO }"
        :fullName="post.CREATED_BY.FULL_NAME"
        :id="post.CREATED_BY.ID"
        :postDate="post.DATE_CREATE"
        :link="true"
        :vacation="post.CREATED_BY.VACATION"
        :fired="post.CREATED_BY.FIRED"
      />
      <div
        class="community_news_item__btns-edit"
        v-if="post.ACCESS && post.ACCESS.length > 0"
      >
        <template v-for="(right, i) in post.ACCESS">
          <FunctionBtn
            class="question-answer-main__btn"
            :key="i"
            v-if="right === 'edit'"
            :iconName="'pen'"
            @clickBtn="onEdit"
          />

          <FunctionBtn
            class="question-answer-main__btn"
            :key="i"
            v-if="right === 'delete'"
            :iconName="'trash'"
            @clickBtn="onDelete"
          />
        </template>
      </div>
    </div>

    <div
      class="community_news_item__text"
      :class="{ community_news_item__safari_text: detectSafariBrowser }"
      v-html="post.DETAIL_TEXT"
      @click="seeMsg"
    ></div>
    <div class="community_news_item__social_block" @click.self="seeMsg">
      <UniversalAppCounter
        :instance="post"
        :viewsEndPoints="viewsEndPoints"
        :likesEndPoints="likesEndPoints"
        :commentsEndPoints="commentsEndPoints"
      />
    </div>
  </div>
</template>

<script>
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
import UniversalAppCounter from "@/components/UI/counter/UnviversalCounter/UniversalAppCounter.vue";
export default {
  name: "CommunityNewsItem",

  components: { SimplePersonCard, FunctionBtn, UniversalAppCounter },

  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      viewsEndPoints: {
        isActive: true,
        getListURL: "/mobileapp/api/group/news/view/",
        actions: null,
      },
      likesEndPoints: {
        isActive: true,
        getListURL: "/mobileapp/api/group/news/like/",
        currentState: this.post.IS_LIKE,
        actions: {
          set: {
            url: "/mobileapp/api/group/news/like/add",
            params: {
              groupNewsId: this.post.ID,
            },
          },
          remove: {
            url: "/mobileapp/api/group/news/like/delete",
            params: {
              groupNewsId: this.post.ID,
            },
          },
        },
      },
      commentsEndPoints: {
        isActive: true,
        getListURL: "/mobileapp/api/group/news/comments/",
        routerLink: this.post.ID,
        params: {
          groupNewsId: this.post.ID,
        },
      },
    };
  },

  computed: {
    detectSafariBrowser() {
      const appleExpression = /Apple/i;
      const safariExpression = /Safari/i;
      const isAppleSafari = () => {
        return (
          appleExpression.test(navigator.vendor) &&
          safariExpression.test(navigator.userAgent)
        );
      };
      if (isAppleSafari()) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    onDelete() {
      this.$emit("onDelete", this.post.ID);
    },

    onEdit() {
      this.$emit("onEdit", this.post.ID);
    },
    seeMsg() {
      this.$router.push(`${this.$route.path}/${this.post.ID}`);
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.community_news_item {
  &__wrapper {
    padding: var(--v-rhythm-6);
    background-color: var(--white900);
    border-bottom: 2px solid var(--gray300);
    position: relative;
    z-index: 1;
    cursor: pointer;
    @include transition();

    @include hover {
      background-color: var(--gray200);
      @include box-sh(1px, var(--gray300));
      .community_news_item__btns-edit {
        opacity: 1;
      }
    }
    @include no-hover {
      background-color: var(--white900);
    }
    &:last-child {
      border-color: #0000;
    }
  }
  &__middle_wrapper {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
  }
  &__btns-edit {
    display: flex;
    gap: var(--v-rhythm-6);
    @include transition();
    opacity: 0;
  }
  &__text {
    @extend .v-html;
    margin-top: var(--v-rhythm-4);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @include phones {
      max-height: 42px;
    }
  }
  &__safari_text {
    display: block;
    max-height: 50px;
    overflow: hidden;
  }
  &__social_block {
    margin-top: var(--v-rhythm-5);
    position: relative;
    z-index: 2;
  }
}
@media (max-width: 767px) {
  .community_news_item {
    &__btns-edit {
      opacity: 1;
    }
    &__text {
      max-height: 30px;
    }
  }
}
</style>