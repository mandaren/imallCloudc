/**
 * Created by ou on 2017/7/11.
 */
import {checkValidForm, initValidForm, errorValidMessageFunction,asyncErrorValidMessageFunction} from "../../../../common/validForm/actions";
import React, {PropTypes} from "react";
import {Field, reduxForm, change} from "redux-form";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SupplierDocSelectList from "../../../../common/supplierdocselectwin/components/SupplierDocSelectList";
import {changeCommonSupplierDocListState} from "../../../../common/supplierdocselectwin/actions";
import {validate, inputField, selectField} from "../../../../common/redux-form-ext";
import ValidForm from "../../../../common/validForm/components/ValidForm";
import * as types from "../constants/ActionTypes";
import * as validMessage from "../../../../common/common-constant";
import {showFileMgrModalHasCallbackFunc} from "../../../../common/filemgr/actions";
import {asyncValidateForSaveOrUpdate} from "../actions/asyncValidate";
export const fields = [{
    field: 'supplierNm',
    validate: {
        fieldNm: "供应商名称",
        required: true,
        maxlength: 32
    }
}, {
    field: 'unitNature',
    validate: {
        fieldNm: "供货单位性质",
    }
},
    {
        field: 'businessResponseManTel',
        validate: {
            fieldNm: "业务负责人电话",
            required: true,
            maxlength: 32,
            regx:validMessage.REGEXP_PHONE_All,
            error:validMessage.REGEXP_PHONE_All_FORMAT
        }
    },

    {
        field: 'businessResponseManEmail',
        validate: {
            fieldNm: "邮箱",
            maxlength: 128,
            regx: validMessage.REGEXP_EMAIL,
            error: validMessage.ERROR_EMAIL_FORMAT
        }
    }, {
        field: 'regCapital',
        validate: {
            fieldNm: "注册资本",
            maxlength: 9,
            regx: validMessage.REGEXP_PRICE,
            error: validMessage.ERROR_REGEXP_PRICE_DOUBLE
        }
    }, {
        field: 'regAddr',
        validate: {
            fieldNm: "注册地址",
            maxlength: 128,
        }
    },
    {
        field: 'businessCategory',
        validate: {
            fieldNm: "经营品种",
            required: true,
        }
    }, {
        field: 'businessRange',
        validate: {
            fieldNm: "经营范围",
            required: true,
        }
    },

    {
        field: 'BUSINESS_LICENSE',
        validate: {
            fieldNm: "营业执照号",
            required: true,
            maxlength: 32
        }
    },
    {
        field: 'BUSINESS_LICENSETIME',
        validate: {
            fieldNm: "营业执照号有效期",
            required: true,
            maxlength: 32
        }
    },
    {
        field: 'shopBusinessResponseMan',
        validate: {
            fieldNm: "药店业务负责人",
            maxlength: 32
        }
    },
    {
        field: 'shopBusinessResponseManTel',
        validate: {
            fieldNm: "药店业务负责人电话",
            maxlength: 32,
            regx:validMessage.REGEXP_PHONE_All,
            error:validMessage.REGEXP_PHONE_All_FORMAT
        }
    },
    {
        field: 'isFirstCheck',
        validate: {
            fieldNm: "是否首营",
            required: true,
        }
    },
    {
        field: 'submitOpinion',
        validate: {
            fieldNm: "提交意见",
            maxlength: 128
        }
    },
    {
        field: 'qualityMngSystemEvaluate',
        validate: {
            fieldNm: "质量管理体系评价",
            maxlength: 128
        }
    },
    {
        field: 'remark',
        validate: {
            fieldNm: "备注",
            maxlength: 128
        }
    },
   ];
//供应商
export const supplierNameInput = ({ input, type,className,maxLength, id,required, meta: { touched, error } }) => (
    <input type={type} id={id} style={{paddingRight: "35px", width: "135px"}} maxLength={maxLength} name={input.name} {...input}/>
);



