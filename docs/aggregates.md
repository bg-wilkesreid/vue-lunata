# Aggregates

> ag·gre·gate – a whole formed by combining several (typically disparate) elements

To make a data table anywhere close to as helpful as a digital spreadsheet, we need to be able to aggregate our columns. This is when we're trying to answer questions like "What is the average age of my users?", or "What is the total budget for all of these projects?". In Lunata we do this by creating **aggregate rows**.

To add an aggregate row, we just need to set the `aggregates` property on the `<lunata-table>` component.

```html
<lunata-table aggregates="aggregates" />
```
```javascript
aggregates = {
    "Average Age": items => {
        let total = items.reduce((acc, item) => {
            return acc + item.age
        }, 0)

        return total / items.length
    }
}
```

<vuep template="#aggregate-example"></vuep>

<script v-pre type="text/x-template" id="aggregate-example">
<template>
<div>
    <lunata-table :items="people" :columns="columns" :aggregates="aggregates" />
</div>
</template>

<script>
export default {
    data() {
        return {
            people: [
                {
                    name: 'Bob',
                    age: 26
                },
                {
                    name: 'Sally',
                    age: 9
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
            ],
            aggregates: {
                "Average Age": items => {
                    let total = items.reduce((acc, item) => {
                        return acc + item.age
                    }, 0)

                    return total / items.length
                }
            }
        }
    }
}
</script>
</script>

In the above example, we call the 'reduce' method on the items array to combine all the ages into a single total value, and then we return that total divided by the total number of items, which is the average.