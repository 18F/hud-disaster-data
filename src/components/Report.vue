<template lang="pug">
div(style='color: #fff; font-size: xx-large;', tabindex='0')
  //| The purpose of this page is to produce a standard report that summarizes the extent of disaster damages for a particular location (for example: state, county, city, or congressional district).
  div(style="font-size:17px;")
    // selectLocationSideBar()
    div.col-sm-6.col-md-4.col-lg-3(style="padding:0 20px; min-height:700px; background:url('../../static/img/bg_50_opacity.png')")
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
            input(type="text" placeholder="search ..." style="position:absolute; padding-left:35px;")
            icon(name='fa-search' style="position:relative; fill:#ccc; position:relative; top:15px; left:10px;")
            span(class="input-group-btn" style="top:4px;")
              button(type="button" style="border-radius:0px; margin:0; padding:14px 20px;")
                | Add
          div(style="clear:left; border:1px solid #ccc; border-top:0px;overflow-y:scroll; height:100px; margin-top:5px;")
      div(style="margin-top:20px; overflow:hidden;")
        | Disasters
        div
          div.col-lg-12(style="padding:0px;")
            div(class="input-group")
              input(type="text" placeholder="search ..." style="position:absolute; padding-left:35px;")
              icon(name='fa-search' style="position:relative; fill:#ccc; position:relative; top:15px; left:10px;")
              span(class="input-group-btn" style="top:4px;")
                button(type="button" style="border-radius:0px; margin:0; padding:14px 20px;")
                  | Add
            div(style="clear:left; border:1px solid #ccc; border-top:0px;overflow-y:scroll; height:100px; margin-top:5px;")
      div(style="margin-top:20px; text-align:center; padding-bottom:10px;")
        button.usa-button.alt-button(type="button" style="margin-right:20px;")
          | Clear
        button.usa-button.green(type="button")
          | Create
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
