<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-8 mt-4">
      <Breadcrumb class="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <nuxt-link to="/"> Home </nuxt-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <nuxt-link to="/"> Results </nuxt-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {{ fightDetails.payload[0].fighterBlack.Name }} VS
              {{ fightDetails.payload[0].fighterWhite.Name }}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div
      class="mx-auto flex flex-col items-center w-full max-w-lg font-bold text-3xl mb-6"
    >
      <span class="z-10 w-full relative flex items-center gap-3">
        <span>
          {{ fightDetails.payload[0].fighterBlack.Name }}
        </span>
        <img
          v-if="fightDetails.payload[0].nationalityBlack"
          class="h-5"
          :src="`https://flagcdn.com/${fightDetails.payload[0].nationalityBlack}.svg`"
          alt="flag"
        />
      </span>
      <p
        class="text-center text-black font-bold font-blaka text-6xl"
        style="
          text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white,
            1px 1px 0 white;
        "
      >
        VS
      </p>
      <span class="w-full flex justify-end items-center gap-3">
        <img
          v-if="fightDetails.payload[0].nationalityWhite"
          class="h-5"
          :src="`https://flagcdn.com/${fightDetails.payload[0].nationalityWhite}.svg`"
          alt="flag"
        />
        <span>
          {{ fightDetails.payload[0].fighterWhite.Name }}
        </span>
      </span>
    </div>

    <Carousel v-if="fightDetails.payload[0].gallery" class="relative w-full max-w-xl mx-auto mb-2">
      <CarouselContent>
        <CarouselItem
          v-for="(item, index) in fightDetails.payload[0].gallery"
          :key="index"
        >
          <div class="p-1">
            <Card>
              <CardContent class="flex items-center justify-center p-6">
                <img :src="item + '_big.jpg'" alt="gallery" />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    <h3 class="text-center text-zinc-300">
      <span>
        {{ fightDetails.payload[0].eventName }}
      </span>
      -
      <span class="italic">
        {{ fightDetails.payload[0].date }}
      </span>
      -
      <span>
        {{ fightDetails.payload[0].venue }}
      </span>
    </h3>

  </div>
</template>

<script setup>
const route = useRoute();

const { data: fightDetails } = await useFetch(
  `http://localhost:8000/fightdetails?date=${route.params.date}&eventName=${route.query.eventName}&fighterWhite=${route.query.fighterWhite}&fighterBlack=${route.query.fighterBlack}`
);
</script>
