$(document).ready(function() {
    var settings = {
        subreddits: '/r/osugame+anime+animenocontext+anime_irl+Animemes+AnimeThemes+animegifs+animegifs+awwnime+Animewallpaper',
        // subreddits: '/r/Unexpected',
        // subreddits: '/r/AnimeThemes',
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
        autoplaySpeed: 2000,
        playingVideo: false,
        slickSettings: {
            autoplay: false,
            speed: 500,
            arrows: false,
            fade: true,
            infinite: true,
            pauseOnHover: false
        }
    },
    slides = [],
    $slider = $("#slider");

    function preloadAndFilter(images) {
        $.each(images, function(index, item) {
            if (item.type === "image") {
                var img = new Image();

                img.onload = function() {
                    var width = img.width,
                    height = img.height;

                    if ((width/height) < 1) {
                        item.skip = true;
                    }
                    console.log("Preloaded: " + img.src + " (" + width + "x" + height + ") Aspect Ratio: " + (width/height), item.skip, item.title);
                }

                img.src = item.url;
            }
        });

        setTimeout(function(){
            console.table(slides);
        }, 2000);
    }

    function startSlider(index) {
        addSlide(0);
        settings.firstSlidesAdded = true;

        $slider.on("init", function() {
            setTimeout(function(){
                addSlide(1);
                $slider.slick("slickNext");
            }, settings.autoplaySpeed);
        }).on("beforeChange", function() {

        }).on("afterChange", function(slick, currentSlide) {
            settings.activeIndex++;
            if (!settings.initialized) {
                initialization();
                setTimeout(function(){
                    $slider.slick("slickNext");
                }, settings.autoplaySpeed);
            } else {
                testForVideo();
                $slider.slick("slickRemove", currentSlide.currentSlide - 1);
                addSlide();
                setTimeout(function() {
                    if ( !settings.playingVideo ) {
                        $slider.slick('slickNext');
                    }
                }, settings.autoplaySpeed);
            }
        }).slick(settings.slickSettings);
    }

    function createSlideDiv(index) {
        var $div = $("<div class='wallpaper'>"),
            $infoWrapper = $("<div class='wallpaper-info'>"),
            $title = $("<div class='wallpaper-title'>").text(slides[index].title),
            $subreddit = $("<div class='wallpaper-subreddit'>").text("/r/" + slides[index].subreddit + " (" + settings.activeIndex + ")");

        if (slides[index].type === "image") {
            var $bgImg = $("<div class='bg-blur' />"),
            $img = $("<img />");

            $bgImg.attr("style", 'background-image: url("' + slides[index].url + '");');
            $img.attr("src", slides[index].url);
            $div.append($bgImg).append($img);
        } else if (slides[index].type === "gfycat") {
            var $video = $("<video controls muted />");

            gfycatConvert(slides[index].url, $video);
            $div.addClass("video").append($video);
        } else if (slides[index].type === "gifv") {
            var $video = $("<video controls muted />"),
                $bgImg = $("<div class='bg-blur' />");

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
            var $video = $("<video controls muted />");

            $video.append($("<source />").attr({
                'src': slides[index].url,
                'type': "video/webm"
            }));

            $div.addClass("video").append($video);
        }

        $infoWrapper.append($title).append($subreddit);
        $div.append($infoWrapper);

        if (!settings.firstSlidesAdded) {
            $slider.append($div);
            settings.activeIndex++;
        } else {
            $slider.slick('slickAdd', $div);
        }
    }

    function addSlide(addingIndex) {
        if ( addingIndex == null ) {
            for (settings.activeIndex; settings.activeIndex < slides.length; settings.activeIndex++) {
                if ( slides[settings.activeIndex].skip === false ) break
            }

            if ( settings.activeIndex < slides.length) {
                createSlideDiv(settings.activeIndex);
            }
        } else {
            createSlideDiv(addingIndex);
        }
    }

    function gfycatConvert(url, elem) {
        var name = url.match(/gfycat.com\/(\w+)/i)[1];

        $.ajax({
            url: 'https://gfycat.com/cajax/get/' + name,
            dataType: "jsonp",
            success: function(data) {
                elem.append($("<source />").attr({
                    'src': data.gfyItem.webmUrl,
                    'type': "video/webm"
                }));
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

    function testForVideo() {
        if ($(".slick-active").hasClass("video")) {
            settings.playingVideo = true;
            console.log("TRUUUUUUU");
            $(".slick-active video").get(0).play();
        } else {

        }
    }

    function initialization() {
        createSlideDiv(2);
        settings.initialized = true;
    }

    function successAjax(data) {
        console.log("Data object: ", data);
        settings.after = "&after=" + data.data.after;

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

        preloadAndFilter(slides);

        if (settings.firstSlidesAdded === false) {
            startSlider(settings.activeIndex);
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

        slides.push(slide);
    }

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

    function getRedditImages() {
        $.ajax({
            url: "http://www.reddit.com" + settings.subreddits + ".json?jsonp=?" + settings.after + "&",
            dataType: 'jsonp',
            success: successAjax,
            error: function(err) {
                console.log("error", err)
            },
            404: function(err) {
                console.log("404", err)
            }
        });
    }

    getRedditImages();
});