export const stateSelectField = ({ input, className, label, id, required, items,event=()=>{}, optionValue, optionName,disabled, meta: { touched, error } }) => (
    <div className="item">
        <p>{required && <i>*</i>}{label}</p>
        <select id={id ? id : ""} name={input.name} className={"select " + (className || '')} {...input} disabled ={disabled  ? disabled :""} onChange={e => {input.onChange(e);event(e.target.value)}}>
            {
                items.map((item,index)=>{
                    return (
                        <option key={index} value={item[optionValue]}>{item[optionName]}</option>
                    )
                })
            }
        </select>
    </div>
);
//供货单位性质
const unitNatureItems=[{
    code:"批发企业",
    value:"WHOLESALE_ENTERPRISE"
},{
    code:"生产厂商",
    value:"MANUFACTURER"
}];
// 状态
const stateItems=[{
    code:"启用",
    value:"Y"
},{
    code:"禁用",
    value:"N"
}];
// 状态
const isFirstCheckItems=[{
    code:"是",
    value:"Y"
},{
    code:"否",
    value:"N"
}];




//经营品种 经营 范围
export const businessCategoryRadioField = ({ label, required, input, selectedItems, allItems, changeEven = () => {} }) => {
    return (<div className="item w860">
        <p>{required && <i>*</i>}{label}</p>
        {
            allItems.map((allItem, index) => {
                if (selectedItems.includes(allItem.dictItemCode)) {
                    return (
                        <label key={index}>
                            <input checked="checked" name={input.name} value={allItem.dictItemCode}
                                   onChange={changeEven} type="checkbox"/>
                            {allItem.dictItemNm}
                        </label>
                    );

                } else {
                    return (<label key={index}>
                            <input value={allItem.dictItemCode} name={input.name} onChange={changeEven}
                                   type="checkbox"/>
                            {allItem.dictItemNm}
                        </label>
                    );
                }

            })
        }
    </div>);
}

export const hiddenField = ({type, input}) => (
    <input name={input.name} type={type} style={{display: "none"}} {...input} />
)


class SupplierAddForm extends React.Component {

