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
        <nuxt-link
          :to="'/fighters/' + fightDetails.payload[0].fighterBlack.Name"
        >
          <span class="underline hover:text-primary">
            {{ fightDetails.payload[0].fighterBlack.Name }}
          </span>
        </nuxt-link>
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
        <nuxt-link
          :to="'/fighters/' + fightDetails.payload[0].fighterWhite.Name"
        >
          <span class="underline hover:text-primary">
            {{ fightDetails.payload[0].fighterWhite.Name }}
          </span>
        </nuxt-link>
      </span>
    </div>

    <div class="flex justify-between">
      <img
        class=""
        :src="(fightDetails.payload[0].blackPfp) ? fightDetails.payload[0].blackPfp + '_mid.jpg' : 'https://www.chessboxing.info/images/profile_unknown.jpg'"
        alt="black pfp"
      />
      <Carousel
        v-if="fightDetails.payload[0].gallery"
        class="relative w-full max-w-xl mx-auto mb-2"
      >
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
      <img
        class=""
        :src="(fightDetails.payload[0].whitePfp) ? fightDetails.payload[0].whitePfp + '_mid.jpg' : 'https://www.chessboxing.info/images/profile_unknown.jpg'"
        alt="white pfp"
      />
    </div>

    <h2 class="text-center text-2xl font-semibold">
      {{ fightDetails.payload[0].fightWinDetail }}
    </h2>
    <h3 class="text-center text-zinc-300 mb-24">
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

    <div v-if="fightDetails.payload[0].chessMoves" class="grid grid-cols-3">
      <div class="flex col-span-2 justify-center items-center gap-4 mb-12">
        <ChevronLeft class="h-12 w-12 cursor-pointer" @click="previousMove()" />
        <div class="w-2/3 flex flex-col items-center gap-2">
          <div ref="myBoard" class="w-full" />
          <p class="text-xl">
            {{ selectedChessMove }} /
            {{ fightDetails.payload[0].chessMoves[0].length }}
          </p>
        </div>
        <ChevronRight class="h-12 w-12 cursor-pointer" @click="nextMove()" />
      </div>
      <div class="col-span-1 flex items-center flex-wrap">
        <p
          v-for="(move, index) in fightDetails.payload[0].chessMoves[0]"
          class="p-2 gap-2 mb-2 mr-2 rounded-sm"
          :class="selectedChessMove === index + 1 ? 'bg-primary' : 'bg-muted'"
        >
          <span>{{ index }}</span> {{ move }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Chessboard,
  FEN,
} from "~/node_modules/cm-chessboard/src/Chessboard.js";
import { Chess } from "chess.js";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";

const route = useRoute();
const { data: fightDetails } = await useFetch(
  `http://localhost:8000/fightdetails?date=${route.params.date}&eventName=${route.query.eventName}&fighterWhite=${route.query.fighterWhite}&fighterBlack=${route.query.fighterBlack}`
);

const myBoard = ref();
const selectedChessMove = ref(0);

// const fenMoves = movesToFen(removeMoveNumbers(fightDetails.value.payload[0].chessMoves[0]));
// console.log(fenMoves.value);
console.log(removeMoveNumbers(fightDetails.value.payload[0].chessMoves[0]));

function nextMove() {
  if (
    selectedChessMove.value < fightDetails.value.payload[0].chessMoves[0].length
  ) {
    selectedChessMove.value++;
  } else {
    selectedChessMove.value = 0;
  }
}

function previousMove() {
  if (selectedChessMove.value > 0) selectedChessMove.value--;
  else
    selectedChessMove.value =
      fightDetails.value.payload[0].chessMoves[0].length;
}

function removeMoveNumbers(chessMoves) {
  const regex = /^\d+\./;
  for (let i = 0; i < chessMoves.length; i++) {
    chessMoves[i] = chessMoves[i].replace(regex, "");
  }
  return chessMoves;
}

function movesToFen(moves) {
  const chess = new Chess();
  const fenList = [];

  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];

    chess.move(whiteMove);
    fenList.push({ moveNumber, fen: chess.fen() });

    chess.move(blackMove);
    fenList.push({ moveNumber, fen: chess.fen() });

    console.log(fenList);
  }

  return fenList;
}

onMounted(() => {
  const board = new Chessboard(myBoard.value, {
    position: FEN.start,
    assetsUrl: "/",
  });
});
</script>

<style>
@import "~/node_modules/cm-chessboard/assets/chessboard.css";
</style>
