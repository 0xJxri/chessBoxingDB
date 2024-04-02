<script setup lang="ts">
const { onLoop, pause } = useRenderLoop()
const ring: ShallowRef<TresInstance | null> = shallowRef(null)

onLoop(({ delta, elapsed }) => {
  if(ring.value) {
    ring.value.value.rotation.y = elapsed * 0.2  
  }
})
</script>
<template>
  <TresCanvas shadows alpha window-size preset="realistic">
    <TresPerspectiveCamera :position="[64,32,64]" />
    <CameraControls />
    <Suspense>
      <GLTFModel ref="ring" path="chessboxing.glb" draco />
    </Suspense>
    <TresDirectionalLight :position="[0,10,0]" :intensity="0.6" cast-shadow />

  </TresCanvas>
</template>
