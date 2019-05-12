module.exports = {
    getURLParameters: function(sURL, paramName) {
        if (sURL.indexOf("?") > 0)
        {
            var arrParams = sURL.split("?");
            var arrURLParams = arrParams[1].split("&");
            var arrParamNames = new Array(arrURLParams.length);
            var arrParamValues = new Array(arrURLParams.length);

            let i = 0;
            for (i = 0; i<arrURLParams.length; i++)
            {
                var sParam =  arrURLParams[i].split("=");
                arrParamNames[i] = sParam[0];
                if (sParam[1] !== "")
                    arrParamValues[i] = unescape(sParam[1]);
                else
                    arrParamValues[i] = "No Value";
            }

            for (i=0; i<arrURLParams.length; i++)
            {
                if (arrParamNames[i] === paramName)
                {
                    //alert("Parameter:" + arrParamValues[i]);
                    return arrParamValues[i];
                }
            }
            return "No Parameters Found";
        }
    },
    getVideoId: function(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length === 11)? match[7] : false;
    },
    toYouTubeEmbedded: function(youtubeUrl) {
        var videoId = this.getVideoId(youtubeUrl);
        var time = this.getURLParameters(youtubeUrl, 't');
        let url = `https://www.youtube.com/embed/${videoId}`;
        // + start time if we have it
        if (time) {
            url += `?start=${time}`;
        }
        return url;
    }
};
