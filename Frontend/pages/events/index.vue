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
            <BreadcrumbPage> Events </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div class="relative w-full max-w-sm items-center flex-1">
        <form @submit.prevent="searchEvent(searchQuery.value)">
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
      </div>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Fights</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="item in events.payload" :key="item._id">
          <TableCell>
            <img
              v-if="item.eventImg"
              :src="item.eventImg + '_thumb.jpg'"
              height="50px"
            />
          </TableCell>
          <TableCell>{{ item.eventName }}</TableCell>
          <TableCell>{{ item.date }}</TableCell>
          <TableCell >
            <div class="flex items-center relative">
              <img
                v-if="item.countryCode"
                class="h-4 mr-2"
                :src="`https://flagcdn.com/${item.countryCode}.svg`"
                alt="flag"
              />
              <span class="relative">
                {{ item.venue }}
              </span>
            </div>
          </TableCell>
          <TableCell>{{ item.fights }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Pagination
      v-slot="{ page }"
      :total="events.paging.total * 10"
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
        <PaginationLast @click="selectedPage = events.paging.total - 1" />
      </PaginationList>
    </Pagination>
    <Toaster />
  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Search,
  Rows3,
  Grid3X3,
  ArrowRightToLine,
  CalendarClock,
} from "lucide-vue-next";

const { toast } = useToast()

const selectedPage = ref(1);
const searchQuery = ref();

const events = ref(
  (await useFetch("http://localhost:8000/events?page=0")).data
);

const fetchPage = async (page) => {
  try {
    const data = await $fetch(`http://localhost:8000/events?page=${page - 1}`);
    events.value = data;
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


const searchEvent = async (name) => {
  try {
    if (!name) {
      fetchPage(selectedPage.value);
      return;
    }
    const data = await $fetch(`http://localhost:8000/events?search=eventName:${name}`);
    events.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast({
        title: 'Sorry',
        description: 'We could not find any event with that name',
      });
  }
};

watch(selectedPage, fetchPage, { immediate: true });
</script>
