$(document).ready(function(){
    var maxField = 10;
    var addButton = $('.add_button');
    var wrapper = $('.field_wrapper');
    var fieldIndex = 1;

    $(addButton).click(function(){
        if(fieldIndex < maxField){
            var fieldHTML = '<div><input type="text" name="size[]" style="width: 120px" placeholder="size" >&nbsp;<input type="text" name="sku[]" style="width: 120px" placeholder="sku" >&nbsp;<input type="text" name="price[]" style="width: 120px" placeholder="price">&nbsp;<input type="text" name="stock[]" style="width: 120px" placeholder="stock"><a href="javascript:void(0);" class="remove_button">Remove</a></div>';
            
            wrapper.append(fieldHTML);
            fieldIndex++;
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Limit Reached',
                text: 'A maximum of '+maxField+' fields are allowed to be added.',
            });
        }
    });

    $(wrapper).on('click', '.remove_button', function(e){
        e.preventDefault();
        $(this).parent('div').remove();
        fieldIndex--;
    });
    
});
