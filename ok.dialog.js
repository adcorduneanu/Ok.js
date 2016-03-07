OkDialog = {
    closeAnOpenedDialog: function () {
        try {
            document.querySelector("input[id^='quit_r']").click();
        } catch (e) { }
    },
    close: function (id) {
        OkDialog.removeHandler(document, "keyup", OkDialog.keydown)
        var myEl = document.querySelector(id);
        myEl.parentNode.removeChild(myEl);
    },
    generateUniq: function () {
        return "r" + Math.random().toString(22).replace(/0./g, '');
    },
    keydown: function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            OkDialog.closeAnOpenedDialog();
        }
    },
    removeHandler: function (elem, eventType, handler)
    {
        if (elem.removeEventListener)
            elem.removeEventListener(eventType, handler, false);
        if (elem.detachEvent)
            elem.detachEvent('on' + eventType, handler);
    },
    open: function (selector, fullsizeobj) {
        if (selector != undefined) {
            var myElementContent = document.querySelector(selector).innerHTML;
            var tempID = this.generateUniq();

            var customElStyle = "", position = "";
            if (fullsizeobj != undefined) {
                fullsizeobj.height = fullsizeobj.height || "auto";
                customElStyle = " style='width:" + fullsizeobj.width + "px; height:" + fullsizeobj.height + "px;padding:0;margin:0 auto;padding-top: 20px; margin-top:" + Number(window.pageYOffset + 50) + "px;' ";
                position = " style='position:absolute;' ";
            }

            var gemeratedHTML = '<div id="' + tempID + '" class="SlidingPlanningClass" ' + position + '><div class="stickyPanel" ' + customElStyle + '><div class="closePanelClass">';
            gemeratedHTML += '<input type="button" onclick="OkDialog.close(\'#' + tempID + '\')" id="quit_' + tempID + '" class="cancelButtonForSticky"/></div>';
            gemeratedHTML += '<div class="topData"></div><div class="bottomData">';
            gemeratedHTML += myElementContent;
            gemeratedHTML += '</div></div></div>';

            document.body.insertBefore(gemeratedHTML.toDOM(), null);

            var myElement = document.getElementById(tempID);
            myElement.style.display = "block";

            document.onkeyup = OkDialog.keydown.bind(this);
            try {
                myElement.querySelector("input[type='text']").focus();
            } catch (err) { }
            return tempID;
        }
    }
};