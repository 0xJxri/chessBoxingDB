<template>
  <div>
    <h1>Compare</h1>

    <p>Login for the premium features</p>
    {{ isTokenValid ? "You are logged in" : "You are not logged in" }}
  </div>
</template>

<script setup>
const isTokenValid = ref(false);


onMounted(() => {
  const token = localStorage.getItem('token')

  if (token) {
    fetch('http://localhost:8000/validate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          isTokenValid.value = true;
        }
      })
      .catch(error => {
        console.error('Token validation failed:', error);
      });
  } else {
    console.error('Token not found in localStorage');
  }
});
</script>
