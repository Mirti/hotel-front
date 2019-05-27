$(document).ready(function () {
    const availableRooms = JSON.parse(sessionStorage.getItem("availableRooms"));
    const days = Math.round(new Date(sessionStorage.getItem("endDate")) -  new Date(sessionStorage.getItem("startDate"))) / 86400000;
    for (i = 0; i < availableRooms.length; i++) {
        $("#room-table-body").append("<tr id = tr" + availableRooms[i].id + ">");
        $("#tr" + availableRooms[i].id).append("<td><input type='radio' name=radio value='" + availableRooms[i].id + "'></td>");

        switch (availableRooms[i].type) {
            case 'ECONOMIC':
                $("#tr" + availableRooms[i].id).append("<td>Apartament ekonomiczny</td>");
                break;
            case 'STANDARD':
                $("#tr" + availableRooms[i].id).append("<td>Apartament standardowy</td>");
                break;
            case 'LUXURY':
                $("#tr" + availableRooms[i].id).append("<td>Apartament luksusowy</td>");
                break;
        }
        $("#tr" + availableRooms[i].id).append("<td>" + availableRooms[i].description + "</td>");
        $("#tr" + availableRooms[i].id).append("<td>" + availableRooms[i].rooms_count + "</td>");
        $("#tr" + availableRooms[i].id).append("<td>" + availableRooms[i].beds_count + "</td>");
        $("#tr" + availableRooms[i].id).append("<td>" + availableRooms[i].price + "</td>");
        $("#tr" + availableRooms[i].id).append("<td>" + availableRooms[i].price * days + "</td>");
        $("#tr" + availableRooms[i].id).append("</tr>");
    }
    $('#fromInput').val(sessionStorage.getItem("startDate"));
    $('#toInput').val(sessionStorage.getItem("endDate"));

    $(document).on('click', '#btn-back', function () {
        window.location.href = "index.html";
    });
});

$(document).on('click', '#btn-reserve', function () {
    const name = $("#nameInput").val();
    const surname = $("#surnameInput").val();
    const email = $("#emailInput").val();
    const telephhone = $("#telephoneInput").val();
    const dateStart = $("#fromInput").val();
    const dateEnd = $("#toInput").val();
    const apartmentId = $("input[name='radio']:checked").val();
    if (validate()) {
        $.ajax({
            type: 'POST',
            url: hostAddress + '/reservations',
            dataType: "json",
            data: {
                "apartment_id": apartmentId,
                "date_start": dateStart,
                "date_end": dateEnd,
                "first_name": name,
                "last_name": surname,
                "email": email,
                "telephone": telephhone,
            },
            success: function (data) {
                sessionStorage.setItem("reservationDetails", JSON.stringify(data));
                var directory = window.location.pathname.split('/').slice(0, -1).join('/');
                window.location.href = directory.concat("/check.html");
            }
        });
    }
});

function validate() {
    const name = $("#nameInput").val();
    const surname = $("#surnameInput").val();
    const email = $("#emailInput").val();
    const telephhone = $("#telephoneInput").val();
    const apartmentId = $("input[name='radio']:checked").val();
    let isValid = true;

    // NAME
    if (name.length < 2 || name.length > 20) {
        $("#invalidName").css("visibility", "visible");
        isValid = false;
    } else {
        $("#invalidName").css("visibility", "hidden");
    }

    //SURNAME
    if (surname.length < 2 || surname.length > 20) {
        $("#invalidSurname").css("visibility", "visible");
        isValid = false;
    } else {
        $("#invalidSurname").css("visibility", "hidden");
    }

    //EMAIL
    const regexMail = new RegExp("^[\\da-zA-z._\-]*@[\\da-zA-z._-]*.[a-zA-z]{2,3}$");
    if (!regexMail.test(email)) {
        $("#invalidEmail").css("visibility", "visible");
        isValid = false;
    } else {
        $("#invalidEmail").css("visibility", "hidden");
    }

    //TELEPHONE
    const regexPhone = new RegExp("^[\\d]{9}$");
    if (!regexPhone.test(telephhone)) {
        $("#invalidTelephone").css("visibility", "visible");
        isValid = false;
    } else {
        $("#invalidTelephone").css("visibility", "hidden");
    }

    //APARTMENT
    if (!apartmentId) {
        $("#invalidApartment").css("visibility", "visible");
        isValid = false;
    } else {
        $("#invalidApartment").css("visibility", "hidden");
    }

    return isValid;
}