var storeAddress = '';
var storeCity = '';
var storeState = '';
var storeZip = '';
var storeCompleteAddress = '';
var geocoder;

var txtDirectionsSearchTextId = '';

function CreateStoreMarker(map) {
    geocoder = new GClientGeocoder();
    geocoder.getLatLng(
        storeCompleteAddress,
        function(point) {
            if (!point) {
                alert(storeCompleteAddress + " not found");
            }
            else {
                map.setCenter(point, 13);

                // Create VIOC Icon as marker
                var iconLocation;
                iconLocation = "./images/vioc.png";
                var thisIcon = new GIcon(G_DEFAULT_ICON);
                thisIcon.shadow = "./images/vioc_shadow.png";
                thisIcon.image = iconLocation;
                var markerOptions = { icon: thisIcon };

                // Add the Store Location as a Marker
                var marker = new GMarker(point, markerOptions);
                map.addOverlay(marker);
                pngfix();
            }
        }
    );
}

function setupDrivingDirections() {
    var searchText = $(txtDirectionsSearchTextId).get('value');
    var directionsUrl = "http://maps.google.com/maps?f=d&pw=2&daddr=" + storeCompleteAddress + "&saddr=" + searchText;
    window.open(directionsUrl, "directionsWindow");
}

pngfix = function() {
    if (Browser.Engine.trident && (Browser.Engine.version < 5)) {
        var els = document.getElementsByTagName('*');
        var ip = /\.png/i;
        var i = els.length;
        while (i-- > 0) {
            var el = els[i];
            var es = el.style;
            if (el.src && el.src.match(ip) && !es.filter) {
                es.height = el.height;
                es.width = el.width;
                es.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + el.src + "',sizingMethod='crop')";
                el.src = "";
            }
            else {
                var elb = el.currentStyle.backgroundImage;
                if (elb.match(ip)) {
                    var path = elb.split('"');
                    var rep = (el.currentStyle.backgroundRepeat == 'no-repeat') ? 'crop' : 'scale';
                    es.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path[1] + "',sizingMethod='" + rep + "')";
                    es.height = el.clientHeight + 'px';
                    es.backgroundImage = 'none';
                    var elkids = el.getElementsByTagName('*');
                    if (elkids) {
                        var j = elkids.length;
                        if (el.currentStyle.position != "absolute") es.position = 'static';
                        while (j-- > 0) if (!elkids[j].style.position) elkids[j].style.position = "relative";
                    }
                }
            }
        }
    }
}