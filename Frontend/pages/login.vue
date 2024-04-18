<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <form @submit.prevent="login()" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <input
              id="email"
              type="email"
              ref="email"
              placeholder="chess@boxing.com"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>

              <Dialog>
                <DialogTrigger>
                  <a class="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </a>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Well... try to remember it</DialogTitle>
                    <DialogDescription>
                      <img src="/forgot-password.gif" alt="forgot-password" />
                      <p class="text-right">PS. try the passwords on the GIF</p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <input
              id="password"
              ref="password"
              type="password"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button type="submit" class="w-full"> Login </Button>
        </form>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="/login-placeholder.jpeg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
    <Toaster />
  </div>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

const email = ref("");
const password = ref("");

function login() {
  fetch("http://localhost:8000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email.value.value,
      password: password.value.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data here
      if (data.code !== 200) {
        toast({
          title: "Sorry",
          description: "The email or password is incorrect",
        });
        return;
      }
      localStorage.setItem("token", data.payload);
      navigateTo("/");
    })
    .catch((error) => {
      // Handle any errors here
      console.error(error);
    });
}

definePageMeta({
  layout: false,
});
</script>