    componentWillMount() {
        this.props.actions.findByAvailableAndDictType("BUSINESS_CATEGORY");
        this.props.actions.findByAvailableAndDictType("BUSINESS_RANGE");
    }
    componentWillUnmount(){
        //组件销毁前判断是否新增了applyMan,有则移除applyMan
        if(fields[fields.length-1].field==="applyMan"){
            fields.splice(fields.length-1,1);
        }

    }
    componentDidUpdate(){
        const {change} = this.props;
        const certificateIsShow = this.context.store.getState().todos.certificateIsShow;
        //组件取值 资质文件 预处理
        if(certificateIsShow){
            const supplierCertificatesFileList = this.context.store.getState().todos.detailObject.supplierCertificatesFileList || [];
            $('.certificateInput').val('');
            change("BUSINESS_LICENSE", '');
            change("BUSINESS_LICENSETIME", '');
            for (var i = 0; i < supplierCertificatesFileList.length; i++) {
                switch (supplierCertificatesFileList[i].certificatesType) {
                    case "BUSINESS_LICENSE":
                        $('input[name="BUSINESS_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="BUSINESS_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        change("BUSINESS_LICENSE", supplierCertificatesFileList[i].certificatesNum);
                        change("BUSINESS_LICENSETIME", supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "ORGANIZATION_CERTIFICATE":
                        $('input[name="ORGANIZATION_CERTIFICATE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="ORGANIZATION_CERTIFICATETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "GSP_CERTIFICATE":
                        $('input[name="GSP_CERTIFICATE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="GSP_CERTIFICATETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "COMMODITY_LICENSE":
                        $('input[name="COMMODITY_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="COMMODITY_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "GSP_CERTIFICATE":
                        $('input[name="GSP_CERTIFICATE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="GSP_CERTIFICATETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "QUALITY_AGREEMENT":
                        $('input[name="QUALITY_AGREEMENT"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="QUALITY_AGREEMENTTIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "FOOD_CIRCULATION_LICENSE":
                        $('input[name="FOOD_CIRCULATION_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="FOOD_CIRCULATION_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "FOOD_HYGIENE_LICENSE":
                        $('input[name="FOOD_HYGIENE_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="FOOD_HYGIENE_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "HEALTH_PRODUCT_HYGIENE_LICENSE":
                        $('input[name="HEALTH_PRODUCT_HYGIENE_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="HEALTH_PRODUCT_HYGIENE_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "MEDIC_DEVICE_MANUFACTURE_PERMISS":
                        $('input[name="MEDIC_DEVICE_MANUFACTURE_PERMISS"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="MEDIC_DEVICE_MANUFACTURE_PERMISSTIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "COSMETICS_BUSINESS_LICENSE":
                        $('input[name="COSMETICS_BUSINESS_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="COSMETICS_BUSINESS_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    case "COSMETICS_HYGIENIC_LICENSE":
                        $('input[name="COSMETICS_HYGIENIC_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                        $('input[name="COSMETICS_HYGIENIC_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                        break;
                    default :
                }

            }
            this.props.actions.setDetailObjectAndSetCertificateIsShow(undefined,false);
        }

    }
    componentDidMount() {
        const {change} = this.props;
        const todos = this.context.store.getState().todos;
        const supplierCertificatesFileList = todos.detailObject.supplierCertificatesFileList || [];

        $(".datepicker").on("click", function (e) {
            e.stopPropagation();
            $(this).lqdatetimepicker({
                css: 'datetime-day',
                dateType: 'D',
                selectback: function () {
                    change("BUSINESS_LICENSETIME", $('input[name="BUSINESS_LICENSETIME"]').val());
                    change("applyDateString", $('input[name="applyDateString"]').val());
                }
            });
        });
        //预处理
        for (var i = 0; i < supplierCertificatesFileList.length; i++) {
            switch (supplierCertificatesFileList[i].certificatesType) {
                case "BUSINESS_LICENSE":
                    $('input[name="BUSINESS_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="BUSINESS_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    change("BUSINESS_LICENSE", supplierCertificatesFileList[i].certificatesNum);
                    change("BUSINESS_LICENSETIME", supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "ORGANIZATION_CERTIFICATE":
                    $('input[name="ORGANIZATION_CERTIFICATE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="ORGANIZATION_CERTIFICATETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "GSP_CERTIFICATE":
                    $('input[name="GSP_CERTIFICATE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="GSP_CERTIFICATETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "COMMODITY_LICENSE":
                    $('input[name="COMMODITY_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="COMMODITY_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "GSP_CERTIFICATE":
                    $('input[name="GSP_CERTIFICATE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="GSP_CERTIFICATETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "QUALITY_AGREEMENT":
                    $('input[name="QUALITY_AGREEMENT"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="QUALITY_AGREEMENTTIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "FOOD_CIRCULATION_LICENSE":
                    $('input[name="FOOD_CIRCULATION_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="FOOD_CIRCULATION_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "FOOD_HYGIENE_LICENSE":
                    $('input[name="FOOD_HYGIENE_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="FOOD_HYGIENE_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "HEALTH_PRODUCT_HYGIENE_LICENSE":
                    $('input[name="HEALTH_PRODUCT_HYGIENE_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="HEALTH_PRODUCT_HYGIENE_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "MEDIC_DEVICE_MANUFACTURE_PERMISS":
                    $('input[name="MEDIC_DEVICE_MANUFACTURE_PERMISS"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="MEDIC_DEVICE_MANUFACTURE_PERMISSTIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "COSMETICS_BUSINESS_LICENSE":
                    $('input[name="COSMETICS_BUSINESS_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="COSMETICS_BUSINESS_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                case "COSMETICS_HYGIENIC_LICENSE":
                    $('input[name="COSMETICS_HYGIENIC_LICENSE"]').val(supplierCertificatesFileList[i].certificatesNum);
                    $('input[name="COSMETICS_HYGIENIC_LICENSETIME"]').val(supplierCertificatesFileList[i].certificatesValidityString);
                    break;
                default :
            }
        }
    }

    businessCategoryChangeEven(e){
        const {form} = this.context.store.getState();
        var $target = $(e.currentTarget);
        var newCategoryItemSelect = $target.val();
        var businessCategory = form.supplierAddForm.values.businessCategory||"";
        if(businessCategory==""){
            var  categoryItemSelects = [];
        }else{
            var categoryItemSelects = businessCategory.split(',');
        }
        var newCategoryItemSelects =[];
        if($target.is(":checked")) {
            newCategoryItemSelects = categoryItemSelects.concat(newCategoryItemSelect);
        } else {
            categoryItemSelects = categoryItemSelects
            newCategoryItemSelects = categoryItemSelects.filter(item => item != newCategoryItemSelect);
        }
        const {change} = this.props;
        change("businessCategory", newCategoryItemSelects.join(','));
        this.context.store.dispatch({
            type: types.SUPPLIER_SET_BUSINESS_SELECT_CATEGORY,
            businessCategorySelect:newCategoryItemSelects.join(',')

        });

    }
    businessRangeChangeEven(e){
        const {form} = this.context.store.getState();
        var $target = $(e.currentTarget);
        var newRangeItemSelect = $target.val();
        var businessRange = form.supplierAddForm.values.businessRange||"";
        if(businessRange==""){
            var  RangeItemSelects = [];
        }else{
            var RangeItemSelects = businessRange.split(',');
        }

        var newRangeItemSelects =[];
        if($target.is(":checked")) {
            newRangeItemSelects = RangeItemSelects.concat(newRangeItemSelect);
        } else {
            newRangeItemSelects = RangeItemSelects.filter(item => item!=newRangeItemSelect);
        }
        const {change} = this.props;
        change("businessRange", newRangeItemSelects.join(','));
        this.context.store.dispatch({
            type: types.SUPPLIER_SET_BUSINESS_SELECT_RANGE,
            businessRangeDataSelect:newRangeItemSelects.join(',')

        });
    }

    //处理
    getSupCerFileDate() {
        var list = [];

        //营业执照号
        const businessLicense = {
            certificatesType: "BUSINESS_LICENSE",
            certificatesNum: $('input[name="BUSINESS_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="BUSINESS_LICENSETIME"]').val().trim(),
        }
        list=list.concat(businessLicense);
        //组织机构代码证号
        const organizationCertificate = {
            certificatesType: "ORGANIZATION_CERTIFICATE",
            certificatesNum: $('input[name="ORGANIZATION_CERTIFICATE"]').val().trim(),
            certificatesValidityString: $('input[name="ORGANIZATION_CERTIFICATETIME"]').val().trim(),
        }
        list=list.concat(organizationCertificate);
        //GSP证书号
        const gspCertificate = {
            certificatesType: "GSP_CERTIFICATE",
            certificatesNum: $('input[name="GSP_CERTIFICATE"]').val().trim(),
            certificatesValidityString: $('input[name="GSP_CERTIFICATETIME"]').val().trim(),
        }
        list=list.concat(gspCertificate);
        //商品经营许可证号
        const commodityLicense = {
            certificatesType: "COMMODITY_LICENSE",
            certificatesNum: $('input[name="COMMODITY_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="COMMODITY_LICENSETIME"]').val().trim(),
        }
        list=list.concat(commodityLicense);
        //质量协议书号
        const qualityAgreement = {
            certificatesType: "QUALITY_AGREEMENT",
            certificatesNum: $('input[name="QUALITY_AGREEMENT"]').val().trim(),
            certificatesValidityString: $('input[name="QUALITY_AGREEMENTTIME"]').val().trim(),
        }
        list=list.concat(qualityAgreement);
        //食品流通许可证号
        const foodCirculationLicense = {
            certificatesType: "FOOD_CIRCULATION_LICENSE",
            certificatesNum: $('input[name="FOOD_CIRCULATION_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="FOOD_CIRCULATION_LICENSETIME"]').val().trim(),
        }
        list=list.concat(foodCirculationLicense);
        //食品卫生许可证号
        const foodHygieneLicense = {
            certificatesType: "FOOD_HYGIENE_LICENSE",
            certificatesNum: $('input[name="FOOD_HYGIENE_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="FOOD_HYGIENE_LICENSETIME"]').val().trim(),
        }
        list=list.concat(foodHygieneLicense);
        //保健品卫生许可证号
        const healthProductHygieneLicense = {
            certificatesType: "HEALTH_PRODUCT_HYGIENE_LICENSE",
            certificatesNum: $('input[name="HEALTH_PRODUCT_HYGIENE_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="HEALTH_PRODUCT_HYGIENE_LICENSETIME"]').val().trim(),
        }
        list=list.concat(healthProductHygieneLicense);
        //医疗器械许可证号
        const medicDeviceManufacturePermiss = {
            certificatesType: "MEDIC_DEVICE_MANUFACTURE_PERMISS",
            certificatesNum: $('input[name="MEDIC_DEVICE_MANUFACTURE_PERMISS"]').val().trim(),
            certificatesValidityString: $('input[name="MEDIC_DEVICE_MANUFACTURE_PERMISSTIME"]').val().trim(),
        }
        list=list.concat(medicDeviceManufacturePermiss);
        //化妆品经营许可证号
        const cosmeticsBusinessLicense = {
            certificatesType: "COSMETICS_BUSINESS_LICENSE",
            certificatesNum: $('input[name="COSMETICS_BUSINESS_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="COSMETICS_BUSINESS_LICENSETIME"]').val().trim(),
        }
        list=list.concat(cosmeticsBusinessLicense);
        //化妆品卫生许可证号
        const cosmeticsHygienicLicense = {
            certificatesType: "COSMETICS_HYGIENIC_LICENSE",
            certificatesNum: $('input[name="COSMETICS_HYGIENIC_LICENSE"]').val().trim(),
            certificatesValidityString: $('input[name="COSMETICS_HYGIENIC_LICENSETIME"]').val().trim(),
        }
        list=list.concat(cosmeticsHygienicLicense);

        this.props.actions.updateSUPCERFILE(list);

    }
    //收集资质文件同时检验
    getSupCerFileDateAndValid(){
        this.getSupCerFileDate();
        this.props.checkValidForm(true);

    }
    changeCommonSupplierDocListState(){

        this.props.changeCommonSupplierDocListState((true));
    }
    closeAddForm(){
        this.props.actions.showAddForm(false);
        this.props.actions.findBySupplierComponent({});
        this.props.reset();
        this.props.initValidForm();
    }
    onShowFileModal() {
        var _this = this;
        const fileMngs =this.context.store.getState().todos.fileMngs;
        const imgIdList = [];
        fileMngs.map(img=>{
            imgIdList.push(img.sysFileLibId)
        })
        this.props.showFileMgrModalHasCallbackFunc((files) => {
            files.map(file=>{
                if($.inArray(file.sysFileLibId,imgIdList)==-1){
                    fileMngs.push(file);
                }
            });
            _this.props.actions.setFieldObjs(fileMngs);
        });
    }
    deleteImg(sysFileLibId){
        let fileMngs =this.context.store.getState().todos.fileMngs;
        let newImgList = fileMngs.filter(item => item.sysFileLibId!=sysFileLibId);
        this.props.actions.setFieldObjs(newImgList)
    }
    changeIsFirstCheck(){

        const isFirstCheck = $("#isFirstCheck").val();
        if(isFirstCheck=="Y"){
            fields.push({
                field: 'applyMan',
                validate: {
                    fieldNm: "申请人",
                    required:true
                }});
            $($("#applyMan").parent().find('p')[0]).html('<i>*</i>申请人');
        }else{
            fields.splice(fields.length-1,1);
            $($("#applyMan").parent().find('p')[0]).html('<i></i>申请人');
        }

    }
    render() {
        const props = this.props;
        const actions = this.props.actions;
        const {handleSubmit, submitting} = this.props;
        const {store} = this.context;
        const todos = store.getState().todos;
        const businessCategoryAllData = todos.businessCategoryAllData || [];
        const businessRangeAllData = todos.businessRangeAllData || [];
        const {commonAddSupplierListState} = store.getState().supplieDocComponentTodos;
        const businessCategorySelect = todos.businessCategorySelect || [];
        const businessRangeDataSelect = todos.businessRangeDataSelect || [];
        const display = store.getState().fileMgrTodos.fileMgrModalState;
        const {errorValidMessage, validFormState,asyncValidMessage} = this.context.store.getState().validTodos;
        const validState = asyncValidMessage != "" || errorValidMessage != "";
        const fileMngs =this.context.store.getState().todos.fileMngs;
        return (
            <form onSubmit={handleSubmit}>
                {commonAddSupplierListState&&<SupplierDocSelectList store={store} actions={actions} callBackFunction={this.props.actions.setDetailObjectAndSetCertificateIsShow}/>}
                {validFormState && validState && <ValidForm />}
                <div className="layer" >
                    <div className="layer-box layer-info layer-order layer-stores layer-stores-modify">
                        <div className="layer-header">
                            <span>供应商信息</span>
                            <a href="javascript:void(0);" className="close" onClick={() => {this.closeAddForm()}}></a>
                        </div>
                        <div className="layer-body">
                            <div className="md-box">
                                <div className="box-mt">基础信息</div>
                                <div className="box-mc clearfix">
                                    <Field name="id" type="text" component={hiddenField}/>
                                    <Field name="supplierDocId" type="text" component={hiddenField}/>
                                    <Field name="supplierCode" type="text" component={hiddenField}/>
                                    <div className="item" style={{position:"relative"}}>
                                        <p><i>*</i>供应商名称<a className="item-input-a" onClick={()=>{this.changeCommonSupplierDocListState()}}/></p>
                                        <Field id="supplierNm" name="supplierNm" type="text" className="" maxLength="32" component={supplierNameInput} required="required"/>
                                    </div>
                                    <Field name="unitNature" id="unitNature" label="供货单位性质"  component={selectField} items={unitNatureItems} optionName="code" optionValue="value"/>
                                    <Field name="qualityResponseManName" component={inputField} actions={actions} maxLength="32" label="质量负责人" type="text"/>
                                    <Field name="legalRepresentative" component={inputField} actions={actions}  maxLength="32" type="text" label="法定代表人"/>
                                    <Field name="businessResponseManName" component={inputField} actions={actions} maxLength="32" type="text" label="业务负责人"/>
                                    <Field name="businessResponseManTel" component={inputField}  actions={actions}maxLength="32"  required="true"  type="text" label="业务负责人电话"/>
                                    <Field name="businessResponseManEmail"  component={inputField}  actions={actions} maxLength="128" type="text" label="业务负责人邮箱"/>
                                    <Field name="regCapital" component={inputField} actions={actions} type="text" maxLength="9" label="注册资本(万)" />
                                    <Field name="regAddr" component={inputField} actions={actions} type="text"  label="注册地址"  maxLength="128"/>
                                    <Field name="fax" component={inputField} actions={actions} type="text" label="传真"  maxLength="32" />
                                    <Field name="returnedPurchaseAddr" component={inputField} className="item-1-2"  actions={actions} type="text" label="退货地址" maxLength="32" style={{width: "395px"}}/>
                                </div>
                            </div>
                            <div className="md-box">
                                <div className="box-mt">
                                    经营范围
                                </div>
                                <div className="box-mc clearfix">
                                    <Field label="经营品种" name="businessCategory" required="required" component={businessCategoryRadioField} changeEven={(e) => {this.businessCategoryChangeEven(e)}} selectedItems={businessCategorySelect} allItems={businessCategoryAllData}/>
                                    <Field label="经营范围" name="businessRange" required="required" component={businessCategoryRadioField} changeEven={(e) => {this.businessRangeChangeEven(e)}} selectedItems={businessRangeDataSelect} allItems={businessRangeAllData}/>
                                </div>
                            </div>
                            <div className="md-box">
                                <div className="box-mt">资质文件</div>
                                <field name=""/>
                                <div className="box-mc clearfix">

                                    <Field name="BUSINESS_LICENSE" component={inputField} type="text" label="营业执照号" required="required" maxLength="32"/>
                                    <Field name="BUSINESS_LICENSETIME" component={inputField} type="text" label="有效期至" inputClassName="form-control datepicker" readOnly="readOnly" required="required" maxLength="32" />
                                    <div className="item">
                                        <p>组织机构代码证号</p>
                                        <input name="ORGANIZATION_CERTIFICATE" type="text" className="certificateInput " maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input type="text" name="ORGANIZATION_CERTIFICATETIME" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>GSP证书号</p>
                                        <input name="GSP_CERTIFICATE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input type="text" name="GSP_CERTIFICATETIME" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>商品经营许可证号</p>
                                        <input name="COMMODITY_LICENSE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="COMMODITY_LICENSETIME" type="text" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>质量协议书号</p>
                                        <input name="QUALITY_AGREEMENT" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="QUALITY_AGREEMENTTIME" type="text"  className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>食品流通许可证号</p>
                                        <input name="FOOD_CIRCULATION_LICENSE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="FOOD_CIRCULATION_LICENSETIME" type="text" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>食品卫生许可证号</p>
                                        <input name="FOOD_HYGIENE_LICENSE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="FOOD_HYGIENE_LICENSETIME" type="text"  className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>保健品卫生许可证号</p>
                                        <input name="HEALTH_PRODUCT_HYGIENE_LICENSE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="HEALTH_PRODUCT_HYGIENE_LICENSETIME" type="text" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>医疗器械许可证号</p>
                                        <input name="MEDIC_DEVICE_MANUFACTURE_PERMISS" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="MEDIC_DEVICE_MANUFACTURE_PERMISSTIME" type="text" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>化妆品经营许可证号</p>
                                        <input name="COSMETICS_BUSINESS_LICENSE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="COSMETICS_BUSINESS_LICENSETIME" type="text" className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>化妆品卫生许可证号</p>
                                        <input name="COSMETICS_HYGIENIC_LICENSE" type="text" className="certificateInput" maxLength="32"/>
                                    </div>
                                    <div className="item">
                                        <p>有效期至</p>
                                        <input name="COSMETICS_HYGIENIC_LICENSETIME" type="text"  className="form-control datepicker certificateInput" readOnly id="" maxLength="32"/>
                                    </div>
                                </div>
                            </div>
                            <div className="md-box" >
                                <div className="box-mt">申请信息</div>
                                <div className="box-mc clearfix">
                                    <Field name="applyMan" id="applyMan" component={inputField} actions={actions} type="text"   maxLength="32" label="申请人"/>
                                    <Field name="applyDateString" component={inputField} actions={actions} type="text"  label="申请日期" inputClassName="form-control datepicker" readOnly="readOnly"/>
                                    <Field name="shopBusinessResponseMan" component={inputField} actions={actions}   maxLength="32"  type="text" label="药店业务负责人"/>
                                    <Field name="shopBusinessResponseManTel" component={inputField} actions={actions}   maxLength="32"  type="text" label="药店业务负责人电话"/>
                                    <Field name="state" id="state" component={stateSelectField} items={stateItems} optionName="code" optionValue="value" label="状态" type="text"/>
                                    <Field name="isFirstCheck" id="isFirstCheck" required="required" component={selectField} event={this.changeIsFirstCheck.bind(this)} items={isFirstCheckItems} optionName="code" optionValue="value" label="首营" type="text"/>
                                    <Field name="submitOpinion" component={inputField} actions={actions} type="text"  label="提交意见" maxLength="128"/>
                                    <Field name="qualityMngSystemEvaluate" component={inputField} actions={actions}   maxLength="128" type="text" label="质量管理体系评价" />
                                    <Field name="remark" component={inputField} actions={actions} type="text" label="备注"  maxLength="128" />
                                    <div className="item"> <p>附件</p>  <a  href="javascript:void(0);" onClick={() => this.onShowFileModal()}  className="gray-btn uploading">上传</a></div>
                                    <div className="item-upload" >
                                        {fileMngs.map((img,index)=>{
                                            if(img.fileTypeCode==="IMAGE"){
                                                return(
                                                    <div key={index} className="upload-operation">
                                                        <img src={img.smallFileUrl}  alt=""/>
                                                        <em onClick={()=>{this.deleteImg(img.sysFileLibId)}}></em>
                                                    </div>

                                                )
                                            }else{
                                                return(
                                                    <div key={index} className="upload-operation">
                                                        <a target="_blank"  href={img.fileUrl}>{img.fileNm}
                                                            <em onClick={()=>{this.deleteImg(img.sysFileLibId)}}></em>
                                                        </a>
                                                    </div>
                                                )
                                            }
                                        })}


                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="layer-footer">
                            <button type="submit" style={{border: "none"}} className="confirm" onClick={() => {this.getSupCerFileDateAndValid()}} disabled={submitting}>{submitting ? <i/> : <i/>} 保存</button>
                            <a href="javascript:void(0);" className="cancel" onClick={() => {this.closeAddForm()}}>取消</a>
                        </div>
                    </div>
                </div>

            </form>
        );

    }
}

SupplierAddForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
};
SupplierAddForm.contextTypes =  {
    store: React.PropTypes.object
};

function mapDispatchToProps(dispatch){
    return bindActionCreators({initValidForm,checkValidForm,asyncErrorValidMessageFunction,changeCommonSupplierDocListState, showFileMgrModalHasCallbackFunc,errorValidMessageFunction}, dispatch);
}
function mapStateToProps(state) {
    return {
        fields: fields,
        initialValues:Object.assign({},state.todos.detailObject,{isFirstCheck:"N",state:"Y"}),
        enableReinitialize:true,
        validate: validate,
        state
    };
}
SupplierAddForm = reduxForm({
    form: "supplierAddForm",
    enableReinitialize: true,
    asyncBlurFields: ['supplierNm'],
    asyncValidate: asyncValidateForSaveOrUpdate
})(SupplierAddForm);

SupplierAddForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(SupplierAddForm);

export default SupplierAddForm