function createLightbox(contentDiv) {
    if (!$('lightbox')) {
        var lb = new Element('div', {
            'id':'lightbox',
            'html':'<div class="top"></div><div class="inside"><div class="content"></div></div>'
        });
        lb.set('opacity', 0);
        lb.set('morph', { 'duration': 500 });
        lb.inject($(document.body));
        contentDiv.getElements('p').each(function(myP) {
            myP.setStyle('margin', '0');
        });
        lb.getElement('.content').set('html', contentDiv.get('html'));
        lb.getElement('.content').getElements('img').each(function(myImg) {
            var myDiv = new Element('div', { 'class': 'image' });
            var myTop = new Element('div', { 'class': 'top' });
            var myBot = new Element('div', { 'class': 'bot' });
            myTop.inject(myDiv);
            var newImage = myImg.clone();
            newImage.set('src', myImg.get('src'));
            newImage.set('width', myImg.getSize().x);
            newImage.set('height', myImg.getSize().y);
            newImage.inject(myBot);
            myBot.inject(myDiv);
            myDiv.inject(lb.getElement('.content').getElement('h3'), 'after');
            myImg.dispose();

        });
        var myClear = new Element('div', { 'class': 'clear' });
        myClear.inject(lb.getElement('.content'));
        var myClose = new Element('a', { 'class': 'close', 'href': '#' });
        myClose.addEvent('click', function(e) {
            e.stop();
            closeLightbox();
        });
        myClose.inject(lb.getElement('.content'));
        adjustLightbox();
        if (!$('screen')) {
            var sc = new Element('div', {
                'id':'screen'
            });
            sc.addEvent('click', function(){
                closeLightbox();
            });
            sc.set('opacity', 0);
            sc.inject($(document.body));
            if (Browser.Engine.trident && (Browser.Engine.version == 4)) {
                sc.setStyle('top', $(document.body).getScroll().y);
                sc.setStyle('height', $(document.body).getSize().y);
                sc.setStyle('width', $(document.body).getSize().x);
            }
            var scFx = new Fx.Morph(sc, { 'duration': 500 });
            scFx.start({
                'opacity': '.7'
            }).chain(
                function() {
                    lb.morph({ 'opacity': 1 });
                }
            );
        }
    }
}

function adjustLightbox() {
    if ($('screen')) {
        var sc = $('screen');
        if (Browser.Engine.trident && (Browser.Engine.version == 4)) {
            sc.setStyle('top', $(document.body).getScroll().y);
            sc.setStyle('height', $(document.body).getSize().y);
            sc.setStyle('width', $(document.body).getSize().x);
        }
    }
    if ($('lightbox')) {
        $(document.body).getParent('html').setStyle('overflow-y', 'hidden');
        var lb = $('lightbox');
        if (($(document.body).getSize().y-40) < lb.getElement('.content').getSize().y) {
            lb.getElement('.content').setStyle('height', ($(document.body).getSize().y - 40));
            lb.getElement('.content').setStyle('overflow-y', 'scroll');
        }
        else {
            lb.getElement('.content').setStyle('height', 'auto');
            lb.getElement('.content').setStyle('overflow-y', 'auto');
        }
        var lbLft = ($(document.body).getSize().x / 2).round() - (lb.getSize().x / 2).round() + $(document.body).getScroll().x;
        var lbTop = ($(document.body).getSize().y / 2).round() - (lb.getSize().y / 2).round() - 38 + $(document.body).getScroll().y;
        lb.morph({ 'left': lbLft, 'top': lbTop });
    }
}

function closeLightbox() {
    if ($('lightbox')) {
        var lb = $('lightbox');
        var lbFx = new Fx.Morph(lb, {'duration':500});
        var sc = $('screen');
        var scFx = new Fx.Morph(sc, { 'duration': 500 });
        
        lbFx.start({
            'opacity': 0
        }).chain(
            function() {
                scFx.start({
                    'opacity': 0
                }).chain(
                    function() {
                        lb.dispose();
                        sc.dispose();
                        $(document.body).getParent('html').setStyle('overflow', 'auto');
                        $(document.body).getParent('html').removeProperties('style');
                    }
                );
            }
        );
    }
}

window.addEvent('domready', function() {
    $$('.listItemText').each(function(myItem) {
        var myLi = myItem.getParent('li')
        myLi.setStyle('cursor', 'pointer');
        myLi.addEvent('click', function() {
            var myContent = myLi.getElement('.divPopupContent');
            createLightbox(myContent);
        });
    });

    $$('.promotionImage').each(function(myItem) {
        var myLi = myItem.getParent('div')
        myLi.setStyle('cursor', 'pointer');
        myLi.addEvent('click', function() {
            var myContent = myLi.getElement('.divPopupContent');
            createLightbox(myContent);
        });
    });
});

window.addEvent('resize', function() {
    adjustLightbox();
});
window.addEvent('scroll', function(e) {
    adjustLightbox();
});