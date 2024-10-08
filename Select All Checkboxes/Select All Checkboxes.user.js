// ==UserScript==
// @name         Select All Checkboxes
// @name:zh-CN   多选框伴侣
// @name:zh-TW   多選框伴侶
// @namespace    hoothin
// @version      0.6.2
// @description  A mate for checkbox, select all checkboxes by press Ctrl+Alt+mouse1, or select checkboxes with mouse over by press Alt, or select checkboxes between 2 marks by press Shift.
// @description:zh-CN Ctrl+Alt点击全选多选框，Alt加鼠标悬停选择多选框，Shift选择两个多选框之间的所有多选框
// @description:zh-TW Ctrl+Alt點擊全選多選框，Alt加鼠標懸停選擇多選框，Shift選擇兩個多選框之間的所有多選框
// @author       Hoothin
// @include      http*://*/*
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=rixixi@sina.com&item_name=Greasy+Fork+donation
// @contributionAmount 1
// ==/UserScript==

(function() {
    'use strict';
    var type=navigator.appName;
    var lang = null;
    if (type=="Netscape"){
        lang = navigator.language;
    }else{
        lang = navigator.userLanguage;
    }
    var langStr = lang.substr(0,2);
    if (langStr == "zh"){
        langStr = "全选";
    }else{
        langStr = "SelectAll";
    }
    var _GM_registerMenuCommand;
    if(typeof GM_registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM_registerMenuCommand;
    }else if(typeof GM!='undefined' && typeof GM.registerMenuCommand!='undefined'){
        _GM_registerMenuCommand=GM.registerMenuCommand;
    }
    if(typeof _GM_registerMenuCommand=='undefined')_GM_registerMenuCommand=(s,f)=>{};
    _GM_registerMenuCommand(langStr, selectAll);
    var selector="input:checkbox:enabled,.checkbox";

    function selectAll(){
        $(selector).click();
    }

    var preObj;
    var mouseDownHandler = function (event) {
        let self = this, doc = document;
        if (this.shadowRoot && this.shadowRoot.activeElement) {
            if (this.shadowRoot.activeElement.type != "checkbox" || !/^input$/i.test(this.shadowRoot.activeElement.nodeName)) {
                return;
            } else {
                self = this.shadowRoot.activeElement;
                doc = this.shadowRoot;
            }
        }
        if(!event.shiftKey&&event.altKey&&event.ctrlKey){
            $(selector, doc).click();
            self.click();
        }else if(event.shiftKey&&!event.altKey&&!event.ctrlKey){
            var curParent=self;
            var preParent=preObj;
            for(var i=0;i<5;i++){
                curParent=curParent.parentNode;
                preParent=preParent.parentNode;
                if(!curParent||!preParent) {
                    preObj=self;
                    return;
                }
                if(curParent==preParent){
                    var target=self;
                    var find=false;
                    $(curParent).find(selector).each(function(){
                        if(this==preObj||this==target){
                            if(find){
                                find=false;
                                return;
                            }
                            find=true;
                        }else if(find){
                            this.click();
                        }
                    });
                    break;
                }
            }
        }
        preObj=self;
    };
    var mouseEnterHandler = function (event) {
        if(!event.shiftKey&&event.altKey&&!event.ctrlKey){
            this.click();
        }
    };
    $(document).on("mousedown", selector, mouseDownHandler);
    $(document).on("mouseup", "#download-all-content", mouseDownHandler);
    $(document).on("mouseenter", selector, mouseEnterHandler);
})();