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
            <BreadcrumbPage> Results </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div class="relative w-full max-w-sm items-center flex-1">
        <form @submit.prevent="console.log(searchQuery.value)">
          <input
            class="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ref="searchQuery"
            id="search"
            type="text"
            placeholder="Search event name..."
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
          <TableHead class="flex items-center justify-end gap-2">
            <div class="w-4 h-4 bg-white rounded-full"></div>
            <span>Fighter White</span>
          </TableHead>
          <TableHead class="px-0"> VS </TableHead>
          <TableHead>
            <div class="flex items-center justify-start gap-2">
              <span>Fighter Black</span>
              <div
                class="w-4 h-4 bg-black border-white border rounded-full"
              ></div>
            </div>
          </TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Date </TableHead>
          <TableHead class="text-right">Go to result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in results.payload" :key="item._id">
          <TableCell>
            <div class="flex justify-end items-center gap-3">
              <span class="text-right">{{ item.fighterWhite }}</span>
              <img
                class="w-7 h-7 rounded-full"
                :src="
                  item.urlImgWhite
                    ? item.urlImgWhite + '_thumb.jpg'
                    : 'https://www.chessboxing.info/images/avatar_unknown.jpg'
                "
              />
            </div>
          </TableCell>
          <TableCell class="px-0"> vs </TableCell>
          <TableCell>
            <div class="flex justify-start items-center gap-3">
              <img
                class="w-7 h-7 rounded-full"
                :src="
                  item.urlImgBlack
                    ? item.urlImgBlack + '_thumb.jpg'
                    : 'https://www.chessboxing.info/images/avatar_unknown.jpg'
                "
              />
              <span>{{ item.fighterBlack }}</span>
            </div>
          </TableCell>
          <TableCell>{{ item.result }}</TableCell>
          <TableCell>{{ item.event }}</TableCell>
          <TableCell>{{ item.data }}</TableCell>
          <TableCell>
            <ArrowRightToLine class="ml-auto" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- grid layout -->
    <div v-show="isGridLayoutSelected" class="grid grid-cols-3 gap-4">
      <Card
        v-for="item in results.payload"
        :key="item._id"
        class="w-full bg-background flex flex-col justify-between"
      >
        <CardHeader class="flex items-center">
          <p class="font-bold">{{ item.event }}</p>
          <p class="text-xs text-zinc-400 italic">{{ item.data }}</p>
        </CardHeader>
        <CardContent>
          <div class="relative w-full flex justify-center">
            <p
              class="absolute z-10 top-16 opacity-100 text-black font-bold font-blaka text-6xl"
              style="
                text-shadow: -1px -1px 0 white, 1px -1px 0 white,
                  -1px 1px 0 white, 1px 1px 0 white;
              "
            >
              VS
            </p>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="relative rounded-t-lg overflow-clip rounded-es-3xl">
              <div class="w-full h-2.5 bg-white border-[#909092] border rounded-t-lg " />
              <img
                :src="
                  item.urlImgWhite
                    ? item.urlImgWhite + '_big.jpg'
                    : 'https://www.chessboxing.info/images/profile_unknown.jpg'
                "
                alt="left-fighter"
              />
              <p
                :class="{
                  'from-red-700': item.result === 'L-W',
                  'from-green-700': item.result === 'W-L',
                }"
                class="bg-gradient-to-t to-transparent absolute bottom-0 text-left font-bold text-xl w-full pb-2 pl-2 pt-8"
              >
                {{ item.fighterWhite }}
              </p>
            </div>
            <div class="relative rounded-t-lg overflow-clip rounded-ee-3xl">
              <div class="w-full h-2.5 bg-black border-[#505052] border rounded-t-lg " />
              <img
                :src="
                  item.urlImgBlack
                    ? item.urlImgBlack + '_big.jpg'
                    : 'https://www.chessboxing.info/images/profile_unknown.jpg'
                "
                alt="left-fighter"
              />
              <p
                :class="{
                  'from-red-700': item.result === 'W-L',
                  'from-green-700': item.result === 'L-W',
                }"
                class="bg-gradient-to-t to-transparent absolute bottom-0 text-right font-bold text-xl w-full pb-2 pr-2 pt-8"
              >
                {{ item.fighterBlack }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Pagination
      v-slot="{ page }"
      :total="(results.paging.total) * 10"
      :sibling-count="1"
      show-edges
      :default-page="1"
    >
      <PaginationList
        v-slot="{ items }"
        class="flex justify-center items-center gap-1 my-8"
      >
        <PaginationFirst
          @click="
            selectedPage = 1;
          "
        />
        <PaginationPrev
          @click="
            selectedPage--;
          "
        />

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
              @click="
                selectedPage = item.value
              "
            >
              <!-- item.value-1 -->
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext
          @click="
            selectedPage++
          "
        />
        <PaginationLast
          @click="
            selectedPage = results.paging.total - 1
          "
        />
      </PaginationList>
    </Pagination>
  </div>
</template>

<script setup>
import {
  Search,
  Rows3,
  Grid3X3,
  ArrowRightToLine,
  CalendarClock,
} from "lucide-vue-next";

const isGridLayoutSelected = ref(false);
const selectedPage = ref(1);
const searchQuery = ref();

const results = ref((await useFetch("http://localhost:8000/results?page=0")).data);

const fetchPage = async (page) => {
  try {
    const data = await $fetch(`http://localhost:8000/results?page=${page-1}`);
    results.value = data;
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchSearchQuery = async (query) => {
  try {
    const data = await $fetch(`http://localhost:8000/results?=${selectedPage.value}`);
    results.value = data;
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


watch(selectedPage, fetchPage, { immediate: true });
</script>
