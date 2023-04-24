<template>
  <li class="poll" :class="{ 'poll--open': isContentShow }">
    <!-- {{ poll }} -->
    <div class="poll__status status">
      <PollLabel
        class="poll__label-complete"
        :status="poll.STATUS"
        :iconName="iconName"
      />

      <PollLabel
        class="poll__label-important poll__label-important--mob"
        v-if="poll.VOTE_IMPORTANT"
        :status="'Важное'"
        :iconName="isFixed ? 'pin' : ''"
      />

      <div class="votes" v-if="poll.ALL_USERS_COUNT != 0">
        {{ poll.ALL_USERS_COUNT }}
        {{ voteCountName }}
      </div>
      <div class="date">
        {{ poll.DATE_START.day }} {{ poll.DATE_START.month }}
        {{ poll.DATE_START.year }}
      </div>
    </div>

    <div class="content">
      <div class="visible_content" @click="isContentShow = !isContentShow">
        <div class="poll__name name">
          <PollLabel
            class="poll__label-important"
            v-if="poll.VOTE_IMPORTANT"
            :status="'Важное'"
            :iconName="isFixed ? 'pin' : ''"
          />
          <h3>{{ poll.TITLE }}</h3>
          <div class="status-mobile">
            <div class="votes" v-if="poll.ALL_USERS_COUNT != 0">
              {{ poll.ALL_USERS_COUNT }}
              {{ voteCountName }}
            </div>
            <div class="date">
              {{ poll.DATE_START.day }} {{ poll.DATE_START.month }}
              {{ poll.DATE_START.year }}
            </div>
          </div>
        </div>
        <div class="button">
          <button type="button" :class="{ open: isContentShow }"></button>
        </div>
      </div>
      <PollStatistic :poll="poll" v-if="isContentShow" @onUpdate="update" />
    </div>
  </li>
</template>

<script>
import PollStatistic from "./pollStistic.vue";
import PollLabel from "@/components/pages/polls/PollLabel.vue";

export default {
  name: "AppPoll",

  components: {
    PollStatistic,
    PollLabel,
  },

  props: {
    poll: {
      type: Object,
      required: true,
    },

    isFixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      isContentShow: false,
      isLoading: false,
    };
  },

  computed: {
    voteCountName() {
      if (this.poll.ALL_USERS_COUNT === 1) return "голос";
      else if (this.poll.ALL_USERS_COUNT < 5) return "голоса";
      else if (this.poll.ALL_USERS_COUNT >= 5) return "голосов";
      return "";
    },

    iconName() {
      return this.poll.STATUS === "Не пройден" ||
        this.poll.STATUS === "Завершен"
        ? "clock"
        : "check";
    },
  },

  methods: {
    update() {
      this.$emit("onUpdate");
    },
  },
};
</script>

<style lang="scss" scoped>
.poll {
  padding: 16px 0;
  background-color: #fff;
  position: relative;
  transition: 0.3s background ease;
  border-top: 2px solid var(--gray300);
  display: flex;

  &--open {
    z-index: 10;
  }

  &:hover {
    background-color: var(--gray100);

    &:after {
      background-color: var(--gray100);
    }
    button {
      opacity: 1;
    }
  }

  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 50vw;
    transform: translateX(-100%);
    z-index: -1;
    background-color: #fff;
    transition: 0.3s background ease;
  }

  @include phones {
    flex-direction: column;

    .name h3 {
      font-size: 20px;
      font-weight: 400;
      line-height: 24px;
    }
  }
}

.status {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  @include phones {
    flex-direction: row;
    //justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;

    .votes,
    .date {
      display: none;
    }
  }
}

.status-mobile {
  display: none;
  @include phones {
    display: block;
    margin-top: var(--v-rhythm-2);

    .votes {
      margin-bottom: var(--v-rhythm-1);
    }

    .votes,
    .date {
      font-size: 12px;
      line-height: 18px;
    }
  }
}

.name {
  flex: 1;
}

.button {
  button {
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='6' viewBox='0 0 12 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.4214 0.789639L6.00033 5.21069L1.57928 0.789639' stroke='white' stroke-width='1.42534' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    width: 42px;
    height: 42px;
    background-color: var(--red900);
    border: none;
    border-radius: 42px;
    transition: 0.3s opacity ease, 0.3s transform ease;
    cursor: pointer;
    opacity: 0;
    &.open {
      transform: rotate(180deg);
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  @include phones {
    padding-right: 10px;
  }
}

.visible_content {
  display: flex;
  position: relative;

  .button {
    @include phones {
      position: absolute;
      right: 0px;
      top: -42px;
    }
  }
}

.votes {
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray700);
  margin-bottom: 12px;
}

.date {
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray700);
}

.name {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h3 {
    margin: 0;
    font-weight: bold;
    font-size: 22px;
    line-height: 30px;
    color: var(--gray900);
    word-break: break-word;
  }
}

.poll_item {
  & > .polls_form {
    padding-top: var(--v-rhythm-6);
  }
}
.poll_placeholder {
  display: block;
  margin-bottom: var(--v-rhythm-6);

  @include phones {
    margin-bottom: var(--v-rhythm-4);
  }
}
.poll_form {
  margin-bottom: var(--v-rhythm-6);
}

.poll {
  &__status {
  }

  &__label-complete {
    margin-bottom: var(--v-rhythm-6);
  }

  &__label-important {
    margin-bottom: var(--v-rhythm-4);
  }

  &__label-important--mob {
    display: none;
  }

  &__name {
  }

  @include phones {
    &__label-complete {
      margin-right: var(--v-rhythm-2);
    }

    &__label-important {
      display: none;
    }

    &__label-important--mob {
      display: flex;
    }
  }
}
</style>
