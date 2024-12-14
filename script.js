$(document).ready(function() {
    // Admin login form submission
    $('#login-form').submit(function(event) {
        event.preventDefault();  // Prevent default form submission
        const email = $('#username').val();
        const password = $('#password').val();
        
        $.ajax({
            url: '/login',
            method: 'POST',
            data: { email, password },
            success: function(response) {
                alert('Login successful!');
                // Redirect to admin dashboard
                window.location.href = '/admin/dashboard';
            },
            error: function(error) {
                alert('Error: ' + error.responseJSON.message);
            }
        });
    });

    // Personality form submission
    $('#message-form').submit(function(event) {
        event.preventDefault();  // Prevent default form submission
        const formData = {
            question1: $('#question1').val(),
            question2: $('#question2').val(),
            question3: $('#question3').val(),
            question4: $('#question4').val(),
            question5: $('#question5').val(),
            question6: $('#question6').val(),
            question7: $('#question7').val(),
            question8: $('#question8').val(),
            question9: $('#question9').val(),
            question10: $('#question10').val(),
            question11: $('#question11').val(),
            question12: $('#question12').val()
        };

        $.ajax({
            url: '/submitPersonalityForm',
            method: 'POST',
            data: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')  // Include token for authentication
            },
            success: function(response) {
                alert('Personality form submitted successfully!');
            },
            error: function(error) {
                alert('Error: ' + error.responseJSON.message);
            }
        });
    });

    // CV Upload
    $('#upload-cv-form').submit(function(event) {
        event.preventDefault();  // Prevent default form submission
        const formData = new FormData(this);
        
        $.ajax({
            url: '/uploadCV',
            method: 'POST',
            data: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')  // Include token for authentication
            },
            processData: false,
            contentType: false,
            success: function(response) {
                alert('CV uploaded successfully!');
            },
            error: function(error) {
                alert('Error: ' + error.responseJSON.message);
            }
        });
    });

    // Admin contact user form submission
    $('#admin-contact-form').submit(function(event) {
        event.preventDefault();  // Prevent default form submission
        const userId = $('#user-id').val();
        const subject = $('#subject').val();
        const message = $('#message').val();

        $.ajax({
            url: '/admin/contactUser',
            method: 'POST',
            data: { userId, subject, message },
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')  // Include token for authentication
            },
            success: function(response) {
                alert('Email sent successfully!');
            },
            error: function(error) {
                alert('Error: ' + error.responseJSON.message);
            }
        });
    });

    // Theme switcher
    $('.theme-switch input[type="checkbox"]').change(function() {
        $('body').toggleClass('light-theme dark-theme');
    });
});