Ext.define('Rd.view.profileComponents.winProfileComponentAddWizard', {
    extend:     'Ext.window.Window',
    alias :     'widget.winProfileComponentAddWizard',
    closable:   true,
    draggable:  false,
    resizable:  false,
    title:      i18n('sNew_profile_component'),
    width:      400,
    height:     400,
    plain:      true,
    border:     false,
    layout:     'card',
    iconCls:    'add',
    glyph: Rd.config.icnAdd,
    autoShow:   false,
    defaults: {
            border: false
    },
    no_tree: false, //If the user has no children we don't bother giving them a branchless tree
    user_id: '',
    owner: '',
    startScreen: 'scrnApTree', //Default start screen
    requires: [
        'Ext.layout.container.Card',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.FieldContainer',
        'Ext.form.field.Radio'
    ],
    initComponent: function() {
        var me = this;
        var scrnApTree      = me.mkScrnApTree();
        var scrnData        = me.mkScrnData();
        me.items = [
            scrnApTree,
            scrnData
        ];  
        this.callParent(arguments);
        me.getLayout().setActiveItem(me.startScreen);
    },

    //____ AccessProviders tree SCREEN ____
    mkScrnApTree: function(){
        var pnlTree = Ext.create('Rd.view.components.pnlAccessProvidersTree',{
            itemId: 'scrnApTree'
        });
        return pnlTree;
    },

    //_______ Data for component  _______
    mkScrnData: function(){
        var me      = this;
        var buttons = [
            { xtype : 'btnDataPrev' },
            { xtype : 'btnDataNext' }
        ];

        if(me.no_tree == true){
             buttons = [
                { xtype : 'btnDataNext' }
            ];
        }

        var frmData = Ext.create('Ext.form.Panel',{
            border:     false,
            layout:     'anchor',
            itemId:     'scrnData',
            autoScroll: true,
            defaults: {
                anchor: '100%'
            },
            fieldDefaults: {
                msgTarget: 'under',
                labelClsExtra: 'lblRd',
                labelAlign: 'left',
                labelSeparator: '',
                margin: 15
            },
            defaultType: 'textfield',
            items:[
                {
                    itemId  : 'user_id',
                    xtype   : 'textfield',
                    name    : "user_id",
                    hidden  : true,
                    value   : me.user_id
                },
                {
                    xtype   : 'textfield',
                    name    : "id",
                    hidden  : true
                }, 
                {
                    itemId      : 'owner',
                    xtype       : 'displayfield',
                    fieldLabel  : i18n('sOwner'),
                    value       : me.owner,
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'textfield',
                    fieldLabel  : i18n('sName'),
                    name        : "name",
                    allowBlank  : false,
                    blankText   : i18n('sSupply_a_value'),
                    labelClsExtra: 'lblRdReq'
                },
                {
                    xtype       : 'checkbox',      
                    boxLabel    : i18n('sAlso_show_to_sub_providers'),
                    name        : 'available_to_siblings',
                    inputValue  : 'available_to_siblings',
                    itemId      : 'a_to_s',
                    checked     : false,
                    cls         : 'lblRd'
                }
            ],
            buttons: buttons
        });
        return frmData;
    }
    
});
