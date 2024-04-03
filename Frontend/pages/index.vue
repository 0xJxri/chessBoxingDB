<script setup lang="ts">
const { onLoop, pause } = useRenderLoop()
const { hasFinishLoading } = await useProgress()
const ring: ShallowRef<TresInstance | null> = shallowRef(null)

onLoop(({ delta, elapsed }) => {
  if(ring.value) {
    ring.value.value.rotation.y = elapsed * 0.2  
  }
})
</script>
<template>
  <div v-if="!hasFinishLoading" class="w-full mt-48 flex justify-center align-center">
    <img src="/loading.gif" class="w-1/6"/>
  </div>
  <TresCanvas shadows alpha window-size preset="realistic">
    <TresPerspectiveCamera :position="[60,48,60]" />
    <CameraControls />
    <Suspense>
      <GLTFModel ref="ring" path="chessboxing.glb" draco />
    </Suspense>
    <TresDirectionalLight :position="[0,10,0]" :intensity="0.6" cast-shadow />

  </TresCanvas>
</template>
