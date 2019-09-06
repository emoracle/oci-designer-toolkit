console.log('Loaded Designer Javascript');
/*
 * Define the OKT Designer Constant that will be used across the subsequent Javascript
 */
// Asset name prefix
const display_name_prefix = 'okit-';
// Compartment
const compartment_artifact = 'Compartment';
const compartment_prefix = 'comp';
// Virtual Cloud Network
const virtual_cloud_network_artifact = 'Virtual Cloud Network';
const virtual_cloud_network_prefix = 'vcn';
// Internet Gateway
const internet_gateway_artifact = 'Internet Gateway';
const internet_gateway_prefix = 'ig';
// Route Table
const route_table_artifact = 'Route Table';
const route_table_prefix = 'rt';
// Security List
const security_list_artifact = 'Security List';
const security_list_prefix = 'sl';
// Subnet
const subnet_artifact = 'Subnet';
const subnet_prefix = 'sn';
// Instance
const instance_artifact = 'Instance';
const instance_prefix = 'in';
// Load Balancer
const load_balancer_artifact = 'Load Balancer';
const load_balancer_prefix = 'lb';
// Block Storage
const block_storage_volume_artifact = 'Block Storage Volume';
const block_storage_volume_prefix = 'bsv';
// SVG Icons
const icon_width = 45;
const icon_height = 45;
const icon_x = 25;
const icon_y = 25;
const icon_translate_x_start = 60;
const icon_translate_y_start = 10;
const vcn_icon_spacing = 10;
const icon_stroke_colour = "#F80000";

/*
 * Define designer working variables
 */
// OKIT Json
let OKITJsonObj = {"compartments": [{id: 'okit-comp-' + uuidv4(), name: 'Wizards'}]};
// Common okit id to name mapping
let okitIdsJsonObj = {};
// Query Request only set to a value when designer called from query
let okitQueryRequestJson = null;

/*
 * Define Common Functions
 */
function generateDefaultName(prefix, count) {
    return display_name_prefix + prefix + ('000' + count).slice(-3);
}

function displayOkitJson() {
    $('#okitjson').html(JSON.stringify(OKITJsonObj, null, 2));
    //console.log(JSON.stringify(OKITJsonObj, null, 2));
}

function generateConnectorId(sourceid, destinationid) {
    return sourceid + '-' + destinationid;
}

/*
** New File functionality
 */

function handleNew(evt) {
    // newDiagram();
    window.location = 'designer';
}

function newDiagram() {
    console.log('Creating New Diagram');
    OKITJsonObj = {};
    okitIdsJsonObj = {};
    clearSVG();
    //addCompartment();
    document.getElementById('file-add-menu-item').click();
}

function clearTabs() {
    $('#canvas-wrapper').empty();
    d3.select('#canvas-wrapper').append('div')
        .attr("id", "compartment-tabs")
        .attr("class", "tab");
}

function clearSVG() {
    console.log('Clearing Diagram');
    //$('#okitcanvas').empty();
    // Tabs
    clearTabs();
    // Compartments
    clearCompartmentVariables();
    // Virtual Cloud Network
    clearVirtualCloudNetworkVariables();
    // Internet Gateway
    clearInternetGatewayVariables();
    // Route Table
    clearRouteTableVariables();
    // Security List
    clearSecurityListVariables();
    // Subnet
    clearSubnetVariables();
    // Load Balancer
    clearLoadBalancerVariables();
    // Instance
    clearInstanceVariables();
    // Block Storage Volume
    clearBlockStorageVolumeVariables();
}

/*
** Load file
 */

function getAsJson(readFile) {
    let reader = new FileReader();
    reader.onload = loaded;
    reader.onerror = errorHandler;
    reader.readAsText(readFile);
}

function loaded(evt) {
    // Obtain the read file data
    let fileString = evt.target.result;
    console.log('Loaded: ' + fileString);
    OKITJsonObj = JSON.parse(fileString);
    displayOkitJson();
    drawSVGforJson();
}

