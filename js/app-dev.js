$(function(){
  var Content = Backbone.Model.extend({
  });
  var Contents = Backbone.Collection.extend({
    model: Content, 
  });
  var AllContents = new Contents();
    AllContents.fetch({ 
    url: "http://dev.tanios.ca/fao/wp/wp-json/posts?filter[taxonomy]=store&filter[term]=montreal", 
    success: function() {
           
          var app = new App({ el: $(".hello") });
           
      },
    error: function(){
       console.log('There was some error in loading and processing the JSON file');
    }
  });
   
    var App = Backbone.View.extend({
       
        initialize: function(){
        _.bindAll(this, 'render', 'getType','showTemplate');
        this.getType();
            
        },
        render: function(){
           alert('ok');
            
        },
        getType: function(){
           for (var i = 0, length = AllContents.length; i < length; i++) {
                
                var type = AllContents.models[i].attributes.terms.category[0].slug;
                this.showTemplate(type);

                //push the model object
                // this.push(carObject); 
                } 
                this.render(); 
        },
        showTemplate: function(type){
            var template = _.template( $("#"+type).html(), {} );
            this.$el.html( template );
        }
        
    });
     
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
