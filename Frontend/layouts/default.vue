<template>
  <div>
    <header
      class="relative z-10 flex items-center justify-between bg-gradient-to-b from-primary"
    >
      <span class="flex-1" />
      <nuxt-link to="/" class="flex-1 flex justify-center">
        <img src="/chessboxing-logo.svg" alt="logo" class="h-20" />
      </nuxt-link>
      <NuxtLink to="/login" class="flex-1 flex justify-end">
        <Icon icon="material-symbols:login" class="mr-4 mb-2" width="2rem" />
      </NuxtLink>
    </header>
    <NavigationMenu class="mx-auto">
      <NavigationMenuList>
        <NuxtLink to="/events">
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            Events
          </NavigationMenuLink>
        </NuxtLink>
        <NuxtLink to="/results">
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            Results
          </NavigationMenuLink>
        </NuxtLink>
        <NuxtLink to="/fighters">
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            Fighters
          </NavigationMenuLink>
        </NuxtLink>
        <NuxtLink to="/compare">
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            Compare
          </NavigationMenuLink>
        </NuxtLink>
      </NavigationMenuList>
    </NavigationMenu>
    <slot />
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
</script>
