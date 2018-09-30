var commitIds = new Array();
var commitDates = new Array();
var timelineIndex = 0;
function loadImagefromId(commitId1, commitId2)
{
    var URLName  = "https://cors-anywhere.herokuapp.com/http://raw.githubusercontent.com/damccoy1/picdiff/" + commitId1 + "/friends_on_a_cooler.png"
    if(commitId2 != null){
        $("#picture1").attr("src", URLName);
        drawImageFromUrl(URLName, pic1, "#pic1-container");
        $("#picture1Label").html("<b>" + commitId1.substring(0,5) + "</b>");
        $("#picture2Container").show();
        $("#picture2Label").html("<b>" + commitId2.substring(0,5) + "</b>");
        URLName  = "https://cors-anywhere.herokuapp.com/http://raw.githubusercontent.com/damccoy1/picdiff/" + commitId2 + "/friends_on_a_cooler.png"
        $("#picture2").attr("src",URLName);
        drawImageFromUrl(URLName, pic2, "#pic2-container");
        $("#diff-container").show();
        $("#diff-og-container").show();
        $("#diff-tools").show();
        }
    else
    {
        $("#picture1").attr("src", URLName);
        drawImageFromUrl(URLName, pic1, "#pic1-container");
        $("#picture1Label").html(commitId1.substring(0,5));
        $("#picture2Container").hide();
        $("#diff-container").hide();
        $("#diff-og-container").hide();
        $("#diff-tools").hide();
    }
    }

// function loadImageforIds(commitIds)
// {
//    for( i = 0; i < commitIds.length; i++)
//    {
//        loadImagefromId(commitIds[i]);
//    }
// }
var img1Loaded = false;
var img2Loaded = false;
var pic1Data, pic2Data;
var img1Width, img2Width, img1Height, img2Height;

function clearAllSelectedTimeline()
{
    var j=  timelineIndex;
    for (i = timelineIndex ; i< timelineIndex+4; i++)
    {
        $("#timelinediv"+i).removeClass("timeline-selected-right-item")
        $("#timelinediv"+i).removeClass("timeline-selected-left-item")
    }
}

function updateImages() {
    img1Loaded = false;
    img2Loaded = false;
    clearAllSelectedTimeline();
  
    var i = ( parseInt($("#slider").val())+ timelineIndex);
    if (i > 0 && i < commitIds.length)
    {
        console.log("#timelinediv" + $("#slider").val())
    $("#timelinediv" + i).addClass("timeline-selected-right-item")
    $("#timelinediv" + (i-1)).addClass("timeline-selected-left-item")
    loadImagefromId(commitIds[i-1],commitIds[i])
    }
    else {
        if (i === 0)
        {
            $("#timelinediv" + i).addClass("timeline-selected-left-item")
            loadImagefromId(commitIds[i],null)
        }
        else {
            loadImagefromId(commitIds[i],null)
        }
    }
}

function drawImageFromUrl(url, pic, container){
    img = new Image();
    img.onload = function() {
        URL.revokeObjectURL(this.src);
        var picWidth = this.width;
        var picHeight = this.height;
        var scale = 1;
        var yOffset = 0;
        var xOffset = 0;
        if (this.width > this.height){
            if (this.width > pic.width){
                scale = pic.width / this.width;
            }
            else {
                scale = this.width / pic.width;
            }
            yOffset = Math.round((pic.height - Math.round(this.height * scale)) / 2);
        }
        else {
            if (this.height > pic.height)
            scale = pic.height / this.height;
            else {
                scale = this.height / pic.height;
            }
            xOffset = Math.round((pic.width - Math.round(this.width * scale)) / 2);
        }
        if (container === "#pic1-container") {
            pic.getContext("2d").clearRect(0, 0, pic.width, pic.height);
            pic.getContext("2d").drawImage(this, 0, 0, this.width, this.height, xOffset, yOffset, Math.round(picWidth * scale), Math.round(picHeight * scale));
            img1Loaded = true;
            img1Height = this.height;
            img1Width = this.width;
            pic1Data = pic1.getContext("2d").getImageData(0, 0, pic1.width, pic1.height);
        }
        else {
            pic.getContext("2d").clearRect(0, 0, pic.width, pic.height);
            pic.getContext("2d").drawImage(this, 0, 0, this.width, this.height, xOffset, yOffset, Math.round(picWidth * scale), Math.round(picHeight * scale));
            img2Loaded = true;
            img2Height = this.height;
            img2Width = this.width;
            pic2Data = pic2.getContext("2d").getImageData(0, 0, pic2.width, pic2.height);
        }
        if (img1Loaded && img2Loaded) {
            $("#picture1Label").html($("#picture1Label").html() + " (" + img1Height + "x" + img1Width + ")");
            $("#picture2Label").html($("#picture2Label").html() + " (" + img2Height + "x" + img2Width + ")");
            if (img1Height == img2Height && img1Width == img2Width){
                var rgbSelection = hexToRgb($("#diff-color").val());
                picWidth = pic1.width;
                picHeight = pic1.height;
                scale = 1;
                drawDiff(rgbSelection.red, rgbSelection.green, rgbSelection.blue, scale); 
                diffBack.getContext("2d").drawImage(pic1, 0, 0, pic1.width, pic1.height, 0, 0, Math.round(picWidth * scale), Math.round(picHeight * scale));            
            }
            else {
                $("#diff-container").hide();
                $("#diff-og-container").hide();
                $("#diff-tools").hide();
                if (img1Height == img2Width && img1Width == img2Height) {
                    $("#rotated-alert").fadeIn();
                }
                else {
                    $("#resized-alert").fadeIn();
                }
            }
        }
    }
    img.src = url;
    img.crossOrigin = "Anonymous";
    $(container).show();
}

