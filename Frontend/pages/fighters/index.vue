<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-4 mt-4">
      <Breadcrumb class="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <nuxt-link to="/"> Home </nuxt-link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage> Fighters </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div class="relative w-full max-w-sm items-center flex-1">
        <form @submit.prevent="searchFighter(searchQuery.value)">
          <input
            class="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ref="searchQuery"
            id="search"
            type="text"
            placeholder="Search fighter name..."
          />
        </form>
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
        >
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>

      <div class="flex flex-1 justify-end">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>ord by date ...</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>ord by </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <div
          class="flex h-10 items-center gap-x-1 rounded-md border bg-background p-1"
        >
          <button
            @click="isGridLayoutSelected = false"
            class="flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-sm font-medium outline-none"
            :class="{
              'bg-accent text-accent-foreground': !isGridLayoutSelected,
            }"
          >
            <Rows3 />
          </button>
          <button
            @click="isGridLayoutSelected = true"
            class="flex cursor-pointer select-none items-center rounded-sm px-2 py-1 text-sm font-medium outline-none"
            :class="{
              'bg-accent text-accent-foreground': isGridLayoutSelected,
            }"
          >
            <Grid3X3 />
          </button>
        </div>
      </div>
    </div>

    <!-- list layout -->
    <Table v-show="!isGridLayoutSelected">
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Name</TableHead>
          <TableHead>Nationality</TableHead>
          <TableHead>Fights </TableHead>
          <TableHead>Record </TableHead>
          <TableHead>ELO </TableHead>
          <TableHead>Height </TableHead>
          <TableHead>Weight </TableHead>
          <TableHead>Active </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in fighters.payload" :key="item._id">
          <TableCell class="flex items-center justify-end">
            <img
              class="w-8 h-8 rounded-full"
              :src="
                item.urlImg
                  ? item.urlImg + '_thumb.jpg'
                  : 'https://www.chessboxing.info/images/avatar_unknown.jpg'
              "
            />
          </TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell class="flex items-center">
            <img
              v-if="item.countryCode"
              class="h-4 mr-2"
              :src="`https://flagcdn.com/${item.countryCode}.svg`"
              alt="flag"
            />
            {{ item.nationality }}
          </TableCell>
          <TableCell>{{ item.fights }}</TableCell>
          <TableCell>
            <span class="text-green-300">{{ item.record.split("-")[0] }}</span>
            <span>-</span>
            <span class="text-red-300">{{ item.record.split("-")[1] }}</span>
            <span>-</span>
            <span class="text-blue-300">{{ item.record.split("-")[2] }}</span>
          </TableCell>
          <TableCell>{{ item.elo }}</TableCell>
          <TableCell>{{ item.height }}</TableCell>
          <TableCell>{{ item.weight }}</TableCell>
          <TableCell>{{ item.activeYears }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- grid layout -->
    <div v-show="isGridLayoutSelected" class="grid grid-cols-5 gap-4">
      <CardFlip
        v-for="item in fighters.payload"
        :key="item._id"
        class="w-full bg-background flex flex-col justify-between"
      >
        <CardFlipFront>
          <div class="relative">
            <img
              class="rounded-md"
              :src="
                item.urlImg
                  ? item.urlImg + '_big.jpg'
                  : 'https://www.chessboxing.info/images/profile_unknown.jpg'
              "
              alt="fighter"
            />
            <p
              class="bg-gradient-to-t from-black via-black to-transparent absolute -bottom-4 pt-4 text-center font-bold text-xl w-full"
            >
              {{ item.name }}
            </p>
          </div>
        </CardFlipFront>
        <CardFlipBack class="flex flex-col items-center justify-between">
          <img
            v-if="item.countryCode"
            class="absolute opacity-15 px-6"
            :src="`https://flagcdn.com/${item.countryCode}.svg`"
            alt="flag"
          />
          <div class="grid grid-cols-2 w-full z-10 pt-8">
            <div
              class="flex flex-col items-end pr-2 border-r border-r-muted gap-1 font-bold text-right"
            >
              <p>Nationality</p>
              <p>Fights</p>
              <p>Record</p>
              <p>ELO</p>
              <p>Height</p>
              <p>Weight</p>
              <p>Active years</p>
            </div>
            <div
              class="flex flex-col items-start pl-2 border-l border-l-muted gap-1"
            >
              <span class="flex-1">{{ item.nationality }}</span>
              <span class="flex-1">{{ item.fights }}</span>
              <span class="flex-1">
                <span class="text-green-500">{{
                  item.record.split("-")[0]
                }}</span>
                <span>-</span>
                <span class="text-red-500">{{
                  item.record.split("-")[1]
                }}</span>
                <span>-</span>
                <span class="text-blue-500">{{
                  item.record.split("-")[2]
                }}</span>
              </span>
              <span class="flex-1">{{ item.elo }}</span>
              <span class="flex-1">{{ item.height }}</span>
              <span class="flex-1">{{ item.weight }}</span>
              <span class="flex-1">{{ item.activeYears }}</span>
            </div>
          </div>

          <nuxt-link :to="`/fighters/${item.name}`">
            <Button class="mt-8">See more ...</Button>
          </nuxt-link>
        </CardFlipBack>
      </CardFlip>
    </div>

    <Pagination
      v-slot="{ page }"
      :total="fighters.paging.total * 10"
      :sibling-count="1"
      show-edges
      :default-page="1"
    >
      <PaginationList
        v-slot="{ items }"
        class="flex justify-center items-center gap-1 my-8"
      >
        <PaginationFirst @click="selectedPage = 1" />
        <PaginationPrev @click="selectedPage--" />

        <template v-for="(item, index) in items">
          <PaginationListItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            as-child
          >
            <Button
              class="w-10 h-10 p-0"
              :variant="item.value === page ? 'default' : 'outline'"
              @click="selectedPage = item.value"
            >
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext @click="selectedPage++" />
        <PaginationLast @click="selectedPage = fighters.paging.total - 1" />
      </PaginationList>
    </Pagination>
    <Toaster />
  </div>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Search,
  Rows3,
  Grid3X3,
  ArrowRightToLine,
  CalendarClock,
} from "lucide-vue-next";

const { toast } = useToast();

const isGridLayoutSelected = ref(true);
const selectedPage = ref(1);
const searchQuery = ref();

const fighters = ref(
  (await useFetch("http://localhost:8000/fighterslist?page=0")).data
);

const fetchPage = async (page) => {
  try {
    const data = await $fetch(
      `http://localhost:8000/fighterslist?page=${page - 1}`
    );
    fighters.value = data;
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const searchFighter = async (name) => {
  try {
    if (!name) {
      fetchPage(selectedPage.value);
      return;
    }
    const data = await $fetch(
      `http://localhost:8000/fighterslist?search=name:${name}`
    );
    fighters.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast({
      title: "Sorry",
      description: "We could not find any fighter with that name",
    });
  }
};

watch(selectedPage, fetchPage, { immediate: true });
</script>
