$(document).ready(function(){
    $("#pic1Input").change(function(e){
        var file = e.target.files[0],
            url = URL.createObjectURL(file),
            img = new Image();
        img.onload = function() {
            URL.revokeObjectURL(this.src);
            pic1.getContext("2d").drawImage(this, 0, 0, img.width, img.height, 0, 0, pic1.width, pic1.height);
        }
        img.src = url;
        img.crossOrigin = "Anonymous";
    });
    
    $("#pic2Input").change(function(e){
        var file = e.target.files[0],
            url = URL.createObjectURL(file),
            img = new Image();
        img.onload = function() {
            URL.revokeObjectURL(this.src);
            pic2.getContext("2d").drawImage(this, 0, 0, img.width, img.height, 0, 0, pic2.width, pic2.height);
        }
        img.src = url;
        img.crossOrigin = "Anonymous";
    });

    $("#process-diff-btn").click(function(){
        var pic1Data = pic1.getContext("2d").getImageData(0, 0, pic1.width, pic1.height);
        var data1 = pic1Data.data;
        var pic2Data = pic2.getContext("2d").getImageData(0, 0, pic1.width, pic1.height);
        var data2 = pic2Data.data;
        for(var i = 0; i < data1.length; i += 4) {
            if (data1[i] != data2[i] || data1[i + 1] != data2[i + 1] || data1[i + 2] != data2[i + 2]){
                var alpha = 255;
                if ($("#soft-diff-slider")[0].checked){
                    alpha = ((Math.abs(data1[i] - data2[i])+ Math.abs(data1[i + 1] - data2[i + 1])+ Math.abs(data1[i + 2] - data2[i + 2])) / 3);
                }
                data1[i] = 255;     // red
                data1[i + 1] = 0; // green]
                data1[i + 2] = 0; // blue
                data1[i + 3] = alpha;
            }
            else {
                data1[i+3] = 0;
            }
        }
        diffpic.getContext("2d").putImageData(pic1Data, 0, 0);
    });
});


