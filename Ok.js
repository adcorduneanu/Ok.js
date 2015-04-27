(function () {
    function Ok(selector) { 
        if (this instanceof Ok) {
            return new Ok(selector);
        }

        return Ok.prototype.search(selector);        
    }

    Ok.prototype = {
        constructor: Ok,
        length: 0,        
        search: function (selector) {
            var that = this, elems, i = 0;
            while (i<that.length) {
                delete that[i]
                i++;
            }
            i = 0,that.length=0;
            if (typeof selector === "string") {
                switch (true) {
                    case /\[|\:|\"|\=|\>/.test(selector):
                        elems = document.querySelectorAll(selector);
                        break;
                    case /#/.test(selector):
                        elems = [document.getElementById(selector.substring(1))];
                        break;
                    case /\./.test(selector):
                        elems = document.getElementsByClassName(selector.substring(1));
                        break;
                    case /[a-zA-Z]/.test(selector[0]):
                        elems = document.getElementsByTagName(selector);
                        break;
                }
                while (i < elems.length) {
                    that[i] = elems[i]; i++;
                }
                this.length = elems.length;
            } else {
                this[0] = selector;
                this.length = 1;
            }

            return this;
        },
        append: function (text) {           
            this.each(function (x) {
                this.insertBefore(text.toDOM(), null);
            });
            
            return this;
        },
        prepend:function(text){
            this.each(function (x) {
                this.insertBefore(text.toDOM(), this.firstChild);
            });
            
            return this;
        },
        each: function (callback) {
            var i = 0;
            while (i < this.length) {
                this[i] = callback.call(this[i], i);
                i++;
            }
            return this;
        },
        remove: function () {
            var i = 0;
            while (i < this.length) {
                this[i].remove() || function () {
                    this[i].parentNode.removeChild(this[i]);
                }
                i++;
            }
            return this;
        },
        css: function (what, value) {
            this.each(function (x) {
                if (typeof what == "object") {

                }
            });
        },
        hasClass: function (className) {
            try{
                return new RegExp("(\\s|^)" + className + "(\\s|$)").test(this[0].className);
            } catch (err) { return false;}
        },
        removeClass: function (className) {
            this.each(function (x) {
                if (this.hasClass(className)) {
                    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
                    this.className = this.className.replace(reg, " ");
                }
            });
        },
        addClass: function (className) {
            this.each(function (x) {
                if (!this.hasClass(className)) {
                    if (this.className == "") {
                        this.className = className;
                    }
                    else {
                        this.className += " " + className;
                    }
                }
            });
        },
        replaceClass: function (oldClassName, newClassName) {
            this.each(function (x) {
                if (this.hasClass(oldClassName)) {
                    this.removeClass(oldClassName);
                    this.addClass(newClassName);
                }                
            });
        },
        toggleClass: function (oldClassName, newClassName) {
            this.each(function (x) {
                if (this.hasClass(oldClassName)) {
                    this.replaceClass(oldClassName, newClassName);
                } else if (this.hasClass(newClassName)) {
                    this.replaceClass(newClassName, oldClassName);
                } else {
                    this.addClass(oldClassName);
                }
            });
        },
        show: function () {
            this.each(function (x) {
                this.style.display = this.oldblock ? this.oldblock : "";
                if (Ok(this).css("display") == "none")
                    this.style.display = "block";
            });
        },
        hide: function () {
            this.each(function (x) {
                this.oldblock = this.oldblock || Ok(this).css("display");
                if (this.oldblock == "none")
                    this.oldblock = "block";
                this.style.display = "none";
            });
        },
        index:function(){
            var node = this[0];
            var index_ = 0;
            while ((node = node.previousSibling)) {
                if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
                    index_++;
                }
            }
            return index_
        },
        next:function(){
            try {
                return Ok(this[0].nextElementSibling);
            }
            catch (err) {
                try {
                    var indexNC = Ok(this[0]).index();
                    return Ok(this.parentNode.children[indexNC + 1]);
                }
                catch (err2) {
                    return Ok(document.createElement('div'));
                }
            }
        },
        previous:function(){
            try {
                return Ok(this[0].previousElementSibling);
            }
            catch (err) {
                try {
                    var indexNC = Ok(this[0]).index();
                    return Ok(this.parentNode.children[indexNC - 1]);
                }
                catch (err2) {
                    return Ok(document.createElement('div'));
                }
            }
        },
        text: function (text) { 
            var that = this[0];
            if (text == undefined) {
                var elem = that;
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
                var propertyset = ('innerText' in that) ? 'innerText' : 'textContent';
                that[propertyset] = text;
                return this;
            }
        },
        attr : function () {
            var arg = arguments;
            if (arg.length == 2) {
                //set
                var i = 0;
                while (i != this.length) {
                    if (arg[1] != "") {
                        this[i].setAttribute(arg[0], arg[1]);
                    }
                    else {
                        this[i].removeAttribute(arg[0]);
                    }
                    i++;
                }
            }
            else if (arg.length == 1) {
                //get     
                var i = 0;
                var x = new Array();
                while (i != this.length) {
                    x.push(this[i].getAttribute(arg[0]));
                    i++;
                }
                return x.length > 1 ? x : x[0];
            }
            else {

            }
        }
    }

    Ok.ready = function (fn) {
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
    };
    Ok.isMobile = function () {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        var ismobile = false;
        if (/android|(bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            ismobile = true;
        return ismobile;
    };
    Ok.addJSCSS = function (path, type) {
        if (type.toLowerCase() == "css" || path.toLowerCase().indexOf('.css') > 1) {
            Ok('head').append('<link rel="stylesheet" type="text/css" href="' + path + '"/>');
        }
        else if (type.toLowerCase() == "js" || path.toLowerCase().indexOf('.js') > 1) {
            Ok('head').append('<script type="text/javascript" src="' + path + '"></script>');
        }
    };
    Ok.removeJSCSS = function (path, type) {        
        if (type.toLowerCase() == "css" || path.toLowerCase().indexOf('.css') > 1) {
            Ok('link[href~="' + path + '"]').remove();
        }
        else if (type.toLowerCase() == "js" || path.toLowerCase().indexOf('.js') > 1) {
            Ok('script[src~="' + path + '"]').remove();
        }
    };
    Ok.observe= function (fieldId, callback, time) {
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
                var newValue = field.value || "";
                var newIndex = field.index() || 0;

                if ((previousVal !== null && previousVal != newValue) || (newIndex != previousIndex && previousIndex !== null)) {
                    callback({ 'id': fieldId, 'value': newValue, 'oldValue': previousVal, 'index': newIndex, 'oldIndex': previousIndex });
                }
                previousVal = newValue;
                previousIndex = newIndex;
            }

        }, time);

        return interval;
    };
    String.prototype.toDOM = function () {
        var d = document
           , i
           , a = d.createElement("div")
           , b = d.createDocumentFragment();
        a.innerHTML = this;
        while (i = a.firstChild) b.appendChild(i);
        return b;
    };

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
    })(Ok);

    window.Ok = Ok;

    Ok.extend = Ok.prototype.extend = function (obj, prop) {
        if (!prop) { prop = obj; obj = this; }
        for (var i in prop) obj[i] = prop[i];
        return obj;
    };
}());
