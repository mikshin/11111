<template>
  <div class="event-modal-viewing">
    <div class="event-modal-viewing__top">
      <div class="event-modal-viewing__title">
        {{ eventData.name }}
      </div>

      <div class="event-modal-viewing__top-btns" v-if="eventData.editRight">
        <template v-for="(right, i) in eventData.editRight">
          <FunctionBtn
            class="event-modal-viewing__top-btn"
            :key="i"
            v-if="right === 'edit'"
            :iconName="'pen'"
            @clickBtn="editEvent"
          />
          <FunctionBtn
            class="event-modal-viewing__top-btn"
            :key="i"
            v-if="right === 'delete'"
            :iconName="'trash'"
            @clickBtn="deleteEvent"
          />
        </template>
      </div>
    </div>

    <div class="event-modal-viewing__main event-modal-viewing-info">
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Описание</span>
        <div
          class="event-modal-viewing-info__item-content"
          v-html="descriptionContent"
        ></div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Дата</span>
        <div class="event-modal-viewing-info__item-content">
          {{ date }}
        </div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Повторяемость</span>
        <div class="event-modal-viewing-info__item-content">
          {{ repite }}
        </div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Компания</span>
        <div class="event-modal-viewing-info__item-content">
          {{ companies }}
        </div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Подразделение</span>
        <div class="event-modal-viewing-info__item-content">
          {{ department }}
        </div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Место</span>
        <div
          class="
            event-modal-viewing-info__item-content
            event-modal-viewing-info__place-list
          "
        >
          <template
            v-if="eventData.office || eventData.room || eventData.other_place"
          >
            <div
              class="event-modal-viewing-info__place-item"
              v-if="eventData.office"
            >
              {{ eventData.office[0].label }},
            </div>
            <div
              class="event-modal-viewing-info__place-item"
              v-if="eventData.room"
            >
              {{ eventData.room[0].label }}
            </div>
            <div
              class="event-modal-viewing-info__place-item"
              v-if="eventData.other_place"
            >
              {{ eventData.other_place }}
            </div>
          </template>
          <div class="event-modal-viewing-info__place-item" v-else>-</div>
        </div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Организатор</span>
        <div class="event-modal-viewing-info__item-content">
          <SimplePersonCard
            class="event-modal-viewing-info__item-person"
            :avatar="{
              alt: eventData.creator.fullName,
              src: eventData.creator.photo,
            }"
            :fullName="eventData.creator.fullName"
            :isMiniSize="true"
            :link="true"
            :id="eventData.creator.id"
            :vacation="eventData.creator.VACATION"
            :fired="eventData.creator.FIRED"
          />
        </div>
      </div>
      <div class="event-modal-viewing-info__item">
        <span class="event-modal-viewing-info__item-title">Участники</span>
        <div class="event-modal-viewing-info__item-content">
          <div
            class="event-participants"
            :class="{ loading: isLoadingMembers }"
            v-if="eventMembers.length > 0"
          >
            <div
              class="event-participants__item"
              v-for="item in eventMembers"
              :key="item.ID"
            >
              <SimplePersonCard
                class="event-participants__person"
                :avatar="{
                  alt: item.FULL_NAME,
                  src: item.USER_PHOTO,
                }"
                :fullName="item.FULL_NAME"
                :isMiniSize="true"
                :link="true"
                :id="item.ID"
                :vacation="item.VACATION"
                :fired="item.FIRED"
              />

              <EventStatus
                class="event-participants__status"
                :status="item.status"
              />
            </div>

            <div v-if="!eventMembersEnd" v-intersection="uploadMembers"></div>
          </div>
          <template v-else>-</template>
        </div>
      </div>
    </div>

    <div class="event-modal-viewing__bottom" v-if="eventData.memberRight">
      <button
        class="event-modal-viewing__bottom-btn primary-btn"
        @click="updateStatus('Y')"
        :disabled="!checkProperty(eventData.memberRight, 'approve')"
      >
        Участвовать
      </button>
      <button
        class="event-modal-viewing__bottom-btn secondary-btn"
        :disabled="!checkProperty(eventData.memberRight, 'deny')"
        @click="updateStatus('N')"
      >
        Отклонить
      </button>
    </div>
  </div>
