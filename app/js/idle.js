$(".wallpaper-wrapper").slick({
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    arrows: false,
    fade: true,
    infinite: true,
    pauseOnHover: false
});

window.setInterval(function () {
    $(".wallpaper-video").get(0).play();
}, 500);


$('.wallpaper-wrapper').on('beforeChange', function () {
    setTimeout(
        function () {
            $(".wallpaper-video").get(0).currentTime = 0;

        }, 0);
});
