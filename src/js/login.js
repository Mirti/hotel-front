var directory = window.location.pathname.split('/').slice(0, -1).join('/');

// LOGIN BUTTON
$(document).on('click', '#lgn-btn', function () {

    var myObj = {
        "login": $('#defaultForm-email').val(),
        "password": $('#defaultForm-pass').val()
    };

    var credentials = JSON.stringify(myObj)

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/login',
        data: credentials,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            sessionStorage.setItem("token", JSON.stringify(data));
            window.location.href = directory.concat("/admin.html");
        },
        error: function () {
            alert('Logowanie nieudane');
        }
    });
});