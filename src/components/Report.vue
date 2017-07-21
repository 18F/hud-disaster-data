<template lang="pug">
  div
    selectLocationSideBar
    div.col-lg-9(style="padding:0 20px; border:1px solid #ff0000;min-height:700px;")
</template>

<script>
import selectLocationSideBar from './SelectLocationSideBar'
/**
* Component responsible for displaying a report or reports.  This is just a stub, at this time.
* @module components/Report
*/
export default {
  name: 'report',
  components: {selectLocationSideBar}
}
</script>
