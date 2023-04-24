<template>
  <div class="app-profile">
    <SimplePicture
      class="app-profile__photo"
      :src="simplePicture.src"
      :alt="simplePicture.alt"
    />
    <ProfileName
      class="app-profile__profile-name"
      :id="profileName.id"
      :isSmall="true"
      :label="profileName.label"
      :name="profileName.name"
      :company="profileName.company"
      :division="profileName.division"
      :profession="profileName.profession"
      :birthday="profileName.birthday"
    />
  </div>
</template>

<script>
import SimplePicture from "@/components/UI/SimplePicture.vue";
import ProfileName from "@/components/person-cards/ProfileName.vue";

export default {
  name: "AppProfile",

  components: {
    SimplePicture,
    ProfileName,
  },

  props: {
    simplePicture: {
      type: Object,
      required: true,
    },

    profileName: {
      type: Object,
      required: true,
    },
  },

  computed: {},
};
</script>

<style scoped lang="scss">
.app-profile {
  display: flex;
  gap: var(--v-rhythm-6);

  &__photo {
    width: 112px;
    height: 112px;
  }

  &__profile-name {
  }

  @include phones {
    gap: var(--v-rhythm-3);

    &__photo {
      width: 64px;
      height: 64px;
    }
  }
}
</style>
