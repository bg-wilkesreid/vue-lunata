<template>
    <tr :data-item-pk="item[pk]">
        <td>
            <input type="checkbox" v-model="rowSelectionStatus" />
        </td>
        <template v-for="(cell, key) in row.cells">
            <td v-if="cell.column.hasOwnProperty('component')" :key="key" v-show="!cell.column.collapsed && groupBy != key">
                <component :is="cell.column.component" :item="item" />
            </td>
            <td v-else :key="key" :propItem="item" :data-column-name="cell.column.name" v-show="!cell.column.collapsed && groupBy != key">
                <template v-if="cell.waitingForValue">
                    <spinner />
                </template>
                <template v-else>
                    <span v-html="cell.display" />
                </template>
            </td>
        </template>
        <td v-if="crudEnabled">
            <a href v-for="action in rowActions(row)" :key="action.name" class="row-action-link" @click.prevent="action.do(row)" v-tooltip="action.tooltip || null">{{ action.name }}</a>
        </td>
    </tr>
</template>

<script>
import { VTooltip } from 'v-tooltip'
export default {
    props: ['row', 'pk', 'columns', 'crudEnabled', 'rowActions', 'groupBy', 'selected'],
    directives: {
        'tooltip': VTooltip,
    },
    data() {
        return {
        }
    },
    computed: {
        item() {
            return this.row.item
        },
        cells() {
            return this.row.cells
        },
        rowSelectionStatus: {
            get() {
                return this.selected.includes(this.item[this.pk])
            },
            set() {
                this.emitSelect()
            }
        }
    },
    methods: {
        emitSelect() {
            this.$emit('select', this.row)
        }
    }
}
</script>

<style lang="scss" scoped>
td {
    padding: 10px 15px;
}
</style>

<style lang="scss">
.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}
</style>

