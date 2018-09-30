$(document).ready(function() {

    $("#img-table").hide();
    
    $("#username-field").on("input", function (e) {
        addRepo();
    });

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
    var ClientSecret = "fcd07f4c9e25b18c92fb6e0d0766c0a5e201ca79";
    $("#signinButton").attr('href', "https://github.com/login/oauth/authorize?client_id=" + clientID + "&allow_signup=false");

    console.log(window.location.pathname);

    var repoSelect = $('#git-repo');

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

