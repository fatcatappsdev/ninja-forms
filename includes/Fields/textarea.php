<?php if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Class NF_Field_Textarea
 */
class NF_Field_Textarea extends NF_Abstracts_Field
{
    protected $_name = 'textarea';

    protected $_nicename = 'Textarea';

    protected $_group = 'standard_fields';


    public function __construct()
    {
        $this->_nicename = __( 'Textarea', Ninja_Forms::TEXTDOMAIN );
    }

    public function template()
    {
        // Placeholder output
        ?>
        <textarea></textarea>
        <?php
    }

    public function validate( $value )
    {
        parent::validate( $value );
    }

}