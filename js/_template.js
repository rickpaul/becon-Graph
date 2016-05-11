function _____(_____, _____) {
	$.ajax({
			url:  phpMySQLPrefix+'_____.php',
			data: {
				_____: _____,
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			console.log('PHP Done');
			php_raw_data = data; // DEBUG
			if(data.error){
				// TODO: Handle Error
				console.log('Data Error');
				console.log(data.error);
			} else if(data.results) {
				php_raw_data = data.results; // DEBUG
				// UNIMPLEMENTED
			} else {
				throw new Error('Data Results not recognized');
			}
		})
		.fail(function(error){
			console.log('PHP Fail');
			// TODO: Handle Error
			console.log(error);
			console.log(error.responseText);
		})
	;
}
