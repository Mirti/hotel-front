$(document).ready(function () {
    const token = JSON.parse(sessionStorage.getItem("token"));

    if (!token) {
        window.location.href = "login.html";
    }

    $.ajax({
        type: 'GET',
        url: hostAddress + '/reservations',
        dataType: "json",
        headers: {"Authorization": "Bearer " + token.token},
        success: function (data) {
            sessionStorage.setItem("reservations", JSON.stringify(data));
            createTable();
        },
        error: function () {
            alert('Wystąpił problem przy pobieraniu listy rezerwacji');
        }
    });
});

function createTable() {
    var reservations = JSON.parse(sessionStorage.getItem("reservations"));
    for (i = 0; i < reservations.length; i++) {
        const days = (Math.round(new Date(reservations[i].date_end) - new Date(reservations[i].date_start)) / 86400000);
        $("#room-table-body").append("<tr id = tr" + reservations[i].id + ">");

        $("#tr" + reservations[i].id).append(
            `<td>
          <button class='btn btn-danger' onclick='setStatus(\"${reservations[i].id}\", \"${i}\")'>Zastosuj</button>
            <select id='statusCb${reservations[i].id}'>  
              <option value="CANCELLED">Anuluj rezerwację</option>
              <option value="PAID">Opłacono</option>
            </select> 
        </td>`);

        $("#tr" + reservations[i].id).append("<td>" + reservations[i].id + "</td>");
        $("#tr" + reservations[i].id).append("<td>" + reservations[i].date_start + "</td>");
        $("#tr" + reservations[i].id).append("<td>" + reservations[i].date_end + "</td>");
        $("#tr" + reservations[i].id).append("<td>" + reservations[i].price * days + "</td>");

        switch (reservations[i].status) {
            case "NEW":
                $("#tr" + reservations[i].id).append("<td>Nowa</td>");
                break;
            case "CANCELLED":
                $("#tr" + reservations[i].id).append("<td>Anulowana</td>");
                break;
            case "PAID":
                $("#tr" + reservations[i].id).append("<td>Opłacona</td>");
                break;
            case "EXPIRED":
                $("#tr" + reservations[i].id).append("<td>Wygasła</td>");
                break;
        }
        $("#tr" + reservations[i].id).append("</tr>");
    }
    $('#dt-basic-checkbox').dataTable({
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
        select: {
            style: 'os',
            selector: 'td:first-child'
        }
    });
};

// SET STATUS BUTTON

function setStatus(id, index) {
    var token = JSON.parse(sessionStorage.getItem("token"));
    var status = $(`#statusCb${id}`).val();
    var data0 = {"status": status};
    var json = JSON.stringify(data0);

    $.ajax({
        type: 'PUT',
        url: hostAddress + `/reservations/${id}`,
        contentType: "application/json",
        dataType: "json",
        data: json,
        headers: {"Authorization": "Bearer " + token.token},
        success: function (data) {
            alert('Status zmieniony');
            var reservations = JSON.parse(sessionStorage.getItem("reservations"));

            reservations[index].status = status;
            sessionStorage.setItem('reservations', JSON.stringify(reservations));
            location.reload();
        },
        error: function () {
            alert('Zmiana statusu nieudana');
        }
    });
}

$(document).on('click', '#logout', function () {
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
});