$( document ).ready(function() {
	$('.js-code').focus(function() {
        console.log('focused!');
        $(this).select();
    });
    $('.js-days').change(function() {
    	if($(this).val() == 1) {
    		$('.js-code').html('<iframe src="http://146.185.143.61:1313/widget/587b9679c11bf61c3960d089/" width="212" height="80"></iframe>');
    	} else if($(this).val() == 3) {
    		$('.js-code').html('<iframe src="http://146.185.143.61:1313/widget/587b9679c11bf61c3960d089/" width="550" height="112"></iframe>');
    	} else if($(this).val() == 7) {
    		$('.js-code').html('<iframe src="http://146.185.143.61:1313/widget/587b9679c11bf61c3960d089/" width="700" height="90"></iframe>');
    	}
    })
});