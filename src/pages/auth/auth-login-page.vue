<script setup>
import BaseTitle from 'src/components/base/base-title.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseLink from 'src/components/base/base-link.vue';
</script>

<template>
  <div class="space-y-10">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <base-title
        :level="2"
        :classes="{ base: 'mt-10 text-center leading-9' }"
        text="auth.login.title"
        text-from-resource
      />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <base-input
          id="email"
          type="email"
          placeholder="auth.login.form.email"
          label="auth.login.form.email"
          with-label
          label-from-resource
          placeholder-from-resource
        />
        <base-input
          id="password"
          type="password"
          placeholder="auth.login.form.password"
          label="auth.login.form.password"
          with-label
          label-from-resource
          placeholder-from-resource
        />
        <base-button
          type="submit"
          text="auth.login.form.submit"
          text-from-resource
          fullwidth
        />
      </form>
    </div>

    <p class="text-center text-sm">
      <base-link
        to="#"
        text="auth.login.link.register"
        text-from-resource
        native
      />
    </p>
  </div>
</template>
