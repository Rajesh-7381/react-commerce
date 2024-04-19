
// var inputelement=document.getElementById("billing-name");
// var orginalplaceholder=inputelement.ariaPlaceholder;
// alert(orginalplaceholder)
$(document).ready(function () {
    $(".getPrice").change(function () {
        var size = $(this).val();
        var product_id = $(this).attr("product-id");

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            url: "/get-attribute-price",
            data: { size: size, product_id: product_id },
            type: "POST", // Change to POST request
            success: function (resp) {
                // alert(resp);
                if (resp["discount"] > 0) {
                    // Use backticks (`) for multi-line strings in JavaScript
                    $(".getAttributePrice").html(
                        '<span class="pd-detail__price"> ₹' +
                            resp["final_price"] +
                            "</span>" +
                            '<span class="pd-detail__discount">(' +
                            resp["discount"] +
                            " % OFF)</span>" +
                            '<del class="pd-detail__del">₹' +
                            resp["product_price"] +
                            "</del>"
                    );
                } else {
                    $(".getAttributePrice").html(
                        "<span class='pd-detail__price'> ₹" +
                            resp["final_price"] +
                            "</span>"
                    );
                }
            },
            error: function () {
                alert("error");
            },
        });
    });
    $("#addToCart").submit(function () {
        // alert("test");
        $(".loader").show();
        var formData = $(this).serialize();
        // alert(formData)

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },

            url: "/add-to-cart",
            data: formData,
            type: "post", // Change to POST request
            success: function (resp) {
                $(".loader").hide();
                // alert(resp['message'])
                $(".totalcartitems").html(resp.totalcartitems);
                $('#appendcartitems').html(resp.view);
                $('#appendminicartitems').html(resp.minicartview);

                $(".totalcartitems").html(resp['totalcartitems']);
                if (resp["status"] == true) {
                    $(".print-successs-msg").show();
                    $(".print-successs-msg").delay(2000).fadeOut('slow');
                    $(".print-successs-msg").html(
                        "<div class='successs'>" +
                            "<span class='closebtn' onclick=\"this.parentElement.style.display='none';\">&times;</span>" +
                            resp['message'] +
                        "</div>"
                    );
                } else {
                    // alert(resp['message']);
                    $(".print-err-msg").show();
                    $(".print-err-msg").delay(2000).fadeOut('slow');
                    $(".print-err-msg").html(
                        "<div class='alert'>" +
                            "<span class='closebtn' onclick=\"this.parentElement.style.display='none';\">&times;</span>" +
                            resp['message'] +
                        "</div>"
                    );
                    

                }
            },
            error: function () {
                $(".loader").hide();
                alert("error");
            },
        });
    });

    // update cartitems quantity
    $(document).on('click', '.updatecartitems', function() {
        let new_qty; // Declare new_qty variable
        
        if ($(this).hasClass('fa-plus')) {
            // get quantity
            let quantity = $(this).data('qty');
            // increase the quantity by 1
            new_qty = parseInt(quantity) + 1;
        } else if ($(this).hasClass('fa-minus')) {
            // get quantity
            let quantity = $(this).data('qty');
            // check quantity is at least 1
            if (quantity <= 1) {
                alert("Item quantity should be at least 1!");
                return false;
            }
            // decrease the quantity by 1
            new_qty = parseInt(quantity) - 1;
        }
        
        var cartid = $(this).data('cartid');
        
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            data: { cartid: cartid, qty: new_qty },
            url: '/update-cart-item-qty',
            type: "POST",
            success: function(resp) {
                $(".totalcartitems").html(resp.totalcartitems); //not worked
                if(resp.status==false){
                    
                    alert(resp.message);
                }
                
            },
            error: function() {
                alert("Error!");
            }
        });
    });
    // delete cart item
    $(document).on('click','.deleteCARTitem',function(){
        var cartid=$(this).data('cartid');
        // var result=confirm("Are you sure delete cart item ?");
        
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            data: { cartid: cartid },
            url: '/delete-cart-item',
            type: "POST", // Ensure that the request type is POST
            success: function(resp) {
                $(".totalcartitems").html(resp.totalcartitems);
                $('#appendcartitems').html(resp.view);
                // $('#appendcartitems').html(resp.view);
                $('#appendminicartitems').html(resp.minicartview);
            },
            error: function() {
                alert("Error!");
            }
        });
        
    })

    // empty cart
    $(document).on('click','.emptycart',function(){
        // var cartid=$(this).data('cartid');
        var result=confirm("Are you sure you want to empty cart item ?");
        
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            // data: { cartid: cartid },
            url: '/empty-cart',
            type: "POST", // Ensure that the request type is POST
            success: function(resp) {
                $(".totalcartitems").html(resp.totalcartitems);
                $('#appendcartitems').html(resp.view);
                // $('#appendcartitems').html(resp.view);
                $('#appendminicartitems').html(resp.minicartview);
            },
            error: function() {
                alert("Error!");
            }
        });
        
    })
    // register form validation
    $("#registerForm").submit(function(event) {
        $(".loader").show();
        event.preventDefault(); // Prevent the default form submission
    
        var formData = $("#registerForm").serialize();
    
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            url: '/user/register',
            type: "post",
            data: formData,
            success: function(resp) { // Corrected the parameter name to resp
                if (resp.type == "validation") {
                    $(".loader").hide();
                    $.each(resp.errors, function(i, error) {
                        $("#register-" + i).css({
                            'color': 'red',
                            'display': 'block'
                        }).html(error);
    
                        setTimeout(function() {
                            $("#register-" + i).css({
                                'display': 'none'
                            });
                        }, 5000);
                    });
                } else if (resp.type == "success") {
                    $(".loader").hide();
                    // window.location.replace(resp.redirecturl);
                    $("#register-success").attr('style','color: green');
                    $("#register-success").html(data.message);
                } else {
                    alert("Unknown response type!");
                }
            },
            error: function() {
                $(".loader").hide();
                alert("Error!");
            }
        });
    });
    // login form validation
    $("#loginform").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        var formData = $(this).serialize();
    
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            url: '/user/login',
            type: "post",
            data: formData,
            success: function (resp) {
                if (resp && resp.type) {
                    if (resp.type == "error") {
                        if (resp.errors) {
                            $.each(resp.errors, function (i, error) {
                                $(".login-" + i).attr('style', 'color:red');
                                $(".login-" + i).html(error);
                                setTimeout(function () {
                                    $(".login-" + i).css({
                                        'display': 'none'
                                    });
                                }, 5000);
                            });
                        }
                    } else if (resp.type == "inactive") {
                        $("#login-error").attr('style', 'color: red');
                        $("#login-error").html(resp.message);
                    } else if (resp.type == "incorrect") {
                        $("#login-error").attr('style', 'color: red');
                        $("#login-error").html(resp.message);
                    }
                    else if (resp.type == "success") {
                        // alert(resp.redirectUrl)
                        window.location.href = resp.redirectUrl;
                    }
                } else {
                    console.error("Invalid response format");
                }
            },
            error: function () {
                alert("Error!");
            }
        });
    });

    // forgot form 
    $("#forgotform").submit(function (event) {
        $(".loader").show();
        event.preventDefault(); // Prevent the default form submission
    
        var formData = $(this).serialize();
    
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            url: '/user/forgot-password',
            type: "post",
            data: formData,
            success: function (resp) {
                $(".loader").hide();
                if (resp && resp.type) {
                    if (resp.type == "error") {
                        if (resp.errors) {
                            $.each(resp.errors, function (i, error) {
                                $(".forgot-" + i).attr('style', 'color:red');
                                $(".forgot-" + i).html(error);
                                setTimeout(function () {
                                    $(".forgot-" + i).css({
                                        'display': 'none'
                                    });
                                }, 5000);
                            });
                        }
                    } 
                    else if (resp.type == "success") {
                        $(".forgot-success").attr('style', 'color:green');
                        $(".forgot-success").html(resp.message);
                        // alert(resp.redirectUrl)
                        // window.location.href = resp.redirectUrl;
                    }
                } else {
                    console.error("Invalid response format");
                }
            },
            error: function () {
                $(".loader").hide();
                alert("Error!");
            }
        });
    });
    
    // reset password
    $("#resetpasswordform").submit(function (event) {
        $(".loader").show();
        event.preventDefault(); // Prevent the default form submission
    
        var formData = $(this).serialize();
    
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            url: '/user/reset-password',
            type: "post",
            data: formData,
            success: function (resp) {
                $(".loader").hide();
                if (resp && resp.type) {
                    if (resp.type == "error") {
                        if (resp.errors) {
                            $.each(resp.errors, function (i, error) {
                                $(".forgot-" + i).attr('style', 'color:red');
                                $(".forgot-" + i).html(error);
                                setTimeout(function () {
                                    $(".reset-" + i).css({
                                        'display': 'none'
                                    });
                                }, 5000);
                            });
                        }
                    } 
                    else if (resp.type == "success") {
                        $(".loader").hide();
                        $(".reset-success").attr('style', 'color:green');
                        $(".reset-success").html(resp.message);
                        // alert(resp.redirectUrl)
                        // window.location.href = resp.redirectUrl;
                    }
                } else {
                    console.error("Invalid response format");
                }
            },
            error: function () {
                $(".loader").hide();
                alert("Error!");
            }
        });
    });

     // account form validation
    //  $("#account-success").hide();
     $("#accountform").submit(function(event) {
        $(".loader").show();
        event.preventDefault(); // Prevent the default form submission
    
        var formData = $(this).serialize();
    
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            url: '/user/account',
            type: "post",
            data: formData,
            success: function(resp) {
                if (resp.type == "validation") {
                    $(".loader").hide();
                    $.each(resp.errors, function(i, error) {
                        $("#account-" + i).css({
                            'color': 'red',
                            'display': 'block'
                        }).html(error);
    
                        setTimeout(function() {
                            $("#account-" + i).css({
                                'display': 'none'
                            });
                        }, 5000);
                    });
                } else if (resp.type == "success") {
                    $(".loader").hide();
                    $("#account-success").attr('style', 'color: green; font-size: 24px;');
                    $("#account-success").html('&#10004; ' + resp.message); 
                    setTimeout(function(){
                        $("#account-success").empty();
                    },20000)
                } else {
                    alert("Unknown response type!");
                }
            },
            error: function() {
                $(".loader").hide();
                alert("Error!");
            }
        });
    });

    // user update password
    $("#passwordform").submit(function(event) {
        $(".loader").show();
        event.preventDefault(); // Prevent the default form submission
    
        var formData = $(this).serialize();
    
        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
            },
            url: '/user/update-password',
            type: "post",
            data: formData,
            success: function(resp) {
                if (resp.type == "error") {
                    $(".loader").hide();
                    $.each(resp.errors, function(i, error) {
                        $("#password-" + i).css({
                            'color': 'red',
                            'display': 'block'
                        }).html(error);
    
                        setTimeout(function() {
                            $("#password-" + i).css({
                                'display': 'none'
                            });
                        }, 5000);
                    });
                } else if (resp.type == "incorrect") {
                    $(".loader").hide();
                    $("#password-error").attr('style', 'color: red; font-size: 24px;');
                    $("#password-error").html('&#10008; ' + resp.message); 
                    setTimeout(function(){
                        $("#password-error").empty();
                    },20000)
                } else if (resp.type == "success") {
                    $(".loader").hide();
                    $("#password-success").attr('style', 'color: green; font-size: 24px;');
                    $("#password-success").html('&#10004; ' + resp.message); 
                    setTimeout(function(){
                        $("#password-success").empty();
                    },20000)
                } else {
                    alert("Unknown response type!");
                }
            },
            error: function() {
                $(".loader").hide();
                alert("Error!");
            }
        });
    });
    
});


