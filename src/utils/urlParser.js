export function getURLParameters(sURL, paramName) {
    if (sURL.indexOf("?") > 0)
    {
        const arrParams = sURL.split("?");
        const arrURLParams = arrParams[1].split("&");
        const arrParamNames = new Array(arrURLParams.length);
        const arrParamValues = new Array(arrURLParams.length);

        let i = 0;
        for (i = 0; i<arrURLParams.length; i++)
        {
            const sParam =  arrURLParams[i].split("=");
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
}

export function getVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match&&match[7].length === 11)? match[7] : false;
}

export function toYouTubeEmbedded(youtubeUrl) {
    const videoId = getVideoId(youtubeUrl);
    const time = getURLParameters(youtubeUrl, 't');
    let url = `https://www.youtube.com/embed/${videoId}`;
    // + start time if we have it
    if (time) {
        url += `?start=${time}`;
    }
    return url;
}

