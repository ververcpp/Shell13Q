$(document).ready(function () {
    
    function Sections(page) {
        this.page = page;
    }

    Sections.prototype = {
        map : function() {
            this.names = $("article[id]").map(function(index, element) {
                return {
                    id: this.id,
                    offset: $(this).offset().top
                };
            }).get();
        },

        highlight: function() {
            var scroll = this.page.window.scrollTop(),
                articleID = this.names[this.names.length - 1].id,
                firstArticleHeight = $("article[id]").first().outerHeight();

            // console.log("firstArticleHeight:" + firstArticleHeight);
            // console.log("scroll: " + scroll);
            // for (var j = 0, l = this.names.length; j < l; j++) {
            //     console.log("id: " + this.names[j].id + "\noffset: " + this.names[j].offset);
            // }

            for (var i = 0, l = this.names.length; i < l; i++) {
                if (scroll > (firstArticleHeight - 20) && this.names[i].offset > ($(window).height()/2 + scroll)) {
                    articleID = this.names[i - 1].id;
                    break;
                } else if (scroll <= (firstArticleHeight - 20)) {
                    articleID = this.names[0].id;
                    break;
                }
            }
            //console.log("articleID: " + articleID);
            var page = this.page,
                nav = page.nav;
            //console.log("page.article: " + page.article);
            if (articleID !== page.article) {
                nav.filter(".nav-" + page.article).removeClass("current");
                nav.filter(".nav-" + articleID).addClass("current");

                page.article = articleID;
            }
        }
        
    };

    function Page() {
        $.extend(true, this, {
            window: $(window),
            content: $("#content"),
            nav: $("nav > ul > li"),
            article: null
        });

        this.sections = new Sections(this);
        this.init();
    }

    Page.prototype = {
        init: function() {
            var that = this;

            $.extend(this, {
                scrollLast: 0,
                resizeTimeout: null
            })

            this.window.scroll(function() {
                //console.log("scrolling!!!!!!");
                that.onScroll();
            });

            $(window).resize(function() {
                that.onResize();
            })

            this.sections.map();
            setTimeout(function() {
                that.sections.highlight();
            }, 10);
        },

        onScroll: function() {
            //console.log("--have scroll");
            if ((+new Date()) - this.scrollLast > 50) {
                this.scrollLast = +new Date();
                this.sections.map();
                this.sections.highlight();
            }
        },

        onResize: function() {
            //console.log("--have resized");
            clearTimeout(this.resizeTimeout);

            var that = this;
            this.resizeTimeout = setTimeout(function() {
                that.sections.map();
                that.sections.highlight();
            }, 100);
        }
    }

    var Shell13Q = new Page();

    var currentLanguage = $("#nav-languages .active a").text();
    console.log("current:" + currentLanguage);
    $(".current-language").text(currentLanguage);
    $(".current-language").click(function() {
        $(this).toggleClass("clicked");
        $("#nav-languages").toggle();
    });

    $("pre").addClass("prettyprint").addClass("lang-bsh");
    prettyPrint();

    $("#nav-button").bind("click", function() {
        $("#nav-main, #nav-bar, #content, header").toggleClass("activeMenu");
    });

    $("#nav-titles a, header, #content").bind("click", function() {
        $("#nav-main, #nav-bar, header, #content").removeClass("activeMenu");
    });
});