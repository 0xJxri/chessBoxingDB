<template>
  <div class="flip-card">
    <div class="flip-card-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  background-color: transparent;
  min-height: 400px;
  width: 100%;
  perspective: 1000px;
  font-family: sans-serif;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}
</style>
