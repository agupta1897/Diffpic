var commitIds = new Array();
function loadFileFromGitHub()
{
    $("#picture1").attr("src", "http://raw.githubusercontent.com/damccoy1/picdiff/0c9c387d9922b23780afb42f1bdd7f0f316d3d6e/friends_on_a_cooler.png");
}

function loadAllCommits()
{
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

function loadImagefromId(commitId1, commitId2)
{
    var URLName  = "http://raw.githubusercontent.com/damccoy1/picdiff/" + commitId1 + "/friends_on_a_cooler.png"
    if(commitId2 !== null)
    {
   
    $("#picture1").attr("src", URLName);
    $("#picture1Label").html(commitId1.substring(0,5));
    $("#picture2Container").show();
    $("#picture2Label").html(commitId2.substring(0,5));
    URLName  = "http://raw.githubusercontent.com/damccoy1/picdiff/" + commitId2 + "/friends_on_a_cooler.png"
    $("#picture2").attr("src",URLName);
    }
    else
    {
        $("#picture1").attr("src", URLName);
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

function updateImages() {
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

$(document).ready(function(){
    $("#picture2Container").hide();
    $("#slider").hide();
    loadAllCommits();
    $('#slider').on('input', function(){
        console.log($('#slider').val());
        updateImages();
        });
    var img = new Image();
    img.onload = function() {
        URL.revokeObjectURL(this.src);
        pic1.getContext("2d").drawImage(this, 0, 0, img.width, img.height, 0, 0, pic1.width, pic1.height);
    }
    img.src = "http://raw.githubusercontent.com/damccoy1/picdiff/0c9c387d9922b23780afb42f1bdd7f0f316d3d6e/friends_on_a_cooler.png";
    img.crossOrigin = "Anonymous";
    $("#pic1-container").show();
    img = new Image();
    img.onload = function() {
        URL.revokeObjectURL(this.src);
        pic2.getContext("2d").drawImage(this, 0, 0, img.width, img.height, 0, 0, pic2.width, pic2.height);
    }
    img.src = "http://raw.githubusercontent.com/damccoy1/picdiff/0c9c387d9922b23780afb42f1bdd7f0f316d3d6e/friends_on_a_cooler.png";
    img.crossOrigin = "Anonymous";
    $("#pic2-container").show();
})
