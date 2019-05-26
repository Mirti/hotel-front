if (!sessionStorage.getItem("reservationDetails")) {
    var directory = window.location.pathname.split('/').slice(0, -1).join('/');
    window.location.href = directory.concat("/index.html");
}
let data = JSON.parse(sessionStorage.getItem("reservationDetails"));
$(document).ready(function () {
    $("#reservation-details").append("<p>Numer rezerwacji: " + data.id + "</p>");
    $("#reservation-details").append("<p>Imię: " + data.user.first_name + "</p>");
    $("#reservation-details").append("<p>Nazwisko: " + data.user.last_name + "</p>");
    $("#reservation-details").append("<p>E-mail: " + data.user.email + "</p>");
    $("#reservation-details").append("<p>Numer telefonu: " + data.user.telephone + "</p>");
    $("#reservation-details").append("<p>Data przyjazdu: " + data.date_start + "</p>");
    $("#reservation-details").append("<p>Data wyjazdu: " + data.date_end + "</p>");

    switch (data.roomClass) {
        case 1:
            $("#reservation-details").append("<p>Typ apartamentu: Apartament luksusowy</p>");
            break;
        case 2:
            $("#reservation-details").append("<p>Typ apartamentu: Apartament standardowy</p>");
            break;
        case 3:
            $("#reservation-details").append("<p>Typ apartamentu: Apartament ekonomiczny</p>");
            break;
    }

    switch (data.status) {
        case "PAID":
            $("#reservation-details").append("<p>Status: Opłacona</p>");
            break;
        case "NEW":
            $("#reservation-details").append("<p>Status: Oczekiwanie na płatność</p>");
            break;
        case "CANCELLED":
            $("#reservation-details").append("<p>Status: Anulowana</p>");
            break;
    }

    $("#reservation-details").append('</br><button class="btn btn-primary" id="btn-back">Powrót</button></br>');
    if (data.status !== "CANCELLED" && data.status !== "EXPIRED") {
        $("#reservation-details").append('</br><button class="btn btn-danger" id="btn-cancel">Anuluj rezerwację</button>');
    }

    $(document).on('click', '#btn-cancel', function () {
        if (confirm("Czy na pewno chcesz anulować rezerwację?")) {
            $.ajax({
                type: 'DELETE',
                url: 'http://localhost:8080/reservations/' + data.id,
                dataType: "json",
                success: function (result) {
                    data.status = "CANCELLED";
                    sessionStorage.setItem("reservationDetails", JSON.stringify(data));
                    location.reload();
                },
            });
        }
    });

    $(document).on('click', '#btn-back', function () {
        window.location.href = "index.html";
    });
});