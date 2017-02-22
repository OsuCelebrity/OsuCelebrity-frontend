$(document).ready(function() {
    var settings = {
        subreddits: '/r/osugame+anime+animenocontext+anime_irl+Animemes+AnimeThemes+animegifs+animegifs+awwnime+Animewallpaper',
        after: '',
        imageTypes: {
            image: 'image',
            gfycat: 'gfycat',
            gifv: 'gifv',
            webm: 'webm',
            animethemewebm: 'animethemewebm'
        },
        goodExtensions: ['.jpg', '.jpeg', '.gif', '.bmp', '.png', '.webm'],
        firstSlidesAdded: false,
        initialized: false,
        imagesPreloaded: false,
        activeIndex: 0,
        autoplaySpeed: 10000
    },
    slides = [],
    $slider = $("#slider");

    function preloadAndFilter(images) {
        $.each(images, function(index, item) {
            /* We don't want to check ALL of the items in our
            *  slide array so we'll just only check images
            *  and newest items inside of it */
            if (item.type === "image" && index >= settings.activeIndex) {
                var img = new Image();

                img.onload = function() {
                    var width = img.width,
                    height = img.height;

                    /* Checking to make sure the aspect ratio
                    *  is somewhat decent, otherwise we'll skip */
                    if ((width/height) < 1) {
                        item.skip = true;
                    }

                    console.log("Preloaded: " + img.src + " (" + width + "x" + height + ") Aspect Ratio: " + (width/height), item.skip, item.title);
                }

                img.src = item.url;
            }
        });
    }

    function startSlider() {
        /* Add event listener to our fallback image */
        $("#slider .wallpaper").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
            setTimeout(function() {
                addSlide();
            }, settings.autoplaySpeed);
        });

        /* Give some time for
        *  first images to load */
        setTimeout(function(){
            createSlideDiv(0);
        }, 3000);

        settings.startSlider = true;
    }

    function createSlideDiv(index) {
        var $div = $("<div class='wallpaper'>"),
            $infoWrapper = $("<div class='wallpaper-info'>"),
            $title = $("<div class='wallpaper-title'>").text(slides[index].title),
            $subreddit = $("<div class='wallpaper-subreddit'>").text("/r/" + slides[index].subreddit + " (" + settings.activeIndex + ")"),
            isVideo = false,
            animeTheme = false;

        if (slides[index].type === "image") {
            var $bgImg = $("<div class='bg-blur' />"),
                $img = $("<img />");

            $bgImg.attr("style", 'background-image: url("' + slides[index].url + '");');
            $img.attr("src", slides[index].url);
            $div.append($bgImg).append($img);
        } else if (slides[index].type === "gfycat") {
            var $video = $("<video muted />"),
                $bgImg = $("<div class='bg-blur' />");
                isVideo = true;

            $bgImg.attr("style", 'background-image: url("' + gfycatConvert(slides[index].url, $bgImg, "poster") + '");');
            gfycatConvert(slides[index].url, $video);
            $div.append($bgImg).addClass("video").append($video);
        } else if (slides[index].type === "gifv") {
            var $video = $("<video muted />"),
                $bgImg = $("<div class='bg-blur' />");
                isVideo = true;

            $bgImg.attr("style", 'background-image: url("' + gifvConvert(slides[index].url, null, true) + '");');
            gifvConvert(slides[index].url);
            $video.append($("<source />").attr({
                'src': gifvConvert(slides[index].url, "webm"),
                'type': "video/webm"
            })).append($("<source />").attr({
                'src': gifvConvert(slides[index].url, "mp4"),
                'type': "video/mp4"
            }));

            $div.addClass("video").append($bgImg).append($video);
        } else if (slides[index].type === "animethemewebm") {
            var $video = $("<video style='width: 100%;' muted />");
            animeTheme = true;

            $video.append($("<source />").attr({
                'src': slides[index].url,
                'type': "video/webm"
            }));

            $div.addClass("video").append($video);
        }

        $infoWrapper.append($title).append($subreddit);
        $div.append($infoWrapper);

        $.when($div.appendTo($slider).addClass("queued")).then(function() {
            $div.prev().removeClass("queued").addClass("active");
            $div.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
                var tempIndex = settings.activeIndex;

                /* Remove previous slides to be lag-free! */
                $div.prevAll().remove();

                if (isVideo === true) {
                    $video.on("ended", function() {
                        addSlide();
                    }).get(0).play();
                } else if (animeTheme === true) {
                    // duration is returned as NaN sometimes so "0" for fallback.
                    var randomTime = Math.floor(Math.random() * ($video.get(0).duration - 10)) + 1 || 0;

                    $video.get(0).currentTime = randomTime;
                    $video.on("ended", function() {
                        addSlide();
                    }).get(0).play();
                    setTimeout(function() {
                        addSlide();
                    }, settings.autoplaySpeed * 2);
                } else {
                    setTimeout(function() {
                        addSlide();
                    }, settings.autoplaySpeed);
                }

                /* Backup just in case if the slides didn't move */
                setTimeout(function() {
                    if (tempIndex === settings.activeIndex) {
                        addSlide();
                    }
                }, 30000);
            });
        });
    }

    function addSlide(addingIndex) {
        settings.activeIndex++;

        if ( addingIndex == null ) {
            for (settings.activeIndex; settings.activeIndex < slides.length; settings.activeIndex++) {
                if ( slides[settings.activeIndex].skip === false ) break
            }

            /* Create next slide or generate new
            *  images and continue to next slide */
            if ( settings.activeIndex < slides.length - 3) {
                createSlideDiv(settings.activeIndex);
            } else {
                console.log("Active Index is " + settings.activeIndex + " and slides length is " + slides.length + "(" + (slides.length - 2) + ")");
                getRedditImages();
            }

        } else {
            createSlideDiv(addingIndex);
        }
    }

    function gfycatConvert(url, elem, type) {
        var name = url.match(/gfycat.com\/(\w+)/i)[1];

        $.ajax({
            url: 'https://gfycat.com/cajax/get/' + name,
            dataType: "jsonp",
            success: function(data) {
                if (type === "poster") {
                    elem.css({
                        'background-image': "url('" + data.gfyItem.posterUrl + "')"
                    });
                } else {
                    elem.append($("<source />").attr({
                        'src': data.gfyItem.webmUrl,
                        'type': "video/webm"
                    }));
                }
            }
        });
    }

    function gifvConvert(url, suffix, poster) {
        if (poster) {
            return url.replace(/\.\w+$/, '') + "h.jpg"
        } else {
            return url.replace(/\.\w+$/, '') + "." + suffix;
        }
    }

    /* Main function for when the API successfully retrieves us info */
    function successAjax(data) {
        console.log("Data object: ", data);
        settings.after = "&after=" + data.data.after;

        /* Iterates through each object and filter over them
        *  so we don't get any NSFW content. Also adds in the
        *  initial key:values for us to use later */
        $.each(data.data.children, function (i, item) {
            if (!item.data.over_18) {
                addSlideArray({
                    url: item.data.url,
                    title: item.data.title,
                    subreddit: item.data.subreddit,
                    score: item.data.score,
                    skip: false
                });
            }
        });

        console.table(slides);

        /* After all the slides are in the array we'll preload
        *  all images asynchronously and do some more filtering */
        preloadAndFilter(slides);

        /* Starts the slider */
        if (!settings.initialized) {
            startSlider();
        }
    }

    function addSlideArray(slide) {
        // Checks for what type of url given
        if (slide.url.indexOf('gfycat.com') >= 0) {
            slide.type = settings.imageTypes.gfycat;
        } else if (slide.url.search(/^http.*imgur.*gifv?$/) > -1) {
            slide.type = settings.imageTypes.gifv;
        } else if (slide.url.indexOf('//osu.ppy.sh/ss/') >= 0) {
            slide.type = settings.imageTypes.image;
        } else if (slide.url.indexOf('.webm') >= 0 && slide.subreddit === 'AnimeThemes') {
            slide.type = settings.imageTypes.animethemewebm;
        } else if (slide.url.indexOf('.webm') >= 0) {
            slide.type = settings.imageTypes.webm;
        } else if (isImageExtension(slide.url)) {
            slide.type = settings.imageTypes.image;
        } else {
            console.log('cannot display url as image: ' + slide.url);
            return;
        }

        /* If it falls under any of our
        *  previous checks we'll push
        *  to our main slides array to
        *  be used in the slider later */
        slides.push(slide);
    }

    /* Small function as a final check
    *  to see if the URL is usable */
    function isImageExtension(url) {
        var dotLocation = url.lastIndexOf('.');
        if (dotLocation < 0) {
            console.log("Skipped no dot: " + url);
            return false;
        }
        var extension = url.substring(dotLocation);

        if (settings.goodExtensions.indexOf(extension) >= 0) {
            return true;
        } else {
            console.log("Skipped bad extension: " + url);
            return false;
        }
    }

    /* AJAX call to Reddit's API. When this function is called
    *  anytime other than the first it will use the settings.after
    *  to continue from where the supplied objects left off. */
    function getRedditImages() {
        $.ajax({
            url: "http://www.reddit.com" + settings.subreddits + ".json?jsonp=?" + settings.after + "&",
            dataType: 'jsonp',
            success: successAjax,
            /* I'm too lazy to try to debug potential errors so it
            *  will just reload the page and start over if anything
            *  unexpected happens */
            error: function(err) {
                console.log("error", err)
                window.location.reload(true);
            },
            404: function(err) {
                console.log("404", err)
                window.location.reload(true);
            }
        });
    }

    /* First function called to start everything */
    getRedditImages();
});
