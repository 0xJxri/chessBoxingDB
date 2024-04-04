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
        <Input id="search" type="text" placeholder="Search..." class="pl-10" />
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
        <TableRow v-for="item in data.payload" :key="item._id">
          <TableCell class="text-right">{{ item.fighterWhite }}</TableCell>
          <TableCell>{{ item.fighterBlack }}</TableCell>
          <TableCell>{{ item.result }}</TableCell>
          <TableCell>{{ item.event }}</TableCell>
          <TableCell>{{ item.data }}</TableCell>
          <TableCell>
            <ArrowRightToLine class="ml-auto"/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- grid layout -->
    <div v-show="isGridLayoutSelected" class="grid grid-cols-3 gap-4">
      <Card v-for="item in data.payload" :key="item._id" class="w-full bg-background">
        <CardHeader class="flex items-center">
          <p class="font-bold">{{ item.event }}</p>
          <p class="text-xs text-zinc-400 italic">{{ item.data }}</p>
        </CardHeader>
        <CardContent>
          <div class="relative w-full flex justify-center">
            <p
              class="absolute z-10 top-6 opacity-60 font-bold font-blaka text-7xl"
            >
              VS
            </p>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="relative rounded-t-lg overflow-clip rounded-es-3xl">
              <img
                class="border-t-8 border-white"
                :src="item.whitePfp"
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
              <img
                class="border-t-8 border-black"
                :src="item.blackPfp"
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
  </div>
</template>

<script setup>
import { Search, Rows3, Grid3X3, ArrowRightToLine } from "lucide-vue-next";

const isGridLayoutSelected = ref(false);

const data = {
  status: "success",
  message: "Results found",
  code: 200,
  payload: [
    {
      _id: "6606c6e0902c732ad64b1d09",
      fighterWhite: "Timur Iyubinskii",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_310321113920_001_010521232531_big.jpg",
      fighterBlack: "Gianpiero Sportelli",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_020521124048_001_020521130510_big.jpg",
      result: "W-L",
      event: "WCBO - World Chessboxing Championships 2019",
      data: "15 December 2019",
    },
    {
      _id: "6606c6e0902c732ad64b1c86",
      fighterWhite: "Sergei 'Giraffe' Fedorenko",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_211122230716_001_220923232241_big.jpg",
      fighterBlack: "Arnold 'Confectioner' Baklizky",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_251221230542_001_250222200817_mid.jpg",
      result: "L-W",
      event: "FSB - International Chessboxing Grand Prix 85kg",
      data: "08 April 2023",
    },
    {
      _id: "6606c6e0902c732ad64b1c54",
      fighterWhite: "Remmo Ali",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_021123232118_001_021123232125_big.jpg",
      fighterBlack: "Sehirli Berk",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_251222231302_001_281123235035_big.jpg",
      result: "L-W",
      event: "WCBO - World Chessboxing Championships 2023",
      data: "28 October 2023",
    },
    {
      _id: "6606c6e0902c732ad64b1cf6",
      fighterWhite: "Richard 'The Razor' Frazer",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_021123220807_001_021123220835_big.jpg",
      fighterBlack: "Dan 'The Taxman' Manfold",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_211122232102_002_021123221207_big.jpg",
      result: "L-W",
      event: "LCB - 36 Clash of Kings 2020",
      data: "26 July 2020",
    },
    {
      _id: "6606c6e0902c732ad64b1c98",
      fighterWhite: "Utkirbek Ergashev",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_211122230716_001_220923232241_big.jpg",
      fighterBlack: "Aleksandr 'E4' Smirnov",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_251221230542_001_250222200817_mid.jpg",
      result: "L-W",
      event: "FSB - International Chessboxing Grand Prix 75kg",
      data: "14 January 2023",
    },
    {
      _id: "6606c6e0902c732ad64b1c74",
      fighterWhite: "Alexander Kuchkin",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_021123232118_001_021123232125_big.jpg",
      fighterBlack: "Valery Volozhenin",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_251222231302_001_281123235035_big.jpg",
      result: "W-L",
      event: "FSB - International Chessboxing Grand Prix 85kg",
      data: "09 September 2023",
    },
    {
      _id: "6606c6e0902c732ad64b1d40",
      fighterWhite: "Lars 'Lazarus' Bjorknas",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_310321113920_001_010521232531_big.jpg",
      fighterBlack: "Cameron 'The Hurt Locker' Little",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_020521124048_001_020521130510_big.jpg",
      result: "L-W",
      event: "LCB - Seasons Beatings 2018",
      data: "08 December 2018",
    },
    {
      _id: "6606c6e0902c732ad64b1c35",
      fighterWhite: "Arminius Rolle",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_021123220807_001_021123220835_big.jpg",
      fighterBlack: "Stefano Tudoran",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_211122232102_002_021123221207_big.jpg",
      result: "L-W",
      event: "CBCB - Chessboxing Fight Night",
      data: "23 November 2023",
    },
    {
      _id: "6606c6e0902c732ad64b1c94",
      fighterWhite: "Dogukan 'Big Brother' Cinar",
      whitePfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_211122230716_001_220923232241_big.jpg",
      fighterBlack: "Hasan Celik",
      blackPfp:
        "https://www.chessboxing.info/images/uploads/fighters/f_251221230542_001_250222200817_mid.jpg",
      result: "W-L",
      event: "CBP - Intellectual Fight Club 3",
      data: "03 February 2023",
    },
  ],
};
</script>
