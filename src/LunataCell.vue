<script>
export default {
    props: ['item', 'column'],
    /* eslint-disable no-unused-vars */
    render(h) {

        var tag

        if (this.column.component !== undefined) {
            tag = <this.column.component item={this.item} onInput={e => this.column.set(this.item, e)}/>
        } else {
            if (this.column.hasOwnProperty('get')) {
                tag = this.column.get(this.item)
            } else {
                tag = this.item[this.column.prop]
            }
        }

        return (
            <td>
                {tag}
            </td>
        )
    }
}
</script>
