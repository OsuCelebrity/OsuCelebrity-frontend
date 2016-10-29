jQuery(window).load(function () {

    jQuery("#new-follower").fitText(0.6, {
        minFontSize: '35px',
        maxFontSize: '40px'
    });

    if (window.external && window.external.SetLocalPropertyAsync) {
        console.log("XSplit Detected");

        window.external.SetLocalPropertyAsync("prop:name", "NightDev Follower Alert");

        // Too bad this doesn't really do much since volume controls are disabled
        // -> No way to enable them from JS :/
        SetVolume = function (volume) {
            volume = volume || 0;
            volume = parseInt(volume);
            alertSound.volume = volume / 100;
        }
    }

    var queue = [];
    var playing = false;
    var followers = {};
    var logging = !!getParameterByName("logging");

    var startingSize = null;

    function resizeFont(el) {
        if (!startingSize) startingSize = parseInt(window.getComputedStyle(el)['fontSize']);
        var currentSize = startingSize;

        do {
            $(el).css("font-size", currentSize - 1);
            currentSize = parseInt(window.getComputedStyle(el)['fontSize']);
        } while (startingSize !== currentSize && el.scrollWidth > ($(el).width() + 5));
    }

    function debug() {
        if (!logging) return;

        var prefix = "[NightDev Follower Alert] ";

        arguments[0] = prefix + arguments[0];

        console.log.apply(console, arguments);
    }

    function grabFollowers(all, offset) {
        all = all || false;
        offset = offset || 0;

        if (offset > 1000) return;

        if (all) {
            $.getJSON('https://api.twitch.tv/kraken/channels/osucelebrity/follows?client_id=apbhlybpld3ybc6grv5c118xqpoz01c&direction=desc&limit=100&offset=' + offset + '&callback=?', function (data) {
                if (data.follows && data.follows.length > 0) {
                    var tempList = [];

                    data.follows.forEach(function (follower) {
                        followers[follower.user.name] = true;
                        tempList.push(follower.user.name);
                    });

                    debug("Imported followers: %s", tempList.join(', '));
                    debug("Imported %d followers. Total Followers: %d", data.follows.length, Object.keys(followers).length);

                    grabFollowers(true, offset + 100);
                }
            }).fail(function () {
                setTimeout(function () {
                    grabFollowers(true, offset);
                }, 5000);
            });
        } else {
            $.getJSON('https://api.twitch.tv/kraken/channels/osucelebrity/follows?client_id=apbhlybpld3ybc6grv5c118xqpoz01c&direction=desc&limit=100&callback=?', function (data) {
                if (data.follows) {
                    if (data['_total'] > 0 && followers.length === 0) {
                        var tempList = [];

                        data.follows.forEach(function (follower) {
                            followers[follower.user.name] = true;
                            tempList.push(follower.user.name);
                        });

                        debug("Imported followers: %s", tempList.join(', '));
                        debug("Imported %d followers. Total Followers: %d", data.follows.length, Object.keys(followers).length);
                    } else {
                        data.follows.forEach(function (follower) {
                            if (!followers[follower.user.name]) {
                                followers[follower.user.name] = true;
                                debug("New follower: %s", follower.user.name);
                                queue.push(follower.user.display_name);
                                checkQueue();
                            }
                        });
                    }
                }
            });
        }
    }

    function checkQueue() {
        if (!queue.length || playing) return;

        newFollower(queue.shift());
    }

    function fileSuffix(url) {
        return url.split('/').pop().split('?')[0].split('.').pop().toLowerCase();
    }

    function appendTime(url) {
        return (url.indexOf('?') === -1) ? url + '?' + Date.now() : url + '&' + Date.now();
    }

    function show(callback) {
        var $alert = $("#follower-alert");
        var alert = getParameterByName("alert");

        if (fileSuffix(alert) === 'gif') {
            $alert.css('background-image', 'url(' + appendTime(alert) + ')');
        }

        switch ('slide-right') {
            case "slide-down":
            case "slide-up":
                $alert.show();
                $alert.animate({
                    top: 0
                }, 500, callback);
                break;
            case "slide-left":
            case "slide-right":
                $alert.animate({
                    opacity: 1,
                    left: 0
                }, 500, callback);
                break;
            default:
                $alert.fadeIn("slow", callback);
        }
    }

    function hide(callback) {
        var $alert = $("#follower-alert");

        switch ('slide-right') {
            case "slide-down":
                $alert.animate({
                    top: -110
                }, 500, callback);
                break;
            case "slide-left":
                $alert.animate({
                    left: 580
                }, 500, callback);
                break;
            case "slide-right":
                $alert.animate({
                    opacity: 0,
                    //left: -580px
                }, 1000, callback);
                break;
            case "slide-up":
                $alert.animate({
                    top: 110
                }, 500, callback);
                break;
            default:
                $alert.fadeOut("slow", callback);
        }
    }

    var timer = false;
    var alertSound = false;

    function newFollower(user) {
        playing = true;

        if (alertSound) alertSound.play();

        $("#new-follower").html(user);

        show(function () {

        });

        timer = setTimeout(function () {
            hide(function () {
                playing = false;
                checkQueue();
            });
        }, 1500);
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    $(document).ready(function () {
        grabFollowers(true);

        if (getParameterByName("chroma") === "true") {
            $("body").css("background-color", "#00ff00");
        }

        var channel = 'osucelebrity',
            type = getParameterByName("type"),
            align = getParameterByName("align"),
            alert = getParameterByName("alert"),
            sound = isNaN(getParameterByName("sound")) ? getParameterByName("sound") : false;

        if (channel) {
            setInterval(grabFollowers, 15000);

            // Type is legacy code
            if (type) {
                if (type === "stacked" || type === "custom-centered") {
                    $('#follower-alert .text').css({
                        'margin-left': '95px'
                    });
                }

                if (type === "custom-left") {
                    $('#follower-alert .text').css({
                        'margin-left': '25px'
                    });
                }
            }

            if (align) {
                switch (align) {
                    case "left":
                        $('#follower-alert .text').css({
                            'margin-left': '25px'
                        });
                        break;
                    case "center":
                        $('#follower-alert .text').css({
                            'margin-left': 'auto' //Originally 95px margin-left
                        });
                        break;
                }
            }

            if (alert) {
                $('#follower-alert').css('background-image', 'url(' + decodeURIComponent(alert) + ')');
            }

            if (sound) {
                alertSound = new Audio(decodeURIComponent(sound));
                alertSound.addEventListener("loadeddata", function () {
                    hide(function () {
                        if (getParameterByName("preview") === "true") {
                            newFollower("Test_user"); //Originally Test_user
                        }
                    });
                });
            } else {
                hide(function () {
                    if (getParameterByName("preview") === "true") {
                        newFollower("Test_user");
                    }
                });
            }
        }
    });
});
