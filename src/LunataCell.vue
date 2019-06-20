<script>
// import _pickBy from 'lodash/pickBy'
// import _mapKeys from 'lodash/mapKeys'
// import _mapValues from 'lodash/mapValues'
export default {
    props: ['propItem', 'column', 'items', 'columns'],
    data() {
        return {
            item: this.propItem
        }
    },
    computed: {
        value() {
            // If this column specifies a 'get' method, try to use it to return the value
            if (this.column.hasOwnProperty('get') && typeof this.column.get == 'function') {
                try {
                    if (this.getMethodColumns) {
                        return this.column.get(this.item, this.getMethodColumns)
                    } else {
                        return null
                    }
                } catch (e) {
                    // Failed to return a value using the 'get' method, so try to return a value using the 'prop'
                    if (this.column.hasOwnProperty('prop')) {
                        return this.item[this.column.prop]
                    } else {
                        // A prop wasn't provided, so there is no value to return
                        return null
                    }
                }
            } else {
                // The column did not specify a 'get' method, so try to return the value using 'prop'
                if (this.column.hasOwnProperty('prop')) {
                    return this.item[this.column.prop]
                } else {
                    // There is no 'prop', so there is no value to return
                    return null
                }
            }
        },
        display() {
            // If the column has a 'display' method, use it to transform the value before displaying
            if (this.column.hasOwnProperty('display') && typeof this.column.display == 'function') {
                return this.column.display(this.value)
            } else {
                return this.value
            }
        },
        getMethodColumns() {
            return null
            // return _mapValues(
            //     _mapKeys(
            //         _pickBy(this.$parent.$refs, (els, ref) => {
            //             return ref.includes(`item-${this.item[this.$parent.pk]}-column-`);
            //         }), 
            //     (val, key) => {
            //         let pattern = 'item-'+this.item[this.$parent.pk]+'-column-(\\w+)$'
            //         let matches = key.match(new RegExp(pattern))
            //         if (matches !== null) {
            //             return matches[1]
            //         } else {
            //             return key
            //         }
            //     }), val => val[0]
            // )
        }
    },
    methods: {
        with(item) {
            this.item = item
            return this
        }
    },
    /* eslint-disable no-unused-vars */
    render(h) {

        var tag
        var colspan = 1

        if (this.aggregate) {
            colspan = this.column.width;
            
            tag = this.display
        } else {
            if (this.column.component !== undefined) {
                tag = <this.column.component item={this.item} onInput={e => this.column.set(this.item, e)}/>
            } else {
                tag = this.display
            }
        }

        return <td colspan={colspan}>{tag}</td>
    }
}
</script>
