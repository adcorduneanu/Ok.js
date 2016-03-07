//html element polyfill
var elementPrototype = typeof HTMLElement !== "undefined" ? HTMLElement.prototype : Element.prototype;

//has class function
elementPrototype.hasClass = function (className) {
    return this.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};

//remove class function
elementPrototype.removeClass = function (className) {

    if (this.hasClass(className)) {
        var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
        this.className = this.className.replace(reg, " ");
    }

};

//add class to the element function
elementPrototype.addClass = function (className) {
    if (!this.hasClass(className)) {
        if (this.className == "") {
            this.className = className;
        }
        else {
            this.className += " " + className;
        }
    }
};

//replace oldClassName with newClassName
elementPrototype.replaceClass = function (oldClassName, newClassName) {
    if (this.hasClass(oldClassName)) {
        this.removeClass(oldClassName);
        this.addClass(newClassName);
    }
    return;
};

//swap class into element by our needs
elementPrototype.toggleClass = function (oldClassName, newClassName) {
    if (this.hasClass(oldClassName)) {
        this.replaceClass(oldClassName, newClassName);
    } else if (this.hasClass(newClassName)) {
        this.replaceClass(newClassName, oldClassName);
    } else {
        this.addClass(oldClassName);
    }
};

elementPrototype.cumulativeOffset = function () {
    var e = this;
    var isNotFirefox = (navigator.userAgent.toLowerCase().indexOf('firefox') == -1);
    var x = 0, y = 0;
    while (e) {
        x += e.offsetLeft - e.scrollLeft + (isNotFirefox ? e.clientLeft : 0);
        y += e.offsetTop - e.scrollTop + (isNotFirefox ? e.clientTop : 0);
        e = e.offsetParent;
    }
    return { left: x + window.scrollX, top: y + window.scrollY };
};

elementPrototype.index = function () {
    var node = this;
    var index_ = 0;
    while ((node = node.previousSibling)) {
        if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
            index_++;
        }
    }
    return index_;
};

elementPrototype.prepend = function (whatToPrepend) {
    this.insertBefore(whatToPrepend.toDOM(), this.firstChild);
};

elementPrototype.append = function (whatToAppend) {
    this.insertBefore(whatToAppend.toDOM(), null);
};

elementPrototype.remove = elementPrototype.remove || function () {
    this.parentNode.removeChild(this);
}

elementPrototype.next = function () {
    try {
        return this.nextElementSibling;
    }
    catch (err) {
        try {
            var indexNC = this.index();
            return this.parentNode.children[indexNC + 1];
        }
        catch (err2) {
            return document.createElement('div');
        }
    }
};

elementPrototype.previous = function () {
    try {
        return this.previousElementSibling;
    }
    catch (err) {
        try {
            var indexNC = this.index();
            return this.parentNode.children[indexNC - 1];
        }
        catch (err2) {
            return document.createElement('div');
        }
    }
};

elementPrototype.text = function (text) {
    if (text == undefined) {
        var elem = this;
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;

        if (!nodeType) {
            // If no nodeType, this is expected to be an array
            while ((node = elem[i++])) {
                // Do not traverse comment nodes
                ret += getText(node);
            }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            // Use textContent for elements
            // innerText usage removed for consistency of new lines (jQuery #11153)
            if (typeof elem.textContent === "string") {
                return elem.textContent;
            } else {
                // Traverse its children
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText(elem);
                }
            }
        } else if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
        }
        // Do not include comment or processing instruction nodes

        return ret;
    }
    else {
        var propertyset = ('innerText' in this) ? 'innerText' : 'textContent';
        this[propertyset] = text;
    }
};

elementPrototype.isEmpty = function () {
    return this.text() === null || this.text() === undefined ? true : /^[\s\xa0]*$/.test(this.text());
}

