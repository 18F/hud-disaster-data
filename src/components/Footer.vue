<template>
  <div id="appFooter">
    <div class="wrapper">
        <div class="links">
          <div>
            <a href="https://www.disasterassistance.gov/">Disaster Assistance</a>
            <a href="https://www.hudexchange.info/programs/cdbg-dr/">DBG-DR Program Resources</a>
            <a href="https://portal.hud.gov/hudportal/HUD">HUD.gov</a>
            <a href="https://www.huduser.gov/portal/home.html">HUDUser.gov</a>
            <a href="#">Web Policies</a>
            <a href="#">Feedback</a>
          </div>
        </div>
        <div class="signature">
          <div>
            <img src="/static/img/logo_global-blue.svg" alt="U.S. Department of Housing and Urban Development Logo"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>
<style lang="scss">
/* Footer styles ----------------------------------- */
#appFooter {
  .wrapper {  background:#fff;  }
  .links {
    background-color:#5A616B;
    font-size:14px;
    font-weight:bold;

    div {
      padding:20px 10%; text-align:center;
    }
  }

  a {
    color:#fff;
    margin:0 35px;
    text-decoration:none;
  }
  .signature {
    padding:20px 0;

    div { padding:0 5%; }
    img {
      border:none;
      height:100px;
      margin-left:20px;
      width:100px;
    }
  }
}
</style>
