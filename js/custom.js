jQuery(document).ready(function($){

	/*inintiate audio*/
	audiojs.events.ready(function() {
		var as = audiojs.createAll();
	});

	/* on load - create the global data object that will hold information and will be used for rendering*/
	$.manifesto = {
		"text" : "I AM CRAZY IN LOVE\n WITH YOU"
	};

	/* line types & data */
	$.linetypes = [
		{
			"name": "iloveyou",
			"structure": "firstnoun-verb-secondnoun-howmuch",
			"firstnoun": ["I"],
			"verb": ["love", "adore", "treasure", "cherish"],
			"secondnoun": ["you"],
			"howmuch": [
					"like there is no tomorrow",
					"sooooooo much",
					"",
					"",
					"",
					"sooo much",
					"more than anything else in the world"
				]
		},
		{
			"name": "youareawesome",
			"structure": "you-are-something",
			"you": ["you"],
			"are": ["are", "really are", "seriously are"],
			"something": [
					"something special",
					"the sunshine of my life",
					"the most adorable thing in the world",
					"the dearest thing in the world to me",
					"the most important thing in the world to me",
					"the center of my universe",
					"the best thing that happened to me",
					"worth more than words can say",
					"the apple of my eye",
					"so beautiful",
					"absolutely gorgeous",
					"unbelievably beautiful"
				]
		},
		{
			"name": "custom",
			"structure": "customline",
			"customline": [
				"we were made for each other",
				"you take my breath away",
				"It's awesome to spend my life with you",
				"I'm head over heels for you",
				"you turn me on",
				"there ain't a woman that comes close to you"
			]
		}
	];

	/* keeping track of the previous line & type - so that we don't double up */
	var prevLine = "";
	var prevPrevLine = "";
	var prevLineType = "iloveyou";

	/* line count and funny lines - to make fun if somebody is reading for too long */
	var lineCount = 1;
	var funnyLines = [
		"Are you still reading? You are \nawesome",
		"OMG, you are still reading! I love you",
		"Are you still reading? Give me a call, \nI'll give you a hug"
	];

	/* render on load */
	//generate the first 30 strings - must be enough for the scroll to appear
	for(i=0; i<30; i++) {
		if($.manifesto.text !== "") $.manifesto.text +="\n";
		$.manifesto.text += createLine();
	}
	renderManifesto();

	/* scrolling */
	var lastScrollTop = 0;
	$(window).scroll(function(e){
		var st = $(this).scrollTop();
		if (st > lastScrollTop){//scrolling down
			var newLine = createLine();
			$.manifesto.text += '\n'+newLine;
			appendManifestoLine(newLine);
			lastScrollTop = st;
		}
	});

	/* rendering the manifesto */
	function renderManifesto(){
		var prevObj = $('#manifestoPreview');
		//populate with data
		prevObj.html(nl2br($.manifesto.text));

		//separate into lines and apply styles
		prevObj.lettering('lines');

		//slabtext
		prevObj.find('span').slabText();

	}

	/* append a line to the manifesto */
	function appendManifestoLine(str) {
		var prevObj = $('#manifestoPreview');
		var allNewLines = str.split('\n');
		$.each(allNewLines, function(k,v){
			var newId = prevObj.children().length;
			prevObj.append('<span class="line'+newId+'" id="'+newId+'">'+v+'</span>');
			$('#'+newId).slabText();
		});
	}

	/* create a new line of text */
	function createLine(){
		var l = "";

		//return fun if somebody is reading for too long
		if(lineCount>50 && (lineCount-(Math.floor(lineCount/9))*9) == 0) {
			var funnyLine = funnyLines[Math.floor(Math.random()*funnyLines.length)];
			prevPrevLine = prevLine;
			prevLine = funnyLine;
			prevLineType = "funny";
			lineCount++;
			return funnyLine;
		}

		//first chose the line type
		var ltype = $.linetypes[Math.floor(Math.random()*$.linetypes.length)];
		//create structure
		var structureArr = ltype.structure.split('-');
		//go through the structure
		for(var x=0; x<structureArr.length; x++){
			var wordType = structureArr[x];
			var allwords = ltype[wordType];
			var theword = allwords[Math.floor(Math.random()*allwords.length)];
			if(l.split(' ').length > 2 && theword.split(' ').length>2){
				l+='\n';
			}
			l+=' '+theword;
		}
		//splitting too long strings onto more lines
		if(l.split(' ').length > 5) {
			var a = l.split(' ');
			var where = randomFromInterval(3, a.length-1);
			l = "";
			for(var y=1; y<where; y++){
				l+=' '+a[y];
			}
			l+='\n';
			for(var z=where; z<a.length; z++) {
				l+=' '+a[z];
			}
		}
		//making sure that there are no words like 'the' on individual lines
		var lineLines = l.split('\n');
		if(lineLines.length > 1) {
			l = "";
			$.each(lineLines, function(k,v){
				if($.inArray($.trim(v), ["the", "are", "much", "on", "you", "say", "my", "with", "to me", "me", "other", "you are", "eye", "away", "to you"]) > -1) {
					l+=' '+v;
				} else {
					l+= '\n'+v;
				}
			});
		}
		//checking for duplication
		if(stripNewLines(l) != stripNewLines(prevLine) && stripNewLines(l) != stripNewLines(prevPrevLine) && ltype.name != prevLineType) {
			prevPrevLine = prevLine;
			prevLine = l;
			prevLineType = ltype.name;
			lineCount++;
			return l;
		} else {
			return createLine();
		}
	}


	/*nl2br function*/
	function nl2br(str) {
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br />' + '$2');
	}

	/*strip new lines*/
	function stripNewLines(str) {
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + ' ' + '$2');
	}

	/* generate random number in an interval */
	function randomFromInterval(from,to) {
		return Math.floor(Math.random()*(to-from+1)+from);
	}

	/* hack to preserve new lines from textareas when using .val() */
	$.valHooks.textarea = {
		get: function( elem ) {
			return elem.value.replace( /\r?\n/g, "\r\n" );
		}
	};

});