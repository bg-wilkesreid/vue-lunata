<script>
export default {
    props: ['column', 'item'],

    methods: {
        getColumnValue() {
            if (this.column.hasOwnProperty('get')) {
                return this.column.get(this.item)
            }

            if (this.column.hasOwnProperty('prop')) {
                return this.item[this.column.prop]
            }

            window.console.error(`"${this.column.name}" column doesn't have 'prop' or 'get' attributes.`)
            return null
        },
        clear() {
            this.$refs.input.value = ''
        }
    },

    /* eslint-disable no-unused-vars */
    render(h) {
        let tag = null
        let update = e => {
            this.$emit('update', e)
        }

        var choices

        if (this.column.hasOwnProperty('choices')) {

            choices = this.column.choices

            if (Array.isArray(this.column.choices)) {
                choices = choices.map(choice => {
                    return {
                        key: choice,
                        value: choice
                    }
                })
            } else {
                choices = Object.keys(choices).map(key => {
                    return {
                        key: key,
                        value: choices[key]
                    }
                })
            }
        } else {
            choices = null
        }

        switch (this.column.type) {
            case 'select':
                tag = (
                    <select ref="input" class="form-control" value={this.getColumnValue()} onInput={update}>
                        {choices.map(choice => {
                            return (
                                <option key={choice.value} value={choice.value}>{ choice.key }</option>
                            )
                        })}
                    </select>
                )
            break;
            case 'textarea':
                tag = (
                    <textarea ref="input" class="form-control" value={this.getColumnValue()} onInput={update} />
                )
            break;
            case 'checkbox':
                tag = (
                    <input type="checkbox" ref="input" class="form-control" checked={this.getColumnValue()} onInput={update} />
                )
            break;
            default:
                tag = (
                    <input type={this.column.hasOwnProperty('type') ? this.column.type : 'text'} ref="input" class="form-control" value={this.getColumnValue()} onInput={update} />
                )
            break;
        }

        if (this.column.readonly) {
            tag = <div>{this.getColumnValue()}</div>
        }

        return (
            <div class="lunata-modal-field form-group">
                <label for={this.column.name}>{this.column.name}</label>
                {tag}
            </div>
        )
    }
}
</script>
