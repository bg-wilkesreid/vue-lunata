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
    <lunata-table :items="products" :columns="columns" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
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
    <lunata-table :items="products" :columns="columns" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    name: 'T-Shirt',
                    cost: 19.99
                },
                {
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

In this example, each table cell will just display the prop specified. The
'Name' column will show the value of the 'name' prop for each item, and the 'Age' column will
show the age. However, you can also transform the prop value before you display
it.

### Get

You can define a transform function that receives the current item as its
argument and returns the value you want to show up in the table cell.

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
        // Because we specify the 'get' method, we don't have to specify a prop.
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
    <lunata-table :items="products" :columns="columns" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    name: 'T-Shirt',
                    cost: 19.99
                },
                {
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
                    // Because we specify the 'get' method, we don't have to specify a prop.
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
        // Because we specify the 'get' method, we don't have to specify a prop.
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
    <lunata-table :items="products" :columns="columns" />
</div>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    name: 'T-Shirt',
                    cost: 19.99
                },
                {
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
                    // Because we specify the 'get' method, we don't have to specify a prop.
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

"CRUD" stands for "Create, Read, Update, and Delete". As seen in the basics above, we already have the "Read" part down. Lunata also provides ways to make it easy to do the creating, updating, and deleting.

!> **NOTE**: Lunata currently uses [Bootstrap](https://getbootstrap.com) to open [modals](https://getbootstrap.com/docs/4.3/components/modal) for creating and editing. Because Bootstrap depends on [jQuery](https://jquery.com/) and [Popper.js](https://popper.js.org/), Lunata defines Bootstrap, jQuery, and Popper.js as [peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/), meaning your project will need to include those packages. You can do so by running `npm install bootstrap jquery popper.js` or `yarn add bootstrap jquery popper.js` depending on which package manager you use.

### Creating

To open a modal for creating a new item, call the `open` method on the `<lunata-table>` component.

```html
<template>
    <lunata-table ref="table" :items="products" :columns="columns" />
</template>
<script>
    export default {
        data() {
            return {
                products: [
                    {
                        name: 'T-Shirt',
                        cost: 19.99
                    },
                    {
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
                        name: 'Product Cost',
                        prop: 'cost'
                    }
                ]
            }
        }
    }
</script>
```
