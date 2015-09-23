	
	$(document).ready(function() { 
		
		$('#submit').click(function(e) 
		{
			
			// the secret used to create the HMAC is your private API key plus the users password which has been hashed to a particular recipe
			var userName = $('#username').val();
			var userPassword = $('#password').val();
			var userPassPhrase = userName + "SGPasswordSalt" + userPassword;
			// when writing an application, you should store ONLY the hashed version of the user password if you are caching user crediantials for a user.
			// if they change their password, ask them to re-enter it, re-calculate the hash and store the hash

			var hashedUserPassPhrase =  CryptoJS.SHA1(userPassPhrase);

			// The following two keys are generated by Sheep Genetics and you need to apply for them
			// For demo purposes, we have generated a limited pair of keys that have reduced functionality for demonstration purposes
			var secretAppAPIKey = $('#secret_api_key').val();
			var publicAppAPIKey = $('#public_api_key').val();

			// each message is accompanied by the application public key, the user name and a timestamp
			var timeStamp = Math.round(Date.now() / 1000);
			var messageSignature = publicAppAPIKey + userName + timeStamp;
			// Create a HMAC using the secrets
			var hmac = CryptoJS.HmacSHA1(messageSignature,secretAppAPIKey + hashedUserPassPhrase);
			// now we can make a request:
			
			var location = $('#request').val();
			var params = $('#params').val();
			var request = "http://sgsearch.sheepgenetics.org.au/api/1" + location + "?appid=" + publicAppAPIKey + "&userid=" + userName + "&" + "timestamp=" + timeStamp + "&apikey=" + hmac + params;

			//	logging
			$('#log').html('');
			bold('Full Request: ' + request);
			log('location: ' + location);
			log("Timestamp: " + timeStamp);
			log("Message signature: " + messageSignature);
			log("HMAC secret: " + secretAppAPIKey + hashedUserPassPhrase);
			log("Generated Hmac: " + hmac);
			log("<hr/>");
			
			//	perform request
			$('#loader').show();
			$.ajax({
				url: request,
				type: 'get',
				dataType: 'json',
				success: function(result)
				{
					red('<pre>' + JSON.stringify(result, null, 2) + '</pre>');
					$('#loader').hide();
				},
				error: function(result)
				{
					red('An Error Occured<br />' + JSON.stringify(result));
					$('#loader').hide();
				}
			});

/*
			var xmlHttp = null;
			xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", request, false);
			xmlHttp.send( null );
			red(xmlHttp.responseText);
			
			//
		//	text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
			*/
			e.preventDefault();
			return false;
			
		});
			
		$('.existing').change(function() {
			var dataset = $('#dataset').val();
			var analysis = $('#analysis').val();
			var value = $(this).val()
			value = value.replace(/\{dataset\}/g, dataset );
			value = value.replace(/\{analysis\}/g, analysis );
			$($(this).data('target')).val(value);
		});
		
		$('.user').click(function() {
			
			var account = $(this).val();
			$('.account').each(function() {
				
				$(this).val( $(this).data(account) );
				
			});
			
		});
		
	});
	
	
	
	

	    var date_format = 'DD, d MM, yy';
		var short_date_format = 'dd/mm/yy';

		function log( message )
		{
			$('#log').html( $('#log').html() + '<br />' + message );
		}
		
		function bold( message )
		{
			log('<b>' + message + '</b>');
		}
		
		function red( message )
		{
			log('<b style="color: red">' + message + '</b>');
		}
		
		function getDatestamp()
		{
			var d = new Date;
			d = $.datepicker.parseDate(date_format, $('#date').val());
			 var year, month, day;
		        year = String(d.getFullYear());
		        month = String(d.getMonth() + 1);
		        if (month.length == 1) {
		            month = "0" + month;
		        }
		        day = String(d.getDate());
		        if (day.length == 1) {
		            day = "0" + day;
		        }
		        return year + "-" + month + "-" + day;
	
		}
		
		function getTimestamp()
		{
			var d = new Date;
		    return [d.getHours(),
	                d.getMinutes(),
	                d.getSeconds()].join(':');
		}

		function getTime(hour)
        {
            if (hour == 0)
                return '12AM';
            else if (hour > 12)
                return hour - 12 + 'PM';
            else
                return hour + 'AM';
        }
