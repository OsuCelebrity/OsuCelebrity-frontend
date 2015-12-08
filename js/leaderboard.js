$(document).ready(function () {
    setInterval(function () {
        $.ajax({
            url: 'http://localhost:8989/queue',
            dataType: 'json',
            type: 'get',
            cache: false,
            success: function (data) {
                for (i = 0; i < 5; i++) {
                    row = "#leaderboard tr:nth-child(" + (i + 3) + ")";

                    $(row + " td:nth-child(1)").text("");
                    $(row + " td:nth-child(2)").text("");
                    $(row + " td:nth-child(3)").text("");
                    $(row + " td:nth-child(4)").text("");
                }
                for (i = 0; i < 5; i++) {
                    row = "#leaderboard tr:nth-child(" + (i + 3) + ")";

                    $(row + " td:nth-child(2)").text(data[i].name);
                    $(row + " td:nth-child(3)").text(data[i].timeInQueue);
                    $(row + " td:nth-child(4)").text(data[i].votes);
                    $(row + " td:nth-child(1)").text("" + (i + 1));
                }
            }
        });
    }, 300);

    setInterval(function () {
        $.ajax({
            url: 'http://localhost:8989/current',
            dataType: 'json',
            type: 'get',
            cache: false,
            success: function (data) {
                if (data.hasOwnProperty('nextPlayer')) {
                    $("#nextplayer").text(data.nextPlayer);
                }
            }
        });
    }, 300);
});