function drawSVGforJson() {
    console.log('******** Drawing SVG *********');
    displayOkitJson();
    // Clear existing
    clearSVG();

    // Draw Outer SVG
    if (OKITJsonObj.hasOwnProperty('compartments')) {
        compartment_ids = [];
        for (let i = 0; i < OKITJsonObj['compartments'].length; i++) {
            compartment_ids.push(OKITJsonObj['compartments'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['compartments'][i]['id']] = OKITJsonObj['compartments'][i]['name']
            compartment_count += 1;
            drawCompartmentSVG(OKITJsonObj['compartments'][i]);
        }
    }

    // Draw Compartment Subcomponents
    if (OKITJsonObj.hasOwnProperty('virtual_cloud_networks')) {
        virtual_network_ids = [];
        for (let i=0; i < OKITJsonObj['virtual_cloud_networks'].length; i++) {
            virtual_network_ids.push(OKITJsonObj['virtual_cloud_networks'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['virtual_cloud_networks'][i]['id']] = OKITJsonObj['virtual_cloud_networks'][i]['display_name'];
            virtual_cloud_network_count += 1;
            drawVirtualCloudNetworkSVG(OKITJsonObj['virtual_cloud_networks'][i]);
        }
    }
    if (OKITJsonObj.hasOwnProperty('block_storage_volumes')) {
        block_storage_volume_ids = [];
        for (let i=0; i < OKITJsonObj['block_storage_volumes'].length; i++) {
            block_storage_volume_ids.push(OKITJsonObj['block_storage_volumes'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['block_storage_volumes'][i]['id']] = OKITJsonObj['block_storage_volumes'][i]['display_name'];
            block_storage_volume_count += 1;
            drawBlockStorageVolumeSVG(OKITJsonObj['block_storage_volumes'][i]);
        }
    }

    // Draw Virtual Cloud Network Subcomponents
    if (OKITJsonObj.hasOwnProperty('internet_gateways')) {
        internet_gateway_ids = [];
        for (let i=0; i < OKITJsonObj['internet_gateways'].length; i++) {
            internet_gateway_ids.push(OKITJsonObj['internet_gateways'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['internet_gateways'][i]['id']] = OKITJsonObj['internet_gateways'][i]['display_name'];
            internet_gateway_count += 1;
            drawInternetGatewaySVG(OKITJsonObj['internet_gateways'][i]);
        }
    }
    if (OKITJsonObj.hasOwnProperty('route_tables')) {
        route_table_ids = [];
        for (let i=0; i < OKITJsonObj['route_tables'].length; i++) {
            route_table_ids.push(OKITJsonObj['route_tables'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['route_tables'][i]['id']] = OKITJsonObj['route_tables'][i]['display_name'];
            route_table_count += 1;
            drawRouteTableSVG(OKITJsonObj['route_tables'][i]);
        }
    }
    if (OKITJsonObj.hasOwnProperty('security_lists')) {
        security_list_ids = [];
        for (let i=0; i < OKITJsonObj['security_lists'].length; i++) {
            security_list_ids.push(OKITJsonObj['security_lists'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['security_lists'][i]['id']] = OKITJsonObj['security_lists'][i]['display_name'];
            security_list_count += 1;
            drawSecurityListSVG(OKITJsonObj['security_lists'][i]);
        }
    }
    if (OKITJsonObj.hasOwnProperty('subnets')) {
        subnet_ids = [];
        for (let i=0; i < OKITJsonObj['subnets'].length; i++) {
            subnet_ids.push(OKITJsonObj['subnets'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['subnets'][i]['id']] = OKITJsonObj['subnets'][i]['display_name'];
            initialiseSubnetChildData(OKITJsonObj['subnets'][i]['id']);
            subnet_count += 1;
            drawSubnetSVG(OKITJsonObj['subnets'][i]);
            drawSubnetConnectorsSVG(OKITJsonObj['subnets'][i]);
        }
    }

    // Draw Subnet Subcomponents
    if (OKITJsonObj.hasOwnProperty('instances')) {
        instance_ids = [];
        for (let i=0; i < OKITJsonObj['instances'].length; i++) {
            instance_ids.push(OKITJsonObj['instances'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['instances'][i]['id']] = OKITJsonObj['instances'][i]['display_name'];
            instance_count += 1;
            drawInstanceSVG(OKITJsonObj['instances'][i]);
            drawInstanceConnectorsSVG(OKITJsonObj['instances'][i]);
        }
    }
    if (OKITJsonObj.hasOwnProperty('load_balancers')) {
        load_balancer_ids = [];
        for (let i=0; i < OKITJsonObj['load_balancers'].length; i++) {
            load_balancer_ids.push(OKITJsonObj['load_balancers'][i]['id']);
            okitIdsJsonObj[OKITJsonObj['load_balancers'][i]['id']] = OKITJsonObj['load_balancers'][i]['display_name'];
            load_balancer_count += 1;
            drawLoadBalancerSVG(OKITJsonObj['load_balancers'][i]);
            drawLoadBalancerConnectorsSVG(OKITJsonObj['load_balancers'][i]);
        }
    }
}

function errorHandler(evt) {
    console.log('Error: ' + evt.target.error.name);
}

function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object
    getAsJson(files[0]);
}

function handleLoadClick(evt) {
    hideNavMenu();
    let fileinput = document.getElementById("files");
    fileinput.click();
}

/*
** Reload / Redraw functionality
 */

function handleRedraw(evt) {
    redrawSVGCanvas();
    return false;
}

function handleResize(evt) {
    redrawSVGCanvas();
    return false;
}

function redrawSVGCanvas() {
    hideNavMenu();
    //clearSVG();
    drawSVGforJson();
}

/*
** Save file
 */

function handleSave(evt) {
    hideNavMenu();
    saveJson(JSON.stringify(OKITJsonObj, null, 2), "okit.json");
}

function saveJson(text, filename){
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
}

/*
** Add Compartment file
 */

function handleAdd(evt) {
    hideNavMenu();
    addCompartment();
}

/*
** Export SVG
 */

function handleExportToSVG(evt) {
    hideNavMenu();
    saveSvg(okitcanvas, 'okit.svg')
}

function saveSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let svgData = svgEl.outerHTML;
    let preface = '<?xml version="1.0" standalone="no"?>\r\n';
    let svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/*
** Query OCI Ajax Calls to allow async svg build
 */

function showQueryProgress() {
    let element = document.getElementById("query-progress");
    element.classList.toggle("hidden");
    element.style.top =  d3.event.clientY + 'px';
    element.style.left = d3.event.clientX + 'px';
}

function hideQueryProgressIfComplete() {
    let cnt = $('#query-progress input:checkbox:not(:checked)').length
    console.log('>>>>>>> Unhecked Count : ' + cnt);
    if (cnt == 0) {
        unsetBusyIcon();
        $('#query-progress').toggleClass('hidden');
    }
}

function queryCompartmentAjax() {
    console.log('------------- queryCompartmentAjax --------------------');
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/Compartment',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(okitQueryRequestJson),
        success: function(resp) {
            let response_json = [JSON.parse(resp)];
            OKITJsonObj['compartments'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('queryCompartmentAjax : ' + response_json[i]['name']);
                queryVirtualCloudNetworkAjax(response_json[i]['id']);
            }
            redrawSVGCanvas();
            $('#compartment-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function queryVirtualCloudNetworkAjax(compartment_id) {
    console.log('------------- queryVirtualCloudNetworkAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    if ('virtual_cloud_network_filter' in okitQueryRequestJson) {
        request_json['virtual_cloud_network_filter'] = okitQueryRequestJson['virtual_cloud_network_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/VirtualCloudNetwork',
        dataType: 'text',
        contentType: 'application/json',
        //data: JSON.stringify(okitQueryRequestJson),
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['virtual_cloud_networks'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('queryVirtualCloudNetworkAjax : ' + response_json[i]['display_name']);
                queryInternetGatewayAjax(compartment_id, response_json[i]['id']);
                queryRouteTableAjax(compartment_id, response_json[i]['id']);
                querySecurityListAjax(compartment_id, response_json[i]['id']);
                querySubnetAjax(compartment_id, response_json[i]['id']);
            }
            redrawSVGCanvas();
            $('#vcn-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function queryInternetGatewayAjax(compartment_id, vcn_id) {
    console.log('------------- queryInternetGatewayAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    request_json['vcn_id'] = vcn_id;
    if ('internet_gateway_filter' in okitQueryRequestJson) {
        request_json['internet_gateway_filter'] = okitQueryRequestJson['internet_gateway_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/InternetGateway',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['internet_gateways'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('queryInternetGatewayAjax : ' + response_json[i]['display_name']);
            }
            redrawSVGCanvas();
            $('#internet-gateway-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function queryRouteTableAjax(compartment_id, vcn_id) {
    console.log('------------- queryRouteTableAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    request_json['vcn_id'] = vcn_id;
    if ('route_table_filter' in okitQueryRequestJson) {
        request_json['route_table_filter'] = okitQueryRequestJson['route_table_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/RouteTable',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['route_tables'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('queryRouteTableAjax : ' + response_json[i]['display_name']);
            }
            redrawSVGCanvas();
            $('#route-table-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function querySecurityListAjax(compartment_id, vcn_id) {
    console.log('------------- querySecurityListAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    request_json['vcn_id'] = vcn_id;
    if ('security_list_filter' in okitQueryRequestJson) {
        request_json['security_list_filter'] = okitQueryRequestJson['security_list_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/SecurityList',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['security_lists'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('querySecurityListAjax : ' + response_json[i]['display_name']);
            }
            redrawSVGCanvas();
            $('#security-list-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function querySubnetAjax(compartment_id, vcn_id) {
    console.log('------------- querySubnetAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    request_json['vcn_id'] = vcn_id;
    if ('subnet_filter' in okitQueryRequestJson) {
        request_json['subnet_filter'] = okitQueryRequestJson['subnet_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/Subnet',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['subnets'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('querySubnetAjax : ' + response_json[i]['display_name']);
                queryInstanceAjax(compartment_id, response_json[i]['id']);
                queryLoadBalancerAjax(compartment_id, response_json[i]['id']);
            }
            redrawSVGCanvas();
            $('#subnet-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function queryInstanceAjax(compartment_id, subnet_id) {
    console.log('------------- queryInstanceAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    request_json['subnet_id'] = subnet_id;
    if ('instance_filter' in okitQueryRequestJson) {
        request_json['instance_filter'] = okitQueryRequestJson['instance_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/Instance',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['instances'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('queryInstanceAjax : ' + response_json[i]['display_name']);
            }
            redrawSVGCanvas();
            $('#instance-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function queryLoadBalancerAjax(compartment_id, subnet_id) {
    console.log('------------- queryLoadBalancerAjax --------------------');
    let request_json = {};
    request_json['compartment_id'] = compartment_id;
    request_json['subnet_id'] = subnet_id;
    if ('load_balancer_filter' in okitQueryRequestJson) {
        request_json['load_balancer_filter'] = okitQueryRequestJson['load_balancer_filter'];
    }
    $.ajax({
        type: 'get',
        url: 'oci/artifacts/LoadBalancer',
        dataType: 'text',
        contentType: 'application/json',
        data: JSON.stringify(request_json),
        success: function(resp) {
            let response_json = JSON.parse(resp);
            OKITJsonObj['load_balancers'] = response_json;
            let len =  response_json.length;
            for(let i=0;i<len;i++ ){
                console.log('queryLoadBalancerAjax : ' + response_json[i]['display_name']);
            }
            redrawSVGCanvas();
            $('#load-balancer-query-cb').prop('checked', true);
            hideQueryProgressIfComplete();
        },
        error: function(xhr, status, error) {
            console.log('Status : '+ status)
            console.log('Error : '+ error)
        }
    });
}


function openCompartment(compartment_id) {
    // Clear All
    $('.tabcontent').hide();
    $('.tablinks').removeClass('active');
    // Add to selected
    $('#' + compartment_id + '-tab-button').addClass('active');
    $('#' + compartment_id + '-tab-content').show();
}


const ro = new ResizeObserver(entries => {
    //for (let entry of entries) {
    //    entry.target.style.borderRadius = Math.max(0, 250 - entry.contentRect.width) + 'px';
    //}
    redrawSVGCanvas();
});

$(document).ready(function(){
    /*
    ** Add handler functionality
     */
    console.log('Adding Designer Handlers');

    /*
    ** Drag start for all pallet icons
     */
    let palatteicons = document.querySelectorAll('#icon-palette .palette-icon');
    [].forEach.call(palatteicons, function (palatteicon) {
        palatteicon.addEventListener('dragstart', handleDragStart, false);
    });

    /*
    ** Handle drop functionality for canvas
     */
    /*
    let okitcanvas = document.getElementById('okitcanvas');
    okitcanvas.addEventListener('dragenter', handleDragEnter, false)
    okitcanvas.addEventListener('dragover', handleDragOver, false);
    okitcanvas.addEventListener('dragleave', handleDragLeave, false);
    okitcanvas.addEventListener('drop', handleDrop, false);
    okitcanvas.addEventListener('dragend', handleDragEnd, false);

    // Set SVG Attributes
    d3.select('#okitcanvas')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', '100%');
    */

    /*
    ** Add button handlers
     */
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    /*
    ** Add Menu Item handlers
     */

    // File Menu

    document.getElementById('file-load-menu-item').addEventListener('click', handleLoadClick, false);

    document.getElementById('file-save-menu-item').addEventListener('click', handleSave, false);

    // Canvas Menu
    document.getElementById('file-add-menu-item').addEventListener('click', handleAdd, false);

    document.getElementById('file-redraw-menu-item').addEventListener('click', handleRedraw, false);

    // Export Menu

    document.getElementById('file-export-svg-menu-item').addEventListener('click', handleExportToSVG, false);

    document.getElementById('file-export-rm-menu-item').addEventListener('click', handleExportToResourceManager, false);

    // Generate Menu
    document.getElementById('generate-terraform-menu-item').addEventListener('click', handleGenerateTerraform, false);

    document.getElementById('generate-ansible-menu-item').addEventListener('click', handleGenerateAnsible, false);

    document.getElementById('generate-resource-manager-menu-item').addEventListener('click', handleGenerateTerraform11, false);

    // Set Redraw when window resized
    window.addEventListener("resize", handleResize, false);

    /*
    ** Set Empty Properties Sheet
     */

    $("#properties").load("propertysheets/empty.html");

    // Remove Busy Icon if set
    unsetBusyIcon();
    /*
    ** Clean and start new diagram
     */

    let compartment_id = addCompartment();

    if (okitQueryRequestJson == null) {
        newDiagram();
    } else {
        setBusyIcon();
        clearSVG();
        $('#query-progress').removeClass('hidden');
        queryCompartmentAjax();
    }

    $('input[type=radio][name=source-properties]').change(function() {
        if (this.value == 'source') {
        }
        else if (this.value == 'properties') {
        }
        $("#json-display").slideToggle();
        $("#json-display").removeClass('hidden');
        $("#properties").slideToggle();
    });

    $("#json-display").slideToggle();

    // Only observe the canvas
    ro.observe(document.querySelector('#canvas-wrapper'));

});

