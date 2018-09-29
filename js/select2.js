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
});

