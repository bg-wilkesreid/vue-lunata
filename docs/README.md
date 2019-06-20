# Vue Lunata

> Data-driven tables for Vue.

Check out this documentation on the [GitHub Pages site](https://bg-wilkesreid.github.io/vue-lunata).

* [Installation](installation.md)
* [Getting Started](getting-started.md)

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
<template>
    <lunata-table :items="users" :columns="columns" pk="id" />
</template>

<script>
    module.exports = {
        name: 'Example',
        data: function () {
            return {
                users: [
                    {
                        id: 1,
                        name: 'Bob',
                        age: 26
                    },
                    {
                        id: 2,
                        name: 'Sally',
                        age: 29
                    }
                ],
                columns: [
                    {
                        name: 'Name',
                        prop: 'name'
                    },
                    {
                        name: 'Age',
                        prop: 'age'
                    }
                ]
            }
        }
    }
</script>
</script>