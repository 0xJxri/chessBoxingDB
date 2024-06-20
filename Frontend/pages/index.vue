<script setup lang="ts">
const { onLoop, pause } = useRenderLoop();
const { hasFinishLoading } = await useProgress();
const ring: ShallowRef<TresInstance | null> = shallowRef(null);

onLoop(({ delta, elapsed }) => {
  if (ring.value) {
    ring.value.value.rotation.y = elapsed * 0.2;
  }
});
</script>
<template>
  <div
    v-if="!hasFinishLoading"
    class="z-10 absolute w-full mt-48 flex justify-center align-center"
  >
    <img src="/loading.gif" class="w-1/6" />
  </div>

  <!-- <div class="absolute flex justify-between w-full h-[calc(100vh-80px)]">
    <div class="relative overflow-hidden h-full">
      <div
        class="absolute inset-0 bg-gradient-to-l from-[#0f0c0b] via-transparent to-transparent"
      ></div>
      <img class="h-full" src="/left-opponent.png" alt="Left Opponent" />
    </div>
    <div class="relative overflow-hidden h-full">
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#0f0c0b] via-transparent to-transparent"
      ></div>
      <img class="h-full" src="/right-opponent.png" alt="Right Opponent" />
    </div>
  </div> -->

  <TresCanvas shadows alpha window-size preset="realistic">
    <TresPerspectiveCamera :position="[60, 48, 60]" />
    <CameraControls />
    <Suspense>
      <GLTFModel ref="ring" path="https://media.githubusercontent.com/media/MrTartuf0/chessBoxingDB/main/Frontend/public/chessboxing.glb" draco />
    </Suspense>
    <TresDirectionalLight :position="[0, 10, 0]" :intensity="0.6" cast-shadow />
  </TresCanvas>
</template>
