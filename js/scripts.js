// page init
jQuery(function() {
    initMarquee();
});

// running line init
function initMarquee() {
    jQuery('div.example1').marquee({
        line: 'div.line-wrap',
        animSpeed: 90
    });
    jQuery('div.example2').marquee({
        direction: 'right',
        line: 'div.line-wrap',
        animSpeed: 30,
        initialDelay: 3000
    });
}

/*
 * jQuery <marquee> plugin
 */
;
(function($) {
    function Marquee(options) {
        this.options = $.extend({
            holder: null,
            handleFlexible: true,
            pauseOnHover: true,
            hoverClass: 'hover',
            direction: 'left',
            cloneClass: 'cloned',
            mask: null,
            line: '>*',
            items: '>*',
            animSpeed: 10, // px per second
            initialDelay: 0
        }, options);
        this.init();
    }
    Marquee.prototype = {
        init: function() {
            if (this.options.holder) {
                this.initStructure();
                this.attachEvents();
            }
        },
        initStructure: function() {
            // find elements
            this.holder = $(this.options.holder);
            this.mask = this.options.mask ? this.holder.find(this.options.mask) : this.holder,
                this.line = this.mask.find(this.options.line),
                this.items = this.line.find(this.options.items).css({
                    'float': 'left'
                });
            this.direction = (this.options.direction === 'left') ? -1 : 1;
            this.recalculateDimensions();

            // prepare structure
            this.cloneItems = this.items.clone().addClass(this.options.cloneClass).appendTo(this.line);
            if (this.itemWidth >= this.maskWidth) {
                this.activeLine = true;
                this.offset = (this.direction === -1 ? 0 : this.maxOffset);
            } else {
                this.activeLine = false;
                this.cloneItems.hide();
                this.offset = 0;
            }
            this.line.css({
                width: this.itemWidth * 2,
                marginLeft: this.offset
            });
        },
        attachEvents: function() {
            // flexible layout handling
            var self = this;
            if (this.options.handleFlexible) {
                this.resizeHandler = function() {
                    self.recalculateDimensions();
                    if (self.itemWidth < self.maskWidth) {
                        self.activeLine = false;
                        self.cloneItems.hide();
                        self.stopMoving();
                        self.offset = 0;
                        self.line.css({
                            marginLeft: self.offset
                        });
                    } else {
                        self.activeLine = true;
                        self.cloneItems.show();
                        self.startMoving();
                    }
                };
                $(window).bind('resize orientationchange', this.resizeHandler);
            }

            // pause on hover
            if (this.options.pauseOnHover) {
                this.hoverHandler = function() {
                    self.stopMoving();
                    self.holder.addClass(self.options.hoverClass);
                };
                this.leaveHandler = function() {
                    self.startMoving();
                    self.holder.removeClass(self.options.hoverClass);
                };
                this.holder.bind({
                    mouseenter: this.hoverHandler,
                    mouseleave: this.leaveHandler
                });
            }

            // initial delay
            setTimeout(function() {
                self.initialFlag = true;
                self.startMoving();
            }, self.options.initialDelay || 1);
        },
        recalculateDimensions: function() {
            // calculate block dimensions
            var self = this;
            this.maskWidth = this.mask.width();
            this.itemWidth = 1;
            this.items.each(function() {
                self.itemWidth += $(this).outerWidth(true);
            });
            this.maxOffset = -this.itemWidth;
        },
        startMoving: function() {
            // start animation
            var self = this;
            if (self.activeLine && self.initialFlag) {
                var targetOffset = (self.direction < 0 ? self.maxOffset : 0);

                self.offset = parseInt(self.line.css('marginLeft'), 10) || 0;
                self.line.stop().animate({
                    marginLeft: targetOffset
                }, {
                    duration: Math.abs(1000 * (self.offset - targetOffset) / self.options.animSpeed),
                    easing: 'linear',
                    complete: function() {
                        self.offset = (self.direction < 0 ? 0 : self.maxOffset);
                        self.line.css({
                            marginLeft: self.offset
                        });
                        self.startMoving();
                    }
                });
            }
        },

    };

    // jQuery plugin interface
    $.fn.marquee = function(opt) {
        return this.each(function() {
            jQuery(this).data('Marquee', new Marquee($.extend(opt, {
                holder: this
            })));
        });
    };
}(jQuery));