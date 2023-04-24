<template>
  <div class="contest-card-list" v-if="photoContests.length > 0">
    <ContestCard
      v-for="contest in photoContests"
      :key="contest.ID"
      :dataContest="contest"
    />
    <div class="observer" v-intersection="getCards"></div>
  </div>
  <span
    v-else
    class="page-photo-contests__empty"
    :class="{ loading: isLoading }"
    >Конкурсы не найдены</span
  >
</template>

<script>
import ContestCard from "@/components/photo-contests-list/ContestCard.vue";
import axios from "axios";

export default {
  name: "CardsList",

  components: { ContestCard },

  data() {
    return {
      photoContests: [],
      isLoading: false,
      startFromCards: 0,
      endList: false,
    };
  },

  computed: {},

  methods: {
    async getCards(count = 3) {
      if (!this.endList) {
        this.isLoading = true;
        this.endList = true;
        axios
          .get(
            `/mobileapp/api/photoContest?startFrom=${this.startFromCards}&count=${count}`
          )
          .then((res) => {
            this.startFromCards += count;
            this.photoContests = [...this.photoContests, ...res.data.data];
            this.endList = res.data.end;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
  },

  mounted() {
    this.getCards();
  },
};
</script>

<style scoped lang="scss">
.contest-card-list {
  display: flex;
  flex-direction: column;
  row-gap: var(--v-rhythm-3);
}
.photo-contests__empty {
  @extend .h2;
  color: var(--gray500);
}
</style>