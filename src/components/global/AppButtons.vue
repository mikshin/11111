<script>
export default {
  name: "AppButtons",
};
</script>

// Стили глобальные, поэтому scoped ставить не надо.
<style lang="scss">
.app-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: var(--v-rhythm-3) var(--v-rhythm-8);

  @extend .button;
  text-align: center;

  border-radius: 72px;

  cursor: pointer;
  @include transition();

  svg {
    width: 20px;
    height: 20px;

    @include transition();

    &:first-child {
      margin-left: -12px;
    }

    &:last-child {
      margin-right: -12px;
    }
  }

  &:active {
    &:not(.app-button--disabled):not(&:disabled) {
      opacity: var(--active-opacity);
    }
  }

  &--disabled,
  &:disabled {
    cursor: not-allowed;
  }

  @include phones {
    padding: var(--v-rhythm-2) var(--v-rhythm-6);
  }
}

.primary-btn {
  @extend .app-button;
  --color-btn: var(--white900);

  color: var(--color-btn);

  background-color: var(--red900);

  svg {
    fill: var(--color-btn);
  }

  &--invert {
    background-color: var(--red700);
  }

  @include hover {
    &:not(.primary-btn--disabled):not(&:disabled) {
      background-color: var(--red700);

      &.primary-btn--invert {
        background-color: #fe828b;
      }
    }
  }

  &--disabled,
  &:disabled {
    @extend .app-button--disabled;

    background-color: var(--gray500);
  }
}

.secondary-btn {
  @extend .app-button;
  --color-btn: var(--red900);

  color: var(--color-btn);

  background-color: var(--white900);
  box-shadow: 0 0 0 2px var(--red900) inset;

  svg {
    fill: var(--color-btn);
  }

  &--invert {
    --color-btn: var(--red500);

    background-color: unset;

    box-shadow: 0 0 0 2px var(--red500) inset;
  }

  @include hover {
    &:not(.secondary-btn--disabled):not(&:disabled) {
      --color-btn: var(--white900);

      background-color: var(--red700);

      box-shadow: 0 0 0 2px var(--red700) inset;

      &.secondary-btn--invert {
        background-color: #fe828b;

        box-shadow: 0 0 0 2px #fe828b inset;
      }
    }
  }

  &--disabled,
  &:disabled {
    @extend .app-button--disabled;
    --color-btn: var(--gray500);

    box-shadow: 0 0 0 2px var(--gray500) inset;
  }
}

.text-btn {
  @extend .app-button;
  --color-btn: var(--red900);

  padding: var(--v-rhythm-1) var(--v-rhythm-2);

  color: var(--color-btn);

  svg {
    fill: var(--color-btn);

    &:first-child {
      margin-left: unset;
    }

    &:last-child {
      margin-right: unset;
    }
  }

  &--invert {
    --color-btn: var(--red500);
  }

  @include hover {
    &:not(.text-btn--disabled):not(&:disabled) {
      --color-btn: var(--red700);

      &.text-btn--invert {
        --color-btn: #fe828b;
      }
    }
  }

  &--disabled,
  &:disabled {
    @extend .app-button--disabled;
    --color-btn: var(--gray500);
  }
}
</style>