</template>

<script>
import FunctionBtn from "@/components/UI/FunctionBtn.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import EventStatus from "@/components/UI/labels/EventStatus.vue";

export default {
  name: "EventModalViewing",

  components: {
    FunctionBtn,
    SimplePersonCard,
    EventStatus,
  },

  props: {
    eventData: {
      type: Object,
      required: true,
    },

    eventMembers: {
      type: Array,
      required: true,
    },

    eventMembersEnd: {
      type: Boolean,
      required: true,
    },

    isLoadingMembers: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    date() {
      let date;
      if (this.eventData)
        date = `${this.convertDate(
          this.eventData.active_from
        )} - ${this.convertDate(this.eventData.active_to)}`;
      return date;
    },

    companies() {
      return this.eventData
        ? this.arrayToStringg(this.eventData.company)
        : null;
    },

    repite() {
      return this.eventData ? this.arrayToStringg(this.eventData.repite) : null;
    },

    department() {
      return this.eventData
        ? this.arrayToStringg(this.eventData.department)
        : null;
    },

    descriptionContent() {
      return this.eventData.description || "-";
    },
  },

  methods: {
    arrayToStringg(arr) {
      let string;

      if (arr && arr.length > 0) {
        const newArr = arr.map((item) => item.label);
        string = newArr.length === 1 ? newArr[0] : newArr.join(", ");
      } else {
        string = "-";
      }
      return string;
    },

    deleteEvent() {
      this.$emit("deleteEvent");
    },

    editEvent() {
      this.$emit("editEvent");
    },

    uploadMembers() {
      this.$emit("uploadMembers");
    },

    updateStatus(status) {
      this.$emit("updateStatus", status);
    },

    checkProperty(arr, property) {
      return arr.includes(property);
    },

    convertDate(timestamp) {
      const correctTimestamp = new Date(timestamp * 1000);
      const date = correctTimestamp.toLocaleDateString("ru-RU");
      const time = correctTimestamp.toLocaleTimeString("ru-RU", {
        hour: "numeric",
        minute: "numeric",
      });
      return `${date} ${time}`;
    },
  },

  watch: {},

  mounted() {},
};
</script>

<style scoped lang="scss">
.event-modal-viewing {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-8);

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--v-rhythm-6);
  }

  &__title {
    @extend .h3;
    color: var(--gray900);
  }

  &__top-btns {
    display: flex;
    gap: var(--v-rhythm-4);
    flex-shrink: 0;
  }

  &__top-btn {
    flex-shrink: 0;
  }

  &__main {
  }

  &__bottom {
    display: flex;
    gap: var(--v-rhythm-4);
  }

  &__bottom-btn {
  }
}

.event-modal-viewing-info {
  &__item {
    width: 100%;
    padding: var(--v-rhythm-3) 0;

    display: flex;
    gap: var(--v-rhythm-8);

    border-bottom: 2px solid var(--gray200);

    &:last-child {
      padding-bottom: unset;

      border-bottom: unset;
    }
  }

  &__item-title {
    width: calc(203 * 100% / 764);

    @extend .subtitle-1;
    color: var(--gray700);
    word-break: break-word;
  }

  &__item-content {
    width: calc(529 * 100% / 764);

    @extend .body-2;
    color: var(--gray900);
    word-break: break-word;
  }

  @include phones {
    &__item {
      flex-direction: column;
      gap: var(--v-rhythm-2);
    }

    &__item-title {
      width: 100%;
    }

    &__item-content {
      width: 100%;
    }
  }
}

.event-participants {
  max-height: 312px;
  // Нужно, что бы не обрезалась иконка отпуска
  padding-top: 4px;
  padding-left: 4px;
  margin-top: -4px;
  margin-left: -4px;

  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-2);

  overflow-y: auto;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--v-rhythm-2);
  }

  &__person {
  }

  &__status {
    flex-shrink: 0;
  }
}
</style>