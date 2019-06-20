# Columns

## Basics

The columns array is the fundamental schema that drives how Lunata displays your
data. The basic api is described in "[Getting
Started](getting-started.md#columns)".

### Name

For a data table column to have a heading, you need to provide it a name.

```javascript
columns = [
    {
        name: 'Product Name',
        // ...
    },
    {
        name: 'Product Cost',
        // ...
    }
]
```

<vuep template="#name-example"></vuep>

<script v-pre type="text/x-template" id="name-example">
<template>
<div>
    <lunata-table :items="products" :columns="columns" pk="id" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: 'T-Shirt',
                    cost: 19.99
                }
            ],
            columns: [
                {
                    name: 'Product Name',
                },
                {
                    name: 'Product Cost',
                }
            ]
        }
    }
}
</script>
</script>

### Prop

On the most basic level, you should specify which property in your item
object this column refers to.

```javascript
items = [
    {
        name: 'T-Shirt',
        age: 19.99
    },
    {
        name: 'Mug',
        age: 5.00
    }
]

columns = [
    {
        name: 'Product Name',
        prop: 'name'
    },
    {
        name: 'Product Cost',
        prop: 'cost'
    }
]
```
<vuep template="#prop-example"></vuep>

<script v-pre type="text/x-template" id="prop-example">
<template>
<div>
    <lunata-table :items="products" :columns="columns" pk="id" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: 'T-Shirt',
                    cost: 19.99
                },
                {
                    id: 2,
                    name: 'Mug',
                    cost: 5.00
                }
            ],
            columns: [
                {
                    name: 'Product Name',
                    prop: 'name'
                },
                {
                    name: 'Product Cost',
                    prop: 'cost'
                }
            ]
        }
    }
}
</script>
</script>

In this example, the 'Name' column will show the value of the 'name' prop for each item, and the 'Age' column will show the age. However, you can also transform the prop value before you display it.

### Get

You can define a transform function that receives the current item as its
argument and returns the value you want to show up in the table cell.

!> **NOTE**: You don't have to define a `prop` for the column if you give it a `get` method instead.

```javascript
items = [
    {
        name: 'T-Shirt',
        cost: 19.99
    },
    {
        name: 'Mug',
        age: 5
    }
]

columns = [
    {
        name: 'Product Name',
        prop: 'name'
    },
    {
        name: 'Price',
        get(item) {
            return '$' + item.cost.toFixed(2)
        }
    }
]
```

<vuep template="#get-example"></vuep>

<script v-pre type="text/x-template" id="get-example">
<template>
<div>
    <lunata-table :items="products" :columns="columns" pk="id" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: 'T-Shirt',
                    cost: 19.99
                },
                {
                    id: 2,
                    name: 'Mug',
                    cost: 5
                }
            ],
            columns: [
                {
                    name: 'Product Name',
                    prop: 'name'
                },
                {
                    name: 'Price',
                    get(item) {
                        return '$' + item.cost.toFixed(2)
                    }
                }
            ]
        }
    }
}
</script>
</script>

#### Computed columns

Using the 'get' method, you can even add additional columns that are calculated
based on the other properties of the item.

```javscript
items = [
    {
        name: 'T-Shirt',
        cost: 19.99
    },
    {
        name: 'Mug',
        age: 5
    }
]

columns = [
    {
        name: 'Product Name',
        prop: 'name'
    },
    {
        name: 'Price',
        get(item) {
            return '$' + item.cost.toFixed(2)
        }
    },
    {
        name: 'Eligible for Discount',
        get(item) {
            return item.cost > 10 ? 'Yes' : 'No'
        }
    }
]
```

<vuep template="#get-computed-example"></vuep>

<script v-pre type="text/x-template" id="get-computed-example">
<template>
<div>
    <lunata-table :items="products" :columns="columns" pk="id" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    id: 1,
                    name: 'T-Shirt',
                    cost: 19.99
                },
                {
                    id: 2,
                    name: 'Mug',
                    cost: 5
                }
            ],
            columns: [
                {
                    name: 'Product Name',
                    prop: 'name'
                },
                {
                    name: 'Price',
                    get(item) {
                        return '$' + item.cost.toFixed(2)
                    }
                },
                {
                    name: 'Eligible for Discount',
                    get(item) {
                        return item.cost > 10 ? 'Yes' : 'No'
                    }
                }
            ]
        }
    }
}
</script>
</script>

## CRUD

"CRUD" stands for "Create, Read, Update, Delete". As seen in the basics above, we already have the "Read" part down. Lunata also provides ways to make it easy to do the creating, updating, and deleting.

