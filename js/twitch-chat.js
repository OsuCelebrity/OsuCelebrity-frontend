            // Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values cuz lazy
            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            calculateColorBackground = function (color) {
                // Converts HEX to YIQ to judge what color background the color would look best on
                color = String(color).replace(/[^0-9a-f]/gi, '');
                if (color.length < 6) {
                    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
                }

                var r = parseInt(color.substr(0, 2), 16);
                var g = parseInt(color.substr(2, 2), 16);
                var b = parseInt(color.substr(4, 2), 16);
                var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                return (yiq >= 128) ? "dark" : "light";
            }

            calculateColorReplacement = function (color, background) {
                // Modified from http://www.sitepoint.com/javascript-generate-lighter-darker-color/
                var inputColor = color,
                    rgb = "#",
                    brightness, c, i;

                color = String(color).replace(/[^0-9a-f]/gi, '');
                if (color.length < 6) {
                    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
                }

                (background === "light") ? (brightness = "0.2") : (brightness = "-0.5");

                for (i = 0; i < 3; i++) {
                    c = parseInt(color.substr(i * 2, 2), 16);
                    if(c < 10) c = 10;
                    c = Math.round(Math.min(Math.max(0, c + (c * brightness)), 255)).toString(16);
                    rgb += ("00" + c).substr(c.length);
                }

                if(inputColor === rgb) {
                    if(background === "light") {
                        return "#ffffff";
                    } else {
                        return "#000000";
                    }
                } else {
                    return rgb;
                }
            }

            // Emoticon Code taken from Twitch
            Chat = {
                clearChat: function(nick) {
                    $('.chat_line[data-nick='+nick+']').remove();
                },
                escape: function(message) {
                    return message.replace(/</g,'&lt;').replace(/>/g, '&gt;');
                },
                extraEmoteTemplate: function(emote) {
                    return '<img class="emoticon ' + emote.source + '-emo-' + emote.id + '" src="http://' + emote['1x'] + '" srcset="http://' + emote['2x'] + ' 2x" />';
                },
                emoteTemplate: function(id) {
                    return '<img class="emoticon ttv-emo-' + id + '" src="https://static-cdn.jtvnw.net/emoticons/v1/' + id + '/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/' + id + '/2.0 2x" />';
                },
                emoticonize: function(message, emotes) {
                    if(!emotes) return [message];

                    var tokenizedMessage = [];

                    var emotesList = Object.keys(emotes);

                    var replacements = [];

                    emotesList.forEach(function(id) {
                        var emote = emotes[id];

                        for(var i=emote.length-1; i>=0; i--) {
                            replacements.push({ id: id, first: emote[i][0], last: emote[i][1] });
                        }
                    });

                    replacements.sort(function(a, b) {
                        return b.first - a.first;
                    });

                    // Tokenizes each character into an array
                    // punycode deals with unicode symbols on surrogate pairs
                    // punycode is used in the replacements loop below as well
                    message = punycode.ucs2.decode(message);

                    replacements.forEach(function(replacement) {
                        // Unshift the end of the message (that doesn't contain the emote)
                        tokenizedMessage.unshift(punycode.ucs2.encode(message.slice(replacement.last+1)));

                        // Unshift the emote HTML (but not as a string to allow us to process links and escape html still)
                        tokenizedMessage.unshift([ Chat.emoteTemplate(replacement.id) ]);

                        // Splice the unparsed piece of the message
                        message = message.slice(0, replacement.first);
                    });

                    // Unshift the remaining part of the message (that contains no emotes)
                    tokenizedMessage.unshift(punycode.ucs2.encode(message));

                    return tokenizedMessage;
                },
                extraEmoticonize: function(sender, message, emote) {
                    if(emote.restrictions) {
                        if(emote.restrictions.channels && emote.restrictions.channels.length && emote.restrictions.channels.indexOf(Chat.vars.channel) === -1) return message;

                        if(emote.restrictions.games && emote.restrictions.games.length) return message;
                    }

                    return message.replace(emote.code, Chat.extraEmoteTemplate(emote));
                },
                extraMessageTokenize: function(sender, message) {
                    var tokenizedString = message.split(' ');

                    for(var i=0; i<tokenizedString.length; i++) {
                        var piece = tokenizedString[i];

                        var test = piece.replace(/(^[~!@#$%\^&\*\(\)]+|[~!@#$%\^&\*\(\)]+$)/g, '');
                        var emote = Chat.vars.extraEmotes[test] || Chat.vars.extraEmotes[piece];

                        if(emote) {
                            piece = Chat.extraEmoticonize(sender, piece, emote);
                        } else {
                            piece = Chat.escape(piece);
                        }

                        tokenizedString[i] = piece;
                    }

                    return tokenizedString.join(' ');
                },
                insert: function(nick, userData, message, action, rawEmotes) {
                    var nick = nick || "Chat",
                        userData = userData || {},
                        message = message || "",
                        action = action || false;

                    var $newLine = $('<div></div>');
                    $newLine.addClass('chat_line');
                    $newLine.attr('data-nick', nick);
                    $newLine.attr('data-timestamp', Date.now());

                    var $time = $('<span></span>');
                    $time.addClass('time_stamp')
                    $time.text(new Date().toLocaleTimeString().replace(/^(\d{0,2}):(\d{0,2}):(.*)$/i, '$1:$2'));
                    $newLine.append($time);

                    if(typeof userData.userType === 'string' && userData.userType !== 'normal') {
                        var $tag = $('<span></span>');
                        $tag.addClass(userData.userType);
                        $tag.addClass('tag')
                        $tag.html('&nbsp;');
                        $newLine.append($tag);
                    }

                    if(nick === Chat.vars.channel) {
                        var $tag = $('<span></span>');
                        $tag.addClass('broadcaster');
                        $tag.addClass('tag')
                        $tag.html('&nbsp;');
                        $newLine.append($tag);
                    }

                    ["turbo", "subscriber"].forEach(function(type) {
                        if(userData[type] === true) {
                            var $tag = $('<span></span>');
                            $tag.addClass(type);
                            $tag.addClass('tag')
                            $tag.html('&nbsp;');
                            $newLine.append($tag);
                        }
                    });

                    if(
                        (!Chat.vars.themeNameCC && Chat.vars.style !== 'clear') ||
                        (Chat.vars.themeNameCC && Chat.vars.themeNameCC.enabled)
                    ) {
                        var bg = (Chat.vars.style !== 'clear') ? Chat.vars.style : Chat.vars.themeNameCC.kind;

                        if(/^#[0-9a-f]+$/i.test(userData.color)) {
                            while(calculateColorBackground(userData.color) !== bg) {
                                userData.color = calculateColorReplacement(userData.color, calculateColorBackground(userData.color));
                            }
                        }
                    }

                    var $formattedUser = $('<span></span>');
                    $formattedUser.addClass('nick');
                    $formattedUser.css('color', userData.color);
                    $formattedUser.html(userData.displayName ? userData.displayName : nick);
                    $newLine.append($formattedUser);
                    action ? $newLine.append('&nbsp;') : $newLine.append(':&nbsp;');


                    var $formattedMessage = $('<span></span>');
                    $formattedMessage.addClass('message');
                    if(action) $formattedMessage.css('color', userData.color);

                    var emotes = {};

                    if(rawEmotes) {
                        rawEmotes = rawEmotes.split('/');

                        rawEmotes.forEach(function(emote) {
                            emote = emote.split(':');

                            if(!emotes[emote[0]]) emotes[emote[0]] = [];

                            var replacements = emote[1].split(',');
                            replacements.forEach(function(replacement) {
                                replacement = replacement.split('-');

                                emotes[emote[0]].push([ parseInt(replacement[0]) , parseInt(replacement[1]) ]);
                            });
                        });
                    }

                    var tokenizedMessage = Chat.emoticonize(message, emotes);

                    for(var i=0; i<tokenizedMessage.length; i++) {
                        if(typeof tokenizedMessage[i] === 'string') {
                            tokenizedMessage[i] = Chat.extraMessageTokenize(userData, tokenizedMessage[i]);
                        } else {
                            tokenizedMessage[i] = tokenizedMessage[i][0];
                        }
                    }

                    message = tokenizedMessage.join(' ');

                    $formattedMessage.html(message);
                    $newLine.append($formattedMessage);

                    Chat.vars.queue.push($newLine.wrap('<div>').parent().html());
                },
                load: function(channel) {
                    Chat.vars.channel = channel;

                    if(Chat.vars.theme) {
                        Chat.loadTheme(Chat.vars.theme);
                    } else {
                        $('#chat_box').attr('class', Chat.vars.style);
                    }

                    Chat.loadEmotes(function() {
                        Chat.loadSubscriberBadge(function() {
                            Chat.insert(null, null, "Connecting to chat server..");

                            var socket = io('https://tmi-relay.nightdev.com/');
                            socket.on('ohai', function () {
                                Chat.insert(null, null, "Connected.");
                                socket.emit('join', Chat.vars.channel);
                            });
                            socket.on('much connect', function () {
                                Chat.insert(null, null, "Waiting to join channel...");
                                socket.once('joined', function () {
                                    Chat.insert(null, null, "Joined channel: "+Chat.vars.channel+".");
                                });
                            });
                            socket.on('message', function(data) {
                                if(getParameterByName('bot_activity').toLowerCase() !== 'true') {
                                    if(data.message.charAt(0) === '!') return;
                                    if(/bot$/.test(data.nick)) return;
                                }

                                Chat.insert(data.nick, data.userData, data.message, data.action, data.emotes);
                            });
                            socket.on('clearchat', function(user) {
                                Chat.clearChat(user);
                            });
                            socket.on('disconnect', function(user) {
                                Chat.insert(null, null, "You were disconnected from the socket server.");
                            });

                            Chat.vars.socket = socket;
                        });
                    });
                },
                loadEmotes: function(callback) {
                    ['emotes', 'channels/' + encodeURIComponent(Chat.vars.channel)].forEach(function(endpoint) {
                        $.getJSON('https://api.betterttv.net/2/' + endpoint).done(function(data) {
                            data.emotes.forEach(function(emote) {
                                Chat.vars.extraEmotes[emote.code] = {
                                    restrictions: emote.restrictions,
                                    code: emote.code,
                                    source: 'bttv',
                                    id: emote.id,
                                    '1x': data.urlTemplate.replace('{{id}}', emote.id).replace('{{image}}','1x'),
                                    '2x': data.urlTemplate.replace('{{id}}', emote.id).replace('{{image}}','2x')
                                };
                            });
                        });
                    });

                    ['set/global', 'room/' + encodeURIComponent(Chat.vars.channel)].forEach(function(endpoint) {
                        $.getJSON('https://api.frankerfacez.com/v1/' + endpoint).done(function(data) {
                            if(typeof data.sets !== 'object') return;

                            Object.keys(data.sets).forEach(function(set) {
                                set = data.sets[set];

                                if(!set.emoticons || !Array.isArray(set.emoticons)) return;

                                set.emoticons.forEach(function(emoticon) {
                                    if(!emoticon.name || !emoticon.id) return;
                                    if(typeof emoticon.name !== 'string' || typeof emoticon.id !== 'number') return;

                                    if(Chat.vars.extraEmotes[emoticon.name]) return;

                                    if(!emoticon.urls || typeof emoticon.urls !== 'object') return;

                                    if(typeof emoticon.urls[1] !== 'string') return;
                                    if(emoticon.urls[2] && typeof emoticon.urls[2] !== 'string') return;

                                    Chat.vars.extraEmotes[emoticon.name] = {
                                        source: 'ffz',
                                        code: emoticon.name,
                                        id: emoticon.id,
                                        '1x': emoticon.urls[1],
                                        '2x': emoticon.urls[2] || emoticon.urls[1].replace(/1$/, '2')
                                    };
                                });
                            });
                        });
                    });

                    callback(true);
                },
                loadTheme: function(id) {
                    $.getJSON("themes/" + encodeURIComponent(id) + ".json").done(function(e) {
                        if(!e.key) return;
                        var $css = $('<style></style>');
                        $css.attr('type', 'text/css');
                        $css.html(e.css);
                        $("head").append($css);
                        Chat.vars.themeNameCC = e.nameCC;
                    });
                },
                loadSubscriberBadge: function(callback) {
                    $.getJSON("https://api.twitch.tv/kraken/chat/" + Chat.vars.channel + "/badges?callback=?").done(function(e) {
                        callback(true);
                        if(!e.subscriber) return;
                        var $css = $('<style></style>');
                        $css.attr('type', 'text/css');
                        $css.html('.subscriber { background-image: url("' + e.subscriber.image.replace('http:', 'https:') + '"); }');
                        $("head").append($css);
                    });
                },
                vars: {
                    queue: [],
                    maxDisplayTime: getParameterByName('fade') === 'true' ? 30 : parseInt(getParameterByName('fade')),
                    queueTimer: setInterval(function() {
                        if(Chat.vars.queue.length > 0) {
                            var newLines = Chat.vars.queue.join('');
                            Chat.vars.queue = [];
                            $('#chat_box').append(newLines);
                            $('#chat_box')[0].scrollTop = $('#chat_box')[0].scrollHeight;
                            var linesToDelete = $('#chat_box .chat_line').length - Chat.vars.max_messages;

                            if(linesToDelete > 0) {
                                for(var i=0; i<linesToDelete; i++) {
                                    $('#chat_box .chat_line').eq(0).remove();
                                }
                            }
                        } else if(getParameterByName('fade')) {
                            var messagePosted = $('#chat_box .chat_line').eq(0).data('timestamp');
                            if((Date.now()-messagePosted)/1000 >= Chat.vars.maxDisplayTime) {
                                $('#chat_box .chat_line').eq(0).addClass('on_out').fadeOut(function() {
                                    $(this).remove();
                                });
                            }
                        }
                    }, 250),
                    style: getParameterByName('style').toLowerCase() || 'clear',
                    theme: getParameterByName('theme').toLowerCase(),
                    themeNameCC: null,
                    socket: null,
                    channel: null,
                    max_messages: 100,
                    extraEmotes: {}
                }
            };

            $(document).ready(function(){
              Chat.load(getParameterByName('channel').toLowerCase() || 'forsenlol');
            });
