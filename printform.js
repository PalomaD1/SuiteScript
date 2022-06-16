/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @author Paloma D'Silva
 */

define(['N/render', 'N/error', 'N/config', 'N/record', 'N/search'],

    function (render, error, config, record, search) {

        /**
         * 
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {

            var request = context.request;
            var response = context.response;
            var requestparam = context.request.parameters;
            var recId = requestparam.recId;
            var recType = requestparam.recType;

            var item_fulfillment_record = record.load({
                type: record.Type.ITEM_FULFILLMENT,
                id: recId
            });

            var item_description_arr = []

            var item_tariff_arr = []

            var item_id_arr = []

            var item_origin_criterion_arr = []

            var countryOfOrigin_arr = []

            var itemQty_shipped_arr = []

            var item_units_arr = []

            var item_rate_arr = []

            var itemAmount_arr = []

            var item_int_arr = []

            var country_of_manufacture_arr = []


            var objFieldLookUp = search.lookupFields(
                {
                    type: 'itemfulfillment',
                    id: recId,
                    columns:
                        [
                            'shipaddress1', 'shipcity', 'shipaddressee'
                        ]
                });

            var ship_city = objFieldLookUp["shipcity"];

            var ship_company=objFieldLookUp["shipaddressee"];

            ship_company=ship_company.toString();

            ship_company = ship_company.replace('&','&amp;');

            var ship_street_address = objFieldLookUp["shipaddress1"];

            ship_street_address = ship_street_address.toString();

            ship_street_address = ship_street_address.replace('&','&amp;');

            var ship_state = item_fulfillment_record.getValue({ fieldId: 'shipstate' });

            var ship_zip = item_fulfillment_record.getValue({ fieldId: 'shipzip' });

            var companyPhone = "(1-514-673-0244)";

            var ship_country = item_fulfillment_record.getText({ fieldId: 'shipcountry' });

            if (ship_country == "US") {
                ship_country = "United States";
            } else if (ship_country == "CA") {
                ship_country = "Canada";
            } else if (ship_country == "MX") {
                ship_country = "Mexico";
            }

            var trandate = item_fulfillment_record.getValue({ fieldId: 'trandate' });

            trandate = trandate.toString();

            trandate = trandate.slice(4, 10) + ", " + trandate.slice(11, 15);

            var customerID = item_fulfillment_record.getValue({ fieldId: 'entity' });

            var custRec = record.load({
                type: record.Type.CUSTOMER,
                id: customerID
            });

            var custName = custRec.getValue({ fieldId: 'companyname' });

            custName = custName.toString();

            
           custName = custName.replace('&','&amp;');

        



                var custPhone = custRec.getValue({ fieldId: 'phone' });

                var custEmail = custRec.getValue({ fieldId: 'email' });

                var custTaxRegNo = custRec.getValue({ fieldId: 'vatregnumber' });

                var item_lineCount = item_fulfillment_record.getLineCount({ sublistId: 'item' });

                //load only the first item
                for (var i = 0; i < 1; i++) {

                    var first_item_id = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: 0
                    });

                    var first_itemType = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: 0
                    });

                    switch (first_itemType) {
                        case 'InvtPart':
                            var first_inventoryitemRec = record.load({
                                type: record.Type.INVENTORY_ITEM,
                                id: first_item_id
                            });

                            var countryofmanufacture = first_inventoryitemRec.getText({ fieldId: 'countryofmanufacture' });

                            country_of_manufacture_arr.push(countryofmanufacture);


                            break;
                        case 'NonInvtPart':
                            //    recordtype = 'noninventoryitem';
                            break;
                        case 'Service':
                            //   recordtype = 'serviceitem';
                            break;
                        case 'Assembly':
                            var first_assemblyitemRec = record.load({
                                type: record.Type.ASSEMBLY_ITEM,
                                id: first_item_id
                            });


                            var countryofmanufacture = first_assemblyitemRec.getText({ fieldId: 'countryofmanufacture' });

                            country_of_manufacture_arr.push(countryofmanufacture);


                            break;

                        case 'GiftCert':
                            //   recordtype = 'giftcertificateitem';
                            break;
                        default:
                    }


                }

                //load all items

                for (var i = 0; i < item_lineCount; i++) {

                    var item_name = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_ava_item',
                        line: i
                    });


                    var item_description = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'description',
                        line: i
                    });

                    item_description = item_description.toString();
                    item_description_substring = item_description.substring(0, 40);

                    item_description_arr.push(item_name + " " + item_description_substring);

                    var item_id = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    item_id_arr.push(item_id);


                    var item_qty = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });

                    itemQty_shipped_arr.push(item_qty);


                    //get item type dynamically

                    var itemType = item_fulfillment_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: i
                    });

                    switch (itemType) {
                        case 'InvtPart':
                            var inventoryitemRec = record.load({
                                type: record.Type.INVENTORY_ITEM,
                                id: item_id
                            });

                            var manufacturer_tariff = inventoryitemRec.getValue({ fieldId: 'manufacturertariff' });

                            item_tariff_arr.push(manufacturer_tariff);

                            var origin_criterion = inventoryitemRec.getValue({ fieldId: 'preferencecriterion' });

                            item_origin_criterion_arr.push(origin_criterion + "\n");

                            var countryOfOrigin = inventoryitemRec.getText({ fieldId: 'countryofmanufacture' });

                            if (countryOfOrigin == 'United States') {
                                countryOfOrigin = 'USA';
                            }

                            countryOfOrigin_arr.push(countryOfOrigin);

                            var item_units = inventoryitemRec.getText({ fieldId: 'saleunit' });

                            item_units_arr.push(item_units);

                            break;
                        case 'NonInvtPart':
                            //    recordtype = 'noninventoryitem';
                            break;
                        case 'Service':
                            //   recordtype = 'serviceitem';
                            break;
                        case 'Assembly':
                            var assemblyitemRec = record.load({
                                type: record.Type.ASSEMBLY_ITEM,
                                id: item_id
                            });

                            var manufacturer_tariff = assemblyitemRec.getValue({ fieldId: 'manufacturertariff' });

                            item_tariff_arr.push(manufacturer_tariff + "\n");

                            var origin_criterion = assemblyitemRec.getValue({ fieldId: 'preferencecriterion' });

                            item_origin_criterion_arr.push(origin_criterion + "\n");

                            var countryOfOrigin = assemblyitemRec.getText({ fieldId: 'countryofmanufacture' });

                            if (countryOfOrigin == 'United States') {
                                countryOfOrigin = 'USA';
                            }

                            countryOfOrigin_arr.push(countryOfOrigin);

                            var item_units = assemblyitemRec.getText({ fieldId: 'saleunit' });

                            item_units_arr.push(item_units);

                            break;

                        case 'GiftCert':
                            //   recordtype = 'giftcertificateitem';
                            break;
                        default:
                    }

                }

                var so_internal_id = item_fulfillment_record.getValue({ fieldId: 'createdfrom' });

                var so_record = record.load({
                    type: record.Type.SALES_ORDER,
                    id: so_internal_id
                });


                for (var i = 0; i < item_id_arr.length; i++) {

                    var linetoFind = so_record.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: item_id_arr[i]
                    });

                    var item_rate = so_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: linetoFind
                    });

                    item_rate = item_rate.toFixed(2);

                    item_rate_arr.push(item_rate);

                    var itemAmt = so_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'amount',
                        line: linetoFind
                    });

                    //     var item_amt_toint=parseInt(itemAmt);

                    //    item_int_arr.push(item_amt_toint);

                    //   itemAmt = itemAmt.toFixed(2);

                    itemAmount_arr.push(itemAmt);


                }

                var totalSum = 0;

                var totalSumArr = []

                //add up all values to get total amt

                for (var i = 0; i < itemAmount_arr.length; i++) {

                    //    itemAmount_arr[i]=parseInt(itemAmount_arr[i]);

                    totalSum += itemAmount_arr[i];

                    totalSumArr.push(totalSum);

                }

                var lastItem = totalSumArr.pop();

                //    lastItem=parseInt(lastItem);

                var subsidiaryId = 13;//hardcoded to CA

                var blanket_period_from = so_record.getValue({ fieldId: 'custbodyblanket_pd_from' });

                var cust_terms = so_record.getText({ fieldId: 'terms' });

                blanket_period_from = blanket_period_from.toString();

                blanket_period_from = blanket_period_from.slice(4, 10) + ", " + blanket_period_from.slice(11, 15);

                var blanket_period_to = so_record.getValue({ fieldId: 'custbodyblanket_pd_to' });

                blanket_period_to = blanket_period_to.toString();

                blanket_period_to = blanket_period_to.slice(4, 10) + ", " + blanket_period_to.slice(11, 15);

                var currency = so_record.getText({ fieldId: 'currency' });

                var freight_Cost = item_fulfillment_record.getValue({ fieldId: 'shippingcost' });

                var freight_cost_int = parseInt(freight_Cost);

                freight_Cost = freight_Cost.toFixed(2);

                var SO_total = so_record.getValue({ fieldId: 'total' });

                var totalCost = lastItem + parseInt(freight_Cost);

                totalCost = totalCost.toFixed(2);

                SO_total = SO_total.toFixed(2);

                var subsidiaryRec = record.load({
                    type: record.Type.SUBSIDIARY,
                    id: subsidiaryId
                });

                var subsidiary_name = subsidiaryRec.getValue({ fieldId: 'name' });

                //load subsidiary
                var subsidiary_objFieldLookUp = search.lookupFields(
                    {
                        type: 'subsidiary',
                        id: subsidiaryId,
                        columns:
                            [
                                'address1', 'city', 'zip'
                            ]
                    });

                var subsidiary_street_address = subsidiary_objFieldLookUp["address1"];

                subsidiary_street_address = subsidiary_street_address.toString();

                subsidiary_street_address = subsidiary_street_address.replace('&','&amp;');
//				var subsidiary_street_address = "9280 Boulevard de l'Acadie"

                var subsidiary_city = subsidiary_objFieldLookUp["city"];

                var subsidiary_zip = subsidiary_objFieldLookUp["zip"];
//          		var subsidiary_zip = "H4N 3C5"
                
                var subsidiary_country = subsidiaryRec.getText('country');

                var subsidiary_state = subsidiaryRec.getText('dropdownstate');

                //SO lookup fields

                var SO_objFieldLookUp = search.lookupFields(
                    {
                        type: 'salesorder',
                        id: so_internal_id,
                        columns:
                            [
                                'billaddressee', 'billaddress1', 'billcity', 'billstate', 'billzip', 'billcountry'
                            ]
                    });

                var bill_to_street_address = SO_objFieldLookUp["billaddress1"];

                var bill_to_addressee = SO_objFieldLookUp["billaddressee"];

                bill_to_addressee = bill_to_addressee.toString();
            
                bill_to_addressee = bill_to_addressee.replace('&','&amp; ');

                var bill_city = SO_objFieldLookUp["billcity"];

                var bill_state = SO_objFieldLookUp["billstate"];

                var bill_zip = SO_objFieldLookUp["billzip"];

                //search to get bill country

                var salesorderSearchObj = search.create({
                    type: "salesorder",
                    filters:
                        [
                            ["type", "anyof", "SalesOrd"],
                            "AND",
                            ["internalid", "anyof", so_internal_id],
                            "AND",
                            ["mainline", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "billcountry", label: "Billing Country" })
                        ]
                });

                var resultSet = salesorderSearchObj.run();

                var bill_country_arr = []

                // var meal_ingredients_arr=[]

                resultSet.each(function (result) {

                    var billing_country = result.getValue(resultSet.columns[0]);

                    if (billing_country == "US") {
                        billing_country = "United States";
                    } else if (billing_country == "CA") {
                        billing_country = "Canada";
                    } else if (billing_country == "MX") {
                        billing_country = "Mexico";
                    }

                    bill_country_arr.push(billing_country);

                    return true;

                });


                //    bill_country=JSON.stringify(bill_country, (["text"])); //[{"text":"United States"}]

                //    bill_country=JSON.parse(bill_country);

                //   var parsed=bill_country.text;

                log.debug("bill country", bill_country_arr);

                var companyInfo = config.load({
                    type: config.Type.COMPANY_INFORMATION
                });

                var companyName = companyInfo.getValue({
                    fieldId: 'companyname'
                });

                var companyAddr = companyInfo.getValue({
                    fieldId: 'mainaddress_text'
                });

                companyAddr = companyAddr.toString();

                companyAddr = companyAddr.replace('&','&amp;');

                var employerId = companyInfo.getValue({
                    fieldId: 'employerid'
                });

                var returnEmail = companyInfo.getValue({
                    fieldId: 'email'
                });

                var companyCountry = companyInfo.getText({ fieldId: 'country' });

                //   var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                /*   xmlStr += "<pdf>";
                   xmlStr += "<head><macrolist><macro id=\"myfooter\"><p align=\"center\"><pagenumber /></p></macro></macrolist></head>";
                   xmlStr += "<body size= \"A4\" footer=\"myfooter\" footer-height=\"0.5in\">";
                   xmlStr +="HELLO";       //Add values(in string format) what you want to show in pdf
                   xmlStr += "</body></pdf>"; */
                var xmlStr = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
                xmlStr += "<pdf>";
                xmlStr += "<head></head>";
                xmlStr += "<body header=\"nlheader\" header-height=\"5%\" footer=\"nlfooter\" footer-height=\"10px\" padding=\"0.5in 0.5in 0.5in 0.5in\" size=\"Letter\">";
                xmlStr += "<table style=\"width: 100%;white-space: nowrap;\"><tr><td align=\"right\"><span style=\"font-size:20px;font-family:Verdana,Geneva,sans-serif;\"><strong>Certificate of Origin</strong> | Certificat d'origine</span></td></tr> <tr><td align=\"right\"><span style=\"font-size:12px;\"><span class=\"number\">Canada/US/Mexico Trade Agreement</span></span></td></tr></table>";
                xmlStr += "<table style=\"width:100%;font-size:11px; margin-top: 10px;\"><tbody><tr><td colspan=\"4\"><br/><p>1. Certifier is/Certificateur est:<b>[ ]Importer/Importateur [X] Exporter/Exportateur [X] Producer/Producteur</b></p></td> </tr>";
                xmlStr += "<tr><td><span style=\"font-size:10px; font-style:bold;\">2. Certifier/Certificateur:</span>" + "<br/><b>" + subsidiary_name + "<br/>" + subsidiary_street_address + "<br/>" + subsidiary_city + " " + subsidiary_state + " " + subsidiary_zip + "<br/>" + subsidiary_country + "</b></td>";
                xmlStr += "<td></td><td><span style=\"font-size:10px;\">3. Exporter/Exportateur:</span><br/>" + "<span style=\"white-space: nowrap;\"><b>" + subsidiary_name + "<br/>" + subsidiary_street_address + "<br/>" + subsidiary_city + " " + subsidiary_state + " " + subsidiary_zip + "<br/>" + subsidiary_country + "</b></span>" + "</td></tr>";
                xmlStr += "<tr><td><span style=\"font-size:10px;\">Telephone:</span><br/><b>(514) 673-0244</b><br/><span style=\"font-size:10px;\"><br/>Tax ID Number:</span><br/>" + "<b>" + employerId + "</b></td><td><span style=\"font-size:10px;\">Email:</span><br/>" + "<b>" + returnEmail + "</b>" + "</td><td><span style=\"font-size:10px;\">Telephone:</span><br/><b>(514) 673-0244</b><br/><span style=\"font-size:10px;\"><br/>Tax ID Number:</span><br/>" + "<b>" + employerId + "</b></td><td><span style=\"font-size:10px;\">Email:</span><br/>" + "<b>" + returnEmail + "</b></td></tr>";
                xmlStr += "<tr><td><span style=\"font-size:10px;\">4. Producer/Producteur:</span><br/>" + "<span style=\"white-space: nowrap;\"><b>" + subsidiary_name + "</b></span>" + "<br/><b>" + subsidiary_street_address + "<br/>" + subsidiary_city + " " + subsidiary_state + " " + subsidiary_zip + "<br/>" + subsidiary_country + "</b></td><td></td><td><span style=\"font-size:10px;\">5. Importer/Importateur:</span><br/><b>" + bill_to_addressee + "<br/>" + bill_to_street_address + "<br/>" + bill_city + "&nbsp;" + bill_state + "&nbsp;" + bill_zip + "&nbsp;" + "<br/>" + bill_country_arr + "</b></td></tr>";
                xmlStr += "<tr><td><span style=\"font-size:10px;\">Telephone:</span><br/><b>(514) 673-0244</b><br/><br/><span style=\"font-size:10px;\">Tax ID Number:</span><br/><b>" + employerId + "</b></td><td><span style=\"font-size:10px;\">Email:</span><br/><b>" + returnEmail + "</b></td><td><span style=\"font-size:10px;\">Telephone:</span><br/><b>" + custPhone + "</b><br/><span style=\"font-size:10px;\"><br/>Tax ID Number:</span><br/><b>" + custTaxRegNo + "</b></td><td><span style=\"font-size:10px;\">Email:</span><br/><b>" + custEmail + "</b></td></tr>";
                xmlStr += "<tr><td  colspan=\"4\">";
                xmlStr += "<table border=\"0\" cellpadding=\"1\" cellspacing=\"1\" style=\"font-size:11px;\"><tr><td style=\"width:60%;\"><span style=\"font-size:10px;\">6a. Description of Goods/Description des marchandises:&nbsp;&nbsp;&nbsp;&nbsp;</span></td><td style=\"width:20%;\"><span style=\"font-size:10px;\">6b.HS Tariff Classification:&nbsp;&nbsp;</span></td><td style=\"width:15%;\"><span style=\"font-size:10px;\">7a. Origin Criterion:&nbsp;&nbsp;</span></td><td style=\"width:15%;\"><span style=\"font-size:10px;white-space: nowrap;\">7b. Country of Origin:&nbsp;&nbsp;</span></td></tr>";

                for (var i = 0; i < item_description_arr.length; i++) {

                    xmlStr += "<tr>";

                    xmlStr += "<td style=\"width:60%;\"><b>" + item_description_arr[i] + "&nbsp;&nbsp;&nbsp;&nbsp;" + "</b></td>" + "<td><b>" + "&nbsp;" + item_tariff_arr[i] + "</b></td>" + "&nbsp;" + "<td><b>" + item_origin_criterion_arr[i] + "</b></td>" + "&nbsp;" + "<td><b>" + countryOfOrigin_arr[i] + "</b></td>";

                    xmlStr += "</tr>";
                }

                xmlStr += "</table>";
                xmlStr += "</td></tr>";
                xmlStr += "<tr><td colspan=\"4\"><span style=\"font-size:10px;\">8. Blanket Period/Periode globale:</span></td></tr>";
                xmlStr += "<tr><td>From/De:" + "<b>" + blanket_period_from + "</b></td><td></td><td>To/À:" + "<b>" + blanket_period_to + "</b></td><td></td></tr>";
                xmlStr += "<tr><td colspan=\"4\"><span style=\"font-size:10px;white-space: nowrap;\" >9. I certify that/J&#39;atteste:<br />The goods described in this document qualify as originating and the information contained in this document is true and accurate. I assume<br />Responsibility for proving such representations and agree to maintain and present upon resquest or to make available during a verification visit,<br />documentation necessary to support this certification. J&rsquo;atteste que les produits d&eacute;crits dans le pr&eacute;sent document sont admissibles &agrave; titre de produits<br />originaires et que les renseignements fournis dans le pr&eacute;sent document sont v&eacute;ridiques et exacts. Il m&rsquo;incombe d&rsquo;en faire la preuve et je conviens de<br />conserver et de produire sur demande ou de rendre accessibles durant une visite de v&eacute;rification les documents n&eacute;cessaires &agrave; l&rsquo;appui du certificat.</span></td></tr>";
                xmlStr += "<tr><td colspan=\"4\"><span style=\"font-size:10px;\">This certification consists of <pagenumber/>&nbsp;page(s), including all attachments.<br />Cette certifification consiste de <pagenumber/>&nbsp;page(s), y compris tous les pi&egrave;ces jointes.</span></td></tr>";
                xmlStr += "<tr><td colspan=\"4\"><span style=\"white-space: nowrap; font-size:10px;\">Certifier&#39;s Signature/Signature du certificateur: ___________________________________________________________________________________________<br /><br />Certifier&#39;s Title/Titre du certificateur: ________________________________&nbsp; Date:&nbsp;" + trandate + "</span></td></tr>";
                xmlStr += "</tbody></table>";
                xmlStr += "<p style=\"page-break-before: always\"></p>";
                xmlStr += "<table><tr><td><span style=\"font-size:20px;\"><span style=\"font-family:Verdana,Geneva,sans-serif;\"><strong>Commercial Invoice</strong> | Facture Commerciale</span></span></td><td align=\"right\" style=\"width: 214px;\"><img src=\"http://6999570-sb1.shop.netsuite.com/core/media/media.nl?id=5076&#38;c=6999570_SB1&#38;h=riaUfKOpWUBDAmINg-U6pP7lE22VI5rQyUTW_UWft8DaL0uQ\" style=\"float: right; width: 150px; height: 60px; margin: 0px;\" /></td></tr></table>";//header table comm invoice
                xmlStr += "<table style=\"width:100%;   white-space: nowrap; font-size:11px; margin-top: 5px;\"><tr>";
                xmlStr += "<th scope=\"col\"><span style=\"font-size:10px;\">Date of Export | Date de l&#39;export</span></th>";
                xmlStr += "<th scope=\"col\" align=\"left\" ><span style=\"font-size:10px;\">Invoice No. | No. de facture</span></th>";
                xmlStr += "<th scope=\"col\"><span style=\"font-size:10px;\">Export References <br/> Renseignements sur l&#39;exp&eacute;dition</span></th>";
                xmlStr += "<th scope=\"col\"><span style=\"font-size:10px;\">Related Parties <br/> Parties li&eacute;es</span></th>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<td><b>" + trandate + "</b></td>";
                xmlStr += "<td></td>";
                xmlStr += "<td><b>" + custName + "</b></td>";
                if (customerID == 6904) {
                    xmlStr += "<td><b>Yes</b></td>";
                } else {
                    xmlStr += "<td><b>No</b></td>";
                }

                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th align=\"left\" style=\"width: 250px;\"><span style=\"font-size:10px;\"><br/>Shipper/Exporter(name and address)<br/> Exp&eacute;diteur/Exportateur (nom et adresse)</span></th>";
                xmlStr += "<th ></th>";
                xmlStr += "<th scope=\"col\" align=\"left\"><span style=\"font-size:10px;\"><br/>Sold to (name and address) <br/> Vendu &agrave; (nom et adresse) </span></th>";
                xmlStr += "<th scope=\"col\" align=\"left\" ><span align=\"left\" style=\"font-size:10px;text-align:left;\"><br/>Tax I.D. Number (Sold to)<br />No. d&#39;identification<br/> aux fins d&#39;imp&ocirc;t (Vendu &agrave;)</span></th>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<td style=\"width: 250px;\"><b>" + subsidiary_name + "<br/>" + subsidiary_street_address + "<br/>" + subsidiary_city + " " + subsidiary_state + " " + subsidiary_zip + "<br/>" + subsidiary_country + "<br/>" + companyPhone + "</b></td>";
                xmlStr += "<td></td>";
                xmlStr += "<td align=\"left\" ><b>" + bill_to_addressee + "<br/>" + bill_to_street_address + "<br/>" + bill_city + " " + bill_state + " " + bill_zip + "<br/>" + bill_country_arr + "</b></td>";
                xmlStr += "<td  align=\"left\"><b>" + custTaxRegNo + "</b></td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th scope=\"col\" style=\"text-align: left;\"><br /><span style=\"font-size:10px;\">Country of Export<br />Pays d&#39;exportation&nbsp;</span></th>";
                xmlStr += "<th scope=\"col\" align=\"left\" style=\"text-align: left;\"><br /><span style=\"font-size:10px;\">Country of Manufacture&nbsp;<br />Pays de fabrication</span></th>";
                xmlStr += "<th scope=\"col\"><br /><span style=\"font-size:10px;\">Ship to (name and address) <br/>  Exp&eacute;dier &agrave; (nom et adresse)</span></th>";
                xmlStr += "<th scope=\"col\" align=\"left\" style=\"text-align: right;\" ><br /><span  align=\"left\" style=\"font-size:10px;text-align: left;\">Tax I.D. Number (Ship to) <br/>  No. d&#39;identification<br />aux fins de l&#39;imp&ocirc;t (Exp&eacute;dier &agrave;)</span></th>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<td><b>" + companyCountry + "</b></td>";
                xmlStr += "<td><b>" + country_of_manufacture_arr + "</b></td>";
                xmlStr += "<td><b>" + ship_company + "<br/>" + ship_street_address + "<br/>" + ship_city + "  " + ship_state + "  " + ship_zip + "<br/>" + ship_country + "</b></td>";
                xmlStr += "<td><b>" + custTaxRegNo + "</b></td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th scope=\"col\"><br/><span style=\"font-size:10px;\">Country of Ultimate Destination<br />Pays de destination finale</span></th>";
                xmlStr += "<th scope=\"col\" align=\"left\" ><br/><span style=\"font-size:10px;\">Terms of Sale<br />Conditions de vente</span></th>";
                xmlStr += "<th scope=\"col\"><br/><span style=\"font-size:10px;\">Importer of record (if other than consignee) <br/>  Importateur enregistre (si diff&eacute;rent du destinataire )</span></th>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<td><strong>" + bill_country_arr + "</strong></td>";
                xmlStr += "<td ><strong>" + cust_terms + "</strong></td>";
                xmlStr += "<td ><strong>" + subsidiary_name + "<br/>" + subsidiary_street_address + "<br/>" + subsidiary_city + " " + subsidiary_state + " " + subsidiary_zip + "<br/>" + subsidiary_country + "<br/>" + companyPhone + "</strong></td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th scope=\"col\"><span style=\"font-size:10px;\">Currency of Sale<br />Devise de la vente</span></th>";
                xmlStr += "<th scope=\"col\" align=\"left\" ><span style=\"font-size:10px;\">International Air Waybill No. <br/>  No. de lettre de transport a&eacute;rien internationale</span></th>";
                xmlStr += "<th scope=\"col\">&nbsp;</th>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<td><strong>" + currency + "</strong></td>";
                xmlStr += "<td>&nbsp;</td>";
                xmlStr += "<td>&nbsp;</td>";
                xmlStr += "<td align=\"right\" style=\"text-align:right;\"><strong><span align=\"right\" style=\"font-size:16px;text-align:right;\">VALUE FOR CUSTOMS ONLY</span></strong></td>";
                xmlStr += "</tr>";
                xmlStr += "</table>";
                xmlStr += "<table border=\"1\" style=\"width:100%;font-size:11px;\">";
                xmlStr += "<tr>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px;\">Marks and numbers, full description of goods <br/> Marques et num&eacute;ros, description de la marchandise</span></th>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Country<br />Pays</span></th>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">HS Tariff<br />HS Tariff</span></th>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Quantity<br />Quantit&eacute;</span></th>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Unit<br />Unit&eacute;</span></th>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Unit value<br />Valeur unit&eacute;</span></th>";
                xmlStr += "<th scope=\"col\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Total value<br />Valeur totale</span></th>";
                xmlStr += "</tr>";
                for (var i = 0; i < item_description_arr.length; i++) {

                    xmlStr += "<tr>";

                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\">" + item_description_arr[i] + "</td>";
                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\">" + countryOfOrigin_arr[i] + "</td>";
                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\">" + item_tariff_arr[i] + "</td>";
                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\">" + itemQty_shipped_arr[i] + "</td>;"
                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\">" + item_units_arr[i] + "</td>;"
                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\">" + item_rate_arr[i] + "</td>;"
                    xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;\"> $" + itemAmount_arr[i].toFixed(2) + "</td>;"

                    xmlStr += "</tr>";

                }
                xmlStr += "</table>";
                xmlStr += "<table border=\"1\" style=\"width:100%;font-size:11px;white-space: nowrap;\">";
                xmlStr += "<tr>";
                xmlStr += "<th style=\" border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; text-align: left;padding: 5px; \"><span style=\"font-size:10px;\">Total Number of Packages | Nombre total de colis</span></th>";
                xmlStr += "<th  style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; text-align: left; padding: 5px;\"><span style=\"font-size:10px;\">Total weight | Poids brut</span></th>";
                xmlStr += "<th style=\"text-align: left;border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px;\">Check one&nbsp;FOB &nbsp;[ ] C&#38;F&nbsp;[ ]CIF&nbsp;[ ] | Cochez une</span></th>";
                xmlStr += "</tr>";
                xmlStr += "</table>";
                xmlStr += "<table border=\"1\" style=\"width:100%;font-size:11px;\">";
                xmlStr += "<tr>";
                xmlStr += "<th rowspan=\"5\" style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px; \"><span style=\"font-size:10px;\">These commodities, technology or software were exported from Canada in accordance with the Export Administration Regulations. Diversion contrary to Canadian law prohibited. It is hereby certified that this invoice shows the actual price of the goods described, that no other invoice has been issued, and that all particulars are true and correct.<br/><br/>Ces marchandises, technologies ou logiciels ont &eacute;t&eacute; export&eacute;s du Canada conform&eacute;ment aux r&egrave;glements administratifs sur l&rsquo;exportation des &Eacute;tats-Unis. Tout agissement contraire &agrave; la loi canadienne est strictement interdit. Je certifie par la pr&eacute;sente que les prix indiqu&eacute;s sur cette facture sont exacts, qu&rsquo;aucune autre facture commerciale n&rsquo;a &eacute;t&eacute; produite et que tous les renseignements fournis sont v&eacute;ridiques.</span></th>";
                xmlStr += "<th style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Packing costs<br />Frais d&#39;emballage</span></th>";
                xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; width:80px;\">&nbsp;</td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Freight costs<br />Frais de transport</span></th>";
                xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;  width:80px;\"> $" + freight_Cost + "</td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px; white-space: nowrap;\">Insurance costs<br />Frais d&#39;assurance</span></th>";
                xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;  width:80px;\">&nbsp;</td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px;\">Other costs<br />Autres Frais</span></th>";
                xmlStr += "<td style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray;  width:80px;\">&nbsp;</td>";
                xmlStr += "</tr>";
                xmlStr += "<tr>";
                xmlStr += "<th style=\"border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; padding: 5px;\"><span style=\"font-size:10px;\">Total Invoice Value<br />Montant total de la facture</span></th>";
                xmlStr += "<td style=\" border-right:1px solid gray; border-top:1px solid gray; border-left:1px solid gray; border-bottom:1px solid gray; text-align: center;  width:80px;\">&nbsp;" + "$" + totalCost + "</td>";
                xmlStr += "</tr>";
                xmlStr += "</table>";
                xmlStr += "______________________________________________________________" + "<span style=\"font-size:11px;\">" + trandate + "</span>";
                xmlStr += "<table cellpadding=\"1\" cellspacing=\"1\" style=\"width:100%; font-size:11px;\">";
                xmlStr += "<tr>";
                xmlStr += "<th scope=\"row\"><span style=\"font-size:10px;\">Signature</span></th>";
                xmlStr += "<th scope=\"col\" ><span style=\"font-size:10px;\"> Title | Titre</span></th >";
                xmlStr += "<th scope=\"col\"><span style=\"font-size:10px;\">Date</span></th>";
                xmlStr += "</tr>";
                xmlStr += "</table>";
                xmlStr += "</body></pdf>";

                var filename = 'AiRoute_Cert_of_Origin.pdf';
                response.setHeader({
                    name: 'Content-disposition',
                    value: 'filename="' + filename + '"',
                });


                response.renderPdf({ xmlString: xmlStr });

            }

            return {
                onRequest: onRequest
            };

        });