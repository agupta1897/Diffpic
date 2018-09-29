var commitIds = new Array();

function loadImagefromId(commitId1, commitId2)
{
    var URLName  = "http://raw.githubusercontent.com/damccoy1/picdiff/" + commitId1 + "/friends_on_a_cooler.png"
    if(commitId2 !== null)
    {
   
    $("#picture1").attr("src", URLName);
    drawImageFromUrl(URLName, pic1, "#pic1-container");
    $("#picture1Label").html(commitId1.substring(0,5));
    $("#picture2Container").show();
    $("#picture2Label").html(commitId2.substring(0,5));
    URLName  = "http://raw.githubusercontent.com/damccoy1/picdiff/" + commitId2 + "/friends_on_a_cooler.png"
    $("#picture2").attr("src",URLName);
    drawImageFromUrl(URLName, pic2, "#pic2-container");
    }
    else
    {
        $("#picture1").attr("src", URLName);
        drawImageFromUrl(URLName, pic1, "#pic1-container");
        $("#picture1Label").html(commitId1.substring(0,5));
        $("#picture2Container").hide();
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

function updateImages() {
    img1Loaded = false;
    img2Loaded = false;
    if (($('#slider').val())>0 && ($('#slider').val())<commitIds.length)
    {
    loadImagefromId(commitIds[$('#slider').val()-1],commitIds[$('#slider').val()])
    }
    else if($('#slider').val() == commitIds.length)
    {
        loadImagefromId(commitIds[$('#slider').val()-1],null)
    }
    else
    {
        loadImagefromId(commitIds[$('#slider').val()],null)
    }
}

function drawImageFromUrl(url, pic, container){
    img = new Image();
    img.onload = function() {
        URL.revokeObjectURL(this.src);
        pic.getContext("2d").drawImage(this, 0, 0, img.width, img.height, 0, 0, pic.width, pic.height);
        if (container === "#pic1-container")
            img1Loaded = true;
        else {
            img2Loaded = true;
        }
        if (img1Loaded && img2Loaded) {
            var rgbSelection = hexToRgb($("#diff-color").val());
            drawDiff(rgbSelection.red, rgbSelection.green, rgbSelection.blue);          
        }
    }
    img.src = url;
    img.crossOrigin = "Anonymous";
    $(container).show();
}

function drawDiff(red, green, blue) {
    var pic1Data = pic1.getContext("2d").getImageData(0, 0, pic1.width, pic1.height);
    var data1 = pic1Data.data;
    var pic2Data = pic2.getContext("2d").getImageData(0, 0, pic1.width, pic1.height);
    diffBack.getContext("2d").drawImage(pic2, 0, 0, diffBack.width, diffBack.height, 0, 0, diffBack.width, diffBack.height);
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

$(document).ready(function(){
    
    function loadAllCommits() {
        var URLName  = "https://api.github.com/repos/damccoy1/picdiff/commits?path=friends_on_a_cooler.png"
        $.get(URLName, function(data){
        
            commitIds = [];
            for( i = data.length-1; i > -1; i--)
            {
            commitIds.push(data[i]["sha"]);
            $("#timeline").append("<div class='col' style='text-align:center'>" + data[i]["sha"].substring(0, 5) + "</div>");
            }
            $("#slider").attr("max", data.length);
            $("#slider").attr("value", data.length/2);   
            updateImages();  
        });
        $("#slider").show();
    }
    $("#slider").hide();
    loadAllCommits();
    $('#slider').on('input', function(){
        console.log($('#slider').val());
        updateImages();
        var rgbSelection = hexToRgb($("#diff-color").val());
        drawDiff(rgbSelection.red, rgbSelection.green, rgbSelection.blue);
        });
});