function drawDiff(red, green, blue) {
    var data1 = pic1Data.data;
    var data2 = pic2Data.data;
    for(var i = 0; i < data1.length; i += 4) {
        if (data1[i] != data2[i] || data1[i + 1] != data2[i + 1] || data1[i + 2] != data2[i + 2]){
            var alpha = 255;
            if ($("#soft-diff-slider")[0].checked){
                alpha = ((Math.abs(data1[i] - data2[i])+ Math.abs(data1[i + 1] - data2[i + 1])+ Math.abs(data1[i + 2] - data2[i + 2])) / 3);
            }
            data1[i] = red;     // red
            data1[i + 1] = green; // green]
            data1[i + 2] = blue; // blue
            data1[i + 3] = alpha;
        }
        else {
            data1[i+3] = 0;
        }
    }
    diffpic.getContext("2d").putImageData(pic1Data, 0, 0);
}

function convertTimeto12Hours(string)
{
var convertedHours = 0;
var hours = parseInt(string.split(':')[0],10);
var suffix = (hours > 12)? 'PM' : 'AM';
convertedHours = ((hours + 11) % 12 + 1);
var result = convertedHours + ":" +string.split(':')[1] +" " + suffix;
return result;
}

function updateTimelineButton()
{
    if(timelineIndex !== 0 )
    {
        $("#btnLeftClick").removeAttr("disabled");
       
    }else{
        $("#btnLeftClick").attr("disabled", "disabled");
    }

    if((timelineIndex + 4)  < commitIds.length )
    {
        $("#btnRightClick").removeAttr("disabled");
    }
    else
    {
        $("#btnRightClick").attr("disabled", "disabled");
    }
}

function updateTimelineToLeft()
{
    if(timelineIndex === 0)
    {
    }
    else
    {
        timelineIndex = timelineIndex -1;
        createTimelineMarkUp();
        if($("#slider").val() != commitIds.length)
        {
            $("#slider").val(parseInt($("#slider").val()) + 1);
            updateImages();
        }
    }
    updateTimelineButton()
}

function updateTimelineToRight()
{
    if((timelineIndex + 4) < commitIds.length)
    {
        timelineIndex++;
        createTimelineMarkUp();
 
        if($("#slider").val() != 0)
        {
            $("#slider").val(parseInt($("#slider").val()) - 1);
        // $("#slider").attr("value", $("#slider").val()-1 );
        //$("#slider").attr("value",parseInt($("#slider").val()) - 1); 
        // $("#slider").val(parseInt($("#slider").val()) - 1);
        updateImages();
        }
    }

    
    updateTimelineButton()
}

function createTimelineMarkUp( )
{
    document.getElementById("timeline").innerHTML = "";
    for ( i = timelineIndex ; i< timelineIndex + 4; i++)
    {
    $("#timeline").append(" <div class='col' id='timelinediv" + i +"' style='text-align:center; font-size:15;'>" + commitIds[i].substring(0, 5) 
    +
      "<div class='col' id='timelinedate" + i +"' style='text-align:center; font-size:10;'>" + commitDates[i] +" </div></div>");
    }
}

$(document).ready(function(){
    function loadAllCommits() {
        var URLName  = "https://api.github.com/repos/damccoy1/picdiff/commits?path=friends_on_a_cooler.png"
        $.get(URLName, function(data){        
            commitIds = [];
            for( i = data.length-1; i > -1; i--)
            {
                commitIds.push(data[i]["sha"]);
                commitDates.push( data[i]["commit"]["author"]["date"].substring(0,10) + " " + convertTimeto12Hours( data[i]["commit"]["author"]["date"].substring(11,data[i]["commit"]["author"]["date"].length-1)));
                // $("#timeline").append(" <div class='col' style='text-align:center; font-size:15;'>" + commitIds[commitDates.length-1].substring(0, 5) 
                // +
                //   "<div class='col' style='text-align:center; font-size:10;'>" + commitDates[commitDates.length-1] +" </div></div>");
            }
            createTimelineMarkUp();
                
                $("#slider").attr("value", 2);   
            updateImages();  
        });
        $("#slider").show();
    }
    $("#slider").hide();
    $("#rotated-alert").hide();
    $("#resized-alert").hide();
    loadAllCommits();
    $('#slider').on('change', function(){  
        $("#rotated-alert").fadeOut();
        $("#resized-alert").fadeOut();
        console.log($('#slider').val());
        updateImages();
        });

    $("#btnLeftClick").click('input', function(){
        updateTimelineToLeft();
    });

    $("#btnRightClick").click('input', function(){
        updateTimelineToRight();
    });
});
