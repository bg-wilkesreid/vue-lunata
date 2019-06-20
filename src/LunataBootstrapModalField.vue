<script>
import { ModelListSelect } from 'vue-search-select'
export default {
    props: ['cell', 'item', 'cells'],

    components: {
        ModelListSelect
    },

    methods: {
        clear() {
            if ('input' in this.$refs) {
                this.$refs.input.value = ''
            }
        }
    },

    computed: {
        column() {
            return this.cell.column
        },
        value() {
            return this.cell.value
        },
        display() {
            return this.cell.display
        }
    },

    /* eslint-disable no-unused-vars */
    render(h) {
        let tag = null
        let update = e => {
            var val
            if (this.column.type == 'checkbox') {
                val = e.target.checked;
            } else if (this.column.type == 'number' || this.column.type == 'float') {
                val = parseFloat(e.target.value)
            } else if (this.column.type == 'int') {
                val = parseInt(e.target.value)
            } else if (this.column.type == 'select') {
                val = e
            } else {
                val = e.target.value
            }
            this.$emit('update', val)
        }

        var columnType = this.column.hasOwnProperty('type') ? this.column.type : 'text'

        var choices

        if (this.column.hasOwnProperty('choices')) {

            choices = this.column.choices

            if (typeof choices == 'function') {
                choices = choices()
            }

            if (Array.isArray(choices)) {
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

        switch (columnType) {
            case 'select':
                tag = (
                    <model-list-select ref="input" class="form-control" value={this.value} on-input={update} list={choices} option-value="value" option-text="key" />
                )
            break;
            case 'textarea':
                tag = (
                    <textarea ref="input" class="form-control" value={this.value} onInput={update} />
                )
            break;
            case 'checkbox':
                tag = (
                    <input type="checkbox" ref="input" class="form-control" checked={this.value} onInput={update} />
                )
            break;
            case 'float':
            case 'int':
                columnType = 'number';
            /** eslint-disable no-fallthrough */
            default:
                tag = (
                    <input type={columnType} ref="input" class="form-control" value={this.value} onInput={update} />
                )
            break;
        }

        if (this.column.readonly) {
            tag = <div domPropsInnerHTML={this.display} />
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
