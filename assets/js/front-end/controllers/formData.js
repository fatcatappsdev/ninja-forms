/*
 * Handles setting up our form.
 *
 * Holds a collection of our fields.
 * Replies to requests for field data.
 * Updates field models.
 */
define(['models/formModel', 'models/formCollection', 'models/fieldCollection', 'models/formErrorCollection'], function( FormModel, FormCollection, FieldCollection, ErrorCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Setup our field collections.
			 */
			var that = this;

			/*
			 * Initialize our form collection (incase we have multiple forms on the page)
			 */
			this.formCollection = new FormCollection( nfForms );

			nfRadio.channel( 'app' ).reply( 'get:form', this.getForm, this );
			nfRadio.channel( 'app' ).reply( 'get:forms', this.getForms, this );

			nfRadio.channel( 'fields' ).reply( 'get:field', this.getField, this );
		},

		getForm: function( id ) {
			return this.formCollection.get( id );
		},

		getForms: function() {
			return this.formCollection;
		},

		getField: function( id ) {
			var model = false;
			
			_.each( this.formCollection.models, function( form ) {
				if ( ! model ) {
					model = form.get( 'fields' ).get( id );	
				}			
			} );
			return model;
		}
	});

	return controller;
} );