elementPrototype.slideInLeft = function (time_in_seconds) {
    var isTouchSupported = 'ontouchstart' in window.document;
    if (!isTouchSupported) {
        time_in_seconds *= 300;
        var element = this;
        var distance = 20;
        var minus = "-";
        var timer = setInterval(function () {
            if (time_in_seconds == 0) {
                clearInterval(timer);
                element.style.marginLeft = "0px";
            }

            time_in_seconds -= distance;
            minus = time_in_seconds <= 0 ? "" : minus;
            var howmuch = time_in_seconds <= 0 ? 0 : time_in_seconds;
            element.style.marginLeft = minus + howmuch + "px";

        }, distance);
    }
};

elementPrototype.slideInRight = function (time_in_seconds) {
    var isTouchSupported = 'ontouchstart' in window.document;
    if (!isTouchSupported) {
        time_in_seconds *= 300;
        var element = this;
        var distance = 20;

        var timer = setInterval(function () {
            if (time_in_seconds == 0) {
                clearInterval(timer);
                element.style.marginLeft = "0px";
            }

            time_in_seconds -= distance;
            var howmuch = time_in_seconds >= 0 ? time_in_seconds : 0;
            element.style.marginLeft = howmuch + "px";

        }, distance);
    }
};

var documentPrototype = typeof HTMLDocument !== "undefined" ? HTMLDocument.prototype : Document.prototype;

documentPrototype.removeClass = function (className) {
    // convert the result to an Array object
    var els = Array.prototype.slice.call(
      document.getElementsByClassName(className)
    );
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        el.className = el.className.replace(
          new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g'),
          '$1'
        );
    }
};

Object.keys = Object.keys || function (o, k, r) { r = []; for (k in o) r.hasOwnProperty.call(o, k) && r.push(k); return r; };

String.Empty = "";

//equals method from c# for strings
String.prototype.equals = function (value) {
    return this.toString() == value ? true : false;
};
//contains method from c# for strings
String.prototype.contains = function (value) {
    return this.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) != -1;
};

//create a dom element from a string
String.prototype.toDOM = function () {
    var d = document
       , i
       , a = d.createElement("div")
       , b = d.createDocumentFragment();
    a.innerHTML = this;
    while (i = a.firstChild) b.appendChild(i);
    return b;
};

Boolean.prototype.equals = function (value) {
    return this == value ? true : false;
};

Number.prototype.addZeroBefore = function () {
    return (this < 10 ? '0' : '') + this;
};

Number.prototype.equals = function (value) {
    return this == value ? true : false;
};

Function.prototype.bind = function (parent) {
    var f = this;
    var args = [];

    for (var a = 1; a < arguments.length; a++) {
        args[args.length] = arguments[a];
    }

    var temp = function () {
        return f.apply(parent, args);
    };

    return (temp);
};

Function.prototype.clone = function () {
    var cloneObj = this;
    if (this.__isClone) {
        cloneObj = this.__clonedFrom;
    }

    var temp = function () { return cloneObj.apply(this, arguments); };
    for (var key in this) {
        temp[key] = this[key];
    }

    temp.__isClone = true;
    temp.__clonedFrom = cloneObj;

    return temp;
};

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

Date.prototype.getWeek = function (dowOffset) {
    dowOffset = dowOffset != undefined ? dowOffset : 0;
    var newYear = new Date(this.getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset;
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    var weeknum;

    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1;
        if (weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1, 0, 1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
};

Date.prototype.isLeapYear = function (utc) {
    var year = utc ? this.getUTCFullYear() : this.getFullYear();
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};

Date.prototype.addDays = function (num) {
    var value = this.valueOf();
    value += 86400000 * num;
    return new Date(value);
}

Date.prototype.addSeconds = function (num) {
    var value = this.valueOf();
    value += 1000 * num;
    return new Date(value);
}

Date.prototype.addMinutes = function (num) {
    var value = this.valueOf();
    value += 60000 * num;
    return new Date(value);
}

Date.prototype.addHours = function (num) {
    var value = this.valueOf();
    value += 3600000 * num;
    return new Date(value);
}

Date.prototype.addMonths = function (num) {
    var value = new Date(this.valueOf());

    var mo = this.getMonth();
    var yr = this.getYear();

    mo = (mo + num) % 12;
    if (0 > mo) {
        yr += (this.getMonth() + num - mo - 12) / 12;
        mo += 12;
    }
    else
        yr += ((this.getMonth() + num - mo) / 12);

    value.setMonth(mo);
    value.setYear(yr);
    return value;
}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0, 0);
    return d
}

