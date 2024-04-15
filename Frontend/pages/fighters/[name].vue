<template>
  <div class="container mx-auto">
    <Breadcrumb class="mb-12">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <nuxt-link to="/"> Home </nuxt-link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink as-child>
            <nuxt-link to="/fighters"> Fighters </nuxt-link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage> {{ route.params.name }} </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="flex flex-col items-center">
      <h1 class="font-bold text-3xl mb-1">
        {{ fighter.payload[0].name }}
      </h1>
      <div class="text-xl mb-2">
        <span class="text-green-600">
          {{ fighter.payload[0].results[0] }}
        </span>
        -
        <span class="text-red-600">
          {{ fighter.payload[0].results[1] }}
        </span>
        -
        <span class="text-blue-600">
          {{ fighter.payload[0].results[2] }}
        </span>
      </div>
      <div class="grid grid-cols-2 w-1/3 gap-4 mb-4">
        <img
          :src="
            fighter.payload[0].pfp_link
              ? fighter.payload[0].pfp_link + '_mid.jpg'
              : 'https://www.chessboxing.info/images/profile_unknown.jpg'
          "
          alt="pfp"
        />
        <div>
          <div class="grid grid-cols-2 h-full">
            <div class="grid h-full pr-2 font-semibold">
              <p class="flex items-center justify-end border-b-muted border-b">
                Age
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                Height
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                Weight
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                Reach
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                ELO
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                Country
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                Hometown
              </p>
              <p class="flex items-center justify-end border-b-muted border-b">
                Gym
              </p>
              <p class="flex items-center justify-end">Job</p>
            </div>
            <div class="grid grid-rows-9 h-full pl-2">
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].age }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].height }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].weight }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].reach }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].elo }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].country }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].hometown }}
              </p>
              <p class="flex items-center border-b-muted border-b">
                {{ fighter.payload[0].gym }}
              </p>
              <p class="flex items-center">{{ fighter.payload[0].job }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="w-1/2 text-center">
        {{ fighter.payload[0].description }}
      </p>

      <h2 class="font-bold text-2xl mt-8 mb-4">Fights</h2>

      <Table class="mb-16">
        <TableHeader>
          <TableRow>
            <TableHead>Opponent</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>View Fight </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="item in fighter.payload[0].fights" :key="item._id">
            <TableCell class="flex gap-2 items-center">
              <div
                class="w-4 h-4 rounded-full border"
                :class="{
                  'bg-white border-black': item.opponentChessColor === 'white',
                  'bg-black border-white': item.opponentChessColor === 'black',
                }"
              />
              <img
                class="w-8 h-8 rounded-full"
                :src="
                  item.opponentImg
                    ? item.opponentImg + '_thumb.jpg'
                    : 'https://www.chessboxing.info/images/avatar_unknown.jpg'
                "
              />
              <nuxt-link
                :to="`/fighters/${item.opponentName}`"
                class="text-right hover:underline hover:text-red-600"
              >
                <span>{{ item.opponentName }}</span>
              </nuxt-link>
            </TableCell>
            <TableCell>{{ item.eventName }}</TableCell>
            <TableCell>{{ item.date }}</TableCell>
            <TableCell>{{ item.result }}</TableCell>
            <TableCell>{{ item.description }}</TableCell>
            <TableCell>{{ item.round }}</TableCell>
            <TableCell class="flex justify-center"><Eye /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { Eye } from "lucide-vue-next";

const route = useRoute();
const { data: fighter } = await useFetch(
  "http://localhost:8000/detailedFighters/" + route.params.name
);
</script>
