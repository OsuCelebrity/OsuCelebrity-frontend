lastUserId = 0;
$(document).ready(function () {

    $.fn.digits = function () {
        return this.each(function () {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        })
    }

    setInterval(function () {
        $.ajax({
            url: 'http://localhost:8989/current',
            dataType: 'json',
            type: 'get',
            cache: false,
            success: function (data) {
                $("#username").text(data.name);
                $("#timeplayed").text(data.playingFor);
                $("#queuetotal").text(data.queueSize);
                $("#plays").text(data.playCount).digits();
                $('#country').attr('src', "flags/" + data.country.toLowerCase() + ".png");
                if (data.hasOwnProperty('nextPlayer')) {
                    $("#nextplayer").text(data.nextPlayer);
                    $('.upnext').removeClass('hide');
                } else {
                    $('.upnext').addClass('hide');
                }
                $("#pp").text(data.pp + "pp");
                $("#rank").text("#" + data.rank);
                $("#accuracy").text((data.accuracy).toFixed(3) + "%");
                $("#level").text(Math.floor(data.level));
                $('#progressBar').attr('value', data.health);
                if (data.gameMode === 3) {
                    $('#gamemode').attr("class", "icon-mania");
                }
                if (data.gameMode === 2) {
                    $('#gamemode').attr("class", "icon-ctb");
                }
                if (data.gameMode === 1) {
                    $('#gamemode').attr("class", "icon-taiko");
                }
                if (data.gameMode === 0) {
                    $('#gamemode').attr("class", "icon-standard");
                }
                if (data.health < 0.0001) {
                    $('.progresslabel').text("Searching for next player...");
                } else {
                    $('.progresslabel').text("");
                }
                if (data.hasOwnProperty('beatmap')) {
                    $('#nowplaying').text(data.beatmap);
                    $('.nptext').text("Now Playing:");
                    $('.nowplaying-wrapper').removeClass('hide');
                } else {
                    $('.nowplaying-wrapper').addClass('hide');
                }
                if (data.id > 0 && data.id != lastUserId) {
                    lastUserId = data.id;
                    var newValue = "https://a.ppy.sh/" + data.id + "_" + new Date().getTime() + ".png";
                    $("#myimg").attr("src", newValue);
                }
            }
        });
    }, 100);

    $("video").delay(500).fadeTo(2000, 0.33);
});
