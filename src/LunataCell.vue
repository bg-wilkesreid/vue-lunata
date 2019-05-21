<template>
<td>
    <component v-if="column.component !== undefined" :is="column.component" :item="item" @input="column.set(item, $event)" />
    <template v-else>
        <template v-if="column.hasOwnProperty('get')">
            {{ column.get(item) }}
        </template>
        <template v-else>
            {{ item[column.prop] }}
        </template>
    </template>
</td>
</template>
<script>
export default {
    props: ['item', 'column'],
}
</script>
