        $(document).ready(function() {
            function memeSpam(text, rate, maxfont) {
                for (var i = 0; i < rate; ++i) {
                    var fontSize = ((Math.random() * maxfont) + 10).toFixed();
                    var color = '#' + Math.round(0xffffff * Math.random()).toString(16);
                    var posx = Math.floor(Math.random() * 1200) + 1;
                    var posy = Math.floor(Math.random() * 1080) + 1;
                    var randomDelay = Math.floor(Math.random() * 2000) + 1;
                    var run = Math.floor(Math.random() * 2) + 1;
                    $newdiv = $('<div>').text(text).css({
                        'font-size': fontSize + 'px',
                        'color': color,
                        'position': 'absolute',
                        'left': posx + 'px',
                        'top': posy + 'px',
                        'opacity': 0.5,
                        'display': 'none'
                    });

                    if (run === 1) {
                        $newdiv.delay(randomDelay).appendTo('.meme-spammer').fadeIn(200).delay(600).fadeOut(500, function() {
                            $(this).remove();
                        });
                    }
                }
            }

            function memeSpamSlide(rate,text,maxfont) {
                for (var i = 0; i < rate; ++i) {
                    var posy = Math.floor(Math.random() * 1080) + 1;
                    var animationtime = Math.floor(Math.random() * 10) + 3;
                    var randomseconds = Math.floor(Math.random() * 5) + 1;
                    var fontsize = Math.floor(Math.random() * maxfont) + 20;
                    $newdiv = $('<div class="slideleft">').text(text).css({
                        'font-size': fontsize + "px",
                        'position': 'absolute',
                        'right': '-250px',
                        'top': posy + 'px',
                        'display': 'block',
                        'width': 'auto',
                        'animation-duration': animationtime + 's',
                        'animation-delay': randomseconds + 's'
                    });
                    $newdiv.appendTo('.meme-spammer');
                    $(".slideleft").one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                        function(e) {
                            $(this).remove();
                        });
                }
            }

            setInterval(function() {
                $.ajax({
                    url: 'http://localhost:8989/current',
                    dataType: 'json',
                    type: 'get',
                    cache: false,
                    success: function(data) {
                        if (/miiro/i.test(data.beatmap)) {
                            memeSpam(
                                text = "TATOE!~",
                                rate = 3,
                                maxfont = 60
                                );
                        }
                        if ((/eien/i.test(data.beatmap)) && /friends/i.test(data.beatmap)) {
                            memeSpam(
                                text = "(✿◠‿◠) 〜ITSUDEMOO (✿◠‿◠) 〜",
                                rate = 3,
                                maxfont = 40
                                );
                        }
                        if ((/dragonforce/i.test(data.beatmap)) && /defenders/i.test(data.beatmap)) {
                            memeSpam(
                                text = "HOLD ON STAY STRONG",
                                rate = 3,
                                maxfont = 40
                                );
                        }
                        if ((/united/i.test(data.beatmap)) && /stolen/i.test(data.beatmap)) {
                            memeSpam(
                                text = "NEVER GIVE UP",
                                rate = 3,
                                maxfont = 40
                                );
                        }
                        if ((/brain/i.test(data.beatmap)) && /power/i.test(data.beatmap)) {
                            memeSpamSlide(
                                rate = 1,
                                text = "O-oooooooooo AAAAE-A-A-I-A-U- JO-oooooooooooo AAE-O-A-A-U-U-A- E-eee-ee-eee AAAAE-A-E-I-E-A- JO-ooo-oo-oo-oo EEEEO-A-AAA-AAAA",
                                maxfont = 25
                                );
                        }
                        if ((/big/i.test(data.beatmap)) && /black/i.test(data.beatmap) && /brown/i.test(data.beatmap)) {
                            memeSpamSlide(
                                rate = 3,
                                text = Array(Math.floor(Math.random() * 20) + 5).join("A"),
                                maxfont = 30
                                );
                        }
                        if ((/dadadada/i.test(data.beatmap))) {
                            memeSpamSlide(
                                rate = 3,
                                text = Array(Math.floor(Math.random() * 20) + 5).join("DA"),
                                maxfont = 30
                                );
                        }
                        if ((/jojo/i.test(data.beatmap)) && /end/i.test(data.beatmap) && /world/i.test(data.beatmap)) {
                            memeSpamSlide(
                                rate = 3,
                                text = "ORA ORA ORA",
                                maxfont = 50
                                );
                        }
                    }
                });
    }, 500);

        /* http://stackoverflow.com/questions/4796743/random-position-of-divs-in-javascript */
    });
