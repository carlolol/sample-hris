<template>
  <Menu v-slot="{ open }" as="div" class="relative">
    <slot name="activator">
      <MenuButton
        as="button"
        ref="menuButtonRef"
        class="default-menu-btn"
        @mouseenter="menuButtonEvents('enter', open)"
        @mouseleave="menuButtonEvents('leave', open)"
      >
        <slot name="activator-content">
          {{ label }}
          <font-awesome-icon :icon="open ? faCaretUp : faCaretDown" />
        </slot>
      </MenuButton>
    </slot>
    <MenuItems
      v-show="showMenu(open)"
      as="ul"
      class="menu-items__container"
      :class="menuItemsCss"
      :static="showOnHover"
      :style="{ minWidth }"
      @mouseenter="menuButtonEvents('enter', open)"
      @mouseleave="menuButtonEvents('leave', open)"
    >
      <slot name="content">
        <MenuItem
          v-for="(item, index) in items"
          v-slot="{ close }"
          :key="index"
          :disabled="item.disabled"
          :class="{
            'hover:cursor-pointer': !item.disabled,
            'hover:cursor-default': item.disabled,
            'opacity-30': item.disabled,
            hidden: item?.hidden?.(),
          }"
        >
          <hr v-if="item.type === 'divider'" class="-mx-2 border-border-base-color my-2" />
          <li
            :test-ref="`menu-item-${index}`"
            v-else-if="item.type === 'no-action'"
            class="menu-item__no-action"
            :class="item.class"
          >
            {{ item.text }}
          </li>
          <li
            v-else
            :test-ref="`menu-item-${index}`"
            class="menu-item"
            :class="item.class"
            @click="
              $emit('itemClick', item.actionName);
              close();
            "
          >
            {{ item.text }}
          </li>
        </MenuItem>
      </slot>
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';

const emit = defineEmits(['itemClick', 'closeMenu', 'menuOpen']);
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  items: {
    type: Array<{
      text?: string;
      disabled?: boolean;
      actionName?: string;
      class?: string;
      hidden?: () => boolean;
      type?: string;
    }>,
    default: () => [],
  },
  showOnHover: {
    type: Boolean,
    default: false,
  },
  menuSize: {
    type: String,
    default: 'small',
  },
  minWidth: {
    type: String,
    default: undefined,
  },
});
const showMenu = (open: boolean) => {
  emit('menuOpen', open);
  return open;
};

const menuItemsCss = computed(() => {
  if (props.menuSize === 'large') {
    return 'menu-items__large';
  }
  return 'menu-items';
});

const menuButtonRef = ref<any>();

const menuButtonEvents = async (event: 'enter' | 'leave' | 'click', open: boolean) => {
  if (!props.showOnHover) return;

  switch (event) {
    case 'enter': {
      if (open) break;

      menuButtonRef.value.el.click();
      // blur to remove focus ring
      await nextTick();
      menuButtonRef.value.el.blur();
      break;
    }
    case 'leave': {
      if (!open) break;

      menuButtonRef.value.el.click();
      // blur to remove focus ring
      await nextTick();
      menuButtonRef.value.el.blur();
      break;
    }
    default:
      break;
  }
};
</script>

<style scoped>
.menu-items {
  @apply absolute right-0 bg-white p-2 rounded-lg w-[165px] z-20 focus:outline-none shadow-sm;
}
.menu-items__large {
  @apply absolute right-0 pt-[0.94rem] px-[0.5rem] bg-white rounded-lg w-[23.4em] max-h-[37.25rem] overflow-y-auto z-20 focus:outline-none shadow-sm;
}
.menu-item__no-action {
  @apply p-2 cursor-default break-words;
}
.menu-item {
  @apply p-2 hover:bg-[#4d4d4d] rounded-[0.25rem];
}
.menu-items__container {
  @apply bg-[#3d3d3d];
}
</style>
