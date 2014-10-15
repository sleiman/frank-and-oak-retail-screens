_.templateSettings = {
interpolate: /\{\{(.+?)\}\}/g
};
    
APP = {
    Views: {},
    Models: {},
    Collections: {}
};


APP.Models.Slide = Backbone.Model.extend({
    // defaults: {
    //     id: 1,
    //     headline: 'Frank & Oak Retail Screens',
    //     caption: 'Welcome To the Store',
    //     layout: '',
    //     body: 'dark'
    // },

    show: function() {
        console.log(this.attributes.ID);
        this.getEl().show();

    },

    bodyColor: function() {
        console.log(this.body);
        return this.body;
    },
    getEl: function() {
        return $('#slide-' + this.attributes.ID);
    },

    getControl: function() {
        return $('.jump-to').eq(this.attributes.ID - 1);
    }
});


// APP.Collections.Slides = Backbone.Collection.extend({
//     model: APP.Models.Slide
// });


APP.Views.Slideshow = Backbone.View.extend({

    el: '#slideshow',
    slides: '#slideshow .slides',
    bg: 'body',
    controls: '#slideshow .controls',
    playPauseControl: '#slideshow .controls .toggle-play-pause',

    delay: 3000,
    currentIndex: 0,

    events: {
        'click .toggler': 'toggleVisibility',
        'click .toggle-play-pause': 'togglePlayPause',
        'click .jump-to': 'jumpTo'
    },

    quoteTemplate: _.template('<li id="slide-{{ id }}" class="slide {{ layout }}">' + '' + '<p class="text">{{ caption }}</p>' + '<p class="name">{{ name }}</p>' + '</li>'),
    promoTemplate: _.template('<div id="slide-{{ id }}" class="slide large-8 large-centered columns promo">    <img src="{{ img }}" alt="">    </div>'),
   
    controlTemplate: _.template('<li class="slide-control jump-to" data-index="{{ index }}">{{ human_readable_index }}</li>'),

    initialize: function() {
        
        _.bindAll(this, 'render', 'rotateSlides', 'togglePlayPause', 'play', 'pause', 'initialPlay', 'transition', 'jumpTo');
    },

    render: function() {

        var self = this;
        
        $(self.bg).addClass('black dark');
        this.collection.each(function(slide, i) {
            console.log(slide.attributes.ID);

            slug = slide.attributes.terms.category[0].slug;
            console.log(slug);
            if (slug == "quote"){
                // var template = $("#quote").html();
                // $(".content").html(_.template(template,{id:slide.attributes.ID,layout:'',caption:slide.attributes.title}));
                $(self.slides).append(self.quoteTemplate({id:slide.attributes.ID,layout:'',caption:slide.attributes.title, name:slide.attributes.meta.name}));
            } else {
                $(self.slides).append(self.promoTemplate({id:slide.attributes.ID,layout:'',caption:slide.attributes.slug, img:slide.attributes.meta.promo_image.url}));
            }
            
           
            $(self.controls).append(self.controlTemplate({
                index: i,
                human_readable_index: ++i
            }));
        });

        this.initialPlay();

        return this;
    },

    rotateSlides: function() {
        var self = this;
        
        var current = this.currentIndex;
        var next = this.currentIndex === (this.collection.length - 1) ? 0 : this.currentIndex + 1;
        console.log(next, current);
        this.transition(current, next);
    },

    transition: function(from, to) {
        var self = this;
        if($(self.bg).hasClass('black')){
        $(self.bg).removeClass('black').addClass('green');
        } else {
        $(self.bg).removeClass('green').addClass('black');
        }
        var current = this.collection.at(from);
        var next = this.collection.at(to);
        current.getEl().fadeOut('slow', function() {
            next.getEl().fadeIn('slow');
        });
        current.getControl().toggleClass('current');
        next.getControl().toggleClass('current');
        this.currentIndex = to;

    },

    toggleVisibility: function() {
        var slides = $(this.slides);
        slides.toggle();
        $(this.el).toggleClass('collapsed');
        if (slides.is(":visible")) {
            this.play();
        } else {
            this.pause();
        }
    },

    togglePlayPause: function() {
        if (this.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    },

    initialPlay: function() {
        // $(this.bg).addClass(this.collection.at(0).attributes.slug);
        this.collection.at(0).show();
        this.collection.at(0).getControl().toggleClass('current');
        this.play();
    },

    pause: function() {
        if (this.isPaused()) {
            return;
        }
        this.state = 'paused';
        clearInterval(this.intervalID);
        $(this.playPauseControl).toggleClass('playing', false);
    },

    play: function() {
        if (this.isPlaying()) {
            return;
        }
        this.state = 'playing';
        this.intervalID = setInterval(this.rotateSlides, this.delay);
        $(this.playPauseControl).toggleClass('playing', true);

    },

    jumpTo: function(e) {
        var next = $(e.currentTarget).data('index');
        this.pause();
        this.transition(this.currentIndex, next);

    },

    isPlaying: function() {
        return this.state === 'playing';
    },

    isPaused: function() {
        return !this.isPlaying();
    }

});




// Content from CMS (Wordpress JSON API)
var Content = Backbone.Model.extend({
});

var Contents = Backbone.Collection.extend({
model: APP.Models.Slide
});

var AllContents = new Contents();
AllContents.fetch({ 
url: "http://dev.tanios.ca/fao/wp/wp-json/posts?filter[taxonomy]=store&filter[term]=montreal", 
success: function() {
       
      APP.Slideshow = new APP.Views.Slideshow({collection: AllContents}).render();
       
  },
error: function(){
   console.log('There was some error in loading and processing the JSON file');
}
});


function startTime() {
    var today = new Date();
    months = ['January','Februart','March','April','May','June','July','August','September','October','November','December'],
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    if (h > 11){
        ampm = 'PM';
    } else {
        ampm = 'AM';
    }

    document.getElementById('liveDate').innerHTML =  days[today.getDay()]+', '+months[today.getMonth()]+' '+today.getDate()+', '+today.getFullYear();
    document.getElementById('liveTime').innerHTML = h+":"+m+" "+ampm;
    var t = setTimeout(function(){startTime()},500);
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

startTime();




function updateSong(){
    var cache = new LastFMCache();
    var lastfm = new LastFM({
    apiKey    : 'df4591d404090a0e8f471f288d49c3af',
    apiSecret : 'df758af54ff21e781ef326e85887b20d',
    cache     : cache
    });
  
    lastfm.user.getRecentTracks({user: 'dontanios'}, {success: function(data){
      document.getElementById('song').innerHTML = data.recenttracks.track[0].name;
      document.getElementById('artist').innerHTML = data.recenttracks.track[0].artist['#text'];
      // console.log(data.recenttracks.track[0]);
      // console.log(data.recenttracks.track[0].artist['#text']);
    }, error: function(code, message){
       console.log(message);
    }});
    setTimeout(updateSong, 60000);
}
updateSong();



// OLD STUFF

// APP.Slideshow = new APP.Views.Slideshow({
//     collection: new APP.Collections.Slides([
//         new APP.Models.Slide({
//         id: 1,
//         name: 'Sleiman Tanios',
//         caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati, expedita!',
//         layout: '',
//         body: 'black'
//     }),
//         new APP.Models.Slide({
//         id: 2,
//         name: 'Some Name',
//         caption: 'Quotes, more quotes!',
//         body: 'blue'
//     }),
//         new APP.Models.Slide({
//         id: 3,
//         name: 'More Name',
//         caption: 'Did you know that 100% of these quotes do not mean anything?',
//         body: 'blue'
//     }),
//         new APP.Models.Slide({
//         id: 4,
//         name: 'Bill Clinton',
//         caption: 'It all depens on what the definition of is, is.',
//         body: 'blue'
//     }),
//         new APP.Models.Slide({
//         id: 5,
//         name: 'Sleiman Tanios',
//         caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, neque!',
//         body: 'blue'
//     })
//         ])
// }).render();
