<template>
  <div class="contacts-profile">
    <div class="contacts-profile__title">Контакты</div>
    <ul class="contacts-profile__contacts">
      <li class="contacts-profile__contact">
        <span class="contacts-profile__contact-title">Внутренний телефон</span>
        <a
          class="contacts-profile__contact-link"
          v-if="contactsData.UF_PHONE_INNER"
          :href="`tel:${contactsData.UF_PHONE_INNER}`"
          >{{ contactsData.UF_PHONE_INNER }}</a
        >
        <span class="contacts-profile__contact-fild" v-else>Не указан</span>
      </li>

      <li class="contacts-profile__contact">
        <span class="contacts-profile__contact-title">Мобильный телефон</span>
        <EditableContact
          class="contacts-profile__editable-contact"
          :contact="contactsData.WORK_PHONE"
          :id="id"
          :type="'tel'"
          v-if="isMine"
        />
        <template v-else>
          <a
            class="contacts-profile__contact-link"
            v-if="contactsData.WORK_PHONE"
            :href="`tel:${contactsData.WORK_PHONE}`"
            >{{ contactsData.WORK_PHONE }}</a
          >
          <span class="contacts-profile__contact-fild" v-else>Не указан</span>
        </template>
      </li>

      <li class="contacts-profile__contact">
        <span class="contacts-profile__contact-title">E-mail</span>
        <a
          class="contacts-profile__contact-link"
          v-if="contactsData.EMAIL"
          :href="`mailto:${contactsData.EMAIL}`"
          >{{ contactsData.EMAIL }}</a
        >
        <span class="contacts-profile__contact-fild" v-else>Не указан</span>
      </li>

      <li class="contacts-profile__contact">
        <span class="contacts-profile__contact-title">Адрес</span>
        <address class="contacts-profile__contact-fild">
          {{
            contactsData.WORK_STREET ? contactsData.WORK_STREET : "Не указан"
          }}
        </address>
      </li>

      <li class="contacts-profile__contact">
        <span class="contacts-profile__contact-title">Личный e-mail</span>
        <EditableContact
          class="contacts-profile__editable-contact"
          :contact="contactsData.PERSONAL_MAILBOX"
          :id="id"
          :type="'email'"
          :placeholder="'Введите email'"
          v-if="isMine"
        />
        <span class="contacts-profile__contact-fild" v-else>{{
          contactsData.PERSONAL_MAILBOX
            ? contactsData.PERSONAL_MAILBOX
            : "Не указан"
        }}</span>
      </li>
    </ul>

    <div class="contacts-profile__btns" v-if="!isMine">
      <button
        class="contacts-profile__btn primary-btn"
        @click="toggleChat(id)"
        :disabled="isFired"
      >
        <UserIcons :iconName="'chat'" />
        <span>Написать в чат</span>
      </button>
      <!-- Пока не реализуем -->
      <!-- <button class="contacts-profile__btn secondary-btn">
        <UserIcons :iconName="'phone'" />
        <span>Позвонить в TrueConf</span>
      </button> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
import EditableContact from "@/components/pages/lk/EditableContact.vue";

export default {
  name: "ContactsProfile",

  components: { EditableContact },

  data() {
    return {
      isLoading: false,
      contactsData: {},
    };
  },

  props: {
    isMine: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    isFired: {
      type: Boolean,
      require: false,
    },
  },

  computed: {
    // workPhoneWithInnerCode() {
    //   return this.contactsData.UF_PHONE_INNER
    //     ? `${this.contactsData.WORK_PHONE} (доб. ${this.contactsData.UF_PHONE_INNER})`
    //     : this.contactsData.WORK_PHONE;
    // },
  },

  methods: {
    ...mapActions(["toggleChat"]),
    async downloadData() {
      try {
        this.isLoading = true;
        const response = await axios({
          method: "get",
          url: `mobileapp/api/user/getUserContactInfo?profileId=${this.id}`,
        });
        this.contactsData = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.downloadData();
  },
};
</script>

<style lang="scss" scoped>
.contacts-profile {
  display: flex;
  flex-direction: column;
  gap: var(--v-rhythm-6);

  padding: var(--v-rhythm-6);

  &__title {
    color: var(--gray900);
    @extend .h3;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__contact {
    display: flex;
    flex-direction: column;
  }

  &__contact-title {
    padding: var(--v-rhythm-1) 0;

    color: var(--gray500);
    @extend .caption-2;
  }

  &__contact-link {
    @include transition();

    &:active {
      opacity: var(--active-opacity);
    }
  }

  &__contact-link,
  &__contact-fild {
    display: block;
    width: max-content;
    max-width: 100%;
    padding: {
      top: var(--v-rhythm-2);
      right: var(--v-rhythm-2);
      bottom: var(--v-rhythm-2);
    }

    @extend .body-2;
    font-size: 16px;
    color: var(--gray900);
    font-style: normal;
  }

  &__btns {
    display: flex;
    flex-direction: column;
    gap: var(--v-rhythm-2);
  }

  &__btn {
    width: 100%;
  }

  @include phones {
    padding: var(--v-rhythm-6) 10px;

    gap: var(--v-rhythm-4);

    &__contacts {
      gap: var(--v-rhythm-3);
    }

    &__contact-title {
      padding: 2px 0;
    }

    &__contact-link,
    &__contact-fild {
      padding-top: var(--v-rhythm-1);
      padding-bottom: var(--v-rhythm-1);
    }
  }
}
</style>