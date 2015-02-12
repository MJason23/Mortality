// Inline popups
$('#inline-popup').magnificPopup({
  removalDelay: 800, //delay removal by X to allow out-animation
  callbacks: {
    beforeOpen: function() {
       this.st.mainClass = this.st.el.attr('data-effect');
    }
  },
  closeBtnInside: false,
  midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
});

