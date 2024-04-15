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

    <Dialog>
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
            <DialogTrigger as-child>
              <TableCell class="cursor-pointer" @click="modalPayload = item">
                <img
                  v-if="item.eventImg"
                  :src="item.eventImg + '_thumb.jpg'"
                  height="50px"
                />
              </TableCell>
            </DialogTrigger>
            <DialogTrigger as-child>
              <TableCell
                @click="modalPayload = item"
                class="cursor-pointer hover:underline hover:text-red-600"
                >{{ item.eventName }}</TableCell
              >
            </DialogTrigger>
            <TableCell>{{ item.date }}</TableCell>
            <TableCell>
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
      <DialogContent
        class="sm:max-w-[825px] grid-rows-[auto_minmax(0,1fr)_auto] p-6 max-h-[85dvh]"
      >
        <DialogHeader class="items-center">
          <DialogTitle>{{ modalPayload.eventName }}</DialogTitle>
          <DialogDescription class="flex gap-2 items-center">
            {{ modalPayload.date }} | {{ modalPayload.venue }}
            <img
              v-if="modalPayload.countryCode"
              class="h-4"
              :src="`https://flagcdn.com/${modalPayload.countryCode}.svg`"
              alt="flag"
            />
          </DialogDescription>
        </DialogHeader>

        <Table>
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
              <TableHead>Result Description </TableHead>
              <TableHead class="text-right">View Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in modalPayload.eventData" :key="item._id">
              <TableCell>
                <div class="flex justify-end items-center gap-3">
                  <nuxt-link
                    :to="`/fighters/${item.fighterWhite}`"
                    class="text-right hover:underline hover:text-red-600"
                  >
                    <span>{{ item.fighterWhite }}</span>
                  </nuxt-link>
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
                  <nuxt-link
                    :to="`/fighters/${item.fighterBlack}`"
                    class="hover:underline hover:text-red-600"
                  >
                    <span>
                      {{ item.fighterBlack }}
                    </span>
                  </nuxt-link>
                </div>
              </TableCell>
              <TableCell>{{ item.result }}</TableCell>
              <TableCell>{{ item.resultDescription }}</TableCell>
              <TableCell>
                <Eye class="ml-auto" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>

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
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Search,
  Rows3,
  Grid3X3,
  Eye,
  ArrowRightToLine,
  CalendarClock,
} from "lucide-vue-next";

const { toast } = useToast();

const selectedPage = ref(1);
const searchQuery = ref();
const modalPayload = ref();

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
    const data = await $fetch(
      `http://localhost:8000/events?search=eventName:${name}`
    );
    events.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast({
      title: "Sorry",
      description: "We could not find any event with that name",
    });
  }
};

watch(selectedPage, fetchPage, { immediate: true });
</script>
