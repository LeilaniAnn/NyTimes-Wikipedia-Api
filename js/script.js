function loadData() {
    // $ -- this object is a jQuery object
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var addy = $('#street').val();
    var city = $('#city').val();
    imageUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + addy + city;

    $.backstretch(imageUrl);
    console.log(addy);
    console.log(city);

    // NYTimes AJAX request goes here
    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=2a2f1cd1476045828b760a9c11484454";
    $.getJSON(nytUrl, function (data){

        $nytHeaderElem.text("Articles about " + city)
        articles = data.response.docs;
        for (var i =0; i< articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +  article.pub_date +'<br>'+'<a href="'+ article.web_url+'">' + article.headline.main + '</a>' + '<p>' + article.snippet +'</p>' + '<li>');
        console.log(nytUrl);
        };

    }).fail(function(e){
        $nytHeaderElem.html('<h6 class="text-danger"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Error retrieving NYTimes resources</h6>');
    });
    
    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";
    var wikiRequestTimeout = setTimeout(function(){
        // $wikiElem.text("failed to get Wikipedia resources").css({ 'color': 'red', 'font-size': '150%' });
        $wikiElem.html('<h6 class="text-danger"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Error retrieving Wikipedia resources</h6>');
    }, 2000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function (response) {
            var articleList = response[1];

            for (var i =0; i< articleList.length; i++) {
            var articleStr = articleList[i];
            var url = 'https://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
 
        
        };
        clearTimeout(wikiRequestTimeout); // to prevent timeout from running w/ success
    }
    });

    // })
    return false;
};

$('#form-container').submit(loadData);


