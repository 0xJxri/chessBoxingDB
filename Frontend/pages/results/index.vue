<template>
  <div class="container mx-auto mt-4">
    <div class="grid grid-cols-3 gap-4">
      <Card v-for="item in data.payload" :key="item._id" class="w-full">
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
// https://www.chessboxing.info/images/uploads/fighters/f_021123220807_001_021123220835_big.jpg
// https://www.chessboxing.info/images/uploads/fighters/f_211122232102_002_021123221207_big.jpg
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
      whitePfp: "https://www.chessboxing.info/images/uploads/fighters/f_021123220807_001_021123220835_big.jpg",
      fighterBlack: "Dan 'The Taxman' Manfold",
      blackPfp: "https://www.chessboxing.info/images/uploads/fighters/f_211122232102_002_021123221207_big.jpg",
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
