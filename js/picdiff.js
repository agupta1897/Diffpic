function readURL(input, picName) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(picName)
                .attr('src', e.target.result)
                .width('300px');
            }

        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function(){
    $("#pic1Input").change(function(){
        readURL(this, "#pic1");
    });
    
    $("#pic2Input").change(function(){
        readURL(this, "#pic2");
    });
});


