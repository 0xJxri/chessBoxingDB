<template>
  <div class="flip-card-back border-2 border-primary">
    <slot />
  </div>
</template>


<style scoped>
.flip-card-back {
  box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 0.5rem;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
