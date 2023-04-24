<template>
  <div @click="goToSingleDay($event)" class="calendar__day-tmpl">
    <h3>{{ data }}</h3>

    <transition-group>
      <div :key="'one'" v-if="!loadingIsDone">
        <div class="calendar__day__preload">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div :key="'two'" v-else>
        <div
          v-if="dayInfo && dayInfo.eventCount"
          class="event event__font_default event__rest event__rest-events"
        >
          События <b>({{ dayInfo.eventCount }})</b>
        </div>
        <div
          v-if="dayInfo && dayInfo.event"
          class="event event__first"
          :data-id="dayInfo.event.id"
        >
          <div class="event__font_default event__time">
            {{ dayInfo.event.start }}–{{ dayInfo.event.end }}
          </div>
          <div class="event__font_default font__clamp_3 event__text">
            {{ dayInfo.event.name }}
          </div>
        </div>
        <div
          v-if="dayInfo && dayInfo.taskCount"
          class="event event__font_default event__rest event__rest-tasks"
        >
          Задачи <b>({{ dayInfo.taskCount }})</b>
        </div>
        <div
          v-if="dayInfo && dayInfo.birthdayCount"
          class="event event__font_default event__rest event__rest-bthdays"
        >
          Дни рождения <b>({{ dayInfo.birthdayCount }})</b>
        </div>

        <!-- Попап для просмотра списка не нужен -->
        <!-- <button
          v-if="dayInfo && restEvents"
          ref="button"
          @click="showDaysModal(data)"
          class="button button__car button__car__more"
        >
          <span class="event__font_default">Смотреть все</span>
        </button> -->

        <span class="button__car__more" v-if="dayInfo">Смотреть все</span>
      </div>
    </transition-group>

    <monthCardModalVue
      :loadingModalIsDone="loadingModalIsDone"
      ref="modal"
      @closeModal="modalId = -1"
      :day="data"
      :fakeEventList="fakeEventList"
      v-if="modalId === data"
      :loadingIsDone="loadingIsDone"
    />
  </div>
</template>

<script>
import monthCardModalVue from "./monthCardModal.vue";
export default {
  name: "monthCalendarItem",
  components: {
    monthCardModalVue,
  },
  data() {
    return {
      modalId: -1,
    };
  },
  props: {
    data: [String, Number],
    dayInfo: [Array, Object],
    loadingIsDone: Boolean,
    fakeEventList: [Array, Object],
    loadingModalIsDone: Boolean,
  },
  methods: {
    goToSingleDay(e) {
      if (e.target.closest("button")) {
        e.target.closest("button") == this.$refs.button && false;
      } else if (e.target.closest(".modal")) {
        e.target.closest(".modal") != this.$refs.modal.$el && false;
      } else {
        this.$emit("emitGoToSingleDay", this.data);
      }
    },
    showDaysModal(e) {
      this.$emit("emitShowModal", e);
      this.modalId = this.data;
    },
  },
  computed: {
    restEvents() {
      let { eventCount, taskCount, birthdayCount } = this.dayInfo;
      eventCount = eventCount ?? 0;
      taskCount = taskCount ?? 0;
      birthdayCount = birthdayCount ?? 0;
      return eventCount + taskCount + birthdayCount;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes LoadingAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.calendar__day__preload {
  display: flex;
  flex-direction: column;
  width: 100%;
  > div {
    margin-bottom: 8px;
    width: 100%;
    height: 8px;
    background: linear-gradient(310deg, #dae1e9, #f8f8f8, #dae1e9);
    background-size: 200% 200%;
    animation: LoadingAnimation 8s ease infinite;
    &:first-child {
      height: 16px;
    }
  }
}
.calendar__day-tmpl {
  position: relative;
  padding: 8px 10px;
  width: calc(100% / 7);
  height: 220px;
  background-color: #fff;
  border: 1px solid var(--gray100);
  cursor: pointer;
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--gray900);
    padding: 0;
    margin: 0 0 8px 0;
  }
  &__active {
    border: 1px solid var(--red900);
    h3 {
      color: var(--red900);
    }
  }
  &:not(.calendar__day-tmpl__active) {
    &:hover {
      border-color: pink;
      h3 {
        color: var(--red900);
      }
    }
  }
  &:hover {
    background-color: var(--red100);
    h3 {
      color: var(--red900);
    }
    // .button {
    //   &__car {
    //     width: 100%;
    //     &__more {
    //       > span {
    //         color: var(--red700);
    //       }
    //     }
    //   }
    // }
  }
}
// .button {
//   &__car {
//     width: 100%;
//     &__more {
//       margin: 8px 0;
//       > span {
//         display: inline-block;
//         text-align: left;
//         width: 100%;
//         white-space: nowrap;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         color: red;
//         font-size: 12px;
//         color: var(--red900);
//       }
//     }
//   }
// }

.button__car__more {
  margin: 8px 0;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--red900);
  @extend .caption-2;
}
.event {
  &__first {
    margin-bottom: 8px;
  }
  &__font_default {
    font-size: 12px;
  }
  &__time {
    color: var(--gray900);
    font-weight: 700;
  }
  &__text {
    color: var(--gray900);
    font-weight: 400;
    line-height: 16px;
  }
  &__rest {
    > b {
      font-weight: 400;
      color: var(--red900);
    }
    &-tasks,
    &-events,
    &-bthdays {
      font-weight: 700;
      color: var(--gray700);
    }
  }
}
.font__clamp_3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>