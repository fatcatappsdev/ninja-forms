define( [], function() {
	var view = Marionette.ItemView.extend({
		tagName: 'div',
		className: 'nf-error',
		template: '#tmpl-nf-edit-setting-option-repeater-error'
	});

	return view;
} );