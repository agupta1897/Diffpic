$(document).ready(function() {

    


    $("#git-username").select2({
        maximumSelectionLength: 1
    });

    $("#git-repo").select2({
        maximumSelectionLength: 1
    });

    var repoSelect = $('#git-repo');

    $("#submit-username").click(function() {
        $.ajax({
            url: "https://api.github.com/users/" + $("#username-field").val() + "/repos",
            jsonp: true,
            method: "GET",
            dataType: "json",
            success: function(res) {
                repoSelect.empty();
                repoSelect.val(null).trigger('change');
                console.log(res)
                var i;
                for (i = 0; i < res.length; i++) {
                var newOption = new Option(res[i]["name"], i, false, false);
                repoSelect.append(newOption).trigger('change');
                }
            } 
        });

    });

    repoSelect.on('select2:select', function (e) {
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
                        var list = document.getElementById('slides');

                        for (i = 0; i < res["tree"].length; i++){
                            if (res["tree"][i]["path"].includes(".jpg") || res["tree"][i]["path"].includes(".png") || res["tree"][i]["path"].includes(".jpeg")){
                                var li = document.createElement("a");
                                li.setAttribute('href', '#!');
                                li.classList.add('collection-item');
                                var _img=document.createElement('img');
                                _img.src="https://raw.githubusercontent.com/" + $("#username-field").val() + "/" + data["text"] + "/" + sha + "/" + res["tree"][i]["path"];
                                _img.id = i;
                                li.appendChild(_img);
                                list.appendChild(li);
                            }
                        }
                        console.log(list);
                    } 
                });

                
            } 
        });    
    });

    


});

