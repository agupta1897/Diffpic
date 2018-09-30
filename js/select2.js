var loggedInUser = '';
var loggenInUserRepo ;
var repoSelect = $('#git-repo');
$(document).ready(function() {

    $("#img-table").hide();

    $("#username-field").on("input", function (e) {
        if($("#username-field").val() !== '' &&  $("#username-field").val() === loggedInUser )
        {
            addPrivateRepos();
        }
        else
        {
        addRepo();
        }
    });

function addPrivateRepos()
{
    $("#git-repo").prop("disabled", false);
                repoSelect.empty();
                repoSelect.val(null).trigger('change');
    for (i = 0; i< loggenInUserRepo.length; i++)
    {
        console.log(loggenInUserRepo[i]["name"]);
        var newOption = new Option(loggenInUserRepo[i]["name"], i, false, false);
        repoSelect.append(newOption).trigger('change');
        
    }
}

    $("#git-username").select2({
        maximumSelectionLength: 1
    });

    $("#git-repo").select2({
        placeholder: {
            id: '0', // the value of the option
            text: 'Enter repo name'
          }
    });

    var clientID = "b4b4312c8ea7ec470c34";
    var clientSecret = "fcd07f4c9e25b18c92fb6e0d0766c0a5e201ca79";
    var code, url, access_token;
    $("#signinButton").attr('href', "https://github.com/login/oauth/authorize?client_id=" + clientID + "&allow_signup=false&scope=repo");

    url = window.location.href;
    redirect_uri="https://damccoy1.github.io/diffpic/";
    console.log("test link");
    console.log(window.location.href);
    var tokenavailable = 0;
    if (url.includes("code")) {
        code = url.substring(url.length-20);
        console.log(code)
        $.ajax({
            url: "https://github.com/login/oauth/access_token?client_id=b4b4312c8ea7ec470c34&client_secret=fcd07f4c9e25b18c92fb6e0d0766c0a5e201ca79&code=" + code,
            method: "POST",
            success: function(res) {
                tokenavailable  = 1;
                access_token = res;
                accessTokenCall(access_token.split("&")[0].split("=")[1])
                console.log(res);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        })
        // setTimeout(nothing123(), 3000);
// setTimeout(accessTokenCall(access_token.split("&")[0].split("=")[1]),3000);
        // if(tokenavailable === 1)
        // {
        // var access_tokenvalue = access_token.split("&")[0].split("=")[1];
        // console.log(access_tokenvalue);
        // var data123;
        // $.ajax({
        //     url: "https://api.github.com/user/repos?access_token=" + access_tokenvalue,
        //     method: "GET",
        //     success: function(res) {
        //         data123 = res;
        //         console.log(res);
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         alert(xhr.status);
        //         alert(thrownError);
        //     }
        // })
 }
//  function nothing123()
//  {
//      var x = 3;
//      console.log(x);
//  }

    function accessTokenCall ( access_tokenvalue)
    {
        var data;
        $.ajax({
            url: "https://api.github.com/user/repos?access_token=" + access_tokenvalue,
            method: "GET",
            success: function(res) {
                data = res;
                loggedInUser = data[0]["owner"]["login"];
                loggenInUserRepo = data;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        })
    }


   

    function addRepo() {
        $.ajax({
            url: "https://api.github.com/users/" + $("#username-field").val() + "/repos",
            jsonp: true,
            method: "GET",
            dataType: "json",
            success: function(res) {
                $("#git-repo").prop("disabled", false);
                repoSelect.empty();
                repoSelect.val(null).trigger('change');
                var i;
                for (i = 0; i < res.length; i++) {
                    var newOption = new Option(res[i]["name"], i, false, false);
                    repoSelect.append(newOption).trigger('change');
                }
            },

            error : function(res) {
                $("#git-repo").prop("disabled", true);
            }
        });
    }

    var images = [];

    function simpleTemplating(data) {
        var html = '<div id="collection">';
        $.each(data, function(index, item){
            html += '<a href="#!" class="collection-item">'+ "<img src=" + item.src + " style=\"height: 50px\">" + "<p>" + item.path + "</p>" +'</a>';
        });
        if (data.length == 0) {
            html += '<li href="#!" class="collection-item">' + "No images found in the repository" + '</li>';
        }
        html += '</div>';
        return html;
    }

    repoSelect.on('select2:select', function (e) {
        $("#slides").empty();
        var data = e.params.data;
        $.ajax({
            url: "https://api.github.com/repos/" + $("#username-field").val() + "/" + data["text"] + "/commits",
            jsonp: true,
            method: "GET",
            dataType: "json",
            success: function(res) {
                $("#img-table").fadeIn();
                images = [];
                var sha = res[0]["sha"];
                $.ajax({
                    url: "https://api.github.com/repos/" + $("#username-field").val() + "/" + data["text"] + "/git/trees/" + sha + "?recursive=1",
                    jsonp: true,
                    method: "GET",
                    dataType: "json",
                    success: function(res) {
                        var i;
                        for (i = 0; i < res["tree"].length; i++){
                            if (res["tree"][i]["path"].includes(".jpg") || res["tree"][i]["path"].includes(".png") || res["tree"][i]["path"].includes(".jpeg")){
                                var _img=document.createElement('img');
                                _img.src="https://raw.githubusercontent.com/" + $("#username-field").val() + "/" + data["text"] + "/" + sha + "/" + res["tree"][i]["path"];
                                _img.id = i;
                                _img.path = res["tree"][i]["path"];
                                images.push(_img);
                            }
                        }

                        $('#pagination-container').pagination({
                            dataSource: images,
                            pageSize: 5,
                            showGoInput: true,
                            showGoButton: true,
                            callback: function(data, pagination) {
                                var html = simpleTemplating(data);
                                $('#data-container').html(html);
                            }
                        });
                    }
                });


            }
        });
    });






});

