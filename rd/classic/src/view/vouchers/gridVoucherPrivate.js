Ext.define('Rd.view.vouchers.gridVoucherPrivate' ,{
    extend      :'Ext.grid.Panel',
    alias       : 'widget.gridVoucherPrivate',
    multiSelect : true,
    stateful    : true,
    stateId     : 'StateGridVoucherPrivate',
    stateEvents :['groupclick','columnhide'],
    border      : false,
    requires    : [
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager'
    ],
    viewConfig  : {
        loadMask    :true
    },
    tbar        : [
        { xtype: 'buttongroup', title: null,items : [ 
            {   glyph: Rd.config.icnReload,   scale: 'large',   itemId: 'reload',    tooltip:    i18n('sReload'),ui:'button-orange'},
            {   glyph: Rd.config.icnDelete,   scale: 'large',   itemId: 'delete',    disabled: true,    tooltip:    i18n('sDelete'),ui:'button-red'}
        ]}, 
        { xtype: 'buttongroup', title: null,items : [
            {   xtype: 'cmbVendor'     , itemId:'cmbVendor',    emptyText: i18n('sSelect_a_vendor'), padding: '5 0 0 0' },{ xtype: 'tbseparator'},
            {   xtype: 'cmbAttribute'  , itemId:'cmbAttribute', emptyText: i18n('sSelect_an_attribute'), padding: '5 0 0 0'},
            {   glyph: Rd.config.icnAdd, scale: 'large',        itemId: 'add',       tooltip:    i18n('sAdd'),ui:'button-green'}
        ]}        
    ],
    username    : 'nobody', //dummy value
    initComponent: function(){
        var me     = this;
        me.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
        })];

        me.columns = [
        //    {xtype: 'rownumberer',stateId: 'StateGridVoucherPrivate1'},          
            {
                header      : i18n('sType'),
                dataIndex   : 'type',
                width       : 130,
                editor      : {
                    xtype           : 'combobox',
                    typeAhead       : true,
                    triggerAction   : 'all',
                    selectOnTab     : true,
                    store           : [
                        ['check','Check'],
                        ['reply','Reply']
                    ],
                    lazyRender      : true,
                    listClass       : 'x-combo-list-small'
                },
                renderer: function(value){
                    if(value == "check"){
                        return i18n('sCheck');
                    }else{
                        return i18n('sReply');
                    }
                },
                stateId     : 'StateGridVoucherPrivate2'
            },  
            {
                header      : i18n('sAttribute'),
                xtype       : 'templatecolumn',
                tdCls       : 'gridTree',
                flex        : 1,
                stateId     : 'StateGridVoucherPrivate3', 
                tpl         : new Ext.XTemplate(
                    "<tpl if='edit == true'><div class=\"fieldBlue\"><i class=\"fa fa-edit\"></i> {attribute}</div></tpl>",
                    "<tpl if='edit == false'><div class=\"fieldGreyWhite\"><i class=\"fa fa-ban\"></i> {attribute}</div></tpl>"
                ),
                dataIndex   : 'attribute'
            }, 
            {
                header      : i18n('sOperator'),
                dataIndex   : 'op',
                width       : 100,
                stateId     : 'StateGridVoucherPrivate4',
                editor      : {
                    allowBlank  : false,
                    xtype       : 'combobox',
                    typeAhead   : true,
                    triggerAction: 'all',
                    selectOnTab : true,
                    store       : [
                        ['=' ,  '=' ],
                        [':=',  ':='],
                        ['+=',  '+='],
                        ['==',  '=='],
                        ['-=',  '-='],
                        ['<=',  '<='],
                        ['>=',  '>='],
                        ['!*',  '!*']
                    ],
                    lazyRender  : true,
                    listClass   : 'x-combo-list-small'
                }
            },
            { 
                text        : i18n('sValue'),
                dataIndex   : 'value',     
                flex        : 1,
                editor      : { 
                    xtype       : 'textfield',    
                    allowBlank  : false
               },
               stateId: 'StateGridVoucherPrivate5'
            }
        ];


        //Create a store specific to this Access Provider
        me.store = Ext.create('Ext.data.Store',{
            model: 'Rd.model.mPrivateAttribute',
            proxy: {
                type        : 'ajax',
                format      : 'json',
                batchActions: true,
                extraParams : { 'username' : me.username },
                reader      : {
                    keepRawData     : true,
                    type        : 'json',
                    rootProperty        : 'items',
                    messageProperty: 'message'
                },
                writer      : { 
                    writeAllFields: true 
                },
                api         : {
                    create      : '/cake4/rd_cake/vouchers/private-attr-add.json',
                    read        : '/cake4/rd_cake/vouchers/private-attr-index.json',
                    update      : '/cake4/rd_cake/vouchers/private-attr-edit.json',
                    destroy     : '/cake4/rd_cake/vouchers/private-attr-delete.json'
                }
            },
            listeners: {
                update: function(store, records, action, options,a,b) {
                    if(action == 'edit'){ 
                        store.sync({
                            success: function(batch,options){
                                Ext.ux.Toaster.msg(
                                    i18n('sUpdated_item'),
                                    i18n('sItem_has_been_updated'),
                                    Ext.ux.Constants.clsInfo,
                                    Ext.ux.Constants.msgInfo
                                );
                                store.load();  
                            },
                            failure: function(batch,options){
                                Ext.ux.Toaster.msg(
                                    i18n('sProblems_updating_the_item'),
                                    i18n('sItem_could_not_be_updated'),
                                    Ext.ux.Constants.clsWarn,
                                    Ext.ux.Constants.msgWarn
                                );
                                store.load();   
                            }
                        });
                    }
                },
                scope: this
            },
            autoLoad: false,
            autoSync: false    
        });
        
        me.bbar =  [
            {
                xtype       : 'pagingtoolbar',
                store       : me.store,
                displayInfo : true,
                plugins     : {
                    'ux-progressbarpager': true
                }
            }  
        ];
        me.callParent(arguments);
    }
});
