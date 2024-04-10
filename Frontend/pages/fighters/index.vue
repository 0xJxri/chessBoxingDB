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
        <form @submit.prevent="console.log(searchQuery.value)">
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

    {{ fighters }}

    <!-- list layout -->
    <Table v-show="!isGridLayoutSelected">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
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
          <TableCell>{{  }}</TableCell>
          <TableCell>{{ item.name }}</TableCell>
          <TableCell>{{ item.nationality }}</TableCell>
          <TableCell>{{ item.fights }}</TableCell>
          <TableCell>{{ item.record }}</TableCell>
          <TableCell>{{ item.elo }}</TableCell>
          <TableCell>{{ item.height }}</TableCell>
          <TableCell>{{ item.weight }}</TableCell>
          <TableCell>{{ item.activeYears }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>


    <Pagination
      v-slot="{ page }"
      :total="(fighters.paging.total) * 10"
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
            selectedPage = fighters.paging.total - 1
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

watch(selectedPage, fetchPage, { immediate: true });
</script>
