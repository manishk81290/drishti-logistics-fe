$(document).ready(function() {

    if (window.location.pathname.replace('/drishti-logistics/', '') === 'logisticsinfo.html') { //DEV
        validateUser();
    }

    if (window.location.pathname.replace('/drishti-logistics/', '') === 'updateStatus.html') { //DEV
        validateUser();
    }

    // if (window.location.pathname.replace('/', '') === 'tracking.html') { //PROD
    //     validateUser();
    // }

    // if (window.location.pathname.replace('/', '') === 'updateStatus.html') { //PROD
    //     validateUser();
    // }



    //Get Quotation for Shipment
    $('#getQuote').on('click', function() {
        var quoteRequest = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            weight: $('#weight').val(),
            pickup: $('#pickup').val(),
            drop: $('#drop').val(),
            dimension: $('#dimension').val()
        };

        if (quoteRequest.name === '') {
            $('.name-val').text('*Please enter your name*');
        } else {
            if (quoteRequest.email === '') {
                $('.name-val').text('');
                $('.email-val').text('*Please enter your email*');
            } else {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(quoteRequest.email)) {
                    $('.loader').show();
                    $('.validation-text').text('');
                    $.ajax({
                        type: "POST",
                        //url: "http://localhost:49417/communication/sendemail",  //DEV
                        url: "http://api.drishtilogistics.com/communication/sendemail", //PROD
                        dataType: "json",
                        data: quoteRequest,
                        success: function(result) {
                            if (result.status === '200' && result.message === 'Success') {
                                $('.loader').hide();
                                $('.overlay-container').fadeIn(1000);
                            }
                        },
                        error: function(error) {
                            $('.loader').hide();
                            $('.error-txt').text('FAILURE! Something went wrong, please try again.');
                            console.log(error);
                        }
                    });
                } else {
                    $('.email-val').text('*Please enter valid Email Address*');
                }
            }
        }
        console.log(quoteRequest);
    });

    //Get Tracking Information
    $('#getTrackingInfo').on('click', function() {
        $('.tracking-container').hide();
        var trackingNumber = $('#trackingNumber').val();
        if (trackingNumber === '') {
            $('.trackingNumber-val').text('*Please enter Tracking Number*');
        } else {
            $('.loader').show();
            $.ajax({
                type: "POST",
                url: "http://localhost:49417/tracking/gettrackinginfo", //DEV
                //url: "http://api.drishtilogistics.com/tracking/gettrackinginfo", //PROD
                dataType: "json",
                data: { trackingnumber: trackingNumber },
                success: function(result) {
                    if (result.status === '200' && result.message === 'Success') {
                        $('.loader').hide();
                        //$('.overlay-container').fadeIn(1000);

                        let trackingData = JSON.parse(result.trackingData);
                        console.log(trackingData.length);
                        if (trackingData.length > 0) {
                            if (trackingData[0].trackingstatus === "Placed") {
                                clearPreviousActive();
                                activeBulletText(trackingData[0].trackingstatus.replace(/ /g, ''));
                            }
                            if (trackingData[0].trackingstatus === "Shipped") {
                                clearPreviousActive();
                                activeBulletText("Placed");
                                activeBulletText(trackingData[0].trackingstatus.replace(/ /g, ''));
                            }
                            if (trackingData[0].trackingstatus === "On the way") {
                                clearPreviousActive();
                                activeBulletText("Placed");
                                activeBulletText("Shipped");
                                activeBulletText(trackingData[0].trackingstatus.replace(/ /g, ''));
                            }
                            if (trackingData[0].trackingstatus === "Out for Delivery") {
                                clearPreviousActive();
                                activeBulletText("Placed");
                                activeBulletText("Shipped");
                                activeBulletText("On the way".replace(/ /g, ''));
                                activeBulletText(trackingData[0].trackingstatus.replace(/ /g, ''));
                            }
                            if (trackingData[0].trackingstatus === "Delivered") {
                                clearPreviousActive();
                                activeBulletText("Placed");
                                activeBulletText("Shipped");
                                activeBulletText("On the way".replace(/ /g, ''));
                                activeBulletText("Out for Delivery".replace(/ /g, ''));
                                activeBulletText(trackingData[0].trackingstatus.replace(/ /g, ''));
                            }
                            $('#shippedfrom').text(trackingData[0].shippmentfrom);
                            $('#shippedto').text(trackingData[0].shippmentto);
                            $('.tracking-container').fadeIn(2000);
                        } else {
                            $('.trackingNumber-val').text('*Incorrect Tracking Number*');
                        }
                    }
                },
                error: function(error) {
                    $('.loader').hide();
                    //$('.error-txt').text('FAILURE! Something went wrong, please try again.');
                    console.log(error);
                }
            });
        }
    });

    //Adding new Shipment Details
    $('#addShipmentDetails').on('click', function() {
        var shipmentDetails = {
            trackingnumber: $('#trackingnumber').val(),
            from: $('#shipmentfrom').val(),
            to: $('#shipmentto').val(),
            username: 'drishtilogistics',
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            weight: $('#weight').val(),
            dimension: $('#dimension').val()
        };

        if (shipmentDetails.trackingnumber === '') {
            $('.trackingnumber-val').text('*Please enter tracking number*');
        } else {
            if (shipmentDetails.name === '') {
                $('.trackingnumber-val').text('');
                $('.name-val').text('*Please enter your name*');
            } else {
                if (shipmentDetails.email === '') {
                    $('.trackingnumber-val').text('');
                    $('.name-val').text('');
                    $('.email-val').text('*Please enter your email*');
                } else {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(shipmentDetails.email) === false) {
                        $('.trackingnumber-val').text('');
                        $('.name-val').text('');
                        $('.email-val').text('*Please enter valid Email Address*');
                    } else {
                        if (shipmentDetails.from === '') {
                            $('.trackingnumber-val').text('');
                            $('.name-val').text('');
                            $('.email-val').text('');
                            $('.shipmentfrom-val').text('*Please enter pickup location*');
                        } else {
                            if (shipmentDetails.to === '') {
                                $('.trackingnumber-val').text('');
                                $('.name-val').text('');
                                $('.email-val').text('');
                                $('.shipmentfrom-val').text('');
                                $('.shipmentto-val').text('*Please enter drop location*');
                            } else {
                                $('.trackingnumber-val').text('');
                                $('.name-val').text('');
                                $('.email-val').text('');
                                $('.shipmentfrom-val').text('');
                                $('.shipmentto-val').text('');
                                $('.loader').show();
                                $.ajax({
                                    type: "POST",
                                    url: "http://localhost:49417/tracking/createnewshipment", //DEV
                                    //url: "http://api.drishtilogistics.com/tracking/createnewshipment", //PROD
                                    dataType: "json",
                                    data: shipmentDetails,
                                    success: function(result) {
                                        if (result.status === '200' && result.message === 'Success') {
                                            $('.loader').hide();
                                            $('.overlay-container').fadeIn(1000);
                                            console.log(result);
                                        }
                                    },
                                    error: function(error) {
                                        $('.loader').hide();
                                        $('.error-txt').text('FAILURE! Something went wrong, please try again.');
                                        console.log(error);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });

    $('#getShipmentDetails').on('click', function() {
        var shipmentDetails = {
            trackingnumber: $('#trackingnumber').val()
        };
        if (shipmentDetails.trackingnumber === '') {
            $('.trackingnumber-val').text('*Please enter tracking number*');
        } else {
            $('.trackingnumber-val').text('');
            $('.loader').show();
            $.ajax({
                type: "POST",
                url: "http://localhost:49417/tracking/getshipmentdetails", //DEV
                //url: "http://api.drishtilogistics.com/tracking/getshipmentdetails", //PROD
                dataType: "json",
                data: shipmentDetails,
                success: function(result) {
                    if (result.status === '200' && result.message === 'Success') {
                        $('.loader').hide();
                        let trackingData = JSON.parse(result.trackingData);
                        console.log(trackingData.length);
                        if (trackingData.length > 0) {
                            $('#shipmentfrom').val(trackingData[0].shippmentfrom);
                            $('#shipmentto').val(trackingData[0].shippmentto);
                            $('#name').val(trackingData[0].name);
                            $('#email').val(trackingData[0].email);
                            $('#phone').val(trackingData[0].phone);
                            $('#weight').val(trackingData[0].weight);
                            $('#dimension').val(trackingData[0].dimension);
                            $('#trackingstatus').val(trackingData[0].trackingstatus);
                            $('#showShippingDetails').show();
                        } else {
                            $('.trackingnumber-val').text('*Invalid Tracking number*');
                        }
                    }
                },
                error: function(error) {
                    $('.loader').hide();
                    $('.error-txt').text('FAILURE! Something went wrong, please try again.');
                    console.log(error);
                }
            });
        }
    })


    $('#updateShipmentDetails').on('click', function() {
        var shipmentDetails = {
            trackingnumber: $('#trackingnumber').val(),
            trackingstatus: $('#trackingstatus').val(),
            username: sessionStorage.user
        };

        if (shipmentDetails.trackingnumber === '') {
            $('.trackingnumber-val').text('*Please enter tracking number*');
        } else {
            if (shipmentDetails.trackingstatus === '0') {
                $('.trackingnumber-val').text('');
                $('.trackingstatus-val').text('*Please select tracking status*');
            } else {
                $('.trackingnumber-val').text('');
                $('.trackingstatus-val').text('');
                $('.loader').show();
                $.ajax({
                    type: "POST",
                    url: "http://localhost:49417/tracking/updateshipment", //DEV
                    //url: "http://api.drishtilogistics.com/tracking/updateshipment", //PROD
                    dataType: "json",
                    data: shipmentDetails,
                    success: function(result) {
                        if (result.status === '200' && result.message === 'Success') {
                            $('.loader').hide();
                            $('.overlay-container').fadeIn(1000);
                            console.log(result);
                        }
                    },
                    error: function(error) {
                        $('.loader').hide();
                        $('.error-txt').text('FAILURE! Something went wrong, please try again.');
                        console.log(error);
                    }
                });
            }
        }
    });


    function clearPreviousActive() {
        $('.point-bullet').removeClass('active');
        $('.text-bullet').removeClass('active');
    }

    function activeBulletText(controlId) {
        $('#' + controlId.toLowerCase() + 'Bullet').addClass('active');
        $('#' + controlId.toLowerCase() + 'Txt').addClass('active');
    }

    $('.overlay-close').on('click', function() {
        $('.overlay-container').fadeOut(1000);
        $('#name').val('');
        $('#email').val('');
        $('#phone').val('');
        $('#weight').val('');
        $('#pickup').val('');
        $('#drop').val('');
        $('#dimension').val('');
        $('#trackingnumber').val('');
        $('#shipmentfrom').val('');
        $('#shipmentto').val('');
        $('#trackingstatus').val('0');
        $('#showShippingDetails').hide();
    });


    $('#login').on('click', function() {
        var loginDetails = {
            username: $('#username').val(),
            passwordd: $('#passwordd').val()
        };
        if (loginDetails.username === '') {
            $('.error-txt').text('');
            $('.username-val').text('*Please enter username*');
        } else {
            if (loginDetails.passwordd === '') {
                $('.error-txt').text('');
                $('.username-val').text('');
                $('.passwordd-val').text('*Please enter password*');
            } else {
                $('.error-txt').text('');
                $('.username-val').text('');
                $('.passwordd-val').text('');
                loginDetails.passwordd = encodePassword(loginDetails.passwordd);
                $('.loader').show();
                $.ajax({
                    type: "POST",
                    url: "http://localhost:49417/authentication/loginuser", //DEV
                    //url: "http://api.drishtilogistics.com/authentication/loginuser", //PROD
                    dataType: "json",
                    data: loginDetails,
                    success: function(result) {
                        if (result.status === '200' && result.message === 'Success') {
                            $('.loader').hide();
                            //$('.overlay-container').fadeIn(1000);
                            console.log(result);
                            let userData = JSON.parse(result.userData);
                            if (userData.length > 0) {
                                sessionStorage.user = userData[0].username;
                                sessionStorage.sessionState = userData[0].guidcode;
                                window.location.href = "logisticsinfo.html?code=" + userData[0].guidcode;
                            } else {
                                $('.error-txt').text('*Invalid Credentials*');
                            }
                        }
                    },
                    error: function(error) {
                        $('.loader').hide();
                        //$('.error-txt').text('FAILURE! Something went wrong, please try again.');
                        console.log(error);
                    }
                });
            }
        }
    });

    $('#logout').on('click', function() {
        var userData = {
            username: sessionStorage.user,
            code: window.location.search.replace('?code=', '')
        }

        if (userData.code === '' || userData.code === undefined || userData.code === null) {
            sessionStorage.clear();
            window.location.href = "login.html";
        } else {
            if (userData.username === '' || userData.username === undefined || userData.username === null) {
                sessionStorage.clear();
                window.location.href = "login.html";
            } else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:49417/authentication/logout", //DEV
                    //url: "http://api.drishtilogistics.com/authentication/logout", //PROD
                    dataType: "json",
                    data: userData,
                    success: function(result) {
                        if (result.status === '200' && result.message === 'Success') {
                            console.log(result);
                            if (result.loggedOut === true) {
                                sessionStorage.clear();
                                window.location.href = "login.html";
                            }
                        }
                    },
                    error: function(error) {
                        alert('Something went wrong. Please try again!');
                        console.log(error);
                        sessionStorage.clear();
                        window.location.href = "login.html";
                    }
                });
            }
        }
    });


    function encodePassword(input) {
        var hashedInput = sha512(input)
        return hashedInput;
    }


    function validateUser() {
        //if code not found
        var userData = {
            username: sessionStorage.user,
            code: window.location.search.replace('?code=', '')
        }
        if (userData.code === '' || userData.code === undefined || userData.code === null) {
            sessionStorage.clear();
            window.location.href = "login.html";
        } else {
            if (userData.username === '' || userData.username === undefined || userData.username === null) {
                sessionStorage.clear();
                window.location.href = "login.html";
            } else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost:49417/authentication/validateuser", //DEV
                    //url: "http://api.drishtilogistics.com/authentication/validateuser", //PROD
                    dataType: "json",
                    data: userData,
                    success: function(result) {
                        if (result.status === '200' && result.message === 'Success') {
                            if (result.isUserValid === false) {
                                sessionStorage.clear();
                                window.location.href = "login.html";
                            } else {
                                $('#createNewShipment').attr('href', 'logisticsinfo.html?code=' + userData.code);
                                $('#updateShipment').attr('href', 'updateStatus.html?code=' + userData.code);
                            }
                        }
                    },
                    error: function(error) {
                        alert('Something went wrong. Please try again!');
                        console.log(error);
                        sessionStorage.clear();
                        window.location.href = "login.html";
                    }
                });
            }
        }
    }

});