!> **NOTE**: Lunata currently uses [Bootstrap](https://getbootstrap.com) to open [modals](https://getbootstrap.com/docs/4.3/components/modal) for creating and editing. Because Bootstrap depends on [jQuery](https://jquery.com/) and [Popper.js](https://popper.js.org/), Lunata defines Bootstrap, jQuery, and Popper.js as [peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/), meaning your project will need to include those packages. You can do so by running `npm install bootstrap jquery popper.js` or `yarn add bootstrap jquery popper.js` depending on which package manager you use.

### Enabling

Add the `crud-enabled` prop to the `<lunata-table>` component.

```javascript
<lunata-table crud-enabled />
```

### Type

When you use the CRUD features, each column needs to have a `type`. The types can be `select`, `textarea`, or any standard `<input>` type value, such as `text`, `checkbox`, `number`, etc.

The `number` type is parsed as a float by default. You can be more specific by using `float` or `int` as the column type.

```javascript
columns = [
    {
        name: 'Product Name',
        prop: 'name',
        type: 'text'
    },
    {
        name: 'Product Cost',
        prop: 'cost',
        type: 'float'
    }
]
```

### Creating

To open a modal for creating a new item, call the `open` method on the `<lunata-table>` component. Also, listen for the `create` event to actually add the new item to your list of objects, or to make an API call to store it in your database.

```html
<template>
<div>
    <button @click="openCreate">Create</button>
    <lunata-table crud-enabled ref="table" :items="products" :columns="columns" pk="id" @create="create" />
</div>
</template>
<script>
    var idCounter = 3
    export default {
        data() {
            return {
                products: [
                    {
                        id: 1,
                        name: 'T-Shirt',
                        cost: 19.99
                    },
                    {
                        id: 2,
                        name: 'Mug',
                        cost: 5
                    }
                ],
                columns: [
                    {
                        name: 'Product Name',
                        prop: 'name',
                        type: 'string'
                    },
                    {
                        name: 'Product Price',
                        type: 'float',
                        get(item) {
                            return '$' + item.cost.toFixed(2)
                        }
                    }
                ]
            }
        },
        methods: {
            openCreate() {
                this.$refs.table.create()
            },
            create(item) {
                this.products.push({
                    id: idCounter++,
                    ...item
                })
            }
        }
    }
</script>
```

<vuep template="#crud-create-example"></vuep>

<script v-pre type="text/x-template" id="crud-create-example">
<template>
<div>
    <button @click="openCreate">Create</button>
    <lunata-table crud-enabled ref="table" :items="products" :columns="columns" pk="id" @create="create" />
</div>
</template>
<script>
    var idCounter = 3
    export default {
        data() {
            return {
                products: [
                    {
                        id: 1,
                        name: 'T-Shirt',
                        cost: 19.99
                    },
                    {
                        id: 2,
                        name: 'Mug',
                        cost: 5
                    }
                ],
                columns: [
                    {
                        name: 'Product Name',
                        prop: 'name',
                        type: 'text',
                    },
                    {
                        name: 'Product Price',
                        type: 'float',
                        get(item) {
                            return '$' + item.cost.toFixed(2)
                        }
                    }
                ]
            }
        },
        methods: {
            openCreate() {
                this.$refs.table.create()
            },
            create(item) {
                this.products.push({
                    id: idCounter++,
                    ...item
                })
            }
        }
    }
</script>
</script>

### Updating

Notice how in the previous example, editing a row doesn't update the list when you click Save.  To make this happen, we need to listen for the update event on the `<lunata-table>` and respond accordingly. The update event will pass back the edited item as a completely new object, so in this example we need to have an `id` prop to match on.

```html
<template>
<div>
    <button @click="openCreate">Create</button>
    <lunata-table crud-enabled ref="table" :items="products" :columns="columns" @create="create" @update="update" />
</div>
</template>
<script>
    var idCounter = 3
    export default {
        data() {
            return {
                products: [
                    {
                        id: 1,
                        name: 'T-Shirt',
                        cost: 19.99
                    },
                    {
                        id: 2,
                        name: 'Mug',
                        cost: 5
                    }
                ],
                columns: [
                    {
                        name: 'Product Name',
                        prop: 'name',
                        type: 'string'
                    },
                    {
                        name: 'Product Price',
                        prop: 'cost',
                        type: 'float',
                        get(item) {
                            return '$' + item.cost.toFixed(2)
                        }
                    }
                ]
            }
        },
        methods: {
            openCreate() {
                this.$refs.table.create()
            },
            create(item) {
                this.products.push({id: idCounter++, ...item})
            },
            update(item) {
                this.products = this.products.map(product => {
                    if (product.id == item.id) {
                        product = item
                    }
                    return product
                })
            }
        }
    }
</script>
```

<vuep template="#crud-update-example"></vuep>

<script v-pre type="text/x-template" id="crud-update-example">
<template>
<div>
    <button @click="openCreate">Create</button>
    <lunata-table crud-enabled ref="table" :items="products" :columns="columns" @create="create" @update="update" />
</div>
</template>
<script>
    var idCounter = 3;
    export default {
        data() {
            return {
                products: [
                    {
                        id: 1,
                        name: 'T-Shirt',
                        cost: 19.99
                    },
                    {
                        id: 2,
                        name: 'Mug',
                        cost: 5
                    }
                ],
                columns: [
                    {
                        name: 'Product Name',
                        prop: 'name',
                        type: 'string'
                    },
                    {
                        name: 'Product Price',
                        prop: 'cost',
                        type: 'float',
                        get(item) {
                            return '$' + item.cost.toFixed(2)
                        }
                    }
                ]
            }
        },
        methods: {
            openCreate() {
                this.$refs.table.create()
            }, 
            create(item) {
                this.products.push({id: idCounter++, ...item})
            },
            update(item) {
                this.products = this.products.map(product => {
                    if (product.id == item.id) {
                        product = item
                    }
                    return product
                })
            }
        }
    }
</script>
</script>