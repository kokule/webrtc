<template>
    <div class="page1 ma-3">
        page1
        <ecp-button type="primary" @click="handleClick" text="test"></ecp-button>
        <ecp-button @click="deepClone" text="deepClone"></ecp-button>
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
        },
        deepClone () {
            const obj = { a: 1, b: { c: 2 } };
            const sObj = { ...obj };
            const dObj = _.cloneDeep(obj);
            console.log('shallow: ', sObj.b === obj.b);
            console.log('deep: ', dObj.b === obj.b);
        }
    }
};
</script>

<style scoped lang="scss">
.page1 {
}
</style>
