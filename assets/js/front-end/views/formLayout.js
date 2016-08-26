define( [ 'views/fieldCollection','views/afterFormContent', 'views/beforeFormContent', 'models/fieldCollection' ], function( fieldCollectionView, AfterFormContent, BeforeFormContent, FieldCollection ) {

	var view = Marionette.LayoutView.extend({
		tagName: "nf-section",
		template: "#tmpl-nf-form-layout",

		regions: {
			beforeFormContent: ".nf-before-form-content",
			formContent: ".nf-form-content",
			afterFormContent: ".nf-after-form-content"
		},

		initialize: function() {
			nfRadio.channel( 'form-' + this.model.get( 'id' ) ).reply( 'get:el', this.getEl, this );
			/*
			 * Set our default formContentView.
			 */
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.defaultFormContentView, 10, this );
			/*
			 * Set our default formContent load filter
			 */
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.defaultFormContentLoad, 10, this );
			
			/*
			 * If we need to hide a form, set the visibility of this form to hidden.
			 */
			 this.listenTo( this.model, 'hide', this.hide );
		},

		onRender: function() {
			this.$el = this.$el.children();
			this.$el.unwrap();
			this.setElement( this.$el );
		},

		onShow: function() {
			this.beforeFormContent.show( new BeforeFormContent( { model: this.model } ) );
			
			/*
			 * Set our formContentData to our form setting 'formContentData'
			 */
			var formContentData = this.model.get( 'formContentData' );

			/*
			 * The formContentData variable used to be fieldContentsData.
			 * If we don't have a 'formContentData' setting, check to see if we have an old 'fieldContentsData'.
			 * 
			 * TODO: This is for backwards compatibility and should be removed eventually. 
			 */
			if ( ! formContentData ) {
				formContentData = this.model.get( 'fieldContentsData' );
			}
			
			/*
			 * Check our fieldContentViewsFilter to see if we have any defined.
			 * If we do, overwrite our default with the view returned from the filter.
			 */
			var formContentViewFilters = nfRadio.channel( 'formContent' ).request( 'get:viewFilters' );
			
			/* 
			* Get our first filter, this will be the one with the highest priority.
			*/
			var sortedArray = _.without( formContentViewFilters, undefined );
			var callback = _.first( sortedArray );
			formContentView = callback();
			
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			/* 
			* Get our first filter, this will be the one with the highest priority.
			*/
			var sortedArray = _.without( formContentLoadFilters, undefined );
			var callback = _.first( sortedArray );
			formContentData = callback( formContentData, this.model, this );
			
			this.model.set( 'formContentData', formContentData );

			var options = {
				data: formContentData,
				formModel: this.model
			};
			
			/*
			 * If we have a collection, pass the returned data as the collection.
			 *
			 * If we have a model, pass the returned data as the collection.
			 */
			if ( false !== formContentData instanceof Backbone.Collection ) {
				options.collection = formContentData;
			} else if ( false !== formContentData instanceof Backbone.Model ) {
				options.model = formContentData;
			}

			this.formContent.show( new formContentView( options ) );
			this.afterFormContent.show( new AfterFormContent( { model: this.model } ) );
		},

		getEl: function() {
			return this.el;
		},

        templateHelpers: function () {
            return {

                renderClasses: function() {
                    return '';
                }

            };
        },

        defaultFormContentView: function() {
        	return fieldCollectionView;
        },

        defaultFormContentLoad: function( formContentData, formModel, context ) {
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
			/*
			 * If we only have one load filter, we can just return the field collection.
			 */
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );
			var sortedArray = _.without( formContentLoadFilters, undefined );
			if ( 1 == sortedArray.length || 'undefined' == typeof formContentData || true === formContentData instanceof Backbone.Collection ) return formModel.get( 'fields' );

        	var fieldModels = _.map( formContentData, function( key ) {
        		return formModel.get( 'fields' ).findWhere( { key: key } );
        	}, this );

        	return new FieldCollection( fieldModels );
        },

        hide: function() {
        	jQuery( this.el ).hide();
        }

	});

	return view;
} );