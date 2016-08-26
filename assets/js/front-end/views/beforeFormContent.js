define( [], function( ) {

    var view = Marionette.ItemView.extend({
        tagName: "nf-section",
        template: "#tmpl-nf-before-fields",

    });

    return view;
} );