NodeList.prototype.addClass = function (className) {
    var i = 0;
    while (i != this.length) {
        this.item(i).addClass(className);
        i++;
    }
};

NodeList.prototype.removeClass = function (className) {
    var i = 0;
    while (i != this.length) {
        this.item(i).removeClass(className);
        i++;
    }
};

NodeList.prototype.attr = function () {
    var arg = arguments;
    if (arg.length == 2) {
        //set
        var i = 0;
        while (i != this.length) {
            if (arg[1] != "") {
                this.item(i).setAttribute(arg[0], arg[1]);
            }
            else {
                this.item(i).removeAttribute(arg[0]);
            }
            i++;
        }
    }
    else if (arg.length == 1) {
        //get     
        var i = 0;
        var x = new Array();
        while (i != this.length) {
            x.push(this.item(i).getAttribute(arg[0]));
            i++;
        }
        return x.length > 1 ? x : x[0];
    }
    else {

    }
};

NodeList.prototype.remove = function () {
    var i = 0;
    while (i != this.length) {
        this.item(i).remove();
        i++;
    }
}

var ok = function (model) {
    return new Ok.init(model);
};
//ajax//
(function (output) {
    var ajax = output.ajax = function (_options) {
        _options = _options || {};

        var noop = function () {
            return void 0;
        };

        var options = {
            async: _options.async || true,
            data: _options.data || {},
            error: _options.error || noop,
            success: _options.success || noop,
            beforeSend: _options.beforeSend || noop,
            type: _options.type || 'GET',
            complete: _options.complete || noop,
            url: _options.url || '',
            contentType: _options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: _options.crossDomain || false,
            dataType: _options.dataType || 'text',
            callbackName: _options.callbackName || ''
        };

        if (options.url.length === 0) {
            throw new Error('MissingUrl');
        }

        if ((options.dataType.toLowerCase() == "jsonp" || options.crossDomain || options.callbackName !== '') && options.type == "GET") {
            return JSONP(options, true);
        }

        noop = function () {
            return void 0;
        };

        var createXHR = function () {
            try {
                return new window.XMLHttpRequest();
            } catch (e) {
                return new window.ActiveXObject("Microsoft.XMLHTTP");
            }
        }

        var xhr = createXHR();

        xhr.open(options.type, options.url, options.async);

        if (options.type === 'POST') {
            xhr.setRequestHeader("Content-Type", options.contentType);
        }

        xhr.send(options.data);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                options.success && options.success(xhr.responseText)
            }
        }
    }

    var JSONP = output.JSONP = function (_options, _fromAjax) {
        var head, script;
        _options = _options || {};

        var noop = function () {
            return void 0;
        };

        var objectToURI = function (obj) {
            var data, key, value;
            data = [];
            for (key in obj) {
                value = obj[key];
                data.push(encode(key) + '=' + encode(value));
            }
            return data.join('&');
        };

        var computedUrl = function (options_) {
            var url;
            url = options_.url;
            url += options_.url.indexOf('?') < 0 ? '?' : '&';
            url += objectToURI(options_.data);
            return url;
        };

        var random = Math.random;

        var randomString = function (length) {
            var str;
            str = '';
            while (str.length < length) {
                str += random().toString(36)[2];
            }
            return str;
        };

        var createElement = function (tag) {
            return window.document.createElement(tag);
        };

        var encode = window.encodeURIComponent;


        var options = _fromAjax !== undefined ? _options :
	    {
	        async: _options.async || true,
	        data: _options.data || {},
	        error: _options.error || noop,
	        success: _options.success || noop,
	        beforeSend: _options.beforeSend || noop,
	        type: 'GET',
	        complete: _options.complete || noop,
	        url: _options.url || '',
	        contentType: 'application/javascript; charset=UTF-8',
	        crossDomain: _options.crossDomain || false,
	        dataType: 'jsonp',
	        callbackName: _options.callbackName || ''
	    };

        if (options.url.length === 0) {
            throw new Error('MissingUrl');
        }
        var done = false;
        if (options.beforeSend({}, options) !== false) {
            var callback = options.data[options.callbackName || 'callback'] = 'jsonp_' + randomString(15);
            window[callback] = function (data) {
                options.success(data, options);
                options.complete(data, options);
                try {
                    return delete window[callback];
                } catch (_error) {
                    window[callback] = void 0;
                    return void 0;
                }
            };
            script = createElement('script');
            script.src = computedUrl(options);
            script.async = options.async;
            script.onerror = function (evt) {
                options.error({
                    url: script.src,
                    event: evt
                });
                return options.complete({
                    url: script.src,
                    event: evt
                }, options);
            };
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    return script = null;
                }
            };
            head = head || window.document.getElementsByTagName('head')[0] || window.document.documentElement;
            return head.insertBefore(script, head.firstChild);
        }
    };
})(this);
//ajax//

