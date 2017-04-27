require(['jquery', 'jquery-ui'], function($){
	//things to do once the common.js file has loaded
	require(['vendor/bootstrap.min']);
	require(['lib/components']); //load the components.js after jquery has loaded
	require(['vendor/jquery.dropdown.min']);
	$(document).ready(function(){
		//$(function() {
		//	$( "#tabs" ).tabs();
		//});
		$(function() {
			$( "#login_dnd .wrapper" ).draggable({
				containment: 'window'
			});
		});

		$.ajaxSetup({
			//global error handling
			error: function(xhr, status, err) {
				alert(this.props.url, status, err.toString());
			}
		});

		// login screen links
		$(document).on('click', 'a.login-link', function(){
			if($(this).hasClass('new-registration')){
				alert('go to new user registration screen');

			}else if($(this).hasClass('forgot-password')){
				$('div.log_in').slideUp('fast');
				//$('div.sign_in').removeClass('show').addClass('hide');
				$('div.forgot_username').removeClass('show').addClass('hide');
				//$('div.forgot_password').removeClass('hide').addClass('show');
				$('div.forgot_password').slideDown('fast');
				$('#reset-email').focus();

			}else{ //return to login screen
				//$('div.forgot_password').removeClass('show').addClass('hide');
				$('div.forgot_password').slideUp('fast');
				$('div.forgot_username').removeClass('show').addClass('hide');
				$('div.log_in').slideDown('fast');
				$('#userid').focus();
				//$('div.log_in').removeClass('hide').addClass('show');
			};
		});

		$('#frm_log_in').submit(function(event){
			var userid = $('#user-id').val();
			var pass = $('#password').val();
			//check for blank entries
			if((userid!='')&&(userid!=undefined)){
				$('.log-user-id').removeClass('usa-input-error');
				$('.log-user-id label').text('User Id').css('font-weight', 'normal');
				$('.log-user-id span').removeClass('show').addClass('hide');
				//validate password
				if((pass!='')&&(pass!=undefined)){
					//remove error styles
					$('.log-password').removeClass('usa-input-error');
					$('.log-password label').text('Password').css('font-weight', 'normal');
					$('.log-password span').removeClass('show').addClass('hide');
					/* -------------- Previous code for call to validate user login ----------------------------------
					$.ajax
					({
						type: "GET",
						crossDomain: true,
						cache: false,
						url: '#'+encodeURIComponent(userid)+'&key='+encodeURIComponent(pass), //+'&callback=?',
						contentType: 'application/json',
						dataType: 'jsonp',
						async: false,
						success: function (data, textStatus, xhr) {
							//alert('data.httpStatusCode= ' + data.httpStatusCode);
							if((data.httpStatus.code != 200)&&(data.class=="Failure")){
								var fail_type, fail;
									fail = '<div class="usa-alert usa-alert-error">';
									fail+= '<div class="usa-alert-body">';
									fail+= '<h3 class="usa-alert-heading">'+data.httpStatus.message+'</h3>';
									fail+= '<div class="usa-checklist">' + data.message + '</div>';
									fail+= '</div>';
									fail+= '</div>';
								$('#log-message').html(fail);
								//error log = data.class/data.httpStatusCode/data.httpStatusText/data.code/data.message/data.source
							}else{
								$('#log-message').html('');
								//alert(data.token);
								SetCookieVal('token', data.token);
							}
						}
					});*/
					document.location.href = 'dashboard.html';
				}else{
					$('#log-message').html('');
					$('.log-password').addClass('usa-input-error');
					$('.log-password label').text('Invalid Password').css('font-weight', 'bold');
					$('.log-password span').removeClass('hide').addClass('show');
				}
			}else{
				$('#log-message').html('');
				$('.log-user-id').addClass('usa-input-error');
				$('.log-user-id label').text('Invalid User Id').css('font-weight', 'bold');
				$('.log-user-id span').removeClass('hide').addClass('show');
			}
			event.preventDefault();
		});

		$('#frm_forgot_password').submit(function(event){
			var email = $('#reset-email').val();
			//check for valid email entry
			if((email!='')&&(email!=undefined)&&(validateEmail(email))){
				$('.log-reset-email').removeClass('usa-input-error');
				$('.log-reset-email label').text('Email').css('font-weight', 'normal');
				$('.log-reset-email span').removeClass('show').addClass('hide');
				alert('Valid email provided');
				//alert('email handler called');
				//send email to service which initiates email send
				//provide response to user upon successful send of email
			}else{
				$('.log-reset-email').addClass('usa-input-error');
				$('.log-reset-email label').text('Invalid Email').css('font-weight', 'bold');
				$('.log-reset-email span').removeClass('hide').addClass('show');
				$('#reset-email').focus();
			}
			event.preventDefault();
		});

		function validateEmail($email){
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
			return emailReg.test( $email );
		}

		function SetCookieVal(key, value){
			var my_cookie, keys, values;
			var now = new Date();
			now.setHours( now.getHours() + 168);	//set expiration date to one week from now

			//does a cookie exist?
			if (document.cookie != ''){
				//split cookie apart and add new values
				//alert('existing cookie -\n' + document.cookie);
				/*
				var vals = document.cookie.split(':');
				for(var i=0; i<vals.length;i++){
					keys[i]=vals[i].split('=');
					alert(keys[i]);
				}
				alert(vals[0]);
				*/

			}else{
				//create cookie
				my_cookie = key+'='+value+':';
				my_cookie+='expires='+now.toUTCString()+';';
			}
			$('#user-id').val('');
			$('#password').val('');
			//document.cookie = my_cookie.toString();
			alert('cookie created'+'\n\n'+'expiration: '+now.toUTCString()+'\n'+'token: '+value);



			/*
			for(var i=0; i<keys.length;i++){
				cookie_vals += keys[i] + '=' + values[i] + ':';
			}
			//set new expiration date
			//does the expiration date exist?
			if(keys[keys.length-1]=='expires'){
				values[values.length-1] = now.toUTCString()
			}else{

			}
			cookie_vals += 'expires=' + now.toUTCString() + ';';
			document.cookie = cookie_vals.toString();

			*/
			//document.cookie = cookie_vals.toString();
			alert('cookie created'+'\n\n'+'expiration: ' + cookie_vals +'\n'+'token: ' + cookie_vals);
		}

		function ReadCookieVal(key){
			var name, value;
			var allvalues = document.cookie.split(':');
			for(var i=0; i<allvalues.length; i++){
				name = allvalues[i].split('=')[0];
				value = allvalues[i].split('=')[1];
				if(key==name){
					return value;
				}
			}
		}

		//collapse menu and hide sub-menu
		$("#show_menu").click(function(){
			var menu = $(".main-menu");
			if(menu.hasClass("hidden-xs")){
				menu.removeClass("hidden-xs hidden-sm hidden-md");
			}else{
				menu.addClass("hidden-xs hidden-sm hidden-md");
			}
		});

		var headers = ["H1","H2","H3","H4","H5","H6"];
		$(".main-menu").click(function(e) {
		  var target = e.target,
			  name = target.nodeName.toUpperCase();
			  //name = H1, H2, H3, H4
		  if($.inArray(name,headers) > -1) {
				var subItem = $(target).next();
				//slideUp all elements (except target) at current depth or greater
				var depth = $(subItem).parents().length;
				var allAtDepth = $(".main-menu div").filter(function() {
					if($(this).parents().length >= depth && this !== subItem.get(0)) {
						return true;
					}
				});
				$(allAtDepth).slideUp("fast");
				//slideToggle target content and adjust bottom border if necessary
				subItem.slideToggle("fast",function() {
					$(".main-menu :visible:last");
				});
			}
			//remove all highlights
			$(".usa-current").each(function(index){
				$(this).removeClass("usa-current");
			});
			$(target).addClass('usa-current');
			if(name=="H2"){
				$(target).parent().prev().addClass("usa-current");
			}
			if(name=="A"){
				$(target).parent().parent().prev().addClass("usa-current");
				$(target).parent().parent().parent().prev().addClass("usa-current");
			}
		});

		$('#modal_dialog').on("show.bs.modal", function(event){
			var btn = $(event.relatedTarget) // Button that triggered the modal
			//now check to see what kind of modal should be displayed
			switch(btn.data("modal-type")){
				case "logout":
					$('.modal-title').html("Confirm Logout");
					$('.modal-body p').html("Are you sure you want to logout of your current session?");
					break;
				default:
					$('.modal-title').html("Unknown Title");
					$('.modal-body p').html("Place body content here");
					break;
			}
		});
		/* This code is for demonstrational purposes only - not to be added into production code
			   Function: resets the arrows to down state upon selection of a different menu option
			--------------------------------------------------------------------------------- */
		$(".main-menu a").click(function(e) {
			var target = e.target;

			alert(target);
		});
		/* ------------------------------------------------------------------------------
		   --------------------------------------------------------------------------------- */
		$(document).on("click", ".user-notifcations .fa-envelope-o", function(){
			alert('Here');
		});
	});
});
