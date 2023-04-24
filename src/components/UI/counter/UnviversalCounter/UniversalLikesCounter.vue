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
        :counterNumber="likeCounter"
        :isActive="isLiked"
        @click="updateLikeState"
      />
    </template>
    <div v-if="endpoint.isActive">
      <PeopleTooltip
        v-if="likeCounter > 0"
        class="likes-counter__tooltip"
        :people="peopleList"
        :isLoading="isLoading"
        :isEnd="isEnd"
        @getPeople="fetchPeopleList"
      />
    </div>
  </tippy>
</template>

<script>
// README
// EXAMPLE OF PROPS "likesEndPoints"
// likesEndPoints: {
//   isActive: true, <-turn on/off tooltip with list of persons who like this
//   getListURL: "/mobileapp/api/group/news/like/", <-getting list of persons who like this
//   currentState: this.post.IS_LIKE, <-current state of like icon (true means its red)
//   actions: {
//     set: {
//       url: "/mobileapp/api/group/news/like/add", <-url for set LIKE
//       params: {
//         groupNewsId: this.post.ID,  <-params from backend
//       },
//     },
//     remove: {
//       url: "/mobileapp/api/group/news/like/delete", <url for remove LIKE
//       params: {
//         groupNewsId: this.post.ID, <-params from backend
//       },
//     },
//   },
// },
import axios from "axios";
import AppCounter from "@/components/UI/counter/AppCounter.vue";
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";
export default {
  name: "UniversalLikesCounter",

  components: { AppCounter, PeopleTooltip },

  props: {
    counter: {
      type: Number,
      required: true,
      default: 0,
    },

    endpoint: {
      type: Object,
      required: true,
    },

    urlId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      peopleList: [],
      isLiked: this.endpoint.currentState,
      likeCounter: this.counter,
      isEnd: true,
      isLoading: false,
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
        if (this.endpoint.isActive) {
          const response = await axios({
            method: "get",
            url: this.endpoint.getListURL,
            params: {
              groupNewsId: this.urlId,
              count: 20,
              startFrom: this.peopleList.length,
            },
          });

          if (response?.data?.data) {
            this.peopleList = [
              ...this.peopleList,
              ...this.updateShittyLegacyFormatPeopleList(response.data.data),
            ];
            this.isEnd = response.data.end;
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    updateShittyLegacyFormatPeopleList(arr) {
      return arr.map((i) => {
        return {
          authorInfo: {
            userId: i.ID,
            userName: i.FULL_NAME,
            userPhoto: i.USER_PHOTO,
            VACATION: i.VACATION,
            FIRED: i.FIRED,
          },
        };
      });
    },

    async updateLikeState() {
      try {
        const response = await axios({
          method: "post",
          url: this.isLiked
            ? this.endpoint.actions.remove.url
            : this.endpoint.actions.set.url,
          params: {
            groupNewsId: this.urlId,
          },
        });

        if (response) {
          this.isLiked ? this.likeCounter-- : this.likeCounter++;
          this.isLiked = !this.isLiked;
        }

        this.peopleList = [];
        this.fetchPeopleList();
      } catch (error) {
        console.log(error);
      }
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss"></style>