$(function () {
    $('.input-daterange').datepicker({
        autoclose: true,
        format: 'yyyy-mm-dd'
    });
});


function isVisible(elment) {
    var vpH = $(window).height(), // Viewport Height
        st = $(window).scrollTop(), // Scroll Top
        y = $(elment).offset().top;

    return y <= (vpH + st);
}

$(window).scroll(function () {
    if ($(this).scrollTop() == 0) {
        $('#to-top').fadeOut();
    } else if (isVisible($('footer'))) {
        $('#to-top').css('position', 'absolute');
    } else {
        $('#to-top').css('position', 'fixed');
        $('#to-top').fadeIn();
    }
});
var directory = window.location.pathname.split('/').slice(0, -1).join('/');


// RESERVATION BUTTON
$(document).on('click', '#btn-available', function () {
    var startDate = $('#datepickerFrom').val();
    var endDate = $('#datepickerTo').val();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = new Date(mm + '/' + dd + '/' + yyyy);
    var start = new Date(startDate);
    var end = new Date(endDate);

    if (Number(today) > Number(start) || Number(today) > Number(endDate)) {
        alert("Data wyjazdu lub data przyjazdu nieprawidłowa");
    } else {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/apartments?filter={"date_start":"' + startDate + '","date_end":"' + endDate + '"}',
            dataType: "json",
            success: function (data) {
                sessionStorage.setItem("startDate", startDate);
                sessionStorage.setItem("endDate", endDate);
                sessionStorage.setItem("availableRooms", JSON.stringify(data));
                window.location.href = directory.concat("/reservation.html");
            },
        });
    }
});


function isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
}

// CHECK BUTTON
$(document).on('click', '#btn-check', function () {
    document.getElementById('noReservation').style.visibility = "hidden";
    var token = document.getElementById("reservationToken").value;
    if (/^\d+$/.test(token) || token === "") {
        document.getElementById('validationFailed').style.visibility = "visible";
    } else {
        document.getElementById('validationFailed').style.visibility = "hidden";

        $.ajax({
            type: 'GET',
            url: "http://localhost:8080/reservations/" + token,
            dataType: "json",
            success: function (data) {
                sessionStorage.setItem("reservationDetails", JSON.stringify(data));
                window.location.href = directory.concat("/check.html");
            },
            error: function (error) {
                document.getElementById('noReservation').style.visibility = "visible";
            }
        });
    }
});