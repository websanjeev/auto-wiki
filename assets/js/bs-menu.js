$(function($){

    var pluginName = 'bs-menu';
    var pluginClassName = '.' + pluginName;

    var body = $('body');

    var menuToggleBtnName = 'bs-menu-toggle';
    var menuToggleBtnClass = '.' + menuToggleBtnName;
    var menuToggleBtn = $('<span class="' + menuToggleBtnName + '"></span>');

    var leftName = 'left';
    var rightName = 'right';

    var bsMenus = null;

    $.fn.bsMenu = function(){

        if(!this.hasClass(pluginName)){
            this.addClass(pluginName);
        }

        bsMenus = this;

//        insertDocumentWrapper();

        for(var i = 0; i < this.length; i++){
            init($(this.get(i)));
        }
        this.trigger({type: 'bs-menu-loaded'});

    };

    /*function insertDocumentWrapper(){
        body.wrapInner('<div class="bs-body-wrapper"></div>');
    }*/

    function init(bsMenu){
        initMobileMenu(bsMenu);
        initDesktopMenu(bsMenu);
    }

    function initDesktopMenu(bsMenu){

        var bsMenuDesktopName = 'bs-menu-desktop';
        bsMenu.addClass(bsMenuDesktopName);

        function setDirections(bsMenu){
            var topMenus = $(' > ul', bsMenu);
            var subMenus = $('ul', topMenus);

            function setDirectionsToSubMenus(subMenus){
                for(var i = 0; i < subMenus.length; i++){
                    setDirectionToSubMenu($(subMenus.get(i)));
                }
            }

            function setDirectionToSubMenu(menu){

                var windowWidth = $(window).width();
                var menuPosition = menu.offset();
                var menuWidth = menu.width();
                var menuEndPosition = menuPosition.left + menuWidth;

                if(menuEndPosition > windowWidth){
                    if(menu.hasClass(rightName)){
                        menu.removeClass(rightName);
                    }
                    if(!menu.hasClass(leftName)){
                        menu.addClass(leftName);
                    }
                }else{
                    if(menu.hasClass(leftName)){
                        menu.removeClass(leftName);
                    }
                    if(!menu.hasClass(rightName)){
                        menu.addClass(rightName);
                    }
                }

            }

            setDirectionsToSubMenus(subMenus);
            $(window).resize(function(){
                setDirectionsToSubMenus(subMenus);
            });
        }

        setDirections(bsMenu);
    }

    function initMobileMenu(bsMenu){

        var mobileMenuName = 'bs-menu-mobile';
        var bsMenuMobile = null;

        var goBackBtnName = 'bs-go-back';
        var goBackBtnClass = '.bs-go-back';

        var goBackBtnDefaultText = 'Go Back';
        var goBackTitleAttrName = 'data-go-back-title';

        var leftMenuOpenedName = 'bs-menu-opened-left';
        var rightMenuOpenedName = 'bs-menu-opened-right';

        var menuPositionLeftName = 'left';
        var menuPositionRightName = 'right';

        // menu slide states
        var activeMenuName = 'active';
        var prevMenuName = 'prev';
        var nextMenuName = 'next';

        var position = menuPositionRightName;
        var dataPosition = bsMenu.attr('data-position');
        if(typeof dataPosition != 'undefined' || dataPosition != null){
            position = dataPosition;
        }

        var topMenus = null;
        var subMenus = null;

        function insertOverlay() {
            var bsOverlay = $(".bs-overlay");
            if(bsOverlay.length > 0) {
                return;
            }
            var overlay = $('<div class="bs-overlay"></div>');
            body.append(overlay);
            overlay.click(function(){
                if(body.hasClass(leftMenuOpenedName)){
                    body.removeClass(leftMenuOpenedName);
                }
                if(body.hasClass(rightMenuOpenedName)){
                    body.removeClass(rightMenuOpenedName);
                }
            });
        }

        function makeMobileMenu(){
            bsMenuMobile = bsMenu.clone().addClass(mobileMenuName);
            body.append(bsMenuMobile);

            topMenus = $(' > ul', bsMenuMobile);
            subMenus = $('ul', bsMenuMobile);

        }

        function createGoBackBtn(text){
            if(typeof text == "undefined" || text == null){
                text = goBackBtnDefaultText;
            }
            return $('<li><a href="#" class="' + goBackBtnName + '">' + text + '</a></li>');
        }

        function breakMobileMenu(menu){
            var menuItems = $(' > li', menu);
            for(var i = 0; i < menuItems.length; i++){
                var menuItem = $(menuItems.get(i));
                var subMenu = $(' > ul', menuItem);
                if(subMenu.length > 0){

                    var goBackText = $(' > a', menuItem).attr(goBackTitleAttrName);
                    var goBackBtn = createGoBackBtn(goBackText);
                    subMenu.prepend(goBackBtn);
                    (function(subMenu){
                        goBackBtn.click(function(e){
                            e.preventDefault();
                            goToPrevMenu(subMenu, menu);
                        });
                    })(subMenu);

                    (function(subMenu){
                        $(' > a', menuItem).click(function(e){
                            e.preventDefault();
                            goToNextMenu(menu, subMenu)
                        });
                    })(subMenu);
                    bsMenuMobile.append(subMenu);
                    breakMobileMenu(subMenu);
                }
            }
        }

        function goToNextMenu(currentMenu, nextMenu){
            currentMenu.removeClass(activeMenuName);
            currentMenu.addClass(prevMenuName);
            nextMenu.addClass(activeMenuName);
        }

        function goToPrevMenu(currentMenu, prevMenu){
            prevMenu.removeClass(prevMenuName);
            prevMenu.addClass(activeMenuName);
            currentMenu.removeClass(activeMenuName);
        }

        function setMenuPosition(){
            if(!bsMenuMobile.hasClass(position)){
                bsMenuMobile.addClass(position);
            }
            if(!bsMenu.hasClass(position)){
                bsMenu.addClass(position);
            }
        }

        function toggleMenu(menuToggle){
            if(position == menuPositionLeftName){
                swapBodyState(leftMenuOpenedName, rightMenuOpenedName);
            }else{
                swapBodyState(rightMenuOpenedName, leftMenuOpenedName);
            }
            resetAllMenus();
        }

        function swapBodyState(toAdd, toRemove){
            if(!body.hasClass(toAdd)){
                if(body.hasClass(toRemove)){
                    body.removeClass(toRemove);
                }
                body.addClass(toAdd);
            }else{
                body.removeClass(toAdd);
            }
        }

        function resetAllMenus(){
            var topMenus = $('ul:nth-child(1)', bsMenuMobile);
            var subMenus = $('ul:not(:first-child)', bsMenuMobile);
            if(topMenus.hasClass(prevMenuName)){
                topMenus.removeClass(prevMenuName);
            }
            if(!topMenus.hasClass(activeMenuName)){
                topMenus.addClass(activeMenuName);
            }
            if(subMenus.hasClass(activeMenuName)){
                subMenus.removeClass(activeMenuName);
            }
            if(subMenus.hasClass(prevMenuName)){
                subMenus.removeClass(prevMenuName);
            }
        }

        function insertMenuToggleBtn(){
            var hasMenuToggleBtn = $(menuToggleBtnClass, bsMenu).length > 0;
            if(hasMenuToggleBtn) {
                return;
            }
            var newMenuToggleBtn = menuToggleBtn.clone();
            bsMenu.append(newMenuToggleBtn);

            if(!newMenuToggleBtn.hasClass('b_')){
                newMenuToggleBtn.addClass('b_');
                newMenuToggleBtn.click(function(){
                    toggleMenu($(this));
                });
            }
        }

        makeMobileMenu();
        breakMobileMenu(topMenus);
        insertMenuToggleBtn();
        setMenuPosition();
        insertOverlay();
        resetAllMenus();
    }



}( jQuery ));