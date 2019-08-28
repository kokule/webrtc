<template>
    <div class="page1">
        page1
        <el-button size="mini" @click="handleClick">test</el-button>
    </div>
</template>

<script>
export default {
    name: 'page1',
    data: function () {
        return {};
    },
    methods: {
        handleClick () {
            this.$api.example.test().then(data => {
                this.$message.success({
                    message: data.message,
                    duration: 5000,
                    showClose: true
                });
            });
        }
    }
};
</script>

<style scoped lang="scss">
    .page1 {

    }
</style>
