<template>
    <div class="page2">
        page2<br />
        <router-link to="/Page1">TO Page1</router-link>
    </div>
</template>

<script>
export default {
    name: 'page2',
    data: function () {
        return {};
    },
    methods: {}
};
</script>

<style scoped lang="scss">
    .page2 {
        border: 3px solid $--color-primary;
    }
</style>
