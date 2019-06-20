<template>
<td>
    <template v-if="!waitingForValue">
        {{ display }}
    </template>
    <template v-else>
        Loading...
    </template>
</td>
</template>

<script>
import _pickBy from 'lodash/pickBy'
import _mapKeys from 'lodash/mapKeys'
import _mapValues from 'lodash/mapValues'
export default {
    props: ['item', 'column', 'items'],
    data() {
        return {
            asyncValue: null,
            waitingForValue: true,
        }
    },
    computed: {
        display() {
            return this.asyncValue !== null && this.column.hasOwnProperty('display') ? this.column.display(this.asyncValue) : null
        },
        getMethodColumns() {
            return _mapValues(
                _mapKeys(
                    _pickBy(this.$parent.$refs, (els, ref) => {
                        return ref.includes(`item-${this.item[this.$parent.pk]}-column-`);
                    }), 
                (val, key) => {
                    let pattern = 'item-'+this.item[this.$parent.pk]+'-column-(\\w+)$'
                    let matches = key.match(new RegExp(pattern))
                    if (matches !== null) {
                        return matches[1]
                    } else {
                        return key
                    }
                }), val => val[0]
            )
        }
    },
    watch: {
        item() {
            this.getValue()
        }
    },
    mounted() {
        this.getValue()
    },
    methods: {
        async getValue() {
            this.waitingForValue = true
            this.asyncValue = null
            this.asyncValue = await this.column.get(this.item)
            this.waitingForValue = false
        }
    }
}
</script>
