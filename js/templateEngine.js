;(function () {
    window.translateVariables = translateVariables;
    window.setLocale();

    function translateVariables(el) {
        var n;
        //this function is iterating all nodes in document and returns only textNodes witch contains "{{" (out template indicator) from Mozilla MDN
        let walk = document.createNodeIterator(el, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (/\{\{/.test(node.data) || node.origData) {
                    return NodeFilter.FILTER_ACCEPT
                }
            }
        }, false);
        while (n = walk.nextNode()) {
            if (n.origData) n.data = n.origData;
            else n.origData = String(n.data);
            n.data = n.data.replace(/\{\{([a-zA-Z0-9]+)\}\}/g, function (match, target) {//(match,p1,p2,...pN,offset,fullString)
                // console.log(match, target);
                target = window.locales[target];
                return target;
            });
        }
    }
})();

