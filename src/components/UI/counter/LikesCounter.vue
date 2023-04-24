<template>
  <tippy
    class="likes-counter"
    interactive
    animation="fade"
    :animate-fill="false"
    :delay="[300, 0]"
    :onShown="getPeopleList"
    :hideOnClick="false"
  >
    <template v-slot:trigger>
      <AppCounter
        class="likes-counter__btn"
        :counterIcon="'like'"
        :counterNumber="counterNumber"
        :isActive="isLiked"
        @click="like"
      />
    </template>

    <PeopleTooltip
      v-if="counter > 0"
      class="likes-counter__tooltip"
      :people="peopleList"
      :isEnd="isEnd"
      :isLoading="isLoading"
      @getPeople="fetchPeopleList"
    />
  </tippy>
</template>

<script>
import AppCounter from "@/components/UI/counter/AppCounter.vue";
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";
import axios from "axios";

export default {
  name: "LikesCounter",

  components: {
    PeopleTooltip,
    AppCounter,
  },

  props: {
    counter: {
      type: Number,
      required: true,
    },

    urlId: {
      type: [String, Number],
      required: true,
    },

    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      isLiked: false,
      peopleList: [],
      isEnd: true,
      isLoading: false,
      counterNumber: this.counter,
    };
  },

  computed: {},

  methods: {
    async getPeopleList() {
      if (this.peopleList.length === 0) {
        this.fetchPeopleList();
      }
    },

    async fetchPeopleList() {
      try {
        this.isLoading = true;
        this.isEnd = true;
        const response = await axios({
          method: "get",
          url: "/mobileapp/api/news/likes",
          params: {
            newsId: this.urlId,
            count: 20,
            startFrom: this.peopleList.length,
          },
        });

        this.peopleList = [...this.peopleList, ...response.data.data];
        this.isEnd = response.data.end;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    like() {
      this.isLiked = !this.isLiked;
      if (this.isLiked) {
        // отправляем лайк
        axios
          .post("/mobileapp/api/news/likes/", {
            newsId: this.urlId,
          })
          .then(() => {
            this.updateLikes();
          });
      } else {
        // удаляем лайк
        axios
          .post("/mobileapp/api/news/likes/delete", {
            newsId: this.urlId,
          })
          .then(() => {
            this.updateLikes();
          });
      }
    },

    updateLikes() {
      this.peopleList = [];
      this.getPeopleList();
      axios
        .get("/mobileapp/api/news/likes/?do_count=Y&newsId=" + this.urlId)
        .then((response) => {
          this.counterNumber = response.data;
        });
    },
  },

  mounted() {
    if (this.isActive) this.isLiked = this.isActive;
  },
};
</script>

<style scoped lang="scss">
.likes-counter {
  cursor: pointer;

  &:active {
    opacity: var(--active-opacity);
  }

  &__btn {
  }

  &__tooltip {
  }
}
</style>
