<template>
  <div class="modal">
    <div class="modal__container">
      <div class="modal__header">
        <h3>{{day}}</h3>
        <button class="icon icon__close" @click="$emit('closeModal')"></button>
      </div>
      <transition-group name="fade">
        <div :key="'qwe'" v-if="loadingModalIsDone">
          <div class="modal__body modal__body__events" v-if="fakeEventList.eventList">
            <div class="modal__body__item" v-for="(item, index) in fakeEventList.eventList" :key="`event-${index}`">
              <div class="event__font_default event__font_default_grey event__font_default_bold modal__body__item__time">{{item.start}} - {{item.end}}</div>
              <div class="event__font_default event__font_default_grey event__font_default_normal modal__body__item__text">{{item.name}}</div>
            </div>
          </div>
          <div class="modal__body modal__body__tasks" v-if="fakeEventList.taskList">
            <div class="modal__body__item" v-for="(item, index) in fakeEventList.taskList" :key="`task-${index}`">
              <div class="event__font_default event__font_default_red event__font_default_bold modal__body__item__time" :class="`modal__body__item__time__${item.status}`">{{item.status}}</div>
              <div class="event__font_default event__font_default_grey event__font_default_normal modal__body__item__text">{{item.name}}</div>
            </div>
          </div>
          <div class="modal__body modal__body__tasks" v-if="fakeEventList.birthdayList">
            <span class="event__font_default event__font_default_grey event__font_default_bold modal__body__item__time">Дни рождения </span>
            <span class="event__font_default event__font_default_red event__font_default_bold modal__body__item__time">({{Object.keys(fakeEventList.birthdayList).length}})</span>
          </div>
        </div>
        <div :key="'zxc'" v-else class="calendar__day__preload">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'monthCardModal',
    props: {
      day: Number,
      fakeEventList: [Array, Object],
      loadingModalIsDone: Boolean
    },
    methods: {
      closeOnClickOutOfElement(e) {
        if (!e.target.closest('.modal')) {
          this.$emit('closeModal')
        }
      },
    },
    mounted() {
      setTimeout(() => {
        document.addEventListener('click', this.closeOnClickOutOfElement)
      }, 0);
    },
    destroyed() {
      document.removeEventListener('click', this.closeOnClickOutOfElement)
    }
  }
</script>

<style lang="scss" scoped>
h3 {
  color: var(--red900);
}
.modal {
  display: flex;
  z-index: 999;
  position: absolute;
  top: -10px;
  left: -9px;
  box-sizing: border-box;
  padding: 16px;
  width: calc(100% + 18px);
  height: fit-content;
  background-color: #fff;
  border: 1px solid var(--red700);
  &__container {
    width: 100%;
  }
  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  &__body__item {
    margin-bottom: 8px;
  }
  &__body__events, &__body__tasks {
    box-sizing: border-box;
    padding: 8px 0;
    border-bottom: 1px solid var(--gray500);
  }
}
.event__font_default {
  font-size: 12px;
  &_grey {
    color: var(--grey900);
  }
  &_red {
    color: var(--red900);
  }
  &_bold {
    font-weight: 700;
  }
  &_normal {
    font-weight: 400;
  }
}
.icon {
  &__close {
    width: 24px;
    height: 24px;
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.3007 5.70997C17.9107 5.31997 17.2807 5.31997 16.8907 5.70997L12.0007 10.59L7.1107 5.69997C6.7207 5.30997 6.0907 5.30997 5.7007 5.69997C5.3107 6.08997 5.3107 6.71997 5.7007 7.10997L10.5907 12L5.7007 16.89C5.3107 17.28 5.3107 17.91 5.7007 18.3C6.0907 18.69 6.7207 18.69 7.1107 18.3L12.0007 13.41L16.8907 18.3C17.2807 18.69 17.9107 18.69 18.3007 18.3C18.6907 17.91 18.6907 17.28 18.3007 16.89L13.4107 12L18.3007 7.10997C18.6807 6.72997 18.6807 6.08997 18.3007 5.70997Z' fill='%23A5B2BA'/%3E%3C/svg%3E");
  }
}
@keyframes LoadingAnimation {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
.calendar__day__preload {
  display: flex;
  flex-direction: column;
  width: 100%;
  >div {
    margin-bottom: 8px;
    width: 100%;
    height: 8px;
    background: linear-gradient(310deg, #DAE1E9, #f8f8f8, #DAE1E9);
    background-size: 200% 200%;
    animation: LoadingAnimation 8s ease infinite;
    &:first-child {
      height: 16px;
    }
  }
}
</style>