var commitIds = new Array();
function loadFileFromGitHub()
{
    $("#picture").attr("src", "http://raw.githubusercontent.com/agupta1897/ImageDiffTesting/6f96e99df0f4b7c714c8f3425ee4aba1a839f23c/bitmoji-20180926060308.png");
}

function loadAllCommits()
{
    var URLName  = "https://api.github.com/repos/agupta1897/ImageDiffTesting/commits?path=bitmoji-20180926060308.png"
    $.get(URLName, function(data){
    
        commitIds = [];
        for( i = data.length-1; i > -1; i--)
        {
           commitIds.push(data[i]["sha"]);
           $("#timeline").append("<div class='col' style='text-align:center'>" + data[i]["sha"].substring(0, 5) + "</div>");
        }
        $("#slider").attr("max", data.length);
        $("#slider").attr("value", data.length/2);   
    });
    $("#slider").show();
}

function loadImagefromId(commitId, commitId2)
{
    var URLName  = "http://raw.githubusercontent.com/agupta1897/ImageDiffTesting/" + commitId + "/bitmoji-20180926060308.png"
    if(commitId2 !== null)
    {
   
    $("#picture").attr("src", URLName);
        $("#picture2").show()
        URLName  = "http://raw.githubusercontent.com/agupta1897/ImageDiffTesting/" + commitId2 + "/bitmoji-20180926060308.png"
        $("#picture2").attr("src",URLName);
    }
    else
    {
        $("#picture").attr("src", URLName);
        $("#picture2").hide()
    }
    }

// function loadImageforIds(commitIds)
// {
//    for( i = 0; i < commitIds.length; i++)
//    {
//        loadImagefromId(commitIds[i]);
//    }
// }

$(document).ready(function(){
    $("#slider").hide();
    $("#get-file-btn").click(function(){
        loadFileFromGitHub();
        loadAllCommits();
    });
    $('#slider').on('input', function(){
        console.log($('#slider').val());
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
        });
})
