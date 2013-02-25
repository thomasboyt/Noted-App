Noted.ControlsBottomView = Ember.View.extend({  
  exportNote: function() {
    var txt = this.get("controller.selected").serializeToTxt();

    $("#export-modal textarea").val(txt);
    $("#export-modal").modal();
    $("#export-modal").on("shown", function() {
      $("#export-modal textarea").select();
    })
  }
});