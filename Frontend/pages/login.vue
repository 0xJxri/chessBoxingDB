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
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="chess@boxing.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>

              <Dialog>
                <DialogTrigger>
                  <a
                    class="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </a>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Well... try to remember it</DialogTitle>
                    <DialogDescription>
                      <img src="/forgot-password.gif" alt="forgot-password">
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" class="w-full"> Login </Button>
        </div>
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
  </div>
</template>
