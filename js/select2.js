$(document).ready(function() {

    
    $("#username-field").on("input", function (e) {
        addRepo();
    });

    $("#git-username").select2({
        maximumSelectionLength: 1
    });

    $("#git-repo").select2({
        maximumSelectionLength: 1,
        placeholder: {
            id: '-1', // the value of the option
            text: 'Enter repo name'
          }
    });

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
                console.log(res)
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

    repoSelect.on('select2:select', function (e) {
        $("#slides").empty();
        var data = e.params.data;
        console.log(data);
        $.ajax({
            url: "https://api.github.com/repos/" + $("#username-field").val() + "/" + data["text"] + "/commits",
            jsonp: true,
            method: "GET",
            dataType: "json",
            success: function(res) {
                console.log(res);
                var sha = res[0]["sha"];
                $.ajax({
                    url: "https://api.github.com/repos/" + $("#username-field").val() + "/" + data["text"] + "/git/trees/" + sha + "?recursive=1",
                    jsonp: true,
                    method: "GET",
                    dataType: "json",
                    success: function(res) {
                        console.log(res);
                        var i;
                        for (i = 0; i < res["tree"].length; i++){
                            if (res["tree"][i]["path"].includes(".jpg") || res["tree"][i]["path"].includes(".png") || res["tree"][i]["path"].includes(".jpeg")){
                                var list = document.getElementById('slides');
                                var li = document.createElement("a");
                                li.setAttribute('href', '#!');
                                li.classList.add('collection-item');
                                var _img=document.createElement('img');
                                _img.src="https://raw.githubusercontent.com/" + $("#username-field").val() + "/" + data["text"] + "/" + sha + "/" + res["tree"][i]["path"];
                                _img.id = i;
                                _img.setAttribute('style', 'height: 500px');
                                li.appendChild(_img);
                                list.appendChild(li);

                                var para = document.createElement("p");
                                var path = document.createTextNode(res["tree"][i]["path"]);
                                para.appendChild(path);
                                li.append(para);
                            }
                        }
                        console.log(list);
                    } 
                });

                
            } 
        });    
    });

    


});

