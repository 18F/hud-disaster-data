<template lang="pug">
div(style='color: #fff; font-size: xx-large;', tabindex='0')
  //| The purpose of this page is to produce a standard report that summarizes the extent of disaster damages for a particular location (for example: state, county, city, or congressional district).
  div(style="font-size:17px;")
    // selectLocationSideBar()
    div.col-lg-3(style="padding:0 20px; background:url('../../static/img/bg_50_opacity.png')")
      div(style="border:1px solid #fff; border-top:none; border-right:none; border-left:none; margin-top:20px; padding-bottom:10px;")
        | Report Parameters
      div(style="margin-top:20px; overflow:hidden;")
        | State
        div
          select(name="selState" required="true")
            option(value="Alabama")
              |Alabama
            option(value="Alaska" selected='')
              |Alaska
            option(value="Arkansas")
              |Arkansas
      div(style="margin-top:20px; overflow:hidden;")
        | Geographic Level
        div
          select
            option(value="test")
        div.col-lg-12(name="lsGeographicLevels" style="background-color:#000; overflow:hidden; padding:10px;")
          div(class="input-group")
            input(type="text" placeholder="Search for...")
            span(class="input-group-btn")
              button(type="button" style="border-radius:0px; margin:0; padding:14px 10px;")
                | Add
          div(style="clear:left; border:1px solid #ccc; border-top:none; overflow-y:scroll; height:100px; position:relative; top:-4px;")
          icon(name='fa-search' style="position:relative; top:-38px; left:10px; fill:#ccc;")
      div(style="margin-top:20px; overflow:hidden;")
        | Disasters
        div
          div.col-lg-9(style="padding:0px;")
            input(type="text" placeholder="")
            icon(classes="black" name='fa-search' style="position:relative; top:-38px; left:10px; fill:#ccc;")
          div.col-lg-3(style="padding:0px;")
            button(type="button" title="Add" style="padding-top:14px; padding-bottom:14px; padding-left:18px; margin-top:4px; border-radius:0;")
              |Add
          div(style="clear:left; border:1px solid #ccc; overflow-y:scroll; height:100px; position:relative; top:-5px;")
      div(style="margin-top:20px;")
        | Clear
    div.col-lg-9(style="padding:0 20px; border:1px solid #ff0000;min-height:650px;")
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
