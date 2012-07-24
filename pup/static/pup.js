/*
 * Constants.js
 * This avoids the hassle of constantly creating new strings.
 * These are common strings.
 */function Histogram(e){Metric.call(this,e);var t=this.n;this.data=d3.range(e.points.length).map(function(t,n){return{name:e.points[n].stackName,values:[{time:+e.now,value:null}]}}),this.mostRecent=e.points.map(function(t){return{name:t.stackName,values:{time:+e.now,value:null}}})}function Line(e){Metric.call(this,e),this.data=[{time:+e.now,value:null}],this.mostRecent=[{time:+e.now,value:null}]}var C=function(){return{WIDTH:"width",HEIGHT:"height",G:"g",TRANSFORM:"transform",CLASS:"class",ID:"id",RECT:"rect",TEXT:"text",X:"x",Y:"y",D:"d",PATH:"path",LINE:"line",AREA:"area",PERIOD:".",HASH:"#",TRANSLATE:"translate",OPENPAREN:"(",CLOSEPAREN:")",DASH:"-",COMMA:",",CLIP:"clip",URL:"url",ZERO:"0",HIDDEN:"hidden",TIME:"time",VALUE:"value",NAME:"name",TIME:"time"}}(),allTags=[],metricId=0,PupController,Metric=function(e){this.n=PupController.n(),this.createdAt=new Date,this.uuid=metricId++,this.name=e.metric,this.type=e.type,this.freq=e.freq*1e3,this.tags=e.tags,this.max=0,this.data=[],this.timedOut={at:+e.now,is:!1};for(var t=0;t<this.tags.length;t++){var n=this.tags[t];-1===allTags.indexOf(n)&&(allTags[allTags.length]=n)}};Histogram.prototype.updateMostRecent=function(e,t){var n=this.max,r=this.average;this.mostRecent=e.points.map(function(e){return{name:e.stackName,values:e.values.map(function(t){return t[1]>n&&(n=t[1]),e.stackName==="avg"&&(r=t[1]),{time:t[0]*1e3,value:t[1]}})[0]}}),this.max=n,this.average=r},Histogram.prototype.pushRecent=function(){for(var e=0;e<this.data.length;e++){var t={time:this.mostRecent[e].values.time,value:this.mostRecent[e].values.value};this.data[e].values[this.data[e].values.length]=t}},Histogram.prototype.pushNull=function(e){this.data=this.data.map(function(t){return t.values[t.values.length]={time:+e,value:null},t})},Histogram.prototype.shiftOld=function(e){for(var t=0;t<this.data.length;t++)while(this.data[t].values[0].time<e)this.data[t].values.shift()},Histogram.prototype.setIfTimedOut=function(e){this.timedOut.is=+e-d3.min(this.mostRecent,function(e){return e.values.time})>this.freq*2?!0:!1,this.timedOut.is&&(this.timedOut.at=+e)},Histogram.prototype.hasNewData=function(){return d3.min(this.mostRecent,function(e){return e.values.time})>d3.min(this.data,function(e){return e.values[e.values.length-1].time})},Histogram.prototype.toCSV=function(){var e="time,",t=this.data[0];a=t;for(var n=-1,r=t.values.length;n<r;n++){console.log("HEY");var i="";if(n===-1)for(var s=0,o=this.data.length;s<o;s++)i!==""&&(i+=","),i+=this.data[s].name;else{if(t.values[n]&&t.values[n].value==null)continue;i+=t.values[n].time;for(var s=0,o=this.data.length;s<o;s++)i!==""&&(i+=","),i+=this.data[s].values[n].value}e+=i+"</br>"}return e},Line.prototype.updateMostRecent=function(e,t){var n=this.max;this.mostRecent[0]=e.points.map(function(e){return e[1]>n&&(n=e[1]),{time:e[0]*1e3,value:e[1]}})[0],this.max=n},Line.prototype.pushNull=function(e){this.data[this.data.length]={time:+e,value:null}},Line.prototype.pushRecent=function(){var e={time:this.mostRecent[0].time,value:this.mostRecent[0].value};this.data[this.data.length]=e},Line.prototype.shiftOld=function(e){while(this.data[0].time<e)this.data.shift()},Line.prototype.setIfTimedOut=function(e){this.timedOut.is=+e-this.mostRecent[0].time>this.freq*2?!0:!1,this.timedOut.is&&(this.timedOut.at=+e)},Line.prototype.hasNewData=function(){return this.mostRecent[0].time>this.data[this.data.length-1].time},Line.prototype.toCSV=function(){var e="",t=this.data;for(var n=-1,r=t.length;n<r;n++){var i="";if(n===-1)for(var s in t[0])console.log(s),i!==""&&(i+=","),i+=s;else{if(t[n].value==null)continue;for(var s in t[n])t[n].hasOwnProperty(s)&&(i!==""&&(i+=","),i+=t[n][s])}e+=i+="</br>"}return e};var Store=function(){var e={},t=20,n=!1,r=function(e,t){var n;return e[t].type==="histogram"?n=Histogram:e[t].type!=="histogram"&&(n=Line),new n({now:new Date,metric:t,type:e[t].type,tags:e[t].tags||[],freq:e[t].freq,points:e[t].points})},i=function(e){return"Waiting"in e?!1:!0},s=function(e){return e.type&&e.freq&&e.points?!0:!1},o={};return o.save=function(o){if(i(o)){for(var u in o){if(!o.hasOwnProperty(u)||!s(o[u]))return 1;if(!(u in e))if(Object.keys(e).length<t)e[u]=r(o,u);else if(!n)return n=!0,2;u in e&&e[u].updateMostRecent(o[u],u)}return 0}},o.getMetrics=function(){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(e[n]);return t},o.getMetricByName=function(t){return e[t]},o}(),PupSocket=function(e,t){var n=!1,r=!1,i=function(e){n=e},s={};return s.isEstablished=function(){return n},s.tryStart=function(e){if(this.isEstablished())return;var n=new WebSocket("ws://localhost:"+e+"/pupsocket");return i(!0),n.onmessage=function(e){var n;try{n=JSON.parse(e.data)}catch(s){throw i(!1),"There was an error parsing the incoming data: "+s}var o=t(n);switch(o){case 0:break;case 1:throw i(!1),"Malformed data sent to client";case 2:if(!r){var u=document.getElementById("limit-error");u.innerHTML="You have reached the graph count limit. This limit is enforced for reasons of performance.",setTimeout(function(){u.innerHTML=""},5e3),r=!0}}},n.onclose=function(){i(!1)},n.onerror=function(){i(!1)},s},s.isClosed=function(){return!1===n},s}(port,Store.save),MetricGraph=function(e){var t={top:10,right:24,bottom:18,left:45},n=10,r=470-t.right,i=140-t.top-t.bottom,s=1.3;this.n=e.n,this.duration=e.duration,this.metric=e.metric,this.element=e.element,this.height=i,this.width=r,this.finishedProgress=!1;var o=e.now-(this.n-2)*this.duration,u=e.now-this.duration,a="basis",f=this.metric;this.x=d3.time.scale().domain([o,u]).range([0,r]),this.y=d3.scale.linear().range([i,0]);var l=this.x,c=this.y;this.format=d3.format(".3s"),this.svg=this.element.select(".plot").append("svg").attr(C.WIDTH,r+t.left+t.right+n).attr(C.HEIGHT,i+t.top+t.bottom).append(C.G).attr(C.WIDTH,r+t.left-t.right).attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+t.left+C.COMMA+t.top+C.CLOSEPAREN),this.xAxis=this.svg.append(C.G).attr(C.CLASS,"x axis").attr(C.TRANSFORM,"translate(0,"+i+C.CLOSEPAREN).call(this.x.axis=d3.svg.axis().scale(this.x).orient("bottom").ticks(5).tickSize(-this.height).tickPadding(4).tickSubdivide(!0)),this.yAxis=this.svg.append(C.G).attr(C.CLASS,"y axis").call(this.y.axis=d3.svg.axis().scale(this.y).orient("left").ticks(5).tickFormat(this.format)),this.line=d3.svg.line().interpolate(a).defined(function(e){return e.value!=null}).x(function(e){return l(e.time)}).y(function(e){return c(e.value)}),this.area=d3.svg.area().interpolate(a).defined(this.line.defined()).x(this.line.x()).y0(function(e){return i}).y1(this.line.y()),this.clippedWidth=l(u-f.freq),this.svg.append("defs").append("clipPath").attr(C.ID,function(e,t){return"clip"+f.uuid+C.DASH+t}).append("rect").attr(C.WIDTH,this.clippedWidth).attr(C.HEIGHT,i),this.latest=this.svg.selectAll("text.label").data(f.mostRecent).enter().append("text").attr(C.CLASS,"latest-val").attr(C.ID,function(e,t){return C.TEXT+f.uuid+C.DASH+t}).attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+this.clippedWidth+C.COMMA+i+C.CLOSEPAREN);var h=40,p=10;this.progressBar=this.svg.append(C.G).attr(C.ID,"progress-wrapper"+f.uuid),this.progressBar.append("rect").attr(C.CLASS,"progress-container").attr(C.X,r*.5-h*.5).attr(C.Y,i*.5-p*.5).attr(C.WIDTH,h).attr(C.HEIGHT,p),this.progressBar.append("rect").attr(C.CLASS,"progress").attr(C.ID,"progress"+f.uuid).attr(C.X,r*.5-h*.5).attr(C.Y,i*.5-p*.5).attr(C.WIDTH,0).attr(C.HEIGHT,p),this.element.append("ul").attr(C.CLASS,"graph-tags").text("tags: ").selectAll("li").data(f.tags).enter().append("li").attr(C.CLASS,"graph-tag").attr("tag",function(e){return e}).text(function(e){return e}),d3.select("#tag-list").selectAll("li").data(allTags).enter().append("li").attr("tag",function(e){return e}).attr(C.CLASS,"tag").text(function(e){return e}),this.updateScales=function(e){this.x.domain([e-(this.n-2)*this.duration,e-this.duration]),this.y.domain([0,s*f.max])},this.tryDrawProgress=function(e){if(!this.finishedProgress){var t=+e-f.createdAt;t>f.freq*2?(d3.select("#progress-wrapper"+f.uuid).classed("hidden",!0),this.finishedProgress=!0):d3.select("#progress"+f.uuid).transition().duration(100).ease("linear").attr(C.WIDTH,t*20/f.freq)}}},LineGraph=function(e){MetricGraph.call(this,e);var t=this,n=this.metric;t.element.select(".type-symbol").append("img").attr("src","/pup-line.png"),t.path=t.svg.append(C.G).attr("clip-path",function(e,t){return"url(#clip"+n.uuid+C.DASH+t+C.CLOSEPAREN}).append(C.PATH).data([n.data]).attr(C.CLASS,C.AREA).attr(C.ID,C.AREA+n.uuid).attr(C.D,t.area),t.stroke=t.svg.append(C.G).attr("clip-path",function(e,t){return"url(#clip"+n.uuid+C.DASH+t+C.CLOSEPAREN}).append(C.PATH).data([n.data]).attr(C.CLASS,C.LINE).attr(C.ID,C.LINE+n.uuid).attr(C.D,t.line),t.updateLatestVal=function(e){n.timedOut.is||+e-n.timedOut.at<n.freq*2?t.latest.classed("hidden",!0):t.latest.text(t.format(n.mostRecent[0].value)).classed("hidden",!1)},t.redraw=function(e){var r=t.element;r.select(C.HASH+C.AREA+n.uuid).attr(C.D,t.area).attr(C.TRANSFORM,null),r.select(C.HASH+C.LINE+n.uuid).attr(C.D,t.line).attr(C.TRANSFORM,null),r.select(C.HASH+C.TEXT+n.uuid+C.DASH+C.ZERO).transition().attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+(t.clippedWidth+4)+C.COMMA+(t.y(n.mostRecent[0].value)+3)+C.CLOSEPAREN),t.xAxis.call(t.x.axis),t.yAxis.call(t.y.axis);var i=t.x(e-(t.n-1)*t.duration);t.path.attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+i+C.CLOSEPAREN),t.stroke.attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+i+C.CLOSEPAREN)}},HistogramGraph=function(e){MetricGraph.call(this,e);var t=this;t.element.select(".type-symbol").append("img").attr("src","/pup-histo.png");var n=function(e){var t=d3.layout.stack().x(function(e){return e.time}).y(function(e){return e.value}).out(function(e,t,n){e.y0=t,e.y=e.value}),n=e.map(function(e){return e.values}).sort(function(e,t){return e=e[e.length-1].value,t=t[t.length-1].value,e===t?0:e<t?1:-1});return t(n)},r=t.height,i=n(t.metric.data),s=t.metric;t.path=this.svg.append(C.G).attr("clip-path",function(e,t){return"url(#clip"+s.uuid+C.DASH+t+C.CLOSEPAREN}).selectAll(C.PATH).data(i).enter().append(C.PATH).attr(C.ID,function(e,t){return C.AREA+s.uuid+C.DASH+t}).attr(C.CLASS,C.AREA).attr(C.D,t.area),t.stroke=this.svg.append(C.G).attr("clip-path",function(e,t){return"url(#clip"+s.uuid+C.DASH+t+C.CLOSEPAREN}).selectAll(C.PATH).data(i).enter().append(C.PATH).attr(C.ID,function(e,t){return C.LINE+s.uuid+C.DASH+t}).attr(C.CLASS,C.LINE).attr(C.D,t.line),t.updateLatestVal=function(e){s.timedOut.is||+e-s.timedOut.at<s.freq*2?t.latest.classed(C.HIDDEN,!0):t.latest.data(s.mostRecent).text(function(e,n){return t.format(e.values.value)}).classed(C.HIDDEN,!1)},t.redraw=function(e){var n=t.element,r=t.metric;for(var i=0,o=s.data.length;i<o;i++)n.select(C.HASH+C.AREA+r.uuid+C.DASH+i).attr(C.D,t.area).attr(C.TRANSFORM,null),n.select(C.HASH+C.LINE+r.uuid+C.DASH+i).attr(C.D,t.line).attr(C.TRANSFORM,null),n.select(C.HASH+C.TEXT+r.uuid+C.DASH+i).transition().attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+(t.clippedWidth+4)+C.COMMA+(t.y(r.mostRecent[i].values.value)+3)+C.CLOSEPAREN);t.xAxis.call(t.x.axis),t.yAxis.call(t.y.axis);var u=t.x(e-(t.n-1)*t.duration);for(var a=0,o=t.metric.data.length;a<o;a++)t.path.attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+u+C.CLOSEPAREN),t.stroke.attr(C.TRANSFORM,C.TRANSLATE+C.OPENPAREN+u+C.CLOSEPAREN)}},PupController=function(e,t,n){var r=10,i=Math.sqrt(r*60*1e3),s=Math.ceil(i),o=0,u=new Date(Date.now()-i),a=!1,f=[],l={},c={},h=d3.format(".2s"),p=function(e,t){var n=d3.select("#metric-list").append("li").attr(C.ID,"li"+e.uuid).attr(C.NAME,e.name).attr(C.TIME,+t);n.append("span").attr(C.CLASS,"li-metric").text(e.name),n.append("span").attr(C.CLASS,"li-val"),c[e.name]=n},d=function(e,t){var r=d3.select("#graphs").append("div").attr(C.ID,e.name).attr(C.NAME,e.name).attr(C.TIME,+t).attr(C.CLASS,"plot-box"),o=r.append("div").attr(C.CLASS,"metric-head");o.append("span").attr(C.CLASS,"type-symbol"),o.append("h5").attr(C.CLASS,"metric-name").text(e.name),o.append("a").attr("href",e.name),o.append("a").attr(C.CLASS,"csv").attr(C.NAME,e.name).text("CSV");var a=r.append("div").attr(C.CLASS,"plot");e.type==="histogram"?l[e.name]=new HistogramGraph({metric:e,element:r,n:s,duration:i,now:+u}):e.type!=="histogram"&&(l[e.name]=new LineGraph({metric:e,element:r,n:s,duration:i,now:+u})),g.interact().sort().byActive(),n("#waiting, #no-metrics").addClass("hidden"),n("#graphs, #data-streaming").removeClass("hidden")},v=function(){n("#graphs").empty(),n("#waiting").addClass("hidden"),n("#data-streaming").addClass("hidden"),n("#disconnected").removeClass("hidden"),n("#listening").html("Not "+n("#listening").html())},m=function(){var s=setInterval(function(){e()&&(a=!1,v(),clearTimeout(s)),u=new Date,f=t.getMetrics();var i=f.length;while(i--){var o=f[i];o.setIfTimedOut(u);if(!l.hasOwnProperty(o.name)){var m=new Date;p(o,m),d(o,m)}graph=l[o.name],graph.updateScales(u),o.hasNewData()?o.pushRecent():o.timedOut.is&&o.pushNull(new Date),graph.tryDrawProgress(u),graph.redraw(u);var g=+u-(r*6e4+o.freq);o.shiftOld(g),graph.updateLatestVal(u),o.type==="histogram"?c[o.name].select(".li-val").text(h(o.average)).classed("timed-out",!1):c[o.name].select(".li-val").text(h(o.mostRecent[0].value)).classed("timed-out",!1),o.timedOut.is&&c[o.name].select(".li-val").html("♦").classed("timed-out",!0),o.tags.length&&n("#tags").removeClass("hidden")}},i+o+.5)},g={};return g.tryStart=function(){return a?0:(a=!0,setTimeout(function(){m()},0),1)},g.interact=function(){var e,r,i=function(){n("#if-more").removeClass("hidden").detach().insertBefore("#by"),n("#num-more").html(r-e),n("#dot").addClass("hidden")},s=function(e){var t=window.open();t.document.title=e.name;var n=e.toCSV();t.document.write(n),t.document.body.style.fontFamily="monospace"},o={};return o.updatePlotCount=function(){var t=document.getElementById("graphs").children,i=0;n(t).each(function(){n(this).is(":visible")&&i++}),e=i,r=t.length},o.filterBy=function(t){var s=document.getElementById("graphs").children,u=document.getElementById("metric-list").children,a=t.toLowerCase(),f=s.length;while(f--){var l=s[f].id,c=l.toLowerCase(),h=new RegExp(a,"gi");c.match(h)?(s[f].style.display="",u[f].style.display=""):(s[f].style.display="none",u[f].style.display="none")}o.updatePlotCount(),e<r?i():(n("#if-more").addClass("hidden"),n("#dot").removeClass("hidden"))},o.sort=function(){var e=document.getElementById("graphs"),t=e.children,r=document.getElementById("metric-list"),i=r.children,s=[],o=[],u=t.length,a=function(){var e=0;while(e<u)s[s.length]=t[e],o[s.length]=i[e],e++},f=function(){s.length=0,o.length=0},l=function(){for(var t=0;t<u;t++)e.appendChild(s[t]),r.appendChild(o[t])},c=function(e){return e.sort(function(e,t){return e=e.getAttribute(C.NAME),t=t.getAttribute(C.NAME),e===t?0:e<t?-1:1})},h=function(e){return e.sort(function(e,t){return e=parseInt(e.getAttribute(C.TIME),10),t=parseInt(t.getAttribute(C.TIME),10),e===t?0:e<t?-1:1})},p={};return p.byName=function(){a(),s=c(s),o=c(o),l(),f()},p.byTimeAdded=function(){a(),s=h(s),o=h(o),l(),f()},p.byActive=function(){var e=n(".sort-active")[0].getAttribute(C.ID);e==="by-name"?p.byName():p.byTimeAdded()},p},o.filterByTags=function(s){var u=document.getElementById("graphs").children,a=document.getElementById("metric-list").children,f=document.getElementById("tag-list").children,l=u.length,c=s[0],h;if(n(c).hasClass("tag-active")){n(c).removeClass("tag-active"),n(".graph-tag").each(function(){n(this).html()===n(c).html()&&n(this).css("color","#999")});var p=[];for(var d=0,v=f.length;d<v;d++)n(f[d]).hasClass("tag-active")&&(p[p.length]=f[d].getAttribute("tag"));while(l--){h=u[l].getAttribute(C.NAME);var m=t.getMetricByName(h).tags,g=p.length;if(!p.length)u[l].style.display="",a[l].style.display="";else{while(g--)if(m.indexOf(p[g])>-1)break;g||(u[l].style.display="",a[l].style.display="")}}var y=n("#query").val();y.length&&o.filterBy(y),o.updatePlotCount(),e<r?i():(n("#if-more").addClass("hidden"),n("#dot").removeClass("hidden"))}else{n(c).addClass("tag-active"),n(".graph-tag").each(function(){n(this).html()===n(c).html()&&n(this).css("color","#6f56a2")});while(l--)h=u[l].getAttribute(C.NAME),-1===t.getMetricByName(h).tags.indexOf(c.getAttribute("tag"))&&(u[l].style.display="none",a[l].style.display="none");o.updatePlotCount(),e<r&&i()}return o},o.highlightGraph=function(e){var t=n('.plot-box[name="'+e+'"]'),r=n(t).find("h5");n(r).addClass("highlight-graph-header"),n(t).addClass("highlight-graph");var i=n('li[name="'+e+'"]');return n(i).addClass("highlight-metric"),o},o.scrollToGraph=function(e){var t=n('.plot-box[name="'+e+'"]'),r=n(t).offset().top;return window.scrollTo(0,r-15),o},o.fadeGraph=function(e){var t=n('.plot-box[name="'+e+'"]'),r=n(t).find("h5");n(r).removeClass("highlight-graph-header"),n(t).removeClass("highlight-graph");var i=n('li[name="'+e+'"]');return n(i).removeClass("highlight-metric"),o},o.downloadCSV=function(e){var n=t.getMetricByName(e);s(n)},o},g.n=function(){return s},g}(PupSocket.isClosed,Store,$);