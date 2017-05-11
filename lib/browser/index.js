const $ = require('jquery')

function validateEmail($email){
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
	return emailReg.test( $email );
}

$(document).ready(function(){
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
		var userid = $('#username').val();
		var pass = $('#password').val();
		//check for blank entries
		if(userid && userid !== ''){
			$('.log-user-id').removeClass('usa-input-error');
			$('.log-user-id label').text('User Id').css('font-weight', 'normal');
			$('.log-user-id span').removeClass('show').addClass('hide');
			//validate password
			if(pass && pass !== ''){
				//remove error styles
				$('.log-password').removeClass('usa-input-error');
				$('.log-password label').text('Password').css('font-weight', 'normal');
				$('.log-password span').removeClass('show').addClass('hide');
			}else{
				$('#log-message').html('');
				$('.log-password').addClass('usa-input-error');
				$('.log-password label').text('Invalid Password').css('font-weight', 'bold');
				$('.log-password span').removeClass('hide').addClass('show');
				event.preventDefault();
			}
		}else{
			$('#log-message').html('');
			$('.log-user-id').addClass('usa-input-error');
			$('.log-user-id label').text('Invalid User Id').css('font-weight', 'bold');
			$('.log-user-id span').removeClass('hide').addClass('show');
			event.preventDefault();
		}
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
});

module.exports = {
	validateEmail: validateEmail
}
