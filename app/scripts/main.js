//global variable
var searchValue;

// searchbar handler
$(function() {
	var searchField = $('#query'),
		icon = $('#youtube-form--btn');

	//focus handler
	$(searchField).on('focus', function(){
		$(this).animate({
			width:'100%'
		}, 400);
		$(icon).animate({
			right:'1%'
		}, 400); 
	});

	//blur event handler
	$(searchField).on('blur', function(){
		if(searchField.val() === '') {
			$(this).animate({
				width: '70%'
			}, 400, function() {});
			$(icon).animate({
				right: '31%'
			}, 400, function() {});
		}
	});

	$('#youtube-form').submit(function(e){
		e.preventDefault();
	});
});

function search() {

	//clear results
	$('.youtube-result').html('');
	$('.youtube-button').html('');

	searchValue = $('#query').val();

	//run get request on api
	$.get(
		'https://www.googleapis.com/youtube/v3/search', {
			part: 'snippet, id',
			q: searchValue,
			type: 'video',
			key: 'AIzaSyDudKD-dGI5aFKICZlIcwOb9qiU1BWHcvA'
		},

		function(data) {
			var nextPageToken = data.nextPageToken,
				prevPageToken = data.prevPageToken;

			$.each(data.items, function(i, item){

				var output = getOutput(item);

				//display results
				$('.youtube-result').append(output)
			});

			var buttons = getButtons(nextPageToken, prevPageToken);

			//display buttons 
			$('.youtube-button').append(buttons)
		}
	);
}

function nextPage() {
	var token = $('#youtube-button--next').data('token'),
		query = $('#youtube-button--next').data('query');

	//clear results
	$('.youtube-result').html('');
	$('.youtube-button').html('');

	searchValue = $('#query').val();

	//run get request on api
	$.get(
		'https://www.googleapis.com/youtube/v3/search', {
			part: 'snippet, id',
			q: query,
			pageToken: token,
			type: 'video',
			key: 'AIzaSyDudKD-dGI5aFKICZlIcwOb9qiU1BWHcvA'
		},

		function(data) {
			var nextPageToken = data.nextPageToken,
				prevPageToken = data.prevPageToken;

			$.each(data.items, function(i, item){
				var output = getOutput(item);
				//display results
				$('.youtube-result').append(output)
			});

			var buttons = getButtons(nextPageToken, prevPageToken);

			//display buttons 
			$('.youtube-button').append(buttons)
		}
	);
}

function prevPage() {
	var token = $('#youtube-button--prev').data('token'),
		query = $('#youtube-button--prev').data('query');

	//clear results
	$('.youtube-result').html('');
	$('.youtube-button').html('');

	searchValue = $('#query').val();

	//run get request on api
	$.get(
		'https://www.googleapis.com/youtube/v3/search', {
			part: 'snippet, id',
			q: query,
			pageToken: token,
			type: 'video',
			key: 'AIzaSyDudKD-dGI5aFKICZlIcwOb9qiU1BWHcvA'
		},

		function(data) {
			var nextPageToken = data.nextPageToken,
				prevPageToken = data.prevPageToken;

			$.each(data.items, function(i, item){
				var output = getOutput(item);	
				//display results
				$('.youtube-result').append(output)
			});

			var buttons = getButtons(nextPageToken, prevPageToken);

			//display buttons 
			$('.youtube-button').append(buttons)
		}
	);
}

//build output
function getOutput(item) {
	var videoId = item.id.videoId,
		videoTitle = item.snippet.title,
		videoDescription = item.snippet.description,
		videoThumb = item.snippet.thumbnails.high.url, 
		channelTitle = item.snippet.channelTitle,
		videoDate = item.snippet.publishedAt;

		//build output html 
		var output = 
		'<li>' + 
			'<div class="youtube-result--thumbnail">' + 
				'<img src="' + videoThumb + '">' +
			'</div>' +
			'<div class="youtube-result--information">' +
				'<h3><a class="fancybox fancybox.iframe" href="https://www.youtube.com/embed/' + videoId + '">' + videoTitle + '</a></h3>' +
				'<p>By ' + '<span>' + channelTitle + ' </span><br/> Published on <span>' + videoDate +  '</span></p>' + 
				'<p> ' + videoDescription + '</p>' +
			'</div>' +	
		'</li>' +
		'<div class="clearfix"></div>';

		return output;
}

//build buttons
function getButtons(nextPageToken, prevPageToken) {

	if(!prevPageToken) {
		var btnoutput = 
		'<div class="youtube-button--container">' +
			'<button id="youtube-button--next" class="youtube-button--page" data-token="' + nextPageToken + '" data-query="'+ searchValue +'" onclick="nextPage();">Next Page</button>' +
		'</div>';
	} else {
		var btnoutput =
		'<div class="youtube-button--container">' +
			'<button id="youtube-button--prev" class="youtube-button--page" data-token="' + prevPageToken + '" data-query="'+ searchValue +'" onclick="prevPage();">Prev Page</button>' +
			'<button id="youtube-button--next" class="youtube-button--page" data-token="' + nextPageToken + '" data-query="'+ searchValue +'" onclick="nextPage();">Next Page</button>' +
		'</div>';
	}

	return btnoutput;

}
