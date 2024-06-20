<template>
  <div>
    <h1 class="text-center mt-8 mb-4 text-4xl font-bold">Compare</h1>

    <div v-if="!isTokenValid" class="text-center">
      This is a premium feature. Please log in to access it.
    </div>
    <div v-else>
      <div class="text-center mb-4">
        Put the name of the fighters you want to compare here, to see their
        stats side by side.
      </div>

      <form @submit.prevent="fetchData()" class="mb-8">
        <div class="flex justify-center w-1/2 mx-auto gap-4">
          <input
            value="Matt 'Crazy Arms' Read"
            id="fighter1"
            type="text"
            ref="fighter1"
            placeholder="eg. Matt 'Crazy Arms' Read"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p
            class="text-center text-black font-bold font-blaka text-3xl"
            style="
              text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white,
                1px 1px 0 white;
            "
          >
            VS
          </p>
          <input
            value="Daniil Solovyov"
            id="fighter2"
            type="text"
            ref="fighter2"
            placeholder="eg. Daniil Solovyov"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="flex justify-center mt-4">
          <Button class="font-semibold" type="submit">
            start comparison
          </Button>
        </div>
      </form>

      <div
        v-if="compareData"
        class="container mx-auto grid grid-cols-4 gap-4 mb-32"
      >
        <div>
          <img
            :src="
              compareData.fighterWhite.pfp_link
                ? compareData.fighterWhite.pfp_link + '_big.jpg'
                : 'https://www.chessboxing.info/images/avatar_unknown.jpg'
            "
            alt="pfp"
          />
        </div>

        <div class="col-span-2 flex flex-col items-center">
          <!-- name -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1 flex items-center">
              <img
                v-if="compareData.fighterWhite.flag"
                class="h-4 mr-2"
                :src="`https://flagcdn.com/${compareData.fighterWhite.flag}.svg`"
                alt="flag"
              />
              <span>
                {{ compareData.fighterWhite.name }}
              </span>
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Name</div>
            <div class="flex-1 flex items-center justify-end">
              <span>
                {{ compareData.fighterBlack.name }}
              </span>
              <img
                v-if="compareData.fighterBlack.flag"
                class="h-4 ml-2"
                :src="`https://flagcdn.com/${compareData.fighterBlack.flag}.svg`"
                alt="flag"
              />
            </div>
          </div>

          <!-- age -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.age }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Age</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.age }}
            </div>
          </div>

          <!-- height -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.height }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Height</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.height }}
            </div>
          </div>

          <!-- weight -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.weight }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Weight</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.weight }}
            </div>
          </div>

          <!-- reach -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.reach }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Reach</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.reach }}
            </div>
          </div>

          <!-- elo -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.elo }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">ELO</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.elo }}
            </div>
          </div>

          <!-- country -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.country }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Country</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.country }}
            </div>
          </div>

          <!-- hometown -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.hometown }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Hometown</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.hometown }}
            </div>
          </div>

          <!-- gym -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.gym }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Gym</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.gym }}
            </div>
          </div>

          <!-- job -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              {{ compareData.fighterWhite.job }}
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Job</div>
            <div class="flex-1 text-right">
              {{ compareData.fighterBlack.job }}
            </div>
          </div>

          <!-- results -->
          <div
            class="flex justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1">
              <span class="text-green-400">{{ compareData.fighterWhite.results[0] }}</span> - 
              <span class="text-primary">{{ compareData.fighterWhite.results[1] }}</span> - 
              <span class="text-blue-400">{{ compareData.fighterWhite.results[2] }}</span>  
            </div>
            <div class="flex-1 text-center text-lg font-semibold">Results</div>
            <div class="flex-1 text-right">
              <span class="text-green-400">{{ compareData.fighterBlack.results[0] }}</span> - 
              <span class="text-primary">{{ compareData.fighterBlack.results[1] }}</span> - 
              <span class="text-blue-400">{{ compareData.fighterBlack.results[2] }}</span>  
            </div>
          </div>

          <!-- win rate -->
          <div
            class="flex gap-4 justify-between items-center w-full p-2 border-b border-b-muted"
          >
            <div class="flex-1 h-full p-1">
              <div
                class="w-full h-full bg-muted rounded-full relative flex justify-between"
              >
                <div
                  class="h-full rounded-full absolute right-0"
                  :class="{
                    'bg-green-500': higherWinFighter() === compareData.fighterWhite.name,
                    'bg-primary': higherWinFighter() === compareData.fighterBlack.name,
                  }"
                  :style="{ width: fighterOneStats() + '%' }"
                />
                <p class="ml-2 relative">{{ fighterOneStats() }}%</p>
              </div>
            </div>
            <div class="flex-2 text-center text-lg font-semibold">Win rate</div>
            <div class="flex-1 h-full p-1">
              <div
                class="w-full relative h-full bg-muted rounded-full flex justify-between"
              >
                <div
                  class="h-full rounded-full absolute"
                  :class="{
                    'bg-green-500': higherWinFighter() === compareData.fighterBlack.name,
                    'bg-primary': higherWinFighter() === compareData.fighterWhite.name,
                  }"
                  :style="{ width: fighterTwoStats() + '%' }"
                />
                <p class="mr-2 ml-auto relative">{{ fighterTwoStats() }}%</p>
              </div>
            </div>
          </div>

        </div>

        <div>
          <img
            :src="
              compareData.fighterBlack.pfp_link
                ? compareData.fighterBlack.pfp_link + '_big.jpg'
                : 'https://www.chessboxing.info/images/avatar_unknown.jpg'
            "
            alt="pfp"
          />
        </div>
      </div>
    </div>
    <Toaster />
  </div>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
const config = useRuntimeConfig();

const isTokenValid = ref(false);

const fighter1 = ref(null);
const fighter2 = ref(null);

const compareData = ref();

const higherWinFighter = () => {
  return fighterOneStats() > fighterTwoStats()
    ? compareData.value.fighterWhite.name
    : compareData.value.fighterBlack.name;
};

const fighterOneStats = () => {
  return Math.floor(
    ((compareData.value.fighterWhite.results[0] -
      compareData.value.fighterWhite.results[1]) /
      (compareData.value.fighterBlack.results[0] -
        compareData.value.fighterBlack.results[1] +
        (compareData.value.fighterWhite.results[0] -
          compareData.value.fighterWhite.results[1]))) *
      100
  );
};

const fighterTwoStats = () => {
  return Math.ceil(
    ((compareData.value.fighterBlack.results[0] -
      compareData.value.fighterBlack.results[1]) /
      (compareData.value.fighterWhite.results[0] -
        compareData.value.fighterWhite.results[1] +
        (compareData.value.fighterBlack.results[0] -
          compareData.value.fighterBlack.results[1]))) *
      100
  );
};

const fetchData = () => {
  const token = localStorage.getItem("token");
  const body = {
    fighterOne: fighter1.value.value,
    fighterTwo: fighter2.value.value,
  };

  console.log(body);

  fetch(config.public.baseUrl+"/compare", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 200) {
        toast({
          title: "Sorry",
          description:
            "These fighters could not be compared. Please try again.",
        });
        return;
      }
      compareData.value = data.payload;
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch(config.public.baseUrl+"/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          isTokenValid.value = true;
        }
      })
      .catch((error) => {
        console.error("Token validation failed:", error);
      });
  } else {
    console.error("Token not found in localStorage");
  }
});
</script>
