var Canvas = (function() {

  /**
   * Determine whether the cycle of each block shows the default message
   */
  var _checkShowDefault = function() {
    $('.show-grid').each(function() {
      var showDefault = $(this).find('.show-default');
      var showTitleInfo = $(this).find('.show-title-info');
      if($(this).find('li').length > 0) {
        showDefault.hide();
        showTitleInfo.hide();
      } else {
        showDefault.show();
        showTitleInfo.show();
      }
    });
  };

  /**
   * Clear all input box
   */
  var _clearAllInput = function() {
    $('.item-wrap').remove();
  };

  /**
   * Input box template used to construct the input box fragment
   */
  var inputTmpl = ['<li class="item-wrap">',
    '<div class="input-wrap">',
    '<div><input type="text" class="input-item" name="input-item" value="${name}" /></div>',
    '<div><input type="button" class="submit" value="Save" /><em>or</em><input type="button" class="cancel" value="Cancel" /></div>',
    '</div>',
    '</li>'].join('');

  /**
   * Increase the input box to the list of clips(itemList)
   */
  var _appendInputItem = function(itemList) {
    _clearAllInput();
    $(itemList).find('.item-wrap').remove();
    $.tmpl(inputTmpl, {name: ''}).appendTo(itemList);
    _initInputListener();
    _checkShowDefault();
  };

  /**
   * Event binding input box
   */
  var _initInputListener = function() {
    $('.item-wrap').each(function() {
      var itemWrap = this;
      var itemList = $(itemWrap).parent();
      $(this).find('.input-item').focus().keypress(function(e) {
        var key = e.which;
        if(key === 13) {
          _appendShowItem(itemList);
        }
      });
      $(this).find('.submit').click(function(event) {
        event.stopPropagation();
        _appendShowItem(itemList);
      });
      $(this).find('.cancel').click(function(event) {
        event.stopPropagation();
        _cancelItemWrap(itemWrap);
      });
    });
  };


  /**
   * Click Cancel button input box
   */
  var _cancelItemWrap = function(itemWrap) {
    $(itemWrap).remove();
    _checkShowDefault();
  };

  /**
   * By adding content input box display template
   */
  var _showTmpl = ['<li class="show-item"><div class="row-fluid">' +
    '<div class="span10 text-left show-item-name">${name}</div>',
    '<div class="span2 show-item-delete"><a class="delete" href="javascript:{}"></a></div>',
  '</div></li>'].join('');

  /**
   * Increase the display segment to the list(itemList)
   */
  var _appendShowItem = function(itemList) {
    var name = $(itemList).find('.input-item').first().val();
    if(name && name !== '') {
      var itemWrap = $(itemList).find('.item-wrap');
      if(itemWrap.size() > 0) {
        itemWrap.replaceWith($($.tmpl(_showTmpl, {name: name})));
      } else {
        $.tmpl(_showTmpl, {name: name}).appendTo(itemList);
      }
      _appendInputItem(itemList);
    } else {
      $(itemList).remove();
    }
    _checkShowDefault();
    _initShowItem();
  };

  /**
   * Binding to the trash can icon to delete event
   */
  var _initDelItem = function() {
    $('.delete').unbind('click');
    $('.delete').click(function(event) {
      event.stopPropagation();
      var showItem = $(this).parents('.show-item');
      showItem.remove();
      _clearAllInput();
      _checkShowDefault();
      _initShowItem();
    });
  };

  /**
   * Binding of existing content is converted to the click event when clicked edit state
   */
  var _initEditItem = function() {
    $('.show-item-name').unbind('click');
    $('.show-item-name').click(function(event) {
      event.stopPropagation();
      _clearAllInput();
      var name = $(this).html();
      $(this).parents('.show-item').replaceWith($($.tmpl(inputTmpl, {name: name})));
      _initInputListener();
      _checkShowDefault();
    });
  };

  /**
   * The content displayed in the list is bound to pull back the event the user can drag to adjust the content of the order
   */
  var _initShowItem = function() {
    $('.item-list').sortable();
    $('.item-list').disableSelection();
    _initEditItem();
    _initDelItem();
  };

  /**
   * Bind help button click event
   */
  var _initHelp = function() {
    $('.help').click(function(event) {			
	  var currentLocation = $(this).attr("id");
      event.stopPropagation();
	  var msg = "";
	  if(currentLocation.indexOf("#income_source")>-1){
		  msg = "you are in income section";
	  }else if(currentLocation.indexOf("#cost_structure")>-1){
		  msg = "you are in cost structure section";
	  }else if(currentLocation.indexOf("#asile")>-1){
		  msg = "you are in asile section";
	  }else if(currentLocation.indexOf("#key_indicators")>-1){
		  msg = "a startup business can better focus on one metric and build on it.  The metrics include the range of products or services you want to provide. It is therefore crucial that the right metric is identified because the wrong one could be catastrophic to the startup.";
	  }else if(currentLocation.indexOf("#customer_segments")>-1){
		  msg = "a deeply focused startup business should establish customer relationships from the beginning. As such, these were covered in the Channels box.";
	  }else if(currentLocation.indexOf("#unfair_advantage")>-1){
		  msg = "this is basically the competitive advantage. A startup should recognize whether or not it has an unfair advantage over others.";
	  }else if(currentLocation.indexOf("#unique")>-1){
		  msg = "you are in unique value proposition section";
	  }else if(currentLocation.indexOf("#solution")>-1){
		  msg = "once a problem has been recognized the next thing is to find an amicable solution to it. As such, a solution box with the Minimum Viable Product “MVP” concept was included.";
	  }else if(currentLocation.indexOf("#problem")>-1){
		  msg = "A problem box was included because several businesses do fail applying a lot of effort, financial resources and time to build the wrong product. It is therefore vital to understand the problem first.";
	  }
      $('<div></div>')
        .html(msg)
        .dialog({
          autoOpen: false,
          title: 'Help'
        }).dialog('open');
    })
  };

  /**
   * Binding comment click event
   */
  var _initFeed = function() {
    $('.show-feed').click(function(event) {
      event.stopPropagation();
      $('<div></div>').html(['<div>',
          '<textarea style="width:240px;height:90px;line-height:16px;"></textarea>',
        '</div>',
        '<div><input type="button" value="Submit" /></div>'].join('')).dialog({
          autoOpen: false,
          title: 'Comment'
        }).dialog('open');
    })
  };

  /**
   * Initialization page
   */
  var init = function() {
    $('.show-grid').click(function(event) {
      event.stopPropagation();
      var itemList = $(this).find('.item-list').first();
      _appendInputItem(itemList);
    });
    _initShowItem();
    _initHelp();
    _initFeed();
  };

  return {
    init: init
  };
}).call(this);

$(function () {
    //Loop through all Labels with class 'editable'.
    $(".editable").each(function () {
        //Reference the Label.
        var label = $(this);
 
        //Add a TextBox next to the Label.
        label.after("<input type = 'text' style = 'display:none'  maxLength='50'/>");
 
        //Reference the TextBox.
        var textbox = $(this).next();
 
        //Set the name attribute of the TextBox.
        textbox[0].name = this.id.replace("lbl", "txt");
 
        //Assign the value of Label to TextBox.
        textbox.val(label.html());
 
        //When Label is clicked, hide Label and show TextBox.
        label.click(function () {
            $(this).hide();
            $(this).next().show();
        });
 
        //When focus is lost from TextBox, hide TextBox and show Label.
        textbox.focusout(function () {
            $(this).hide();
			document.title = $(this).val();
            $(this).prev().html($(this).val());
            $(this).prev().show();
        });		
    });
});
