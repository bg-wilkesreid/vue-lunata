export function columnKey(column) {
    if (column.hasOwnProperty('slug')) {
        return column.slug
    } else {
        return column.name
    }
}

export class Row
{
    constructor(item, columns) {
        this.columns = columns
        this.item = item

        this.evaluatedHooks = []

        this.evaluating = false
        this.cells = columns.reduce((obj, column) => {
            obj[columnKey(column)] = {
                value: null,
                display: null,
                column,
                waitingForValue: false
            }
            return obj
        }, {})

        this.evaluateCells()
    }

    onEvaluated(callback) {
        if (callback === undefined) {
            if (this.evaluatedHooks.length > 0) {
                this.evaluatedHooks.forEach(hook => {
                    hook()
                })
            }
        } else {
            this.evaluatedHooks.push(callback)
        }
    }

    async evaluateCells() {
        if (!this.item || !this.columns) {
            return
        }

        this.evaluating = true
        for (const column of this.columns) {
            let key = columnKey(column)
            this.cells[key].waitingForValue = true

            let value = await this.cellValue(column)
    
            this.cells[key].value = value
            this.cells[key].display = this.cellDisplay(column, value)
            this.cells[key].waitingForValue = false
        }
        this.evaluating = false
        this.onEvaluated()
    }

    cellValue(column) {
        // If this column specifies a 'get' method, try to use it to return the value
        if (column.hasOwnProperty('get') && typeof column.get == 'function') {
            try {
                return column.get(this.item, this.cells)
            } catch (e) {
                // Failed to return a value using the 'get' method, so try to return a value using the 'prop'
                if (column.hasOwnProperty('prop')) {
                    return this.item[column.prop]
                } else {
                    // A prop wasn't provided, so there is no value to return
                    return null
                }
            }
        } else {
            // The column did not specify a 'get' method, so try to return the value using 'prop'
            if (column.hasOwnProperty('prop')) {
                return this.item[column.prop]
            } else {
                // There is no 'prop', so there is no value to return
                return null
            }
        }
    }

    cellDisplay(column, value) {
        // If the column has a 'display' method, use it to transform the value before displaying
        if (column.hasOwnProperty('display') && typeof column.display == 'function') {
            return column.display(value)
        } else {
            return value
        }
    }
}
