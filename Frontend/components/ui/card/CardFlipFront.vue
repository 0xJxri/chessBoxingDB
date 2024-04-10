<template>
  <div class="flip-card-front bg-background border border-muted">
    <slot />
  </div>
</template>

<style scoped>
.flip-card-front {
  box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  width: 100%;
  padding: 1.5rem;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 0.5rem;
}

</style>
