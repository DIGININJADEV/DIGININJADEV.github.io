<?php
if ( isset( $_POST['newsletter_submit'] ) ) {
	// Initialize error array
	$newsletter_errors = array();

	// Check email input field
	if ( trim( $_POST['newsletter_email'] ) === '' )
		$newsletter_errors[] = 'Email address is required';
	elseif ( !preg_match( "/^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,4}$/i", trim( $_POST['newsletter_email'] ) ) )
		$newsletter_errors[] = 'Email address is not valid'; 
	else
		$newsletter_email = trim( $_POST['newsletter_email'] );
	
	// Send email if no input errors
	if ( empty( $newsletter_errors ) ) {
		$email_to = "example@example.com"; // Change to your own email address
		$subject = "Newsletter Subscription";
		$body = "Subscriber details: " . $newsletter_email . "\r\n";
		$headers = "Newsletter Subscription <" . $email_to . ">\r\nReply-To: " . $newsletter_email . "\r\n";
		mail( $email_to, $subject, $body, $headers );
		echo 'Thank you for subscribing!';
	} else {
		echo 'Please go back and correct the following errors:<br />';
		foreach ( $newsletter_errors as $error ) {
			echo $error . '<br />';
		}
	}
}
?>