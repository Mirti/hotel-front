if (!sessionStorage.getItem("reservationDetails")) {
    var directory = window.location.pathname.split('/').slice(0, -1).join('/');
    window.location.href = directory.concat("/index.html");
}
let data = JSON.parse(sessionStorage.getItem("reservationDetails"));
const days = Math.round(new Date(sessionStorage.getItem("endDate")) - new Date(sessionStorage.getItem("startDate"))) / 86400000;
$(document).ready(function () {
    $("#reservation-details").append("<p><span class='font-weight-bold'>Numer rezerwacji: </span>" + data.id + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Imię: </span>" + data.user.first_name + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Nazwisko: </span>" + data.user.last_name + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>E-mail:</span> " + data.user.email + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Numer telefonu: </span>" + data.user.telephone + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Data przyjazdu: </span>" + data.date_start + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Data wyjazdu: </span>" + data.date_end + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Łączna cena: </span>" + data.price * days + "</p>");
    $("#reservation-details").append("<p><span class='font-weight-bold'>Typ apartamentu: </span>Apartament standardowy</p>");

    switch (data.roomClass) {
        case 1:
            $("#reservation-details").append("<p><span class='font-weight-bold'>Typ apartamentu:</span>Apartament luksusowy</p>");
            break;
        case 2:
            $("#reservation-details").append("<p><span class='font-weight-bold'>Typ apartamentu:</span>Apartament standardowy</p>");
            break;
        case 3:
            $("#reservation-details").append("<p><span class='font-weight-bold'>Typ apartamentu:</span>Apartament ekonomiczny</p>");
            break;
    }

    switch (data.status) {
        case "PAID":
            $("#reservation-details").append("<p><span class='font-weight-bold'>Status: </span>Opłacona</p>");
            break;
        case "NEW":
            $("#reservation-details").append("<p><span class='font-weight-bold'>Status: </span>Oczekiwanie na płatność</p>");
            $("#reservation-details").append(`<br/><p><span class='font-weight-bold'>Prosimy o wpłatę łącznej kwoty na konto:</span>
            <br/>Hotel Testowy  <br/>
                 Ul. Testowa 215, 35-005 Rzeszów <br/>
                 Numer konta: 00 0000 0000 0000 0000 0000 0000<br/>
                 W tytule prosimy podać numer rezerwacji</p>`);
            break;
        case "CANCELLED":
            $("#reservation-details").append("\"<p><span class='font-weight-bold'>Status: Anulowana</p>");
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
                url: hostAddress + '/reservations/' + data.id,
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