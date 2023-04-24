<template>
  <!-- !TODO переделать структуру компонента по БЭМ полностью -->
  <li class="brigade-rating">
    <div class="brigade-rating__content" v-if="isSingleWinner">
      <template v-for="(item, i) of data.WINNER">
        <div :key="i" class="brigade-rating__sw-avatar">
          <router-link
            :to="'/lk?=' + item.ID"
            :title="item.FULL_NAME"
            class="brigade-rating__brigade-item-link"
          >
            <SimplePicture
              class="brigade-rating__brigade-item-pic"
              :src="item.USER_PHOTO"
              :alt="item.name"
            />
          </router-link>
          <div class="place single-winner">
            <img src="@/assets/icons/place.svg" alt="Ещё" />
            <span>{{ data.PLACE }}</span>
          </div>
        </div>
      </template>
      <h5 class="name">
        {{ data.WINNER[Object.keys(data.WINNER)[0]].FULL_NAME }}
      </h5>
      <span class="leader" v-html="data.CARD_DESCRIPTION"></span>
    </div>

    <div class="brigade-rating__content" v-if="!isSingleWinner">
      <div class="place">
        <img src="@/assets/icons/place.svg" alt="Ещё" />
        <span>{{ data.PLACE }}</span>
      </div>
      <h5 class="name">{{ data.NAME }}</h5>
      <span class="leader" v-html="data.CARD_DESCRIPTION"></span>
      <ParticipantsList
        :participants="participants"
        class="brigade-rating__participants-list"
      />
    </div>

    <tippy
      interactive
      animation="fade"
      :animate-fill="false"
      :delay="[300, 0]"
      :onShown="loadLikers"
      :hideOnClick="false"
      class="like"
    >
      <template v-slot:trigger>
        <button
          class="like__btn"
          :class="{ 'like__btn--active': isLiked }"
          type="button"
          @click.once="like"
        >
          <UserIcons class="like__icon" iconName="like-hand" />
          {{ likeCount }}
        </button>
      </template>

      <PeopleTooltip
        v-if="likeCount > 0"
        class="brigade-rating__brigade-item-people-tooltip"
        :people="likersList"
        @getPeople="getPeople"
        :isEnd="isEndLikers"
      />
    </tippy>
  </li>
</template>

<script>
import PeopleTooltip from "@/components/UI/tooltip/PeopleTooltip.vue";
import axios from "axios";
import SimplePicture from "@/components/UI/SimplePicture.vue";
import ParticipantsList from "@/components/UI/ParticipantsList.vue";
export default {
  name: "BrigadeRating",

  components: {
    PeopleTooltip,
    SimplePicture,
    ParticipantsList,
  },

  props: {
    data: Object,
  },

  data() {
    return {
      isSingleWinner: false,
      likersList: [],
      isLiked: this.data.CongratulationStatus,
      likeCount: this.data.CongratulationCount,
      participants: [],
      isEndLikers: false,
      startFrom: 0,
      count: 10,
    };
  },

  methods: {
    loadLikers() {
      if (!this.isEndLikers) {
        axios
          .get(
            "mobileapp/api/raiting/congratulationuserinfo/?count=" +
              this.count +
              "&startFrom=" +
              this.startFrom +
              "&raitingCardId=" +
              this.data.ID,
            {
              raitingCardId: this.data.ID,
            }
          )
          .then((response) => {
            for (let key in response.data.usersInfo) {
              this.likersList.push({
                authorInfo: response.data.usersInfo[key],
              });
            }
            if (response.data.end != undefined) {
              this.isEndLikers = response.data.end;
            } else {
              this.isEndLikers = true;
            }
            // this.likeCount = this.likersList.length;
          });
      }
    },

    getPeople() {
      this.loadLikers();

      this.startFrom += this.count;
    },

    like() {
      axios
        .post("/mobileapp/api/raiting/congratulationadd/", {
          raitingCardId: this.data.ID,
        })
        .then((response) => {
          if (response.status === 200) {
            this.isLiked = true;
            this.loadLikers();
            this.likeCount = response.data.totalCount;
          }
        });
    },
  },

  mounted() {
    // console.log(this.data.WINNER.length);
    if (this.data.WINNER) {
      for (let key in this.data.WINNER) {
        this.participants = [...this.participants, this.data.WINNER[key]];
      }

      if (this.participants.length < 2) {
        this.isSingleWinner = true;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.brigade-rating {
  --heightBorderTop: 4px;

  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: calc(33.33%);

  //box-shadow: var(--boxShadowList);
  padding: var(--v-rhythm-11) var(--v-rhythm-4) var(--v-rhythm-8);

  background-color: var(--gray100);
  border-top: var(--heightBorderTop) solid var(--red900);

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: calc(-1 * var(--heightBorderTop));
    right: 0;
    left: 0;
    bottom: 0;

    border: 2px solid rgba(218, 225, 233, 0.2);
  }
  &:last-child {
    margin-right: 0;
  }

  &__sw-avatar {
    border-radius: 100%;
    height: 100px;
    width: 100px;
    position: relative;
  }

  &__participants-list {
    margin-bottom: var(--v-rhythm-10);
  }
}

.place {
  width: 80px;
  height: 100px;
  position: relative;

  span {
    font-weight: 700;
    font-size: 40px;
    line-height: 24px;
    color: var(--gray700);
    position: absolute;
    left: 50%;
    top: 28px;
    transform: translateX(-50%);
  }
}
.place.single-winner {
  width: 40px;
  height: 40px;
  position: absolute;
  top: -8px;
  right: -8px;

  span {
    font-size: 16px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.name {
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  color: var(--gray900);
  width: 100%;
  margin: 0;
  margin-bottom: 4px;
  text-align: center;
}

.leader {
  word-break: break-all;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--gray500);
  width: 100%;
  text-align: center;
  margin-bottom: 50px;
  flex: 1;
  &::v-deep {
    a {
      color: var(--red900);
    }
  }
}

.like {
  position: relative;
  &__btn {
    --likeColor: var(--gray500);
    padding: var(--v-rhythm-1) var(--v-rhythm-2);
    display: flex;
    align-items: center;
    gap: var(--v-rhythm-2);

    color: var(--likeColor);
    @extend .button;

    cursor: pointer;
    @include transition();

    &--active {
      --likeColor: var(--red900);
      cursor: default;
    }

    &:active:not(.like__btn--active) {
      opacity: var(--active-opacity);
    }
  }
  &__icon {
    width: 20px;
    height: 20px;
    fill: var(--likeColor);
  }
}
.brigade-rating__brigade-item-pic {
  border-radius: 50%;
  overflow: hidden;
  max-height: 100%;
}
</style>
