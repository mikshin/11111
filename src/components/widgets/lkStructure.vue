<template>
  <div class="widget_container" v-if="!isEmpty">
    <div class="widget_headline widget_headline--dark">
      <h3>{{ name }}</h3>
    </div>
    <div class="widget_content" v-bind:class="{ loading: isLoading }">
      <div class="structure__list">
        <a
          tag="li"
          :href="'lk?=' + item.ID"
          class="structure__item"
          v-for="(item, i) in subordinates"
          :key="i"
        >
          <SimplePicture
            class="structure__item-image"
            :src="item.USER_PHOTO"
            :alt="item.FULL_NAME"
          />

          <UserIcons
            class="structure__item-vacation-label"
            v-if="item.VACATION"
            :iconName="'vacation-label'"
          />

          <ProfileName
            :name="item.FULL_NAME"
            :company="item.UF_WORK_POSITION"
            :birthday="item.PERSONAL_BIRTHDAY"
          />
          <!-- {{ item }} -->
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import ProfileName from "../person-cards/ProfileName.vue";
import SimplePicture from "../UI/SimplePicture.vue";
export default {
  props: {
    name: String,
    ID: null,
  },
  components: { ProfileName, SimplePicture },
  data() {
    return {
      isLoading: true,
      isEmpty: false,
      subordinates: [],
    };
  },
  mounted() {
    axios
      .get("mobileapp/api/user/getSubordinate?userId=" + this.ID)
      .then((response) => {
        this.isLoading = false;
        this.subordinates = response.data;
        for (let key in this.subordinates) {
          this.subordinates = this.subordinates[key];
        }
        if (this.subordinates.error) {
          this.isEmpty = true;
        }
      })
      .catch(() => {
        this.isEmpty = true;
      });
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/lkWidgets";

.widget_content {
  padding-right: 0;
}
.structure {
  &__item {
    position: relative;

    display: flex;
    min-height: 128px;
    width: 100%;
    padding: var(--v-rhythm-2) 0;
    border-bottom: 2px solid var(--gray200);
    cursor: pointer;
    &:last-child {
      border-bottom: 0;
    }
  }
  &__item-image {
    width: 112px;
    height: 112px;
    margin-right: 24px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__item-vacation-label {
    position: absolute;
    top: 16px;
    left: 8px;

    width: 24px;
    height: 24px;
  }

  &__list {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 16px;
  }
}
</style>
