export var VisioWebRemote = function(e,o){
    this.domElement=e,
    this.remoteViewerURL=o.remoteViewerURL||"https://cdn.visioglobe.com/visioweb/remote",
    this.currentRequest=1,
    this.requestQueue=[],
    this.callbacks={},
    this.isReady=!1,
    o.remote=!0,
    this.domElement.setAttribute("src",this.remoteViewerURL+"/?params64="+btoa(JSON.stringify(o)))

    var t=this;
    e.addEventListener("load",(function(){
        window.addEventListener("message",(function(e){
            
            console.log(e.origin)


            var o=JSON.parse(e.data);
            if(void 0!==o.requestID){
                var r=t.requestQueue.findIndex((function(e){
                    return e.message.requestID===o.requestID
                }
                ));
                if(-1!==r){
                    var i=t.requestQueue.splice(r,1);
                    console.log(i,r)
                    void 0!==o.reason?i[0].reject(o.reason):void 0!==o.response?i[0].resolve(o.response):i[0].resolve()
                }
            }else 
                o.event&&("ready"===o.event&&(t.isReady=!0),
                t.callbacks[o.event]&&t.callbacks[o.event](o.args))
            }),
        !1)
    }))
};
VisioWebRemote.prototype.constructor=VisioWebRemote,
VisioWebRemote.prototype.ready=function(e){
    this.callbacks.ready=e
},
VisioWebRemote.prototype.mouseup=function(e){
    this.callbacks.mouseup=e
},
VisioWebRemote.prototype.exploreStateWillChange=function(e){
    this.callbacks.exploreStateWillChange=e
},
VisioWebRemote.prototype.exploreStateChanged=function(e){
    this&&(this.callbacks.exploreStateChanged=e)
};
var VisioWebRemoteAPI=["call","addCategory","addPlaceCategory","addPlaceContent","createPlace","getFootprintPoints","getCategory","getPlace","getPointOfFocus","getVersion","getViewpoint","goToBuilding","goToFloor","goToGlobal","goToPlace","goToViewpoint","openSearch","queryAllCategoryIDs","queryAllPlaceIDs","removePlace","resetPlaceColor","routeFrom","routeTo","setParameters","setPlaceColor","setPlaceDescription","setPlaceIcon","setPlaceName","setPlacePosition"];
VisioWebRemoteAPI.forEach((function(e){
    VisioWebRemote.prototype[e]=function(){
        if(this.isReady){
            var o={
                source:"VisioWebRemote",
                requestID:this.currentRequest,
                method:e,arguments:Array.from(arguments)},
                t={message:o};
                return t.promise=new Promise((function(e,o){
                    t.resolve=e,t.reject=o
                })),
                this.currentRequest++,
                this.requestQueue.push(t),
                this.domElement.contentWindow.postMessage(JSON.stringify(o),this.remoteViewerURL),
                t.promise
            }
            console.log("%c VisioWeb %c is %cnot ready%c Move your call to %c"+e+"%c API inside the %cready%c callback.","background:#35495e ; padding: 1px; border-radius: 3px 3px 3px 3px;  color: #fff; font-weight: bold;","background:transparent","background:#ff5333 ; padding: 1px; border-radius: 3px 3px 3px 3px;  color: #1d2833","background:transparent","background:#35495e ; padding: 1px; border-radius: 3px 3px 3px 3px;  color: #fff","background:transparent","background:#35495e ; padding: 1px; border-radius: 3px 3px 3px 3px;  color: #fff","background:transparent")}}));
            var isNumeric=function(e){
                var o=new RegExp("-?\\d+(\\.{1}\\d+)?(e{1}-?\\d+)?").exec(e);
                return null!==o&&o[0].length===(e+"").length},
                getURLParameters=function(e){
                    var o,t=function(e,o,t){
                        var r,i=new RegExp("([^\\[^\\]]+)((\\[(^\\[^\\])\\])*)","g"),
                        a=e,s=[];
                        do{
                            null!==(r=i.exec(o))&&void 0!==r[1]&&s.push(decodeURIComponent(r[1]))}
                        while(r);
                        for(var n=0;n<s.length-1;n++)void 0===a[s[n]]&&(a[s[n]]={}),
                            a=a[s[n]];a[s[s.length-1]]=t},
                            r=void 0===e?window.location.search:e,
                            i=new RegExp("[?|&]?([^=^&^#]+)=?([^&^#]+)?","g"),
                            a={};
                            do{
                                if(null!==(o=i.exec(r))){
                                    var s=decodeURIComponent(o[1]),
                                    n=void 0===o[2]||decodeURIComponent(o[2].replace(/\+/g," "));
                                    isNumeric(n)&&(n=parseFloat(n)),t(a,s,n)
                            }
                        }
                        while(o);
                        return void 0!==a.params64&&(a=JSON.parse(atob(a.params64)))
                        ,a
                    };
