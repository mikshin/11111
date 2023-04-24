<template>
  <div class="app-phonebook">
    <table class="app-phonebook__table">
      <thead class="app-phonebook__thead">
        <tr class="app-phonebook__tr app-phonebook__tr--head">
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">ФИО</span>
            <SimpleInput
              class="app-phonebook__th-input"
              :type="'search'"
              placeholder="ФИО"
              v-model="filter.FULL_NAME"
              @changeValue="
                (e) =>
                  e
                    ? (this.filter.FULL_NAME = e)
                    : (this.filter.FULL_NAME = undefined)
              "
              @keydownEnter="filterUsersPhonebook"
            />
          </th>
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">Должность</span>
            <InputTemplate
              :input="{
                type: 'select',
                placeholder: 'Должность',
                name: 'UF_WORK_POSITION',
                multiple: true,
                isTight: true,
                noCheckboxes: true,
                selectValue: selectsData.workPosition,
              }"
              @onChange="selectChangeFilter"
            />
          </th>
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">Подразделение</span>
            <InputTemplate
              :input="{
                type: 'select',
                placeholder: 'Подразделение',
                name: 'UF_DEPARTMENT',
                multiple: true,
                isTight: true,
                noCheckboxes: true,
                selectValue: selectsData.department,
              }"
              @onChange="selectChangeFilter"
            />
          </th>
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">Компания</span>
            <InputTemplate
              :input="{
                type: 'select',
                placeholder: 'Компания',
                name: 'UF_1C_IDENTIFICATOR',
                multiple: true,
                isTight: true,
                noCheckboxes: true,
                selectValue: selectsData.company,
              }"
              @onChange="selectChangeFilter"
            />
          </th>
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">Телефон мобильный</span>
            <SimpleInput
              class="app-phonebook__th-input"
              :type="'search'"
              placeholder="Телефон мобильный"
              v-model="filter.WORK_PHONE"
              @changeValue="
                (e) =>
                  e
                    ? (this.filter.WORK_PHONE = e)
                    : (this.filter.WORK_PHONE = undefined)
              "
              @keydownEnter="filterUsersPhonebook"
            />
          </th>
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">Телефон внутренний</span>
            <SimpleInput
              class="app-phonebook__th-input"
              :type="'search'"
              placeholder="Телефон внутренний"
              v-model="filter.UF_PHONE_INNER"
              @changeValue="
                (e) =>
                  e
                    ? (this.filter.UF_PHONE_INNER = e)
                    : (this.filter.UF_PHONE_INNER = undefined)
              "
              @keydownEnter="filterUsersPhonebook"
            />
          </th>
          <th class="app-phonebook__th">
            <span class="app-phonebook__th-title">Почта</span>
            <SimpleInput
              class="app-phonebook__th-input"
              :type="'search'"
              placeholder="Почта"
              v-model="filter.EMAIL"
              @changeValue="
                (e) =>
                  e ? (this.filter.EMAIL = e) : (this.filter.EMAIL = undefined)
              "
              @keydownEnter="filterUsersPhonebook"
            />
          </th>
        </tr>
      </thead>
      <tbody class="app-phonebook__tbody" :class="{ loading: isLoading }">
        <tr
          class="app-phonebook__tr app-phonebook__tr--plug"
          v-if="usersPhonebook.length === 0"
        >
          <td class="app-phonebook__td" colspan="7">Ничего не найдено.</td>
        </tr>
        <tr
          class="app-phonebook__tr"
          v-else
          v-for="item in usersPhonebook"
          :key="item.ID"
          @click="$router.push(`/lk?=${item.ID}`)"
        >
          <td class="app-phonebook__td">
            <SimplePersonCard
              class="app-phonebook__person-card"
              :avatar="{
                src: item.USER_PHOTO,
                alt: item.FULL_NAME,
              }"
              :fullName="item.FULL_NAME || ''"
              :vacation="item.VACATION"
              :fired="item.FIRED"
            />
          </td>
          <td class="app-phonebook__td">
            <div class="app-phonebook__td-inner">
              {{ item.UF_WORK_POSITION ? item.UF_WORK_POSITION : "-" }}
            </div>
          </td>
          <td class="app-phonebook__td">
            <div class="app-phonebook__td-inner">
              {{ item.UF_DEPARTMENT ? item.UF_DEPARTMENT : "-" }}
            </div>
          </td>
          <td class="app-phonebook__td">
            <div class="app-phonebook__td-inner">
              {{ item.COMPANY ? item.COMPANY : "-" }}
            </div>
          </td>
          <td class="app-phonebook__td">
            <div class="app-phonebook__td-inner">
              {{ item.WORK_PHONE ? item.WORK_PHONE : "-" }}
            </div>
          </td>
          <td class="app-phonebook__td">
            <div class="app-phonebook__td-inner">
              {{ item.UF_PHONE_INNER }}
              <!-- {{ makeWorkPhone(item.WORK_PHONE, item.UF_PHONE_INNER) }} -->
            </div>
          </td>
          <td class="app-phonebook__td">
            <div class="app-phonebook__td-inner">
              {{ item.EMAIL ? item.EMAIL : "-" }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!isEnd" v-intersection="getUsersPhonebook"></div>
  </div>
</template>

<script>
import axios from "axios";
import SimpleInput from "@/components/UI/inputs/SimpleInput.vue";
import SimplePersonCard from "@/components/person-cards/SimplePersonCard.vue";
import InputTemplate from "@/components/UI/inputTemplate.vue";

export default {
  name: "AppPhonebook",

  components: {
    SimpleInput,
    SimplePersonCard,
    InputTemplate,
  },

  props: {},

  data() {
    return {
      usersPhonebook: [],

      isLoading: false,

      isEnd: true,

      filter: {
        FULL_NAME: undefined,
        EMAIL: undefined,
        WORK_PHONE: undefined,
        UF_PHONE_INNER: undefined,
        UF_1C_IDENTIFICATOR: undefined,
        UF_DEPARTMENT: undefined,
        UF_WORK_POSITION: undefined,
      },

      selectsData: {
        company: [],
        department: [],
        workPosition: [],
      },
    };
  },

  methods: {
    // makeWorkPhone(phoneNumber, code) {
    //   if (!phoneNumber) {
    //     return "-";
    //   }

    //   return code ? `${phoneNumber} (доб. ${code})` : phoneNumber;
    // },

    selectChangeFilter(e) {
      const obj = e.data.newValue;
      if (obj) {
        const filterName = e.data.input.name;
        this.filter[filterName] = [];
        const values = Object.values(obj);
        if (values.length === 0) {
          this.filter[filterName] = undefined;
        } else {
          values.forEach((value) => {
            this.filter[filterName].push(value.code);
          });
        }

        this.filterUsersPhonebook();
      }
    },

    async getUsersPhonebook(count = 10) {
      try {
        this.isEnd = true;
        this.isLoading = true;
        const response = await axios({
          method: "post",
          url: `/mobileapp/api/orgstructure/phonebook/`,
          data: {
            count: count,
            startFrom: this.usersPhonebook.length,
            filter: this.filter,
          },
        });
        this.usersPhonebook = [
          ...this.usersPhonebook,
          ...response.data.employee,
        ];
        this.isEnd = response.data.end;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async getPhoneBookFilter() {
      try {
        const response = await axios({
          method: "get",
          url: `/mobileapp/api/orgstructure/phonebookFilter/`,
        });
        this.modifResponseFilter(
          response.data.UF_1C_IDENTIFICATOR.value,
          this.selectsData.company
        );
        this.modifResponseFilter(
          response.data.UF_DEPARTMENT.value,
          this.selectsData.department
        );
        this.modifResponseFilter(
          response.data.UF_WORK_POSITION.value,
          this.selectsData.workPosition
        );
      } catch (error) {
        console.log(error);
      }
    },

    modifResponseFilter(obj, arr) {
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        arr.push({ label: obj[key], code: key });
      });
    },

    filterUsersPhonebook() {
      this.usersPhonebook = [];
      this.getUsersPhonebook(20);
    },
  },

  mounted() {
    this.getUsersPhonebook(20);
    this.getPhoneBookFilter();
  },
};
</script>

<style lang="scss" scoped>
.app-phonebook {
  width: 100%;
  max-height: calc(100vh - var(--headerHeight) - var(--v-rhythm-8));
  overflow: auto;

  &__table {
    width: 1376px;

    border: 1px solid var(--gray300);

    border-collapse: collapse;
    table-layout: fixed;
  }

  &__thead {
    border-bottom: 1px solid var(--gray300);
  }

  &__tr {
    background-color: var(--white900);

    &:not(:last-child) {
      border-bottom: 1px solid var(--gray300);
    }

    &:not(.app-phonebook__tr--plug):not(.app-phonebook__tr--head) {
      cursor: pointer;

      @include hover {
        background-color: var(--gray100);
      }
    }
  }

  &__th {
    padding: var(--v-rhythm-4);

    text-align: left;

    background-color: var(--gray100);
    border-right: 1px solid var(--gray300);

    &:last-child {
      border-right: unset;
    }
  }

  &__th-title {
    display: block;
    margin-bottom: var(--v-rhythm-4);

    @extend .subtitle-1;
    color: var(--gray700);
  }

  &__th-input {
    width: 100%;
  }

  &__td {
    padding: var(--v-rhythm-4);

    text-align: left;
    @extend .body-1;
    color: var(--gray900);
  }

  &__td-inner {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__person-card {
    width: 100%;
  }

  @include phones {
    margin: 0 var(--negativeMainPadding);
    width: calc(100% + 2 * var(--mainPadding));

    &__table {
      width: 100%;
      border-right: unset;
      border-left: unset;
    }

    &__th {
      border-right: unset;
    }

    &__tr {
      display: flex;
      flex-direction: column;
    }

    &__tbody {
      .app-phonebook {
        &__tr {
          gap: var(--v-rhythm-1);
        }

        &__td {
        }
      }
    }
  }
}
</style>