Ok = {
    init: function (elem) {
        return document.querySelectorAll(elem);
    },
    ready: function (fn) {

        var done = false, top = true,

        doc = window.document, root = doc.documentElement,

        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
        rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
        pre = doc.addEventListener ? '' : 'on',

        init = function (e) {
            if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
            (e.type == 'load' ? window : doc)[rem](pre + e.type, init, false);
            if (!done && (done = true)) fn.call(window, e.type || e);
        },

        poll = function () {
            try { root.doScroll('left'); } catch (e) { setTimeout(poll, 50); return; }
            init('poll');
        };

        if (doc.readyState == 'complete') fn.call(window, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try { top = !window.frameElement; } catch (e) { }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            window[add](pre + 'load', init, false);
        }
    },
    isMobile: function () {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        var ismobile = false;
        if (/android|(bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            ismobile = true;
        return ismobile;
    },
    addCSS: function (pathCSS) {
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", pathCSS);
        document.getElementsByTagName("head")[0].appendChild(css);
    },
    addJS:function(pathJS){
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = pathJS;
        document.body.appendChild(js);
    },
    removeCSS: function (pathCSS) {
        var temp = document.getElementsByTagName("head")[0].getElementsByTagName("link");
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].getAttribute("href") == pathCSS) {
                temp[i].remove();
                break;
            }
        }
    },
    observe: function (fieldId, callback, time) {
        time = time || 30;
        var previousVal = null, previousIndex = null, interval = null;

        interval = setInterval(function () {
            var field = undefined;
            if (fieldId.match(/(\.|\#|\[|\])/gi)) {
                field = document.querySelector(fieldId);
            }
            else {
                field = document.getElementById(fieldId);
            }

            if (field == undefined) {
                clearInterval(interval);
            }
            else {
                var newValue = (field.type=="checkbox"?(field.checked?true:false):field.value) || "";
                var newIndex = field.index() || 0;

                if ((previousVal !== null && previousVal != newValue) || (newIndex != previousIndex && previousIndex !== null)) {
                    callback({ 'id': fieldId, 'value': newValue, 'oldValue': previousVal, 'index': newIndex, 'oldIndex': previousIndex });
                }
                previousVal = newValue;
                previousIndex = newIndex;
            }

        }, time);

        return interval;
    }
};

Url = {
    getSearchParameters: function () {
        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? this.transformToAssocArray(prmstr) : {};
    },

    transformToAssocArray: function (prmstr) {
        var params = {};
        var prmarr = prmstr.split("&");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }
};
